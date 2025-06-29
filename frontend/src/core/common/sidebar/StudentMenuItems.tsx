// import { Fragment, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { setDataLayout } from "../../../Store/themeSettingSlice";
// import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
// import { all_routes } from "../../../router/all_routes";
// import { getBaseUrl } from "../../../utils/general";

// const StudentMenuItems = () => {
//   const location = useLocation();
//   const dispatch = useAppDispatch();
//   const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
//   const userObj = useAppSelector((state) => state.auth.userObj);
//   const userPermissions = useAppSelector((state) => state.auth.userPermissions);

//   const [subOpen, setSubopen] = useState<any>("");
//   const [subsidebar, setSubsidebar] = useState("");

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

//   return (
//     <ul>
//       <li>
//         <h6 className="submenu-hdr">
//           <span>MAIN</span>
//         </h6>
//         <ul>
//           <li className="submenu">
//             <Link
//               to={getBaseUrl(isLoggedIn, userObj!.role)}
//               onClick={() =>
//                 handleClick("Dashboard", undefined, getLayoutClass("Dashboard"))
//               }
//               className={`${subOpen === "Dashboard" ? "subdrop" : ""} ${
//                 getBaseUrl(isLoggedIn, userObj!.role) === location.pathname
//                   ? "active"
//                   : ""
//               }`}
//             >
//               <i className="ti ti-layout-dashboard"></i>
//               <span>Dashboard</span>
//             </Link>
//           </li>

//           <li className="submenu">
//             <Link
//               to={all_routes.requestFeatures}
//               onClick={() =>
//                 handleClick(
//                   "Feature Request",
//                   undefined,
//                   getLayoutClass("Feature Request")
//                 )
//               }
//               className={`${subOpen === "Feature Request" ? "subdrop" : ""} ${
//                 all_routes.requestFeatures === location.pathname ? "active" : ""
//               }`}
//             >
//               <i className="ti ti-layout-dashboard"></i>
//               <span>Feature Request</span>
//             </Link>
//           </li>
//           <li className="submenu">
//             <Link
//               to={all_routes.requestFeatures}
//               onClick={() =>
//                 handleClick(
//                   "Feature Request",
//                   undefined,
//                   getLayoutClass("Feature Request")
//                 )
//               }
//               className={`${subOpen === "Feature Request" ? "subdrop" : ""} ${
//                 all_routes.requestFeatures === location.pathname ? "active" : ""
//               }`}
//             >
//               <i className="ti ti-layout-dashboard"></i>
//               <span>Feature Requests</span>
//             </Link>
//           </li>
//         </ul>
//       </li>

  
//     </ul>
//   );
// };

// export default StudentMenuItems;
import React, { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { all_routes } from "../../../router/all_routes";
import { setDataLayout } from "../../../Store/themeSettingSlice";
import { useAppSelector } from "../../../Store/hooks";
import { getBaseUrl } from "../../../utils/general";

interface SubItem {
  name: string;
  route?: string;
  icon?: string;
  hasSubItems?: boolean;
  subItems?: SubItem[];
}

interface Module {
  key: string;
  displayName: string;
  subItems: SubItem[];
}

const StudentMenuItems = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const userObj = useAppSelector((state) => state.auth.userObj);
  const userPermissions = useSelector((state: any) => state.auth.userPermissions);
  const [subOpen, setSubopen] = useState<any>("");
  const [subsidebar, setSubsidebar] = useState("");

  const toggleSidebar = (title: any) => {
    localStorage.setItem("menuOpened", title);
    if (title === subOpen) {
      setSubopen("");
    } else {
      setSubopen(title);
    }
  };

  const toggleSubsidebar = (subitem: any) => {
    if (subitem === subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
    }
  };

  const handleLayoutChange = (layout: string) => {
    dispatch(setDataLayout(layout));
  };

  // Updated handleClick to only toggle submenu for parent items, not for links
  // const handleClick = (label: any, themeSetting: any, layout: any, isSubmenuToggle = false) => {
  //   if (isSubmenuToggle) {
  //     toggleSidebar(label);
  //     if (themeSetting) {
  //       handleLayoutChange(layout);
  //     }
  //   }
  // };
   const handleClick = (label: any, themeSetting: any, layout: any) => {
    toggleSidebar(label);
    if (themeSetting) {
      handleLayoutChange(layout);
    }
  };

  const getLayoutClass = (label: any) => {
    switch (label) {
      case "Default":
        return "default_layout";
      case "Mini":
        return "mini_layout";
      case "Box":
        return "boxed_layout";
      case "Dark":
        return "dark_data_theme";
      case "RTL":
        return "rtl";
      default:
        return "";
    }
  };

  const STUDENT_MODULES: Module[] = [
    {
      key: "Academics",
      displayName: "Academics",
      subItems: [
        { name: "Get Their Class", route: all_routes.classes, icon: "ti ti-school" },
        { name: "View Attendance", route: all_routes.studentAttendance, icon: "ti ti-calendar-check" },
        { name: "View Result", route: all_routes.examResult, icon: "ti ti-award" },
        { name: "Submit Assignment", route: all_routes.assignment, icon: "ti ti-file-upload" },
        { name: "View PYQ", route: all_routes.uplaodPyq, icon: "ti ti-file-text" },
        { name: "Create Roadmap", route: all_routes.comingSoon, icon: "ti ti-map" },
      ],
    },
    {
      key: "Fees",
      displayName: "Fees",
      subItems: [
        { name: "Get Fees", route: all_routes.studentFees, icon: "ti ti-cash" },
        { name: "Pay Fees", route: all_routes.payfee, icon: "ti ti-credit-card" },
      ],
    },
    {
      key: "Library",
      displayName: "Library",
      subItems: [
        { name: "Borrow Book", route: all_routes.libraryBooks, icon: "ti ti-book" },
      ],
    },
    {
      key: "Services",
      displayName: "Services",
      subItems: [
        {
          name: "Hostel & Transport Info",
          hasSubItems: true,
          icon: "ti ti-building-community",
          subItems: [
            { name: "Hostel Info", route: all_routes.hostelList, icon: "ti ti-home" },
            { name: "Transport Info", route: all_routes.transportAssignVehicle, icon: "ti ti-bus" },
          ],
        },
      ],
    },
    {
      key: "Events",
      displayName: "Events",
      subItems: [
        { name: "View Events", route: all_routes.events, icon: "ti ti-calendar" },
      ],
    },
  ];

  useEffect(() => {
    setSubopen(localStorage.getItem("menuOpened"));
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

  return (
    <ul>
      <li>
        <h6 className="submenu-hdr">
          <span>MAIN</span>
        </h6>
        <ul>
          <li className="submenu">
                  <Link
                    to={all_routes.studentDashboard}
                    onClick={() =>
                      handleClick("Dashboard", undefined, getLayoutClass("Dashboard"))
                    }
                    className={`${subOpen === "Dashboard" ? "subdrop" : ""} ${
                      getBaseUrl(isLoggedIn, userObj!.role) === location.pathname
                        ? "active"
                        : ""
                    }`}
                  >
                    <i className="ti ti-layout-dashboard"></i>
                    <span>Dashboard</span>
                  </Link>
          </li>
        </ul>
      </li>
      {userObj && userObj.role ? (
        <Fragment>
          {STUDENT_MODULES.map((module) => (
            <li key={module.key}>
              <h6 className="submenu-hdr">
                <span>{module.displayName}</span>
              </h6>
              <ul>
                {module.subItems.map((item) => (
                  <li className="submenu" key={item.name}>
                      {item.hasSubItems ? (
                        <>
                          <Link
                            to="#"
                            onClick={() => {
                              handleClick(item.name, undefined, getLayoutClass(item.name), true);
                              toggleSubsidebar(item.name);
                            }}
                            className={`${subOpen === item.name ? "subdrop" : ""} ${
                              item.subItems
                                ?.map((sub) => sub.route)
                                .includes(location.pathname)
                                ? "active"
                                : ""
                            } ${subsidebar === item.name ? "subdrop" : ""}`}
                          >
                            <i className={item.icon}></i>
                            <span>{item.name}</span>
                            {item.subItems && <span className="menu-arrow"></span>}
                          </Link>
                          {subsidebar === item.name && item.subItems && (
                            <ul
                              style={{
                                display: subsidebar === item.name ? "block" : "none",
                              }}
                            >
                              {item.subItems.map((subItem) => (
                                <li key={subItem.name}>
                                  <Link
                                    to={subItem.route || "#"}
                                    onClick={() =>
                                      handleClick(
                                        subItem.name,
                                        undefined,
                                        getLayoutClass(subItem.name)
                                      )
                                    }
                                    className={`${subOpen === subItem.name ? "subdrop" : ""} ${
                                      subItem.route === location.pathname ? "active" : ""
                                    }`}
                                  >
                                    {subItem.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      ) : (
                        <Link
                          to={item.route || "#"}
                          onClick={() =>
                            handleClick(item.name, undefined, getLayoutClass(item.name))
                          }
                          className={`${subOpen === item.name ? "subdrop" : ""} ${
                            item.route === location.pathname ? "active" : ""
                          }`}
                        >
                          <i className={item.icon}></i>
                          <span>{item.name}</span>
                        </Link>
                      )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </Fragment>
      ) : null}
    </ul>
  );
};

export default StudentMenuItems;