import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import ReactApexChart from "react-apexcharts";
import useMobileDetection from "../../core/common/mobileDetection";
import StudentBreadcrumb from "../../pages/Admin/peoples/students/student-details/studentBreadcrumb";
import StudentModals from "../../pages/Admin/peoples/students/studentModals";
import { getParentsDashbord, getParentsStudent } from "../../services/parents/parentsApi";
import { ParentDashboardData, Student } from "../../services/types/parents/parentTypes";
import {
  StudentDetailsModal,
  AttendanceLeaveModal,
  FeesModal,
  TimetableModal,
  AssignmentsModal,
  NoticesModal,
  ExamResultsModal
} from './ParentQuickActionsModals';
import { Button, Modal } from "react-bootstrap";
import { Table as AntdTable, Button as AntdButton, Modal as AntdModal, Tooltip, Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';

const ParentDashboard = () => {
  const routes = all_routes;
  const [activeStudent, setActiveStudent] = useState<string>("");
  const [dashboardData, setDashboardData] = useState<ParentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMobileDetection();
  // Modal state
  const [modal, setModal] = useState<null | string>(null);
  const [noticeAttachment, setNoticeAttachment] = useState<{ show: boolean, url: string | null }>({ show: false, url: null });
  const [guardianStudents, setGuardianStudents] = useState<any>(null);
  const [detailsModal, setDetailsModal] = useState<{ type: 'student' | 'parent' | 'communication' | null, data: any }>({ type: null, data: null });

  // Chart configuration for attendance and performance
  const [statistic_chart] = useState<any>({
    chart: {
      type: "line",
      height: 345,
      toolbar: {
        show: false,
      },
    },
    series: [
      {
        name: "Attendance %",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: "Performance %",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + "%";
        },
      },
      shared: true,
      intersect: false,
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        left: -8,
      },
    },
    yaxis: {
      labels: {
        offsetX: -15,
      },
    },
    markers: {
      size: 0,
      colors: ["#3D5EE1", "#6FCCD8"],
      strokeColors: "#fff",
      strokeWidth: 1,
      hover: {
        size: 7,
      },
    },
    colors: ["#3D5EE1", "#6FCCD8"],
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardRes, studentsRes] = await Promise.all([
          getParentsDashbord(),
          getParentsStudent()
        ]);
        setGuardianStudents(studentsRes.data);
        if (!dashboardRes.data || !dashboardRes.data.students) {
          throw new Error("Invalid dashboard data format");
        }
        // Merge extra info from guardianStudents into dashboardData.students
        const guardianMap: Record<string, any> = {};
        (studentsRes.data.students || []).forEach((s: any) => {
          guardianMap[s.id] = s;
        });
        const mergedStudents = dashboardRes.data.students.map((student: any) => ({
          ...student,
          guardianInfo: guardianMap[student.studentId] || {},
        }));
        setDashboardData({ ...dashboardRes.data, students: mergedStudents });
        if (mergedStudents.length > 0) {
          setActiveStudent(mergedStudents[0].studentId);
        }
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
 
  const getActiveStudent = (): Student | null => {
    if (!dashboardData || !activeStudent) return null;
    return dashboardData.students.find(student => student.studentId === activeStudent) || null;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Consistent date formatting utility
  const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeString: string): string => {
    return new Date(timeString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Enhanced: Academic performance summary for each student
  const renderAcademicPerformance = (student: Student) => {
    if (!student.academicPerformance || !student.academicPerformance.averages.length) {
      return <span className="text-muted">No academic data available</span>;
    }
    return (
      <div className="table-responsive">
        <table className="table table-sm table-bordered mb-0">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Average</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {student.academicPerformance.averages.map((avg, idx) => (
              <tr key={idx}>
                <td>{avg.subject || '-'}</td>
                <td>{('average' in avg ? avg.average : avg.score) ?? '-'}</td>
                <td>{avg.grade || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Enhanced: Recent scores for each student
  const renderRecentScores = (student: Student) => {
    if (!student.academicPerformance || !student.academicPerformance.averages.length) return null;
   
    const scores = student.academicPerformance.averages.flatMap(avg => (avg as any).recentScores || []);
    if (!scores.length) return null;
    return (
      <div className="mt-2">
        <h6>Recent Scores</h6>
        <ul className="list-group list-group-flush">
          {scores.map((score: any, idx: number) => (
            <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{score.title} ({score.type})</span>
              <span className="badge bg-primary">{score.score}</span>
              <span className="text-muted small">{formatDate(score.date)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const refetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await getParentsDashbord();
      setDashboardData(response.data);
    } catch (err) {
      setError("Failed to reload dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
  return (
      <div className="page-wrapper">
      <div className="content">
          <div className="alert alert-danger m-3" role="alert">
            <i className="ti ti-alert-circle me-2"></i>
            {error}
          </div>
        </div>
                  </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="alert alert-warning m-3" role="alert">
            <i className="ti ti-info-circle me-2"></i>
            No dashboard data available
                            </div>
                          </div>
                        </div>
    );
  }

  if (dashboardData.students.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <StudentBreadcrumb />
          </div>
          <div className="row">
            <div className="col-xxl-3 col-xl-4">
              <div className="card">
                <div className="card-body text-center py-5">
                  <i className="ti ti-user-off fs-1 text-muted mb-3"></i>
                  <h5>No Students</h5>
                  <p className="text-muted">No students available</p>
                          </div>
                        </div>
                            </div>
            <div className="col-xxl-9 col-xl-8">
              <div className="card">
                <div className="card-body text-center py-5">
                  <i className="ti ti-user-off fs-1 text-muted mb-3"></i>
                  <h4>No Students Found</h4>
                  <p className="text-muted">
                    You don't have any students associated with your account yet.
                  </p>
                  <Link to="#" className="btn btn-primary">
                    <i className="ti ti-plus me-2"></i>
                    Add Student
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                            </div>
                          </div>
    );
  }

  const activeStudentData = getActiveStudent();

  return (
    <>
      {/* Page Wrapper */}
      <div className={isMobile ? "page-wrapper" : "p-3"}>
        <div className="content">
          <div className="row">
            <StudentBreadcrumb />
          </div>
          <div className="row mb-4">
            <div className="col-md-7 mb-3 mb-md-0">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="mb-0"><i className="ti ti-bell me-2"></i>School Communications</h5>
                        </div>
                <div className="card-body">
                  {/* Notices Table */}
                  <h6 className="mb-2"><i className="ti ti-bell me-1"></i>Notices</h6>
                  {(activeStudentData?.events?.notices?.length || 0) > 0 ? (
                    <AntdTable
                      columns={[
                        { title: 'Title', dataIndex: 'title', key: 'title', width: 180, ellipsis: true },
                        { title: 'Date', dataIndex: 'publishDate', key: 'publishDate', width: 120, render: (date, record) => new Date(date || record.date).toLocaleDateString() },
                        { title: 'Action', key: 'action', width: 120, render: (_, record) => (
                          <>
                            {record.attachment && (
                              <AntdButton size="small" type="primary" onClick={() => setNoticeAttachment({ show: true, url: record.attachment })}>View</AntdButton>
                            )}
                            <AntdButton size="small" className="ms-2" onClick={() => setDetailsModal({ type: 'communication', data: record })}>Details</AntdButton>
                          </>
                        ) },
                      ]}
                      dataSource={activeStudentData?.events?.notices || []}
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                      scroll={{ x: true, y: 320 }}
                      locale={{ emptyText: 'No notices for this student.' }}
                      size="small"
                      className="mb-4"
                    />
                  ) : (
                    <div className="text-center text-muted mb-4">No notices for this student.</div>
                  )}
                  {/* Events Table */}
                  <h6 className="mb-2"><i className="ti ti-calendar-event me-1"></i>Events</h6>
                  {(activeStudentData?.events?.events?.length || 0) > 0 ? (
                    <AntdTable
                      columns={[
                        { title: 'Title', dataIndex: 'title', key: 'title', width: 180, ellipsis: true },
                        { title: 'Date', dataIndex: 'publishDate', key: 'publishDate', width: 120, render: (date, record) => new Date(date || record.date).toLocaleDateString() },
                        { title: 'Action', key: 'action', width: 120, render: (_, record) => (
                          <AntdButton size="small" className="ms-2" onClick={() => setDetailsModal({ type: 'communication', data: record })}>Details</AntdButton>
                        ) },
                      ]}
                      dataSource={activeStudentData?.events?.events || []}
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                      scroll={{ x: true, y: 320 }}
                      locale={{ emptyText: 'No events for this student.' }}
                      size="small"
                    />
                  ) : (
                    <div className="text-center text-muted">No events for this student.</div>
                  )}
                          </div>
                        </div>
                            </div>
            <div className="col-md-5">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="mb-3">Parent Information</h5>
                  <div className="mb-2"><b>Name:</b> {dashboardData.parentName}</div>
                  <div className="mb-2"><b>Email:</b> {guardianStudents.guardianEmail}</div>
                  <div className="mb-2"><b>Children Enrolled:</b> {dashboardData.students.length}</div>
                          </div>
                        </div>
                      </div>
                    </div>

          {/* Children selector as cards/buttons */}
          {dashboardData.students.length > 1 && (
            <div className="mb-4">
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <span className="me-2 fw-semibold">Select Children:</span>
                {dashboardData.students.map((student) => (
                  <button
                    key={student.studentId}
                    className={`btn ${activeStudent === student.studentId ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center px-3 py-2 rounded-pill`}
                    onClick={() => setActiveStudent(student.studentId)}
                  >
                    <img
                      src={student.studentInfo.profilePic}
                      alt={student.studentInfo.name}
                      className="rounded-circle me-2"
                      width="28"
                      height="28"
                    />
                    {student.studentInfo.name}
                  </button>
                ))}
                            </div>
                          </div>
          )}

          {/* 6 Quick Action Cards in a grid */}
          <div className="row g-3 mb-4">
            {[
              { key: 'studentDetails', icon: 'ti ti-user', label: 'Student Details', color: 'primary' },
              { key: 'attendance', icon: 'ti ti-calendar-due', label: 'Attendance & Leave', color: 'warning' },
              { key: 'fees', icon: 'ti ti-report-money', label: 'Fees', color: 'success' },
              { key: 'timetable', icon: 'ti ti-calendar', label: 'Timetable', color: 'info' },
              { key: 'assignments', icon: 'ti ti-book', label: 'Assignments & Homework', color: 'secondary' },
              { key: 'notices', icon: 'ti ti-bell', label: 'Notices & Events', color: 'primary' },
              { key: 'examResults', icon: 'ti ti-award', label: 'Exam & Result', color: 'danger' },
            ].map(action => (
              <div className="col-6 col-md-3 col-lg-2" key={action.key}>
                <button
                  className={`btn btn-outline-${action.color} d-flex flex-column align-items-center p-3 rounded-4 shadow-sm border-0 w-100 h-100`}
                  style={{ minHeight: 120 }}
                  onClick={() => setModal(action.key)}
                >
                  <span className={`d-flex align-items-center justify-content-center rounded-circle bg-${action.color} mb-2`} style={{ width: 48, height: 48 }}>
                    <i className={`${action.icon} text-white fs-2`}></i>
                  </span>
                  <span className="fw-semibold text-center">{action.label}</span>
                </button>
              </div>
            ))}
                        </div>

          <div className="row">
            <div className="col-12">
              <div className="row">
                {/* Enhanced: Student Overview Card */}
                {activeStudentData && (
                  <div className="col-12 mb-4">
                    <div className="card shadow border-0">
                      <div className="card-body">
                        <div className="row align-items-center">
                          <div className="col-md-2 text-center mb-3 mb-md-0">
                            <img
                              src={activeStudentData?.studentInfo.profilePic}
                              alt={activeStudentData?.studentInfo.name}
                              className="rounded-circle border border-2"
                              width="80"
                              height="80"
                            />
                          </div>
                          <div className="col-md-10">
                            <h5 className="mb-1">{activeStudentData?.studentInfo.name} <span className="badge bg-info ms-2">{activeStudentData?.studentInfo.class}</span></h5>
                            <div className="d-flex flex-wrap gap-3 mb-2">
                              <span><strong>Roll No:</strong> {activeStudentData?.studentInfo.rollNo}</span>
                              <span><strong>School:</strong> {activeStudentData?.studentInfo.schoolName}</span>
                              <span><strong>Admission:</strong> {formatDate(activeStudentData?.studentInfo.admissionDate)}</span>
                        </div>
                            <div className="d-flex flex-wrap gap-3">
                              <span><strong>Email:</strong> {activeStudentData?.studentInfo.email}</span>
                              <span><strong>Phone:</strong> {activeStudentData?.studentInfo.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced: Academic Performance */}
                {activeStudentData && (
                  <div className="col-12 mb-4">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0"><i className="ti ti-bookmark me-2"></i>Academic Performance</h5>
                        <button
                          className="btn btn-sm btn-outline-primary rounded-circle ms-2"
                          title="View Academic Details"
                          onClick={() => setModal('studentDetails')}
                        >
                          <i className="ti ti-user"></i>
                        </button>
                  </div>
                  <div className="card-body">
                        {renderAcademicPerformance(activeStudentData)}
                        {renderRecentScores(activeStudentData)}
                      </div>
                    </div>
                        </div>
                )}

                {/* Quick Stats */}
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body text-center">
                      <div className="avatar avatar-lg bg-primary rounded-circle mx-auto mb-3">
                        <i className="ti ti-calendar-check text-white fs-2"></i>
                      </div>
                      <h4 className="mb-1">{activeStudentData?.attendance.percentage}%</h4>
                      <p className="text-muted mb-0">Attendance</p>
                      <small className="text-muted">
                        {activeStudentData?.attendance.presentDays} of {activeStudentData?.attendance.totalDays} days
                      </small>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body text-center">
                      <div className="avatar avatar-lg bg-success rounded-circle mx-auto mb-3">
                        <i className="ti ti-report-money text-white fs-2"></i>
                      </div>
                      <h4 className="mb-1">{formatCurrency(activeStudentData?.fees.totalPaid || 0)}</h4>
                      <p className="text-muted mb-0">Total Paid</p>
                      <small className="text-muted">
                        {activeStudentData?.fees.paymentHistory.length} payments
                      </small>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body text-center">
                      <div className="avatar avatar-lg bg-warning rounded-circle mx-auto mb-3">
                        <i className="ti ti-alert-circle text-white fs-2"></i>
                      </div>
                      <h4 className="mb-1">{formatCurrency(activeStudentData?.fees.totalPending || 0)}</h4>
                      <p className="text-muted mb-0">Pending Fees</p>
                      <small className="text-muted">
                        {activeStudentData?.fees.pendingFees.length} items
                      </small>
                    </div>
                  </div>
                </div>

                {/* Pending Fees */}
                {activeStudentData && activeStudentData.fees.pendingFees.length > 0 && (
                  <div className="col-12">
                    <div className="card border-warning">
                      <div className="card-header bg-warning text-white">
                        <h5 className="mb-0">
                          <i className="ti ti-alert-triangle me-2"></i>
                          Pending Fees
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th>Fee Category</th>
                                <th>Amount</th>
                                <th>Due Date</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeStudentData.fees.pendingFees.map((fee, index) => (
                                <tr key={index}>
                                  <td>{fee.feeCategory || fee.feeCategory}</td>
                                  <td>{formatCurrency(fee.amount || 0)}</td>
                                  <td>{fee.dueDate ? formatDate(fee.dueDate) : 'Not specified'}</td>
                                  <td>
                                    {fee.dueDate && (
                                      <Link to={routes.studentFees} className="btn btn-sm btn-primary">
                                        Pay Now
                                      </Link>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Payments */}
                {activeStudentData && activeStudentData.fees.paymentHistory.length > 0 && (
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="mb-0">
                          <i className="ti ti-receipt me-2"></i>
                          Recent Payments
                        </h5>
                </div>
                      <div className="card-body">
                        <div className="list-group list-group-flush">
                          {activeStudentData.fees.paymentHistory.slice(0, 5).map((payment, index) => (
                            <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                              <div>
                                <h6 className="mb-1">{payment.feeCategory}</h6>
                                <small className="text-muted">
                                  {formatDate(payment.date)} • {payment.method}
                                </small>
              </div>
                              <span className="badge bg-success rounded-pill">
                                {formatCurrency(payment.amount || 0)}
                              </span>
                  </div>
                          ))}
                        </div>
                      </div>
                    </div>
                        </div>
                )}

                {/* Notices */}
                {activeStudentData && activeStudentData.events.notices.length > 0 && (
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="mb-0">
                          <i className="ti ti-bell me-2"></i>
                          Recent Notices
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="list-group list-group-flush">
                          {(activeStudentData?.events?.notices || []).slice(0, 5).map((notice, index) => {
                            const title = typeof notice.title === 'string' ? notice.title : '';
                            const message = ('message' in notice && typeof notice.message === 'string') ? notice.message : (('content' in notice && typeof notice.content === 'string') ? notice.content : '');
                            const date = ('publishDate' in notice && typeof notice.publishDate === 'string') ? notice.publishDate : (('date' in notice && typeof notice.date === 'string') ? notice.date : '');
                            const hasAttachment = (notice as any).attachment && typeof (notice as any).attachment === 'string';
                            if (!title && !message && !date) return null;
                            return (
                              <div key={index} className="list-group-item list-group-item-action pointer" onClick={() => setDetailsModal({ type: 'communication', data: notice })}>
                                <h6 className="mb-1">{title}</h6>
                                <p className="mb-1 text-muted">{message}</p>
                                <small className="text-muted">{formatDate(date)}</small>
                                {hasAttachment && (
                                  <div className="mt-2">
                                    <Button
                                      size="sm"
                                      variant="info"
                                      onClick={e => { e.stopPropagation(); setNoticeAttachment({ show: true, url: (notice as any).attachment }); }}
                                    >
                                      View Attachment
                                    </Button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Events */}
                {activeStudentData && activeStudentData.events.events.length > 0 && (
                  <div className="col-md-6">
                    <div className="card">
                  <div className="card-header">
                        <h5 className="mb-0">
                          <i className="ti ti-calendar-event me-2"></i>
                          Recent Events
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="list-group list-group-flush">
                          {(activeStudentData?.events?.events || []).slice(0, 5).map((event, index) => {
                            const title = typeof event.title === 'string' ? event.title : '';
                            const message = ('message' in event && typeof event.message === 'string') ? event.message : (('content' in event && typeof event.content === 'string') ? event.content : '');
                            const date = ('publishDate' in event && typeof event.publishDate === 'string') ? event.publishDate : (('date' in event && typeof event.date === 'string') ? event.date : '');
                            return (
                              <div key={index} className="list-group-item list-group-item-action pointer" onClick={() => setDetailsModal({ type: 'communication', data: event })}>
                                <h6 className="mb-1">{title}</h6>
                                <p className="mb-1 text-muted">{message}</p>
                                <small className="text-muted">{formatDate(date)}</small>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timetable */}
                {activeStudentData && activeStudentData.timetable.length > 0 && (
                  <div className="col-12">
                <div className="card">
                  <div className="card-header">
                        <h5 className="mb-0">
                          <i className="ti ti-calendar me-2"></i>
                          Today's Schedule
                        </h5>
                  </div>
                  <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th>Time</th>
                                <th>Subject</th>
                                <th>Teacher</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeStudentData.timetable.map((entry, index) => (
                                <tr key={index}>
                                  <td>
                                    {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                                  </td>
                                  <td>{entry.subject}</td>
                                  <td>{entry.teacher}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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
    <StudentModals />

      {/* Modals */}
      {modal === 'studentDetails' && (
        <StudentDetailsModal show onHide={() => setModal(null)} studentId={activeStudentData?.studentId || ''} />
      )}
      {modal === 'attendance' && (
        <AttendanceLeaveModal show onHide={() => setModal(null)} studentId={activeStudentData?.studentId || ''} />
      )}
      {modal === 'fees' && (
        <FeesModal show={modal === 'fees'} onHide={() => setModal(null)} studentId={activeStudentData?.studentId || ''} refetchDashboard={refetchDashboard} />
      )}
      {modal === 'timetable' && (
        <TimetableModal show onHide={() => setModal(null)} studentId={activeStudentData?.studentId || ''} />
      )}
      {modal === 'assignments' && (
        <AssignmentsModal show onHide={() => setModal(null)} studentId={activeStudentData?.studentId || ''} />
      )}
      {modal === 'notices' && (
        <NoticesModal show={modal === 'notices'} onHide={() => setModal(null)} student={activeStudentData} />
      )}
      {modal === 'examResults' && (
        <ExamResultsModal show onHide={() => setModal(null)} studentId={activeStudentData?.studentId || ''} />
      )}

      {/* Notice Attachment Modal */}
      <Modal show={noticeAttachment.show} onHide={() => setNoticeAttachment({ show: false, url: null })} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Notice Attachment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {noticeAttachment.url && (noticeAttachment.url.endsWith('.pdf') ? (
            <iframe src={noticeAttachment.url} title="Attachment PDF" style={{ width: '100%', height: '70vh' }} />
          ) : (
            <img src={noticeAttachment.url} alt="Attachment" style={{ maxHeight: '70vh', maxWidth: '100%' }} />
          ))}
        </Modal.Body>
      </Modal>

      {/* Add a modal to show details for student, parent, or communication */}
      <AntdModal open={!!detailsModal.type} onCancel={() => setDetailsModal({ type: null, data: null })} footer={null} title={detailsModal.type === 'student' ? 'Student Details' : detailsModal.type === 'parent' ? 'Parent Details' : 'Communication Details'}>
        {detailsModal.type === 'student' && detailsModal.data && (
          <div>
            <p><b>Name:</b> {detailsModal.data.studentName}</p>
            <p><b>Admission No:</b> {detailsModal.data.admissionNo}</p>
            <p><b>Class:</b> {detailsModal.data.className}</p>
            <p><b>Roll No:</b> {detailsModal.data.rollNo}</p>
            <p><b>Date of Birth:</b> {detailsModal.data.dateOfBirth ? new Date(detailsModal.data.dateOfBirth).toLocaleDateString() : ''}</p>
            <p><b>Email:</b> {detailsModal.data.studentEmail}</p>
            <p><b>Phone:</b> {detailsModal.data.studentPhone}</p>
          </div>
        )}
        {detailsModal.type === 'parent' && detailsModal.data && (
          <>
            <p><b>Name:</b> {detailsModal.data.name}</p>
            <p><b>Email:</b> {detailsModal.data.email}</p>
            <p><b>Children Enrolled:</b> {detailsModal.data.children}</p>
            {guardianStudents && Array.isArray(guardianStudents.students) && guardianStudents.students.length > 0
              ? (
                <div className="mt-4">
                  <h5>Children Information</h5>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Admission No</th>
                          <th>Class</th>
                          <th>Roll No</th>
                          <th>Date of Birth</th>
                          <th>Email</th>
                          <th>Phone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {guardianStudents.students.map((child: any, idx: number) => (
                          <tr key={child.id || idx}>
                            <td>{child.studentName}</td>
                            <td>{child.admissionNo}</td>
                            <td>{child.className}</td>
                            <td>{child.rollNo}</td>
                            <td>{child.dateOfBirth ? new Date(child.dateOfBirth).toLocaleDateString() : ''}</td>
                            <td>{child.studentEmail}</td>
                            <td>{child.studentPhone}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
          </>
        )}
        {detailsModal.type === 'communication' && detailsModal.data && (
          <div>
            <p><b>Type:</b> {detailsModal.data.type}</p>
            <p><b>Title:</b> {detailsModal.data.title}</p>
            <p><b>Date:</b> {detailsModal.data.publishDate ? new Date(detailsModal.data.publishDate).toLocaleDateString() : (detailsModal.data.date ? new Date(detailsModal.data.date).toLocaleDateString() : '')}</p>
            <p><b>Message:</b> {detailsModal.data.message || detailsModal.data.content}</p>
            {detailsModal.data.attachment && (
              <div className="mt-2">
                <AntdButton size="small" type="primary" onClick={() => setNoticeAttachment({ show: true, url: detailsModal.data.attachment })}>View Attachment</AntdButton>
              </div>
            )}
          </div>
        )}
      </AntdModal>
  </>
  );
};

export default ParentDashboard;
