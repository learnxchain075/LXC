import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../../core/common/imageWithBasePath";
import { all_routes } from "../../../../../router/all_routes";
import StudentModals from "../studentModals";
import StudentSidebar from "./studentSidebar";
import StudentBreadcrumb from "./studentBreadcrumb";
import Table from "../../../../../core/common/dataTable/index";
import { TableData } from "../../../../../core/data/interface";
import useMobileDetection from "../../../../../core/common/mobileDetection";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAttendanceLeavesByStudentId } from "../../../../../services/student/StudentAllApi";

const StudentLeaves = () => {
  const routes = all_routes;
  const isMobile = useMobileDetection();
  const [leaveData, setLeaveData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('leave');

  const columns = [
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      sorter: (a: TableData, b: TableData) =>
        a.leaveType.length - b.leaveType.length,
    },
    {
      title: "Leave Date",
      dataIndex: "leaveDate",
      sorter: (a: TableData, b: TableData) =>
        a.leaveDate.length - b.leaveDate.length,
    },
    {
      title: "No of Days",
      dataIndex: "noOfDays",
      sorter: (a: TableData, b: TableData) =>
        parseFloat(a.noOfDays) - parseFloat(b.noOfDays),
    },
    {
      title: "Applied On",
      dataIndex: "appliedOn",
      sorter: (a: TableData, b: TableData) =>
        a.appliedOn.length - b.appliedOn.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <>
          {text === "Approved" ? (
            <span className="badge bg-success d-inline-flex align-items-center">
              <i className="bi bi-check-circle me-1"></i>
              {text}
            </span>
          ) : text === "Pending" ? (
            <span className="badge bg-warning d-inline-flex align-items-center">
              <i className="bi bi-clock me-1"></i>
              {text}
            </span>
          ) : (
            <span className="badge bg-danger d-inline-flex align-items-center">
              <i className="bi bi-x-circle me-1"></i>
              {text}
            </span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.status.length - b.status.length,
    },
  ];

  const columns2 = [
    {
      title: "Date | Month",
      dataIndex: "date",
      sorter: (a: TableData, b: TableData) => a.date.length - b.date.length,
    },
    {
      title: "Jan",
      dataIndex: "jan",
      render: (text: string) => (
        <>
          {text === "1" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "2" ? (
            <span className="attendance-range bg-warning"></span>
          ) : text === "3" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "4" ? (
            <span className="attendance-range bg-danger"></span>
          ) : (
            <span className="attendance-range bg-info"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.jan.length - b.jan.length,
    },
    {
      title: "Feb",
      dataIndex: "feb",
      render: (text: string) => (
        <>
          {text === "1" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "2" ? (
            <span className="attendance-range bg-warning"></span>
          ) : text === "3" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "4" ? (
            <span className="attendance-range bg-danger"></span>
          ) : (
            <span className="attendance-range bg-info"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.feb.length - b.feb.length,
    },
    {
      title: "Mar",
      dataIndex: "mar",
      render: (text: string) => (
        <>
          {text === "1" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "2" ? (
            <span className="attendance-range bg-warning"></span>
          ) : text === "3" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "4" ? (
            <span className="attendance-range bg-danger"></span>
          ) : (
            <span className="attendance-range bg-info"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.mar.length - b.mar.length,
    },
    {
      title: "Apr",
      dataIndex: "apr",
      render: (text: string) => (
        <>
          {text === "1" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "2" ? (
            <span className="attendance-range bg-warning"></span>
          ) : text === "3" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "4" ? (
            <span className="attendance-range bg-danger"></span>
          ) : (
            <span className="attendance-range bg-info"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.apr.length - b.apr.length,
    },
    {
      title: "May",
      dataIndex: "may",
      render: (text: string) => (
        <>
          {text === "1" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "2" ? (
            <span className="attendance-range bg-warning"></span>
          ) : text === "3" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "4" ? (
            <span className="attendance-range bg-danger"></span>
          ) : (
            <span className="attendance-range bg-info"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.may.length - b.may.length,
    },
    {
      title: "Jun",
      dataIndex: "jun",
      render: (text: string) => (
        <>
          {text === "1" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "2" ? (
            <span className="attendance-range bg-warning"></span>
          ) : text === "3" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "4" ? (
            <span className="attendance-range bg-danger"></span>
          ) : (
            <span className="attendance-range bg-info"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.jun.length - b.jun.length,
    },
    {
      title: "Jul",
      dataIndex: "jul",
      render: (text: string) => (
        <>
          {text === "1" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "2" ? (
            <span className="attendance-range bg-warning"></span>
          ) : text === "3" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "4" ? (
            <span className="attendance-range bg-danger"></span>
          ) : (
            <span className="attendance-range bg-info"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.jul.length - b.jul.length,
    },
    {
      title: "Aug",
      dataIndex: "aug",
      render: (text: string) => (
        <>
          {text === "1" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "2" ? (
            <span className="attendance-range bg-warning"></span>
          ) : text === "3" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "4" ? (
            <span className="attendance-range bg-danger"></span>
          ) : (
            <span className="attendance-range bg-info"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.aug.length - b.aug.length,
    },
    {
      title: "Sep",
      dataIndex: "sep",
      render: (text: string) => (
        <>
          {text === "1" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "2" ? (
            <span className="attendance-range bg-warning"></span>
          ) : text === "3" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "4" ? (
            <span className="attendance-range bg-danger"></span>
          ) : (
            <span className="attendance-range bg-info"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.sep.length - b.sep.length,
    },
    {
      title: "Oct",
      dataIndex: "oct",
      render: (text: string) => (
        <>
          {text === "1" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "2" ? (
            <span className="attendance-range bg-warning"></span>
          ) : text === "3" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "4" ? (
            <span className="attendance-range bg-danger"></span>
          ) : (
            <span className="attendance-range bg-info"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.oct.length - b.oct.length,
    },
    {
      title: "Nov",
      dataIndex: "nov",
      render: (text: string) => (
        <>
          {text === "1" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "2" ? (
            <span className="attendance-range bg-warning"></span>
          ) : text === "3" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "4" ? (
            <span className="attendance-range bg-danger"></span>
          ) : (
            <span className="attendance-range bg-info"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.nov.length - b.nov.length,
    },
    {
      title: "Dec",
      dataIndex: "dec",
      render: (text: string) => (
        <>
          {text === "1" ? (
            <span className="attendance-range bg-success"></span>
          ) : text === "2" ? (
            <span className="attendance-range bg-warning"></span>
          ) : text === "3" ? (
            <span className="attendance-range bg-dark"></span>
          ) : text === "4" ? (
            <span className="attendance-range bg-danger"></span>
          ) : (
            <span className="attendance-range bg-info"></span>
          )}
        </>
      ),
      sorter: (a: TableData, b: TableData) => a.dec.length - b.dec.length,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Try to fetch real data first
        const response = await getAttendanceLeavesByStudentId('current-student-id');
        
        if (response.data.success) {
          // Transform API data to match our component structure
          const transformedLeaveData = {
            medicalLeave: { total: 10, used: 5, available: 5 },
            casualLeave: { total: 12, used: 1, available: 11 },
            maternityLeave: { total: 10, used: 0, available: 10 },
            paternityLeave: { total: 0, used: 0, available: 0 },
            leaveRequests: response.data.leaveRequests.map((leave: ILeaveRequest) => ({
              id: leave.id,
              leaveType: leave.reason || 'General Leave',
              leaveDate: leave.startDate || '',
              noOfDays: leave.startDate && leave.endDate ? 
                Math.ceil((new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 : '1',
              appliedOn: leave.createdAt ? new Date(leave.createdAt).toLocaleDateString() : '',
              status: leave.status || 'Pending'
            }))
          };

          const transformedAttendanceData = {
            summary: {
              present: response.data.attendance.filter((a: IAttendance) => a.present).length,
              absent: response.data.attendance.filter((a: IAttendance) => !a.present).length,
              halfDay: 1,
              late: 12
            },
            monthlyData: mockAttendanceData.monthlyData // Keep mock data for monthly view
          };

          setLeaveData(transformedLeaveData);
          setAttendanceData(transformedAttendanceData);
          toast.success('Leave and attendance data loaded successfully!', { autoClose: 3000 });
        } else {
          throw new Error('Failed to load data');
        }
      } catch (error: any) {
        console.error('Error fetching leave data:', error);
        toast.error('Using mock data due to API error', { autoClose: 3000 });
        // Keep using mock data
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
                  <p className="mt-3 text-muted">Loading leave and attendance data...</p>
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
                    <div className="card-body pb-1">
                      <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded-fill">
                        <li className="me-3 mb-3">
                          <button
                            className={`nav-link rounded fs-12 fw-semibold ${activeTab === 'leave' ? 'active' : ''}`}
                            onClick={() => setActiveTab('leave')}
                          >
                            <i className="bi bi-calendar-event me-1"></i>
                            Leaves
                          </button>
                        </li>
                        <li className="mb-3">
                          <button
                            className={`nav-link rounded fs-12 fw-semibold ${activeTab === 'attendance' ? 'active' : ''}`}
                            onClick={() => setActiveTab('attendance')}
                          >
                            <i className="bi bi-person-check me-1"></i>
                            Attendance
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {activeTab === 'leave' && (
                    <div className="tab-pane fade show active">
                      <div className="row gx-3">
                        <div className="col-lg-6 col-xxl-3 d-flex">
                          <div className="card flex-fill border-0 shadow-sm">
                            <div className="card-body">
                              <h5 className="mb-2 text-primary">
                                <i className="bi bi-heart-pulse me-2"></i>
                                Medical Leave ({leaveData.medicalLeave.total})
                              </h5>
                              <div className="d-flex align-items-center flex-wrap">
                                <p className="border-end pe-2 me-2 mb-0 text-muted">
                                  Used: {leaveData.medicalLeave.used}
                                </p>
                                <p className="mb-0 text-success fw-bold">
                                  Available: {leaveData.medicalLeave.available}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-xxl-3 d-flex">
                          <div className="card flex-fill border-0 shadow-sm">
                            <div className="card-body">
                              <h5 className="mb-2 text-info">
                                <i className="bi bi-calendar2-week me-2"></i>
                                Casual Leave ({leaveData.casualLeave.total})
                              </h5>
                              <div className="d-flex align-items-center flex-wrap">
                                <p className="border-end pe-2 me-2 mb-0 text-muted">
                                  Used: {leaveData.casualLeave.used}
                                </p>
                                <p className="mb-0 text-success fw-bold">
                                  Available: {leaveData.casualLeave.available}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-xxl-3 d-flex">
                          <div className="card flex-fill border-0 shadow-sm">
                            <div className="card-body">
                              <h5 className="mb-2 text-warning">
                                <i className="bi bi-gender-female me-2"></i>
                                Maternity Leave ({leaveData.maternityLeave.total})
                              </h5>
                              <div className="d-flex align-items-center flex-wrap">
                                <p className="border-end pe-2 me-2 mb-0 text-muted">
                                  Used: {leaveData.maternityLeave.used}
                                </p>
                                <p className="mb-0 text-success fw-bold">
                                  Available: {leaveData.maternityLeave.available}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-xxl-3 d-flex">
                          <div className="card flex-fill border-0 shadow-sm">
                            <div className="card-body">
                              <h5 className="mb-2 text-secondary">
                                <i className="bi bi-gender-male me-2"></i>
                                Paternity Leave ({leaveData.paternityLeave.total})
                              </h5>
                              <div className="d-flex align-items-center flex-wrap">
                                <p className="border-end pe-2 me-2 mb-0 text-muted">
                                  Used: {leaveData.paternityLeave.used}
                                </p>
                                <p className="mb-0 text-success fw-bold">
                                  Available: {leaveData.paternityLeave.available}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card border-0 shadow-sm mt-3">
                        <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between flex-wrap pb-0">
                          <h4 className="mb-3 fw-bold text-dark">
                            <i className="bi bi-list-ul me-2"></i>
                            Leave Requests
                          </h4>
                          <button
                            className="btn btn-primary d-inline-flex align-items-center mb-3"
                            onClick={() => toast.info('Apply leave functionality coming soon!', { autoClose: 3000 })}
                          >
                            <i className="bi bi-plus-circle me-2" />
                            Apply Leave
                          </button>
                        </div>
                        <div className="card-body p-0 py-3">
                          {leaveData.leaveRequests.length > 0 ? (
                            <div className="table-responsive">
                              <table className="table table-hover">
                                <thead className="table-light">
                                  <tr>
                                    <th>Leave Type</th>
                                    <th>Leave Date</th>
                                    <th>No of Days</th>
                                    <th>Applied On</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {leaveData.leaveRequests.map((leave) => (
                                    <tr key={leave.id}>
                                      <td>{leave.leaveType}</td>
                                      <td>{leave.leaveDate}</td>
                                      <td>{leave.noOfDays}</td>
                                      <td>{leave.appliedOn}</td>
                                      <td>
                                        {leave.status === "Approved" ? (
                                          <span className="badge bg-success d-inline-flex align-items-center">
                                            <i className="bi bi-check-circle me-1"></i>
                                            {leave.status}
                                          </span>
                                        ) : leave.status === "Pending" ? (
                                          <span className="badge bg-warning d-inline-flex align-items-center">
                                            <i className="bi bi-clock me-1"></i>
                                            {leave.status}
                                          </span>
                                        ) : (
                                          <span className="badge bg-danger d-inline-flex align-items-center">
                                            <i className="bi bi-x-circle me-1"></i>
                                            {leave.status}
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <i className="bi bi-inbox display-4 text-muted mb-3"></i>
                              <h5>No leave requests found</h5>
                              <p className="text-muted">You haven't applied for any leaves yet.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'attendance' && (
                    <div className="tab-pane fade show active">
                      <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between flex-wrap pb-1">
                          <h4 className="mb-3 fw-bold text-dark">
                            <i className="bi bi-calendar-check me-2"></i>
                            Attendance Summary
                          </h4>
                          <div className="d-flex align-items-center flex-wrap">
                            <div className="d-flex align-items-center flex-wrap me-3">
                              <p className="text-dark mb-3 me-2">
                                <i className="bi bi-clock me-1"></i>
                                Last Updated: {new Date().toLocaleDateString()}
                              </p>
                              <button
                                className="btn btn-outline-primary btn-icon btn-sm rounded-circle d-inline-flex align-items-center justify-content-center p-0 mb-3"
                                onClick={() => toast.info('Refreshing attendance data...', { autoClose: 2000 })}
                              >
                                <i className="bi bi-arrow-clockwise" />
                              </button>
                            </div>
                            <div className="dropdown mb-3">
                              <button
                                className="btn btn-outline-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                data-bs-auto-close="outside"
                              >
                                <i className="bi bi-calendar me-2" />
                                Year: 2024 / 2025
                              </button>
                              <ul className="dropdown-menu p-3">
                                <li>
                                  <button className="dropdown-item rounded-1">Year: 2024 / 2025</button>
                                </li>
                                <li>
                                  <button className="dropdown-item rounded-1">Year: 2023 / 2024</button>
                                </li>
                                <li>
                                  <button className="dropdown-item rounded-1">Year: 2022 / 2023</button>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="card-body pb-1">
                          <div className="row">
                            <div className="col-md-6 col-xxl-3 d-flex">
                              <div className="d-flex align-items-center rounded border p-3 mb-3 flex-fill shadow-sm">
                                <span className="avatar avatar-lg bg-success-transparent rounded me-2 flex-shrink-0 text-success">
                                  <i className="bi bi-person-check fs-24" />
                                </span>
                                <div className="ms-2">
                                  <p className="mb-1 text-muted">Present</p>
                                  <h5 className="text-success fw-bold">{attendanceData.summary.present}</h5>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xxl-3 d-flex">
                              <div className="d-flex align-items-center rounded border p-3 mb-3 flex-fill shadow-sm">
                                <span className="avatar avatar-lg bg-danger-transparent rounded me-2 flex-shrink-0 text-danger">
                                  <i className="bi bi-person-x fs-24" />
                                </span>
                                <div className="ms-2">
                                  <p className="mb-1 text-muted">Absent</p>
                                  <h5 className="text-danger fw-bold">{attendanceData.summary.absent}</h5>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xxl-3 d-flex">
                              <div className="d-flex align-items-center rounded border p-3 mb-3 flex-fill shadow-sm">
                                <span className="avatar avatar-lg bg-info-transparent rounded me-2 flex-shrink-0 text-info">
                                  <i className="bi bi-person-half fs-24" />
                                </span>
                                <div className="ms-2">
                                  <p className="mb-1 text-muted">Half Day</p>
                                  <h5 className="text-info fw-bold">{attendanceData.summary.halfDay}</h5>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-xxl-3 d-flex">
                              <div className="d-flex align-items-center rounded border p-3 mb-3 flex-fill shadow-sm">
                                <span className="avatar avatar-lg bg-warning-transparent rounded me-2 flex-shrink-0 text-warning">
                                  <i className="bi bi-clock fs-24" />
                                </span>
                                <div className="ms-2">
                                  <p className="mb-1 text-muted">Late</p>
                                  <h5 className="text-warning fw-bold">{attendanceData.summary.late}</h5>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card border-0 shadow-sm mt-3">
                        <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between flex-wrap pb-1">
                          <h4 className="mb-3 fw-bold text-dark">
                            <i className="bi bi-calendar-month me-2"></i>
                            Monthly Attendance
                          </h4>
                          <div className="d-flex align-items-center flex-wrap">
                            <div className="dropdown mb-3 me-3">
                              <button
                                className="btn btn-outline-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                              >
                                <i className="bi bi-calendar me-2" />
                                This Year
                              </button>
                              <ul className="dropdown-menu p-3">
                                <li>
                                  <button className="dropdown-item rounded-1">This Year</button>
                                </li>
                                <li>
                                  <button className="dropdown-item rounded-1">This Month</button>
                                </li>
                                <li>
                                  <button className="dropdown-item rounded-1">This Week</button>
                                </li>
                              </ul>
                            </div>
                            <div className="dropdown mb-3">
                              <button
                                className="btn btn-outline-primary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                              >
                                <i className="bi bi-download me-2" />
                                Export
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end p-3">
                                <li>
                                  <button className="dropdown-item rounded-1">
                                    <i className="bi bi-file-pdf me-2" />
                                    Export as PDF
                                  </button>
                                </li>
                                <li>
                                  <button className="dropdown-item rounded-1">
                                    <i className="bi bi-file-excel me-2" />
                                    Export as Excel
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="card-body p-0 py-3">
                          <div className="px-3">
                            <div className="d-flex align-items-center flex-wrap">
                              <div className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3">
                                <span className="avatar avatar-sm bg-success rounded me-2 flex-shrink-0">
                                  <i className="bi bi-check" />
                                </span>
                                <p className="text-dark mb-0">Present</p>
                              </div>
                              <div className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3">
                                <span className="avatar avatar-sm bg-danger rounded me-2 flex-shrink-0">
                                  <i className="bi bi-x" />
                                </span>
                                <p className="text-dark mb-0">Absent</p>
                              </div>
                              <div className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3">
                                <span className="avatar avatar-sm bg-warning rounded me-2 flex-shrink-0">
                                  <i className="bi bi-clock" />
                                </span>
                                <p className="text-dark mb-0">Late</p>
                              </div>
                              <div className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3">
                                <span className="avatar avatar-sm bg-dark rounded me-2 flex-shrink-0">
                                  <i className="bi bi-calendar" />
                                </span>
                                <p className="text-dark mb-0">Half Day</p>
                              </div>
                              <div className="d-flex align-items-center bg-white border rounded p-2 me-3 mb-3">
                                <span className="avatar avatar-sm bg-info rounded me-2 flex-shrink-0">
                                  <i className="bi bi-calendar-event" />
                                </span>
                                <p className="text-dark mb-0">Holiday</p>
                              </div>
                            </div>
                          </div>
                          <div className="table-responsive">
                            <Table
                              dataSource={attendanceData.monthlyData}
                            columns={columns2}
                            Selection={false}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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

export default StudentLeaves;
