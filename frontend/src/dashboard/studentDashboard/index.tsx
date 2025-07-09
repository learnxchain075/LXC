
import React, { useState } from "react";
import { all_routes } from "../../router/all_routes";
import StudentBreadcrumb from "../../pages/Admin/peoples/students/student-details/studentBreadcrumb";
import StudentSidebar from "../../pages/Admin/peoples/students/student-details/studentSidebar";
import StudentModals from "../../pages/Admin/peoples/students/studentModals";
import useMobileDetection from "../../core/common/mobileDetection";

import StudentDetails from "../../pages/Admin/peoples/students/student-details/studentDetails";
import { PayFeeManagement } from "../../pages/Common/payFeeManagement";
import SelfEnhancement from "../../pages/Common/SelfEnhancement";
import DoubtForum from "../../pages/Common/DoubtForum";
import ClassTimetable from "../../pages/Admin/academic/class-timetable";
import StudentLeaves from "../../pages/Admin/peoples/students/student-details/studentLeaves";
import StudentFees from "../../pages/Admin/peoples/students/student-details/studentFees";
import StudentResult from "../../pages/Admin/peoples/students/student-details/studentResult";
import StudentLibrary from "../../pages/Admin/peoples/students/student-details/studentLibrary";
import StudentBar from "./StudentBar";
import Attendancechartstudent from "../../pages/Admin/peoples/students/student-details/Attendancechartstudent";
import FeesOverview from "../../pages/Admin/peoples/students/student-details/FeesOverview";
import NoticeBoardstudent from "../../pages/Admin/peoples/students/student-details/NoticeBoardstudent";
import AcademicResources from "../../pages/Admin/peoples/students/student-details/AcademicResources";
import StudentTimeTable from "../../pages/Admin/peoples/students/student-details/studentTimeTable";
import Leaderboard from "../../pages/Admin/peoples/students/student-details/Leaderboard";
import HomeDashboard from "../../pages/Admin/peoples/students/homedashboard";

const StudentDashboard = () => {
  const routes = all_routes;
  const isMobile = useMobileDetection();
  const [activeTab, setActiveTab] = useState(routes.studentDetail);

  const renderContent = () => {
    switch (activeTab) {
      case routes.studentDetail:
        return <StudentDetails />;
      case routes.payfee:
        return <PayFeeManagement />;
      case routes.SelfEnhancement:
        return <SelfEnhancement />;
      case routes.DoubtForum:
        return <DoubtForum />;
      case routes.studentTimeTable:
        return <StudentTimeTable />;
      case routes.studentLeaves:
        return <StudentLeaves />;
      case routes.studentFees:
        return <StudentFees />;
      case routes.studentResult:
        return <StudentResult />;
      case routes.studentLibrary:
        return <StudentLibrary />;
   case routes.Attendancechartstudent:
  return <Attendancechartstudent/>;
case routes.FeesOverviewstudent:
  return <FeesOverview />;
case routes.noticeBoardstudent:
  return <NoticeBoardstudent />;
case routes.AcademicResourcesstudent:
  return <AcademicResources/>;
case routes.studentlearderboard:
  return <Leaderboard/>;
  case routes.studenthomedashboard:
  return < HomeDashboard/>;
      default:
        return (
          <div className="card shadow-sm">
            <div className="card-body">Select a tab to view content</div>
          </div>
        );
    }
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className={isMobile ? "page-wrapper" : "p-3"}>
        <div className="content ">
          <div className="row">
            {/* Page Header */}
            <StudentBreadcrumb />
            {/* /Page Header */}
            {/* Teacher Information */}
           
   <StudentSidebar/>

         
         
            {/* /Teacher Information */}
            <div className="col-xxl-9 col-xl-8">
              {/* // <div className={ismobile ? "col-12" : "col-xxl-9 col-xl-8"}> */}
              <div className="row">
                <div className="col-md-12">
                  <StudentBar activeTab={activeTab} setActiveTab={setActiveTab} />
                  
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <StudentModals />
    </>
  );
};

export default StudentDashboard;
