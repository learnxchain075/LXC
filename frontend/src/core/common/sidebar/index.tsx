// import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import Scrollbars from "react-custom-scrollbars-2";
// import { getSidebarData, SidebarItem } from "../../data/json/sidebarData";
// import ImageWithBasePath from "../imageWithBasePath";
// import "../../../style/icon/tabler-icons/webfont/tabler-icons.css";
// import { setExpandMenu } from "../../../Store/sidebarSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { resetAllMode, setDataLayout } from "../../../Store/themeSettingSlice";
// import usePreviousRoute from "./usePreviousRoute";
// import SchoolInfo from "./headerName";
// import { FeaturesListObj } from "../../../config/constants";
// import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
// import { all_routes } from "../../../router/all_routes";
// import { getBaseUrl } from "../../../utils/general";
// import SuperAdminMenuItems from "./SuperAdminMenuItems";
// import AdminMenuItems from "./AdminMenuItems";
// import TeacherMenuItems from "./TeacherMenuItems";
// import StudentDasboard from "../../../dashboard/studentDashboard";
// import StudentDetails from "../../../pages/Admin/peoples/students/student-details/studentDetails";
// import StudentMenuItems from "./StudentMenuItems";
// import useMobileDetection from "../mobileDetection";

// const Sidebar = () => {
//   const location = useLocation();
//   const dispatch = useAppDispatch();
//   const previousLocation = usePreviousRoute();
//   const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
//   const userObj = useAppSelector((state) => state.auth.userObj);
//   const userPermissions = useAppSelector((state) => state.auth.userPermissions);

//   const [subOpen, setSubopen] = useState<any>("");
//   const [subsidebar, setSubsidebar] = useState("");
//   const [sidebarData, setSidebarData] = useState<Array<SidebarItem>>([]);
//   // const [isMobile, setIsMobile] = useState(false);
//   const mobileSidebar = useSelector(
//     (state: any) => state.sidebarSlice.mobileSidebar
//   );
  
//   // useEffect(() => {
//   //   const handleResize = () => {
//   //     setIsMobile(window.innerWidth < 768);
//   //   };

//   //   window.addEventListener("resize", handleResize);
//   //   handleResize();
//   //   return () => window.removeEventListener("resize", handleResize);
//   // }, []);

 

  
//   const toggleSidebar = (title: any) => {
//     localStorage.setItem("menuOpened", title);
//     if (title === subOpen) {
//       setSubopen("");
//     } else {
//       setSubopen(title);
//     }
//   };

//   const toggleSubsidebar = (subitem: any) => {
//     if (subitem === subsidebar) {
//       setSubsidebar("");
//     } else {
//       setSubsidebar(subitem);
//     }
//   };

//   const handleLayoutChange = (layout: string) => {
//     dispatch(setDataLayout(layout));
//   };

//   const handleClick = (label: any, themeSetting: any, layout: any) => {
//     toggleSidebar(label);
//     if (themeSetting) {
//       handleLayoutChange(layout);
//     }
//   };

//   const getLayoutClass = (label: any) => {
//     switch (label) {
//       case "Default":
//         return "default_layout";
//       case "Mini":
//         return "mini_layout";
//       case "Box":
//         return "boxed_layout";
//       case "Dark":
//         return "dark_data_theme";
//       case "RTL":
//         return "rtl";
//       default:
//         return "";
//     }
//   };

//   useEffect(() => {
//     if (userObj && userObj.role) {
//       // Get filtered sidebar data based on the role
//       setSidebarData(getSidebarData(userObj.role));
//     }
//   }, [userObj]);

//   useEffect(() => {
//     const layoutPages = [
//       "/layout-dark",
//       "/layout-rtl",
//       "/layout-mini",
//       "/layout-box",
//       "/layout-default",
//     ];

//     const isCurrentLayoutPage = layoutPages.some((path) =>
//       location.pathname.includes(path)
//     );
//     const isPreviousLayoutPage =
//       previousLocation &&
//       layoutPages.some((path) => previousLocation.pathname.includes(path));

//     if (isPreviousLayoutPage && !isCurrentLayoutPage) {
//       dispatch(resetAllMode());
//     }
//   }, [location, previousLocation, dispatch]);

//   useEffect(() => {
//     setSubopen(localStorage.getItem("menuOpened"));
//     // Select all 'submenu' elements
//     const submenus = document.querySelectorAll(".submenu");
//     // Loop through each 'submenu'
//     submenus.forEach((submenu) => {
//       // Find all 'li' elements within the 'submenu'
//       const listItems = submenu.querySelectorAll("li");
//       submenu.classList.remove("active");
//       // Check if any 'li' has the 'active' class
//       listItems.forEach((item) => {
//         if (item.classList.contains("active")) {
//           // Add 'active' class to the 'submenu'
//           submenu.classList.add("active");
//           return;
//         }
//       });
//     });
//   }, [location.pathname]);

//   const onMouseEnter = () => {
//     dispatch(setExpandMenu(true));
//   };
//   const onMouseLeave = () => {
//     dispatch(setExpandMenu(false));
//   };
  
// //    if( userObj && userObj.role === "student"  && className === "d-md-none ") {
// // return (

// //   <StudentMenuItems/>
// // );
// //    }
// const ismobile=useMobileDetection();

// if (userObj && userObj.role === "student") {
//   if (ismobile) {
   
//     return (
//       <>
//       <div className="sidebar" id="sidebar" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
//         <Scrollbars>
//           <div className="sidebar-inner slimscroll">
//             <div id="sidebar-menu" className="sidebar-menu">
//               <SchoolInfo />
//               <StudentMenuItems />
//             </div>
//           </div>
          
//         </Scrollbars>
//       </div>
//       </>
//     );
//   } else {
   
//     return null; 
//   }
// }
//   return (
//     <>
 
//       <div
//         className="sidebar"
//         id="sidebar"
//         onMouseEnter={onMouseEnter}
//         onMouseLeave={onMouseLeave}
//       >
//         <Scrollbars>
//           <div className="sidebar-inner slimscroll">
//             <div id="sidebar-menu" className="sidebar-menu">
//               {/* <ul>
//                 <li>
//                   <Link
//                     to="#"
//                     className="d-flex align-items-center border bg-white rounded p-2 mb-4"
//                   >
//                     <ImageWithBasePath
//                       src="assets/img/icons/global-img.svg"
//                       className="avatar avatar-md img-fluid rounded"
//                       alt="Profile"
//                     />
//                     <span className="text-dark ms-2 fw-normal">
//                       Global International
//                     </span>
//                   </Link>
//                 </li>
//               </ul> */}

//               {/* //added */}
//               <SchoolInfo />

//               {userObj && userObj.role === "superadmin" ? (
//                 <SuperAdminMenuItems />
//               ) : null}

//               {userObj && userObj.role === "admin" ? <AdminMenuItems /> : null}
//               {/* added teacher */}
//               {userObj && userObj.role === "teacher" ? <TeacherMenuItems/> : null} 
//             {/* on mobile view show the student menu  */}
           
//             </div>
//           </div>
//         </Scrollbars>
//       </div>
//     </>
//   );
// };

// export default Sidebar;


// import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import Scrollbars from "react-custom-scrollbars-2";
// import { getSidebarData, SidebarItem } from "../../data/json/sidebarData";
// import ImageWithBasePath from "../imageWithBasePath";
// import "../../../style/icon/tabler-icons/webfont/tabler-icons.css";
// import { setExpandMenu } from "../../../Store/sidebarSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { resetAllMode, setDataLayout } from "../../../Store/themeSettingSlice";
// import usePreviousRoute from "./usePreviousRoute";
// import SchoolInfo from "./headerName";
// import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
// import { all_routes } from "../../../router/all_routes";
// import { getBaseUrl } from "../../../utils/general";
// import SuperAdminMenuItems from "./SuperAdminMenuItems";
// import AdminMenuItems from "./AdminMenuItems";
// import TeacherMenuItems from "./TeacherMenuItems";
// import StudentMenuItems from "./StudentMenuItems";
// import useMobileDetection from "../mobileDetection";
// import ParentsMenuItems from "./ParentsMenuItems";

// interface AuthState {
//   isLoggedIn: boolean;
//   userObj: { role: string } | null;
//   userPermissions: Record<string, any>;
// }

// interface SidebarState {
//   mobileSidebar: boolean;
// }

// interface ThemeSettingState {
//   dataLayout: string;
// }


// const Sidebar: React.FC = () => {
//   const location = useLocation();
//   const dispatch = useAppDispatch();
//   const previousLocation = usePreviousRoute();
//   const isLoggedIn = useAppSelector((state: any) => state.auth.isLoggedIn);
//   const userObj = useAppSelector((state: any) => state.auth.userObj);
//   const userPermissions = useAppSelector((state: any) => state.auth.userPermissions);
//   const mobileSidebar = useSelector((state: any) => state.sidebarSlice.mobileSidebar);
//   const isMobile = useMobileDetection();

//   const [subOpen, setSubopen] = useState<string>("");
//   const [subsidebar, setSubsidebar] = useState<string>("");
//   const [sidebarData, setSidebarData] = useState<SidebarItem[]>([]);

//   const toggleSidebar = (title: string) => {
//     localStorage.setItem("menuOpened", title);
//     setSubopen(title === subOpen ? "" : title);
//   };

//   const toggleSubsidebar = (subitem: string) => {
//     setSubsidebar(subitem === subsidebar ? "" : subitem);
//   };

//   const handleLayoutChange = (layout: string) => dispatch(setDataLayout(layout));

//   const handleClick = (label: string, themeSetting?: boolean, layout?: string) => {
//     toggleSidebar(label);
//     if (themeSetting && layout) handleLayoutChange(layout);
//   };

//   const getLayoutClass = (label: string): string => {
//     switch (label) {
//       case "Default": return "default_layout";
//       case "Mini": return "mini_layout";
//       case "Box": return "boxed_layout";
//       case "Dark": return "dark_data_theme";
//       case "RTL": return "rtl";
//       default: return "";
//     }
//   };

//   useEffect(() => {
//     if (userObj && userObj.role) {
//       setSidebarData(getSidebarData(userObj.role));
//     }
//   }, [userObj]);

//   useEffect(() => {
//     const layoutPages = ["/layout-dark", "/layout-rtl", "/layout-mini", "/layout-box", "/layout-default"];
//     const isCurrentLayoutPage = layoutPages.some((path) => location.pathname.includes(path));
//     const isPreviousLayoutPage = previousLocation && layoutPages.some((path) => previousLocation.pathname.includes(path));

//     if (isPreviousLayoutPage && !isCurrentLayoutPage) {
//       dispatch(resetAllMode());
//     }
//   }, [location, previousLocation, dispatch]);

//   useEffect(() => {
//     setSubopen(localStorage.getItem("menuOpened") || "");
//     const submenus = document.querySelectorAll(".submenu");
//     submenus.forEach((submenu) => {
//       const listItems = submenu.querySelectorAll("li");
//       submenu.classList.remove("active");
//       listItems.forEach((item) => {
//         if (item.classList.contains("active")) {
//           submenu.classList.add("active");
//         }
//       });
//     });
//   }, [location.pathname]);

//   const onMouseEnter = () => dispatch(setExpandMenu(true));
//   const onMouseLeave = () => dispatch(setExpandMenu(false));

 
//   const renderSidebar = (MenuItemsComponent: React.FC) => (
//     <div className="sidebar" id="sidebar" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
//       <Scrollbars>
//         <div className="sidebar-inner slimscroll">
//           <div id="sidebar-menu" className="sidebar-menu">
//             <SchoolInfo />
//             <MenuItemsComponent />
//           </div>
//         </div>
//       </Scrollbars>
//     </div>
//   );

//   if (!userObj) return null; 

//   const roleMenuMap: Record<string, React.FC | null> = {
//     student: StudentMenuItems,
//     teacher: TeacherMenuItems,
//     parent: ParentsMenuItems,
//     admin: AdminMenuItems,
//     superadmin: SuperAdminMenuItems,
//   };

//   const MenuItemsComponent = roleMenuMap[userObj.role];


//   if (["student", "teacher", "parent"].includes(userObj.role)) {
//     return isMobile && MenuItemsComponent ? renderSidebar(MenuItemsComponent) : null;
//   }


//   return MenuItemsComponent ? renderSidebar(MenuItemsComponent) : null;
// };

// export default Sidebar;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Scrollbars from "react-custom-scrollbars-2";
import { getSidebarData, SidebarItem } from "../../data/json/sidebarData";
import "../../../style/icon/tabler-icons/webfont/tabler-icons.css";
import { setExpandMenu, setMobileSidebar } from "../../../Store/sidebarSlice";
import { useSelector } from "react-redux";
import { resetAllMode, setDataLayout } from "../../../Store/themeSettingSlice";
import usePreviousRoute from "./usePreviousRoute";
import SchoolInfo from "./headerName";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import SuperAdminMenuItems from "./SuperAdminMenuItems";
import AdminMenuItems from "./AdminMenuItems";
import TeacherMenuItems from "./TeacherMenuItems";
import StudentMenuItems from "./StudentMenuItems";
import useMobileDetection from "../mobileDetection";
import ParentsMenuItems from "./ParentsMenuItems";
import EmployeeMenuItems from "./EmployeeMenuItems";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const previousLocation = usePreviousRoute();
  const userObj = useAppSelector((state: any) => state.auth.userObj);
  const mobileSidebar = useSelector((state: any) => state.sidebarSlice.mobileSidebar);
  const isMobile = useMobileDetection();

  const [subOpen, setSubopen] = useState<string>("");
  const [subsidebar, setSubsidebar] = useState<string>("");
  const [sidebarData, setSidebarData] = useState<SidebarItem[]>([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = (title: string) => {
    localStorage.setItem("menuOpened", title);
    setSubopen(title === subOpen ? "" : title);
  };

  const toggleSubsidebar = (subitem: string) => {
    setSubsidebar(subitem === subsidebar ? "" : subitem);
  };

  const handleLayoutChange = (layout: string) => dispatch(setDataLayout(layout));

  const handleClick = (label: string, themeSetting?: boolean, layout?: string) => {
    toggleSidebar(label);
    if (themeSetting && layout) handleLayoutChange(layout);
  };

  useEffect(() => {
    if (userObj && userObj.role) {
      setSidebarData(getSidebarData(userObj.role));
    }
  }, [userObj]);

  useEffect(() => {
    const layoutPages = ["/layout-dark", "/layout-rtl", "/layout-mini", "/layout-box", "/layout-default"];
    const isCurrentLayoutPage = layoutPages.some((path) => location.pathname.includes(path));
    const isPreviousLayoutPage = previousLocation && layoutPages.some((path) => previousLocation.pathname.includes(path));

    if (isPreviousLayoutPage && !isCurrentLayoutPage) {
      dispatch(resetAllMode());
    }
  }, [location, previousLocation, dispatch]);

  useEffect(() => {
    setSubopen(localStorage.getItem("menuOpened") || "");
    const submenus = document.querySelectorAll(".submenu");
    submenus.forEach((submenu) => {
      const listItems = submenu.querySelectorAll("li");
      submenu.classList.remove("active");
      listItems.forEach((item) => {
        if (item.classList.contains("active")) {
          submenu.classList.add("active");
        }
      });
    });
  }, [location.pathname]);

  const onMouseEnter = () => dispatch(setExpandMenu(true));
  const onMouseLeave = () => dispatch(setExpandMenu(false));

  const handleMobileItemClick = () => {
    if (isMobile) dispatch(setMobileSidebar(false));
  };

  const handleHamburgerClick = () => {
    dispatch(setMobileSidebar(!mobileSidebar));
  };

  const renderSidebar = (MenuItemsComponent: React.FC) => (
    <>
      {isMobile && (
        <button
          onClick={handleHamburgerClick}
          className="btn p-1 bg-transparent border-0 shadow-none"
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1060,
            outline: "none",
          }}
        >
          <i
            className="ti ti-menu-2"
            style={{
              fontSize:
                screenWidth < 480 ? "22px" :
                screenWidth < 768 ? "32px" :
                "32px",
            }}
          ></i>
        </button>
      )}
      <div
        className={`sidebar ${isMobile ? "d-block d-md-none   p-3" : "d-none d-md-block"}`}
        id="sidebar"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          zIndex: 1050,
          width: isMobile ?"250px":"",
          left: isMobile ? (mobileSidebar ? "0" : "-100%") : undefined,
          transition: isMobile ? "left 0.3s ease-in-out" : undefined,
          backgroundColor: "var(--bs-body-bg)",
          color: "var(--bs-body-color)",
          borderRight: "none"
        }}
      >
        <Scrollbars>
          <div className="sidebar-inner">
            <div id="sidebar-menu" className="sidebar-menu" onClick={handleMobileItemClick}>
              <SchoolInfo />
              <MenuItemsComponent />
            </div>
          </div>
        </Scrollbars>
      </div>
    </>
  );

  if (!userObj) return null;

  const roleMenuMap: Record<string, React.FC | null> = {
    student: StudentMenuItems,
    teacher: TeacherMenuItems,
    parent: ParentsMenuItems,
    admin: AdminMenuItems,
    superadmin: SuperAdminMenuItems,
    employee: EmployeeMenuItems,
  };

  const MenuItemsComponent = roleMenuMap[userObj.role];

  if (["student", "teacher", "parent"].includes(userObj.role)) {
    return isMobile && MenuItemsComponent ? renderSidebar(MenuItemsComponent) : null;
  }

  return MenuItemsComponent ? renderSidebar(MenuItemsComponent) : null;
};

export default Sidebar;