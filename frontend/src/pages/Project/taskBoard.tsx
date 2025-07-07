import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { ProgressBar } from "react-bootstrap";
import {
  getProjects,
  getTasks,
  updateTaskStatus,
  getSprints,
  getWorkflow,
  getLabels,
} from "../../services/projectService";
import ProjectNav from "./ProjectNav";

interface Task {
  id: string;
  title: string;
  stage?: { id: string; name: string } | null;
  sprintId?: string | null;
  checklist?: { text: string; done: boolean }[];
}

const TaskBoard = () => {
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [sprints, setSprints] = useState<any[]>([]);
  const [sprintId, setSprintId] = useState<string | null>(null);
  const [columns, setColumns] = useState<{ id: string; name: string }[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [labelId, setLabelId] = useState<string>("");

  useEffect(() => {
    getProjects().then((res) => setProjects(res.data || []));
  }, []);

  useEffect(() => {
    if (projectId) {
      getSprints(projectId).then((res) => setSprints(res.data || []));
      getWorkflow(projectId).then((res) => setColumns(res.data?.stages || []));
      getLabels(projectId).then((res) => setLabels(res.data || []));
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      getTasks({ projectId, sprintId, label: labelId }).then((res) => setTasks(res.data || []));
    }
  }, [projectId, sprintId, labelId]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const dest = result.destination.droppableId;

    await updateTaskStatus(taskId, { stageId: dest });
    getTasks({ projectId, sprintId, label: labelId }).then((res) => setTasks(res.data || []));
  };

  return (
    <div className={`page-wrapper ${
      dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""
    }`}>
      <ProjectNav />
      <div className="container mt-3">
        <h4>Task Board</h4>
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
        {projectId && (
          <select
            className="form-select mb-3"
            value={sprintId ?? ""}
            onChange={(e) => setSprintId(e.target.value || null)}
          >
            <option value="">Backlog</option>
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        )}
        {projectId && (
          <select
            className="form-select mb-3"
            value={labelId}
            onChange={(e) => setLabelId(e.target.value)}
          >
            <option value="">All Labels</option>
            {labels.map((l: any) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        )}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="d-flex overflow-auto">
            {columns.map((col) => (
              <Droppable droppableId={col.id} key={col.id}>
                {(provided) => (
                  <div
                    className="border rounded p-2 me-2"
                    style={{ minWidth: 250 }}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h6 className="text-center">{col.name}</h6>
                    {tasks
                      .filter((t) => t.stage?.id === col.id)
                      .map((t, idx) => (
                        <Draggable key={t.id} draggableId={t.id} index={idx}>
                          {(p) => (
                            <div
                              ref={p.innerRef}
                              {...p.draggableProps}
                              {...p.dragHandleProps}
                              className="mb-2 p-2 bg-light border rounded"
                            >
                              <div>{t.title}</div>
                              {Array.isArray(t.checklist) && t.checklist.length > 0 && (
                                <ProgressBar
                                  now={Math.round(
                                    (t.checklist.filter((c) => c.done).length /
                                      t.checklist.length) * 100,
                                  )}
                                  className="mt-1"
                                  style={{ height: 4 }}
                                />
                              )}
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
