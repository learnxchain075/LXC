import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router";
import qs from "query-string";
import { setIsLoggedIn, setUserObj, setUserPermissions } from "../Store/authSlice";
import { getUserProfile } from "../services/authService";
import { all_routes } from "../router/all_routes";
import AppConfig from "../config/config";
import CustomLoader from "../components/Loader";
import useUsageLogger from "../hooks/useUsageLogger";

const CommonRouteWrapper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const triggerPostLogin = useSelector((state: any) => state.auth.triggerPostLogin);

  useUsageLogger();

  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string>("");

  const { redirect } = qs.parse(window.location.search);

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== "/") {
      if(redirect){
      navigate(`/?redirect=${location.pathname}`, { replace: true });}
      else{
        navigate(location.pathname, { replace: true })
      }
    }
    
  }, [isLoggedIn, location.pathname, navigate]);
  
  useEffect(() => {
    const token = localStorage.getItem(AppConfig.LOCAL_STORAGE_ACCESS_TOKEN_KEY);
    if (token) {
      setAccessToken(token);
    } else {
      setTimeout(() => {
        setShowLoader(false);
      }, 1000);
    }
  }, [triggerPostLogin]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await getUserProfile();
        const role = res.data.user.role;
// console.log("role in common",role);
        dispatch(setIsLoggedIn(true));
        dispatch(setUserObj(res.data.user));
        dispatch(setUserPermissions(res.data.permissions));

   
        const redirectPath =
          Array.isArray(redirect)
            ? redirect[0] || ""
            : typeof redirect === "string"
            ? redirect
            : "";

        switch (role) {
          case "superadmin":
            navigate(redirectPath ? redirectPath : all_routes.superAdminDashboard, { replace: true });
            break;
          case "admin":
            navigate(redirectPath ? redirectPath : all_routes.adminDashboard, { replace: true });
            break;
          case "teacher":
            navigate(redirectPath ? redirectPath : all_routes.teacherDashboard, { replace: true });
            break;
          case "student":
            navigate(redirectPath ? redirectPath : all_routes.studentDashboard, { replace: true });
            break;
          case "parent":
            navigate(redirectPath ? redirectPath : all_routes.parentDashboard, { replace: true });
            break;
          case "hostel":
            navigate(redirectPath ? redirectPath : all_routes.hostelDashboard, { replace: true });
            break;
          case "transport":
            navigate(redirectPath ? redirectPath : all_routes.transportDashboard, { replace: true });
            break;
          case "library":
            navigate(redirectPath ? redirectPath : all_routes.libraryDashboard, { replace: true });
            break;
          case "accounts":
            navigate(redirectPath ? redirectPath : all_routes.accountsDashboard, { replace: true });
            break;
          case "employee":
            navigate(redirectPath ? redirectPath : all_routes.employeeDashboard, { replace: true });
            break;
          default:
            navigate("/", { replace: true });
            break;
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem(AppConfig.LOCAL_STORAGE_ACCESS_TOKEN_KEY);
          dispatch(setIsLoggedIn(false));
          dispatch(setUserObj(null));
          dispatch(setUserPermissions([] as any));
          navigate("/", { replace: true });
        }
      } finally {
        setTimeout(() => {
          setShowLoader(false);
        }, 500);
      }
    };

    if (accessToken && !isLoggedIn) {
      fetchUserProfile();
    }
  }, [accessToken, isLoggedIn, dispatch,  redirect]);

  // const Preloader = () => {
  //   return (
  //     <div id="global-loader">
  //       <div className="page-loader"></div>
  //     </div>
  //   );
  // };

  return (
    <div className="account-page">
      <div className="main-wrapper">
        {showLoader ? <CustomLoader variant="dots" color="#3067e3" size={100} /> : <Outlet />}
      </div>
    </div>
  );
};

export default CommonRouteWrapper;