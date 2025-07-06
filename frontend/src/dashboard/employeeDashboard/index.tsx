import { useEffect, useState } from 'react';
import { getTasks } from '../../services/projectService';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
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
      <ul>
        {tasks.map(t => (
          <li key={t.id}>{t.title} - {t.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeDashboard;
