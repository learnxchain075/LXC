
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import ImageWithBasePath from "../../../../../core/common/imageWithBasePath";
// import { all_routes } from "../../../../../router/all_routes";

// import { TableData } from "../../../../../core/data/interface";
// import TeacherSidebar from "./teacherSidebar";
// import TeacherBreadcrumb from "./teacherBreadcrumb";
// import TeacherModal from "../teacherModal";
// import useMobileDetection from "../../../../../core/common/mobileDetection";
// import { getTeacherById } from "../../../../../services/admin/teacherRegistartion";
// import { useSelector } from "react-redux";
// import { Table } from "antd";
// // import { salarydata } from "../../../../core/data/json/salary";

// const TeacherSalary = ({teacherdata}:{teacherdata?:any}) => {
//   const routes = all_routes;
//   const ismobile = useMobileDetection();
//   const userobj = useSelector((state: any) => state.auth.userObj);
//   //const [teacherdata, setteacherdata] = useState<any>({});
//   const [loading, setLoading] = useState(false);

//   // const fetchTeacherDetails = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const response = await getTeacherById(localStorage.getItem("teacherId") ?? "");
//   //     if (response.status === 200) {
//   //       const teacherDetails = response.data;
//   //       console.log("Teacher Details:", teacherDetails);
//   //       setteacherdata(teacherDetails);
//   //       setLoading(false);
//   //     } else {
//   //       console.error("Failed to fetch teacher details");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching teacher details:", error);
//   //     setLoading(false);
//   //   }
//   // };

//   useEffect(() => {
//     // fetchTeacherDetails();
//   }, [userobj.role]);

//   // const data = salarydata;
//   const columns = [
//     {
//       title: "ID",
//       dataIndex: "id",
//       render: (text: string) => (
//         <Link to="#" className="link-primary">
//           {text}
//         </Link>
//       ),
//       sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
//     },
//     {
//       title: "Salary For",
//       dataIndex: "Salary_For",
//       sorter: (a: any, b: any) => a.Salary_For.length - b.Salary_For.length,
//     },
//     {
//       title: "Date",
//       dataIndex: "date",
//       sorter: (a: TableData, b: TableData) =>
//         parseFloat(a.date) - parseFloat(b.date),
//     },
//     {
//       title: "Payment Method",
//       dataIndex: "Payment_Method",
//       sorter: (a: any, b: any) =>
//         a.Payment_Method.length - b.Payment_Method.length,
//     },
//     {
//       title: "Net Salary",
//       dataIndex: "Net_Salary",
//       sorter: (a: any, b: any) => a.Net_Salary.length - b.Net_Salary.length,
//     },
//     {
//       title: " ",
//       dataIndex: "Net_Salary",
//       render: () => (
//         <>
//           <Link to="#" className="btn btn-light add-fee">
//             View Payslip
//           </Link>
//         </>
//       ),
//     },
//   ];

//   return (
//     <>
//       {/* Page Wrapper */}
//       {/* <div className={ismobile ? "page-wrapper" : "p-3"}> */}
      
//         <div className="content">
//           <div className="row">
//             {/* Page Header */}
//             {/* <TeacherBreadcrumb /> */}
//             {/* /Page Header */}
//           </div>
//           <div className="row">
//             {/* Student Information */}
//             {/* <TeacherSidebar /> */}
//             {/* /Student Information */}
//             <div className="col-12 d-flex flex-column">
//               <div className="row">
//                 <div className="col-md-12 ">
//                   {/* List */}
//                   {/* <ul className="nav nav-tabs nav-tabs-bottom mb-4">
//                     <li>
//                       <Link to={routes.teacherDetails} className="nav-link">
//                         <i className="ti ti-school me-2" />
//                         Teacher Details
//                       </Link>
//                     </li>
//                     <li>
//                       <Link to={routes.teachersRoutine} className="nav-link">
//                         <i className="ti ti-table-options me-2" />
//                         Routine
//                       </Link>
//                     </li>
//                     <li>
//                       <Link to={routes.teacherLeaves} className="nav-link">
//                         <i className="ti ti-calendar-due me-2" />
//                         Leave & Attendance
//                       </Link>
//                     </li>
//                     <li>
//                       <Link to={routes.teacherSalary} className="nav-link active">
//                         <i className="ti ti-report-money me-2" />
//                         Salary
//                       </Link>
//                     </li>
//                     <li>
//                       <Link to={routes.teacherLibrary} className="nav-link">
//                         <i className="ti ti-bookmark-edit me-2" />
//                         Library
//                       </Link>
//                     </li>
//                   </ul> */}
//                   {/* /List */}
//                   <div className="students-leaves-tab">
//                     <div className="row">
//                       <div className="col-md-6 col-xxl-3 d-flex">
//                         <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill bg-white">
//                           <div className="ms-2">
//                             <p className="mb-1">Monthly Net Salary</p>
//                             <h5>{teacherdata.salary ? `$${teacherdata.salary}` : "N/A"}</h5>
//                           </div>
//                           <span className="avatar avatar-lg bg-secondary-transparent rounded flex-shrink-0 text-secondary">
//                             <i className="ti ti-user-dollar fs-24" />
//                           </span>
//                         </div>
//                       </div>
//                       <div className="col-md-6 col-xxl-3 d-flex">
//                         <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill bg-white">
//                           <div className="ms-2">
//                             <p className="mb-1">Payment Date</p>
//                             <h5>{teacherdata.dateOfPayment ? new Date(teacherdata.dateOfPayment).toLocaleDateString() : "N/A"}</h5>
//                           </div>
//                           <span className="avatar avatar-lg bg-success-transparent rounded flex-shrink-0 text-success">
//                             <i className="ti ti-moneybag fs-24" />
//                           </span>
//                         </div>
//                       </div>
//                       <div className="col-md-6 col-xxl-3 d-flex">
//                         <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill bg-white">
//                           <div className="ms-2">
//                             <p className="mb-1">Total Amount</p>
//                             <h5>{teacherdata.totalAmount || "N/A"}</h5>
//                           </div>
//                           <span className="avatar avatar-lg bg-warning-transparent rounded flex-shrink-0 text-warning">
//                             <i className="ti ti-building-bank fs-24" />
//                           </span>
//                         </div>
//                       </div>
//                       <div className="col-md-6 col-xxl-3 d-flex">
//                         <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill bg-white">
//                           <div className="ms-2">
//                             <p className="mb-1">Account Number</p>
//                             <h5>{teacherdata.accountNumber || "N/A"}</h5>
//                           </div>
//                           <span className="avatar avatar-lg bg-info-transparent rounded flex-shrink-0 text-info">
//                             <i className="ti ti-credit-card fs-24" />
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="card">
//                       <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
//                         <h4 className="mb-3">Salary History</h4>
//                       </div>
//                       <div className="card-body p-0 py-3">
//                         {/* Payroll List */}
//                         {/* <Table
//                           // dataSource={data}
//                           columns={columns}
//                           Selection={true}
//                         /> */}
//                         <Table
//                           dataSource={[]}
//                           columns={columns}
//                           loading={loading}
//                         />
//                         {/* /Payroll List */}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* /Page Wrapper */}
//         <TeacherModal />
//     </>
//   );
// };

// export default TeacherSalary;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../../core/common/imageWithBasePath";
import { all_routes } from "../../../../../router/all_routes";
import { TableData } from "../../../../../core/data/interface";
import TeacherSidebar from "./teacherSidebar";
import TeacherBreadcrumb from "./teacherBreadcrumb";
import TeacherModal from "../teacherModal";
import useMobileDetection from "../../../../../core/common/mobileDetection";
import { getTeacherById } from "../../../../../services/admin/teacherRegistartion";
import { useSelector } from "react-redux";
import { Table } from "antd";
import { getPayrollsByTeacherId } from "../../../../../services/teacher/payrollService";
import { IPayroll } from "../../../../../services/types/teacher/IPayroll";

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

const TeacherSalary = () => {
  const routes = all_routes;
  const ismobile = useMobileDetection();
  const userobj = useSelector((state: any) => state.auth.userObj);
  const [loading, setLoading] = useState(false);
  const [localTeacherData, setLocalTeacherData] = useState<any>(null); // Added local state
  const [payrolls, setPayrolls] = useState<IPayroll[]>([]);

  // Added fetchTeacherDetails
  const fetchTeacherDetails = async () => {
    try {
      setLoading(true);
      const teacherId = localStorage.getItem("teacherId");
      
      const response = await getTeacherById(teacherId ?? "");
      
      if (response.status === 200) {
        const teacherDetails = response.data;
        setLocalTeacherData(teacherDetails);
      }
    } catch (error) {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const teacherId = localStorage.getItem("teacherId") || "";
      const res = await getPayrollsByTeacherId(teacherId);
      if (res.status === 200) {
        setPayrolls(res.data);
      }
    } catch (error) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherDetails();
    fetchPayrolls();
  }, [userobj.role]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: string) => (
        <Link to="#" className="link-primary">
          {text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },
    {
      title: "Salary For",
      dataIndex: "Salary_For",
      sorter: (a: any, b: any) => a.Salary_For.length - b.Salary_For.length,
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a: TableData, b: TableData) =>
        parseFloat(a.date) - parseFloat(b.date),
    },
    {
      title: "Payment Method",
      dataIndex: "Payment_Method",
      sorter: (a: any, b: any) =>
        a.Payment_Method.length - b.Payment_Method.length,
    },
    {
      title: "Net Salary",
      dataIndex: "Net_Salary",
      sorter: (a: any, b: any) => a.Net_Salary.length - b.Net_Salary.length,
    },
    {
      title: " ",
      dataIndex: "Net_Salary",
      render: () => (
        <>
          <Link to="#" className="btn btn-light add-fee">
            View Payslip
          </Link>
        </>
      ),
    },
  ];

  const payrollData = payrolls.map((p) => ({
    id: p.id,
    Salary_For: `${new Date(p.periodStart).toLocaleDateString()} - ${new Date(p.periodEnd).toLocaleDateString()}`,
    date: p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "-",
    Payment_Method: p.status,
    Net_Salary: p.netSalary,
  }));

  const SkeletonPlaceholder = ({ className = "" }) => (
    <span className={`placeholder bg-secondary ${className}`} />
  );

  return (
    <ErrorBoundary>
      <div className={ismobile ? "page-wrapper" : "p-3"}>
        <div className="content">
          <div className="row">
            {/* Page Header */}
            {/* <TeacherBreadcrumb /> */}
            {/* /Page Header */}
          </div>
          <div className="row">
            {/* Student Information */}
            {/* <TeacherSidebar /> */}
            {/* /Student Information */}
            <div className="col-12 d-flex flex-column">
              <div className="row">
                <div className="col-md-12">
                  {/* List */}
                  {/* <ul className="nav nav-tabs nav-tabs-bottom mb-4"> */}
                  {/* ... Navigation tabs ... */}
                  {/* </ul> */}
                  {/* /List */}
                  <div className="students-leaves-tab">
                    <div className="row">
                      {loading || !localTeacherData ? (
                      
                        Array(4)
                          .fill(0)
                          .map((_, index) => (
                            <div key={index} className="col-md-6 col-xxl-3 d-flex">
                              <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill bg-white placeholder-glow">
                                <div className="ms-2">
                                  <SkeletonPlaceholder
                                    className="col-6 mb-1"
                                    style={{ height: "1rem" }}
                                  />
                                  <SkeletonPlaceholder
                                    className="col-4"
                                    style={{ height: "1.5rem" }}
                                  />
                                </div>
                                <SkeletonPlaceholder
                                  className="avatar avatar-lg bg-secondary bg-opacity-10 rounded flex-shrink-0"
                                  style={{ width: "48px", height: "48px" }}
                                />
                              </div>
                            </div>
                          ))
                      ) : (
                        <>
                          <div className="col-md-6 col-xxl-3 d-flex">
                            <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill bg-white">
                              <div className="ms-2">
                                <p className="mb-1">Monthly Net Salary</p>
                                <h5>
                                  {localTeacherData.salary
                                    ? `$${localTeacherData.salary}`
                                    : "N/A"}
                                </h5>
                              </div>
                              <span className="avatar avatar-lg bg-secondary-transparent rounded flex-shrink-0 text-secondary">
                                <i className="ti ti-user-dollar fs-24" />
                              </span>
                            </div>
                          </div>
                          <div className="col-md-6 col-xxl-3 d-flex">
                            <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill bg-white">
                              <div className="ms-2">
                                <p className="mb-1">Payment Date</p>
                                <h5>
                                  {localTeacherData.dateOfPayment
                                    ? new Date(
                                        localTeacherData.dateOfPayment
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </h5>
                              </div>
                              <span className="avatar avatar-lg bg-success-transparent rounded flex-shrink-0 text-success">
                                <i className="ti ti-moneybag fs-24" />
                              </span>
                            </div>
                          </div>
                          <div className="col-md-6 col-xxl-3 d-flex">
                            <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill bg-white">
                              <div className="ms-2">
                                <p className="mb-1">Total Amount</p>
                                <h5>{localTeacherData.totalAmount || "N/A"}</h5>
                              </div>
                              <span className="avatar avatar-lg bg-warning-transparent rounded flex-shrink-0 text-warning">
                                <i className="ti ti-building-bank fs-24" />
                              </span>
                            </div>
                          </div>
                          <div className="col-md-6 col-xxl-3 d-flex">
                            <div className="d-flex align-items-center justify-content-between rounded border p-3 mb-3 flex-fill bg-white">
                              <div className="ms-2">
                                <p className="mb-1">Account Number</p>
                                <h5>{localTeacherData.accountNumber || "N/A"}</h5>
                              </div>
                              <span className="avatar avatar-lg bg-info-transparent rounded flex-shrink-0 text-info">
                                <i className="ti ti-credit-card fs-24" />
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="card">
                      <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                        <h4 className="mb-3">Salary History</h4>
                      </div>
                      <div className="card-body p-0 py-3">
                        {/* Payroll List */}
                        <Table
                          dataSource={payrollData}
                          columns={columns}
                          loading={loading}
                          rowKey="id"
                        />
                        {loading && (
                          <div className="placeholder-glow">
                            {Array(5)
                              .fill(0)
                              .map((_, index) => (
                                <div key={index} className="p-3 border-bottom">
                                  <SkeletonPlaceholder
                                    className="col-2 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                  <SkeletonPlaceholder
                                    className="col-3 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                  <SkeletonPlaceholder
                                    className="col-2 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                  <SkeletonPlaceholder
                                    className="col-2 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                  <SkeletonPlaceholder
                                    className="col-2 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                  <SkeletonPlaceholder
                                    className="col-2 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                </div>
                              ))}
                          </div>
                        )}
                        {/* /Payroll List */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TeacherModal />
      </div>
    </ErrorBoundary>
  );
};

export default TeacherSalary;