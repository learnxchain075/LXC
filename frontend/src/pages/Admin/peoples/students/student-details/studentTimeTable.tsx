// // // // // // // import React from 'react'
// // // // // // // import { Link } from 'react-router-dom'
// // // // // // // import ImageWithBasePath from '../../../../../core/common/imageWithBasePath'
// // // // // // // import { all_routes } from '../../../../../router/all_routes'
// // // // // // // import StudentModals from '../studentModals'
// // // // // // // import StudentSidebar from './studentSidebar'
// // // // // // // import StudentBreadcrumb from './studentBreadcrumb'
// // // // // // // import useMobileDetection from '../../../../../core/common/mobileDetection'

// // // // // // // const StudentTimeTable = () => {
// // // // // // //     const routes = all_routes;
// // // // // // //     const ismobile=useMobileDetection();
// // // // // // //     return (
// // // // // // //         <>
// // // // // // //              <div
// // // // // // //         className={`min-vh-100 d-flex flex-column ${ismobile ? "page-wrapper bg-dark-theme" : "bg-dark-theme"}`}
// // // // // // //       >
// // // // // // //                 <div className="content">
// // // // // // //                    {/* { !ismobile&&<div className="row">
// // // // // // //                         {/* Page Header */}
// // // // // // //                         {/* <StudentBreadcrumb /> */}
// // // // // // //                         {/* /Page Header */}
// // // // // // //                     {/* </div>}  */}
// // // // // // //                     <div className="row">
// // // // // // //                         {/* Student Information */}
// // // // // // //                        {/* {!ismobile && <StudentSidebar />} */}
// // // // // // //                         {/* /Student Information */}
// // // // // // //                         <div className="col-xxl-9 col-xl-8">
// // // // // // //                             <div className="row">
// // // // // // //                                 <div className="col-md-12">
// // // // // // //                                                 {/* List */}
// // // // // // //                                  {/* {ismobile ? (
// // // // // // //                     <div className="mb-3">                        <div className="mt-2">
// // // // // // //                           <ul className="nav flex-column">
// // // // // // //                             <li className="nav-item">
// // // // // // //                               <Link
// // // // // // //                                 to={routes.studentTimeTable}
// // // // // // //                                 className="nav-link active"
// // // // // // //                               >
// // // // // // //                                 Time Table
// // // // // // //                               </Link>
// // // // // // //                             </li>
// // // // // // //                           </ul>
// // // // // // //                         </div> 
                    
// // // // // // //                     </div> 
// // // // // // //                 //   ) : (
// // // // // // //                 //     // <ul className="nav nav-tabs nav-tabs-bottom mb-4">
// // // // // // //                 //     //   <li>
// // // // // // //                 //     //     <Link to={routes.studentDetail} className="nav-link">
// // // // // // //                 //     //       <i className="ti ti-school me-2" />
// // // // // // //                 //     //       Student Details
// // // // // // //                 //     //     </Link>
// // // // // // //                 //     //   </li>
// // // // // // //                 //     //   <li>
// // // // // // //                 //     //     <Link
// // // // // // //                 //     //       to={routes.studentTimeTable}
// // // // // // //                 //     //       className="nav-link active"
// // // // // // //                 //     //     >
// // // // // // //                 //     //       <i className="ti ti-table-options me-2" />
// // // // // // //                 //     //       Time Table
// // // // // // //                 //     //     </Link>
// // // // // // //                 //     //   </li>
// // // // // // //                 //     //   <li>
// // // // // // //                 //     //     <Link to={routes.studentLeaves} className="nav-link">
// // // // // // //                 //     //       <i className="ti ti-calendar-due me-2" />
// // // // // // //                 //     //       Leave & Attendance
// // // // // // //                 //     //     </Link>
// // // // // // //                 //     //   </li>
// // // // // // //                 //     //   <li>
// // // // // // //                 //     //     <Link to={routes.studentFees} className="nav-link">
// // // // // // //                 //     //       <i className="ti ti-report-money me-2" />
// // // // // // //                 //     //       Fees
// // // // // // //                 //     //     </Link>
// // // // // // //                 //     //   </li>
// // // // // // //                 //     //   <li>
// // // // // // //                 //     //     <Link to={routes.studentResult} className="nav-link">
// // // // // // //                 //     //       <i className="ti ti-bookmark-edit me-2" />
// // // // // // //                 //     //       Exam & Results
// // // // // // //                 //     //     </Link>
// // // // // // //                 //     //   </li>
// // // // // // //                 //     //   <li>
// // // // // // //                 //     //     <Link to={routes.studentLibrary} className="nav-link">
// // // // // // //                 //     //       <i className="ti ti-books me-2" />
// // // // // // //                 //     //       Library
// // // // // // //                 //     //     </Link>
// // // // // // //                 //     //   </li>
// // // // // // //                 //     // </ul>
// // // // // // //                 //   )}
// // // // // // //                 //     
// // // // // // //                  }                {/* /List */}
// // // // // // //                                     <div className="card">
// // // // // // //                                         <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
// // // // // // //                                             <h4 className="mb-3">Exams &amp; Results</h4>
// // // // // // //                                             <div className="d-flex align-items-center flex-wrap">
// // // // // // //                                                 <div className="dropdown mb-3">
// // // // // // //                                                     <Link
// // // // // // //                                                         to="#"
// // // // // // //                                                         className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
// // // // // // //                                                         data-bs-toggle="dropdown"
// // // // // // //                                                     >
// // // // // // //                                                         <i className="ti ti-calendar-due me-2" />
// // // // // // //                                                         This Year
// // // // // // //                                                     </Link>
// // // // // // //                                                     <ul className="dropdown-menu p-3">
// // // // // // //                                                         <li>
// // // // // // //                                                             <Link
// // // // // // //                                                                 to="#"
// // // // // // //                                                                 className="dropdown-item rounded-1"
// // // // // // //                                                             >
// // // // // // //                                                                 This Year
// // // // // // //                                                             </Link>
// // // // // // //                                                         </li>
// // // // // // //                                                         <li>
// // // // // // //                                                             <Link
// // // // // // //                                                                 to="#"
// // // // // // //                                                                 className="dropdown-item rounded-1"
// // // // // // //                                                             >
// // // // // // //                                                                 This Month
// // // // // // //                                                             </Link>
// // // // // // //                                                         </li>
// // // // // // //                                                         <li>
// // // // // // //                                                             <Link
// // // // // // //                                                                 to="#"
// // // // // // //                                                                 className="dropdown-item rounded-1"
// // // // // // //                                                             >
// // // // // // //                                                                 This Week
// // // // // // //                                                             </Link>
// // // // // // //                                                         </li>
// // // // // // //                                                     </ul>
// // // // // // //                                                 </div>
// // // // // // //                                             </div>
// // // // // // //                                         </div>
// // // // // // //                                         <div className="card-body pb-0">
// // // // // // //                                             <div className="d-flex flex-nowrap overflow-auto">
// // // // // // //                                                 <div className="d-flex flex-column me-4 flex-fill">
// // // // // // //                                                     <div className="mb-3">
// // // // // // //                                                         <h6>Monday</h6>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-danger rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             09:00 - 09:45 AM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Maths</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-07.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Jacquelin
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-primary rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             09:45 - 10:30 AM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : English</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-03.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Hellana
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-success rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             10:45 - 11:30 AM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Computer</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-02.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Daniel
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-pending rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             11:30 - 12:15 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Spanish</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-03.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Erickson
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-info rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             01:30 - 02:15 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Science</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-05.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Morgan
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-light rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             02:15 - 03:00 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Chemistry</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-06.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Aaron
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-warning rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             03:15 - 04:00 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Physics</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-01.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Teresa
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                 </div>
// // // // // // //                                                 <div className="d-flex flex-column me-4 flex-fill">
// // // // // // //                                                     <div className="mb-3">
// // // // // // //                                                         <h6>Tuesday</h6>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-pending rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             09:00 - 09:45 AM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Spanish</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-03.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Erickson
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-warning rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             09:45 - 10:30 AM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Physics</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-01.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Teresa
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-light rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             10:45 - 11:30 AM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Chemistry</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-06.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Aaron
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-danger rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             11:30 - 12:15 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Maths</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-07.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Jacquelin
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-success rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             01:30 - 02:15 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Computer</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-02.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Daniel
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-primary rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             02:15 - 03:00 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : English</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-03.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Hellana
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-info rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             03:15 - 04:00 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Science</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-05.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Morgan
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                 </div>
// // // // // // //                                                 <div className="d-flex flex-column me-4 flex-fill">
// // // // // // //                                                     <div className="mb-3">
// // // // // // //                                                         <h6>Wednesday</h6>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-success rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             09:00 - 09:45 AM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Computer</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-02.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Daniel
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-info rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             09:45 - 10:30 AM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Science</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-05.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Morgan
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-danger rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             10:45 - 11:30 AM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Maths</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-07.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Jacquelin
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-light rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             11:30 - 12:15 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Chemistry</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-06.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Aaron
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-warning rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             01:30 - 02:15 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Physics</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-01.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Teresa
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-primary rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             02:15 - 03:00 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : English</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-03.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Hellana
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-pending rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             03:15 - 04:00 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Spanish</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-03.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Erickson
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                 </div>
// // // // // // //                                                 <div className="d-flex flex-column me-4 flex-fill">
// // // // // // //                                                     <div className="mb-3">
// // // // // // //                                                         <h6>Thursday</h6>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-warning rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             09:00 - 09:45 AM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Physics</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-01.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Teresa
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-success rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             09:45 - 10:30 AM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Computer</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-02.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Daniel
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-primary rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             10:45 - 11:30 AM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : English</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-03.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Hellana
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-info rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             11:30 - 12:15 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Science</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-05.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Morgan
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-pending rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             01:30 - 02:15 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Spanish</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-03.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Erickson
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-light rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             02:15 - 03:00 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Chemistry</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-06.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Aaron
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-danger rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             03:15 - 04:00 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Maths</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-07.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Jacquelin
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                 </div>
// // // // // // //                                                 <div className="d-flex flex-column me-4 flex-fill">
// // // // // // //                                                     <div className="mb-3">
// // // // // // //                                                         <h6>Friday</h6>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-primary rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             09:00 - 09:45 AM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : English</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-03.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Hellana
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-pending rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             09:45 - 10:30 AM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Spanish</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-03.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Erickson
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-warning rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             10:45 - 11:30 AM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Physics</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-01.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Teresa
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-light rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             11:30 - 12:15 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Chemistry</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-06.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Aaron
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-danger rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             01:30 - 02:15 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Maths</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-07.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Jacquelin
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-success rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             02:15 - 3:00 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Computer</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-02.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Daniel
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-info rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             03:15 - 04:00 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Science</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-05.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Morgan
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                 </div>
// // // // // // //                                                 <div className="d-flex flex-column flex-fill">
// // // // // // //                                                     <div className="mb-3">
// // // // // // //                                                         <h6>Saturday</h6>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-primary rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             09:00 - 09:45 AM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : English</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-03.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Hellana
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-pending rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             09:45 - 10:30 AM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Spanish</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-03.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Erickson
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-warning rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             10:45 - 11:30 AM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Physics</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-01.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Teresa
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-light rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             11:30 - 12:15 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Chemistry</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-06.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Aaron
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-danger rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             01:30 - 02:15 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Maths</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-07.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Jacquelin
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-success rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             02:15 - 3:00 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Computer</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-02.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Daniel
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                     <div className="bg-transparent-info rounded p-3 mb-4">
// // // // // // //                                                         <p className="d-flex align-items-center text-nowrap mb-1">
// // // // // // //                                                             <i className="ti ti-clock me-1" />
// // // // // // //                                                             03:15 - 04:00 PM
// // // // // // //                                                         </p>
// // // // // // //                                                         <p className="text-dark">Subject : Science</p>
// // // // // // //                                                         <div className="bg-white rounded p-1 mt-3">
// // // // // // //                                                             <Link
// // // // // // //                                                                 to={routes.teacherDetails}
// // // // // // //                                                                 className="text-muted d-flex align-items-center"
// // // // // // //                                                             >
// // // // // // //                                                                 <span className="avatar avatar-sm me-2">
// // // // // // //                                                                     <ImageWithBasePath src="assets/img/teachers/teacher-05.jpg" alt="Img" />
// // // // // // //                                                                 </span>
// // // // // // //                                                                 Morgan
// // // // // // //                                                             </Link>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                 </div>
// // // // // // //                                             </div>
// // // // // // //                                         </div>
// // // // // // //                                         <div className="card-footer border-0 pb-0">
// // // // // // //                                             <div className="row">
// // // // // // //                                                 <div className="col-lg-4 col-xxl-4 col-xl-4 d-flex">
// // // // // // //                                                     <div className="card flex-fill">
// // // // // // //                                                         <div className="card-body">
// // // // // // //                                                             <span className="bg-primary badge badge-sm mb-2">
// // // // // // //                                                                 Morning Break
// // // // // // //                                                             </span>
// // // // // // //                                                             <p className="text-dark">
// // // // // // //                                                                 <i className="ti ti-clock me-1" />
// // // // // // //                                                                 10:30 to 10 :45 AM
// // // // // // //                                                             </p>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                 </div>
// // // // // // //                                                 <div className="col-lg-4 col-xxl-3 d-flex">
// // // // // // //                                                     <div className="card flex-fill">
// // // // // // //                                                         <div className="card-body">
// // // // // // //                                                             <span className="bg-warning badge badge-sm mb-2">Lunch</span>
// // // // // // //                                                             <p className="text-dark">
// // // // // // //                                                                 <i className="ti ti-clock me-1" />
// // // // // // //                                                                 10:30 to 10 :45 AM
// // // // // // //                                                             </p>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                 </div>
// // // // // // //                                                 <div className="col-lg-4 col-xxl-3 d-flex">
// // // // // // //                                                     <div className="card flex-fill">
// // // // // // //                                                         <div className="card-body">
// // // // // // //                                                             <span className="bg-info badge badge-sm mb-2">
// // // // // // //                                                                 Evening Break
// // // // // // //                                                             </span>
// // // // // // //                                                             <p className="text-dark">
// // // // // // //                                                                 <i className="ti ti-clock me-1" />
// // // // // // //                                                                 03:30 PM to 03:45 PM
// // // // // // //                                                             </p>
// // // // // // //                                                         </div>
// // // // // // //                                                     </div>
// // // // // // //                                                 </div>
// // // // // // //                                             </div>
// // // // // // //                                         </div>
// // // // // // //                                     </div>
// // // // // // //                                 </div>
// // // // // // //                             </div>

// // // // // // //                         </div>
// // // // // // //                     </div>
// // // // // // //                 </div>
// // // // // // //             </div>
// // // // // // //             {/* /Page Wrapper */}
// // // // // // //             <StudentModals />
// // // // // // //         </>

// // // // // // //     )
// // // // // // // }

// // // // // // // export default StudentTimeTable


// // // // // // import React, { useState } from "react";
// // // // // // import { Link } from "react-router-dom";
// // // // // // import { all_routes } from "../../../../../router/all_routes";
// // // // // // import useMobileDetection from "../../../../../core/common/mobileDetection";

// // // // // // const mockLessons = [
// // // // // //   {
// // // // // //     id: 1,
// // // // // //     day: "MONDAY",
// // // // // //     startTime: "2025-06-02T09:00:00+05:30",
// // // // // //     endTime: "2025-06-02T09:45:00+05:30",
// // // // // //     roomNumber: "201",
// // // // // //     class: { name: "V", section: "A" },
// // // // // //     subject: { name: "Mathematics" },
// // // // // //   },
// // // // // //   {
// // // // // //     id: 2,
// // // // // //     day: "MONDAY",
// // // // // //     startTime: "2025-06-02T14:30:00+05:30",
// // // // // //     endTime: "2025-06-02T15:15:00+05:30",
// // // // // //     roomNumber: "202",
// // // // // //     class: { name: "V", section: "A" },
// // // // // //     subject: { name: "English" },
// // // // // //   },
// // // // // //   {
// // // // // //     id: 3,
// // // // // //     day: "TUESDAY",
// // // // // //     startTime: "2025-06-03T10:00:00+05:30",
// // // // // //     endTime: "2025-06-03T10:45:00+05:30",
// // // // // //     roomNumber: "203",
// // // // // //     class: { name: "V", section: "A" },
// // // // // //     subject: { name: "Science" },
// // // // // //   },
// // // // // //   {
// // // // // //     id: 4,
// // // // // //     day: "WEDNESDAY",
// // // // // //     startTime: "2025-06-04T11:00:00+05:30",
// // // // // //     endTime: "2025-06-04T11:45:00+05:30",
// // // // // //     roomNumber: "204",
// // // // // //     class: { name: "V", section: "A" },
// // // // // //     subject: { name: "History" },
// // // // // //   },
// // // // // //   {
// // // // // //     id: 5,
// // // // // //     day: "THURSDAY",
// // // // // //     startTime: "2025-06-05T09:00:00+05:30",
// // // // // //     endTime: "2025-06-05T09:45:00+05:30",
// // // // // //     roomNumber: "205",
// // // // // //     class: { name: "V", section: "A" },
// // // // // //     subject: { name: "Geography" },
// // // // // //   },
// // // // // //   {
// // // // // //     id: 6,
// // // // // //     day: "FRIDAY",
// // // // // //     startTime: "2025-06-06T10:00:00+05:30",
// // // // // //     endTime: "2025-06-06T10:45:00+05:30",
// // // // // //     roomNumber: "206",
// // // // // //     class: { name: "V", section: "A" },
// // // // // //     subject: { name: "Computer Science" },
// // // // // //   },
// // // // // //   {
// // // // // //     id: 7,
// // // // // //     day: "SATURDAY",
// // // // // //     startTime: "2025-06-07T09:00:00+05:30",
// // // // // //     endTime: "2025-06-07T09:45:00+05:30",
// // // // // //     roomNumber: "207",
// // // // // //     class: { name: "V", section: "A" },
// // // // // //     subject: { name: "Art" },
// // // // // //   },
// // // // // // ];

// // // // // // const StudentTimeTable = () => {
// // // // // //   const routes = all_routes;
// // // // // //   const ismobile = useMobileDetection();
// // // // // //   const [lessons] = useState<any[]>(mockLessons);

// // // // // //   const currentDate = new Date();
// // // // // //   const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
// // // // // //   const currentDay = daysOfWeek[currentDate.getDay()];
// // // // // //   const currentTime = currentDate.getTime();

// // // // // //   const groupLessonsByDay = () => {
// // // // // //     const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
// // // // // //     const grouped: { [key: string]: any[] } = {};
// // // // // //     days.forEach((day) => {
// // // // // //       grouped[day] = lessons
// // // // // //         .filter((lesson: any) => lesson.day.toUpperCase() === day)
// // // // // //         .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
// // // // // //     });
// // // // // //     return grouped;
// // // // // //   };

// // // // // //   const formatTime = (isoTime: string) => {
// // // // // //     if (!isoTime) return "N/A";
// // // // // //     return new Date(isoTime).toLocaleTimeString("en-US", {
// // // // // //       hour: "2-digit",
// // // // // //       minute: "2-digit",
// // // // // //       hour12: true,
// // // // // //     });
// // // // // //   };

// // // // // //   const isLessonOngoing = (startTime: string, endTime: string) => {
// // // // // //     const start = new Date(startTime).getTime();
// // // // // //     const end = new Date(endTime).getTime();
// // // // // //     return currentTime >= start && currentTime <= end;
// // // // // //   };

// // // // // //   const cardColors = [
// // // // // //     "bg-blue-100",
// // // // // //     "bg-pink-100",
// // // // // //     "bg-green-100",
// // // // // //     "bg-orange-100",
// // // // // //     "bg-purple-100",
// // // // // //     "bg-yellow-100",
// // // // // //   ];

// // // // // //   const getRandomColor = () => {
// // // // // //     return cardColors[Math.floor(Math.random() * cardColors.length)];
// // // // // //   };

// // // // // //   const dayColors: { [key: string]: string } = {};
// // // // // //   ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].forEach((day) => {
// // // // // //     dayColors[day] = getRandomColor();
// // // // // //   });

// // // // // //   const groupedLessons = groupLessonsByDay();

// // // // // //   return (
// // // // // //     <div
// // // // // //       className={`min-h-screen flex flex-col ${ismobile ? "page-wrapper bg-gray-900" : "bg-gray-900"}`}
// // // // // //     >
// // // // // //       <div className="content flex-grow bg-gray-900 overflow-auto">
// // // // // //         <div className="row flex-fill">
// // // // // //           <div className="col-12 flex flex-col">
// // // // // //             <div className="row flex-grow">
// // // // // //               <div className="col-md-12">
               
// // // // // //                 <div className="card flex-fill bg-gray-800 text-white">
// // // // // //                   <div className="card-header flex items-center justify-between flex-wrap pb-0">
// // // // // //                     <h4 className="mb-3">Student Time Table</h4>
// // // // // //                     <div className="flex items-center flex-wrap">
// // // // // //                       <div className="dropdown mb-3">
// // // // // //                         <Link
// // // // // //                           to="#"
// // // // // //                           className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
// // // // // //                           data-bs-toggle="dropdown"
// // // // // //                         >
// // // // // //                           <i className="ti ti-calendar-due me-2" />
// // // // // //                           This Year
// // // // // //                         </Link>
// // // // // //                         <ul className="dropdown-menu p-3">
// // // // // //                           <li>
// // // // // //                             <Link to="#" className="dropdown-item rounded-1">
// // // // // //                               This Year
// // // // // //                             </Link>
// // // // // //                           </li>
// // // // // //                           <li>
// // // // // //                             <Link to="#" className="dropdown-item rounded-1">
// // // // // //                               This Month
// // // // // //                             </Link>
// // // // // //                           </li>
// // // // // //                           <li>
// // // // // //                             <Link to="#" className="dropdown-item rounded-1">
// // // // // //                               This Week
// // // // // //                             </Link>
// // // // // //                           </li>
// // // // // //                         </ul>
// // // // // //                       </div>
// // // // // //                     </div>
// // // // // //                   </div>
// // // // // //                   <div className="card-body">
// // // // // //                     <div className="flex flex-nowrap overflow-auto">
// // // // // //                       {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((day) => (
// // // // // //                         <div
// // // // // //                           key={day}
// // // // // //                           className={`flex flex-col me-4 flex-fill ${
// // // // // //                             day === currentDay ? "border-l-4 border-blue-500 bg-blue-50" : ""
// // // // // //                           } p-2`}
// // // // // //                         >
// // // // // //                           <div className="mb-3">
// // // // // //                             <h6 className="capitalize">{day.toLowerCase()}</h6>
// // // // // //                           </div>
// // // // // //                           {groupedLessons[day].length > 0 ? (
// // // // // //                             groupedLessons[day].map((lesson: any) => (
// // // // // //                               <div
// // // // // //                                 key={lesson.id}
// // // // // //                                 className={`rounded p-3 mb-4 border text-dark ${
// // // // // //                                   day === currentDay && isLessonOngoing(lesson.startTime, lesson.endTime)
// // // // // //                                     ? "border-2 border-green-500 shadow-lg bg-green-50"
// // // // // //                                     : ""
// // // // // //                                 } ${dayColors[day]}`}
// // // // // //                               >
// // // // // //                                 <div className="pb-3 border-bottom">
// // // // // //                                   <span className="badge bg-yellow-100 text-yellow-600 text-nowrap">
// // // // // //                                     Room No: {lesson.roomNumber || "N/A"}
// // // // // //                                   </span>
// // // // // //                                 </div>
// // // // // //                                 <p className="text-dark py-2 m-0">
// // // // // //                                   Class: {lesson.class?.name || "N/A"} {lesson.class?.section || ""}
// // // // // //                                 </p>
// // // // // //                                 <p className="text-dark pb-2 m-0">
// // // // // //                                   Subject: {lesson.subject?.name || "N/A"}
// // // // // //                                 </p>
// // // // // //                                 <p className="text-dark m-0">
// // // // // //                                   <i className="ti ti-clock mr-2" />
// // // // // //                                   {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
// // // // // //                                 </p>
// // // // // //                               </div>
// // // // // //                             ))
// // // // // //                           ) : (
// // // // // //                             <div className={`rounded p-3 mb-4 border text-dark ${dayColors[day]}`}>
// // // // // //                               <p className="text-center m-0">No lessons scheduled</p>
// // // // // //                             </div>
// // // // // //                           )}
// // // // // //                         </div>
// // // // // //                       ))}
// // // // // //                     </div>
// // // // // //                   </div>
// // // // // //                   <div className="card-footer border-0 py-0">
// // // // // //                     <div className="row">
// // // // // //                       <div className="col-lg-4 col-8 d-flex">
// // // // // //                         <div className="card flex-fill">
// // // // // //                           <div className="card-body bg-blue-100">
// // // // // //                             <span className="badge bg-blue-200 text-blue-800 mb-2">
// // // // // //                               Morning Break
// // // // // //                             </span>
// // // // // //                             <p className="text-dark">
// // // // // //                               <i className="ti ti-clock mr-2" />
// // // // // //                               10:30 to 11:00 AM
// // // // // //                             </p>
// // // // // //                           </div>
// // // // // //                         </div>
// // // // // //                       </div>
// // // // // //                     </div>
// // // // // //                   </div>
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //     );
// // // // // // };

// // // // // // export default StudentTimeTable;



// // // // // import React, { useState } from "react";
// // // // // import { Link } from "react-router-dom";
// // // // // import { all_routes } from "../../../../../router/all_routes";
// // // // // import useMobileDetection from "../../../../../core/common/mobileDetection";

// // // // // const mockLessons = [
// // // // //   {
// // // // //     id: 1,
// // // // //     day: "MONDAY",
// // // // //     startTime: "2025-06-02T09:00:00+05:30",
// // // // //     endTime: "2025-06-02T09:45:00+05:30",
// // // // //     roomNumber: "201",
// // // // //     class: { name: "V", section: "A" },
// // // // //     subject: { name: "Mathematics" },
// // // // //   },
// // // // //   {
// // // // //     id: 2,
// // // // //     day: "MONDAY",
// // // // //     startTime: "2025-06-02T14:30:00+05:30",
// // // // //     endTime: "2025-06-02T15:15:00+05:30",
// // // // //     roomNumber: "202",
// // // // //     class: { name: "V", section: "A" },
// // // // //     subject: { name: "English" },
// // // // //   },
// // // // //   {
// // // // //     id: 3,
// // // // //     day: "TUESDAY",
// // // // //     startTime: "2025-06-03T10:00:00+05:30",
// // // // //     endTime: "2025-06-03T10:45:00+05:30",
// // // // //     roomNumber: "203",
// // // // //     class: { name: "V", section: "A" },
// // // // //     subject: { name: "Science" },
// // // // //   },
// // // // //   {
// // // // //     id: 4,
// // // // //     day: "WEDNESDAY",
// // // // //     startTime: "2025-06-04T11:00:00+05:30",
// // // // //     endTime: "2025-06-04T11:45:00+05:30",
// // // // //     roomNumber: "204",
// // // // //     class: { name: "V", section: "A" },
// // // // //     subject: { name: "History" },
// // // // //   },
// // // // //   {
// // // // //     id: 5,
// // // // //     day: "THURSDAY",
// // // // //     startTime: "2025-06-05T09:00:00+05:30",
// // // // //     endTime: "2025-06-05T09:45:00+05:30",
// // // // //     roomNumber: "205",
// // // // //     class: { name: "V", section: "A" },
// // // // //     subject: { name: "Geography" },
// // // // //   },
// // // // //   {
// // // // //     id: 6,
// // // // //     day: "FRIDAY",
// // // // //     startTime: "2025-06-06T10:00:00+05:30",
// // // // //     endTime: "2025-06-06T10:45:00+05:30",
// // // // //     roomNumber: "206",
// // // // //     class: { name: "V", section: "A" },
// // // // //     subject: { name: "Computer Science" },
// // // // //   },
// // // // //   {
// // // // //     id: 7,
// // // // //     day: "SATURDAY",
// // // // //     startTime: "2025-06-07T09:00:00+05:30",
// // // // //     endTime: "2025-06-07T09:45:00+05:30",
// // // // //     roomNumber: "207",
// // // // //     class: { name: "V", section: "A" },
// // // // //     subject: { name: "Art" },
// // // // //   },
// // // // // ];

// // // // // const StudentTimeTable = () => {
// // // // //   const routes = all_routes;
// // // // //   const ismobile = useMobileDetection();
// // // // //   const [lessons] = useState<any[]>(mockLessons);

// // // // //   const currentDate = new Date();
// // // // //   const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
// // // // //   const currentDay = daysOfWeek[currentDate.getDay()];
// // // // //   const currentTime = currentDate.getTime();

// // // // //   const groupLessonsByDay = () => {
// // // // //     const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
// // // // //     const grouped: { [key: string]: any[] } = {};
// // // // //     days.forEach((day) => {
// // // // //       grouped[day] = lessons
// // // // //         .filter((lesson: any) => lesson.day.toUpperCase() === day)
// // // // //         .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
// // // // //     });
// // // // //     return grouped;
// // // // //   };

// // // // //   const formatTime = (isoTime: string) => {
// // // // //     if (!isoTime) return "N/A";
// // // // //     return new Date(isoTime).toLocaleTimeString("en-US", {
// // // // //       hour: "2-digit",
// // // // //       minute: "2-digit",
// // // // //       hour12: true,
// // // // //     });
// // // // //   };

// // // // //   const isLessonOngoing = (startTime: string, endTime: string) => {
// // // // //     const start = new Date(startTime).getTime();
// // // // //     const end = new Date(endTime).getTime();
// // // // //     return currentTime >= start && currentTime <= end;
// // // // //   };

// // // // //   const getRandomColor = () => {
// // // // //     const letters = "0123456789ABCDEF";
// // // // //     let color = "#";
// // // // //     for (let i = 0; i < 6; i++) {
// // // // //       color += letters[Math.floor(Math.random() * 16)];
// // // // //     }
// // // // //     return color;
// // // // //   };

// // // // //   const dayColors: { [key: string]: string } = {};
// // // // //   ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].forEach((day) => {
// // // // //     dayColors[day] = getRandomColor();
// // // // //   });

// // // // //   const groupedLessons = groupLessonsByDay();

// // // // //   return (
// // // // //     <div
// // // // //       className={`min-h-screen flex flex-col ${ismobile ? "page-wrapper bg-gray-900" : "bg-gray-900"}`}
// // // // //     >
// // // // //       <div className="content flex-grow bg-gray-900 overflow-auto">
// // // // //         <div className="row flex-fill">
// // // // //           <div className="col-12 flex flex-col">
// // // // //             <div className="row flex-grow">
// // // // //               <div className="col-md-12">
                
// // // // //                 <div className="card flex-fill bg-gray-800 text-white">
// // // // //                   <div className="card-header flex items-center justify-between flex-wrap pb-0">
// // // // //                     <h4 className="mb-3">Student Time Table</h4>
// // // // //                     <div className="flex items-center flex-wrap">
// // // // //                       <div className="dropdown mb-3">
// // // // //                         <Link
// // // // //                           to="#"
// // // // //                           className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
// // // // //                           data-bs-toggle="dropdown"
// // // // //                         >
// // // // //                           <i className="ti ti-calendar-due me-2" />
// // // // //                           This Year
// // // // //                         </Link>
// // // // //                         <ul className="dropdown-menu p-3">
// // // // //                           <li>
// // // // //                             <Link to="#" className="dropdown-item rounded-1">
// // // // //                               This Year
// // // // //                             </Link>
// // // // //                           </li>
// // // // //                           <li>
// // // // //                             <Link to="#" className="dropdown-item rounded-1">
// // // // //                               This Month
// // // // //                             </Link>
// // // // //                           </li>
// // // // //                           <li>
// // // // //                             <Link to="#" className="dropdown-item rounded-1">
// // // // //                               This Week
// // // // //                             </Link>
// // // // //                           </li>
// // // // //                         </ul>
// // // // //                       </div>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                   <div className="card-body">
// // // // //                     <div className="flex flex-nowrap overflow-auto gap-4">
// // // // //                       {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((day) => (
// // // // //                         <div
// // // // //                           key={day}
// // // // //                           className={`card flex-fill min-w-[250px] ${
// // // // //                             day === currentDay ? "border-l-4 border-blue-500 bg-blue-50" : "bg-gray-700"
// // // // //                           } text-dark`}
// // // // //                         >
// // // // //                           <div className="card-header bg-gray-600 text-white">
// // // // //                             <h5 className="capitalize">{day.toLowerCase()}</h5>
// // // // //                           </div>
// // // // //                           <div className="card-body p-3">
// // // // //                             {groupedLessons[day].length > 0 ? (
// // // // //                               groupedLessons[day].map((lesson: any) => (
// // // // //                                 <div
// // // // //                                   key={lesson.id}
// // // // //                                   className={`card mb-3 p-3 border-gray-300 ${
// // // // //                                     day === currentDay && isLessonOngoing(lesson.startTime, lesson.endTime)
// // // // //                                       ? "border-2 border-green-500 shadow-lg bg-green-50"
// // // // //                                       : ""
// // // // //                                   }`}
// // // // //                                   style={{ backgroundColor: dayColors[day] }}
// // // // //                                 >
// // // // //                                   <div className="pb-2 border-b border-gray-400">
// // // // //                                     <span className="badge bg-yellow-100 text-yellow-600 text-nowrap">
// // // // //                                       Room No: {lesson.roomNumber || "N/A"}
// // // // //                                     </span>
// // // // //                                   </div>
// // // // //                                   <p className="text-dark py-2 m-0">
// // // // //                                     Class: {lesson.class?.name || "N/A"} {lesson.class?.section || ""}
// // // // //                                   </p>
// // // // //                                   <p className="text-dark pb-2 m-0">
// // // // //                                     Subject: {lesson.subject?.name || "N/A"}
// // // // //                                   </p>
// // // // //                                   <p className="text-dark m-0">
// // // // //                                     <i className="ti ti-clock mr-2" />
// // // // //                                     {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
// // // // //                                   </p>
// // // // //                                 </div>
// // // // //                               ))
// // // // //                             ) : (
// // // // //                               <div
// // // // //                                 className="card mb-3 p-3 border-gray-300"
// // // // //                                 style={{ backgroundColor: dayColors[day] }}
// // // // //                               >
// // // // //                                 <p className="text-center m-0">No lessons scheduled</p>
// // // // //                               </div>
// // // // //                             )}
// // // // //                           </div>
// // // // //                         </div>
// // // // //                       ))}
// // // // //                     </div>
// // // // //                   </div>
// // // // //                   <div className="card-footer border-0 py-0">
// // // // //                     <div className="row">
// // // // //                       <div className="col-lg-4 col-8 d-flex">
// // // // //                         <div className="card flex-fill">
// // // // //                           <div className="card-body bg-blue-100">
// // // // //                             <span className="badge bg-blue-200 text-blue-800 mb-2">
// // // // //                               Morning Break
// // // // //                             </span>
// // // // //                             <p className="text-dark">
// // // // //                               <i className="ti ti-clock mr-2" />
// // // // //                               10:30 to 11:00 AM
// // // // //                             </p>
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
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default StudentTimeTable;

// // // // import React, { useState } from "react";
// // // // import { Link } from "react-router-dom";
// // // // import { all_routes } from "../../../../../router/all_routes";
// // // // import useMobileDetection from "../../../../../core/common/mobileDetection";

// // // // const mockLessons = [
// // // //   {
// // // //     id: 1,
// // // //     day: "MONDAY",
// // // //     startTime: "2025-06-02T09:00:00+05:30",
// // // //     endTime: "2025-06-02T09:45:00+05:30",
// // // //     roomNumber: "201",
// // // //     class: { name: "V", section: "A" },
// // // //     subject: { name: "Mathematics" },
// // // //     teacherName: "John Doe",
// // // //   },
// // // //   {
// // // //     id: 2,
// // // //     day: "MONDAY",
// // // //     startTime: "2025-06-02T14:30:00+05:30",
// // // //     endTime: "2025-06-02T15:15:00+05:30",
// // // //     roomNumber: "202",
// // // //     class: { name: "V", section: "A" },
// // // //     subject: { name: "English" },
// // // //     teacherName: "Jane Smith",
// // // //   },
// // // //   {
// // // //     id: 3,
// // // //     day: "TUESDAY",
// // // //     startTime: "2025-06-03T10:00:00+05:30",
// // // //     endTime: "2025-06-03T10:45:00+05:30",
// // // //     roomNumber: "203",
// // // //     class: { name: "V", section: "A" },
// // // //     subject: { name: "Science" },
// // // //     teacherName: "Alice Johnson",
// // // //   },
// // // //   {
// // // //     id: 4,
// // // //     day: "WEDNESDAY",
// // // //     startTime: "2025-06-04T11:00:00+05:30",
// // // //     endTime: "2025-06-04T11:45:00+05:30",
// // // //     roomNumber: "204",
// // // //     class: { name: "V", section: "A" },
// // // //     subject: { name: "History" },
// // // //     teacherName: "Bob Brown",
// // // //   },
// // // //   {
// // // //     id: 5,
// // // //     day: "THURSDAY",
// // // //     startTime: "2025-06-05T09:00:00+05:30",
// // // //     endTime: "2025-06-05T09:45:00+05:30",
// // // //     roomNumber: "205",
// // // //     class: { name: "V", section: "A" },
// // // //     subject: { name: "Geography" },
// // // //     teacherName: "Carol White",
// // // //   },
// // // //   {
// // // //     id: 6,
// // // //     day: "FRIDAY",
// // // //     startTime: "2025-06-06T10:00:00+05:30",
// // // //     endTime: "2025-06-06T10:45:00+05:30",
// // // //     roomNumber: "206",
// // // //     class: { name: "V", section: "A" },
// // // //     subject: { name: "Computer Science" },
// // // //     teacherName: "David Lee",
// // // //   },
// // // //   {
// // // //     id: 7,
// // // //     day: "SATURDAY",
// // // //     startTime: "2025-06-07T09:00:00+05:30",
// // // //     endTime: "2025-06-07T09:45:00+05:30",
// // // //     roomNumber: "207",
// // // //     class: { name: "V", section: "A" },
// // // //     subject: { name: "Art" },
// // // //     teacherName: "Emma Davis",
// // // //   },
// // // // ];

// // // // const StudentTimeTable = () => {
// // // //   const routes = all_routes;
// // // //   const ismobile = useMobileDetection();
// // // //   const [lessons] = useState<any[]>(mockLessons);

// // // //   const currentDate = new Date();
// // // //   const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
// // // //   const currentDay = daysOfWeek[currentDate.getDay()];
// // // //   const currentTime = currentDate.getTime();

// // // //   const groupLessonsByDay = () => {
// // // //     const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
// // // //     const grouped: { [key: string]: any[] } = {};
// // // //     days.forEach((day) => {
// // // //       grouped[day] = lessons
// // // //         .filter((lesson: any) => lesson.day.toUpperCase() === day)
// // // //         .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
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

// // // //   const isLessonOngoing = (startTime: string, endTime: string) => {
// // // //     const start = new Date(startTime).getTime();
// // // //     const end = new Date(endTime).getTime();
// // // //     return currentTime >= start && currentTime <= end;
// // // //   };

// // // //   const cardColors = [
// // // //     "#e3f2fd", // Light Blue
// // // //     "#fce4ec", // Light Pink
// // // //     "#e8f5e9", // Light Green
// // // //     "#fff3e0", // Light Orange
// // // //     "#f3e5f5", // Light Purple
// // // //     "#fffde7", // Light Yellow
// // // //   ];

// // // //   const getRandomColor = () => {
// // // //     return cardColors[Math.floor(Math.random() * cardColors.length)];
// // // //   };

// // // //   const dayColors: { [key: string]: string } = {};
// // // //   ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].forEach((day) => {
// // // //     dayColors[day] = getRandomColor();
// // // //   });

// // // //   const groupedLessons = groupLessonsByDay();

// // // //   return (
// // // //     <div
// // // //       className={ismobile ? "page-wrapper bg-dark-theme min-vh-100 d-flex flex-column" : "p-3 bg-dark-theme min-vh-100 d-flex flex-column"}
// // // //     >
// // // //       <div className="content flex-grow-1 bg-dark-theme overflow-auto">
// // // //         <div className="row flex-grow-1">
// // // //           <div className="col-12 d-flex flex-column">
// // // //             <div className="row h-100">
// // // //               <div className="col-md-12">
// // // //                 {/* Navigation commented out as in TeachersRoutine */}
// // // //                 {/* <ul className="nav nav-tabs nav-tabs-bottom mb-4">
// // // //                   <li>
// // // //                     <Link to={routes.studentDetails} className="nav-link text-white">
// // // //                       <i className="ti ti-school me-2" />
// // // //                       Student Details
// // // //                     </Link>
// // // //                   </li>
// // // //                   <li>
// // // //                     <Link to={routes.studentTimeTable} className="nav-link active">
// // // //                       <i className="ti ti-table-options me-2" />
// // // //                       Time Table
// // // //                     </Link>
// // // //                   </li>
// // // //                   <li>
// // // //                     <Link to={routes.studentAttendance} className="nav-link text-white">
// // // //                       <i className="ti ti-calendar-due me-2" />
// // // //                       Attendance
// // // //                     </Link>
// // // //                   </li>
// // // //                 </ul> */}
// // // //                 <div className="card flex-fill">
// // // //                   <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
// // // //                     <h4 className="mb-3">Student Time Table</h4>
// // // //                     <div className="d-flex align-items-center flex-wrap">
// // // //                       <div className="dropdown mb-3">
// // // //                         <Link
// // // //                           to="#"
// // // //                           className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md"
// // // //                           data-bs-toggle="dropdown"
// // // //                         >
// // // //                           <i className="ti ti-calendar-due me-2" />
// // // //                           This Year
// // // //                         </Link>
// // // //                         <ul className="dropdown-menu p-3">
// // // //                           <li>
// // // //                             <Link to="#" className="dropdown-item rounded-1">
// // // //                               This Year
// // // //                             </Link>
// // // //                           </li>
// // // //                           <li>
// // // //                             <Link to="#" className="dropdown-item rounded-1">
// // // //                               This Month
// // // //                             </Link>
// // // //                           </li>
// // // //                           <li>
// // // //                             <Link to="#" className="dropdown-item rounded-1">
// // // //                               This Week
// // // //                             </Link>
// // // //                           </li>
// // // //                         </ul>
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>
// // // //                   <div className="card-body">
// // // //                     <div className="d-flex flex-nowrap overflow-auto">
// // // //                       {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((day) => (
// // // //                         <div
// // // //                           key={day}
// // // //                           className={`d-flex flex-column me-4 flex-fill min-w-[250px] ${
// // // //                             day === currentDay ? "border-l-4 border-blue-600 bg-blue-50" : ""
// // // //                           }`}
// // // //                         >
// // // //                           <div className="mb-3">
// // // //                             <h6>{day.charAt(0) + day.slice(1).toLowerCase()}</h6>
// // // //                           </div>
// // // //                           {groupedLessons[day].length > 0 ? (
// // // //                             groupedLessons[day].map((lesson: any) => (
// // // //                               <div
// // // //                                 key={lesson.id}
// // // //                                 className={`rounded p-3 mb-4 border text-dark ${
// // // //                                   day === currentDay && isLessonOngoing(lesson.startTime, lesson.endTime)
// // // //                                     ? "border-2 border-green-500 shadow-lg bg-green-50"
// // // //                                     : ""
// // // //                                 }`}
// // // //                                 style={{ backgroundColor: dayColors[day] }}
// // // //                               >
// // // //                                 <div className="pb-3 border-bottom">
// // // //                                   <span className="text-danger badge bg-transparent-danger text-nowrap">
// // // //                                     Room No: {lesson.roomNumber || "N/A"}
// // // //                                   </span>
// // // //                                 </div>
// // // //                                 <p className="text-dark d-block py-2 m-0">
// // // //                                   Class: {lesson.class?.name || "N/A"} {lesson.class?.section || ""}
// // // //                                 </p>
// // // //                                 <p className="text-dark d-block pb-2 m-0">
// // // //                                   Subject: {lesson.subject?.name || "N/A"}
// // // //                                 </p>
// // // //                                 <p className="text-dark d-block pb-2 m-0">
// // // //                                   Teacher: {lesson.teacherName || "N/A"}
// // // //                                 </p>
// // // //                                 <p className="text-dark text-nowrap m-0">
// // // //                                   <i className="ti ti-clock me-1" />
// // // //                                   {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
// // // //                                 </p>
// // // //                               </div>
// // // //                             ))
// // // //                           ) : (
// // // //                             <div
// // // //                               className="rounded p-3 mb-4 border text-dark"
// // // //                               style={{ backgroundColor: dayColors[day] }}
// // // //                             >
// // // //                               <p className="text-dark text-center m-0">No lessons scheduled</p>
// // // //                             </div>
// // // //                           )}
// // // //                         </div>
// // // //                       ))}
// // // //                     </div>
// // // //                   </div>
// // // //                   <div className="card-footer border-0 pb-0">
// // // //                     <div className="row">
// // // //                       <div className="col-lg-4 col-xxl-4 col-xl-4 d-flex">
// // // //                         <div className="card flex-fill">
// // // //                           <div className="card-body bg-transparent-primary">
// // // //                             <span className="bg-primary badge badge-sm mb-2">
// // // //                               Morning Break
// // // //                             </span>
// // // //                             <p className="text-dark">
// // // //                               <i className="ti ti-clock me-1" />
// // // //                               10:30 to 10:45 AM
// // // //                             </p>
// // // //                           </div>
// // // //                         </div>
// // // //                       </div>
// // // //                       <div className="col-lg-4 col-xxl-3 d-flex">
// // // //                         <div className="card flex-fill">
// // // //                           <div className="card-body bg-transparent-warning">
// // // //                             <span className="bg-warning badge badge-sm mb-2">
// // // //                               Lunch
// // // //                             </span>
// // // //                             <p className="text-dark">
// // // //                               <i className="ti ti-clock me-1" />
// // // //                               12:15 to 01:30 PM
// // // //                             </p>
// // // //                           </div>
// // // //                         </div>
// // // //                       </div>
// // // //                       <div className="col-lg-4 col-xxl-3 d-flex">
// // // //                         <div className="card flex-fill">
// // // //                           <div className="card-body bg-transparent-info">
// // // //                             <span className="bg-info badge badge-sm mb-2">
// // // //                               Evening Break
// // // //                             </span>
// // // //                             <p className="text-dark">
// // // //                               <i className="ti ti-clock me-1" />
// // // //                               03:00 to 03:15 PM
// // // //                             </p>
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
// // // //     </div>
// // // //   );
// // // // };

// // // // export default StudentTimeTable;

// // // import React, { useState } from "react";
// // // import { Link } from "react-router-dom";
// // // import { all_routes } from "../../../../../router/all_routes";
// // // import useMobileDetection from "../../../../../core/common/mobileDetection";

// // // const mockLessons = [
// // //   {
// // //     id: 1,
// // //     day: "MONDAY",
// // //     startTime: "2025-06-02T09:00:00+05:30",
// // //     endTime: "2025-06-02T09:45:00+05:30",
// // //     roomNumber: "201",
// // //     class: { name: "V", section: "A" },
// // //     subject: { name: "Mathematics" },
// // //     teacherName: "John Doe",
// // //   },
// // //   {
// // //     id: 2,
// // //     day: "MONDAY",
// // //     startTime: "2025-06-02T14:30:00+05:30",
// // //     endTime: "2025-06-02T15:15:00+05:30",
// // //     roomNumber: "202",
// // //     class: { name: "V", section: "A" },
// // //     subject: { name: "English" },
// // //     teacherName: "Jane Smith",
// // //   },
// // //   {
// // //     id: 3,
// // //     day: "TUESDAY",
// // //     startTime: "2025-06-03T10:00:00+05:30",
// // //     endTime: "2025-06-03T10:45:00+05:30",
// // //     roomNumber: "203",
// // //     class: { name: "V", section: "A" },
// // //     subject: { name: "Science" },
// // //     teacherName: "Alice Johnson",
// // //   },
// // //   {
// // //     id: 4,
// // //     day: "WEDNESDAY",
// // //     startTime: "2025-06-04T11:00:00+05:30",
// // //     endTime: "2025-06-04T11:45:00+05:30",
// // //     roomNumber: "204",
// // //     class: { name: "V", section: "A" },
// // //     subject: { name: "History" },
// // //     teacherName: "Bob Brown",
// // //   },
// // //   {
// // //     id: 5,
// // //     day: "THURSDAY",
// // //     startTime: "2025-06-05T09:00:00+05:30",
// // //     endTime: "2025-06-05T09:45:00+05:30",
// // //     roomNumber: "205",
// // //     class: { name: "V", section: "A" },
// // //     subject: { name: "Geography" },
// // //     teacherName: "Carol White",
// // //   },
// // //   {
// // //     id: 6,
// // //     day: "FRIDAY",
// // //     startTime: "2025-06-06T10:00:00+05:30",
// // //     endTime: "2025-06-06T10:45:00+05:30",
// // //     roomNumber: "206",
// // //     class: { name: "V", section: "A" },
// // //     subject: { name: "Computer Science" },
// // //     teacherName: "David Lee",
// // //   },
// // //   {
// // //     id: 7,
// // //     day: "SATURDAY",
// // //     startTime: "2025-06-07T09:00:00+05:30",
// // //     endTime: "2025-06-07T09:45:00+05:30",
// // //     roomNumber: "207",
// // //     class: { name: "V", section: "A" },
// // //     subject: { name: "Art" },
// // //     teacherName: "Emma Davis",
// // //   },
// // // ];

// // // const StudentTimeTable = () => {
// // //   const routes = all_routes;
// // //   const ismobile = useMobileDetection();
// // //   const [lessons] = useState<any[]>(mockLessons);

// // //   const currentDate = new Date();
// // //   const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
// // //   const currentDay = daysOfWeek[currentDate.getDay()];
// // //   const currentTime = currentDate.getTime();

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

// // //   const isLessonOngoing = (startTime: string, endTime: string) => {
// // //     const start = new Date(startTime).getTime();
// // //     const end = new Date(endTime).getTime();
// // //     return currentTime >= start && currentTime <= end;
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
// // //     <div
// // //       className={ismobile ? "page-wrapper bg-dark-theme min-vh-100 d-flex flex-column" : "p-3 bg-dark-theme min-vh-100 d-flex flex-column"}
// // //     >
// // //       <div className="content flex-grow-1 bg-dark-theme overflow-auto">
// // //         <div className="row flex-grow-1">
// // //           <div className="col-12 d-flex flex-column">
// // //             <div className="row h-100">
// // //               <div className="col-md-12">
// // //                 {/* Navigation commented out as in TeachersRoutine */}
// // //                 {/* <ul className="nav nav-tabs nav-tabs-bottom mb-4">
// // //                   <li>
// // //                     <Link to={routes.studentDetails} className="nav-link text-white">
// // //                       <i className="ti ti-school me-2" />
// // //                       Student Details
// // //                     </Link>
// // //                   </li>
// // //                   <li>
// // //                     <Link to={routes.studentTimeTable} className="nav-link active">
// // //                       <i className="ti ti-table-options me-2" />
// // //                       Time Table
// // //                     </Link>
// // //                   </li>
// // //                   <li>
// // //                     <Link to={routes.studentAttendance} className="nav-link text-white">
// // //                       <i className="ti ti-calendar-due me-2" />
// // //                       Attendance
// // //                     </Link>
// // //                   </li>
// // //                 </ul> */}
// // //                 <div className="card flex-fill">
// // //                   <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
// // //                     <h4 className="mb-3">Student Time Table</h4>
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
// // //                         <div
// // //                           key={day}
// // //                           className={`d-flex flex-column me-4 flex-fill min-w-[250px] ${
// // //                             day === currentDay ? "border-l-4 border-blue-600 bg-blue-50" : ""
// // //                           }`}
// // //                         >
// // //                           <div className="mb-3">
// // //                             <h6>{day.charAt(0) + day.slice(1).toLowerCase()}</h6>
// // //                           </div>
// // //                           {groupedLessons[day].length > 0 ? (
// // //                             groupedLessons[day].map((lesson: any) => (
// // //                               <div
// // //                                 key={lesson.id}
// // //                                 className={`rounded p-3 mb-4 border text-dark ${
// // //                                   day === currentDay && isLessonOngoing(lesson.startTime, lesson.endTime)
// // //                                     ? "border-2 border-green-500 shadow-lg bg-green-50"
// // //                                     : ""
// // //                                 }`}
// // //                                 style={{ backgroundColor: dayColors[day] }}
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
// // //                                 <p className="text-dark d-block pb-2 m-0">
// // //                                   Teacher: {lesson.teacherName || "N/A"}
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
// // //                               style={{ backgroundColor: dayColors[day] }}
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
// // //     </div>
// // //   );
// // // };

// // // export default StudentTimeTable;

// // import React, { useState } from "react";
// // import { Link } from "react-router-dom";
// // import { all_routes } from "../../../../../router/all_routes";
// // import useMobileDetection from "../../../../../core/common/mobileDetection";

// // const mockLessons = [
// //   {
// //     id: 1,
// //     day: "MONDAY",
// //     startTime: "2025-06-02T09:00:00+05:30",
// //     endTime: "2025-06-02T09:45:00+05:30",
// //     roomNumber: "201",
// //     class: { name: "V", section: "A" },
// //     subject: { name: "Mathematics" },
// //     teacherName: "John Doe",
// //   },
// //   {
// //     id: 2,
// //     day: "MONDAY",
// //     startTime: "2025-06-02T14:30:00+05:30",
// //     endTime: "2025-06-02T18:15:00+05:30",
// //     roomNumber: "202",
// //     class: { name: "V", section: "A" },
// //     subject: { name: "English" },
// //     teacherName: "Jane Smith",
// //   },
// //   {
// //     id: 3,
// //     day: "TUESDAY",
// //     startTime: "2025-06-03T10:00:00+05:30",
// //     endTime: "2025-06-03T10:45:00+05:30",
// //     roomNumber: "203",
// //     class: { name: "V", section: "A" },
// //     subject: { name: "Science" },
// //     teacherName: "Alice Johnson",
// //   },
// //   {
// //     id: 4,
// //     day: "WEDNESDAY",
// //     startTime: "2025-06-04T11:00:00+05:30",
// //     endTime: "2025-06-04T11:45:00+05:30",
// //     roomNumber: "204",
// //     class: { name: "V", section: "A" },
// //     subject: { name: "History" },
// //     teacherName: "Bob Brown",
// //   },
// //   {
// //     id: 5,
// //     day: "THURSDAY",
// //     startTime: "2025-06-05T09:00:00+05:30",
// //     endTime: "2025-06-05T09:45:00+05:30",
// //     roomNumber: "205",
// //     class: { name: "V", section: "A" },
// //     subject: { name: "Geography" },
// //     teacherName: "Carol White",
// //   },
// //   {
// //     id: 6,
// //     day: "FRIDAY",
// //     startTime: "2025-06-06T10:00:00+05:30",
// //     endTime: "2025-06-06T10:45:00+05:30",
// //     roomNumber: "206",
// //     class: { name: "V", section: "A" },
// //     subject: { name: "Computer Science" },
// //     teacherName: "David Lee",
// //   },
// //   {
// //     id: 7,
// //     day: "SATURDAY",
// //     startTime: "2025-06-07T09:00:00+05:30",
// //     endTime: "2025-06-07T09:45:00+05:30",
// //     roomNumber: "207",
// //     class: { name: "V", section: "A" },
// //     subject: { name: "Art" },
// //     teacherName: "Emma Davis",
// //   },
// // ];

// // const StudentTimeTable = () => {
// //   const routes = all_routes;
// //   const ismobile = useMobileDetection();
// //   const [lessons] = useState<any[]>(mockLessons);

// //   const currentDate = new Date();
// //   const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
// //   const currentDay = daysOfWeek[currentDate.getDay()];
// //   const currentTime = currentDate.getTime();

// //   const groupLessonsByDay = () => {
// //     const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
// //     const grouped: { [key: string]: any[] } = {};
// //     days.forEach((day) => {
// //       grouped[day] = lessons
// //         .filter((lesson: any) => lesson.day.toUpperCase() === day)
// //         .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
// //     });
// //     return grouped;
// //   };

// //   const formatTime = (isoTime: string) => {
// //     if (!isoTime) return "N/A";
// //     return new Date(isoTime).toLocaleTimeString("en-US", {
// //       hour: "2-digit",
// //       minute: "2-digit",
// //       hour12: true,
// //     });
// //   };

// //   const isLessonOngoing = (startTime: string, endTime: string) => {
// //     const start = new Date(startTime).getTime();
// //     const end = new Date(endTime).getTime();
// //     return currentTime >= start && currentTime <= end;
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

// //   const ongoingLessonColor = getRandomColor();
// //   const groupedLessons = groupLessonsByDay();

// //   return (
// //     <div
// //       className={ismobile ? "page-wrapper bg-dark-theme min-vh-100 d-flex flex-column" : "p-3 bg-dark-theme min-vh-100 d-flex flex-column"}
// //     >
// //       <div className="content flex-grow-1 bg-dark-theme overflow-auto">
// //         <div className="row flex-grow-1">
// //           <div className="col-12 d-flex flex-column">
// //             <div className="row h-100">
// //               <div className="col-md-12">
              
// //                 <div className="card flex-fill">
// //                   <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
// //                     <h4 className="mb-3">Student Time Table</h4>
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
// //                     </div>
// //                   </div>
// //                   <div className="card-body">
// //                     <div className="d-flex flex-nowrap overflow-auto">
// //                       {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((day) => (
// //                         <div
// //                           key={day}
// //                           className={`d-flex flex-column me-4 flex-fill min-w-[250px] ${
// //                             day === currentDay ? "border-l-4 border-blue-600 bg-blue-50" : ""
// //                           }`}
// //                         >
// //                           <div className="mb-3">
// //                             <h6>{day.charAt(0) + day.slice(1).toLowerCase()}</h6>
// //                           </div>
// //                           {groupedLessons[day].length > 0 ? (
// //                             groupedLessons[day].map((lesson: any) => (
// //                               <div
// //                                 key={lesson.id}
// //                                 className={`rounded p-3 mb-4 border text-dark bg-white ${
// //                                   day === currentDay && isLessonOngoing(lesson.startTime, lesson.endTime)
// //                                     ? "border-2 border-green-500 shadow-lg bg-green-50"
// //                                     : ""
// //                                 }`}
// //                                 style={
// //                                   day === currentDay && isLessonOngoing(lesson.startTime, lesson.endTime)
// //                                     ? { backgroundColor: ongoingLessonColor }
// //                                     : {}
// //                                 }
// //                               >
// //                                 <div className="pb-3 border-bottom">
// //                                   <span className="text-danger badge bg-transparent-danger text-nowrap">
// //                                     Room No: {lesson.roomNumber || "N/A"}
// //                                   </span>
// //                                 </div>
// //                                 <p className="text-dark d-block py-2 m-0">
// //                                   Class: {lesson.class?.name || "N/A"} {lesson.class?.section || ""}
// //                                 </p>
// //                                 <p className="text-dark d-block pb-2 m-0">
// //                                   Subject: {lesson.subject?.name || "N/A"}
// //                                 </p>
// //                                 <p className="text-dark d-block pb-2 m-0">
// //                                   Teacher: {lesson.teacherName || "N/A"}
// //                                 </p>
// //                                 <p className="text-dark text-nowrap m-0">
// //                                   <i className="ti ti-clock me-1" />
// //                                   {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
// //                                 </p>
// //                               </div>
// //                             ))
// //                           ) : (
// //                             <div className="rounded p-3 mb-4 border text-dark bg-white">
// //                               <p className="text-dark text-center m-0">No lessons scheduled</p>
// //                             </div>
// //                           )}
// //                         </div>
// //                       ))}
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
// //     </div>
// //   );
// // };

// // export default StudentTimeTable;


// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { all_routes } from "../../../../../router/all_routes";
// import useMobileDetection from "../../../../../core/common/mobileDetection";

// import { AxiosResponse } from "axios";
// import { getLessonsByStudentId, ILessonResponse ,ILesson,ISubject,ITeacher,IUser} from "../../../../../services/student/StudentAllApi";



// const StudentTimeTable = () => {
//   const routes = all_routes;
//   const ismobile = useMobileDetection();
//   const [lessons, setLessons] = useState<ILesson[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const currentDate = new Date();
//   const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
//   const currentDay = daysOfWeek[currentDate.getDay()];
//   const currentTime = currentDate.getTime();

//   useEffect(() => {
//     const fetchLessons = async () => {
//       try {
//         setLoading(true);
//         const studentId = localStorage.getItem("studentId"); 
//        // console.log("object",studentId);
//         const response: AxiosResponse<ILessonResponse> = await getLessonsByStudentId(studentId as string);
//         if (response.data.success) {
//         //  console.log(response);
//           setLessons(response.data.lessons);
//         } else {
//           setError("Failed to load lessons");
//         }
//       } catch (err) {
//         setError("Error fetching lessons: " + (err instanceof Error ? err.message : "Unknown error"));
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLessons();
//   }, []);

//   const groupLessonsByDay = () => {
//     const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
//     const grouped: { [key: string]: ILesson[] } = {};
//     days.forEach((day) => {
//       grouped[day] = lessons
//         .filter((lesson: ILesson) => lesson.day.toUpperCase() === day)
//         .sort((a: ILesson, b: ILesson) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
//     });
//     return grouped;
//   };

//   const formatTime = (isoTime: string) => {
//     if (!isoTime) return "N/A";
//     return new Date(isoTime).toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const isLessonOngoing = (startTime: string, endTime: string) => {
//     const start = new Date(startTime).getTime();
//     const end = new Date(endTime).getTime();
//     return currentTime >= start && currentTime <= end;
//   };

//   const cardColors = [
//     "#e3f2fd", // Light Blue
//     "#fce4ec", // Light Pink
//     "#e8f5e9", // Light Green
//     "#fff3e0", // Light Orange
//     "#f3e5f5", // Light Purple
//     "#fffde7", // Light Yellow
//   ];

//   const getRandomColor = () => {
//     return cardColors[Math.floor(Math.random() * cardColors.length)];
//   };

//   const ongoingLessonColor = getRandomColor();
//   const groupedLessons = groupLessonsByDay();

//   if (loading) {
//     return (
//       <div className={ismobile ? "page-wrapper bg-dark-theme min-vh-100 d-flex flex-column" : "p-3 bg-dark-theme min-vh-100 d-flex flex-column"}>
//         <div className="content flex-grow-1 bg-dark-theme overflow-auto">
//           <div className="row flex-grow-1">
//             <div className="col-12 d-flex flex-column">
//               <div className="row h-100">
//                 <div className="col-md-12">
//                   <div className="card flex-fill">
//                     <div className="card-body">
//                       <p className="text-dark text-center m-0">Loading...</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={ismobile ? "page-wrapper bg-dark-theme min-vh-100 d-flex flex-column" : "p-3 bg-dark-theme min-vh-100 d-flex flex-column"}>
//         <div className="content flex-grow-1 bg-dark-theme overflow-auto">
//           <div className="row flex-grow-1">
//             <div className="col-12 d-flex flex-column">
//               <div className="row h-100">
//                 <div className="col-md-12">
//                   <div className="card flex-fill">
//                     <div className="card-body">
//                       <p className="text-danger text-center m-0">{error}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={ismobile ? "page-wrapper bg-dark-theme min-vh-100 d-flex flex-column" : "p-3 bg-dark-theme min-vh-100 d-flex flex-column"}
//     >
//       <div className="content flex-grow-1 bg-dark-theme overflow-auto">
//         <div className="row flex-grow-1">
//           <div className="col-12 d-flex flex-column">
//             <div className="row h-100">
//               <div className="col-md-12">
//                 <div className="card flex-fill">
//                   <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
//                     <h4 className="mb-3">Student Time Table</h4>
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
//                     </div>
//                   </div>
//                   <div className="card-body">
//                     <div className="d-flex flex-nowrap overflow-auto">
//                       {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((day) => (
//                         <div
//                           key={day}
//                           className={`d-flex flex-column me-4 flex-fill min-w-[250px] ${
//                             day === currentDay ? "border-l-4 border-blue-600 bg-blue-50" : ""
//                           }`}
//                         >
//                           <div className="mb-3">
//                             <h6>{day.charAt(0) + day.slice(1).toLowerCase()}</h6>
//                           </div>
//                           {groupedLessons[day].length > 0 ? (
//                             groupedLessons[day].map((lesson: ILesson) => (
//                               <div
//                                 key={lesson.id}
//                                 className={`rounded p-3 mb-4 border text-dark bg-white ${
//                                   day === currentDay && isLessonOngoing(lesson.startTime, lesson.endTime)
//                                     ? "border-2 border-green-500 shadow-lg bg-green-50"
//                                     : ""
//                                 }`}
//                                 style={
//                                   day === currentDay && isLessonOngoing(lesson.startTime, lesson.endTime)
//                                     ? { backgroundColor: ongoingLessonColor }
//                                     : {}
//                                 }
//                               >
//                                 <div className="pb-3 border-bottom">
//                                   <span className="text-danger badge bg-transparent-danger text-nowrap">
//                                     Room No: {lesson.roomNumber || "N/A"}
//                                   </span>
//                                 </div>
//                                 <p className="text-dark d-block py-2 m-0">
//                                   Class: {lesson.name || "N/A"}
//                                 </p>
//                                 <p className="text-dark d-block pb-2 m-0">
//                                   Subject: {lesson.subject?.name || "N/A"}
//                                 </p>
//                                 <p className="text-dark d-block pb-2 m-0">
//                                   Teacher: {lesson.teacher?.user?.name || "N/A"}
//                                 </p>
//                                 <p className="text-dark text-nowrap m-0">
//                                   <i className="ti ti-clock me-1" />
//                                   {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
//                                 </p>
//                               </div>
//                             ))
//                           ) : (
//                             <div className="rounded p-3 mb-4 border text-dark bg-white">
//                               <p className="text-dark text-center m-0">No lessons scheduled</p>
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="card-footer border-0 pb-0">
//                     <div className="row">
//                       <div className="col-lg-4 col-xxl-4 col-xl-4 d-flex">
//                         <div className="card flex-fill">
//                           <div className="card-body bg-transparent-primary">
//                             <span className="bg-primary badge badge-sm mb-2">
//                               Morning Break
//                             </span>
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
//                             <span className="bg-warning badge badge-sm mb-2">
//                               Lunch
//                             </span>
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
//                             <span className="bg-info badge badge-sm mb-2">
//                               Evening Break
//                             </span>
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
//     </div>
//   );
// };

// export default StudentTimeTable;


import React, { useState, useEffect } from "react";
import { AxiosResponse } from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getLessonsByStudentId, ILessonResponse, ILesson, ISubject, ITeacher, IUser } from "../../../../../services/student/StudentAllApi";
import useMobileDetection from "../../../../../core/common/mobileDetection";
import { useSelector } from "react-redux";

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger m-3">
          <h5>Something went wrong.</h5>
          <p>Please try refreshing the page or contact support.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const StudentTimeTable = () => {
  const isMobile = useMobileDetection();
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const role = useSelector((state: any) => state.auth.userObj.role) || "";
  
  const currentDate = new Date();
  const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const currentDay = daysOfWeek[currentDate.getDay()];
  const currentTime = currentDate.getTime();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const studentId = localStorage.getItem("studentId");
        if (!studentId) {
          throw new Error("Student ID not found");
        }
        const response: AxiosResponse<ILessonResponse> = await getLessonsByStudentId(studentId);
        
        if (response.data.success) {
          setLessons(response.data.lessons);
          toast.success('Timetable loaded successfully!', { autoClose: 3000 });
        } else {
          throw new Error("Failed to load lessons");
        }
      } catch (err: any) {
        const errorMessage = "Error fetching lessons: " + (err instanceof Error ? err.message : "Unknown error");
        setError(errorMessage);
        toast.error(errorMessage, { autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchLessons();
  }, [role]);

  const formatTime = (isoTime: string) => {
    if (!isoTime) return "N/A";
    return new Date(isoTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isLessonOngoing = (startTime: string, endTime: string) => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    return currentTime >= start && currentTime <= end;
  };

  const currentDayLessons = lessons
    .filter((lesson: ILesson) => lesson.day.toUpperCase() === currentDay)
    .sort((a: ILesson, b: ILesson) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const SkeletonPlaceholder = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
    <span className={`placeholder bg-secondary ${className}`} style={style} />
  );

  const getDayIcon = (day: string) => {
    const icons = {
      'MONDAY': 'bi-calendar-week',
      'TUESDAY': 'bi-calendar-week',
      'WEDNESDAY': 'bi-calendar-week',
      'THURSDAY': 'bi-calendar-week',
      'FRIDAY': 'bi-calendar-week',
      'SATURDAY': 'bi-calendar-week',
      'SUNDAY': 'bi-calendar-week'
    };
    return icons[day as keyof typeof icons] || 'bi-calendar-week';
  };

  return (
    <ErrorBoundary>
      <div className={isMobile ? "page-wrapper bg-light min-vh-100 d-flex flex-column" : "p-4 bg-light min-vh-100 d-flex flex-column"}>
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        
        <div className="content flex-grow-1 overflow-auto">
          <div className="row flex-grow-1">
            <div className="col-12 d-flex flex-column">
              <div className="card flex-fill shadow-sm border-0 rounded-3">
                <div className="card-header bg-white border-0 py-4">
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <div className="d-flex align-items-center">
                      <i className={`bi ${getDayIcon(currentDay)} fs-2 text-primary me-3`}></i>
                      <div>
                        <h4 className="mb-0 fw-semibold text-dark">
                          Timetable for {currentDay.charAt(0) + currentDay.slice(1).toLowerCase()}
                        </h4>
                        <p className="text-muted mb-0">
                          {currentDate.toLocaleDateString('en-GB', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-primary">
                        <i className="bi bi-clock me-1"></i>
                        {currentDate.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit', 
                          hour12: true 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="card-body p-4">
                  {isLoading ? (
                    <div className="placeholder-glow">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="card mb-3 p-3 border-0 shadow-sm">
                          <div className="d-flex justify-content-between mb-2">
                            <SkeletonPlaceholder className="col-3" style={{ height: "1rem" }} />
                            <SkeletonPlaceholder className="col-2" style={{ height: "1rem" }} />
                          </div>
                          <SkeletonPlaceholder className="col-5 mb-2" style={{ height: "1.2rem" }} />
                          <SkeletonPlaceholder className="col-4 mb-2" style={{ height: "1rem" }} />
                          <SkeletonPlaceholder className="col-6" style={{ height: "1rem" }} />
                        </div>
                      ))}
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="alert-heading">Error Loading Timetable</h5>
                        <p className="mb-0">{error}</p>
                      </div>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => window.location.reload()}>
                        <i className="bi bi-arrow-clockwise me-1"></i>Retry
                      </button>
                    </div>
                  ) : currentDayLessons.length > 0 ? (
                    <div className="d-flex flex-column gap-3">
                      {currentDayLessons.map((lesson: ILesson, index: number) => (
                        <div
                          key={lesson.id}
                          className={`card p-4 shadow-sm border-0 rounded-3 transition-all ${
                            index % 2 === 0 ? "bg-white" : "bg-light"
                          } ${isLessonOngoing(lesson.startTime, lesson.endTime) ? "border-2 border-success shadow-lg bg-success bg-opacity-10" : ""}`}
                        >
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center gap-2">
                              <span className="badge bg-danger">
                                <i className="bi bi-building me-1"></i>
                                Room: {lesson.roomNumber || "N/A"}
                              </span>
                              <span className="badge bg-secondary">
                                <i className="bi bi-people me-1"></i>
                                {lesson.name || "N/A"}
                              </span>
                            </div>
                            {isLessonOngoing(lesson.startTime, lesson.endTime) && (
                              <span className="badge bg-success fs-6">
                                <i className="bi bi-play-circle me-1"></i>Ongoing
                              </span>
                            )}
                          </div>
                          
                          <h5 className="fw-bold text-dark mb-3">
                            <i className="bi bi-book text-primary me-2"></i>
                            {lesson.subject?.name || "N/A"}
                          </h5>
                          
                          <div className="row g-3">
                            <div className="col-md-6">
                              <p className="mb-2 text-secondary">
                                <i className="bi bi-clock text-primary me-2"></i>
                                <strong>Time:</strong> {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
                              </p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-2 text-secondary">
                                <i className="bi bi-person text-primary me-2"></i>
                                <strong>Teacher:</strong> {lesson.teacher?.user?.name || "N/A"}
                              </p>
                            </div>
                          </div>
                          
                          {isLessonOngoing(lesson.startTime, lesson.endTime) && (
                            <div className="mt-3 p-3 bg-success bg-opacity-10 rounded-3 border border-success">
                              <p className="mb-0 text-success fw-medium">
                                <i className="bi bi-info-circle me-2"></i>
                                This lesson is currently in progress
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-calendar-x display-1 text-muted mb-4"></i>
                      <h3 className="fw-medium text-muted mb-3">No lessons scheduled for today</h3>
                      <p className="text-muted">Enjoy your free time or check back later for updates</p>
                    </div>
                  )}
                </div>
                
                <div className="card-footer bg-white border-0 p-4">
                  <h6 className="fw-bold text-dark mb-4">
                    <i className="bi bi-cup-hot text-warning me-2"></i>
                    Daily Breaks
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="card bg-primary bg-opacity-10 border-primary border-2 p-3 h-100">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-sun text-primary fs-4 me-2"></i>
                          <span className="badge bg-primary">Morning Break</span>
                        </div>
                        <p className="text-dark mb-0 fw-medium">
                          <i className="bi bi-clock me-1"></i>
                          10:30 - 10:45 AM
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card bg-warning bg-opacity-10 border-warning border-2 p-3 h-100">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-egg-fried text-warning fs-4 me-2"></i>
                          <span className="badge bg-warning text-dark">Lunch</span>
                        </div>
                        <p className="text-dark mb-0 fw-medium">
                          <i className="bi bi-clock me-1"></i>
                          12:15 - 01:30 PM
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card bg-info bg-opacity-10 border-info border-2 p-3 h-100">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-cup-straw text-info fs-4 me-2"></i>
                          <span className="badge bg-info">Evening Break</span>
                        </div>
                        <p className="text-dark mb-0 fw-medium">
                          <i className="bi bi-clock me-1"></i>
                          03:00 - 03:15 PM
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
    </ErrorBoundary>
  );
};

export default StudentTimeTable;