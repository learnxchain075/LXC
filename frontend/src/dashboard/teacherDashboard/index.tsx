// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { all_routes } from "../../router/all_routes";
// import ImageWithBasePath from "../../core/common/imageWithBasePath";
// import AdminDashboardModal from "../adminDashboard/adminDashboardModal";
// import ReactApexChart from "react-apexcharts";
// import { Calendar } from "primereact/calendar";
// import { Nullable } from "primereact/ts-helpers";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import dayjs from "dayjs";
// import { DatePicker } from "antd";
// import useMobileDetection from "../../core/common/mobileDetection";
// import StudentBreadcrumb from "../../pages/Admin/peoples/students/student-details/studentBreadcrumb";
// import StudentSidebar from "../../pages/Admin/peoples/students/student-details/studentSidebar";
// import TeacherBreadcrumb from "../../pages/Admin/peoples/teacher/teacher-details/teacherBreadcrumb";
// import TeacherSidebar from "../../pages/Admin/peoples/teacher/teacher-details/teacherSidebar";
// import TeacherModal from "../../pages/Admin/peoples/teacher/teacherModal";
// import { getTeacherById } from "../../services/admin/teacherRegistartion";

// import TeacherDetails from "../../pages/Admin/peoples/teacher/teacher-details/teacherDetails";
// import TeachersRoutine from "../../pages/Admin/peoples/teacher/teacher-details/teachersRoutine";
// import TeacherLeave from "../../pages/Admin/peoples/teacher/teacher-details/teacherLeave";
// import TeacherSalary from "../../pages/Admin/peoples/teacher/teacher-details/teacherSalary";
// import TeacherLibrary from "../../pages/Admin/peoples/teacher/teacher-details/teacherLibrary";
// import Classes from "../../pages/Admin/academic/classes";
// import Classesshow from "../../pages/Common/classShow";
// import StudentResult from "../../pages/Admin/peoples/students/student-details/studentResult";
// import ExamSchedule from "../../pages/Admin/academic/examinations/exam-schedule";
// import StudentList from "../../pages/Admin/peoples/students/student-list";
// import PyqUpload from "../../pages/Teacher/pyqUpload";
// import Assignment from "../../pages/Teacher/Assingment";
// import ClassHomeWork from "../../pages/Admin/academic/class-home-work";
// import StudentAttendance from "../../pages/SuperAdmin/hrm/attendance/student-attendance";
// import ComingSoon from "../../pages/Common/comingSoon";
// import Tickets from "../../pages/SuperAdmin/support/tickets";
// import ExamResult from "../../pages/Admin/academic/examinations/exam-results";
// import Gettheirstudent from "../../pages/Common/getTheirStudent";
// import ClassStudent from "../../pages/Admin/academic/class-student";
// import TeacherBar from "../../pages/Admin/peoples/teacher/teacher-details/teacherbar";
// import Classeshome from "../../pages/Common/homeclass";
// import MyClassesWithStudents from "../../pages/Common/MyClassesWithStudents";
// import AcademicUploads from "../../pages/Common/AcademicUploads";
// import SelfEnhancement from "../../pages/Common/SelfEnhancement";
// import DoubtForum from "../../pages/Common/DoubtForum";
// import { useSelector } from "react-redux";

// const TeacherDashboard = () => {
//   const routes = all_routes;
//   const [date, setDate] = useState<Nullable<Date>>(null);
//   const [teacherdata, setTeacherdata] = useState<any>({});

//   function SampleNextArrow(props: any) {
//     const { style, onClick } = props;
//     return (
//       <div
//         className="slick-nav slick-nav-next class-slides"
//         style={{ ...style, display: "flex", top: "-72%", left: "22%" }}
//         onClick={onClick}
//       >
//         <i className="fas fa-chevron-right" style={{ fontSize: "12px" }}></i>
//       </div>
//     );
//   }

//   function SamplePrevArrow(props: any) {
//     const { style, onClick } = props;
//     return (
//       <div
//         className="slick-nav slick-nav-prev class-slides"
//         style={{ ...style, display: "flex", top: "-72%", left: "17%" }}
//         onClick={onClick}
//       >
//         <i className="fas fa-chevron-left" style={{ fontSize: "12px" }}></i>
//       </div>
//     );
//   }

//   const settings = {
//     dots: false,
//     autoplay: false,
//     slidesToShow: 4,
//     margin: 24,
//     speed: 500,
//     nextArrow: <SampleNextArrow />,
//     prevArrow: <SamplePrevArrow />,
//     responsive: [
//       {
//         breakpoint: 1500,
//         settings: { slidesToShow: 4 },
//       },
//       {
//         breakpoint: 1400,
//         settings: { slidesToShow: 4 },
//       },
//       {
//         breakpoint: 992,
//         settings: { slidesToShow: 4 },
//       },
//       {
//         breakpoint: 800,
//         settings: { slidesToShow: 2 },
//       },
//       {
//         breakpoint: 776,
//         settings: { slidesToShow: 2 },
//       },
//       {
//         breakpoint: 567,
//         settings: { slidesToShow: 1 },
//       },
//     ],
//   };

//   const Syllabus = {
//     dots: false,
//     autoplay: false,
//     arrows: false,
//     slidesToShow: 4,
//     margin: 24,
//     speed: 500,
//     responsive: [
//       {
//         breakpoint: 1500,
//         settings: { slidesToShow: 4 },
//       },
//       {
//         breakpoint: 1400,
//         settings: { slidesToShow: 4 },
//       },
//       {
//         breakpoint: 992,
//         settings: { slidesToShow: 4 },
//       },
//       {
//         breakpoint: 800,
//         settings: { slidesToShow: 2 },
//       },
//       {
//         breakpoint: 776,
//         settings: { slidesToShow: 2 },
//       },
//       {
//         breakpoint: 567,
//         settings: { slidesToShow: 1 },
//       },
//     ],
//   };

//   const [studentDonutChart] = useState<any>({
//     chart: {
//       height: 90,
//       type: "donut",
//       toolbar: { show: false },
//     },
//     grid: {
//       show: false,
//       padding: { left: 0, right: 0 },
//     },
//     plotOptions: {
//       bar: { horizontal: false, columnWidth: "50%" },
//     },
//     dataLabels: { enabled: false },
//     series: [95, 5],
//     labels: ["Completed", "Pending"],
//     legend: { show: false },
//     colors: ["#1ABE17", "#E82646"],
//     responsive: [
//       {
//         breakpoint: 480,
//         options: {
//           chart: { width: 100 },
//           legend: { position: "bottom" },
//         },
//       },
//     ],
//   });

//   const [attendance_chart] = useState<any>({
//     chart: {
//       height: 290,
//       type: "donut",
//       toolbar: { show: false },
//     },
//     plotOptions: {
//       bar: { horizontal: false, columnWidth: "50%" },
//     },
//     dataLabels: { enabled: false },
//     series: [60, 5, 15, 20],
//     labels: ["Present", "Late", "Half Day", "Absent"],
//     colors: ["#1ABE17", "#1170E4", "#E9EDF4", "#E82646"],
//     responsive: [
//       {
//         breakpoint: 480,
//         options: {
//           chart: { width: 200 },
//           legend: { position: "left" },
//         },
//       },
//     ],
//     legend: { position: "bottom" },
//   });

//   const today = new Date();
//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, "0");
//   const day = String(today.getDate()).padStart(2, "0");
//   const formattedDate = `${month}-${day}-${year}`;
//   const defaultValue = dayjs(formattedDate);


// const userObj = useSelector((state: any) => state.auth.userObj);
//   const ismobile = useMobileDetection();

//   const fetchTeacherDetails = async () => {
//     try {
//       const response = await getTeacherById(localStorage.getItem("teacherId") ?? "");
//       if (response.status === 200) {
//         const teacherDetails = response.data;
//         setTeacherdata(teacherDetails);
//       } else {
//         console.error("Failed to fetch teacher details");
//       }
//     } catch (error) {
//       console.error("Error fetching teacher details:", error);
//     }
//   };

//   useEffect(() => {
//     fetchTeacherDetails();
//   }, []);


//   const [activeTab, setActiveTab] = useState(routes.teacherDetails);


//   const renderContent = () => {
//     switch (activeTab) {
//       case routes.teacherDetails:
//         return <TeacherDetails teacherdata={teacherdata} />;

//       case routes.teachersRoutine:
//         return <TeachersRoutine teacherData={teacherdata} />;
//       case routes.teacherLeaves:
//         return <TeacherLeave
//           teacherdata={teacherdata} 
//         />;
//       case routes.teacherSalary:
//         return <TeacherSalary teacherdata={teacherdata} />;
//       // case routes.teacherLibrary:
//       //   return <TeacherLibrary teacherdata={teacherdata} />;
//       // case routes.classesLists:
//       //   return <Classesshow teacherdata={teacherdata} />;
//       case routes.MyClassesWithStudents:
//         return <MyClassesWithStudents />;
//          case routes.AcademicUploads:
//         return <AcademicUploads />;
//       // case routes.gettheirstudent:
//       //   return (
//       //     <Gettheirstudent
//       //       teacherdata={teacherdata}
//       //       selectedClassId={selectedClassId ?? undefined}
//       //       setSelectedClassId={setSelectedClassId}
//       //       activeTab={activeTab}
//       //       setActiveTab={setActiveTab}
//       //     />
//       //   );
//       case routes.examSchedule:
//         return <ExamSchedule teacherdata={teacherdata} />;
//       // case routes.examResult:
//       //   return <ExamResult teacherdata={teacherdata} />;
//       // case routes.classStudent:
//       //   return <ClassStudent teacherdata={teacherdata} classId={selectedClassId ?? ""} />;
//       // case routes.uplaodPyq:
//       //   return <PyqUpload teacherdata={teacherdata} />;
//       // case routes.assignment:
//       //   return <Assignment teacherdata={teacherdata} />;
//       // case routes.classHomeWork:
//       //   return <ClassHomeWork teacherdata={teacherdata} classId={selectedClassId ?? ""} />;
//       // case routes.homeclasses:
//       //   return <Classeshome
//       //     activeTab={activeTab}
//       //     setActiveTab={setActiveTab}
//       //     setSelectedClassId={(id: string) => setSelectedClassId(id as any)}
//       //     selectedClassId={selectedClassId ?? undefined}
//       //   />;
//       // case routes.studentAttendance:
//       //   return <StudentAttendance teacherdata={teacherdata} />;
//       case routes.SelfEnhancement:
//         return <SelfEnhancement />;
//             case routes.DoubtForum:
//         return <DoubtForum />;
//       case routes.tickets:
//         return <Tickets teacherdata={teacherdata} />;
//       default:
//         return <div className="card"><div className="card-body">Select a tab to view content</div></div>;
//     }
//   };

//   return (
//     <>
//       {/* Page Wrapper */}
//       <div className={ismobile ? "page-wrapper" : "p-3"}>
//         <div className="content ">
//           <div className="row">
//             {/* Page Header */}
//             <TeacherBreadcrumb />
//             {/* /Page Header */}
//             {/* Teacher Information */}

//    <TeacherSidebar />



//             {/* /Teacher Information */}
//             <div className="col-xxl-9 col-xl-8">
//               {/* // <div className={ismobile ? "col-12" : "col-xxl-9 col-xl-8"}> */}
//               <div className="row">
//                 <div className="col-md-12">
//                   <TeacherBar activeTab={activeTab} setActiveTab={setActiveTab} />

//                   {renderContent()}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* /Page Wrapper */}
//       <TeacherModal />
//     </>


//   );
// };


// export default TeacherDashboard;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import AdminDashboardModal from "../adminDashboard/adminDashboardModal";
import ReactApexChart from "react-apexcharts";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import dayjs from "dayjs";
import { DatePicker } from "antd";
import useMobileDetection from "../../core/common/mobileDetection";
import StudentBreadcrumb from "../../pages/Admin/peoples/students/student-details/studentBreadcrumb";
import StudentSidebar from "../../pages/Admin/peoples/students/student-details/studentSidebar";
import TeacherBreadcrumb from "../../pages/Admin/peoples/teacher/teacher-details/teacherBreadcrumb";
import TeacherSidebar from "../../pages/Admin/peoples/teacher/teacher-details/teacherSidebar";
import TeacherModal from "../../pages/Admin/peoples/teacher/teacherModal";
import { getTeacherById } from "../../services/admin/teacherRegistartion";

import TeacherDetails from "../../pages/Admin/peoples/teacher/teacher-details/teacherDetails";
import TeachersRoutine from "../../pages/Admin/peoples/teacher/teacher-details/teachersRoutine";
import TeacherLeave from "../../pages/Admin/peoples/teacher/teacher-details/teacherLeave";
import TeacherSalary from "../../pages/Admin/peoples/teacher/teacher-details/teacherSalary";
import TeacherLibrary from "../../pages/Admin/peoples/teacher/teacher-details/teacherLibrary";
import Classes from "../../pages/Admin/academic/classes";
import Classesshow from "../../pages/Common/classShow";
import StudentResult from "../../pages/Admin/peoples/students/student-details/studentResult";
import ExamSchedule from "../../pages/Admin/academic/examinations/exam-schedule";
import StudentList from "../../pages/Admin/peoples/students/student-list";
import PyqUpload from "../../pages/Teacher/pyqUpload";
import Assignment from "../../pages/Teacher/Assingment";
import ClassHomeWork from "../../pages/Admin/academic/class-home-work";
import StudentAttendance from "../../pages/SuperAdmin/hrm/attendance/student-attendance";
import ComingSoon from "../../pages/Common/comingSoon";
import Tickets from "../../pages/SuperAdmin/support/tickets";
import ExamResult from "../../pages/Admin/academic/examinations/exam-results";
import Gettheirstudent from "../../pages/Common/getTheirStudent";
import ClassStudent from "../../pages/Admin/academic/class-student";
import TeacherBar from "../../pages/Admin/peoples/teacher/teacher-details/teacherbar";
import Classeshome from "../../pages/Common/homeclass";
import MyClassesWithStudents from "../../pages/Common/MyClassesWithStudents";
import AcademicUploads from "../../pages/Common/AcademicUploads";
import SelfEnhancement from "../../pages/Common/SelfEnhancement";
import DoubtForum from "../../pages/Common/DoubtForum";
import { useSelector } from "react-redux";
// import Teacherui from "../../pages/Admin/peoples/teacher/teacher-details/teacherui";

const TeacherDashboard = () => {
  const routes = all_routes;
  const [date, setDate] = useState<Nullable<Date>>(null);
  const [teacherdata, setTeacherdata] = useState<any>({});
  const [loading, setLoading] = useState(true); // Loading state
  const userObj = useSelector((state: any) => state.auth.userObj);
  const ismobile = useMobileDetection();

  // Skeleton Placeholder Component with proper TypeScript interface
  interface SkeletonPlaceholderProps {
    className?: string;
    style?: React.CSSProperties;
  }

  const SkeletonPlaceholder: React.FC<SkeletonPlaceholderProps> = ({ className = '', style = {} }) => (
    <div className={`placeholder-glow ${className}`} style={style}>
      <div className="placeholder col-12"></div>
    </div>
  );

  function SampleNextArrow(props: any) {
    const { style, onClick } = props;
    return (
      <div
        className="slick-nav slick-nav-next class-slides"
        style={{ ...style, display: "flex", top: "-72%", left: "22%" }}
        onClick={onClick}
      >
        <i className="fas fa-chevron-right" style={{ fontSize: "12px" }}></i>
      </div>
    );
  }

  function SamplePrevArrow(props: any) {
    const { style, onClick } = props;
    return (
      <div
        className="slick-nav slick-nav-prev class-slides"
        style={{ ...style, display: "flex", top: "-72%", left: "17%" }}
        onClick={onClick}
      >
        <i className="fas fa-chevron-left" style={{ fontSize: "12px" }}></i>
      </div>
    );
  }

  const settings = {
    dots: false,
    autoplay: false,
    slidesToShow: 4,
    margin: 24,
    speed: 500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1500, settings: { slidesToShow: 4 } },
      { breakpoint: 1400, settings: { slidesToShow: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 4 } },
      { breakpoint: 800, settings: { slidesToShow: 2 } },
      { breakpoint: 776, settings: { slidesToShow: 2 } },
      { breakpoint: 567, settings: { slidesToShow: 1 } },
    ],
  };

  const Syllabus = {
    dots: false,
    autoplay: false,
    arrows: false,
    slidesToShow: 4,
    margin: 24,
    speed: 500,
    responsive: [
      { breakpoint: 1500, settings: { slidesToShow: 4 } },
      { breakpoint: 1400, settings: { slidesToShow: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 4 } },
      { breakpoint: 800, settings: { slidesToShow: 2 } },
      { breakpoint: 776, settings: { slidesToShow: 2 } },
      { breakpoint: 567, settings: { slidesToShow: 1 } },
    ],
  };

  const [studentDonutChart] = useState<any>({
    chart: { height: 90, type: "donut", toolbar: { show: false } },
    grid: { show: false, padding: { left: 0, right: 0 } },
    plotOptions: { bar: { horizontal: false, columnWidth: "50%" } },
    dataLabels: { enabled: false },
    series: [95, 5],
    labels: ["Completed", "Pending"],
    legend: { show: false },
    colors: ["#1ABE17", "#E82646"],
    responsive: [
      {
        breakpoint: 480,
        options: { chart: { width: 100 }, legend: { position: "bottom" } },
      },
    ],
  });

  const [attendance_chart] = useState<any>({
    chart: { height: 290, type: "donut", toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: "50%" } },
    dataLabels: { enabled: false },
    series: [60, 5, 15, 20],
    labels: ["Present", "Late", "Half Day", "Absent"],
    colors: ["#1ABE17", "#1170E4", "#E9EDF4", "#E82646"],
    responsive: [
      {
        breakpoint: 480,
        options: { chart: { width: 200 }, legend: { position: "left" } },
      },
    ],
    legend: { position: "bottom" },
  });

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${month}-${day}-${year}`;
  const defaultValue = dayjs(formattedDate);

  const fetchTeacherDetails = async () => {
    try {
      setLoading(true); // Start loading
      console.log("Fetching teacher details...");
      const teacherId = localStorage.getItem("teacherId");
      console.log("Teacher ID:", teacherId);

      const response = await getTeacherById(teacherId ?? "");
      console.log("Teacher API Response:", response);

      if (response.status === 200) {
        const teacherDetails = response.data;
        console.log("Teacher Details:", teacherDetails);
        setTeacherdata(teacherDetails);
      } else {
        console.error("Failed to fetch teacher details");
      }
    } catch (error) {
      console.error("Error fetching teacher details:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    //console.log("TeacherDashboard mounted, fetching teacher details...");
    fetchTeacherDetails();
  }, []);

  const [activeTab, setActiveTab] = useState(routes.teacheruimodern);

  const renderContent = () => {
    if (loading) {
      // Skeleton for TeacherDetails (default tab)
      return (
        <div className="row">
          <div className="col-12">
            <div className="card flex-fill mb-4">
              <div className="card-header">
                <SkeletonPlaceholder className="w-25" />
              </div>
              <div className="card-body">
                <div className="border rounded p-3 pb-0">
                  <div className="row">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div className="col-sm-6 col-lg-4" key={index}>
                        <div className="mb-3">
                          <SkeletonPlaceholder className="w-50 mb-1" />
                          <SkeletonPlaceholder className="w-75" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xxl-6 d-flex">
                <div className="card flex-fill mb-4">
                  <div className="card-header">
                    <SkeletonPlaceholder className="w-25" />
                  </div>
                  <div className="card-body">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div
                        className="bg-light border rounded d-flex align-items-center justify-content-between mb-3 p-2"
                        key={index}
                      >
                        <div className="d-flex align-items-center overflow-hidden">
                          <SkeletonPlaceholder className="rounded me-2" style={{ width: '40px', height: '40px' }} />
                          <div className="ms-2">
                            <SkeletonPlaceholder className="w-75" />
                          </div>
                        </div>
                        <SkeletonPlaceholder className="rounded" style={{ width: '40px', height: '30px' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-xxl-6 d-flex">
                <div className="card flex-fill mb-4">
                  <div className="card-header">
                    <SkeletonPlaceholder className="w-25" />
                  </div>
                  <div className="card-body">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div className="d-flex align-items-center mb-3" key={index}>
                        <SkeletonPlaceholder className="rounded me-2" style={{ width: '40px', height: '40px' }} />
                        <div>
                          <SkeletonPlaceholder className="w-50 mb-1" />
                          <SkeletonPlaceholder className="w-75" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-xxl-12">
                <div className="card flex-fill mb-4">
                  <div className="card-header">
                    <SkeletonPlaceholder className="w-25" />
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div className="col-md-4" key={index}>
                          <div className="mb-3">
                            <SkeletonPlaceholder className="w-50 mb-1" />
                            <SkeletonPlaceholder className="w-75" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-6 d-flex">
                <div className="card flex-fill mb-4">
                  <div className="card-header">
                    <SkeletonPlaceholder className="w-25" />
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div className="col-md-4" key={index}>
                          <div className="mb-3">
                            <SkeletonPlaceholder className="w-50 mb-1" />
                            <SkeletonPlaceholder className="w-75" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-6 d-flex">
                <div className="card flex-fill mb-4">
                  <div className="card-header">
                    <SkeletonPlaceholder className="w-25" />
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div className="col-md-4" key={index}>
                          <div className="mb-3">
                            <SkeletonPlaceholder className="w-50 mb-1" />
                            <SkeletonPlaceholder className="w-75" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case routes.teacherDetails:
        return <TeacherDetails />;
      case routes.teacheruimodern:
        // return <Teacherui />;
      case routes.teachersRoutine:
        return <TeachersRoutine />;
      case routes.teacherLeaves:
        return <TeacherLeave />;
      case routes.teacherSalary:
        return <TeacherSalary />;
      case routes.MyClassesWithStudents:
        return <MyClassesWithStudents />;
      case routes.AcademicUploads:
        return <AcademicUploads />;
      case routes.examSchedule:
        return <ExamSchedule />;
      case routes.SelfEnhancement:
        return <SelfEnhancement />;
      case routes.DoubtForum:
        return <DoubtForum />;
      case routes.tickets:
        return <Tickets />;
      default:
        return <div className="card"><div className="card-body">Select a tab to view content</div></div>;
    }
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className={ismobile ? "page-wrapper" : "p-3"}>
        <div className="content">
          <div className="row">
            {/* Page Header */}
            {loading ? (
              <div className="col-12 mb-3">
                <SkeletonPlaceholder className="w-100" style={{ height: '50px' }} />
              </div>
            ) : (
              <>
                <TeacherBreadcrumb />
                <div className="mb-2">
                  <Link to={all_routes.markFaceAttendance} className="btn btn-sm btn-primary">Mark Face Attendance</Link>
                </div>
              </>
            )}
            {/* Teacher Information */}
            {loading ? (
              <div className="col-xxl-3 col-xl-4">
                <div className="card mb-3">
                  <div className="card-body">
                    <SkeletonPlaceholder className="rounded-circle mx-auto d-block mb-3" style={{ width: '100px', height: '100px' }} />
                    <SkeletonPlaceholder className="w-50 mx-auto d-block mb-2" />
                    <SkeletonPlaceholder className="w-75 mx-auto d-block mb-3" />
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div className="mb-2" key={index}>
                        <SkeletonPlaceholder className="w-25 mb-1" />
                        <SkeletonPlaceholder className="w-50" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <TeacherSidebar />
            )}
            {/* Main Content */}
            <div className="col-xxl-9 col-xl-8">
              <div className="row">
                <div className="col-md-12">
                  {loading ? (
                    <div className="card mb-3">
                      <div className="card-body">
                        <ul className="nav nav-tabs">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <li className="nav-item" key={index}>
                              <SkeletonPlaceholder className="w-100 px-3 py-2" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <TeacherBar activeTab={activeTab} setActiveTab={setActiveTab} />
                  )}
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TeacherModal />
    </>
  );
};

export default TeacherDashboard;