// // // // // import React, { useEffect } from "react";
// // // // // import TeacherModal from "../teacherModal";
// // // // // import { Link } from "react-router-dom";
// // // // // import { all_routes } from "../../../../../router/all_routes";
// // // // // import TeacherSidebar from "./teacherSidebar";
// // // // // import TeacherBreadcrumb from "./teacherBreadcrumb";
// // // // // import useMobileDetection from "../../../../../core/common/mobileDetection";
// // // // // import { getLessonByteacherId } from "../../../../../services/teacher/lessonServices";
// // // // // import { getClassesByTeacherId } from "../../../../../services/teacher/classServices";

// // // // // const TeachersRoutine = () => {
// // // // //   const routes = all_routes;
// // // // //   const ismobile=useMobileDetection();
// // // // //   const fetchroutine=async()=>{
// // // // //     const res=await getLessonByteacherId(localStorage.getItem("teacherId") ??"");
// // // // //     const classres=await getClassesByTeacherId(localStorage.getItem("teacherId")??"");
// // // // //     // const sectionres=
// // // // //     console.log(classres);
// // // // //     console.log("res",res);
// // // // //   }
// // // // //   useEffect(()=>{
// // // // //     fetchroutine();
// // // // //   },[])
// // // // //   return (
// // // // //     <>
// // // // //         <div className={ismobile?"page-wrapper":"p-3"}>
// // // // //         <div className="content">
// // // // //           <div className="row">
// // // // //             {/* Page Header */}
// // // // //             <TeacherBreadcrumb />
// // // // //             {/* /Page Header */}
// // // // //             {/* Student Information */}
// // // // //             <TeacherSidebar />
// // // // //             {/* /Student Information */}
// // // // //             <div className="col-xxl-9 col-xl-8">
// // // // //               <div className="row">
// // // // //                 <div className="col-md-12">
// // // // //                   {/* List */}
// // // // //                   <ul className="nav nav-tabs nav-tabs-bottom mb-4">
// // // // //                     <li>
// // // // //                       <Link to={routes.teacherDetails} className="nav-link ">
// // // // //                         <i className="ti ti-school me-2" />
// // // // //                         Teacher Details
// // // // //                       </Link>
// // // // //                     </li>
// // // // //                     <li>
// // // // //                       <Link
// // // // //                         to={routes.teachersRoutine}
// // // // //                         className="nav-link active"
// // // // //                       >
// // // // //                         <i className="ti ti-table-options me-2" />
// // // // //                         Routine
// // // // //                       </Link>
// // // // //                     </li>
// // // // //                     <li>
// // // // //                       <Link to={routes.teacherLeaves} className="nav-link ">
// // // // //                         <i className="ti ti-calendar-due me-2" />
// // // // //                         Leave &amp; Attendance
// // // // //                       </Link>
// // // // //                     </li>
// // // // //                     <li>
// // // // //                       <Link to={routes.teacherSalary} className="nav-link">
// // // // //                         <i className="ti ti-report-money me-2" />
// // // // //                         Salary
// // // // //                       </Link>
// // // // //                     </li>
// // // // //                     <li>
// // // // //                       <Link to={routes.teacherLibrary} className="nav-link">
// // // // //                         <i className="ti ti-bookmark-edit me-2" />
// // // // //                         Library
// // // // //                       </Link>
// // // // //                     </li>
// // // // //                   </ul>
// // // // //                   {/* /List */}
// // // // //                   <div className="card">
// // // // //                     <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
// // // // //                       <h4 className="mb-3">Time Table</h4>
// // // // //                       <div className="d-flex align-items-center flex-wrap">
// // // // //                         <div className="dropdown mb-3">
// // // // //                           <Link
// // // // //                             to="#"
// // // // //                             className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
// // // // //                             data-bs-toggle="dropdown"
// // // // //                           >
// // // // //                             <i className="ti ti-calendar-due me-2" />
// // // // //                             This Year
// // // // //                           </Link>
// // // // //                           <ul className="dropdown-menu p-3">
// // // // //                             <li>
// // // // //                               <Link to="#" className="dropdown-item rounded-1">
// // // // //                                 This Year
// // // // //                               </Link>
// // // // //                             </li>
// // // // //                             <li>
// // // // //                               <Link to="#" className="dropdown-item rounded-1">
// // // // //                                 This Month
// // // // //                               </Link>
// // // // //                             </li>
// // // // //                             <li>
// // // // //                               <Link to="#" className="dropdown-item rounded-1">
// // // // //                                 This Week
// // // // //                               </Link>
// // // // //                             </li>
// // // // //                           </ul>
// // // // //                         </div>
// // // // //                       </div>
// // // // //                     </div>
// // // // //                     <div className="card-body">
// // // // //                       <div className="d-flex flex-nowrap overflow-auto">
// // // // //                         <div className="d-flex flex-column me-4 flex-fill">
// // // // //                           <div className="mb-3">
// // // // //                             <h6>Monday</h6>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:104
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <span className="text-dark d-block py-2">
// // // // //                               Class : III, A
// // // // //                             </span>
// // // // //                             <span className="text-dark d-block pb-2">
// // // // //                               Subject : Spanish
// // // // //                             </span>
// // // // //                             <p className="text-dark">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               09:45 -10:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:104
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               09:45 -10:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:108
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : I, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               03:15 - 04:00 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:107
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : V, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : English
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               11:30 - 12:15 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:108
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : IV, B
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               02:15 - 03:00 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:106
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : IV, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : English
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               10:45 - 11:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:104
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               09:45 -10:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                         </div>
// // // // //                         <div className="d-flex flex-column me-4 flex-fill">
// // // // //                           <div className="mb-3">
// // // // //                             <h6>Tuesday</h6>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:104
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               09:45 -10:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:108
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : IV, B
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               02:15 - 03:00 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:107
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : V, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : English
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               11:30 - 12:15 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:106
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : IV, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : English
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               10:45 - 11:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:108
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : I, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               03:15 - 04:00 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:104
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               09:45 -10:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:104
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               09:45 -10:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                         </div>
// // // // //                         <div className="d-flex flex-column me-4 flex-fill">
// // // // //                           <div className="mb-3">
// // // // //                             <h6>Wednesday</h6>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:104
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Computer
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               09:00 - 09:45 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:106
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : II, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Science
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               09:45 - 10:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:106
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, B
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Maths
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               10:45 - 11:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:108
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : IV, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Chemistry
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               11:30 - 12:15 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:106
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Physics
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               01:30 - 02:15 PM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:101
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Englishh
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               02:15 - 03:00 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:104
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               03:15 - 04:00 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                         </div>
// // // // //                         <div className="d-flex flex-column me-4 flex-fill">
// // // // //                           <div className="mb-3">
// // // // //                             <h6>Thursday</h6>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:104
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               09:00 - 09:45 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:106
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Physics
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               09:45 - 10:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:108
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : II, B
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : English
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               10:45 - 11:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:106
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : IV, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Science
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               11:30 - 12:15 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:104
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : I, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               01:30 - 02:15 PM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:101
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, B
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Chemistry
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               02:15 - 03:00 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:108
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Maths
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               03:15 - 04:00 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                         </div>
// // // // //                         <div className="d-flex flex-column me-4 flex-fill">
// // // // //                           <div className="mb-3">
// // // // //                             <h6>Friday</h6>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:104
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               09:45 -10:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:106
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : IV, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : English
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               10:45 - 11:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:107
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : V, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : English
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               11:30 - 12:15 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:108
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : IV, B
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               02:15 - 03:00 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:108
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : I, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               03:15 - 04:00 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:104
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               09:45 -10:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:104
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               09:45 -10:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                         </div>
// // // // //                         <div className="d-flex flex-column me-4 flex-fill">
// // // // //                           <div className="mb-3">
// // // // //                             <h6>Saturday</h6>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:104
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               09:45 -10:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:106
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : IV, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : English
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               10:45 - 11:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:107
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : V, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : English
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               11:30 - 12:15 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:108
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : IV, B
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               02:15 - 03:00 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:108
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : I, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               03:15 - 04:00 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:104
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               09:45 -10:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                           <div className="rounded p-3 mb-4 border">
// // // // //                             <div className="pb-3 border-bottom">
// // // // //                               <span className="text-danger badge bg-transparent-danger text-nowrap ">
// // // // //                                 Room No:104
// // // // //                               </span>
// // // // //                             </div>
// // // // //                             <p className="text-dark d-block py-2 m-0">
// // // // //                               Class : III, A
// // // // //                             </p>
// // // // //                             <p className="text-dark d-block pb-2 m-0">
// // // // //                               Subject : Spanish
// // // // //                             </p>
// // // // //                             <p className="text-dark text-nowrap m-0">
// // // // //                               <i className="ti ti-clock me-1" />
// // // // //                               09:45 -10:30 AM
// // // // //                             </p>
// // // // //                           </div>
// // // // //                         </div>
// // // // //                       </div>
// // // // //                     </div>
// // // // //                     <div className="card-footer border-0 pb-0">
// // // // //                       <div className="row">
// // // // //                         <div className="col-lg-4 col-xxl-4 col-xl-4 d-flex">
// // // // //                           <div className="card flex-fill">
// // // // //                             <div className="card-body bg-transparent-primary">
// // // // //                               <span className="bg-primary badge badge-sm mb-2">
// // // // //                                 Morning Break
// // // // //                               </span>
// // // // //                               <p className="text-dark">
// // // // //                                 <i className="ti ti-clock me-1" />
// // // // //                                 10:30 to 10 :45 AM
// // // // //                               </p>
// // // // //                             </div>
// // // // //                           </div>
// // // // //                         </div>
// // // // //                         <div className="col-lg-4 col-xxl-3 d-flex">
// // // // //                           <div className="card flex-fill">
// // // // //                             <div className="card-body bg-transparent-warning">
// // // // //                               <span className="bg-warning badge badge-sm mb-2">
// // // // //                                 Lunch
// // // // //                               </span>
// // // // //                               <p className="text-dark">
// // // // //                                 <i className="ti ti-clock me-1" />
// // // // //                                 10:30 to 10 :45 AM
// // // // //                               </p>
// // // // //                             </div>
// // // // //                           </div>
// // // // //                         </div>
// // // // //                         <div className="col-lg-4 col-xxl-3 d-flex">
// // // // //                           <div className="card flex-fill">
// // // // //                             <div className="card-body bg-transparent-info">
// // // // //                               <span className="bg-info badge badge-sm mb-2">
// // // // //                                 Evening Break
// // // // //                               </span>
// // // // //                               <p className="text-dark">
// // // // //                                 <i className="ti ti-clock me-1" />
// // // // //                                 03:30 PM to 03:45 PM
// // // // //                               </p>
// // // // //                             </div>
// // // // //                           </div>
// // // // //                         </div>
// // // // //                       </div>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //       {/* /Page Wrapper */}
// // // // //       <TeacherModal />
// // // // //     </>
// // // // //   );
// // // // // };

// // // // // export default TeachersRoutine;


// // // // import React, { useEffect, useState } from "react";
// // // // import TeacherModal from "../teacherModal";
// // // // import { Link } from "react-router-dom";
// // // // import { all_routes } from "../../../../../router/all_routes";
// // // // import TeacherSidebar from "./teacherSidebar";
// // // // import TeacherBreadcrumb from "./teacherBreadcrumb";
// // // // import useMobileDetection from "../../../../../core/common/mobileDetection";
// // // // import { getLessonByteacherId } from "../../../../../services/teacher/lessonServices";
// // // // import { getClassesByTeacherId } from "../../../../../services/teacher/classServices";
// // // // import { getTeacherById } from "../../../../../services/admin/teacherRegistartion";

// // // // const TeachersRoutine = () => {
// // // //   const routes = all_routes;
// // // //   const ismobile = useMobileDetection();
// // // //   const [lessons, setLessons] = useState<any[]>([]);
// // // //   const [classes, setClasses] = useState<any[]>([]);

// // // //   const fetchroutine = async () => {
// // // //     try {
// // // //       const lessonRes = await getTeacherById(localStorage.getItem("teacherId") ?? "");
// // // //       // const classRes = await getClassesByTeacherId(localStorage.getItem("teacherId") ?? "");
// // // //       if (lessonRes.status === 200) {
// // // //         setLessons(lessonRes.data);
// // // //       }
// // // //       // if (classRes.status === 200) {
// // // //       //   setClasses(classRes.data);
// // // //       // }
// // // //       console.log("Lessons:", lessonRes.data);
// // // //       // console.log("Classes:", classRes.data);
// // // //     } catch (error) {
// // // //       console.error("Error fetching routine:", error);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     fetchroutine();
// // // //   }, []);

// // // //   // Group lessons by day
// // // //   const groupLessonsByDay = () => {
// // // //     const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
// // // //     const grouped: { [key: string]: any[] } = {};
// // // //     days.forEach((day) => {
// // // //       grouped[day] = lessons
// // // //         .filter((lesson) => lesson.day === day)
// // // //         .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
// // // //     });
// // // //     return grouped;
// // // //   };

// // // //   const formatTime = (isoTime: string) => {
// // // //     return new Date(isoTime).toLocaleTimeString("en-US", {
// // // //       hour: "2-digit",
// // // //       minute: "2-digit",
// // // //       hour12: true,
// // // //     });
// // // //   };

// // // //   const groupedLessons = groupLessonsByDay();

// // // //   return (
// // // //     <>
// // // //       <div className={ismobile ? "page-wrapper" : "p-3"}>
// // // //         <div className="content">
// // // //           <div className="row">
// // // //             {/* Page Header */}
// // // //             <TeacherBreadcrumb />
// // // //             {/* /Page Header */}
// // // //             {/* Teacher Information */}
// // // //             <TeacherSidebar />
// // // //             {/* /Teacher Information */}
// // // //             <div className="col-xxl-9 col-xl-8">
// // // //               <div className="row">
// // // //                 <div className="col-md-12">
// // // //                   {/* List */}
// // // //                   <ul className="nav nav-tabs nav-tabs-bottom mb-4">
// // // //                     <li>
// // // //                       <Link to={routes.teacherDetails} className="nav-link">
// // // //                         <i className="ti ti-school me-2" />
// // // //                         Teacher Details
// // // //                       </Link>
// // // //                     </li>
// // // //                     <li>
// // // //                       <Link to={routes.teachersRoutine} className="nav-link active">
// // // //                         <i className="ti ti-table-options me-2" />
// // // //                         Routine
// // // //                       </Link>
// // // //                     </li>
// // // //                     <li>
// // // //                       <Link to={routes.teacherLeaves} className="nav-link">
// // // //                         <i className="ti ti-calendar-due me-2" />
// // // //                         Leave & Attendance
// // // //                       </Link>
// // // //                     </li>
// // // //                     <li>
// // // //                       <Link to={routes.teacherSalary} className="nav-link">
// // // //                         <i className="ti ti-report-money me-2" />
// // // //                         Salary
// // // //                       </Link>
// // // //                     </li>
// // // //                     <li>
// // // //                       <Link to={routes.teacherLibrary} className="nav-link">
// // // //                         <i className="ti ti-bookmark-edit me-2" />
// // // //                         Library
// // // //                       </Link>
// // // //                     </li>
// // // //                   </ul>
// // // //                   {/* /List */}
// // // //                   <div className="card">
// // // //                     <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
// // // //                       <h4 className="mb-3">Time Table</h4>
// // // //                       <div className="d-flex align-items-center flex-wrap">
// // // //                         <div className="dropdown mb-3">
// // // //                           <Link
// // // //                             to="#"
// // // //                             className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
// // // //                             data-bs-toggle="dropdown"
// // // //                           >
// // // //                             <i className="ti ti-calendar-due me-2" />
// // // //                             This Year
// // // //                           </Link>
// // // //                           <ul className="dropdown-menu p-3">
// // // //                             <li>
// // // //                               <Link to="#" className="dropdown-item rounded-1">
// // // //                                 This Year
// // // //                               </Link>
// // // //                             </li>
// // // //                             <li>
// // // //                               <Link to="#" className="dropdown-item rounded-1">
// // // //                                 This Month
// // // //                               </Link>
// // // //                             </li>
// // // //                             <li>
// // // //                               <Link to="#" className="dropdown-item rounded-1">
// // // //                                 This Week
// // // //                               </Link>
// // // //                             </li>
// // // //                           </ul>
// // // //                         </div>
// // // //                       </div>
// // // //                     </div>
// // // //                     <div className="card-body">
// // // //                       <div className="d-flex flex-nowrap overflow-auto">
// // // //                         {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((day) => (
// // // //                           <div key={day} className="d-flex flex-column me-4 flex-fill">
// // // //                             <div className="mb-3">
// // // //                               <h6>{day.charAt(0) + day.slice(1).toLowerCase()}</h6>
// // // //                             </div>
// // // //                             {groupedLessons[day].length > 0 ? (
// // // //                               groupedLessons[day].map((lesson: any) => (
// // // //                                 <div key={lesson.id} className="rounded p-3 mb-4 border">
// // // //                                   <div className="pb-3 border-bottom">
// // // //                                     <span className="text-danger badge bg-transparent-danger text-nowrap">
// // // //                                       Room No: {lesson.roomNumber || "N/A"}
// // // //                                     </span>
// // // //                                   </div>
// // // //                                   <p className="text-dark d-block py-2 m-0">
// // // //                                     Class: {lesson.class?.name} {lesson.class?.section}
// // // //                                   </p>
// // // //                                   <p className="text-dark d-block pb-2 m-0">
// // // //                                     Subject: {lesson.subject?.name || "N/A"}
// // // //                                   </p>
// // // //                                   <p className="text-dark text-nowrap m-0">
// // // //                                     <i className="ti ti-clock me-1" />
// // // //                                     {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
// // // //                                   </p>
// // // //                                 </div>
// // // //                               ))
// // // //                             ) : (
// // // //                               <div className="rounded p-3 mb-4 border">
// // // //                                 <p className="text-dark text-center m-0">No lessons scheduled</p>
// // // //                               </div>
// // // //                             )}
// // // //                           </div>
// // // //                         ))}
// // // //                       </div>
// // // //                     </div>
// // // //                     <div className="card-footer border-0 pb-0">
// // // //                       <div className="row">
// // // //                         <div className="col-lg-4 col-xxl-4 col-xl-4 d-flex">
// // // //                           <div className="card flex-fill">
// // // //                             <div className="card-body bg-transparent-primary">
// // // //                               <span className="bg-primary badge badge-sm mb-2">
// // // //                                 Morning Break
// // // //                               </span>
// // // //                               <p className="text-dark">
// // // //                                 <i className="ti ti-clock me-1" />
// // // //                                 10:30 to 10:45 AM
// // // //                               </p>
// // // //                             </div>
// // // //                           </div>
// // // //                         </div>
// // // //                         <div className="col-lg-4 col-xxl-3 d-flex">
// // // //                           <div className="card flex-fill">
// // // //                             <div className="card-body bg-transparent-warning">
// // // //                               <span className="bg-warning badge badge-sm mb-2">
// // // //                                 Lunch
// // // //                               </span>
// // // //                               <p className="text-dark">
// // // //                                 <i className="ti ti-clock me-1" />
// // // //                                 12:15 to 01:30 PM
// // // //                               </p>
// // // //                             </div>
// // // //                           </div>
// // // //                         </div>
// // // //                         <div className="col-lg-4 col-xxl-3 d-flex">
// // // //                           <div className="card flex-fill">
// // // //                             <div className="card-body bg-transparent-info">
// // // //                               <span className="bg-info badge badge-sm mb-2">
// // // //                                 Evening Break
// // // //                               </span>
// // // //                               <p className="text-dark">
// // // //                                 <i className="ti ti-clock me-1" />
// // // //                                 03:00 to 03:15 PM
// // // //                               </p>
// // // //                             </div>
// // // //                           </div>
// // // //                         </div>
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //       {/* /Page Wrapper */}
// // // //       <TeacherModal />
// // // //     </>
// // // //   );
// // // // };

// // // // export default TeachersRoutine;



// // // import React, { useEffect, useState } from "react";
// // // import TeacherModal from "../teacherModal";
// // // import { Link } from "react-router-dom";
// // // import { all_routes } from "../../../../../router/all_routes";

// // // import TeacherBreadcrumb from "./teacherBreadcrumb";
// // // import useMobileDetection from "../../../../../core/common/mobileDetection";
// // // import { getTeacherById } from "../../../../../services/admin/teacherRegistartion";
// // // import { getClassesByTeacherId } from "../../../../../services/teacher/classServices";
// // // import TeacherSidebar from "./teacherSidebar";

// // // const TeachersRoutine = ({ teacherdata }: { teacherdata: any }) => {
// // //   const routes = all_routes;
// // //   const ismobile = useMobileDetection();
// // //   // const [lessons, setLessons] = useState<any[]>([]);
// // //   const [classes, setClasses] = useState<any[]>([]);
// // // const lessons=teacherdata.lessons || [];
// // //   // const fetchroutine = async () => {
// // //   //   try {
// // //   //     const teacherRes = await getTeacherById(localStorage.getItem("teacherId") ?? "");
// // //   //    // const classRes = await getClassesByTeacherId(localStorage.getItem("teacherId") ?? "");
// // //   //     if (teacherRes.status === 200) {
       
// // //   //       setLessons(teacherRes.data.lessons || []);
// // //   //     }
// // //   //     // if (classRes.status === 200) {
// // //   //     //   setClasses(classRes.data);
// // //   //     // }
// // //   //     console.log("Lessons:", teacherRes.data.lessons);
// // //   //   //  console.log("Classes:", classRes.data);
// // //   //   } catch (error) {
// // //   //     console.error("Error fetching routine:", error);
// // //   //   }
// // //   // };

// // // //   // useEffect(() => {
// // // //   //   fetchroutine();
// // // //   // }, []);

 
// // // //   const groupLessonsByDay = () => {
// // // //     const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
// // // //     const grouped: { [key: string]: any[] } = {};
// // // //     days.forEach((day) => {
// // // //       grouped[day] = lessons
// // // //         .filter((lesson:any) => lesson.day.toUpperCase() === day)
// // // //         .sort((a:any, b:any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
// // // //     });
// // // //     return grouped;
// // // //   };

// // // //   const formatTime = (isoTime: string) => {
// // // //     if (!isoTime) return "N/A";
// // // //     return new Date(isoTime).toLocaleTimeString("en-US", {
// // // //       hour: "2-digit",
// // // //       minute: "2-digit",
// // // //       hour12: true,
// // // //     });
// // // //   };

// // // //   const groupedLessons = groupLessonsByDay();

// // // //   return (
// // // //     <>
// // // //       <div className={ismobile ? "page-wrapper" : "p-3"}>
// // // //         <div className="content">
// // // //           <div className="row">
// // // //             {/* {/* Page Header */}
// // // //             {/* <TeacherBreadcrumb /> */} 
// // // //             {/* /Page Header */}
// // // //             {/* Teacher Information */}
// // // //             {/* <TeacherSidebar /> */}
// // // //             {/* /Teacher Information */}
// // // //             <div className="col-xxl-9 col-xl-8">
// // // //               <div className="row">
// // // //                 <div className="col-md-12">
// // // //                   {/* List */}
// // // //                   {/* <ul className="nav nav-tabs nav-tabs-bottom mb-4">
// // // //                     <li>
// // // //                       <Link to={routes.teacherDetails} className="nav-link">
// // // //                         <i className="ti ti-school me-2" />
// // // //                         Teacher Details
// // // //                       </Link>
// // // //                     </li>
// // // //                     <li>
// // // //                       <Link to={routes.teachersRoutine} className="nav-link active">
// // // //                         <i className="ti ti-table-options me-2" />
// // // //                         Routine
// // // //                       </Link>
// // // //                     </li>
// // // //                     <li>
// // // //                       <Link to={routes.teacherLeaves} className="nav-link">
// // // //                         <i className="ti ti-calendar-due me-2" />
// // // //                         Leave & Attendance
// // // //                       </Link>
// // // //                     </li>
// // // //                     <li>
// // // //                       <Link to={routes.teacherSalary} className="nav-link">
// // // //                         <i className="ti ti-report-money me-2" />
// // // //                         Salary
// // // //                       </Link>
// // // //                     </li>
// // // //                     <li>
// // // //                       <Link to={routes.teacherLibrary} className="nav-link">
// // // //                         <i className="ti ti-bookmark-edit me-2" />
// // // //                         Library
// // // //                       </Link>
// // // //                     </li>
// // // //                   </ul> */}
// // // //                   {/* /List */}
// // // //                   <div className="card">
// // // //                     <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
// // // //                       <h4 className="mb-3">Time Table</h4>
// // // //                       <div className="d-flex align-items-center flex-wrap">
// // // //                         <div className="dropdown mb-3">
// // // //                           <Link
// // // //                             to="#"
// // // //                             className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
// // // //                             data-bs-toggle="dropdown"
// // // //                           >
// // // //                             <i className="ti ti-calendar-due me-2" />
// // // //                             This Year
// // // //                           </Link>
// // // //                           <ul className="dropdown-menu p-3">
// // // //                             <li>
// // // //                               <Link to="#" className="dropdown-item rounded-1">
// // // //                                 This Year
// // // //                               </Link>
// // // //                             </li>
// // // //                             <li>
// // // //                               <Link to="#" className="dropdown-item rounded-1">
// // // //                                 This Month
// // // //                               </Link>
// // // //                             </li>
// // // //                             <li>
// // // //                               <Link to="#" className="dropdown-item rounded-1">
// // // //                                 This Week
// // // //                               </Link>
// // // //                             </li>
// // // //                           </ul>
// // // //                         </div>
// // // //                       </div>
// // // //                     </div>
// // // //                     <div className="card-body">
// // // //                       <div className="d-flex flex-nowrap overflow-auto">
// // // //                         {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((day) => (
// // // //                           <div key={day} className="d-flex flex-column me-4 flex-fill">
// // // //                             <div className="mb-3">
// // // //                               <h6>{day.charAt(0) + day.slice(1).toLowerCase()}</h6>
// // // //                             </div>
// // // //                             {groupedLessons[day].length > 0 ? (
// // // //                               groupedLessons[day].map((lesson: any) => (
// // // //                                 <div key={lesson.id} className="rounded p-3 mb-4 border">
// // // //                                   <div className="pb-3 border-bottom">
// // // //                                     <span className="text-danger badge bg-transparent-danger text-nowrap">
// // // //                                       Room No: {lesson.roomNumber || "N/A"}
// // // //                                     </span>
// // // //                                   </div>
// // // //                                   <p className="text-dark d-block py-2 m-0">
// // // //                                     Class: {lesson.class?.name || "N/A"} {lesson.class?.section || ""}
// // // //                                   </p>
// // // //                                   <p className="text-dark d-block pb-2 m-0">
// // // //                                     Subject: {lesson.subject?.name || "N/A"}
// // // //                                   </p>
// // // //                                   <p className="text-dark text-nowrap m-0">
// // // //                                     <i className="ti ti-clock me-1" />
// // // //                                     {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
// // // //                                   </p>
// // // //                                 </div>
// // // //                               ))
// // // //                             ) : (
// // // //                               <div className="rounded p-3 mb-4 border">
// // // //                                 <p className="text-dark text-center m-0">No lessons scheduled</p>
// // // //                               </div>
// // // //                             )}
// // // //                           </div>
// // // //                         ))}
// // // //                       </div>
// // // //                     </div>
// // // //                     <div className="card-footer border-0 pb-0">
// // // //                       <div className="row">
// // // //                         <div className="col-lg-4 col-xxl-4 col-xl-4 d-flex">
// // // //                           <div className="card flex-fill">
// // // //                             <div className="card-body bg-transparent-primary">
// // // //                               <span className="bg-primary badge badge-sm mb-2">
// // // //                                 Morning Break
// // // //                               </span>
// // // //                               <p className="text-dark">
// // // //                                 <i className="ti ti-clock me-1" />
// // // //                                 10:30 to 10:45 AM
// // // //                               </p>
// // // //                             </div>
// // // //                           </div>
// // // //                         </div>
// // // //                         <div className="col-lg-4 col-xxl-3 d-flex">
// // // //                           <div className="card flex-fill">
// // // //                             <div className="card-body bg-transparent-warning">
// // // //                               <span className="bg-warning badge badge-sm mb-2">
// // // //                                 Lunch
// // // //                               </span>
// // // //                               <p className="text-dark">
// // // //                                 <i className="ti ti-clock me-1" />
// // // //                                 12:15 to 01:30 PM
// // // //                               </p>
// // // //                             </div>
// // // //                           </div>
// // // //                         </div>
// // // //                         <div className="col-lg-4 col-xxl-3 d-flex">
// // // //                           <div className="card flex-fill">
// // // //                             <div className="card-body bg-transparent-info">
// // // //                               <span className="bg-info badge badge-sm mb-2">
// // // //                                 Evening Break
// // // //                               </span>
// // // //                               <p className="text-dark">
// // // //                                 <i className="ti ti-clock me-1" />
// // // //                                 03:00 to 03:15 PM
// // // //                               </p>
// // // //                             </div>
// // // //                           </div>
// // // //                         </div>
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //       {/* /Page Wrapper */}
// // // //       <TeacherModal />
// // // //     </>
// // // //   );
// // // // };

// // // // export default TeachersRoutine;

// // // import React, { useEffect, useState } from "react";
// // // import TeacherModal from "../teacherModal";
// // // import { Link } from "react-router-dom";
// // // import { all_routes } from "../../../../../router/all_routes";
// // // import TeacherBreadcrumb from "./teacherBreadcrumb";
// // // import useMobileDetection from "../../../../../core/common/mobileDetection";
// // // import { getTeacherById } from "../../../../../services/admin/teacherRegistartion";
// // // import { getClassesByTeacherId } from "../../../../../services/teacher/classServices";
// // // import TeacherSidebar from "./teacherSidebar";
// // // import { useSelector } from "react-redux";


// // // const TeachersRoutine = ({ teacherdata }: { teacherdata?: any }) => {
// // //   const routes = all_routes;
// // //   const ismobile = useMobileDetection();
// // //   const [lessons, setLessons] = useState<any[]>(teacherdata?.lessons || []);
// // //   const userobj = useSelector((state: any) => state.auth.userObj);

// // //   const fetchTeacherDetails = async () => {
// // //     try {
// // //       const response = await getTeacherById(localStorage.getItem("teacherId") ?? "");
// // //       if (response.status === 200) {
// // //         const teacherDetails = response.data;
// // //         if (!teacherdata) {
// // //           setLessons(teacherDetails.lessons || []);
// // //         }
// // //        // console.log("Teacher Details:", teacherDetails);
// // //       } else {
// // //         console.error("Failed to fetch teacher details");
// // //       }
// // //     } catch (error) {
// // //       console.error("Error fetching teacher details:", error);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     if (!teacherdata) {
// // //     fetchTeacherDetails();}
// // //   }, [userobj.role]);

// // //   const groupLessonsByDay = () => {
// // //     const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
// // //     const grouped: { [key: string]: any[] } = {};
// // //     days.forEach((day) => {
// // //       grouped[day] = lessons
// // //         .filter((lesson: any) => lesson.day.toUpperCase() === day)
// // //         .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
// // //     });
// // //     return grouped;
// // //   };

// // //   const formatTime = (isoTime: string) => {
// // //     if (!isoTime) return "N/A";
// // //     return new Date(isoTime).toLocaleTimeString("en-US", {
// // //       hour: "2-digit",
// // //       minute: "2-digit",
// // //       hour12: true,
// // //     });
// // //   };

  
// // //   const cardColors = [
// // //     "#e3f2fd", // Light Blue
// // //     "#fce4ec", // Light Pink
// // //     "#e8f5e9", // Light Green
// // //     "#fff3e0", // Light Orange
// // //     "#f3e5f5", // Light Purple
// // //     "#fffde7", // Light Yellow
// // //   ];

 
// // //   const getRandomColor = () => {
// // //     return cardColors[Math.floor(Math.random() * cardColors.length)];
// // //   };

  
// // //   const dayColors: { [key: string]: string } = {};
// // //   ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].forEach((day) => {
// // //     dayColors[day] = getRandomColor();
// // //   });

// // //   const groupedLessons = groupLessonsByDay();

// // //   return (
// // //     <>
// // //       <div className={ismobile ? "page-wrapper bg-dark-theme min-vh-100 d-flex flex-column" : "p-3 bg-dark-theme min-vh-100 d-flex flex-column"}>
// // //         <div className="content flex-grow-1 bg-dark-theme overflow-auto">
// // //           <div className="row flex-grow-1">
// // //             {/* Page Header */}
// // //             {/* <TeacherBreadcrumb /> */}
// // //             {/* /Page Header */}
// // //             {/* Teacher Information */}
// // //             {/* <TeacherSidebar /> */}
// // //             {/* /Teacher Information */}
// // //             <div className="col-12 d-flex flex-column"> 
// // //               <div className="row h-100">
              
// // //                 {/* List */}
// // //                 {/* <ul className="nav nav-tabs nav-tabs-bottom mb-4">
// // //                   <li>
// // //                     <Link to={routes.teacherDetails} className="nav-link">
// // //                       <i className="ti ti-school me-2" />
// // //                       Teacher Details
// // //                     </Link>
// // //                   </li>
// // //                   <li>
// // //                     <Link to={routes.teachersRoutine} className="nav-link active">
// // //                       <i className="ti ti-table-options me-2" />
// // //                       Routine
// // //                     </Link>
// // //                   </li>
// // //                   <li>
// // //                     <Link to={routes.teacherLeaves} className="nav-link">
// // //                       <i className="ti ti-calendar-due me-2" />
// // //                       Leave & Attendance
// // //                     </Link>
// // //                   </li>
// // //                   <li>
// // //                     <Link to={routes.teacherSalary} className="nav-link">
// // //                       <i className="ti ti-report-money me-2" />
// // //                       Salary
// // //                     </Link>
// // //                   </li>
// // //                   <li>
// // //                     <Link to={routes.teacherLibrary} className="nav-link">
// // //                       <i className="ti ti-bookmark-edit me-2" />
// // //                       Library
// // //                     </Link>
// // //                   </li>
// // //                 </ul> */}
// // //                 {/* /List */}
// // //                 <div className="card flex-fill"> 
// // //                   <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
// // //                     <h4 className="mb-3">Time Table</h4>
// // //                     <div className="d-flex align-items-center flex-wrap">
// // //                       <div className="dropdown mb-3">
// // //                         <Link
// // //                           to="#"
// // //                           className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
// // //                           data-bs-toggle="dropdown"
// // //                         >
// // //                           <i className="ti ti-calendar-due me-2" />
// // //                           This Year
// // //                         </Link>
// // //                         <ul className="dropdown-menu p-3">
// // //                           <li>
// // //                             <Link to="#" className="dropdown-item rounded-1">
// // //                               This Year
// // //                             </Link>
// // //                           </li>
// // //                           <li>
// // //                             <Link to="#" className="dropdown-item rounded-1">
// // //                               This Month
// // //                             </Link>
// // //                           </li>
// // //                           <li>
// // //                             <Link to="#" className="dropdown-item rounded-1">
// // //                               This Week
// // //                             </Link>
// // //                           </li>
// // //                         </ul>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                   <div className="card-body">
// // //                     <div className="d-flex flex-nowrap overflow-auto">
// // //                       {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((day) => (
// // //                         <div key={day} className="d-flex flex-column me-4 flex-fill">
// // //                           <div className="mb-3">
// // //                             <h6>{day.charAt(0) + day.slice(1).toLowerCase()}</h6>
// // //                           </div>
// // //                           {groupedLessons[day].length > 0 ? (
// // //                             groupedLessons[day].map((lesson: any) => (
// // //                               <div
// // //                                 key={lesson.id}
// // //                                 className="rounded p-3 mb-4 border text-dark"
// // //                                 style={{ backgroundColor: dayColors[day] }} // Apply random color
// // //                               >
// // //                                 <div className="pb-3 border-bottom">
// // //                                   <span className="text-danger badge bg-transparent-danger text-nowrap">
// // //                                     Room No: {lesson.roomNumber || "N/A"}
// // //                                   </span>
// // //                                 </div>
// // //                                 <p className="text-dark d-block py-2 m-0">
// // //                                   Class: {lesson.class?.name || "N/A"} {lesson.class?.section || ""}
// // //                                 </p>
// // //                                 <p className="text-dark d-block pb-2 m-0">
// // //                                   Subject: {lesson.subject?.name || "N/A"}
// // //                                 </p>
// // //                                 <p className="text-dark text-nowrap m-0">
// // //                                   <i className="ti ti-clock me-1" />
// // //                                   {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
// // //                                 </p>
// // //                               </div>
// // //                             ))
// // //                           ) : (
// // //                             <div
// // //                               className="rounded p-3 mb-4 border text-dark"
// // //                               style={{ backgroundColor: dayColors[day] }} // Apply random color
// // //                             >
// // //                               <p className="text-dark text-center m-0">No lessons scheduled</p>
// // //                             </div>
// // //                           )}
// // //                         </div>
// // //                       ))}
// // //                     </div>
// // //                   </div>
// // //                   <div className="card-footer border-0 pb-0">
// // //                     <div className="row">
// // //                       <div className="col-lg-4 col-xxl-4 col-xl-4 d-flex">
// // //                         <div className="card flex-fill">
// // //                           <div className="card-body bg-transparent-primary">
// // //                             <span className="bg-primary badge badge-sm mb-2">
// // //                               Morning Break
// // //                             </span>
// // //                             <p className="text-dark">
// // //                               <i className="ti ti-clock me-1" />
// // //                               10:30 to 10:45 AM
// // //                             </p>
// // //                           </div>
// // //                         </div>
// // //                       </div>
// // //                       <div className="col-lg-4 col-xxl-3 d-flex">
// // //                         <div className="card flex-fill">
// // //                           <div className="card-body bg-transparent-warning">
// // //                             <span className="bg-warning badge badge-sm mb-2">
// // //                               Lunch
// // //                             </span>
// // //                             <p className="text-dark">
// // //                               <i className="ti ti-clock me-1" />
// // //                               12:15 to 01:30 PM
// // //                             </p>
// // //                           </div>
// // //                         </div>
// // //                       </div>
// // //                       <div className="col-lg-4 col-xxl-3 d-flex">
// // //                         <div className="card flex-fill">
// // //                           <div className="card-body bg-transparent-info">
// // //                             <span className="bg-info badge badge-sm mb-2">
// // //                               Evening Break
// // //                             </span>
// // //                             <p className="text-dark">
// // //                               <i className="ti ti-clock me-1" />
// // //                               03:00 to 03:15 PM
// // //                             </p>
// // //                           </div>
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //       {/* /Page Wrapper */}
// // //       <TeacherModal />
// // //     </>
// // //   );
// // // };

// // // export default TeachersRoutine;

// // import React, { useEffect, useState } from "react";
// // import TeacherModal from "../teacherModal";
// // import { Link } from "react-router-dom";
// // import { all_routes } from "../../../../../router/all_routes";
// // import TeacherBreadcrumb from "./teacherBreadcrumb";
// // import useMobileDetection from "../../../../../core/common/mobileDetection";
// // import { getTeacherById } from "../../../../../services/admin/teacherRegistartion";
// // import { getClassesByTeacherId } from "../../../../../services/teacher/classServices";
// // import TeacherSidebar from "./teacherSidebar";
// // import { useSelector } from "react-redux";

// // const TeachersRoutine = ({ teacherdata }: { teacherdata?: any }) => {
// //   const routes = all_routes;
// //   const ismobile = useMobileDetection();
// //   const [lessons, setLessons] = useState<any[]>(teacherdata?.lessons || []);
// //   const [weekStart, setWeekStart] = useState(() => {
// //     const today = new Date();
// //     const dayOfWeek = today.getDay();
// //     const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
// //     const monday = new Date(today);
// //     monday.setDate(today.getDate() + diffToMonday);
// //     monday.setHours(0, 0, 0, 0);
// //     return monday;
// //   });
// //   const [selectedClass, setSelectedClass] = useState<string | null>(null);
// //   const userobj = useSelector((state: any) => state.auth.userObj);

// //   const fetchTeacherDetails = async () => {
// //     try {
// //       const response = await getTeacherById(localStorage.getItem("teacherId") ?? "");
// //       if (response.status === 200) {
// //         const teacherDetails = response.data;
// //         if (!teacherdata) {
// //           setLessons(teacherDetails.lessons || []);
// //         }
// //       } else {
// //         console.error("Failed to fetch teacher details");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching teacher details:", error);
// //     }
// //   };

// //   useEffect(() => {
// //     if (!teacherdata) {
// //       fetchTeacherDetails();
// //     }
// //   }, [userobj.role]);

// //   const getWeekDates = (start: Date) => {
// //     const weekDates = [];
// //     for (let i = 0; i < 6; i++) { // Monday to Saturday
// //       const date = new Date(start);
// //       date.setDate(start.getDate() + i);
// //       weekDates.push(date);
// //     }
// //     return weekDates;
// //   };

// //   const weekDates = getWeekDates(weekStart);

// //   const uniqueClasses = Array.from(new Set(lessons.map(lesson => lesson.class ? `${lesson.class.name} ${lesson.class.section}` : 'N/A')));

// //   const filteredLessons = selectedClass
// //     ? lessons.filter(lesson => lesson.class && `${lesson.class.name} ${lesson.class.section}` === selectedClass)
// //     : lessons;

// //   const lessonsByDate = weekDates.map(date => {
// //     const dateString = date.toISOString().split('T')[0];
// //     const lessonsOnDate = filteredLessons.filter(lesson => {
// //       const lessonDate = new Date(lesson.startTime).toISOString().split('T')[0];
// //       return lessonDate === dateString;
// //     }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
// //     return { date, lessons: lessonsOnDate };
// //   });

// //   const formatTime = (isoTime: string) => {
// //     if (!isoTime) return "N/A";
// //     return new Date(isoTime).toLocaleTimeString("en-US", {
// //       hour: "2-digit",
// //       minute: "2-digit",
// //       hour12: true,
// //     });
// //   };

// //   const cardColors = [
// //     "#e3f2fd", // Light Blue
// //     "#fce4ec", // Light Pink
// //     "#e8f5e9", // Light Green
// //     "#fff3e0", // Light Orange
// //     "#f3e5f5", // Light Purple
// //     "#fffde7", // Light Yellow
// //   ];

// //   const getRandomColor = () => {
// //     return cardColors[Math.floor(Math.random() * cardColors.length)];
// //   };

// //   const dayColors: { [key: string]: string } = {};
// //   ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].forEach((day) => {
// //     dayColors[day] = getRandomColor();
// //   });

// //   return (
// //     <>
// //       <div className={ismobile ? "page-wrapper bg-dark-theme min-vh-100 d-flex flex-column" : "p-3 bg-dark-theme min-vh-100 d-flex flex-column"}>
// //         <div className="content flex-grow-1 bg-dark-theme overflow-auto">
// //           <div className="row flex-grow-1">
// //             <div className="col-12 d-flex flex-column"> 
// //               <div className="row h-100">
// //                 <div className="card flex-fill"> 
// //                   <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
// //                     <h4 className="mb-3">Time Table</h4>
// //                     <div className="d-flex align-items-center flex-wrap">
// //                       <div className="dropdown mb-3">
// //                         <Link
// //                           to="#"
// //                           className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
// //                           data-bs-toggle="dropdown"
// //                         >
// //                           <i className="ti ti-calendar-due me-2" />
// //                           This Year
// //                         </Link>
// //                         <ul className="dropdown-menu p-3">
// //                           <li>
// //                             <Link to="#" className="dropdown-item rounded-1">
// //                               This Year
// //                             </Link>
// //                           </li>
// //                           <li>
// //                             <Link to="#" className="dropdown-item rounded-1">
// //                               This Month
// //                             </Link>
// //                           </li>
// //                           <li>
// //                             <Link to="#" className="dropdown-item rounded-1">
// //                               This Week
// //                             </Link>
// //                           </li>
// //                         </ul>
// //                       </div>
// //                       <div className="dropdown mb-3 ms-2">
// //                         <button
// //                           className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
// //                           type="button"
// //                           id="classDropdown"
// //                           data-bs-toggle="dropdown"
// //                           aria-expanded="false"
// //                         >
// //                           {selectedClass ? selectedClass : 'All Classes'}
// //                         </button>
// //                         <ul className="dropdown-menu" aria-labelledby="classDropdown">
// //                           <li>
// //                             <button className="dropdown-item" onClick={() => setSelectedClass(null)}>
// //                               All Classes
// //                             </button>
// //                           </li>
// //                           {uniqueClasses.map(cls => (
// //                             <li key={cls}>
// //                               <button className="dropdown-item" onClick={() => setSelectedClass(cls)}>
// //                                 {cls}
// //                               </button>
// //                             </li>
// //                           ))}
// //                         </ul>
// //                       </div>
// //                       <div className="d-flex align-items-center ms-2">
// //                         <button className="btn btn-outline-light me-2" onClick={() => {
// //                           const newWeekStart = new Date(weekStart);
// //                           newWeekStart.setDate(weekStart.getDate() - 7);
// //                           setWeekStart(newWeekStart);
// //                         }}>
// //                           <i className="ti ti-chevron-left" />
// //                         </button>
// //                         <span>Week of {weekStart.toLocaleDateString()}</span>
// //                         <button className="btn btn-outline-light ms-2" onClick={() => {
// //                           const newWeekStart = new Date(weekStart);
// //                           newWeekStart.setDate(weekStart.getDate() + 7);
// //                           setWeekStart(newWeekStart);
// //                         }}>
// //                           <i className="ti ti-chevron-right" />
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <div className="card-body">
// //                     <div className="d-flex flex-nowrap overflow-auto">
// //                       {lessonsByDate.map(({ date, lessons }) => {
// //                         const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
// //                         return (
// //                           <div key={date.toISOString()} className="d-flex flex-column me-4 flex-fill">
// //                             <div className="mb-3">
// //                               <h6>{dayName.charAt(0) + dayName.slice(1).toLowerCase()}</h6>
// //                             </div>
// //                             {lessons.length > 0 ? (
// //                               lessons.map(lesson => {
// //                                 const currentTime = new Date();
// //                                 const isOngoing = currentTime >= new Date(lesson.startTime) && currentTime <= new Date(lesson.endTime);
// //                                 return (
// //                                   <div
// //                                     key={lesson.id}
// //                                     className={`rounded p-3 mb-4 border text-dark ${isOngoing ? 'ongoing' : ''}`}
// //                                     style={{ backgroundColor: dayColors[dayName] }}
// //                                   >
// //                                     <div className="pb-3 border-bottom">
// //                                       <span className="text-danger badge bg-transparent-danger text-nowrap">
// //                                         Room No: {lesson.roomNumber || "N/A"}
// //                                       </span>
// //                                     </div>
// //                                     <p className="text-dark d-block py-2 m-0">
// //                                       Class: {lesson.class?.name || "N/A"} {lesson.class?.section || ""}
// //                                     </p>
// //                                     <p className="text-dark d-block pb-2 m-0">
// //                                       Subject: {lesson.subject?.name || "N/A"}
// //                                     </p>
// //                                     <p className="text-dark text-nowrap m-0">
// //                                       <i className="ti ti-clock me-1" />
// //                                       {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
// //                                     </p>
// //                                   </div>
// //                                 );
// //                               })
// //                             ) : (
// //                               <div
// //                                 className="rounded p-3 mb-4 border text-dark"
// //                                 style={{ backgroundColor: dayColors[dayName] }}
// //                               >
// //                                 <p className="text-dark text-center m-0">No lessons scheduled</p>
// //                               </div>
// //                             )}
// //                           </div>
// //                         );
// //                       })}
// //                     </div>
// //                   </div>
// //                   <div className="card-footer border-0 pb-0">
// //                     <div className="row">
// //                       <div className="col-lg-4 col-xxl-4 col-xl-4 d-flex">
// //                         <div className="card flex-fill">
// //                           <div className="card-body bg-transparent-primary">
// //                             <span className="bg-primary badge badge-sm mb-2">
// //                               Morning Break
// //                             </span>
// //                             <p className="text-dark">
// //                               <i className="ti ti-clock me-1" />
// //                               10:30 to 10:45 AM
// //                             </p>
// //                           </div>
// //                         </div>
// //                       </div>
// //                       <div className="col-lg-4 col-xxl-3 d-flex">
// //                         <div className="card flex-fill">
// //                           <div className="card-body bg-transparent-warning">
// //                             <span className="bg-warning badge badge-sm mb-2">
// //                               Lunch
// //                             </span>
// //                             <p className="text-dark">
// //                               <i className="ti ti-clock me-1" />
// //                               12:15 to 01:30 PM
// //                             </p>
// //                           </div>
// //                         </div>
// //                       </div>
// //                       <div className="col-lg-4 col-xxl-3 d-flex">
// //                         <div className="card flex-fill">
// //                           <div className="card-body bg-transparent-info">
// //                             <span className="bg-info badge badge-sm mb-2">
// //                               Evening Break
// //                             </span>
// //                             <p className="text-dark">
// //                               <i className="ti ti-clock me-1" />
// //                               03:00 to 03:15 PM
// //                             </p>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //       <TeacherModal />
// //       <style jsx>{`
// //         .ongoing {
// //           border: 2px solid red;
// //           background-color: #ffebee;
// //         }
// //       `}</style>
// //     </>
// //   );
// // };

// // export default TeachersRoutine;


// import React, { useEffect, useState } from "react";
// import TeacherModal from "../teacherModal";
// import { Link } from "react-router-dom";
// import { all_routes } from "../../../../../router/all_routes";
// import TeacherBreadcrumb from "./teacherBreadcrumb";
// import useMobileDetection from "../../../../../core/common/mobileDetection";
// import { getTeacherById } from "../../../../../services/admin/teacherRegistartion";
// import { getClassesByTeacherId } from "../../../../../services/teacher/classServices";
// import TeacherSidebar from "./teacherSidebar";
// import { useSelector } from "react-redux";

// const TeachersRoutine = ({ teacherdata }: { teacherdata?: any }) => {
//   const routes = all_routes;
//   const ismobile = useMobileDetection();
//   const [lessons, setLessons] = useState<any[]>(teacherdata?.lessons || []);
//   const [weekStart, setWeekStart] = useState<Date>(() => {
//     const today = new Date("2025-06-20T18:00:00+05:30"); // Current date: June 20, 2025, 6:00 PM IST
//     const dayOfWeek = today.getDay(); // Friday = 5
//     const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday
//     const monday = new Date(today);
//     monday.setDate(today.getDate() + diffToMonday);
//     monday.setHours(0, 0, 0, 0);
//     return monday; // Sets to June 16, 2025
//   });
//   const [selectedClass, setSelectedClass] = useState<string | null>(null);
//   const userobj = useSelector((state: any) => state.auth.userObj);

//   const fetchTeacherDetails = async () => {
//     try {
//       const response = await getTeacherById(localStorage.getItem("teacherId") ?? "");
//       if (response.status === 200) {
//         const teacherDetails = response.data;
//         if (!teacherdata) {
//           setLessons(teacherDetails.lessons || []);
//         }
      
//       } else {
//         console.error("Failed to fetch teacher details");
//       }
//     } catch (error) {
//       console.error("Error fetching teacher details:", error);
//     }
//   };
//   console.log("object",lessons);
//   useEffect(() => {
//     if (!teacherdata) {
//       fetchTeacherDetails();
//     }
//   }, [userobj.role]);

//   const getWeekDates = (start: Date) => {
//     const weekDates = [];
//     for (let i = 0; i < 6; i++) {
//       // Monday to Saturday
//       const date = new Date(start);
//       date.setDate(start.getDate() + i);
//       weekDates.push(date);
//     }
//     return weekDates;
//   };

//   const weekDates = getWeekDates(weekStart);

//   const uniqueClasses = Array.from(
//     new Set(lessons.map((lesson) => (lesson.class ? `${lesson.class.name} ${lesson.class.section}` : "N/A")))
//   );

//   const filteredLessons = selectedClass
//     ? lessons.filter((lesson) => lesson.class && `${lesson.class.name} ${lesson.class.section}` === selectedClass)
//     : lessons;

//   const lessonsByDate = weekDates.map((date) => {
//     const dateString = date.toISOString().split("T")[0];
//     const lessonsOnDate = filteredLessons
//       .filter((lesson) => {
//         const lessonDate = new Date(lesson.startTime).toISOString().split("T")[0];
//         return lessonDate === dateString;
//       })
//       .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
//     return { date, lessons: lessonsOnDate };
//   });

//   const formatTime = (isoTime: string) => {
//     if (!isoTime) return "N/A";
//     return new Date(isoTime).toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//       timeZone: "Asia/Kolkata", // Ensure IST
//     });
//   };

//   const handleWeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedDate = new Date(e.target.value);
//     const dayOfWeek = selectedDate.getDay();
//     const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
//     const monday = new Date(selectedDate);
//     monday.setDate(selectedDate.getDate() + diffToMonday);
//     monday.setHours(0, 0, 0, 0);
//     setWeekStart(monday);
//   };

//   const cardColors = ["#e3f2fd", "#fce4ec", "#e8f5e9", "#fff3e0", "#f3e5f5", "#fffde7"];

//   const getRandomColor = () => {
//     return cardColors[Math.floor(Math.random() * cardColors.length)];
//   };

//   const dayColors: { [key: string]: string } = {};
//   ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].forEach((day) => {
//     dayColors[day] = getRandomColor();
//   });

//   return (
//     <>
//       <div
//         className={ismobile ? "page-wrapper bg-dark-theme min-vh-100 d-flex flex-column" : "p-3 bg-dark-theme min-vh-100 d-flex flex-column"}
//       >
//         <div className="content flex-grow-1 bg-dark-theme overflow-auto">
//           <div className="row flex-grow-1">
//             <div className="col-12 d-flex flex-column">
//               <div className="row h-100">
//                 <div className="card flex-fill">
//                   <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
//                     <h4 className="mb-3">Time Table</h4>
//                     <div className="d-flex align-items-center flex-wrap">
//                       <div className="dropdown mb-3">
//                         <Link
//                           to="#"
//                           className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
//                           data-bs-toggle="dropdown"
//                         >
//                           <i className="ti ti-calendar-due me-2" />
//                           This Year
//                         </Link>
//                         <ul className="dropdown-menu p-3">
//                           <li>
//                             <Link to="#" className="dropdown-item rounded-1">
//                               This Year
//                             </Link>
//                           </li>
//                           <li>
//                             <Link to="#" className="dropdown-item rounded-1">
//                               This Month
//                             </Link>
//                           </li>
//                           <li>
//                             <Link to="#" className="dropdown-item rounded-1">
//                               This Week
//                             </Link>
//                           </li>
//                         </ul>
//                       </div>
//                       <div className="dropdown mb-3 ms-2">
//                         <button
//                           className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
//                           type="button"
//                           id="classDropdown"
//                           data-bs-toggle="dropdown"
//                           aria-expanded="false"
//                         >
//                           {selectedClass ? selectedClass : "All Classes"}
//                         </button>
//                         <ul className="dropdown-menu" aria-labelledby="classDropdown">
//                           <li>
//                             <button className="dropdown-item" onClick={() => setSelectedClass(null)}>
//                               All Classes
//                             </button>
//                           </li>
//                           {uniqueClasses.map((cls) => (
//                             <li key={cls}>
//                               <button className="dropdown-item" onClick={() => setSelectedClass(cls)}>
//                                 {cls}
//                               </button>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                       <div className="d-flex align-items-center ms-2">
//                         <button
//                           className="btn btn-outline-light me-2"
//                           onClick={() => {
//                             const newWeekStart = new Date(weekStart);
//                             newWeekStart.setDate(weekStart.getDate() - 7);
//                             setWeekStart(newWeekStart);
//                           }}
//                         >
//                           <i className="ti ti-chevron-left" />
//                         </button>
//                         <input
//                           type="date"
//                           className="form-control me-2"
//                           value={weekStart.toISOString().split("T")[0]}
//                           onChange={handleWeekChange}
//                           aria-label="Select a week"
//                         />
//                         <span>
//                           Week of {weekStart.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
//                         </span>
//                         <button
//                           className="btn btn-outline-light ms-2"
//                           onClick={() => {
//                             const newWeekStart = new Date(weekStart);
//                             newWeekStart.setDate(weekStart.getDate() + 7);
//                             setWeekStart(newWeekStart);
//                           }}
//                         >
//                           <i className="ti ti-chevron-right" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="card-body">
//                     <div className="d-flex flex-nowrap overflow-auto">
//                       {lessonsByDate.map(({ date, lessons }) => {
//                         const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
//                         return (
//                           <div key={date.toISOString()} className="d-flex flex-column me-4 flex-fill">
//                             <div className="mb-3">
//                               <h6>
//                                 {dayName.charAt(0) + dayName.slice(1).toLowerCase()} (
//                                 {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })})
//                               </h6>
//                             </div>
//                             {lessons.length > 0 ? (
//                               lessons.map((lesson) => {
//                                 const currentTime = new Date("2025-06-20T18:00:00+05:30"); // Current time: June 20, 2025, 6:00 PM IST
//                                 const isOngoing =
//                                   currentTime >= new Date(lesson.startTime) && currentTime <= new Date(lesson.endTime);
//                                 return (
//                                   <div
//                                     key={lesson.id}
//                                     className={`rounded p-3 mb-4 border text-dark ${isOngoing ? "ongoing" : ""}`}
//                                     style={{ backgroundColor: dayColors[dayName] }}
//                                   >
//                                     <div className="pb-3 border-bottom">
//                                       <span className="text-danger badge bg-transparent-danger text-nowrap">
//                                         Room No: {lesson.roomNumber || "N/A"}
//                                       </span>
//                                     </div>
//                                     <p className="text-dark d-block py-2 m-0">
//                                       Class: {lesson.class?.name || "N/A"} {lesson.class?.section || ""}
//                                     </p>
//                                     <p className="text-dark d-block pb-2 m-0">
//                                       Subject: {lesson.subject?.name || "N/A"}
//                                     </p>
//                                     <p className="text-dark text-nowrap m-0">
//                                       <i className="ti ti-clock me-1" />
//                                       {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
//                                     </p>
//                                   </div>
//                                 );
//                               })
//                             ) : (
//                               <div
//                                 className="rounded p-3 mb-4 border text-dark"
//                                 style={{ backgroundColor: dayColors[dayName] }}
//                               >
//                                 <p className="text-dark text-center m-0">No lessons scheduled</p>
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                   <div className="card-footer border-0 pb-0">
//                     <div className="row">
//                       <div className="col-lg-4 col-xxl-4 col-xl-4 d-flex">
//                         <div className="card flex-fill">
//                           <div className="card-body bg-transparent-primary">
//                             <span className="bg-primary badge badge-sm mb-2">Morning Break</span>
//                             <p className="text-dark">
//                               <i className="ti ti-clock me-1" />
//                               10:30 to 10:45 AM
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="col-lg-4 col-xxl-3 d-flex">
//                         <div className="card flex-fill">
//                           <div className="card-body bg-transparent-warning">
//                             <span className="bg-warning badge badge-sm mb-2">Lunch</span>
//                             <p className="text-dark">
//                               <i className="ti ti-clock me-1" />
//                               12:15 to 01:30 PM
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="col-lg-4 col-xxl-3 d-flex">
//                         <div className="card flex-fill">
//                           <div className="card-body bg-transparent-info">
//                             <span className="bg-info badge badge-sm mb-2">Evening Break</span>
//                             <p className="text-dark">
//                               <i className="ti ti-clock me-1" />
//                               03:00 to 03:15 PM
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <TeacherModal />
//       <style jsx>{`
//         .ongoing {
//           border: 2px solid red;
//           background-color: #ffebee;
//         }
//       `}</style>
//     </>
//   );
// };

// export default TeachersRoutine;

import React, { useEffect, useState } from 'react';
import TeacherModal from '../teacherModal';
import { Link } from 'react-router-dom';
import { all_routes } from '../../../../../router/all_routes';
import TeacherBreadcrumb from './teacherBreadcrumb';
import useMobileDetection from '../../../../../core/common/mobileDetection';
import { getTeacherById } from '../../../../../services/admin/teacherRegistartion';

import { useSelector } from 'react-redux';

const TeachersRoutine = () => {
  const routes = all_routes;
  const isMobile = useMobileDetection();
  const [lessons, setLessons] = useState<any[]>([]);
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const today = new Date(); 
    const dayOfWeek = today.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const userObj = useSelector((state: any) => state.auth.userObj);

  const fetchTeacherDetails = async () => {
    const teacherId = localStorage.getItem('teacherId');
    if (!teacherId) {
      return;
    }
    try {
      
      const response = await getTeacherById(teacherId);
      
      if (response.status === 200) {
        const teacherDetails = response.data;
        setLessons(teacherDetails.lessons || []);
      }
    } catch (error) {
      // Error handling
    }
  };

  useEffect(() => {
    fetchTeacherDetails();
  }, [userObj?.role]);

  const getWeekDates = (start: Date) => {
    const weekDates = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getWeekDates(weekStart);

  const uniqueClasses = Array.from(
    new Set(
      lessons.map((lesson) =>
        lesson.class ? `${lesson.class.name} ${lesson.class?.Section?.[0]?.name || ''}` : 'N/A'
      )
    )
  );

  const filteredLessons = selectedClass
    ? lessons.filter(
        (lesson) => lesson.class && `${lesson.class.name} ${lesson.class?.Section?.[0]?.name || ''}` === selectedClass
      )
    : lessons;

  const lessonsByDate = weekDates.map((date) => {
    const dateString = date.toISOString().split('T')[0];
    const lessonsOnDate = filteredLessons
      .filter((lesson) => {
        if (!lesson.startTime) return false;
        const lessonDate = new Date(lesson.startTime).toISOString().split('T')[0];
        return lessonDate === dateString;
      })
      .sort((a, b) => {
        const aTime = a.startTime ? new Date(a.startTime).getTime() : Number.MAX_VALUE;
        const bTime = b.startTime ? new Date(b.startTime).getTime() : Number.MAX_VALUE;
        if (isNaN(aTime) || isNaN(bTime)) {
  
        }
        return aTime - bTime;
      });
    return { date, lessons: lessonsOnDate };
  });

  const formatTime = (isoTime: string) => {
    if (!isoTime) return 'N/A';
    try {
      return new Date(isoTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      });
    } catch (error) {

      return 'N/A';
    }
  };

  const handleWeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const dayOfWeek = selectedDate.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(selectedDate);
    monday.setDate(selectedDate.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);
    setWeekStart(monday);
  };

  const cardColors = ['#e3f2fd', '#fce4ec', '#e8f5e9', '#fff3e0', '#f3e5f5', '#fffde7'];

  const getRandomColor = () => cardColors[Math.floor(Math.random() * cardColors.length)];

  const dayColors: { [key: string]: string } = {};
  ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'].forEach((day) => {
    dayColors[day] = getRandomColor();
  });

  return (
    <>
      <div
        className={isMobile ? 'page-wrapper bg-dark-theme min-vh-100 d-flex flex-column' : 'p-3 bg-dark-theme min-vh-100 d-flex flex-column'}
      >
        <div className="content flex-grow-1 bg-dark-theme overflow-auto">
          <div className="row flex-grow-1">
            <div className="col-12 d-flex flex-column">
              <div className="row h-100">
                <div className="card flex-fill">
                  {/* <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                    <h4 className="mb-3">Time Table</h4>
                    <div className="d-flex align-items-center flex-wrap">
                      <div className="dropdown mb-3">
                        <Link
                          to="#"
                          className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="ti ti-calendar-due me-2" />
                          This Year
                        </Link>
                        <ul className="dropdown-menu p-3">
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              This Year
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              This Month
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              This Week
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="dropdown mb-3">
                        <button
                          className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
                          type="button"
                          id="classDropdown"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {selectedClass || 'All Classes'}
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="classDropdown">
                          <li>
                            <button className="dropdown-item" onClick={() => setSelectedClass(null)}>
                              All Classes
                            </button>
                          </li>
                          {uniqueClasses.map((cls) => (
                            <li key={cls}>
                              <button className="dropdown-item" onClick={() => setSelectedClass(cls)}>
                                {cls}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="d-flex align-items-center ms-2">
                        <button
                          className="btn btn-outline-light "
                          onClick={() => {
                            const newWeekStart = new Date(weekStart);
                            newWeekStart.setDate(weekStart.getDate() - 7);
                            setWeekStart(newWeekStart);
                          }}
                          aria-label="Previous week"
                        >
                          <i className="ti ti-chevron-left" />
                        </button>
                        <input
                          type="date"
                          className="form-control me-2"
                          value={weekStart.toISOString().split('T')[0]}
                          onChange={handleWeekChange}
                          aria-label="Select a week"
                        />
                        <span>
                          Week of {weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <button
                          className="btn btn-outline-light ms-2"
                          onClick={() => {
                            const newWeekStart = new Date(weekStart);
                            newWeekStart.setDate(weekStart.getDate() + 7);
                            setWeekStart(newWeekStart);
                          }}
                          aria-label="Next week"
                        >
                          <i className="ti ti-chevron-right" />
                        </button>
                      </div>
                    </div>
                  </div> */}
                  <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2 pb-4">
  <h4 className="mb-0">Time Table</h4>
  
  <div className="d-flex align-items-center flex-wrap gap-2">
    {/* Year/Month/Week Dropdown */}
    <div className="dropdown">
      <Link
        to="#"
        className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="ti ti-calendar-due me-2" />
        This Year
      </Link>
      <ul className="dropdown-menu p-3">
        <li><Link to="#" className="dropdown-item rounded-1">This Year</Link></li>
        <li><Link to="#" className="dropdown-item rounded-1">This Month</Link></li>
        <li><Link to="#" className="dropdown-item rounded-1">This Week</Link></li>
      </ul>
    </div>

    {/* Class Filter Dropdown */}
    <div className="dropdown">
      <button
        className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
        type="button"
        id="classDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {selectedClass || "All Classes"}
      </button>
      <ul className="dropdown-menu" aria-labelledby="classDropdown">
        <li>
          <button className="dropdown-item" onClick={() => setSelectedClass(null)}>All Classes</button>
        </li>
        {uniqueClasses.map((cls) => (
          <li key={cls}>
            <button className="dropdown-item" onClick={() => setSelectedClass(cls)}>{cls}</button>
          </li>
        ))}
      </ul>
    </div>

    {/* Week Navigation Controls */}
    <div className="d-flex align-items-center">
      <button
        className="btn btn-outline-light"
        onClick={() => {
          const newWeekStart = new Date(weekStart);
          newWeekStart.setDate(weekStart.getDate() - 7);
          setWeekStart(newWeekStart);
        }}
        aria-label="Previous week"
      >
        <i className="ti ti-chevron-left" />
      </button>

      <input
        type="date"
        className="form-control mx-2"
        value={weekStart.toISOString().split("T")[0]}
        onChange={handleWeekChange}
        aria-label="Select a week"
      />

      <span className="text-dark text-nowrap">
        Week of {weekStart.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </span>

      <button
        className="btn btn-outline-light ms-2"
        onClick={() => {
          const newWeekStart = new Date(weekStart);
          newWeekStart.setDate(weekStart.getDate() + 7);
          setWeekStart(newWeekStart);
        }}
        aria-label="Next week"
      >
        <i className="ti ti-chevron-right" />
      </button>
    </div>
  </div>
</div>

                  <div className="card-body">
                    <div className="d-flex flex-nowrap overflow-auto" style={{ gap: '1.5rem' }}>
                      {lessonsByDate.map(({ date, lessons }) => {
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
                        return (
                          <div
                            key={date.toISOString()}
                            className="d-flex flex-column"
                            style={{ minWidth: '200px', maxWidth: '250px' }}
                          >
                            <div className="mb-3 text-center">
                              <h6>
                                {dayName.charAt(0) + dayName.slice(1).toLowerCase()} (
                                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                              </h6>
                            </div>
                            {lessons.length > 0 ? (
                              lessons.map((lesson) => {
                                const currentTime = new Date(); 
                                const isOngoing =
                                  lesson.startTime &&
                                  lesson.endTime &&
                                  currentTime >= new Date(lesson.startTime) &&
                                  currentTime <= new Date(lesson.endTime);
                                return (
                                  <div
                                    key={lesson.id}
                                    className={`rounded p-3 mb-3 border text-dark ${isOngoing ? 'ongoing' : ''}`}
                                    style={{
                                      backgroundColor: dayColors[dayName],
                                      minHeight: '120px',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <div className="pb-2 border-bottom">
                                      <span className="text-danger badge bg-transparent-danger text-nowrap">
                                        Room No: {lesson.class?.roomNumber || 'N/A'}
                                      </span>
                                    </div>
                                    <p className="text-dark d-block py-1 m-0">
                                      Class: {lesson.class?.name || 'N/A'} {lesson.class?.Section?.[0]?.name || ''}
                                    </p>
                                    <p className="text-dark d-block py-1 m-0">
                                      Subject: {lesson.subject?.name || 'N/A'}
                                    </p>
                                    <p className="text-dark text-nowrap m-0">
                                      <i className="ti ti-clock me-1" />
                                      {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
                                    </p>
                                  </div>
                                );
                              })
                            ) : (
                              <div
                                className="rounded p-3 mb-3 border text-dark"
                                style={{
                                  backgroundColor: dayColors[dayName],
                                  minHeight: '120px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <p className="text-dark text-center m-0">No lessons scheduled</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="card-footer border-0 pb-0">
                    <div className="row">
                      <div className="col-lg-4 col-xxl-4 col-xl-4 d-flex">
                        <div className="card flex-fill">
                          <div className="card-body bg-transparent-primary">
                            <span className="bg-primary badge badge-sm mb-2">Morning Break</span>
                            <p className="text-dark">
                              <i className="ti ti-clock me-1" />
                              10:30 to 10:45 AM
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-xxl-3 d-flex">
                        <div className="card flex-fill">
                          <div className="card-body bg-transparent-warning">
                            <span className="bg-warning badge badge-sm mb-2">Lunch</span>
                            <p className="text-dark">
                              <i className="ti ti-clock me-1" />
                              12:15 to 01:30 PM
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-xxl-3 d-flex">
                        <div className="card flex-fill">
                          <div className="card-body bg-transparent-info">
                            <span className="bg-info badge badge-sm mb-2">Evening Break</span>
                            <p className="text-dark">
                              <i className="ti ti-clock me-1" />
                              03:00 to 03:15 PM
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TeacherModal />
      <style jsx>{`
        .ongoing {
          border: 2px solid red;
          background-color: #ffebee;
        }
        .card-body {
          padding: 1.5rem;
        }
        .card-body > div {
          align-items: stretch;
        }
      `}</style>
    </>
  );
};

export default TeachersRoutine;
