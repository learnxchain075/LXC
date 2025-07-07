import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { getProjects, getCalendarTasks } from '../../services/projectService';
import ProjectNav from './ProjectNav';

interface CalendarEvent {
  id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  dueSoon?: boolean;
  overdue?: boolean;
}

const TaskCalendar = () => {
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    getProjects().then(res => setProjects(res.data || []));
  }, []);

  useEffect(() => {
    if (projectId) {
      getCalendarTasks(projectId).then(res => {
        const list: CalendarEvent[] = res.data || [];
        const mapped = list.map(e => ({
          id: e.id,
          title: e.title,
          start: e.startDate,
          end: e.endDate,
          className: e.overdue ? 'bg-danger text-white' : e.dueSoon ? 'bg-warning' : ''
        }));
        setEvents(mapped);
      });
    } else {
      setEvents([]);
    }
  }, [projectId]);

  return (
    <div className={`page-wrapper ${
      dataTheme === 'dark_data_theme' ? 'bg-dark text-white' : ''
    }`}>
      <ProjectNav />
      <div className="container mt-3">
        <h4>Task Calendar</h4>
        <select className="form-select mb-3" value={projectId} onChange={e => setProjectId(e.target.value)}>
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" events={events} />
      </div>
    </div>
  );
};

export default TaskCalendar;
