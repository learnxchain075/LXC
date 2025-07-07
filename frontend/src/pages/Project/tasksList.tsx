import { useEffect, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { getProjects, getTasks, getEpics } from '../../services/projectService';

interface Task {
  id: string;
  title: string;
  parentId?: string | null;
  status: string;
}
interface Epic {
  id: string;
  title: string;
  progress: number;
}

const TasksList = () => {
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);

  useEffect(() => {
    getProjects().then(res => setProjects(res.data || []));
  }, []);

  useEffect(() => {
    if (projectId) {
      getTasks(projectId).then(res => setTasks(res.data || []));
      getEpics(projectId).then(res => setEpics(res.data || []));
    }
  }, [projectId]);

  const rootTasks = tasks.filter(t => !t.parentId);

  return (
    <div className="page-wrapper">
      <div className="container mt-3">
        <h4>Tasks & Epics</h4>
        <select className="form-select mb-3" value={projectId} onChange={e => setProjectId(e.target.value)}>
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <div className="row">
          <div className="col-md-8">
            {rootTasks.map(t => (
              <div key={t.id} className="mb-2">
                <strong>{t.title}</strong>
                <ul className="list-unstyled ms-3">
                  {tasks.filter(st => st.parentId === t.id).map(st => (
                    <li key={st.id}>{st.title} - {st.status}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <h5>Epics</h5>
            {epics.map(e => (
              <div key={e.id} className="mb-2 border rounded p-2">
                <strong>{e.title}</strong>
                <ProgressBar now={e.progress} label={`${e.progress}%`} className="my-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksList;
