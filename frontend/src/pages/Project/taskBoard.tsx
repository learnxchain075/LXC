import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import {
  getProjects,
  getTasks,
  updateTaskStatus,
  getSprints,
  assignTaskSprint,
  getWorkflow,
} from '../../services/projectService';

interface Task {
  id: string;
  title: string;
  stage?: { id: string; name: string } | null;
  sprintId?: string | null;
}

const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [sprints, setSprints] = useState<any[]>([]);
  const [columns, setColumns] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    getProjects().then(res => setProjects(res.data || []));
  }, []);

  useEffect(() => {
    if (projectId) {
      getTasks(projectId).then(res => setTasks(res.data || []));
      getSprints(projectId).then(res => setSprints(res.data || []));
      getWorkflow(projectId).then(res => setColumns(res.data?.stages || []));
    }
  }, [projectId]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const dest = result.destination.droppableId;
    const sprintId = dest.startsWith('sprint-') ? dest.replace('sprint-', '') : undefined;
    if (!dest.startsWith('sprint-')) {
      await updateTaskStatus(taskId, { stageId: dest });
    }
    if (sprintId !== undefined) {
      await assignTaskSprint(taskId, { sprintId });
    }
    getTasks(projectId).then(res => setTasks(res.data || []));
  };

  return (
    <div className="page-wrapper">
      <div className="container mt-3">
        <h4>Task Board</h4>
        <select className="form-select mb-3" value={projectId} onChange={e => setProjectId(e.target.value)}>
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="d-flex overflow-auto">
            {columns.map(col => (
              <Droppable droppableId={col.id} key={col.id}>
                {(provided) => (
                  <div
                    className="border rounded p-2 me-2" style={{ minWidth: 250 }}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h6 className="text-center">{col.name}</h6>
                    {tasks.filter(t => t.stage?.id === col.id && !t.sprintId).map((t, idx) => (
                      <Draggable key={t.id} draggableId={t.id} index={idx}>
                        {(p) => (
                          <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} className="mb-2 p-2 bg-light border rounded">
                            {t.title}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
            {sprints.map(s => (
              <Droppable droppableId={`sprint-${s.id}`} key={s.id}>
                {(provided) => (
                  <div
                    className="border rounded p-2 me-2" style={{ minWidth: 250 }}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h6 className="text-center">{s.name}</h6>
                    {tasks.filter(t => t.sprintId === s.id).map((t, idx) => (
                      <Draggable key={t.id} draggableId={t.id} index={idx}>
                        {(p) => (
                          <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} className="mb-2 p-2 bg-light border rounded">
                            {t.title}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default TaskBoard;
