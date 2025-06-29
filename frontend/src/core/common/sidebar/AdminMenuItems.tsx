// import { Fragment, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { setDataLayout } from "../../../Store/themeSettingSlice";
// import { useAppDispatch, useAppSelector } from "../../../Store/hooks";
// import { all_routes } from "../../../router/all_routes";
// import { getBaseUrl } from "../../../utils/general";

// const AdminMenuItems = () => {
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
//         </ul>
//       </li>

//       {userObj && userObj.role && userPermissions ? (
//         <Fragment>
//           {/* HRM Module */}
//           {userPermissions["HRMModule"] &&
//           userPermissions["HRMModule"].access ? (
//             <li>
//               <h6 className="submenu-hdr">
//                 <span>HRM</span>
//               </h6>
//               <ul>
//                 <li className="submenu">
//                   <Link
//                     to={all_routes.addSchools}
//                     onClick={() =>
//                       handleClick(
//                         "Add School",
//                         undefined,
//                         getLayoutClass("Add School")
//                       )
//                     }
//                     className={`${subOpen === "Add School" ? "subdrop" : ""} ${
//                       all_routes.addSchools === location.pathname
//                         ? "active"
//                         : ""
//                     }`}
//                   >
//                     <i className="ti ti-page-break"></i>
//                     <span>Add School</span>
//                   </Link>
//                 </li>
//                 <li className="submenu">
//                   <Link
//                     to={all_routes.featuresRequestList}
//                     onClick={() =>
//                       handleClick(
//                         "Feature Requests List",
//                         undefined,
//                         getLayoutClass("Feature Requests List")
//                       )
//                     }
//                     className={`${
//                       subOpen === "Feature Requests List" ? "subdrop" : ""
//                     } ${
//                       all_routes.featuresRequestList === location.pathname
//                         ? "active"
//                         : ""
//                     }`}
//                   >
//                     <i className="ti ti-page-break"></i>
//                     <span>Feature Requests List</span>
//                   </Link>
//                 </li>
//                 <li className="submenu">
//                   <Link
//                     to={all_routes.getSchools}
//                     onClick={() =>
//                       handleClick(
//                         "Get All Schools",
//                         undefined,
//                         getLayoutClass("Get All Schools")
//                       )
//                     }
//                     className={`${
//                       subOpen === "Get All Schools" ? "subdrop" : ""
//                     } ${
//                       all_routes.getSchools === location.pathname
//                         ? "active"
//                         : ""
//                     }`}
//                   >
//                     <i className="ti ti-page-break"></i>
//                     <span>Get All Schools</span>
//                   </Link>
//                 </li>
//               </ul>
//             </li>
//           ) : null}
//         </Fragment>
//       ) : null}
//     </ul>
//   );
// };

// export default AdminMenuItems;

import React, { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "../../../style/icon/tabler-icons/webfont/tabler-icons.css";

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

const AdminMenuItems = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const userObj = useAppSelector((state) => state.auth.userObj);
  const userPermissions = useSelector((state: any) => state.auth.userPermissions);
  // console.log("user permsiisom ",userObj?.role);
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

  const MODULES: Module[] = [

    {
      "key": "AccountsModule",
      "displayName": "Registration",
      "subItems": [
        { "name": "Register Student", "route": all_routes.addStudent, "icon": "ti ti-user-plus" },
        { "name": "Register Teacher", "route": all_routes.addTeacher, "icon": "ti  ti-users" },
        ...(userPermissions?.TransportModule?.access
          ? [{ "name": "Register Transport", "route": all_routes.addtransport, "icon": "ti ti-bus" }]
          : [])
      ]
    },
    {
      "key": "PeoplesModule",
      "displayName": "Peoples",
      "subItems": [
        {
          "name": "Students",
          "route": "/peoples/students",
          "hasSubItems": true,
          "icon": "ti ti-school",
          "subItems": [
            { "name": "All Students", "route": all_routes.studentList, "icon": "ti ti-list" },
            // { "name": "Student List", "route": all_routes.studentGrid, "icon": "ti ti-users" },
            // { "name": "Student Details", "route": all_routes.studentDetail, "icon": "ti ti-id" },
            { "name": "Student Promotion", "route": all_routes.studentPromotion, "icon": "ti ti-arrow-up" }
          ]
        },
        {
          "name": "Parents",

          "hasSubItems": true,
          "icon": "ti ti-user-check",
          "subItems": [
            { "name": "All Parents", "route": all_routes.parentList, "icon": "ti ti-list" },
            // { "name": "Parent List", "route": "/peoples/parents/list", "icon": "ti ti-users" }
          ]
        },
        {
          "name": "Guardians",

          "hasSubItems": true,
          "icon": "ti ti-user-shield",
          "subItems": [
            { "name": "All Guardians", "route": all_routes.guardiansList, "icon": "ti ti-list" },
            // { "name": "Guardian List", "route": all_routes.guardiansGrid, "icon": "ti ti-users" }
          ]
        },
        {
          "name": "Teachers",

          "hasSubItems": true,
          "icon": "ti ti-chalkboard",
          "subItems": [
            { "name": "All Teachers", "route": all_routes.teacherList, "icon": "ti ti-list" },
            //{ "name": "Teacher List", "route": all_routes.teacherGrid, "icon": "ti ti-users" }
          ]
        }
      ]
    },
    {
      "key": "AcademicsModule",
      // "key": "SupportModule",////😌  use this beacuse the academics is not coming in userpermission 
      "displayName": "Academics",
      "subItems": [

        { "name": "Time Table", "route": all_routes.classTimetable, "icon": "ti ti-user-plus" },
        // { "name": "syllabus", "route": all_routes.classSyllabus, "icon": "ti ti-notebook" },
        // { "name": "class routine", "route": all_routes.classRoutine, "icon": "ti ti-notebook" },
        // { "name": "section", "route": all_routes.classSection, "icon": "ti ti-notebook" },
        { "name": "Subject", "route": all_routes.classesLists, "icon": "ti ti-notebook" },
        { "name": "Home work", "route": all_routes.classHomeWork, "icon": "ti ti-notebook" },
        // { "name": "ADD Class", "route": all_routes.classes, "icon": "ti ti-users" },
        {
          "name": "classes",

          "hasSubItems": true,
          "icon": "ti ti-chalkboard",
          "subItems": [
            { name: "All classes", route: all_routes.classes, icon: "ti ti-file-text" },
            { "name": "Create Class", "route": all_routes.ClassesRegisteradmin, "icon": "ti ti-user-plus" },
            { "name": "Create section", "route": all_routes.addsection, "icon": "ti ti-user-plus" },
            { "name": "Assign Class to Teacher", "route": all_routes.AssignTeacherToClass, "icon": "ti ti-user-plus" },
            { name: "Schedule", route: all_routes.sheduleClasses, icon: "ti ti-calendar" },

          ]
        },
        {
          "name": "Examination",

          "hasSubItems": true,
          "icon": "ti ti-chalkboard",
          "subItems": [
            { name: "Exam", route: all_routes.exam, icon: "ti ti-file-text" },
            { name: "Exam Schedule", route: all_routes.examSchedule, icon: "ti ti-calendar" },
            { name: "Grade", route: all_routes.grade, icon: "ti ti-adjustments" },
            { name: "Exam Attendance", route: all_routes.examAttendance, icon: "ti ti-clipboard-check" },
            { name: "Exam Results", route: all_routes.examResult, icon: "ti ti-award" },
          ]
        }
      ]
    },
    {
      "key": "ManagementModule",
      // "key": "SupportModule",////😌   is not coming in userpermission 
      "displayName": "Management",
      "subItems": [
        { "name": "Add Fees", "route": all_routes.FeesManagements, "icon": "ti ti-cash" },
        { name: "Pay fee", route: all_routes.payfee, icon: "ti ti-file-text" },
        //  { "name": "player", "route": all_routes.playerList, "icon": "ti ti-user-plus" },
        // { "name": "syllabus", "route": all_routes.addTeacher, "icon": "ti ti-chalkboard-teacher" },
        // ...(userPermissions?.LibraryModule?.access ? [{
        //   name: "Library",

        //   hasSubItems: true,
        //   icon: "ti ti-book",
        //   subItems: [
        //     { name: "Library Member", route: all_routes.libraryMembers, icon: "ti ti-user" },
        //     { name: "Books", route: all_routes.libraryBooks, icon: "ti ti-book" },
        //     { name: "Issued Books", route: all_routes.libraryIssueBook, icon: "ti ti-bookmark" },
        //     { name: "Return Books", route: all_routes.libraryReturn, icon: "ti ti-bookmark-off" }
        //   ]
        // }] : []),
        ...(userPermissions?.TransportModule?.access ? [{
          name: "Transport",

          hasSubItems: true,
          icon: "ti ti-truck",
          subItems: [
            { name: "Routes", route: all_routes.transportRoutes, icon: "ti ti-truck" },
            { name: "Add Bus Stop", route: all_routes.addbustopadmin, icon: "ti ti-truck" },
            { name: "Pickup Points", route: all_routes.transportPickupPoints, icon: "ti ti-map" },
            { name: " vechicle Driver", route: all_routes.transportVehicleDrivers, icon: "ti ti-user" },
            { name: " vechicle", route: all_routes.transportVehicle, icon: "ti ti-user" },
            { name: " Assign vechicle Driver", route: all_routes.transportAssignVehicle, icon: "ti ti-user" }
          ]
        }] : []),
        // ...(userPermissions?.HostelModule?.access ? [{
        //   name: "Hostel",

        //   hasSubItems: true,
        //   icon: "ti ti-home",
        //   subItems: [
        //     { name: "Hostel List", route: all_routes.hostelList, icon: "ti ti-home" },
        //     { name: "Hostel Rooms ", route: all_routes.hostelRoom, icon: "ti ti-door" },
        //     { name: "Hostel Type", route: all_routes.hostelType, icon: "ti ti-users" }
        //   ]
        // }] :

        // []),
        {
          "name": "Fees Collection",

          "hasSubItems": true,
          "icon": "ti ti-chalkboard",
          "subItems": [
            { name: "Fee Group", route: all_routes.feesGroup, icon: "ti ti-file-text" },
            { name: "Collection Fees", route: all_routes.collectFees, icon: "ti ti-calendar" },

          ]
        }

      ]
    },
    {
      "key": "HRMModule",
      "displayName": "HRM",
      "subItems": [
        // { "name": "ADD STAFF", "route": all_routes.addStaff, "icon": "ti ti-users" },
        { "name": "Staff", "route": all_routes.staff, "icon": "ti ti-user" },
        { "name": "Departments", "route": all_routes.departments, "icon": "ti ti-building" },
        { "name": "Designation", "route": all_routes.designation, "icon": "ti ti-id" },
        {
          "name": "Attendance",

          "hasSubItems": true,
          "icon": "ti ti-calendar-check",
          "subItems": [
            { "name": "Student Attendance", "route": all_routes.studentAttendance, "icon": "ti ti-user-check" },
            { "name": "Teacher Attendance", "route": all_routes.teacherAttendance, "icon": "ti ti-user-check" },
            //{ "name": "Staff Attendance", "route": all_routes.staffAttendance, "icon": "ti ti-user-check" }
          ]
        },
        {
          "name": "Leaves",

          "hasSubItems": true,
          "icon": "ti ti-calendar-off",
          "subItems": [
            // { "name": "List of Leaves", "route": all_routes.listLeaves, "icon": "ti ti-list" },
            { "name": "Approve Request", "route": all_routes.approveRequest, "icon": "ti ti-check" }
          ]
        },
        { "name": "Holidays", "route": all_routes.holidays, "icon": "ti ti-calendar" },
        { "name": "Payroll", "route": all_routes.payroll, "icon": "ti ti-cash" }
      ]
    },
    {
      "key": "AccountsModule", //module required
      "displayName": "Accounts",
      "subItems": [
        // { "name": "ADD STAFF", "route": all_routes.addStaff, "icon": "ti ti-users" },
        { "name": "Expense", "route": all_routes.expense, "icon": "ti ti-user" },
        { "name": "Expenese category", "route": all_routes.expenseCategory, "icon": "ti ti-building" },
        { "name": "Income", "route": all_routes.accountsIncome, "icon": "ti ti-id" },
        { "name": "Transcation", "route": all_routes.accountsTransactions, "icon": "ti ti-id" },

      ]
    },
    {
      "key": "HRMModule", //module required
      "displayName": "visitor",
      "subItems": [
        // { "name": "ADD STAFF", "route": all_routes.addStaff, "icon": "ti ti-users" },
        { "name": "Add Visitor", "route": all_routes.vistor, "icon": "ti ti-building" },
        { "name": "All Visitors list ", "route": all_routes.vistordetails, "icon": "ti ti-user" },

      ]
    },

    {
      "key": "AnnouncementsModule",
      // "key": "SupportModule",////😌  use this beacuse the academics is not coming in userpermission 
      "displayName": "Announcements",
      "subItems": [
        { "name": "Notice Board", "route": all_routes.noticeBoard, "icon": "ti ti-user-plus" },
        { "name": "Events", "route": all_routes.events, "icon": "ti ti-notebook" },

      ]
    },
    // {
    //   "key": "ReportsModule",
    //   "displayName": "Reports",
    //   "subItems": [
    //     { "name": "Attendance", "route": all_routes.attendanceReport, "icon": "ti ti-calendar-check" },
    //     { "name": "Class Report", "route": all_routes.classReport, "icon": "ti ti-report" },
    //     { "name": "Student Report", "route": all_routes.studentReport, "icon": "ti ti-file-text" },
    //     { "name": "Grade Report", "route": all_routes.gradeReport, "icon": "ti ti-report-analytics" },
    //     { "name": "Leave Report", "route": all_routes.leaveReport, "icon": "ti ti-calendar-off" },
    //     { "name": "Fees Report", "route": all_routes.feesReport, "icon": "ti ti-receipt" }
    //   ]
    // },
    {
      "key": "UserManagementModule",////😌
      // "key": "SupportModule", ////😌   notcoming  the  usermanagment 
      "displayName": "User Management",
      "subItems": [
        { "name": "Users", "route": all_routes.manageusers, "icon": "ti ti-users" },
        { "name": "Roles & Permissions", "route": all_routes.rolesPermissions, "icon": "ti ti-lock" }
      ]
    },
    {
      "key": "SettingsModule",
      "displayName": "Settings",
      "subItems": [
        { "name": "Payment", "route": all_routes.paymentGateways, "icon": "ti ti-cash" },
        // {
        //   "name": "General Settings",

        //   "hasSubItems": true,
        //   "icon": "ti ti-settings",
        //   "subItems": [
        //     { "name": "Profile Settings", "route": all_routes.profilesettings, "icon": "ti ti-user" },
        //     { "name": "Security Settings", "route": all_routes.securitysettings, "icon": "ti ti-shield" },
        //     { "name": "Notification Settings", "route": all_routes.notificationssettings, "icon": "ti ti-bell" },
        //     { "name": "Connected Apps", "route": all_routes.connectedApps, "icon": "ti ti-plug" }
        //   ]
        // },
        // {
        //   "name": "Academic Settings",
        //   "hasSubItems": true,
        //   "icon": "ti ti-school",
        //   "subItems": [
        //     { "name": "School Settings", "route": all_routes.schoolSettings, "icon": "ti ti-building" },
        //     { "name": "Religion", "route": all_routes.religion, "icon": "ti ti-church" }
        //   ]
        // }
      ]
    },
    {
      "key": "SupportModule",
      "displayName": "Support",
   "subItems": [
  { "name": "Feature Request", "route": all_routes.requestFeatures, "icon": "ti ti-stars" },
  { "name": "Membership Plans", "route": all_routes.membershipcard, "icon": "ti ti-id-badge" },
  { "name": "Contact Messages", "route": all_routes.contactMessages, "icon": "ti ti-mail" },
  { "name": "Tickets", "route": all_routes.tickets, "icon": "ti ti-ticket" }
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
                to={getBaseUrl(isLoggedIn, userObj!.role)}
                onClick={() =>
                  handleClick("Dashboard", undefined, getLayoutClass("Dashboard"))
                }
                className={`${subOpen === "Dashboard" ? "subdrop" : ""} ${getBaseUrl(isLoggedIn, userObj!.role) === location.pathname
                  ? "active"
                  : ""
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
                className={`${subOpen === "Feature Request" ? "subdrop" : ""} ${all_routes.requestFeatures === location.pathname ? "active" : ""
                  }`}
              >
                <i className="ti ti-layout-dashboard"></i>
                <span>Feature Request</span>
              </Link>
            </li>
            <li className="submenu">
              <Link
                to={all_routes.membershipcard}
                onClick={() => handleClick("membership", undefined, getLayoutClass("membership"))}
                className={`${subOpen === "membership" ? "subdrop" : ""} ${all_routes.membershipcard === location.pathname ? "active" : ""
                  }`}
              >
                <i className="ti ti-layout-dashboard"></i>
                <span>Membership Plans</span>
              </Link>
            </li> */}
          </ul>
        </li>
        {userObj && userObj.role && userPermissions ? (
          <Fragment>
            {MODULES.map((module) => userPermissions[module.key] &&
              userPermissions?.[module.key]?.access ? (
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
                            <ul style={{ display: subsidebar === item.name ? "block" : "none" }}>
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
            ) : null
            )}
          </Fragment>
        ) : null}
      </ul>




    </>
  );
};

export default AdminMenuItems;