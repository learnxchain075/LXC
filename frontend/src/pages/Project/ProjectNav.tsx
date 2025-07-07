import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { all_routes } from '../../router/all_routes';
import { setDataTheme } from '../../Store/themeSettingSlice';

const navItems = [
  { path: all_routes.projectDashboard, label: 'Dashboard' },
  { path: all_routes.taskBoard, label: 'Board' },
  { path: all_routes.backlog, label: 'Backlog' },
  { path: all_routes.sprintPlanning, label: 'Sprints' },
  { path: all_routes.tasksList, label: 'Tasks' },
  { path: all_routes.taskCalendar, label: 'Calendar' },
  { path: all_routes.sprintReport, label: 'Reports' },
];

const ProjectNav: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const toggleTheme = () => {
    dispatch(
      dataTheme === 'default_data_theme'
        ? setDataTheme('dark_data_theme')
        : setDataTheme('default_data_theme')
    );
  };

  const linkClass = (path: string) =>
    `me-3 text-decoration-none ${
      location.pathname === path ? 'fw-bold' : ''
    } ${dataTheme === 'dark_data_theme' ? 'text-white' : 'text-dark'}`;

  return (
    <nav className={`border-bottom mb-3 ${dataTheme === 'dark_data_theme' ? 'bg-dark' : 'bg-light'}`}>
      <div className="container d-flex align-items-center justify-content-between py-2">
        <div className="d-flex align-items-center">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={linkClass(item.path)}>
              {item.label}
            </Link>
          ))}
        </div>
        <button
          onClick={toggleTheme}
          className={`btn btn-sm btn-outline-${
            dataTheme === 'dark_data_theme' ? 'light' : 'secondary'
          }`}
          title="Toggle theme"
        >
          <i className={dataTheme === 'default_data_theme' ? 'ti ti-moon' : 'ti ti-brightness-up'} />
        </button>
      </div>
    </nav>
  );
};

export default ProjectNav;
