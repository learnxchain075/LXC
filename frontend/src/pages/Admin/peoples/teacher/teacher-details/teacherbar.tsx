// // // import { NavLink } from "react-router-dom";
// // // import { all_routes } from "../../../../../router/all_routes";

// // // const TeacherBar = () => {
// // //   const routes = all_routes;

// // //   return (
// // //     <div className="d-flex flex-row overflow-x-auto bg-white border-bottom p-2" style={{ whiteSpace: "nowrap" }}>
// // //       <ul className="nav nav-tabs nav-tabs-bottom flex-nowrap mb-0">
// // //         <li className="nav-item">
// // //           <NavLink
// // //             to={routes.teacherDetails}
// // //             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
// // //           >
// // //             <i className="ti ti-school me-2" />
// // //             Teacher Details
// // //           </NavLink>
// // //         </li>
// // //         <li className="nav-item">
// // //           <NavLink
// // //             to={routes.teachersRoutine}
// // //             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
// // //           >
// // //             <i className="ti ti-table-options me-2" />
// // //             Routine
// // //           </NavLink>
// // //         </li>
// // //         <li className="nav-item">
// // //           <NavLink
// // //             to={routes.teacherLeaves}
// // //             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
// // //           >
// // //             <i className="ti ti-calendar-due me-2" />
// // //             Leave & Attendance
// // //           </NavLink>
// // //         </li>
// // //         <li className="nav-item">
// // //           <NavLink
// // //             to={routes.teacherSalary}
// // //             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
// // //           >
// // //             <i className="ti ti-report-money me-2" />
// // //             Salary
// // //           </NavLink>
// // //         </li>
// // //         <li className="nav-item">
// // //           <NavLink
// // //             to={routes.teacherLibrary}
// // //             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
// // //           >
// // //             <i className="ti ti-bookmark-edit me-2" />
// // //             Library
// // //           </NavLink>
// // //         </li>
// // //         <li className="nav-item">
// // //           <NavLink
// // //             to={routes.classesLists}
// // //             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
// // //           >
// // //             <i className="ti ti-bookmark-edit me-2" />
// // //             Get Their Class
// // //           </NavLink>
// // //         </li>
// // //         <li className="nav-item">
// // //           <NavLink
// // //             to={routes.studentList}
// // //             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
// // //           >
// // //             <i className="ti ti-bookmark-edit me-2" />
// // //             Students of Their Class
// // //           </NavLink>
// // //         </li>
// // //         <li className="nav-item">
// // //           <NavLink
// // //             to={routes.examSchedule}
// // //             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
// // //           >
// // //             <i className="ti ti-bookmark-edit me-2" />
// // //             Create Exam
// // //           </NavLink>
// // //         </li>
// // //         <li className="nav-item">
// // //           <NavLink
// // //             to={routes.studentResult}
// // //             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
// // //           >
// // //             <i className="ti ti-bookmark-edit me-2" />
// // //             Result
// // //           </NavLink>
// // //         </li>
// // //         <li className="nav-item">
// // //           <NavLink
// // //             to={routes.uplaodPyq}
// // //             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
// // //           >
// // //             <i className="ti ti-bookmark-edit me-2" />
// // //             PyQ Upload
// // //           </NavLink>
// // //         </li>
// // //         <li className="nav-item">
// // //           <NavLink
// // //             to={routes.assignment}
// // //             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
// // //           >
// // //             <i className="ti ti-bookmark-edit me-2" />
// // //             Assignment
// // //           </NavLink>
// // //         </li>
// // //         <li className="nav-item">
// // //           <NavLink
// // //             to={routes.classHomeWork}
// // //             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
// // //           >
// // //             <i className="ti ti-bookmark-edit me-2" />
// // //             Homework
// // //           </NavLink>
// // //         </li>
// // //         <li className="nav-item">
// // //           <NavLink
// // //             to={routes.studentAttendance}
// // //             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
// // //           >
// // //             <i className="ti ti-bookmark-edit me-2" />
// // //             Student Attendance
// // //           </NavLink>
// // //         </li>
// // //         <li className="nav-item">
// // //           <NavLink
// // //             to={routes.comingSoon}
// // //             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
// // //           >
// // //             <i className="ti ti-bookmark-edit me-2" />
// // //             Self Enhancement
// // //           </NavLink>
// // //         </li>
// // //         <li className="nav-item">
// // //           <NavLink
// // //             to={routes.tickets}
// // //             className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
// // //           >
// // //             <i className="ti ti-bookmark-edit me-2" />
// // //             Ticket
// // //           </NavLink>
// // //         </li>
// // //       </ul>
// // //     </div>
// // //   );
// // // };

// // // export default TeacherBar;

// import React from "react";
// import { all_routes } from "../../../../../router/all_routes";

// interface TeacherBarProps {
//   activeTab: string;
//   setActiveTab: (tab: string) => void;
// }

// const TeacherBar: React.FC<TeacherBarProps> = ({ activeTab, setActiveTab }) => {
//   const routes = all_routes;

//   const tabs = [
//     { key: routes.teacherDetails, label: "Teacher Details", icon: "ti ti-school" },
//     { key: routes.teachersRoutine, label: "Routine", icon: "ti ti-table-options" },
//     { key: routes.teacherLeaves, label: "Leave & Attendance", icon: "ti ti-calendar-due" },
//     { key: routes.teacherSalary, label: "Salary", icon: "ti ti-report-money" },
//    // { key: routes.teacherLibrary, label: "Library", icon: "ti ti-bookmark-edit" },
//     { key: routes.classesLists, label: "Get Their Class", icon: "ti ti-bookmark-edit" },
//     { key: routes.gettheirstudent, label: "Students of Their Class", icon: "ti ti-bookmark-edit" },
//     { key: routes.examSchedule, label: "Create Exam", icon: "ti ti-bookmark-edit" },
//     { key: routes.examResult, label: "Result", icon: "ti ti-bookmark-edit" },
//     { key: routes.uplaodPyq, label: "PyQ Upload", icon: "ti ti-bookmark-edit" },
//     { key: routes.assignment, label: "Assignment", icon: "ti ti-bookmark-edit" },
//     { key: routes.homeclasses, label: "Homework", icon: "ti ti-bookmark-edit" },
//     { key: routes.studentAttendance, label: "Student Attendance", icon: "ti ti-bookmark-edit" },
//     { key: routes.comingSoon, label: "Self Enhancement", icon: "ti ti-bookmark-edit" },
//     { key: routes.tickets, label: "Ticket", icon: "ti ti-bookmark-edit" },
//   ];

//   return (
//     <div className="d-flex flex-row overflow-x-auto bg-white border-bottom p-2" style={{ whiteSpace: "nowrap" }}>
//       <ul className="nav nav-tabs nav-tabs-bottom flex-nowrap mb-0">
//         {tabs.map((tab) => (
//           <li className="nav-item" key={tab.key}>
//             <button
//               className={`nav-link border-0 bg-transparent ${activeTab === tab.key ? "text-primary fw-semibold" : ""}`}
//               style={{
//                 borderBottom: activeTab === tab.key ? "3px solid #0d6efd55" : "3px solid transparent",
//                 color: activeTab === tab.key ? "#0d6efd" : "#212529",
//                 paddingBottom: "8px",
//               }}
//               onClick={() => setActiveTab(tab.key)}
//             >
//               <i className={`${tab.icon} me-2`} />
//               {tab.label}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default TeacherBar;

import React from "react";
import { useSelector } from "react-redux";
import { all_routes } from "../../../../../router/all_routes";


interface TeacherBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TeacherBar: React.FC<TeacherBarProps> = ({ activeTab, setActiveTab }) => {
  const routes = all_routes;
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);

  const isDark = dataTheme === "dark_data_theme";

  const tabs = [
    { key: routes.teacherDetails, label: "Teacher Details", icon: "ti ti-school" },
    { key: routes.teachersRoutine, label: "Routine", icon: "ti ti-table-options" },
    { key: routes.teacherLeaves, label: "Leave & Attendance", icon: "ti ti-calendar-due" },
    { key: routes.teacherSalary, label: "Salary", icon: "ti ti-report-money" },
    // { key: routes.classesLists, label: "Get Their Class", icon: "ti ti-bookmark-edit" },
     { key: routes.MyClassesWithStudents, label: "MyClassesWithStudents", icon: "ti ti-bookmark-edit" },
       { key: routes.AcademicUploads, label: "AcademicUploads", icon: "ti ti-bookmark-edit" },
    // { key: routes.gettheirstudent, label: "Students of Their Class", icon: "ti ti-bookmark-edit" },
     { key: routes.examSchedule, label: " Exam", icon: "ti ti-bookmark-edit" },
    // { key: routes.examResult, label: "Result", icon: "ti ti-bookmark-edit" },
    // { key: routes.uplaodPyq, label: "PyQ Upload", icon: "ti ti-bookmark-edit" },
    // { key: routes.assignment, label: "Assignment", icon: "ti ti-bookmark-edit" },
    // { key: routes.homeclasses, label: "Homework", icon: "ti ti-bookmark-edit" },
    // { key: routes.studentAttendance, label: "Student Attendance", icon: "ti ti-bookmark-edit" },
    { key: routes.SelfEnhancement, label: "Self Enhancement", icon: "ti ti-bookmark-edit" },
     { key: routes.DoubtForum, label: " DoubtForum", icon: "ti ti-bookmark-edit" },
    { key: routes.tickets, label: "Ticket", icon: "ti ti-bookmark-edit" },
  ];

  return (
    <div
      className={`d-flex flex-row overflow-x-auto border-bottom p-2 ${
        isDark ? "bg-dark" : "bg-white"
      }`}
      style={{ whiteSpace: "nowrap" }}
    >
      <ul className="nav nav-tabs nav-tabs-bottom flex-nowrap mb-0">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.key}>
            <button
              className={`nav-link border-0 bg-transparent ${
                activeTab === tab.key ? "fw-semibold" : ""
              }`}
              style={{
                borderBottom:
                  activeTab === tab.key ? "3px solid #0d6efd55" : "3px solid transparent",
                color:
                  activeTab === tab.key
                    ? isDark
                      ? "#0dcaf0"
                      : "#0d6efd"
                    : isDark
                    ? "#ccc"
                    : "#212529",
                paddingBottom: "8px",
              }}
              onClick={() => setActiveTab(tab.key)}
            >
              <i className={`${tab.icon} me-2`} />
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherBar;
