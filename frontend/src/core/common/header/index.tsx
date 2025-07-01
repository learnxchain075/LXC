import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setDataLayout,
  setDataTheme,
} from "../../../Store/themeSettingSlice";
import ImageWithBasePath from "../imageWithBasePath";
import {
  setExpandMenu,
  setMobileSidebar,
  toggleMiniSidebar,
} from "../../../Store/sidebarSlice";
import { isLogout } from "../../../Store/authSlice";
import { useEffect, useState } from "react";
import { all_routes } from "../../../router/all_routes";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import useMobileDetection from "../mobileDetection";
import BaseApi from "../../../services/BaseApi";
import { toast, ToastContainer } from "react-toastify";




const Header = () => {

  const routes = all_routes;
  const dispatch = useDispatch();
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const dataLayout = useSelector((state: any) => state.themeSetting.dataLayout);
  const user = useSelector((state: any) => state.auth.userObj);
  const mobileSidebar = useSelector((state: any) => state.sidebarSlice.mobileSidebar);
  const isMobile = useMobileDetection();
  const location = useLocation();
  const [imgSrc, setImgSrc] = useState<String>("");
  const [notificationVisible, setNotificationVisible] = useState(false);
  const navigate = useNavigate();

  const fatchdata = async () => {
    const response = await BaseApi.getRequest(
      `/user/get/${localStorage.getItem("userId")}`);
    // console.log("object",response);
    const imgvalue = response.data?.data?.profilePic;
    setImgSrc(imgvalue);
    // localStorage.setItem("teacherId",response.data.data.teacherId);
    // localStorage.setItem("studentId",response.data.data.studenet.id);
    if (response.data?.data?.teacherId) {
      localStorage.setItem("teacherId", response.data.data.teacherId);
    }
    if (response.data?.data?.student?.id) {
      localStorage.setItem("studentId", response.data.data.student.id);
    }
  }
  useEffect(() => {
    fatchdata();

  }, [])

  const getInitials = (name: any) => {
    const names = name.split(" ");
    return `${names[0]?.charAt(0) || ""}${names[names.length - 1]?.charAt(0) || ""}`.toUpperCase();
  };

  const toggleMobileSidebar = () => dispatch(setMobileSidebar(!mobileSidebar));
  const onMouseEnter = () => dispatch(setExpandMenu(true));
  const onMouseLeave = () => dispatch(setExpandMenu(false));
  const handleToggleMiniSidebar = () => {
    dispatch(dataLayout === "mini_layout" ? setDataLayout("default_layout") : toggleMiniSidebar());
    localStorage.setItem("dataLayout", dataLayout === "mini_layout" ? "default_layout" : "mini_layout");
  };
  const handleToggleClick = () => {
    dispatch(dataTheme === "default_data_theme" ? setDataTheme("dark_data_theme") : setDataTheme("default_data_theme"));
  };
  const toggleNotification = () => setNotificationVisible(!notificationVisible);

  const handleLogout = () => {
    dispatch(isLogout());
    toast.success("Logged out successfully!", { position: "top-center", autoClose: 3000 });
    navigate("/");
  };

  const renderMobileHeader = (dashboardRoute: any) => (
    <div className="header">
      <div className="header-left active" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Link to={dashboardRoute} className="logo logo-normal">
          <ImageWithBasePath src="assets/img/logo3.png" alt="Logo" />
        </Link>
        <Link to={dashboardRoute} className="logo-small">
          <ImageWithBasePath src="assets/img/logo-small.svg" alt="Logo" />
        </Link>
        <Link to={dashboardRoute} className="dark-logo">
          <ImageWithBasePath src="assets/img/logo-dark.svg" alt="Logo" />
        </Link>
      </div>
      <Link id="mobile_btn" className="mobile_btn" to="#sidebar" onClick={toggleMobileSidebar}>
        <span className="bar-icon"></span>
          
         
       
      </Link>
      <div className="dropdown mobile-user-menu">
        <Link to="#" className="nav-link dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false">
          <i className="fa fa-ellipsis-v" />
        </Link>
        <div className="dropdown-menu dropdown-menu-end">
          <Link className="dropdown-item" to={routes.profile}>My Profile</Link>
          <Link className="dropdown-item" to={routes.profilesettings}>Settings</Link>
          <Link className="dropdown-item" to={routes.login} onClick={handleLogout}>Logout</Link>
        </div>
      </div>
      {/* Direct logout button for fallback when dropdown fails */}
      <Link to={routes.login} onClick={handleLogout} className="btn btn-outline-light bg-white btn-icon ms-2">
        <i className="ti ti-login" />
      </Link>
    </div>
  );


  const renderDesktopHeader = (dashboardRoute: any) => (
    <div className="header">
      <div className="header-left active" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Link to="/" className="logo logo-normal">
          <ImageWithBasePath src="assets/img/logo3.png" alt="Logo" />
        </Link>
        <Link to="/" className="logo-small">
          <ImageWithBasePath src="assets/img/logo-small.svg" alt="Logo" />
        </Link>
        <Link to="/" className="dark-logo">
          <ImageWithBasePath src="assets/img/logo-dark.svg" alt="Logo" />
        </Link>
        <Link id="toggle_btn" to="#" onClick={handleToggleMiniSidebar}>
          <i className="ti ti-menu-deep" />
        </Link>
      </div>
      <Link id="mobile_btn" className="mobile_btn" to="#sidebar" onClick={toggleMobileSidebar}>
        <span className="bar-icon">
          <span />
          <span />
          <span />
        </span>
      </Link>
      <div className="header-user">
        <div className="nav user-menu">
          <div className="nav-item nav-search-inputs me-auto">
            <div className="top-nav-search">
              <Link to="#" className="responsive-search">
                <i className="fa fa-search" />
              </Link>
              <form action="#" className="dropdown">
                <div className="searchinputs" id="dropdownMenuClickable">
                  <input type="text" placeholder="Search" />
                  <div className="search-addon">
                    <button type="submit"><i className="ti ti-command" /></button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="d-flex align-items-center">
            {!location.pathname.includes("layout-dark") && (
              <Link onClick={handleToggleClick} to="#" id="dark-mode-toggle" className="btn btn-outline-light bg-white btn-icon me-1">
                <i className={dataTheme === "default_data_theme" ? "ti ti-moon" : "ti ti-brightness-up"} />
              </Link>
            )}
            {/* <Link onClick={toggleNotification} to="#" className="btn btn-outline-light bg-white btn-icon position-relative me-1">
              <i className="ti ti-bell" />
              <span className="notification-status-dot" />
            </Link>
            <Link to={routes.chat} className="btn btn-outline-light bg-white btn-icon position-relative me-1">
              <i className="ti ti-brand-hipchat" />
              <span className="chat-status-dot" />
            </Link> */}
            {/* Added direct logout button for cases where dropdown fails */}
            <Link to={routes.login} onClick={handleLogout} className="btn btn-outline-light bg-white btn-icon me-1">
              <i className="ti ti-login" />
            </Link>
            {/* <div className="dropdown btn btn-outline-light bg-white btn-icon me-2  "> */}
            <a className="dropdown-toggle -ml-2 align-items-center" data-bs-toggle="dropdown">
              {imgSrc ? (
                <span className="avatar avatar-sm me-2 online avatar-rounded">
                  <img src={imgSrc as string} alt="img" />
                </span>
              ) : (
                <span className="avatar avatar-sm me-2 online avatar-rounded bg-green-500 text-black font-bold text-4xl flex items-center justify-center">
                  {getInitials(user?.name || "User")}
                </span>
              )}
            </a>





            <div className="dropdown-menu dropdown-menu-end">


              <div className="d-flex align-items-center p-2">
                {typeof imgSrc === "string" && imgSrc.trim() !== "" ? (
                  <span className="avatar avatar-md me-2 online avatar-rounded">
                    <img src={imgSrc} alt="img" />
                  </span>
                ) : (
                  <span className="avatar avatar-md me-2 online avatar-rounded bg-green-500 text-black font-bold text-4xl flex items-center justify-center">
                    {getInitials(user?.name || "User")}
                  </span>
                )}
                <div>
                  <h6>{user?.name ?? "No Name"}</h6>
                  <p className="text-primary mb-0">{user?.role ?? "No Role"}</p>
                </div>
              </div>




              <hr className="m-0" />
              <Link className="dropdown-item d-inline-flex align-items-center p-2" to={routes.profile}>
                <i className="ti ti-user-circle me-2" /> My Profile
              </Link>
              <Link className="dropdown-item d-inline-flex align-items-center p-2" to={routes.profilesettings}>
                <i className="ti ti-settings me-2" /> Settings
              </Link>
              <hr className="m-0" />
              <Link className="dropdown-item d-inline-flex align-items-center p-2" to={routes.login} onClick={handleLogout}>
                <i className="ti ti-login me-2" /> Logout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );

  if (!user) return null;


  const roleDashboardMap: any = {
    student: routes.studentDashboard,
    teacher: routes.teacherDashboard,
    parent: routes.parentDashboard,
    admin: routes.adminDashboard,
  };

  const dashboardRoute = roleDashboardMap[user.role] || routes.adminDashboard;


  if (["student", "teacher", "parent"].includes(user.role)) {
    return isMobile ? renderMobileHeader(dashboardRoute) : null;
  }

  else if (user.role === "admin" || user.role === "superadmin") {
    return isMobile ? renderMobileHeader(dashboardRoute) : renderDesktopHeader(dashboardRoute);
    // return renderDesktopHeader(dashboardRoute);
  }

  return (
    <>
      {isMobile ? renderMobileHeader(dashboardRoute) : renderDesktopHeader(dashboardRoute)}
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default Header;