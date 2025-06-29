// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { all_routes } from "../../../../../router/all_routes";
// import StudentModals from "../studentModals";
// import StudentSidebar from "./studentSidebar";
// import StudentBreadcrumb from "./studentBreadcrumb";
// import useMobileDetection from "../../../../../core/common/mobileDetection";


// const StudentResult = () => {
//   const routes = all_routes;
//   const isMobile = useMobileDetection();
 
 
//   return (
//     <>
//       {/* Page Wrapper */}
//       <div className={isMobile ? "page-wrapper" : "p-3"}>
    
//         {/* Page Content */}
//         <div className="content">
          
//           <div className="row">
//             {/* Student Information */}
//             {/* {!isMobile && <StudentSidebar />} */}
//             {/* /Student Information */}
//             <div className="col-12 d-flex flex-column">
//               <div className="row">
//                 <div className="col-md-12">
//                   {/* Navigation */}
                
//                   {/* /Navigation */}
//                   <div className="card">
//                     <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
//                       <h4 className="mb-3">Exams & Results</h4>
//                       <div className="d-flex align-items-center flex-wrap">
//                         <div className="dropdown mb-3 me-2">
//                           <Link
//                             to="#"
//                             className="btn btn-outline-light bg-white dropdown-toggle"
//                             data-bs-toggle="dropdown"
//                             data-bs-auto-close="outside"
//                           >
//                             <i className="ti ti-calendar-due me-2" />
//                             Year : 2024 / 2025
//                           </Link>
//                           <ul className="dropdown-menu p-3">
//                             <li>
//                               <Link to="#" className="dropdown-item rounded-1">
//                                 Year : 2024 / 2025
//                               </Link>
//                             </li>
//                             <li>
//                               <Link to="#" className="dropdown-item rounded-1">
//                                 Year : 2023 / 2024
//                               </Link>
//                             </li>
//                             <li>
//                               <Link to="#" className="dropdown-item rounded-1">
//                                 Year : 2022 / 2023
//                               </Link>
//                             </li>
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="card-body">
//                       <div className="accordions-items-seperate" id="accordionExample">
//                         {/* Accordion content remains unchanged */}
//                         <div className="accordion-item">
//                           <h2 className="accordion-header">
//                             <button
//                               className="accordion-button"
//                               type="button"
//                               data-bs-toggle="collapse"
//                               data-bs-target="#collapseOne"
//                               aria-expanded="true"
//                               aria-controls="collapseOne"
//                             >
//                               <span className="avatar avatar-sm bg-success me-2">
//                                 <i className="ti ti-checks" />
//                               </span>
//                               Monthly Test (May)
//                             </button>
//                           </h2>
//                           <div
//                             id="collapseOne"
//                             className="accordion-collapse collapse show"
//                             data-bs-parent="#accordionExample"
//                           >
//                             <div className="accordion-body">
//                               {/* Exam Result List */}
//                               <div className="table-responsive">
//                                 <table className="table">
//                                   <thead className="thead-light">
//                                     <tr>
//                                       <th>Subject</th>
//                                       <th>Max Marks</th>
//                                       <th>Min Marks</th>
//                                       <th>Marks Obtained</th>
//                                       <th className="text-end">Result</th>
//                                     </tr>
//                                   </thead>
//                                   <tbody>
//                                     <tr>
//                                       <td>English (150)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>65</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Mathematics (214)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>73</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Physics (120)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>55</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Chemistry (110)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>90</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Spanish (140)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>88</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td className="bg-dark text-white">Rank : 30</td>
//                                       <td className="bg-dark text-white">Total : 500</td>
//                                       <td className="bg-dark text-white" colSpan={2}>Marks Obtained : 395</td>
//                                       <td className="bg-dark text-white text-end">
//                                         <div className="d-flex align-items-center justify-content-end">
//                                           <span className="me-2">Percentage : 79.50</span>
//                                           <h6 className="fw-normal text-white">
//                                             Result : <span className="text-success"> Pass</span>
//                                           </h6>
//                                         </div>
//                                       </td>
//                                     </tr>
//                                   </tbody>
//                                 </table>
//                               </div>
//                               {/* /Exam Result List */}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="accordion-item">
//                           <h2 className="accordion-header">
//                             <button
//                               className="accordion-button collapsed"
//                               type="button"
//                               data-bs-toggle="collapse"
//                               data-bs-target="#collapseTwo"
//                               aria-expanded="false"
//                               aria-controls="collapseTwo"
//                             >
//                               <span className="avatar avatar-sm bg-success me-2">
//                                 <i className="ti ti-checks" />
//                               </span>
//                               Monthly Test (Apr)
//                             </button>
//                           </h2>
//                           <div
//                             id="collapseTwo"
//                             className="accordion-collapse collapse"
//                             data-bs-parent="#accordionExample"
//                           >
//                             <div className="accordion-body">
//                               {/* Exam Result List */}
//                               <div className="table-responsive">
//                                 <table className="table">
//                                   <thead className="thead-light">
//                                     <tr>
//                                       <th>Subject</th>
//                                       <th>Max Marks</th>
//                                       <th>Min Marks</th>
//                                       <th>Marks Obtained</th>
//                                       <th className="text-end">Result</th>
//                                     </tr>
//                                   </thead>
//                                   <tbody>
//                                     <tr>
//                                       <td>English (150)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>59</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Mathematics (214)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>69</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Physics (120)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>79</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Chemistry (110)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>89</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Spanish (140)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>99</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td className="bg-dark text-white">Rank : 30</td>
//                                       <td className="bg-dark text-white">Total : 500</td>
//                                       <td className="bg-dark text-white" colSpan={2}>Marks Obtained : 400</td>
//                                       <td className="bg-dark text-white text-end">
//                                         <div className="d-flex align-items-center justify-content-end">
//                                           <span className="me-2">Percentage : 80.50</span>
//                                           <h6 className="fw-normal text-white">
//                                             Result : <span className="text-success"> Pass</span>
//                                           </h6>
//                                         </div>
//                                       </td>
//                                     </tr>
//                                   </tbody>
//                                 </table>
//                               </div>
//                               {/* /Exam Result List */}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="accordion-item">
//                           <h2 className="accordion-header">
//                             <button
//                               className="accordion-button collapsed"
//                               type="button"
//                               data-bs-toggle="collapse"
//                               data-bs-target="#collapseThree"
//                               aria-expanded="false"
//                               aria-controls="collapseThree"
//                             >
//                               <span className="avatar avatar-sm bg-success me-2">
//                                 <i className="ti ti-checks" />
//                               </span>
//                               Monthly Test (Mar)
//                             </button>
//                           </h2>
//                           <div
//                             id="collapseThree"
//                             className="accordion-collapse collapse"
//                             data-bs-parent="#accordionExample"
//                           >
//                             <div className="accordion-body">
//                               {/* Exam Result List */}
//                               <div className="table-responsive">
//                                 <table className="table">
//                                   <thead className="thead-light">
//                                     <tr>
//                                       <th>Subject</th>
//                                       <th>Max Marks</th>
//                                       <th>Min Marks</th>
//                                       <th>Marks Obtained</th>
//                                       <th className="text-end">Result</th>
//                                     </tr>
//                                   </thead>
//                                   <tbody>
//                                     <tr>
//                                       <td>English (150)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>40</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Mathematics (214)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>45</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Physics (120)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>30</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Chemistry (110)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>28</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Spanish (140)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>50</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td className="bg-dark text-white">Rank : 30</td>
//                                       <td className="bg-dark text-white">Total : 500</td>
//                                       <td className="bg-dark text-white" colSpan={2}>Marks Obtained : 250</td>
//                                       <td className="bg-dark text-white text-end">
//                                         <div className="d-flex align-items-center justify-content-end">
//                                           <span className="me-2">Percentage : 50</span>
//                                           <h6 className="text-white fw-normal">
//                                             Result : <span className="text-danger"> Fail</span>
//                                           </h6>
//                                         </div>
//                                       </td>
//                                     </tr>
//                                   </tbody>
//                                 </table>
//                               </div>
//                               {/* /Exam Result List */}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="accordion-item">
//                           <h2 className="accordion-header">
//                             <button
//                               className="accordion-button collapsed"
//                               type="button"
//                               data-bs-toggle="collapse"
//                               data-bs-target="#collapseFour"
//                               aria-expanded="false"
//                               aria-controls="collapseFour"
//                             >
//                               <span className="avatar avatar-sm bg-success me-2">
//                                 <i className="ti ti-checks" />
//                               </span>
//                               Monthly Test (Feb)
//                             </button>
//                           </h2>
//                           <div
//                             id="collapseFour"
//                             className="accordion-collapse collapse"
//                             data-bs-parent="#accordionExample"
//                           >
//                             <div className="accordion-body">
//                               {/* Exam Result List */}
//                               <div className="table-responsive">
//                                 <table className="table">
//                                   <thead className="thead-light">
//                                     <tr>
//                                       <th>Subject</th>
//                                       <th>Max Marks</th>
//                                       <th>Min Marks</th>
//                                       <th>Marks Obtained</th>
//                                       <th className="text-end">Result</th>
//                                     </tr>
//                                   </thead>
//                                   <tbody>
//                                     <tr>
//                                       <td>English (150)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>40</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Mathematics (214)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>45</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Physics (120)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>30</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-danger d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Fail
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Chemistry (110)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>28</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-danger d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Fail
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Spanish (140)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>50</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td className="bg-dark text-white">Rank : 30</td>
//                                       <td className="bg-dark text-white">Total : 500</td>
//                                       <td className="bg-dark text-white" colSpan={2}>Marks Obtained : 250</td>
//                                       <td className="bg-dark text-white text-end">
//                                         <div className="d-flex align-items-center justify-content-end">
//                                           <span className="me-2">Percentage : 50</span>
//                                           <h6 className="text-white">
//                                             Result : <span className="text-danger"> Fail</span>
//                                           </h6>
//                                         </div>
//                                       </td>
//                                     </tr>
//                                   </tbody>
//                                 </table>
//                               </div>
//                               {/* /Exam Result List */}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="accordion-item">
//                           <h2 className="accordion-header">
//                             <button
//                               className="accordion-button collapsed"
//                               type="button"
//                               data-bs-toggle="collapse"
//                               data-bs-target="#collapseFive"
//                               aria-expanded="false"
//                               aria-controls="collapseFive"
//                             >
//                               <span className="avatar avatar-sm bg-success me-2">
//                                 <i className="ti ti-checks" />
//                               </span>
//                               Monthly Test (Jan)
//                             </button>
//                           </h2>
//                           <div
//                             id="collapseFive"
//                             className="accordion-collapse collapse"
//                             data-bs-parent="#accordionExample"
//                           >
//                             <div className="accordion-body">
//                               {/* Exam Result List */}
//                               <div className="table-responsive">
//                                 <table className="table">
//                                   <thead className="thead-light">
//                                     <tr>
//                                       <th>Subject</th>
//                                       <th>Max Marks</th>
//                                       <th>Min Marks</th>
//                                       <th>Marks Obtained</th>
//                                       <th className="text-end">Result</th>
//                                     </tr>
//                                   </thead>
//                                   <tbody>
//                                     <tr>
//                                       <td>English (150)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>59</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Mathematics (214)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>69</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Physics (120)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>79</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Chemistry (110)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>89</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td>Spanish (140)</td>
//                                       <td>100</td>
//                                       <td>35</td>
//                                       <td>99</td>
//                                       <td className="text-end">
//                                         <span className="badge badge-soft-success d-inline-flex align-items-center">
//                                           <i className="ti ti-circle-filled fs-5 me-1" />
//                                           Pass
//                                         </span>
//                                       </td>
//                                     </tr>
//                                     <tr>
//                                       <td className="bg-dark text-white">Rank : 30</td>
//                                       <td className="bg-dark text-white">Total : 500</td>
//                                       <td className="bg-dark text-white" colSpan={2}>Marks Obtained : 400</td>
//                                       <td className="bg-dark text-white text-end">
//                                         <div className="d-flex align-items-center justify-content-end">
//                                           <span className="me-2">Percentage : 80.50</span>
//                                           <h6 className="fw-normal text-white">
//                                             Result : <span className="text-success"> Pass</span>
//                                           </h6>
//                                         </div>
//                                       </td>
//                                     </tr>
//                                   </tbody>
//                                 </table>
//                               </div>
//                               {/* /Exam Result List */}
//                             </div>
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
//       {/* /Page Wrapper */}
//       <StudentModals />
//     </>
//   );
// };

// export default StudentResult;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../../../router/all_routes";
import StudentModals from "../studentModals";
import StudentSidebar from "./studentSidebar";
import StudentBreadcrumb from "./studentBreadcrumb";
import useMobileDetection from "../../../../../core/common/mobileDetection";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getExamsResultsByStudentId, IExam } from "../../../../../services/student/StudentAllApi";

type ExamData = {
  id: string;
  title: string;
  exams: {
    subject: string;
    maxMarks: number;
    minMarks: number;
    marksObtained: number | null;
    result: string;
  }[];
  totalMarks: number;
  marksObtained: number | null;
  percentage: string;
  overallResult: string;
};

const StudentResult = () => {
  const routes = all_routes;
  const isMobile = useMobileDetection();
  const [examData, setExamData] = useState<ExamData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setIsLoading(true);
        const response = await getExamsResultsByStudentId();
        
        if (response.data.success) {
          const groupedByMonth = response.data.exams.reduce((acc: { [key: string]: IExam[] }, exam: IExam) => {
            const month = new Date(exam.startTime).toLocaleString('en-US', { month: 'long' });
            acc[month] = acc[month] || [];
            acc[month].push(exam);
            return acc;
          }, {});
          
          const transformedData = Object.keys(groupedByMonth).map((month, index) => {
            const exams = groupedByMonth[month];
            const examDetails = exams.map((exam: IExam) => {
              const maxMarks = exam.totalMarks || 100;
              const minMarks = exam.passMark || 35;
              const marksObtained = exam.results.length > 0 ? exam.results[0].score : null;
              const result = marksObtained !== null ? (marksObtained >= minMarks ? 'Pass' : 'Fail') : 'N/A';
              return {
                subject: `${exam.subject.name} (${exam.subject.code})`,
                maxMarks,
                minMarks,
                marksObtained,
                result,
              };
            });
            
            const totalMarks = examDetails.reduce((sum, e) => sum + e.maxMarks, 0);
            const marksObtained = examDetails.reduce((sum, e) => sum + (e.marksObtained || 0), 0);
            const hasMissingScores = examDetails.some(e => e.marksObtained === null);
            const hasScores = examDetails.some(e => e.marksObtained !== null);
            const percentage = hasScores ? (totalMarks ? ((marksObtained / totalMarks) * 100).toFixed(2) : '0.00') : 'N/A';
            const overallResult = hasMissingScores ? 'Fail' : (hasScores && examDetails.every(e => e.marksObtained === null || e.result === 'Pass') ? 'Pass' : 'Fail');
            
            return {
              id: `collapse${index + 1}`,
              title: `Monthly Test (${month})`,
              exams: examDetails,
              totalMarks,
              marksObtained: hasScores ? marksObtained : null,
              percentage,
              overallResult,
            };
          });
          
          setExamData(transformedData);
          toast.success('Exams and results loaded successfully!', { autoClose: 3000 });
        } else {
          throw new Error('Failed to load exam data');
        }
      } catch (error: any) {
        console.error('Error fetching exam data:', error);
        toast.error(error.message || 'Failed to load exams and results', { autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamData();
  }, []);

  if (isLoading) {
    return (
      <div className={isMobile ? "page-wrapper" : "p-3"}>
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        <div className="content">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading exam results...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!examData.length) {
    return (
      <div className={isMobile ? "page-wrapper" : "p-3"}>
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        <div className="content">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body text-center py-5">
                  <i className="bi bi-exclamation-triangle display-4 text-muted mb-3"></i>
                  <h5>No exam results available</h5>
                  <p className="text-muted">No exam results have been published yet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={isMobile ? "page-wrapper" : "p-3"}>
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        <div className="content">
          <div className="row">
            <div className="col-12 d-flex flex-column">
              <div className="row">
                <div className="col-md-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between flex-wrap pb-0">
                      <h4 className="fw-bold text-dark mb-3">
                        <i className="bi bi-mortarboard text-primary me-2"></i>
                        Exams & Results
                      </h4>
                      <div className="d-flex align-items-center flex-wrap">
                        <div className="dropdown mb-3 me-2">
                          <button
                            className="btn btn-outline-primary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="outside"
                          >
                            <i className="bi bi-calendar me-2"></i>
                            Year : 2024 / 2025
                          </button>
                          <ul className="dropdown-menu p-3">
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
                                Year : 2024 / 2025
                              </Link>
                            </li>
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
                                Year : 2023 / 2024
                              </Link>
                            </li>
                            <li>
                              <Link to="#" className="dropdown-item rounded-1">
                                Year : 2022 / 2023
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <div className="accordion" id="accordionExample">
                        {examData.map((exam, index) => (
                          <div className="accordion-item border-0 shadow-sm mb-3" key={exam.id}>
                            <h2 className="accordion-header">
                              <button
                                className={`accordion-button ${index === 0 ? '' : 'collapsed'} fw-bold`}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#${exam.id}`}
                                aria-expanded={index === 0 ? 'true' : 'false'}
                                aria-controls={exam.id}
                              >
                                <span className={`badge ${exam.overallResult === 'Pass' ? 'bg-success' : 'bg-danger'} me-3`}>
                                  <i className="bi bi-check-circle"></i>
                                </span>
                                {exam.title}
                              </button>
                            </h2>
                            <div
                              id={exam.id}
                              className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                              data-bs-parent="#accordionExample"
                            >
                              <div className="accordion-body p-4">
                                <div className="table-responsive">
                                  <table className="table table-hover">
                                    <thead className="table-light">
                                      <tr>
                                        <th scope="col">
                                          <i className="bi bi-book me-1"></i>
                                          Subject
                                        </th>
                                        <th scope="col">
                                          <i className="bi bi-star me-1"></i>
                                          Max Marks
                                        </th>
                                        <th scope="col">
                                          <i className="bi bi-flag me-1"></i>
                                          Min Marks
                                        </th>
                                        <th scope="col">
                                          <i className="bi bi-trophy me-1"></i>
                                          Marks Obtained
                                        </th>
                                        <th scope="col" className="text-end">
                                          <i className="bi bi-check-circle me-1"></i>
                                          Result
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {exam.exams.map((subject, idx) => (
                                        <tr key={idx}>
                                          <td>
                                            <span className="fw-medium">{subject.subject}</span>
                                          </td>
                                          <td>
                                            <span className="text-muted">{subject.maxMarks}</span>
                                          </td>
                                          <td>
                                            <span className="text-muted">{subject.minMarks}</span>
                                          </td>
                                          <td>
                                            <span className="fw-bold">{subject.marksObtained ?? 'N/A'}</span>
                                          </td>
                                          <td className="text-end">
                                            <span className={`badge ${subject.result === 'Pass' ? 'bg-success' : subject.result === 'Fail' ? 'bg-danger' : 'bg-secondary'}`}>
                                              <i className={`bi ${subject.result === 'Pass' ? 'bi-check-circle' : subject.result === 'Fail' ? 'bi-x-circle' : 'bi-question-circle'} me-1`}></i>
                                              {subject.result}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                      <tr className="table-dark">
                                        <td className="text-white fw-bold">
                                          <i className="bi bi-trophy me-1"></i>
                                          Rank : N/A
                                        </td>
                                        <td className="text-white fw-bold">
                                          Total : {exam.totalMarks}
                                        </td>
                                        <td className="text-white" colSpan={2}>
                                          Marks Obtained : {exam.marksObtained ?? 'N/A'}
                                        </td>
                                        <td className="text-white text-end">
                                          <div className="d-flex align-items-center justify-content-end">
                                            <span className="me-3">
                                              <i className="bi bi-percent me-1"></i>
                                              {exam.percentage}%
                                            </span>
                                            <span className={`badge ${exam.overallResult === 'Pass' ? 'bg-success' : 'bg-danger'}`}>
                                              <i className={`bi ${exam.overallResult === 'Pass' ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                                              {exam.overallResult}
                                            </span>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
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
        </div>
      </div>
      <StudentModals />
    </>
  );
};

export default StudentResult;