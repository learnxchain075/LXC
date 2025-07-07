import { useEffect, useState } from 'react';
import TaskModal, { ISSUE_OPTIONS, IssueType } from './TaskModal';
import {
  getProjects,
  createProject,
  deleteProject,
  updateProject,
  createTask,
  updateTask,
  deleteTask,
  addGitHubRepo,
  createGitHubBranch,
  getProjectRole,
} from '../../services/projectService';

interface GitHubRepo {
  id: string;
  repoUrl: string;
}

interface GitHubBranch {
  id: string;
  name: string;
  prUrl?: string;
  status?: string;
}

interface Task {
  id: string;
  title: string;
  stage?: { id: string; name: string } | null;
  priority: string;
  issueType: IssueType;
  severity?: number;
  storyPoints?: number;
  deadline?: string;
  githubBranches?: GitHubBranch[];
  checklist?: { text: string; done: boolean }[];
}

interface Project {
  id: string;
  name: string;
  description?: string;
  tasks: Task[];
  githubRepos?: GitHubRepo[];
  workflow?: { stages: { id: string; name: string; order: number }[] } | null;
}

const ProjectDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [roles, setRoles] = useState<Record<string, string>>({});
  const issueMap = ISSUE_OPTIONS.reduce((acc, cur) => {
    acc[cur.value as IssueType] = cur;
    return acc;
  }, {} as Record<IssueType, { icon: JSX.Element; color: string }>);

  const fetchProjects = () => {
    getProjects()
      .then(async res => {
        setProjects(res.data || []);
        const rolesMap: Record<string, string> = {};
        for (const p of res.data || []) {
          try {
            const r = await getProjectRole(p.id);
            rolesMap[p.id] = r.data.role;
          } catch {}
        }
        setRoles(rolesMap);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const userId = localStorage.getItem('userId') || '';

  const handleCreateProject = async () => {
    if (!newName) return;
    const defaultWorkflow = [
      { name: 'Design', order: 1 },
      { name: 'Dev', order: 2 },
      { name: 'QA', order: 3 },
      { name: 'Done', order: 4 },
    ];
    await createProject({ name: newName, description: newDesc, createdBy: userId, workflow: defaultWorkflow });
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

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState('');

  const handleAddTask = (projectId: string) => {
    setActiveProjectId(projectId);
    setShowTaskModal(true);
  };

  const saveTask = async (data: any) => {
    await createTask({ ...data, projectId: activeProjectId, createdById: userId });
    setShowTaskModal(false);
    fetchProjects();
  };

  const handleUpdateTask = async (t: Task) => {
    const title = prompt('Task title', t.title) || t.title;
    await updateTask(t.id, { title });
    fetchProjects();
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    fetchProjects();
  };

  const handleAddRepo = async (projectId: string) => {
    const repoUrl = prompt('GitHub repo URL');
    if (!repoUrl) return;
    await addGitHubRepo(projectId, { repoUrl });
    fetchProjects();
  };

  const handleCreateBranch = async (taskId: string) => {
    const name = prompt('Branch name');
    if (!name) return;
    const prUrl = prompt('PR URL (optional)') || undefined;
    await createGitHubBranch(taskId, { name, prUrl });
    fetchProjects();
  };

  return (
    <div className="page-wrapper">
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
              {roles[p.id] === 'ADMIN' && (
                <>
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
                  <button
                    className="btn btn-sm btn-outline-primary ms-2"
                    onClick={() => handleAddRepo(p.id)}
                  >
                    Add Repo
                  </button>
                </>
              )}
            </div>
          </div>
          <p className="text-muted">{p.description}</p>
          {p.githubRepos && p.githubRepos[0] && (
            <p className="mb-2">GitHub: <a href={p.githubRepos[0].repoUrl} target="_blank">{p.githubRepos[0].repoUrl}</a></p>
          )}
          <button
            className="btn btn-sm btn-outline-primary mb-2"
            onClick={() => handleAddTask(p.id)}
          >
            Add Task
          </button>
          <TaskModal show={showTaskModal && activeProjectId === p.id} onHide={() => setShowTaskModal(false)} onSave={saveTask} />
          <div className="row">
            {p.workflow?.stages.sort((a,b) => a.order - b.order).map(stage => (
              <div className="col-md-3" key={stage.id}>
                <h6 className="text-center">{stage.name}</h6>
                <ul className="list-unstyled min-vh-25">
                  {p.tasks.filter(t => t.stage?.id === stage.id).map(t => (
                    <li key={t.id} className="mb-2 p-2 border rounded">
                      <div className="d-flex justify-content-between">
                        <span className={`text-${issueMap[t.issueType as IssueType]?.color || 'secondary'} me-2`}>
                          {issueMap[t.issueType as IssueType]?.icon}
                        </span>
                        <span>{t.title}</span>
                        <span>
                          <button
                            className="btn btn-sm btn-secondary me-1"
                            onClick={() => handleUpdateTask(t)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => handleCreateBranch(t.id)}
                          >
                            Branch
                          </button>
                          {roles[p.id] === 'ADMIN' && (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteTask(t.id)}
                            >
                              Delete
                            </button>
                          )}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default ProjectDashboard;
