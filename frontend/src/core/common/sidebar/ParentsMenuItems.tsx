import React, { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { all_routes } from "../../../router/all_routes";
import { setDataLayout } from "../../../Store/themeSettingSlice";
import { useAppSelector } from "../../../Store/hooks";
import { getBaseUrl } from "../../../utils/general";
import { getStudentId } from "../../../utils/general";

interface SubItem {
  name: string;
  route?: string;
  icon?: string;
  hasSubItems?: boolean;
  subItems?: SubItem[];
  modalType?: string;
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
  const [activeModal, setActiveModal] = useState<string | null>(null);

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

  const handleModalClick = (modalType: string) => {
    const studentId = getStudentId();
    if (!studentId) {
      const event = new CustomEvent('showToast', {
        detail: { type: 'error', message: 'Please select a student first' }
      });
      window.dispatchEvent(event);
      return;
    }
    
    const event = new CustomEvent('openParentModal', {
      detail: { modalType, studentId }
    });
    window.dispatchEvent(event);
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
        { name: "Student Details", modalType: "studentDetails", icon: "ti ti-user" },
        { name: "Student Timetable", modalType: "timetable", icon: "ti ti-calendar-time" },
        { name: "Student Attendance", modalType: "attendance", icon: "ti ti-calendar-check" },
        { name: "Student Results", modalType: "examResults", icon: "ti ti-award" },
        { name: "Student ID Card", route: all_routes.studentIdCard, icon: "ti ti-id" },
      ],
    },
    {
      key: "ChildFees",
      displayName: "Child Fees",
      subItems: [
        { name: "Student Fees", modalType: "fees", icon: "ti ti-cash" },
        //{ name: "Pay Fees", route: all_routes.payfee, icon: "ti ti-credit-card" },
        { name: "Fees Overview", route: all_routes.FeesOverviewstudent, icon: "ti ti-receipt" },
      ],
    },
    {
      key: "ChildAssignments",
      displayName: "Assignments & Homework",
      subItems: [
        { name: "Assignments & Homework", modalType: "assignments", icon: "ti ti-book" },
      ],
    },
    {
      key: "ChildCommunication",
      displayName: "Communication",
      subItems: [
        { name: "Notices & Events", modalType: "notices", icon: "ti ti-bell" },
        { name: "Notice Board", route: all_routes.noticeBoard, icon: "ti ti-bell" },
        { name: "Events", route: all_routes.events, icon: "ti ti-calendar-event" },
        { name: "Contact Messages", route: all_routes.contactMessages, icon: "ti ti-message-circle" },
      ],
    },
    // {
    //   key: "ChildServices",
    //   displayName: "Hostel & Transport",
    //   subItems: [
    //     { name: "Hostel Information", route: all_routes.hostelList, icon: "ti ti-home" },
    //     { name: "Transport Information", route: all_routes.transportVehicle, icon: "ti ti-bus" },
    //     { name: "Transport Routes", route: all_routes.transportRoutes, icon: "ti ti-route" },
    //     { name: "Pickup Points", route: all_routes.transportPickupPoints, icon: "ti ti-map-pin" },
    //   ],
    // },
    // {
    //   key: "ChildReports",
    //   displayName: "Reports & Analytics",
    //   subItems: [
    //     { name: "Attendance Report", route: all_routes.attendanceReport, icon: "ti ti-chart-line" },
    //     { name: "Student Report", route: all_routes.studentReport, icon: "ti ti-report" },
    //     { name: "Fees Report", route: all_routes.feesReport, icon: "ti ti-chart-pie" },
    //     { name: "Grade Report", route: all_routes.gradeReport, icon: "ti ti-chart-bar" },
    //   ],
    // },
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
              <i className="ti ti-lightbulb"></i>
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
                        onClick={() => {
                          if (item.modalType) {
                            handleModalClick(item.modalType);
                          } else {
                            handleClick(item.name, undefined, getLayoutClass(item.name));
                          }
                        }}
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