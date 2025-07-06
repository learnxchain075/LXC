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
        </ul>
      </li>
    </ul>
  );
};

export default EmployeeMenuItems;
