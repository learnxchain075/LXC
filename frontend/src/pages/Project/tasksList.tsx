import { Fragment, useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { all_routes } from "../../router/all_routes";
import {
  getProjects,
  getTasks,
  getEpics,
  TaskFilters,
} from "../../services/projectService";

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
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [filters, setFilters] = useState<TaskFilters>(() => {
    try {
      const saved = localStorage.getItem("taskFilters");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    getProjects().then((res) => setProjects(res.data || []));
  }, []);

  useEffect(() => {
    if (projectId) {
      getTasks({ projectId, ...filters, search }).then((res) =>
        setTasks(res.data || []),
      );
      getEpics(projectId).then((res) => setEpics(res.data || []));
    }
  }, [projectId, filters, search]);

  useEffect(() => {
    localStorage.setItem("taskFilters", JSON.stringify(filters));
  }, [filters]);

  const rootTasks = tasks.filter((t) => !t.parentId);

  return (
    <div className="page-wrapper">
      <div className="container mt-3">
        <h4>Tasks & Epics</h4>
        <select
          className="form-select mb-3"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <div className="d-flex mb-3 align-items-center">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn btn-outline-secondary"
            onClick={() => setShowFilter(true)}
          >
            Filters
          </button>
        </div>
        <div className="row">
          <div className="col-md-8">
            {rootTasks.map((t) => (
              <div key={t.id} className="mb-2">
                <strong>
                  <Link to={all_routes.taskDetail.replace(":id", t.id)}>
                    {t.title}
                  </Link>
                </strong>
                <ul className="list-unstyled ms-3">
                  {tasks
                    .filter((st) => st.parentId === t.id)
                    .map((st) => (
                      <li key={st.id}>
                        <Link to={all_routes.taskDetail.replace(":id", st.id)}>
                          {st.title}
                        </Link>{" "}
                        - {st.status}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <h5>Epics</h5>
            {epics.map((e) => (
              <div key={e.id} className="mb-2 border rounded p-2">
                <strong>{e.title}</strong>
                <ProgressBar
                  now={e.progress}
                  label={`${e.progress}%`}
                  className="my-1"
                />
              </div>
            ))}
          </div>
        </div>
        <Transition.Root show={showFilter} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setShowFilter}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
                  <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-300"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-300"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                  >
                    <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                      <div className="flex h-full flex-col overflow-y-scroll bg-white py-4 shadow-xl">
                        <div className="px-4 sm:px-6 flex justify-between items-center">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            Filters
                          </Dialog.Title>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowFilter(false)}
                          />
                        </div>
                        <div className="relative mt-4 flex-1 px-4 sm:px-6">
                          <div className="mb-3">
                            <label className="form-label">Assignee ID</label>
                            <input
                              type="text"
                              className="form-control"
                              value={filters.assigneeId || ""}
                              onChange={(e) =>
                                setFilters({
                                  ...filters,
                                  assigneeId: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Status</label>
                            <select
                              className="form-select"
                              value={filters.status || ""}
                              onChange={(e) =>
                                setFilters({
                                  ...filters,
                                  status: e.target.value || undefined,
                                })
                              }
                            >
                              <option value="">All</option>
                              <option value="OPEN">OPEN</option>
                              <option value="IN_PROGRESS">IN_PROGRESS</option>
                              <option value="REVIEW">REVIEW</option>
                              <option value="DONE">DONE</option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Issue Type</label>
                            <select
                              className="form-select"
                              value={filters.issueType || ""}
                              onChange={(e) =>
                                setFilters({
                                  ...filters,
                                  issueType: e.target.value || undefined,
                                })
                              }
                            >
                              <option value="">All</option>
                              <option value="BUG">BUG</option>
                              <option value="STORY">STORY</option>
                              <option value="TASK">TASK</option>
                              <option value="EPIC">EPIC</option>
                              <option value="IMPROVEMENT">IMPROVEMENT</option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Priority</label>
                            <select
                              className="form-select"
                              value={filters.priority || ""}
                              onChange={(e) =>
                                setFilters({
                                  ...filters,
                                  priority: e.target.value || undefined,
                                })
                              }
                            >
                              <option value="">All</option>
                              <option value="LOW">LOW</option>
                              <option value="MEDIUM">MEDIUM</option>
                              <option value="HIGH">HIGH</option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Label</label>
                            <input
                              type="text"
                              className="form-control"
                              value={filters.label || ""}
                              onChange={(e) =>
                                setFilters({
                                  ...filters,
                                  label: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </div>
  );
};

export default TasksList;
