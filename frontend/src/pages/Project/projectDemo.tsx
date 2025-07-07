import { useEffect, useState, Fragment } from 'react';
import { Badge, Offcanvas } from 'react-bootstrap';
import { Dialog, Transition } from '@headlessui/react';
import { getProjects, getSprints, getTasks, TaskFilters } from '../../services/projectService';

interface Task {
  id: string;
  title: string;
  status: string;
  stage?: { id: string; name: string } | null;
}

const ProjectDemo = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectId, setProjectId] = useState('');
  const [sprints, setSprints] = useState<any[]>([]);
  const [sprintId, setSprintId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    getProjects().then(res => setProjects(res.data || []));
  }, []);

  useEffect(() => {
    if (projectId) {
      getSprints(projectId).then(res => setSprints(res.data || []));
      const filters: TaskFilters = { projectId, sprintId };
      getTasks(filters).then(res => setTasks(res.data || []));
    }
  }, [projectId, sprintId]);

  return (
    <div className={`page-wrapper ${darkMode ? 'bg-dark text-white' : ''}`}>
      <button className="btn btn-secondary m-2" onClick={() => setShowSidebar(true)}>
        Filters
      </button>
      <button className="btn btn-outline-primary m-2" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? 'Light' : 'Dark'} Mode
      </button>

      <div className="container-fluid">
        <div className="row row-cols-1 row-cols-md-3 g-3 mt-3">
          {tasks.map(t => (
            <div key={t.id} className="col">
              <div
                className="p-3 border rounded h-100 position-relative"
                role="button"
                onClick={() => setSelectedTask(t)}
              >
                <strong>{t.title}</strong>
                <Badge bg={t.status === 'DONE' ? 'success' : 'secondary'} className="ms-2" title={t.status}>
                  {t.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="mb-3">
            <label className="form-label">Project</label>
            <select className="form-select" value={projectId} onChange={e => setProjectId(e.target.value)}>
              <option value="">Select</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          {projectId && (
            <div className="mb-3">
              <label className="form-label">Sprint</label>
              <select
                className="form-select"
                value={sprintId ?? ''}
                onChange={e => setSprintId(e.target.value || null)}
              >
                <option value="">Backlog</option>
                {sprints.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <Transition.Root show={!!selectedTask} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setSelectedTask(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-dark bg-opacity-50" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-y-0 right-0 flex max-w-lg">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className={`pointer-events-auto w-screen max-w-md ${darkMode ? 'bg-dark text-white' : 'bg-white'}`}>
                  <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                    <Dialog.Title className="fs-5">{selectedTask?.title}</Dialog.Title>
                    <button type="button" className="btn-close" onClick={() => setSelectedTask(null)} />
                  </div>
                  <div className="p-3">
                    <p>Status: {selectedTask?.status}</p>
                    <p>Stage: {selectedTask?.stage?.name}</p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default ProjectDemo;
