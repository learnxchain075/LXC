// import { Navigate, Outlet } from "react-router-dom";
// import { getCurrentUser } from "../services/authService";

// const ProtectedRoute = () => {
//   return getCurrentUser() ? <Outlet /> : <Navigate to="/login" />;
// };

// export default ProtectedRoute;

import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import { publicRoutes } from "../router/router.link";

const ProtectedRoute = () => {
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const userRole = useSelector((state: any) => state.auth.userObj?.role);
  const location = useLocation();

  const currentRoute = publicRoutes.find((route) => route.path === location.pathname);

  if (!isLoggedIn) {
    return <Navigate to={`/?redirect=${location.pathname}`} replace />;
  }


  if (currentRoute?.role && currentRoute.role.length > 0 && !currentRoute.role.includes(userRole)) {
 
    switch (userRole) {
      case "superadmin":
        return <Navigate to={all_routes.superAdminDashboard} replace />;
      case "admin":
        return <Navigate to={all_routes.adminDashboard} replace />;
      case "teacher":
        return <Navigate to={all_routes.teacherDashboard} replace />;
      case "student":
        return <Navigate to={all_routes.studentDashboard} replace />;
      case "parent":
        return <Navigate to={all_routes.parentDashboard} replace />;
      case "hostel":
        return <Navigate to={all_routes.hostelDashboard} replace />;
      case "transport":
        return <Navigate to={all_routes.transportDashboard} replace />;
      case "library":
        return <Navigate to={all_routes.libraryDashboard} replace />;
      case "accounts":
        return <Navigate to={all_routes.accountsDashboard} replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;