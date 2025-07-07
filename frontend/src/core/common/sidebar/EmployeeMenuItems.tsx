import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { setDataLayout } from '../../../Store/themeSettingSlice';
import { useAppDispatch, useAppSelector } from '../../../Store/hooks';
import { all_routes } from '../../../router/all_routes';
import { getBaseUrl } from '../../../utils/general';

const EmployeeMenuItems = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const userObj = useAppSelector((state) => state.auth.userObj);

  const [subOpen, setSubopen] = useState<string>('');

  const handleLayoutChange = (layout: string) => dispatch(setDataLayout(layout));

  const handleClick = (label: string, layout?: string) => {
    setSubopen(label === subOpen ? '' : label);
    if (layout) handleLayoutChange(layout);
  };

  const getLayoutClass = (label: string) => {
    switch (label) {
      case 'Default':
        return 'default_layout';
      case 'Mini':
        return 'mini_layout';
      case 'Box':
        return 'boxed_layout';
      case 'Dark':
        return 'dark_data_theme';
      case 'RTL':
        return 'rtl';
      default:
        return '';
    }
  };

  return (
    <ul>
      <li>
        <h6 className="submenu-hdr">
          <span>MAIN</span>
        </h6>
        <ul>
          <li className="submenu">
            <Link
              to={all_routes.employeeDashboard}
              onClick={() => handleClick('Dashboard', getLayoutClass('Dashboard'))}
              className={`${subOpen === 'Dashboard' ? 'subdrop' : ''} ${location.pathname === all_routes.employeeDashboard ? 'active' : ''}`}
            >
              <i className="ti ti-layout-dashboard"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.employeeTickets}
              onClick={() => handleClick('Tickets')}
              className={`${subOpen === 'Tickets' ? 'subdrop' : ''} ${location.pathname === all_routes.employeeTickets ? 'active' : ''}`}
            >
              <i className="ti ti-ticket"></i>
              <span>My Tickets</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.projectDashboard}
              onClick={() => handleClick('Projects')}
              className={`${subOpen === 'Projects' ? 'subdrop' : ''} ${location.pathname === all_routes.projectDashboard ? 'active' : ''}`}
            >
              <i className="ti ti-briefcase"></i>
              <span>Projects</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.taskBoard}
              onClick={() => handleClick('Task Board')}
              className={`${subOpen === 'Task Board' ? 'subdrop' : ''} ${location.pathname === all_routes.taskBoard ? 'active' : ''}`}
            >
              <i className="ti ti-layout-kanban"></i>
              <span>Task Board</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.backlog}
              onClick={() => handleClick('Backlog')}
              className={`${subOpen === 'Backlog' ? 'subdrop' : ''} ${location.pathname === all_routes.backlog ? 'active' : ''}`}
            >
              <i className="ti ti-list"></i>
              <span>Backlog</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.sprintPlanning}
              onClick={() => handleClick('Sprint Planning')}
              className={`${subOpen === 'Sprint Planning' ? 'subdrop' : ''} ${location.pathname === all_routes.sprintPlanning ? 'active' : ''}`}
            >
              <i className="ti ti-calendar-event"></i>
              <span>Sprint Planning</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.sprintReport}
              onClick={() => handleClick('Sprint Report')}
              className={`${subOpen === 'Sprint Report' ? 'subdrop' : ''} ${location.pathname === all_routes.sprintReport ? 'active' : ''}`}
            >
              <i className="ti ti-report"></i>
              <span>Sprint Report</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.tasksList}
              onClick={() => handleClick('Tasks')}
              className={`${subOpen === 'Tasks' ? 'subdrop' : ''} ${location.pathname === all_routes.tasksList ? 'active' : ''}`}
            >
              <i className="ti ti-checklist"></i>
              <span>Tasks</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.taskCalendar}
              onClick={() => handleClick('Task Calendar')}
              className={`${subOpen === 'Task Calendar' ? 'subdrop' : ''} ${location.pathname === all_routes.taskCalendar ? 'active' : ''}`}
            >
              <i className="ti ti-calendar"></i>
              <span>Task Calendar</span>
            </Link>
          </li>
          <li className="submenu">
            <Link
              to={all_routes.projectDemo}
              onClick={() => handleClick('Project Demo')}
              className={`${subOpen === 'Project Demo' ? 'subdrop' : ''} ${location.pathname === all_routes.projectDemo ? 'active' : ''}`}
            >
              <i className="ti ti-presentation"></i>
              <span>Project Demo</span>
            </Link>
          </li>
        </ul>
      </li>
    </ul>
  );
};

export default EmployeeMenuItems;
