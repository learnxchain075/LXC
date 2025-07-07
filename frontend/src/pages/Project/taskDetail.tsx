import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Form, ProgressBar } from 'react-bootstrap';
import { getTask, getTaskTimeline, updateTask, watchTask } from '../../services/projectService';
import ProjectNav from './ProjectNav';

interface Log {
  id: string;
  action: string;
  details?: string;
  timestamp: string;
}

const TaskDetail = () => {
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<any>(null);
  const [logs, setLogs] = useState<Log[]>([]);

  const handleWatch = () => {
    if (id) {
      const uid = localStorage.getItem('userId') || '';
      watchTask(id, uid);
    }
  };

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
    <div className={`page-wrapper ${
      dataTheme === 'dark_data_theme' ? 'bg-dark text-white' : ''
    }`}>
      <ProjectNav />
      <div className="container mt-3">
        {task && (
          <>
            <div className="d-flex align-items-center mb-2">
              <h4 className="me-2">{task.title}</h4>
              <button className="btn btn-sm btn-outline-primary" onClick={handleWatch}>Watch</button>
            </div>
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
