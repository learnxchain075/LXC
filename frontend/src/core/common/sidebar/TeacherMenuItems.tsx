import { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { setDataLayout } from "../../../Store/themeSettingSlice";
import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
import { all_routes } from "../../../router/all_routes";
import { getBaseUrl } from "../../../utils/general";
import useMobileDetection from "../mobileDetection";

interface SubItem {
  name: string;
  route?: string;
  icon?: string;
  hasSubItems?: boolean;
  subItems?: SubItem[];
}

interface Module {
  displayName: string;
  subItems: SubItem[];
}

const TeacherMenuItems = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const userObj = useAppSelector((state) => state.auth.userObj);
  const isMobile = useMobileDetection();

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

  const handleClick = (label: any, themeSetting: any, layout: any) => {
    toggleSidebar(label);
    if (themeSetting) {
      handleLayoutChange(layout);
    }

    if (isMobile) {
      setSubopen("");
      setSubsidebar("");
    
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

  // const MODULES: Module[] = [
  //   {
  //     displayName: "Classes",
  //     subItems: [
  //       { name: "Get Thier Classes", route: all_routes.classesLists, icon: "ti ti-calendar-check" },
  //       { name: "Student of thier Classes", route: all_routes.gettheirstudent, icon: "ti ti-report" },
  //     ]
  //   },
  //   {
  //     displayName: "Academics",
  //     subItems: [
  //       { name: "Create Exam", route: all_routes.examSchedule, icon: "ti ti-user-plus" },
  //       { name: "Result", route: all_routes.examResult, icon: "ti ti-notebook" },
  //     ]
  //   },
  //   {
  //     displayName: "PYQ Upload",
  //     subItems: [
  //       { name: "Upload", route: all_routes.uplaodPyq, icon: "ti ti-user-plus" },
  //     ]
  //   },
  //   {
  //     displayName: "HomeWork",
  //     subItems: [
  //       { name: "Assignment", route: all_routes.assignment, icon: "ti ti-user-plus" },
  //       { name: "Homework", route: all_routes.homeclasses, icon: "ti ti-user-plus" },
  //     ]
  //   },
  //   {
  //     displayName: "Attendance",
  //     subItems: [
  //       { name: "Teacher Attendance", route: all_routes.teacherAttendance, icon: "ti ti-calendar-check" },
  //       { name: "Student Attedance", route: all_routes.studentAttendance, icon: "ti ti-report" },
  //     ]
  //   },
  //   {
  //     displayName: "Self Enhancment",
  //     subItems: [
  //       { name: "Self Enhancment", route: all_routes.comingSoon, icon: "ti ti-user-plus" },
  //     ]
  //   },
  //   {
  //     displayName: "Support",
  //     subItems: [
  //       { name: "Contact Messages", route: all_routes.contactMessages, icon: "ti ti-mail" },
  //       { name: "Tickets", route: all_routes.tickets, icon: "ti ti-ticket" }
  //     ]
  //   }
  // ];
const MODULES: Module[] = [
  {
    displayName: "Profile",
    subItems: [
      { name: "Teacher Details", route: all_routes.teacherDetails, icon: "ti ti-id-badge" },
      { name: "Routine", route: all_routes.teachersRoutine, icon: "ti ti-calendar-time" },
      { name: "Leave", route: all_routes.teacherLeaves, icon: "ti ti-calendar-off" },
      { name: "Salary", route: all_routes.teacherSalary, icon: "ti ti-currency-rupee" }
    ]
  },
  {
    displayName: "Classes",
    subItems: [
      { name: "My Classes", route: all_routes.MyClassesWithStudents, icon: "ti ti-users-group" }
    ]
  },
  {
    displayName: "Academics",
    subItems: [
      { name: "Academic Uploads", route: all_routes.AcademicUploads, icon: "ti ti-upload" },
      { name: "Exam Schedule", route: all_routes.examSchedule, icon: "ti ti-calendar" }
    ]
  },
  {
    displayName: "Growth",
    subItems: [
      { name: "Self Enhancement", route: all_routes.SelfEnhancement, icon: "ti ti-bulb" },
      { name: "Doubt Forum", route: all_routes.DoubtForum, icon: "ti ti-message-circle" }
    ]
  },
  {
    displayName: "Support",
    subItems: [
      { name: "Tickets", route: all_routes.tickets, icon: "ti ti-ticket" }
    ]
  }
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
    <>
      <ul>
        <li>
          <h6 className="submenu-hdr">
            <span>MAIN</span>
          </h6>
          <ul>
            <li className="submenu">
              <Link
                to={all_routes.teacherDashboard}
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
            {MODULES.map((module, index) => (
              <li key={index}>
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
                              handleClick(item.name, undefined, getLayoutClass(item.name));
                              toggleSubsidebar(item.name);
                            }}
                            className={`${subOpen === item.name ? "subdrop" : ""
                              } ${item.subItems
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
                            <ul>
                              {item.subItems.map((subItem) => (
                                <li key={subItem.name}>
                                  <Link
                                    to={subItem.route || "#"}
                                    onClick={() =>
                                      handleClick(subItem.name, undefined, getLayoutClass(subItem.name))
                                    }
                                    className={`${subOpen === subItem.name ? "subdrop" : ""
                                      } ${subItem.route === location.pathname ? "active" : ""}`}
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
                          className={`${subOpen === item.name ? "subdrop" : ""} ${item.route === location.pathname ? "active" : ""
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
    </>
  );
};

export default TeacherMenuItems;
