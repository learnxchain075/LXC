import { useEffect, useState } from 'react';
import {
  getProjects,
  createProject,
  deleteProject,
  updateProject,
  createTask,
  updateTask,
  deleteTask,
} from '../../services/projectService';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  tasks: Task[];
}

const ProjectDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const fetchProjects = () => {
    getProjects()
      .then(res => setProjects(res.data || []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const userId = localStorage.getItem('userId') || '';

  const handleCreateProject = async () => {
    if (!newName) return;
    await createProject({ name: newName, description: newDesc, createdBy: userId });
    setNewName('');
    setNewDesc('');
    fetchProjects();
  };

  const handleUpdateProject = async (p: Project) => {
    const name = prompt('Project name', p.name) || p.name;
    const description = prompt('Project description', p.description || '') || '';
    await updateProject(p.id, { name, description });
    fetchProjects();
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
    fetchProjects();
  };

  const handleAddTask = async (projectId: string) => {
    const title = prompt('Task title');
    if (!title) return;
    await createTask({ title, projectId, createdById: userId });
    fetchProjects();
  };

  const handleUpdateTask = async (t: Task) => {
    const title = prompt('Task title', t.title) || t.title;
    const status = prompt('Status', t.status) || t.status;
    await updateTask(t.id, { title, status });
    fetchProjects();
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    fetchProjects();
  };

  return (
    <div className="container mt-4">
      <h3>Projects</h3>
      <div className="mb-3">
        <input
          className="form-control mb-2"
          placeholder="Name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Description"
          value={newDesc}
          onChange={e => setNewDesc(e.target.value)}
        />
        <button onClick={handleCreateProject} className="btn btn-primary btn-sm">
          Create Project
        </button>
      </div>
      {projects.map(p => (
        <div key={p.id} className="mb-4 border rounded p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5>{p.name}</h5>
            <div>
              <button
                className="btn btn-sm btn-secondary me-2"
                onClick={() => handleUpdateProject(p)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteProject(p.id)}
              >
                Delete
              </button>
            </div>
          </div>
          <p className="text-muted">{p.description}</p>
          <button
            className="btn btn-sm btn-outline-primary mb-2"
            onClick={() => handleAddTask(p.id)}
          >
            Add Task
          </button>
          <ul className="list-unstyled">
            {p.tasks.map(t => (
              <li key={t.id} className="d-flex justify-content-between">
                <span>
                  {t.title} - {t.status}
                </span>
                <span>
                  <button
                    className="btn btn-sm btn-secondary me-2"
                    onClick={() => handleUpdateTask(t)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteTask(t.id)}
                  >
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ProjectDashboard;
