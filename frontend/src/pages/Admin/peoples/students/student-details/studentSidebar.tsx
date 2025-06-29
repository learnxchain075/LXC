// // import React, { useEffect, useState } from "react";
// // import { Link } from "react-router-dom";
// // import ImageWithBasePath from "../../../../../core/common/imageWithBasePath";
// // import { getFeeById } from "../../../../../services/admin/feesApi";



// // const StudentSidebar = () => {
// //   const [fee, setFee] = useState<any>(null);

// //   // useEffect(() => {
// //   //   const fetchFee = async () => {
// //   //     const feeId = localStorage.getItem("userId") || "";
// //   //     const result = await getFeeById(feeId);
// //   //     console.log("fee of a student ", result);
// //   //     setFee(result);
// //   //   };
// //   //   fetchFee();
// //   // }, []);

// //   return (
// //     <div className="col-xxl-3 col-xl-4 theiaStickySidebar">
// //       <div className="stickybar pb-4">
// //         <div className="card border-white">
// //           <div className="card-header">
// //             <div className="d-flex align-items-center flex-wrap row-gap-3">
// //               <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
// //                 <ImageWithBasePath
// //                   src="assets/img/students/student-01.jpg"
// //                   className="img-fluid"
// //                   alt="img"
// //                 />
// //               </div>
// //               <div className="overflow-hidden">
// //                 <span className="badge badge-soft-success d-inline-flex align-items-center mb-1">
// //                   <i className="ti ti-circle-filled fs-5 me-1" />
// //                   Active
// //                 </span>
// //                 <h5 className="mb-1 text-truncate">Janet Daniel</h5>
// //                 <p className="text-primary">AD1256589</p>
// //               </div>
// //             </div>
// //           </div>
// //           {/* Basic Information */}
// //           <div className="card-body">
// //             <h5 className="mb-3">Basic Information</h5>
// //             <dl className="row mb-0">
// //               <dt className="col-6 fw-medium text-dark mb-3">Roll No</dt>
// //               <dd className="col-6 mb-3">35013</dd>
// //               <dt className="col-6 fw-medium text-dark mb-3">Gender</dt>
// //               <dd className="col-6 mb-3">Female</dd>
// //               <dt className="col-6 fw-medium text-dark mb-3">Date Of Birth</dt>
// //               <dd className="col-6 mb-3">25 Jan 2008</dd>
// //               <dt className="col-6 fw-medium text-dark mb-3">Blood Group</dt>
// //               <dd className="col-6 mb-3">O +ve</dd>
// //               <dt className="col-6 fw-medium text-dark mb-3">Blood Group</dt>
// //               <dd className="col-6 mb-3">Red</dd>
// //               <dt className="col-6 fw-medium text-dark mb-3">Reigion</dt>
// //               <dd className="col-6 mb-3">Christianity</dd>
// //               <dt className="col-6 fw-medium text-dark mb-3">Caste</dt>
// //               <dd className="col-6 mb-3">Catholic</dd>
// //               <dt className="col-6 fw-medium text-dark mb-3">Category</dt>
// //               <dd className="col-6 mb-3">OBC</dd>
// //               <dt className="col-6 fw-medium text-dark mb-3">Mother tongue</dt>
// //               <dd className="col-6 mb-3">English</dd>
// //               <dt className="col-6 fw-medium text-dark mb-3">Language</dt>
// //               <dd className="col-6 mb-3">
// //                 <span className="badge badge-light text-dark me-2">
// //                   English
// //                 </span>
// //                 <span className="badge badge-light text-dark">Spanish</span>
// //               </dd>
// //             </dl>
// //             <Link
// //               to="#"
// //               data-bs-toggle="modal"
// //               data-bs-target="#add_fees_collect"
// //               className="btn btn-primary btn-sm w-100"
// //             >
// //               pay Fees
// //             </Link>
// //           </div>
// //           {/* /Basic Information */}
// //         </div>
// //         {/* Primary Contact Info */}
// //         <div className="card border-white">
// //           <div className="card-body">
// //             <h5 className="mb-3">Primary Contact Info</h5>
// //             <div className="d-flex align-items-center mb-3">
// //               <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
// //                 <i className="ti ti-phone" />
// //               </span>
// //               <div>
// //                 <span className="text-dark fw-medium mb-1">Phone Number</span>
// //                 <p>+1 46548 84498</p>
// //               </div>
// //             </div>
// //             <div className="d-flex align-items-center">
// //               <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
// //                 <i className="ti ti-mail" />
// //               </span>
// //               <div>
// //                 <span className="text-dark fw-medium mb-1">Email Address</span>
// //                 <p>jan@example.com</p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //         {/* /Primary Contact Info */}
// //         {/* Sibiling Information */}
// //         <div className="card border-white">
// //           <div className="card-body">
// //             <h5 className="mb-3">Sibiling Information</h5>
// //             <div className="d-flex align-items-center bg-light-300 rounded p-3 mb-3">
// //               <span className="avatar avatar-lg">
// //                 <ImageWithBasePath
// //                   src="assets/img/students/student-06.jpg"
// //                   className="img-fluid rounded"
// //                   alt="img"
// //                 />
// //               </span>
// //               <div className="ms-2">
// //                 <h5 className="fs-14">Ralph Claudia</h5>
// //                 <p>III, B</p>
// //               </div>
// //             </div>
// //             <div className="d-flex align-items-center bg-light-300 rounded p-3">
// //               <span className="avatar avatar-lg">
// //                 <ImageWithBasePath
// //                   src="assets/img/students/student-07.jpg"
// //                   className="img-fluid rounded"
// //                   alt="img"
// //                 />
// //               </span>
// //               <div className="ms-2">
// //                 <h5 className="fs-14">Julie Scott</h5>
// //                 <p>V, A</p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //         {/* /Sibiling Information */}
// //         {/* Transport Information */}
// //         <div className="card border-white mb-0">
// //           <div className="card-body pb-1">
// //             <ul className="nav nav-tabs nav-tabs-bottom mb-3">
// //               <li className="nav-item">
// //                 <Link
// //                   className="nav-link active"
// //                   to="#hostel"
// //                   data-bs-toggle="tab"
// //                 >
// //                   Hostel
// //                 </Link>
// //               </li>
// //               <li className="nav-item">
// //                 <Link className="nav-link" to="#transport" data-bs-toggle="tab">
// //                   Transportation
// //                 </Link>
// //               </li>
// //             </ul>
// //             <div className="tab-content">
// //               <div className="tab-pane fade show active" id="hostel">
// //                 <div className="d-flex align-items-center mb-3">
// //                   <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
// //                     <i className="ti ti-building-fortress fs-16" />
// //                   </span>
// //                   <div>
// //                     <h6 className="fs-14 mb-1">HI-Hostel, Floor</h6>
// //                     <p className="text-primary">Room No : 25</p>
// //                   </div>
// //                 </div>
// //               </div>
// //               <div className="tab-pane fade" id="transport">
// //                 <div className="d-flex align-items-center mb-3">
// //                   <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
// //                     <i className="ti ti-bus fs-16" />
// //                   </span>
// //                   <div>
// //                     <span className="fs-12 mb-1">Route</span>
// //                     <p className="text-dark">Newyork</p>
// //                   </div>
// //                 </div>
// //                 <div className="row">
// //                   <div className="col-sm-6">
// //                     <div className="mb-3">
// //                       <span className="fs-12 mb-1">Bus Number</span>
// //                       <p className="text-dark">AM 54548</p>
// //                     </div>
// //                   </div>
// //                   <div className="col-sm-6">
// //                     <div className="mb-3">
// //                       <span className="fs-12 mb-1">Pickup Point</span>
// //                       <p className="text-dark">Cincinatti</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //         {/* /Transport Information */}
// //       </div>
// //     </div>
// //   );
// // };

// // export default StudentSidebar;


// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { getStudentUserById, IStudentUser } from "../../../../../services/student/StudentAllApi";

// const StudentSidebar = () => {
//   const [studentUser, setStudentUser] = useState<IStudentUser | null>(null);

//   useEffect(() => {
//     const fetchStudentUser = async () => {
//       try {
//         const response = await getStudentUserById();
//         setStudentUser(response.data);
//       } catch (error) {
//         console.error("Error fetching student user:", error);
//         toast.error("Failed to fetch student details.", { autoClose: 3000 });
//       }
//     };
//     fetchStudentUser();
//   }, []);

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   return (
//     <div className="col-xxl-3 col-xl-4 theiaStickySidebar">
//       <div className="stickybar pb-4">
//         <div className="card border-white">
//           <div className="card-header">
//             <div className="d-flex align-items-center flex-wrap row-gap-3">
//               <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
//                 <img
//                   src={studentUser?.profilePic || "assets/img/students/student-01.jpg"}
//                   className="img-fluid"
//                   alt="Profile"
//                 />
//               </div>
//               <div className="overflow-hidden">
//                 <span className={`badge badge-soft-${studentUser?.student.status === "ACTIVE" ? "success" : "danger"} d-inline-flex align-items-center mb-1`}>
//                   <i className="ti ti-circle-filled fs-5 me-1" />
//                   {studentUser?.student.status || "N/A"}
//                 </span>
//                 <h5 className="mb-1 text-truncate">{studentUser?.name || "N/A"}</h5>
//                 <p className="text-primary">{studentUser?.student.admissionNo || "N/A"}</p>
//               </div>
//             </div>
//           </div>
//           {/* Basic Information */}
//           <div className="card-body">
//             <h5 className="mb-3">Basic Information</h5>
//             <dl className="row mb-0">
//               <dt className="col-6 fw-medium text-dark mb-3">Roll No</dt>
//               <dd className="col-6 mb-3">{studentUser?.student.rollNo || "N/A"}</dd>
//               <dt className="col-6 fw-medium text-dark mb-3">Gender</dt>
//               <dd className="col-6 mb-3">{studentUser?.sex || "N/A"}</dd>
//               <dt className="col-6 fw-medium text-dark mb-3">Date Of Birth</dt>
//               <dd className="col-6 mb-3">{studentUser?.student.dateOfBirth ? formatDate(studentUser.student.dateOfBirth) : "N/A"}</dd>
//               <dt className="col-6 fw-medium text-dark mb-3">Blood Group</dt>
//               <dd className="col-6 mb-3">{studentUser?.bloodType || "N/A"}</dd>
//               <dt className="col-6 fw-medium text-dark mb-3">Religion</dt>
//               <dd className="col-6 mb-3">{studentUser?.student.Religion || "N/A"}</dd>
//               <dt className="col-6 fw-medium text-dark mb-3">Caste</dt>
//               <dd className="col-6 mb-3">{studentUser?.student.caste || "N/A"}</dd>
//               <dt className="col-6 fw-medium text-dark mb-3">Category</dt>
//               <dd className="col-6 mb-3">{studentUser?.student.category || "N/A"}</dd>
//               <dt className="col-6 fw-medium text-dark mb-3">Mother Tongue</dt>
//               <dd className="col-6 mb-3">{studentUser?.student.motherTongue || "N/A"}</dd>
//               <dt className="col-6 fw-medium text-dark mb-3">Language</dt>
//               <dd className="col-6 mb-3">
//                 {studentUser?.student.languagesKnown ? (
//                   studentUser.student.languagesKnown.split(",").map((lang, index) => (
//                     <span key={index} className="badge badge-light text-dark me-2">
//                       {lang.trim()}
//                     </span>
//                   ))
//                 ) : (
//                   "N/A"
//                 )}
//               </dd>
//             </dl>
//             {/* <Link
//               to="#"
//               data-bs-toggle="modal"
//               data-bs-target="#add_fees_collect"
//               className="btn btn-primary btn-sm w-100"
//             >
//               Pay Fees
//             </Link> */}
//           </div>
//           {/* /Basic Information */}
//         </div>
//         {/* Primary Contact Info */}
//         <div className="card border-white">
//           <div className="card-body">
//             <h5 className="mb-3">Primary Contact Info</h5>
//             <div className="d-flex align-items-center mb-3">
//               <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
//                 <i className="ti ti-phone" />
//               </span>
//               <div>
//                 <span className="text-dark fw-medium mb-1">Phone Number</span>
//                 <p>{studentUser?.phone || "N/A"}</p>
//               </div>
//             </div>
//             <div className="d-flex align-items-center">
//               <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
//                 <i className="ti ti-mail" />
//               </span>
//               <div>
//                 <span className="text-dark fw-medium mb-1">Email Address</span>
//                 <p>{studentUser?.email || "N/A"}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* /Primary Contact Info */}
//         {/* Sibling Information */}
//         <div className="card border-white">
//           <div className="card-body">
//             <h5 className="mb-3">Sibling Information</h5>
//             {studentUser?.student.areSiblingStudying === "yes" ? (
//               <div className="d-flex align-items-center bg-light-300 rounded p-3">
//                 <div>
//                   <h5 className="fs-14">{studentUser.student.siblingName || "N/A"}</h5>
//                   <p>{studentUser.student.siblingClass || "N/A"}</p>
//                 </div>
//               </div>
//             ) : (
//               <p>No siblings studying.</p>
//             )}
//           </div>
//         </div>
//         {/* /Sibling Information */}
//         {/* Transport Information */}
//         <div className="card border-white mb-0">
//           <div className="card-body pb-1">
//             <ul className="nav nav-tabs nav-tabs-bottom mb-3">
//               <li className="nav-item">
//                 <Link
//                   className="nav-link active"
//                   to="#hostel"
//                   data-bs-toggle="tab"
//                 >
//                   Hostel
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link" to="#transport" data-bs-toggle="tab">
//                   Transportation
//                 </Link>
//               </li>
//             </ul>
//             <div className="tab-content">
//               <div className="tab-pane fade show active" id="hostel">
//                 <div className="d-flex align-items-center mb-3">
//                   <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
//                     <i className="ti ti-building-fortress fs-16" />
//                   </span>
//                   <div>
//                     <h6 className="fs-14 mb-1">{studentUser?.student.hostelName || "N/A"}</h6>
//                     <p className="text-primary">Room No: {studentUser?.student.roomNumber || "N/A"}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="tab-pane fade" id="transport">
//                 <div className="d-flex align-items-center mb-3">
//                   <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
//                     <i className="ti ti-bus fs-16" />
//                   </span>
//                   <div>
//                     <span className="fs-12 mb-1">Route</span>
//                     <p className="text-dark">{studentUser?.student.route?.name || "N/A"}</p>
//                   </div>
//                 </div>
//                 <div className="row">
//                   <div className="col-sm-6">
//                     <div className="mb-3">
//                       <span className="fs-12 mb-1">Bus Number</span>
//                       <p className="text-dark">{studentUser?.student.vehicleNumber || "N/A"}</p>
//                     </div>
//                   </div>
//                   <div className="col-sm-6">
//                     <div className="mb-3">
//                       <span className="fs-12 mb-1">Pickup Point</span>
//                       <p className="text-dark">{studentUser?.student.busStop?.name || "N/A"}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* /Transport Information */}
//       </div>
//     </div>
//   );
// };

// export default StudentSidebar;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { getstudentprofiledetails, getStudentUserById, IStudentUser } from "../../../../../services/student/StudentAllApi";
import "react-toastify/dist/ReactToastify.css";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger m-3">
          <h5>Something went wrong.</h5>
          <p>Please try refreshing the page or contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const StudentSidebar = () => {
  const [studentUser, setStudentUser] = useState<IStudentUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Added loading state

  useEffect(() => {
    const fetchStudentUser = async () => {
      try {
        setIsLoading(true);
        const response = await getStudentUserById();
      
        setStudentUser(response.data);
      } catch (error) {
        console.error("Error fetching student user:", error);
        toast.error("Failed to fetch student details.", { autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudentUser();
  }, []);

  // Skeleton Placeholder Component
  const SkeletonPlaceholder = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
    <span className={`placeholder bg-secondary ${className}`} style={style} />
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <ErrorBoundary>
      <div className="col-xxl-3 col-xl-4 theiaStickySidebar">
        <ToastContainer />
        <div className="stickybar pb-4">
          {/* Profile Card */}
          <div className="card border-white">
            <div className="card-header">
              {isLoading ? (
                <div className="d-flex align-items-center flex-wrap row-gap-3 placeholder-glow">
                  <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0">
                    <SkeletonPlaceholder className="rounded-circle" style={{ width: "80px", height: "80px" }} />
                  </div>
                  <div className="overflow-hidden">
                    <SkeletonPlaceholder className="col-6 mb-1" style={{ height: "1rem" }} />
                    <SkeletonPlaceholder className="col-8 mb-1" style={{ height: "1.5rem" }} />
                    <SkeletonPlaceholder className="col-4" style={{ height: "1rem" }} />
                  </div>
                </div>
              ) : (
                <div className="d-flex align-items-center flex-wrap row-gap-3">
                  <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                    <img
                      src={studentUser?.profilePic || "assets/img/students/student-01.jpg"}
                      className="img-fluid"
                      alt="Profile"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <span className={`badge badge-soft-${studentUser?.student.status === "ACTIVE" ? "success" : "danger"} d-inline-flex align-items-center mb-1`}>
                      <i className="ti ti-circle-filled fs-5 me-1" />
                      {studentUser?.student.status || "N/A"}
                    </span>
                    <h5 className="mb-1 text-truncate">{studentUser?.name || "N/A"}</h5>
                    <p className="text-primary">{studentUser?.student.admissionNo || "N/A"}</p>
                  </div>
                </div>
              )}
            </div>
            {/* Basic Information */}
            <div className="card-body">
              <h5 className="mb-3">Basic Information</h5>
              {isLoading ? (
                <dl className="row mb-0 placeholder-glow">
                  {[...Array(9)].map((_, index) => (
                    <React.Fragment key={index}>
                      <dt className="col-6 fw-medium text-dark mb-3">
                        <SkeletonPlaceholder className="col-8" style={{ height: "1rem" }} />
                      </dt>
                      <dd className="col-6 mb-3">
                        <SkeletonPlaceholder className="col-10" style={{ height: "1rem" }} />
                      </dd>
                    </React.Fragment>
                  ))}
                </dl>
              ) : (
                <dl className="row mb-0">
                  <dt className="col-6 fw-medium text-dark mb-3">Roll No</dt>
                  <dd className="col-6 mb-3">{studentUser?.student.rollNo || "N/A"}</dd>
                  <dt className="col-6 fw-medium text-dark mb-3">Gender</dt>
                  <dd className="col-6 mb-3">{studentUser?.sex || "N/A"}</dd>
                  <dt className="col-6 fw-medium text-dark mb-3">Date Of Birth</dt>
                  <dd className="col-6 mb-3">{studentUser?.student.dateOfBirth ? formatDate(studentUser.student.dateOfBirth) : "N/A"}</dd>
                  <dt className="col-6 fw-medium text-dark mb-3">Blood Group</dt>
                  <dd className="col-6 mb-3">{studentUser?.bloodType || "N/A"}</dd>
                  <dt className="col-6 fw-medium text-dark mb-3">Religion</dt>
                  <dd className="col-6 mb-3">{studentUser?.student.Religion || "N/A"}</dd>
                  <dt className="col-6 fw-medium text-dark mb-3">Caste</dt>
                  <dd className="col-6 mb-3">{studentUser?.student.caste || "N/A"}</dd>
                  <dt className="col-6 fw-medium text-dark mb-3">Category</dt>
                  <dd className="col-6 mb-3">{studentUser?.student.category || "N/A"}</dd>
                  <dt className="col-6 fw-medium text-dark mb-3">Mother Tongue</dt>
                  <dd className="col-6 mb-3">{studentUser?.student.motherTongue || "N/A"}</dd>
                  <dt className="col-6 fw-medium text-dark mb-3">Language</dt>
                  <dd className="col-6 mb-3">
                    {studentUser?.student.languagesKnown ? (
                      studentUser.student.languagesKnown.split(",").map((lang, index) => (
                        <span key={index} className="badge badge-light text-dark me-2">
                          {lang.trim()}
                        </span>
                      ))
                    ) : (
                      "N/A"
                    )}
                  </dd>
                </dl>
              )}
              {/* <Link
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#add_fees_collect"
                className="btn btn-primary btn-sm w-100"
              >
                Pay Fees
              </Link> */}
            </div>
            {/* /Basic Information */}
          </div>
          {/* Primary Contact Info */}
          <div className="card border-white">
            <div className="card-body">
              <h5 className="mb-3">Primary Contact Info</h5>
              {isLoading ? (
                <>
                  <div className="d-flex align-items-center mb-3 placeholder-glow">
                    <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0">
                      <SkeletonPlaceholder className="rounded" style={{ width: "40px", height: "40px" }} />
                    </span>
                    <div>
                      <SkeletonPlaceholder className="col-6 mb-1" style={{ height: "1rem" }} />
                      <SkeletonPlaceholder className="col-8" style={{ height: "1rem" }} />
                    </div>
                  </div>
                  <div className="d-flex align-items-center placeholder-glow">
                    <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0">
                      <SkeletonPlaceholder className="rounded" style={{ width: "40px", height: "40px" }} />
                    </span>
                    <div>
                      <SkeletonPlaceholder className="col-6 mb-1" style={{ height: "1rem" }} />
                      <SkeletonPlaceholder className="col-8" style={{ height: "1rem" }} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="d-flex align-items-center mb-3">
                    <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                      <i className="ti ti-phone" />
                    </span>
                    <div>
                      <span className="text-dark fw-medium mb-1">Phone Number</span>
                      <p>{studentUser?.phone || "N/A"}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                      <i className="ti ti-mail" />
                    </span>
                    <div>
                      <span className="text-dark fw-medium mb-1">Email Address</span>
                      <p>{studentUser?.email || "N/A"}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* /Primary Contact Info */}
          {/* Sibling Information */}
          <div className="card border-white">
            <div className="card-body">
              <h5 className="mb-3">Sibling Information</h5>
              {isLoading ? (
                <div className="d-flex align-items-center bg-light-300 rounded p-3 placeholder-glow">
                  <div>
                    <SkeletonPlaceholder className="col-6 mb-1" style={{ height: "1rem" }} />
                    <SkeletonPlaceholder className="col-8" style={{ height: "1rem" }} />
                  </div>
                </div>
              ) : studentUser?.student.areSiblingStudying === "yes" ? (
                <div className="d-flex align-items-center bg-light-300 rounded p-3">
                  <div>
                    <h5 className="fs-14">{studentUser.student.siblingName || "N/A"}</h5>
                    <p>{studentUser.student.siblingClass || "N/A"}</p>
                  </div>
                </div>
              ) : (
                <p>No siblings studying.</p>
              )}
            </div>
          </div>
          {/* /Sibling Information */}
          {/* Transport Information */}
          <div className="card border-white mb-0">
            <div className="card-body pb-1">
              {isLoading ? (
                <div className="placeholder-glow">
                  <ul className="nav nav-tabs nav-tabs-bottom mb-3">
                    <li className="nav-item">
                      <SkeletonPlaceholder className="col-6" style={{ height: "1.5rem" }} />
                    </li>
                    <li className="nav-item">
                      <SkeletonPlaceholder className="col-6" style={{ height: "1.5rem" }} />
                    </li>
                  </ul>
                </div>
              ) : (
                <ul className="nav nav-tabs nav-tabs-bottom mb-3">
                  <li className="nav-item">
                    <Link className="nav-link active" to="#hostel" data-bs-toggle="tab">
                      Hostel
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="#transport" data-bs-toggle="tab">
                      Transportation
                    </Link>
                  </li>
                </ul>
              )}
              <div className="tab-content">
                <div className="tab-pane fade show active" id="hostel">
                  {isLoading ? (
                    <div className="d-flex align-items-center mb-3 placeholder-glow">
                      <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0">
                        <SkeletonPlaceholder className="rounded" style={{ width: "40px", height: "40px" }} />
                      </span>
                      <div>
                        <SkeletonPlaceholder className="col-6 mb-1" style={{ height: "1rem" }} />
                        <SkeletonPlaceholder className="col-8" style={{ height: "1rem" }} />
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                        <i className="ti ti-building-fortress fs-16" />
                      </span>
                      <div>
                        <h6 className="fs-14 mb-1">{studentUser?.student.hostelName || "N/A"}</h6>
                        <p className="text-primary">Room No: {studentUser?.student.roomNumber || "N/A"}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="tab-pane fade" id="transport">
                  {isLoading ? (
                    <>
                      <div className="d-flex align-items-center mb-3 placeholder-glow">
                        <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0">
                          <SkeletonPlaceholder className="rounded" style={{ width: "40px", height: "40px" }} />
                        </span>
                        <div>
                          <SkeletonPlaceholder className="col-6 mb-1" style={{ height: "1rem" }} />
                          <SkeletonPlaceholder className="col-8" style={{ height: "1rem" }} />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="mb-3 placeholder-glow">
                            <SkeletonPlaceholder className="col-6 mb-1" style={{ height: "1rem" }} />
                            <SkeletonPlaceholder className="col-8" style={{ height: "1rem" }} />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="mb-3 placeholder-glow">
                            <SkeletonPlaceholder className="col-6 mb-1" style={{ height: "1rem" }} />
                            <SkeletonPlaceholder className="col-8" style={{ height: "1rem" }} />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="d-flex align-items-center mb-3">
                        <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                          <i className="ti ti-bus fs-16" />
                        </span>
                        <div>
                          <span className="fs-12 mb-1">Route</span>
                          <p className="text-dark">{studentUser?.student.route?.name || "N/A"}</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="mb-3">
                            <span className="fs-12 mb-1">Bus Number</span>
                            <p className="text-dark">{studentUser?.student.vehicleNumber || "N/A"}</p>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="mb-3">
                            <span className="fs-12 mb-1">Pickup Point</span>
                            <p className="text-dark">{studentUser?.student.busStop?.name || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* /Transport Information */}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default StudentSidebar;