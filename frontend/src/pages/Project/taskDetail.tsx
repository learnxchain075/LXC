import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, ProgressBar } from 'react-bootstrap';
import { getTask, getTaskTimeline, updateTask } from '../../services/projectService';

interface Log {
  id: string;
  action: string;
  details?: string;
  timestamp: string;
}

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<any>(null);
  const [logs, setLogs] = useState<Log[]>([]);

  const handleToggle = (idx: number) => {
    if (!task) return;
    const updated = [...(task.checklist || [])];
    updated[idx] = { ...updated[idx], done: !updated[idx].done };
    setTask({ ...task, checklist: updated });
    updateTask(task.id, { checklist: updated });
  };

  useEffect(() => {
    if (id) {
      getTask(id).then(res => setTask(res.data));
      getTaskTimeline(id).then(res => setLogs(res.data || []));
    }
  }, [id]);

  return (
    <div className="page-wrapper">
      <div className="container mt-3">
        {task && (
          <>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            {Array.isArray(task.checklist) && task.checklist.length > 0 && (
              <div className="mb-3">
                <h5>Checklist</h5>
                {task.checklist.map((item: any, idx: number) => (
                  <Form.Check
                    type="checkbox"
                    key={idx}
                    label={item.text}
                    checked={item.done}
                    onChange={() => handleToggle(idx)}
                    className="mb-1"
                  />
                ))}
                <ProgressBar
                  now={Math.round(
                    (task.checklist.filter((i: any) => i.done).length /
                      task.checklist.length) * 100,
                  )}
                  label={`${Math.round(
                    (task.checklist.filter((i: any) => i.done).length /
                      task.checklist.length) * 100,
                  )}%`}
                  className="mt-2"
                />
              </div>
            )}
          </>
        )}
        <h5>Timeline</h5>
        <ul className="timeline">
          {logs.map(log => (
            <li key={log.id} className="timeline-inverted">
              <div className="timeline-badge primary" />
              <div className="timeline-panel">
                <div className="timeline-heading">
                  <h6 className="timeline-title">{log.action}</h6>
                  <p>
                    <small className="text-muted">
                      {new Date(log.timestamp).toLocaleString()}
                    </small>
                  </p>
                </div>
                {log.details && (
                  <div className="timeline-body">
                    <p>{log.details}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskDetail;
