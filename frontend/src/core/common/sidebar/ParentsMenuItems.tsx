import React, { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
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

const ParentsMenuItems: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useAppSelector((state: any) => state.auth.isLoggedIn);
  const userObj = useAppSelector((state: any) => state.auth.userObj);
  const userPermissions = useAppSelector((state: any) => state.auth.userPermissions);
  const [subOpen, setSubopen] = useState<string>("");
  const [subsidebar, setSubsidebar] = useState<string>("");

  const toggleSidebar = (title: string) => {
    localStorage.setItem("menuOpened", title);
    setSubopen(title === subOpen ? "" : title);
  };

  const toggleSubsidebar = (subitem: string) => {
    setSubsidebar(subitem === subsidebar ? "" : subitem);
  };

  const handleLayoutChange = (layout: string) => {
    dispatch(setDataLayout(layout));
  };

  const handleClick = (label: string, themeSetting?: boolean, layout?: string) => {
    toggleSidebar(label);
    if (themeSetting && layout) handleLayoutChange(layout);
  };

  const getLayoutClass = (label: string): string => {
    switch (label) {
      case "Default": return "default_layout";
      case "Mini": return "mini_layout";
      case "Box": return "boxed_layout";
      case "Dark": return "dark_data_theme";
      case "RTL": return "rtl";
      default: return "";
    }
  };

  const PARENT_MODULES: Module[] = [
    {
      key: "ChildAcademics",
      displayName: "Child Academics",
      subItems: [
        { name: "Get Child's Class", route: all_routes.studentTimeTable, icon: "ti ti-school" },
        { name: "View Attendance", route: all_routes.studentAttendance, icon: "ti ti-calendar-check" },
        { name: "View Result", route: all_routes.studentResult, icon: "ti ti-award" },
        { name: "View Assignment & Homework", route: all_routes.assignment, icon: "ti ti-file-text" },
      ],
    },
    {
      key: "ChildFees",
      displayName: "Child Fees",
      subItems: [
        { name: "Get Fees", route: all_routes.studentFees, icon: "ti ti-cash" },
        { name: "Pay Fees", route: all_routes.payfee, icon: "ti ti-credit-card" },
      ],
    },
    {
      key: "ChildLibrary",
      displayName: "Child Library",
      subItems: [
        { name: "View Borrowed Books", route: all_routes.libraryIssueBook, icon: "ti ti-book" },
      ],
    },
    {
      key: "ChildServices",
      displayName: "hostel & Transport",
      subItems: [
        {
          // name: "Hostel & Transport Info",
          // hasSubItems: true,
          // icon: "ti ti-building-community",
          // subItems: userPermissions?.HostelModule?.access || userPermissions?.TransportModule?.access ? [
          //   ...(userPermissions?.HostelModule?.access ? [{ name: "Hostel Info", route: all_routes.hostelDashboard, icon: "ti ti-home" }] : []),
          //   ...(userPermissions?.TransportModule?.access ? [{ name: "Transport Info", route: all_routes.transportDashboard, icon: "ti ti-bus" }] : []),
          // ] : [],
          name: "child hostel", route: all_routes.hostelList, icon: "ti ti-book" },
         { name: "child transport", route: all_routes.transportVehicle, icon: "ti ti-book"} ,
        
      ],
    },
  ];

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

  return (
    <ul>
      <li>
        <h6 className="submenu-hdr">
          <span>MAIN</span>
        </h6>
        <ul>
          <li className="submenu">
            <Link
              to={all_routes.parentDashboard}
              onClick={() => handleClick("Dashboard", undefined, getLayoutClass("Dashboard"))}
              className={`${subOpen === "Dashboard" ? "subdrop" : ""} ${
                getBaseUrl(isLoggedIn, userObj?.role) === location.pathname ? "active" : ""
              }`}
            >
              <i className="ti ti-layout-dashboard"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          {/* <li className="submenu">
            <Link
              to={all_routes.requestFeatures}
              onClick={() => handleClick("Feature Request", undefined, getLayoutClass("Feature Request"))}
              className={`${subOpen === "Feature Request" ? "subdrop" : ""} ${
                all_routes.requestFeatures === location.pathname ? "active" : ""
              }`}
            >
              <i className="ti ti-layout-dashboard"></i>
              <span>Feature Request</span>
            </Link>
          </li> */}
        </ul>
      </li>
      {userObj && userObj.role ? (
        <Fragment>
          {PARENT_MODULES.map((module) => (
            <li key={module.key}>
              <h6 className="submenu-hdr">
                <span>{module.displayName}</span>
              </h6>
              <ul>
                {module.subItems.map((item) => (
                  <li className="submenu" key={item.name}>
                    {item.hasSubItems && item.subItems && item.subItems.length > 0 ? (
                      <>
                        <Link
                          to="#"
                          onClick={() => {
                            handleClick(item.name, undefined, getLayoutClass(item.name));
                            toggleSubsidebar(item.name);
                          }}
                          className={`${subOpen === item.name ? "subdrop" : ""} ${
                            item.subItems.map((sub) => sub.route).includes(location.pathname)
                              ? "active"
                              : ""
                          } ${subsidebar === item.name ? "subdrop" : ""}`}
                        >
                          <i className={item.icon}></i>
                          <span>{item.name}</span>
                          {item.subItems && <span className="menu-arrow"></span>}
                        </Link>
                        {subsidebar === item.name && item.subItems && (
                          <ul style={{ display: subsidebar === item.name ? "block" : "none" }}>
                            {item.subItems.map((subItem) => (
                              <li key={subItem.name}>
                                <Link
                                  to={subItem.route || "#"}
                                  onClick={() =>
                                    handleClick(subItem.name, undefined, getLayoutClass(subItem.name))
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
                        onClick={() => handleClick(item.name, undefined, getLayoutClass(item.name))}
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

export default ParentsMenuItems;