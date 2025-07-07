import { useEffect, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { getTasks } from '../../services/projectService';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  checklist?: { text: string; done: boolean }[];
}

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks().then(res => setTasks(res.data || [])).catch(() => {});
  }, []);

  return (
    <div className="container mt-4">
      <h3>Employee Dashboard</h3>
      <h5 className="mt-4">My Tasks</h5>
      {tasks.length === 0 ? (
        <p>No tasks assigned.</p>
      ) : (
        <ul>
          {tasks.map((t) => (
            <li key={t.id}>
              {t.title} - {t.status}
              {Array.isArray(t.checklist) && t.checklist.length > 0 && (
                <ProgressBar
                  now={Math.round(
                    (t.checklist.filter((c) => c.done).length / t.checklist.length) * 100,
                  )}
                  className="my-1"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeDashboard;
