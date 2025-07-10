import React from "react";
import { all_routes } from "../../router/all_routes";
import { useSelector } from "react-redux";

interface StudentBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const StudentBar: React.FC<StudentBarProps> = ({ activeTab, setActiveTab }) => {
  const routes = all_routes;
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const isDark = dataTheme === "dark_data_theme";

  const tabs = [
    { key: routes.studenthomedashboard, label: "Home", icon: "ti ti-bookmark-edit" },
    { key: routes.studentTimeTable, label: "Time Table", icon: "ti ti-table-options" },
    { key: routes.payfee, label: " Fee", icon: "ti ti-report-money" },
    { key: routes.AcademicResourcesstudent, label: "Academics Resources", icon: "ti ti-report-money" },
    { key: routes.Attendancechartstudent, label: "Attendance & Leave", icon: "ti ti-report-money" },
    { key: routes.studentResult, label: "Exam & Results", icon: "ti ti-bookmark-edit" },    
    { key: routes.noticeBoardstudent, label: "Notice Board", icon: "ti ti-report-money" },
    { key: routes.SelfEnhancement, label: "Self Enhancement", icon: "ti ti-bulb" },
    { key: routes.DoubtForum, label: "Doubt Forum", icon: "ti ti-message-circle" },
    { key: routes.studentlearderboard, label: "LeaderBoard", icon: "ti ti-bookmark-edit" },
    { key: routes.studentDetail, label: "My Profile", icon: "ti ti-school" },  
  
   // { key: routes.studentDetail, label: "My Profile", icon: "ti ti-school" },  
    // { key: routes.FeesOverviewstudent, label: "Fees Overview", icon: "ti ti-report-money" },
    // { key: routes.studentLeaves, label: "Leave & Attendance", icon: "ti ti-calendar-due" },
    // { key: routes.studentFees, label: "Fees", icon: "ti ti-report-money" },
    //   { key: routes.studentLibrary, label: "Library", icon: "ti ti-books" },
  ];

  return (
    <div
      className={`d-flex flex-row overflow-x-auto border-bottom p-2 ${isDark ? "bg-dark" : "bg-white"
        }`}
      style={{ whiteSpace: "nowrap" }}
    >
      <ul className="nav nav-tabs nav-tabs-bottom flex-nowrap mb-0">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.key}>
            <button
              className={`nav-link border-0 bg-transparent ${activeTab === tab.key ? "fw-semibold" : ""
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

export default StudentBar;
