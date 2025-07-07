import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { getProjects, getTasks, getSprints, createSprint, assignTaskSprint } from '../../services/projectService';
import ProjectNav from './ProjectNav';

const SprintPlanning = () => {
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectId, setProjectId] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [sprints, setSprints] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    getProjects().then(res => setProjects(res.data || []));
  }, []);

  useEffect(() => {
    if (projectId) {
      getTasks(projectId).then(res => setTasks(res.data || []));
      getSprints(projectId).then(res => setSprints(res.data || []));
    }
  }, [projectId]);

  const refresh = () => {
    getTasks(projectId).then(res => setTasks(res.data || []));
    getSprints(projectId).then(res => setSprints(res.data || []));
  };

  const handleCreateSprint = async () => {
    if (!name || !startDate || !endDate || !projectId) return;
    await createSprint(projectId, { name, startDate, endDate });
    setName('');
    setStartDate('');
    setEndDate('');
    refresh();
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const dest = result.destination.droppableId;
    const sprintId = dest.startsWith('sprint-') ? dest.replace('sprint-', '') : null;
    await assignTaskSprint(taskId, { sprintId });
    refresh();
  };

  const tasksBySprint = (id: string | null) => tasks.filter(t => (t.sprintId || null) === id);

  return (
    <div className={`page-wrapper ${
      dataTheme === 'dark_data_theme' ? 'bg-dark text-white' : ''
    }`}>
      <ProjectNav />
      <div className="container mt-3">
        <h4>Sprint Planning</h4>
        <select className="form-select mb-3" value={projectId} onChange={e => setProjectId(e.target.value)}>
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {projectId && (
          <div className="mb-3">
            <input className="form-control mb-2" placeholder="Sprint Name" value={name} onChange={e => setName(e.target.value)} />
            <input type="date" className="form-control mb-2" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <input type="date" className="form-control mb-2" value={endDate} onChange={e => setEndDate(e.target.value)} />
            <button className="btn btn-primary btn-sm" onClick={handleCreateSprint}>Create Sprint</button>
          </div>
        )}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="d-flex overflow-auto">
            <Droppable droppableId="backlog">
              {(provided) => (
                <div className="border rounded p-2 me-2" style={{ minWidth: 250 }} ref={provided.innerRef} {...provided.droppableProps}>
                  <h6 className="text-center">Backlog</h6>
                  {tasksBySprint(null).map((t, idx) => (
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
            {sprints.map(s => (
              <Droppable droppableId={`sprint-${s.id}`} key={s.id}>
                {(provided) => (
                  <div className="border rounded p-2 me-2" style={{ minWidth: 250 }} ref={provided.innerRef} {...provided.droppableProps}>
                    <h6 className="text-center">{s.name}</h6>
                    <div className="progress mb-2">
                      <div className="progress-bar" role="progressbar" style={{ width: `${(tasksBySprint(s.id).length / 10) * 100}%` }} />
                    </div>
                    {tasksBySprint(s.id).map((t, idx) => (
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

export default SprintPlanning;
