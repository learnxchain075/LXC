
// import React, { useEffect, useState } from 'react';
// import TeacherModal from '../teacherModal';
// import { Link } from 'react-router-dom';
// import { all_routes } from '../../../../../router/all_routes';
// import TeacherSidebar from './teacherSidebar';
// import TeacherBreadcrumb from './teacherBreadcrumb';
// import useMobileDetection from '../../../../../core/common/mobileDetection';
// import { getTeacherById } from '../../../../../services/admin/teacherRegistartion';
// import { useSelector } from 'react-redux';

// const TeacherDetails = ({ teacherdata }: { teacherdata?: any }) => {
//   const routes = all_routes;
//   const ismobile = useMobileDetection();
//   const userobj = useSelector((state: any) => state.auth.userObj);

//   const fetchTeacherDetails = async () => {
//     try {
//       const response = await getTeacherById(localStorage.getItem("teacherId") ?? "");
//       if (response.status === 200) {
//         const teacherDetails = response.data;
//          console.log("Teacher Details:", teacherDetails);
//         if(!teacherdata){
//           teacherdata = teacherDetails;
//         }
//         console.log("Teacher Details:", teacherDetails);
//       } else {
//         console.error("Failed to fetch teacher details");
//       }
//     } catch (error) {
//       console.error("Error fetching teacher details:", error);
//     }
//   };
//    const fetchTeacherDetailsmobile = async () => {
//     try {
//       const response = await getTeacherById(localStorage.getItem("teacherId") ?? "");
//       if (response.status === 200) {
//         const teacherDetails = response.data;
//          console.log("Teacher Details:", teacherDetails);
      
//           teacherdata = teacherDetails;
//         }
       
//       } 
//     catch (error) {
//       console.error("Error fetching teacher details:", error);
//     }
//   };
// useEffect(()=>{
//   fetchTeacherDetailsmobile();
// },[ismobile])
//   useEffect(() => {
//     if (!teacherdata) {
//     fetchTeacherDetails();}
//    // console.log("object", teacherdata);
//   }, [userobj.role,teacherdata]);

//   return (
//     <>
//       {/* Page Wrapper */}
//       <div className={ismobile ? "page-wrapper bg-dark-theme min-vh-100 d-flex flex-column" : "p-3 bg-dark-theme min-vh-100 d-flex flex-column"}>
//         <div className="content flex-grow-1 bg-dark-theme overflow-auto">
//           <div className="row flex-grow-1">
//             {/* Page Header */}
//             {/* <TeacherBreadcrumb /> */}
//             {/* /Page Header */}
//             {/* Student Information */}
//             {/* <TeacherSidebar /> */}
//             {/* /Student Information */}
//             <div className="col-12 d-flex flex-column">
//               <div className="row h-100">
//                 {/* Parents Information */}
//                 <div className="card flex-fill mb-4">
//                   <div className="card-header">
//                     <h5>Profile Details</h5>
//                   </div>
//                   <div className="card-body">
//                     <div className="border rounded p-3 pb-0">
//                       <div className="row">
//                         <div className="col-sm-6 col-lg-4">
//                           <div className="mb-3">
//                             <p className="text-dark fw-medium mb-1">Father’s Name</p>
//                             <p>{teacherdata?.fatherName || "N/A"}</p>
//                           </div>
//                         </div>
//                         <div className="col-sm-6 col-lg-4">
//                           <div className="mb-3">
//                             <p className="text-dark fw-medium mb-1">Mother Name</p>
//                             <p>{teacherdata?.motherName || "N/A"}</p>
//                           </div>
//                         </div>
//                         <div className="col-sm-6 col-lg-4">
//                           <div className="mb-3">
//                             <p className="text-dark fw-medium mb-1">DOB</p>
//                             <p>
//                               {teacherdata?.dateOfBirth
//                                 ? new Date(teacherdata.dateOfBirth).toLocaleDateString()
//                                 : "N/A"}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="col-sm-6 col-lg-4">
//                           <div className="mb-3">
//                             <p className="text-dark fw-medium mb-1">Marital Status</p>
//                             <p>{teacherdata?.maritalStatus || "N/A"}</p>
//                           </div>
//                         </div>
//                         <div className="col-sm-6 col-lg-4">
//                           <div className="mb-3">
//                             <p className="text-dark fw-medium mb-1">Qualification</p>
//                             <p>{teacherdata?.qualification || "N/A"}</p>
//                           </div>
//                         </div>
//                         <div className="col-sm-6 col-lg-4">
//                           <div className="mb-3">
//                             <p className="text-dark fw-medium mb-1">Experience</p>
//                             <p>{teacherdata?.workExperience || "N/A"}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 {/* /Parents Information */}
//                 {/* Documents */}
//                 <div className="col-xxl-6 d-flex">
//                   <div className="card flex-fill mb-4">
//                     <div className="card-header">
//                       <h5>Documents</h5>
//                     </div>
//                     <div className="card-body">
//                       <div className="bg-light-300 border rounded d-flex align-items-center justify-content-between mb-3 p-2">
//                         <div className="d-flex align-items-center overflow-hidden">
//                           <span className="avatar avatar-md bg-white rounded flex-shrink-0 text-default">
//                             <i className="ti ti-pdf fs-15" />
//                           </span>
//                           <div className="ms-2">
//                             <p className="text-truncate fw-medium text-dark">Resume</p>
//                           </div>
//                         </div>
//                         {teacherdata?.Resume ? (
//                           <a
//                             href={teacherdata.Resume}
//                             className="btn btn-dark btn-icon btn-sm"
//                             download
//                           >
//                             <i className="ti ti-download" />
//                           </a>
//                         ) : (
//                           <span>N/A</span>
//                         )}
//                       </div>
//                       <div className="bg-light-300 border rounded d-flex align-items-center justify-content-between p-2">
//                         <div className="d-flex align-items-center overflow-hidden">
//                           <span className="avatar avatar-md bg-white rounded flex-shrink-0 text-default">
//                             <i className="ti ti-pdf fs-15" />
//                           </span>
//                           <div className="ms-2">
//                             <p className="text-truncate fw-medium text-dark">Joining Letter</p>
//                           </div>
//                         </div>
//                         {teacherdata?.joiningLetter ? (
//                           <a
//                             href={teacherdata.joiningLetter}
//                             className="btn btn-dark btn-icon btn-sm"
//                             download
//                           >
//                             <i className="ti ti-download" />
//                           </a>
//                         ) : (
//                           <span>N/A</span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 {/* /Documents */}
//                 {/* Address */}
//                 <div className="col-xxl-6 d-flex">
//                   <div className="card flex-fill mb-4">
//                     <div className="card-header">
//                       <h5>Address</h5>
//                     </div>
//                     <div className="card-body">
//                       <div className="d-flex align-items-center mb-3">
//                         <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
//                           <i className="ti ti-map-pin-up" />
//                         </span>
//                         <div>
//                           <p className="text-dark fw-medium mb-1">Current Address</p>
//                           <p>{teacherdata?.user?.address || "N/A"}</p>
//                         </div>
//                       </div>
//                       <div className="d-flex align-items-center">
//                         <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
//                           <i className="ti ti-map-pins" />
//                         </span>
//                         <div>
//                           <p className="text-dark fw-medium mb-1">Permanent Address</p>
//                           <p>{teacherdata?.user?.permanentAddress || "N/A"}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 {/* /Address */}
//                 {/* Previous School Details */}
//                 <div className="col-xxl-12">
//                   <div className="card flex-fill mb-4">
//                     <div className="card-header">
//                       <h5>Previous School Details</h5>
//                     </div>
//                     <div className="card-body pb-1">
//                       <div className="row">
//                         <div className="col-md-4">
//                           <div className="mb-3">
//                             <p className="mb-1 text-dark fw-medium">Previous School Name</p>
//                             <p>{teacherdata?.previousSchool || "N/A"}</p>
//                           </div>
//                         </div>
//                         <div className="col-md-4">
//                           <div className="mb-3">
//                             <p className="mb-1 text-dark fw-medium">School Address</p>
//                             <p>{teacherdata?.previousSchoolAddress || "N/A"}</p>
//                           </div>
//                         </div>
//                         <div className="col-md-4">
//                           <div className="mb-3">
//                             <p className="mb-1 text-dark fw-medium">Phone Number</p>
//                             <p>{teacherdata?.previousSchoolPhone || "N/A"}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 {/* /Previous School Details */}
//                 {/* Bank Details */}
//                 <div className="col-xxl-6 d-flex">
//                   <div className="card flex-fill mb-4">
//                     <div className="card-header">
//                       <h5>Bank Details</h5>
//                     </div>
//                     <div className="card-body pb-1">
//                       <div className="row">
//                         <div className="col-md-4">
//                           <div className="mb-3">
//                             <p className="mb-1 text-dark fw-medium">Bank Name</p>
//                             <p>{teacherdata?.bankName || "N/A"}</p>
//                           </div>
//                         </div>
//                         <div className="col-md-4">
//                           <div className="mb-3">
//                             <p className="mb-1 text-dark fw-medium">Branch</p>
//                             <p>{teacherdata?.branchName || "N/A"}</p>
//                           </div>
//                         </div>
//                         <div className="col-md-4">
//                           <div className="mb-3">
//                             <p className="mb-1 text-dark fw-medium">IFSC</p>
//                             <p>{teacherdata?.ifscCode || "N/A"}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 {/* /Bank Details */}
//                 {/* Work Details */}
//                 <div className="col-xxl-6 d-flex">
//                   <div className="card flex-fill mb-4">
//                     <div className="card-header">
//                       <h5>Work Details</h5>
//                     </div>
//                     <div className="card-body pb-1">
//                       <div className="row">
//                         <div className="col-md-4">
//                           <div className="mb-3">
//                             <p className="mb-1 text-dark fw-medium">Contract Type</p>
//                             <p>{teacherdata?.contractType || "N/A"}</p>
//                           </div>
//                         </div>
//                         <div className="col-md-4">
//                           <div className="mb-3">
//                             <p className="mb-1 text-dark fw-medium">Shift</p>
//                             <p>{teacherdata?.shift || "N/A"}</p>
//                           </div>
//                         </div>
//                         <div className="col-md-4">
//                           <div className="mb-3">
//                             <p className="mb-1 text-dark fw-medium">Work Location</p>
//                             <p>{teacherdata?.workLocation || "N/A"}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 {/* /Work Details */}
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

// export default TeacherDetails;

import React, { useEffect, useState } from 'react';
import TeacherModal from '../teacherModal';
import { Link } from 'react-router-dom';
import { all_routes } from '../../../../../router/all_routes';
import TeacherSidebar from './teacherSidebar';
import TeacherBreadcrumb from './teacherBreadcrumb';
import useMobileDetection from '../../../../../core/common/mobileDetection';
import { getTeacherById } from '../../../../../services/admin/teacherRegistartion';
import { useSelector } from 'react-redux';

const TeacherDetails = () => {
  const routes = all_routes;
  const ismobile = useMobileDetection();
  const userobj = useSelector((state: any) => state.auth.userObj);
  const [localTeacherData, setLocalTeacherData] = useState<any>(null); 
  const [loading, setLoading] = useState(true); 

  const fetchTeacherDetails = async () => {
    try {
      setLoading(true);
     // console.log("TeacherDetails: Fetching teacher details...");
      const teacherId = localStorage.getItem("teacherId");
     // console.log("TeacherDetails: Teacher ID:", teacherId);
      
      const response = await getTeacherById(teacherId ?? "");
     // console.log("TeacherDetails: API Response:", response);
      
      if (response.status === 200) {
        const teacherDetails = response.data;
       // console.log("TeacherDetails: Teacher Details:", teacherDetails);
        setLocalTeacherData(teacherDetails); 
      } else {
       // console.error("TeacherDetails: Failed to fetch teacher details");
      }
    } catch (error) {
     // console.error("TeacherDetails: Error fetching teacher details:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
   // console.log("TeacherDetails: Component mounted, fetching teacher details...");
    fetchTeacherDetails();
  }, [userobj.role]);

  const SkeletonPlaceholder = ({ className = '' }) => (
    <span className={`placeholder bg-secondary ${className}`} />
  );

  const displayData = localTeacherData;

  return (
    <>
      {/* Page Wrapper */}
      <div className={ismobile ? "page-wrapper bg-dark-theme min-vh-100 d-flex flex-column" : "p-3 bg-dark-theme min-vh-100 d-flex flex-column"}>
        <div className="content flex-grow-1 bg-dark-theme overflow-auto">
          <div className="row flex-grow-1">
            <div className="col-12 d-flex flex-column">
              {loading ? (
                <div className="row h-100">
                  {/* Profile Details Skeleton */}
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
                  {/* Documents Skeleton */}
                  <div className="col-md-6 d-flex">
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
                  {/* Address Skeleton */}
                  <div className="col-md-6 d-flex">
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
                  {/* Previous School Details Skeleton */}
                  <div className="col-md-12">
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
                  {/* Bank Details Skeleton */}
                  <div className="col-md-6 d-flex">
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
                  {/* Work Details Skeleton */}
                  <div className="col-md-6 d-flex">
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
              ) : (
                <div className="row h-100">
                  {/* Profile Details */}
                  <div className="card flex-fill mb-4">
                    <div className="card-header">
                      <h5>Profile Details</h5>
                    </div>
                    <div className="card-body">
                      <div className="border rounded p-3 pb-0">
                        <div className="row">
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">Father's Name</p>
                              <p>{displayData?.fatherName || "N/A"}</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">Mother Name</p>
                              <p>{displayData?.motherName || "N/A"}</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">DOB</p>
                              <p>
                                {displayData?.dateOfBirth
                                  ? new Date(displayData.dateOfBirth).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">Marital Status</p>
                              <p>{displayData?.maritalStatus || "N/A"}</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">Qualification</p>
                              <p>{displayData?.qualification || "N/A"}</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-lg-4">
                            <div className="mb-3">
                              <p className="text-dark fw-medium mb-1">Experience</p>
                              <p>{displayData?.workExperience || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Documents */}
                  <div className="col-md-6 d-flex">
                    <div className="card flex-fill mb-4">
                      <div className="card-header">
                        <h5>Documents</h5>
                      </div>
                      <div className="card-body">
                        <div className="bg-light-300 border rounded d-flex align-items-center justify-content-between mb-3 p-2">
                          <div className="d-flex align-items-center overflow-hidden">
                            <span className="avatar avatar-md bg-white rounded flex-shrink-0 text-default">
                              <i className="ti ti-pdf fs-15" />
                            </span>
                            <div className="ms-2">
                              <p className="text-truncate fw-medium text-dark">Resume</p>
                            </div>
                          </div>
                          {displayData?.Resume ? (
                            <a
                              href={displayData.Resume}
                              className="btn btn-dark btn-icon btn-sm"
                              download
                            >
                              <i className="ti ti-download" />
                            </a>
                          ) : (
                            <span>N/A</span>
                          )}
                        </div>
                        <div className="bg-light-300 border rounded d-flex align-items-center justify-content-between p-2">
                          <div className="d-flex align-items-center overflow-hidden">
                            <span className="avatar avatar-md bg-white rounded flex-shrink-0 text-default">
                              <i className="ti ti-pdf fs-15" />
                            </span>
                            <div className="ms-2">
                              <p className="text-truncate fw-medium text-dark">Joining Letter</p>
                            </div>
                          </div>
                          {displayData?.joiningLetter ? (
                            <a
                              href={displayData.joiningLetter}
                              className="btn btn-dark btn-icon btn-sm"
                              download
                            >
                              <i className="ti ti-download" />
                            </a>
                          ) : (
                            <span>N/A</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Address */}
                  <div className="col-md-6 d-flex">
                    <div className="card flex-fill mb-4">
                      <div className="card-header">
                        <h5>Address</h5>
                      </div>
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                            <i className="ti ti-map-pin-up" />
                          </span>
                          <div>
                            <p className="text-dark fw-medium mb-1">Current Address</p>
                            <p>{displayData?.user?.address || "N/A"}</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                            <i className="ti ti-map-pins" />
                          </span>
                          <div>
                            <p className="text-dark fw-medium mb-1">Permanent Address</p>
                            <p>{displayData?.user?.permanentAddress || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Previous School Details */}
                  <div className="col-md-12">
                    <div className="card flex-fill mb-4">
                      <div className="card-header">
                        <h5>Previous School Details</h5>
                      </div>
                      <div className="card-body pb-1">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="mb-3">
                              <p className="mb-1 text-dark fw-medium">Previous School Name</p>
                              <p>{displayData?.previousSchool || "N/A"}</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <p className="mb-1 text-dark fw-medium">School Address</p>
                              <p>{displayData?.previousSchoolAddress || "N/A"}</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <p className="mb-1 text-dark fw-medium">Phone Number</p>
                              <p>{displayData?.previousSchoolPhone || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Bank Details */}
                  <div className="col-md-6 d-flex">
                    <div className="card flex-fill mb-4">
                      <div className="card-header">
                        <h5>Bank Details</h5>
                      </div>
                      <div className="card-body pb-1">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="mb-3">
                              <p className="mb-1 text-dark fw-medium">Bank Name</p>
                              <p>{displayData?.bankName || "N/A"}</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <p className="mb-1 text-dark fw-medium">Branch</p>
                              <p>{displayData?.branchName || "N/A"}</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <p className="mb-1 text-dark fw-medium">IFSC</p>
                              <p>{displayData?.ifscCode || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Work Details */}
                  <div className="col-md-6 d-flex">
                    <div className="card flex-fill mb-4">
                      <div className="card-header">
                        <h5>Work Details</h5>
                      </div>
                      <div className="card-body pb-1">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="mb-3">
                              <p className="mb-1 text-dark fw-medium">Contract Type</p>
                              <p>{displayData?.contractType || "N/A"}</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <p className="mb-1 text-dark fw-medium">Shift</p>
                              <p>{displayData?.shift || "N/A"}</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <p className="mb-1 text-dark fw-medium">Work Location</p>
                              <p>{displayData?.workLocation || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <TeacherModal />
    </>
  );
};

export default TeacherDetails;