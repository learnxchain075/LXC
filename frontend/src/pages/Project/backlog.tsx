import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { getProjects, getTasks, updateTask, getLabels } from '../../services/projectService';

const priorities = ['HIGH', 'MEDIUM', 'LOW'];

const Backlog = () => {
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [labelId, setLabelId] = useState<string>('');

  useEffect(() => {
    getProjects().then(res => setProjects(res.data || []));
  }, []);

  useEffect(() => {
    if (projectId) {
      getLabels(projectId).then(res => setLabels(res.data || []));
      getTasks({ projectId, label: labelId }).then(res => setTasks(res.data || []));
    }
  }, [projectId, labelId]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const priority = result.destination.droppableId;
    await updateTask(taskId, { priority });
    getTasks({ projectId, label: labelId }).then(res => setTasks(res.data || []));
  };

  return (
    <div className="page-wrapper">
      <div className="container mt-3">
        <h4>Backlog</h4>
        <select className="form-select mb-3" value={projectId} onChange={e => setProjectId(e.target.value)}>
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {projectId && (
          <select className="form-select mb-3" value={labelId} onChange={e => setLabelId(e.target.value)}>
            <option value="">All Labels</option>
            {labels.map((l: any) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        )}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="d-flex overflow-auto">
            {priorities.map(p => (
              <Droppable droppableId={p} key={p}>
                {(provided) => (
                  <div
                    className="border rounded p-2 me-2"
                    style={{ minWidth: 250 }}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h6 className="text-center">{p}</h6>
                    {tasks.filter(t => t.priority === p && !t.sprintId).map((t, idx) => (
                      <Draggable key={t.id} draggableId={t.id} index={idx}>
                        {(pDrag) => (
                          <div
                            ref={pDrag.innerRef}
                            {...pDrag.draggableProps}
                            {...pDrag.dragHandleProps}
                            className="mb-2 p-2 bg-light border rounded"
                          >
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

export default Backlog;
