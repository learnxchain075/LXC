import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  getProjects,
  getSprints,
  getSprintBurndown,
} from '../../services/projectService';
import ProjectNav from './ProjectNav';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DataPoint {
  date: string;
  remaining: number;
}

const SprintReport = () => {
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectId, setProjectId] = useState('');
  const [sprints, setSprints] = useState<any[]>([]);
  const [sprintId, setSprintId] = useState('');
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    getProjects().then(res => setProjects(res.data || []));
  }, []);

  useEffect(() => {
    if (projectId) {
      getSprints(projectId).then(res => setSprints(res.data || []));
    }
  }, [projectId]);

  useEffect(() => {
    if (sprintId) {
      getSprintBurndown(sprintId).then(res => setData(res.data || []));
    }
  }, [sprintId]);

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Remaining',
        data: data.map(d => d.remaining),
        fill: false,
        borderColor: '#0d6efd',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className={`page-wrapper ${
      dataTheme === 'dark_data_theme' ? 'bg-dark text-white' : ''
    }`}>
      <ProjectNav />
      <div className="container mt-3">
        <h4>Sprint Report</h4>
        <select
          className="form-select mb-3"
          value={projectId}
          onChange={e => setProjectId(e.target.value)}
        >
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {projectId && (
          <select
            className="form-select mb-3"
            value={sprintId}
            onChange={e => setSprintId(e.target.value)}
          >
            <option value="">Select Sprint</option>
            {sprints.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        )}
        {data.length > 0 && <Line data={chartData} />}
      </div>
    </div>
  );
};

export default SprintReport;
