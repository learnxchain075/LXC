// import { useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router";

// const PublicRouteWrapper = () => {
//   const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);

//   if (isLoggedIn) {
//     // TODO: Redirect to the dashboard
//     return <Navigate to="/" />;
//   }

//   return (
//     <div className="account-page">
//       <div className="main-wrapper">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default PublicRouteWrapper;

import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";
import { all_routes } from "../router/all_routes";
import { authRoutes } from "../router/router.link";

const PublicRouteWrapper = () => {
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const userRole = useSelector((state: any) => state.auth.userObj?.role);
  const location = useLocation();

  const currentRoute = authRoutes.find((route) => route.path === location.pathname);

  
  if (isLoggedIn) {
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


  if (currentRoute && "role" in currentRoute && Array.isArray((currentRoute as any).role) && (currentRoute as any).role.length > 0) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="account-page">
      <div className="main-wrapper">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicRouteWrapper;