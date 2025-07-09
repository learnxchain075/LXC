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
  ExamResultsModal,
  AddTicketModal,
  ContactModal,
} from "./ParentQuickActionsModals";
import { Button, Modal } from "react-bootstrap";
import { Table as AntdTable, Button as AntdButton, Modal as AntdModal, Tooltip, Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { setStudentId, getStudentId } from "../../utils/general";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from "react-redux";
import { setDataTheme } from "../../Store/themeSettingSlice";
import { isLogout } from "../../Store/authSlice";

const ParentDashboard = () => {
  const routes = all_routes;
  const dispatch = useDispatch();
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const [activeStudent, setActiveStudent] = useState<string>("");
  const [dashboardData, setDashboardData] = useState<ParentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMobileDetection();
  const handleThemeToggle = () => {
    dispatch(
      dataTheme === "default_data_theme"
        ? setDataTheme("dark_data_theme")
        : setDataTheme("default_data_theme")
    );
  };
  const [noticeAttachment, setNoticeAttachment] = useState<{ show: boolean, url: string | null }>({ show: false, url: null });
  const [guardianStudents, setGuardianStudents] = useState<any>(null);
  const [detailsModal, setDetailsModal] = useState<{ type: 'student' | 'parent' | 'communication' | null, data: any }>({ type: null, data: null });
  
  const [studentDetailsModal, setStudentDetailsModal] = useState<{ show: boolean, studentId: string }>({ show: false, studentId: '' });
  const [attendanceModal, setAttendanceModal] = useState<{ show: boolean, studentId: string }>({ show: false, studentId: '' });
  const [feesModal, setFeesModal] = useState<{ show: boolean, studentId: string }>({ show: false, studentId: '' });
  const [timetableModal, setTimetableModal] = useState<{ show: boolean, studentId: string }>({ show: false, studentId: '' });
  const [assignmentsModal, setAssignmentsModal] = useState<{ show: boolean, studentId: string }>({ show: false, studentId: '' });
  const [noticesModal, setNoticesModal] = useState<{ show: boolean, studentId: string | null }>({ show: false, studentId: null });
  const [examResultsModal, setExamResultsModal] = useState<{ show: boolean, studentId: string }>({ show: false, studentId: '' });
  const [addTicketModal, setAddTicketModal] = useState<{ show: boolean, studentId: string }>({ show: false, studentId: '' });
  const [contactModal, setContactModal] = useState<{ show: boolean, studentId: string }>({ show: false, studentId: '' });

  // Dynamic chart data based on actual student data
  const getChartData = (studentData: Student | null) => {
    if (!studentData) {
      return {
        attendance: [],
        performance: []
      };
    }

    // Get attendance data if available
    const attendanceData = studentData.attendance?.recentRecords || [];
    const attendanceSeries = attendanceData.length > 0 
      ? attendanceData.map((record: any) => record.present ? 100 : 0)
      : [];

    // Get performance data if available
    const performanceData = studentData.academicPerformance?.averages || [];
    const performanceSeries = performanceData.length > 0
      ? performanceData.map((avg: any) => avg.average || avg.score || 0)
      : [];

    return {
      attendance: attendanceSeries,
      performance: performanceSeries
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardRes = await getParentsDashbord();
        
        if (!dashboardRes.data || !dashboardRes.data.students) {
          throw new Error("Invalid dashboard data format");
        }
        
        // Set the dashboard data directly from the API response
        setDashboardData(dashboardRes.data);
        
        // Set guardian students data if available
        if (dashboardRes.data.students && dashboardRes.data.students.length > 0) {
          setGuardianStudents({
            guardianEmail: dashboardRes.data.parentName, // Use parent name as email placeholder
            students: dashboardRes.data.students.map((student: any) => ({
              id: student.studentId,
              studentName: student.studentInfo?.name || 'Unknown',
              admissionNo: student.studentInfo?.rollNo || 'N/A',
              className: student.studentInfo?.class || 'N/A',
              rollNo: student.studentInfo?.rollNo || 'N/A',
              dateOfBirth: student.studentInfo?.admissionDate || null,
              studentEmail: student.studentInfo?.email || 'N/A',
              studentPhone: student.studentInfo?.phone || 'N/A'
            }))
          });
        }
        
        // Set the first student as active if available
        if (dashboardRes.data.students && dashboardRes.data.students.length > 0) {
          const firstStudent = dashboardRes.data.students[0];
          setActiveStudent(firstStudent.studentId);
          setStudentId(firstStudent.studentId);
        } else {
          setActiveStudent("");
          setStudentId("");
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (activeStudent) {
      setStudentId(activeStudent);
      localStorage.removeItem('cachedFeesData');
      localStorage.removeItem('cachedAttendanceData');
      localStorage.removeItem('cachedTimetableData');
    } else {
      setStudentId("");
    }
  }, [activeStudent]);
  useEffect(() => {
    const handleOpenParentModal = (event: CustomEvent) => {
      const { modalType, studentId } = event.detail;
      
      switch (modalType) {
        case 'studentDetails':
          setStudentDetailsModal({ show: true, studentId });
          break;
        case 'attendance':
          setAttendanceModal({ show: true, studentId });
          break;
        case 'fees':
          setFeesModal({ show: true, studentId });
          break;
        case 'timetable':
          setTimetableModal({ show: true, studentId });
          break;
        case 'assignments':
          setAssignmentsModal({ show: true, studentId });
          break;
        case 'notices':
          setNoticesModal({ show: true, studentId });
          break;
        case 'examResults':
          setExamResultsModal({ show: true, studentId });
          break;
        case 'addTicket':
          setAddTicketModal({ show: true, studentId: '' }); // Parent action, no student required
          break;
        case 'contact':
          setContactModal({ show: true, studentId: '' }); // Parent action, no student required
          break;
        default:
          break;
      }
    };

    const handleShowToast = (event: CustomEvent) => {
      const { type, message } = event.detail;
      if (type === 'error') {
        toast.error(message);
      } else if (type === 'success') {
        toast.success(message);
      } else if (type === 'warning') {
        toast.warning(message);
      } else {
        toast.info(message);
      }
    };

    window.addEventListener('openParentModal', handleOpenParentModal as EventListener);
    window.addEventListener('showToast', handleShowToast as EventListener);

    return () => {
      window.removeEventListener('openParentModal', handleOpenParentModal as EventListener);
      window.removeEventListener('showToast', handleShowToast as EventListener);
    };
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

  const renderAcademicPerformance = (student: Student) => {
    if (!student.academicPerformance || !student.academicPerformance.averages || student.academicPerformance.averages.length === 0) {
      return <span className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>No academic data available</span>;
    }
    
    const academicColumns = [
      { 
        title: 'Subject', 
        dataIndex: 'subject', 
        key: 'subject', 
        ellipsis: true,
        render: (text: string) => <span className={dataTheme === "dark_data_theme" ? "text-white" : ""}>{text}</span>
      },
      { 
        title: 'Average', 
        dataIndex: 'average', 
        key: 'average',
        render: (text: string) => <span className={dataTheme === "dark_data_theme" ? "text-white" : ""}>{text}</span>
      },
      { 
        title: 'Grade', 
        dataIndex: 'grade', 
        key: 'grade',
        render: (text: string) => <span className={dataTheme === "dark_data_theme" ? "text-white" : ""}>{text}</span>
      },
    ];

    const academicData = student.academicPerformance.averages.map((avg: any, idx) => ({
      key: idx,
      subject: avg.subject || '-',
      average: avg.average || avg.score || '-',
      grade: avg.grade || '-',
    }));

    return (
      <AntdTable
        columns={academicColumns}
        dataSource={academicData}
        pagination={false}
        size="small"
        scroll={{ x: true }}
        locale={{ emptyText: 'No academic data available' }}
        className={dataTheme === "dark_data_theme" ? "dark-table" : ""}
      />
    );
  };

  const renderRecentScores = (student: Student) => {
    if (!student.academicPerformance || !student.academicPerformance.averages.length) return null;
   
    const scores = student.academicPerformance.averages.flatMap(avg => (avg as any).recentScores || []);
    if (!scores.length) return null;
    return (
      <div className="mt-2">
        <h6 className={`${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>Recent Scores</h6>
        <ul className={`list-group list-group-flush ${dataTheme === "dark_data_theme" ? "dark-list-group" : ""}`}>
          {scores.map((score: any, idx: number) => (
            <li key={idx} className={`list-group-item d-flex justify-content-between align-items-center ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary text-white" : ""}`}>
              <span className={dataTheme === "dark_data_theme" ? "text-white" : ""}>{score.title} ({score.type})</span>
              <span className="badge bg-primary">{score.score}</span>
              <span className={`small ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>{formatDate(score.date)}</span>
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
      <ToastContainer position="top-center" autoClose={3000} />

      <div className={`${isMobile ? "page-wrapper" : "p-3"} ${dataTheme === "dark_data_theme" ? "dark-mode" : ""}`}>
        <div className="content">
          <div className={`d-flex align-items-center justify-content-between rounded shadow-sm p-3 mb-4 ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-dark" : "bg-white"} ${dataTheme === "dark_data_theme" ? "border-secondary" : ""}`} style={{borderLeft: '6px solid #667eea'}}>
            <div className="d-flex align-items-center">
              <img src="/assets/img/logo.svg" alt="LearnXChain" style={{width: 48, height: 48, marginRight: 16}} />
              <div>
                <h4 className={`mb-1 fw-bold ${dataTheme === "dark_data_theme" ? "text-white" : ""}`} style={{color: '#667eea'}}>Welcome, {dashboardData?.parentName?.split(' ')[0] || 'Parent'}!</h4>
                <div className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"} small`}>Empowering your child's learning journey with <b>LearnXChain</b></div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
                <div className="d-none d-md-block text-end">
                <span className={`badge ${dataTheme === "dark_data_theme" ? "bg-light text-dark" : "bg-primary"} btn-sm`}>
                  Today: {new Date().toLocaleDateString('en-US', {weekday: 'long', month: 'short', day: 'numeric'})}
                </span>
              </div>
              <button
                onClick={handleThemeToggle}
                className={`btn btn-outline-${dataTheme === "dark_data_theme" ? "light" : "secondary"} btn`}
                title="Toggle Theme"
              >
                <i className={dataTheme === "default_data_theme" ? "ti ti-moon" : "ti ti-brightness-up"} />
              </button>
           {!isMobile && (
            <Link
              to={"/"}
              onClick={() => dispatch(isLogout())}
              className="btn btn-primary d-flex align-items-center"
            >
              <i className="ti ti-logout me-2" />
              Logout
            </Link>
          )}
            </div>
          </div>
          {/* <div className="row">
           // <StudentBreadcrumb />
          </div> */}
          <div className="row mb-4">
            <div className="col-lg-8 col-md-7 mb-3 mb-md-0">
              <div className={`card h-100 ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                <div className={`card-header ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : ""}`}>
                  <h5 className={`mb-0 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}><i className="ti ti-bell me-2"></i>School Communications</h5>
                        </div>
                <div className={`card-body ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                  {/* Communications Table */}
                  <h6 className={`mb-2 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}><i className="ti ti-message-circle me-1"></i>Communications</h6>
                  {(activeStudentData?.communication?.length || 0) > 0 ? (
                    <AntdTable
                      className={`${dataTheme === "dark_data_theme" ? "dark-table" : ""} mb-4`}
                      columns={[
                        { title: 'Title', dataIndex: 'title', key: 'title', ellipsis: true, responsive: ['md'] },
                        { title: 'Date', dataIndex: 'publishDate', key: 'publishDate', width: 120, render: (date, record) => new Date(date || record.date).toLocaleDateString(), responsive: ['md'] },
                        { title: 'Message', dataIndex: 'message', key: 'message', ellipsis: true, responsive: ['md'] },
                        { title: 'Action', key: 'action', width: 120, render: (_, record: any) => (
                          <div className="d-flex gap-1 flex-wrap">
                            {record.attachment && (
                              <AntdButton size="small" type="primary" onClick={() => setNoticeAttachment({ show: true, url: record.attachment })}>View</AntdButton>
                            )}
                            <AntdButton size="small" onClick={() => setDetailsModal({ type: 'communication', data: record })}>Details</AntdButton>
                          </div>
                        ) },
                      ]}
                      dataSource={activeStudentData?.communication || []}
                      rowKey="id"
                      pagination={{ pageSize: 5, size: 'small' }}
                      scroll={{ x: true, y: 250 }}
                      locale={{ emptyText: 'No communications for this student.' }}
                      size="small"
                    />
                  ) : (
                    <div className={`text-center ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"} mb-4`}>No communications for this student.</div>
                  )}
                          
                  {/* Notices Table */}
                          {(activeStudentData?.events?.notices?.length || 0) > 0 && (
                            <>
                  <h6 className={`mb-2 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}><i className="ti ti-bell me-1"></i>Notices</h6>
                    <AntdTable
                      className={`${dataTheme === "dark_data_theme" ? "dark-table" : ""} mb-4`}
                      columns={[
                        { title: 'Title', dataIndex: 'title', key: 'title', ellipsis: true, responsive: ['md'] },
                                  { title: 'Date', dataIndex: 'publishDate', key: 'publishDate', width: 120, render: (date, record: any) => new Date(date || record.publishDate || record.noticeDate || '').toLocaleDateString(), responsive: ['md'] },
                        { title: 'Action', key: 'action', width: 120, render: (_, record: any) => (
                          <div className="d-flex gap-1 flex-wrap">
                            {record.attachment && (
                              <AntdButton size="small" type="primary" onClick={() => setNoticeAttachment({ show: true, url: record.attachment })}>View</AntdButton>
                            )}
                            <AntdButton size="small" onClick={() => setDetailsModal({ type: 'communication', data: record })}>Details</AntdButton>
                          </div>
                        ) },
                      ]}
                      dataSource={activeStudentData?.events?.notices || []}
                      rowKey="id"
                      pagination={{ pageSize: 5, size: 'small' }}
                      scroll={{ x: true, y: 250 }}
                      locale={{ emptyText: 'No notices for this student.' }}
                      size="small"
                    />
                            </>
                  )}
                          
                  {/* Events Table */}
                          {(activeStudentData?.events?.events?.length || 0) > 0 && (
                            <>
                  <h6 className={`mb-2 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}><i className="ti ti-calendar-event me-1"></i>Events</h6>
                    <AntdTable
                      className={dataTheme === "dark_data_theme" ? "dark-table" : ""}
                      columns={[
                                  { title: 'Name', dataIndex: 'name', key: 'name', ellipsis: true, responsive: ['md'] },
                                  { title: 'Date', dataIndex: 'date', key: 'date', width: 120, render: (date, record: any) => new Date(date || '').toLocaleDateString(), responsive: ['md'] },
                        { title: 'Action', key: 'action', width: 120, render: (_, record) => (
                          <AntdButton size="small" onClick={() => setDetailsModal({ type: 'communication', data: record })}>Details</AntdButton>
                        ) },
                      ]}
                      dataSource={activeStudentData?.events?.events || []}
                      rowKey="id"
                      pagination={{ pageSize: 5, size: 'small' }}
                      scroll={{ x: true, y: 250 }}
                      locale={{ emptyText: 'No events for this student.' }}
                      size="small"
                    />
                            </>
                          )}
                          
                          {/* No notices or events message */}
                          {(!activeStudentData?.events?.notices?.length && !activeStudentData?.events?.events?.length) && (
                            <div className={`text-center py-4 ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                              <i className="ti ti-bell-off fs-1 mb-3"></i>
                              <p>No notices or events available for this student.</p>
                              <small>Check back later for updates.</small>
                            </div>
                          )}
                          </div>
                        </div>
                            </div>
            <div className="col-lg-4 col-md-5">
              <div className={`card h-100 ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                <div className={`card-body ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                  <h5 className={`mb-3 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>Parent Information</h5>
                  <div className={`mb-2 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><b>Name:</b> {dashboardData.parentName}</div>
                  <div className={`mb-2 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><b>Email:</b> {guardianStudents.guardianEmail}</div>
                  <div className={`mb-2 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><b>Children Enrolled:</b> {dashboardData.students.length}</div>
                  {/* Children Selection Dropdown */}
                  <div className="mt-3">
                    <label htmlFor="childrenSelect" className={`form-label fw-semibold ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                      <i className="ti ti-users me-1"></i>Select Child
                    </label>
                    <select
                      id="childrenSelect"
                      className={`form-select ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}
                      value={activeStudent}
                      onChange={(e) => {
                        const selectedStudentId = e.target.value;
                        
                        if (selectedStudentId) {
                          setActiveStudent(selectedStudentId);
                          setStudentId(selectedStudentId);
                          
                          localStorage.removeItem('cachedFeesData');
                          localStorage.removeItem('cachedAttendanceData');
                          localStorage.removeItem('cachedTimetableData');
                          localStorage.removeItem('cachedResultsData');
                          
                          toast.success(`Switched to ${dashboardData.students.find(s => s.studentId === selectedStudentId)?.studentInfo.name || 'student'}`);
                        } else {
                          setActiveStudent("");
                          setStudentId("");
                        }
                      }}
                    >
                      <option value="">-- Select a child --</option>
                      {dashboardData.students.map((student) => (
                        <option key={student.studentId} value={student.studentId}>
                          {student.studentInfo.name} - {student.studentInfo.class}
                        </option>
                      ))}
                    </select>
                  </div>
                          </div>
                        </div>
                      </div>
                    </div>

          {/* Parent Actions Section - Always visible */}
          <div className="mb-4">
            <div className={`card parent-actions-card ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : "border-primary"}`} style={{borderLeft: '4px solid #ffc107'}}>
              <div className={`card-header ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : "bg-light"}`}>
                <h5 className={`mb-0 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                  <i className="ti ti-tools me-2"></i>Parent Actions
                </h5>
                <small className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                  Quick actions for parent support and communication
                </small>
              </div>
              <div className={`card-body ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                <div className={`d-flex gap-2 gap-md-3 overflow-auto pb-2 ${dataTheme === "dark_data_theme" ? "scrollbar-dark" : ""}`} style={{ scrollbarWidth: 'thin', scrollbarColor: dataTheme === "dark_data_theme" ? '#495057 #343a40' : '#dee2e6 #f8f9fa' }}>
                  {[
                    { key: 'addTicket', icon: 'ti ti-ticket', label: 'Submit Ticket', color: 'warning', description: 'Submit support ticket' },
                    { key: 'contact', icon: 'ti ti-phone', label: 'Contact School', color: 'info', description: 'Send message to school' },
                  ].map(action => (
                    <div key={action.key} className="flex-shrink-0" style={{ minWidth: isMobile ? '160px' : '200px', maxWidth: isMobile ? '160px' : '200px' }}>
                      <button
                        className={`btn btn-outline-${action.color} d-flex flex-column align-items-center p-2 p-md-3 rounded-4 shadow-sm border-0 w-100 h-100 ${dataTheme === "dark_data_theme" ? "dark-mode-btn" : ""}`}
                        style={{ minHeight: isMobile ? 120 : 140 }}
                        onClick={() => {
                          const event = new CustomEvent('openParentModal', {
                            detail: { modalType: action.key, studentId: '' }
                          });
                          window.dispatchEvent(event);
                        }}
                        title={action.description}
                      >
                        <span className={`d-flex align-items-center justify-content-center rounded-circle bg-${action.color} mb-2 mb-md-3`} style={{ width: isMobile ? 48 : 56, height: isMobile ? 48 : 56 }}>
                          <i className={`${action.icon} text-white ${isMobile ? 'fs-4' : 'fs-3'}`}></i>
                        </span>
                        <span className="fw-semibold text-center small">{action.label}</span>
                      </button>
                    </div>
                  ))}
                          </div>
                        </div>
                      </div>
                    </div>

          {/* Children Selection Message */}
          {!activeStudent && dashboardData.students.length > 0 && (
            <div className="mb-4">
              <div className="alert alert-info text-center">
                <i className="ti ti-info-circle me-2"></i>
                Please select a child from the dropdown above to view their details
                            </div>
                          </div>
          )}

          {/* 7 Quick Action Cards in horizontal sliding format - Only show when child is selected */}
          {activeStudent && (
            <div className="mb-4">
              <h5 className={`mb-3 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}><i className="ti ti-apps me-2"></i>Quick Actions</h5>
              <div className={`d-flex gap-2 gap-md-3 overflow-auto pb-2 ${dataTheme === "dark_data_theme" ? "scrollbar-dark" : ""}`} style={{ scrollbarWidth: 'thin', scrollbarColor: dataTheme === "dark_data_theme" ? '#495057 #343a40' : '#dee2e6 #f8f9fa' }}>
            {[
              { key: 'studentDetails', icon: 'ti ti-user', label: 'Student Details', color: 'primary' },
              { key: 'attendance', icon: 'ti ti-calendar-due', label: 'Attendance & Leave', color: 'warning' },
              { key: 'fees', icon: 'ti ti-report-money', label: 'Fees', color: 'success' },
              { key: 'timetable', icon: 'ti ti-calendar', label: 'Timetable', color: 'info' },
              { key: 'assignments', icon: 'ti ti-book', label: 'Assignments & Homework', color: 'secondary' },
              { key: 'notices', icon: 'ti ti-bell', label: 'Notices & Events', color: 'primary' },
              { key: 'examResults', icon: 'ti ti-award', label: 'Exam & Result', color: 'danger' },
              { key: 'contact', icon: 'ti ti-phone', label: 'Contact', color: 'info' },
            ].map(action => (
                  <div key={action.key} className="flex-shrink-0" style={{ minWidth: isMobile ? '160px' : '200px', maxWidth: isMobile ? '160px' : '200px' }}>
                <button
                      className={`btn btn-outline-${action.color} d-flex flex-column align-items-center p-2 p-md-3 rounded-4 shadow-sm border-0 w-100 h-100 ${dataTheme === "dark_data_theme" ? "dark-mode-btn" : ""}`}
                      style={{ minHeight: isMobile ? 120 : 140 }}
                  onClick={() => {
                    const studentId = getStudentId();
                    if (!studentId) {
                      toast.error('Please select a student first');
                      return;
                    }
                    
                    const event = new CustomEvent('openParentModal', {
                      detail: { modalType: action.key, studentId }
                    });
                    window.dispatchEvent(event);
                  }}
                >
                      <span className={`d-flex align-items-center justify-content-center rounded-circle bg-${action.color} mb-2 mb-md-3`} style={{ width: isMobile ? 48 : 56, height: isMobile ? 48 : 56 }}>
                        <i className={`${action.icon} text-white ${isMobile ? 'fs-4' : 'fs-3'}`}></i>
                  </span>
                      <span className="fw-semibold text-center small">{action.label}</span>
                </button>
              </div>
            ))}
                        </div>
            </div>
          )}

          <div className="row">
            <div className="col-12">
              {activeStudent ? (
              <div className="row">
                {/* Enhanced: Student Overview Card */}
                {activeStudentData && (
                  <div className="col-12 mb-4">
                    <div className={`card shadow border-0 ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                      <div className={`card-body ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                        <div className="row align-items-center">
                            <div className="col-lg-2 col-md-3 col-4 text-center mb-3 mb-md-0">
                            <img
                              src={activeStudentData?.studentInfo.profilePic}
                              alt={activeStudentData?.studentInfo.name}
                              className="rounded-circle border border-2"
                                width={isMobile ? "60" : "80"}
                                height={isMobile ? "60" : "80"}
                            />
                          </div>
                            <div className="col-lg-10 col-md-9 col-8">
                              <h5 className="mb-1">
                                {activeStudentData?.studentInfo.name} 
                                <span className="badge bg-info ms-2">{activeStudentData?.studentInfo.class}</span>
                              </h5>
                              <div className="d-flex flex-column flex-md-row flex-wrap gap-2 gap-md-3 mb-2">
                                <span className="small"><strong>Roll No:</strong> {activeStudentData?.studentInfo.rollNo}</span>
                                <span className="small"><strong>School:</strong> {activeStudentData?.studentInfo.schoolName}</span>
                                <span className="small"><strong>Admission:</strong> {formatDate(activeStudentData?.studentInfo.admissionDate)}</span>
                        </div>
                              <div className="d-flex flex-column flex-md-row flex-wrap gap-2 gap-md-3">
                                <span className="small"><strong>Email:</strong> {activeStudentData?.studentInfo.email}</span>
                                <span className="small"><strong>Phone:</strong> {activeStudentData?.studentInfo.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced: Academic Performance */}
                {activeStudentData && activeStudentData.academicPerformance && activeStudentData.academicPerformance.averages && activeStudentData.academicPerformance.averages.length > 0 ? (
                  <div className="col-12 mb-4">
                    <div className={`card border-0 shadow-sm ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                      <div className={`card-header ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : "bg-white"} border-bottom-0 d-flex justify-content-between align-items-center`}>
                        <h5 className={`mb-0 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}><i className="ti ti-bookmark me-2"></i>Academic Performance</h5>
                        <button
                          className={`btn btn-sm btn-outline-primary rounded-circle ms-2 ${dataTheme === "dark_data_theme" ? "btn-outline-light" : ""}`}
                          title="View Academic Details"
                          onClick={() => {
                            const studentId = getStudentId();
                            if (!studentId) {
                              toast.error('Please select a student first');
                              return;
                            }
                            
                            const event = new CustomEvent('openParentModal', {
                              detail: { modalType: 'studentDetails', studentId }
                            });
                            window.dispatchEvent(event);
                          }}
                        >
                          <i className="ti ti-user"></i>
                        </button>
                  </div>
                  <div className={`card-body ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                        {renderAcademicPerformance(activeStudentData)}
                        {renderRecentScores(activeStudentData)}
                      </div>
                    </div>
                        </div>
                ) : (
                  <div className="col-12 mb-4">
                    <div className={`card border-0 shadow-sm ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                      <div className={`card-header ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : "bg-white"} border-bottom-0`}>
                        <h5 className={`mb-0 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}><i className="ti ti-bookmark me-2"></i>Academic Performance</h5>
                      </div>
                      <div className={`card-body text-center py-5 ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                        <i className="ti ti-book-off fs-1 text-muted mb-3"></i>
                        <h6 className={`${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>No Academic Data Available</h6>
                        <p className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                          Academic performance data is not available for this student.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Academic Report Graph */}
                {activeStudentData && activeStudentData.academicPerformance && activeStudentData.academicPerformance.averages && activeStudentData.academicPerformance.averages.length > 0 ? (
                  <div className="col-12 mb-4">
                    <div className={`card border-0 shadow-sm ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                      <div className={`card-header ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : "bg-white"} border-bottom-0`}>
                        <h5 className={`mb-0 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                          <i className="ti ti-chart-line me-2"></i>Academic Report Graph
                        </h5>
                      </div>
                      <div className={`card-body ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                        <div className="row">
                          <div className="col-lg-8">
                            <ReactApexChart
                              options={{
                                chart: {
                                  type: 'line',
                                  height: 350,
                                  toolbar: {
                                    show: false,
                                  },
                                  background: dataTheme === "dark_data_theme" ? '#2d2d2d' : '#ffffff',
                                  foreColor: dataTheme === "dark_data_theme" ? '#ffffff' : '#000000',
                                },
                                series: [
                                  {
                                    name: 'Subject Average',
                                    data: activeStudentData.academicPerformance.averages.map((avg: any) => 
                                      avg.average || avg.score || 0
                                    ),
                                  }
                                ],
                                xaxis: {
                                  categories: activeStudentData.academicPerformance.averages.map((avg: any) => 
                                    avg.subject || 'Subject'
                                  ),
                                  labels: {
                                    style: {
                                      colors: dataTheme === "dark_data_theme" ? '#ffffff' : '#000000',
                                    },
                                  },
                                },
                                yaxis: {
                                  title: {
                                    text: 'Score (%)',
                                    style: {
                                      color: dataTheme === "dark_data_theme" ? '#ffffff' : '#000000',
                                    },
                                  },
                                  labels: {
                                    style: {
                                      colors: dataTheme === "dark_data_theme" ? '#ffffff' : '#000000',
                                    },
                                  },
                                },
                                colors: ['#667eea', '#6fccd8'],
                                stroke: {
                                  width: 3,
                                  curve: 'smooth',
                                },
                                markers: {
                                  size: 6,
                                  colors: ['#667eea', '#6fccd8'],
                                  strokeColors: dataTheme === "dark_data_theme" ? '#2d2d2d' : '#ffffff',
                                  strokeWidth: 2,
                                },
                                grid: {
                                  borderColor: dataTheme === "dark_data_theme" ? '#404040' : '#e0e0e0',
                                  strokeDashArray: 5,
                                },
                                legend: {
                                  position: 'top',
                                  labels: {
                                    colors: dataTheme === "dark_data_theme" ? '#ffffff' : '#000000',
                                  },
                                },
                                tooltip: {
                                  theme: dataTheme === "dark_data_theme" ? 'dark' : 'light',
                                  y: {
                                    formatter: function (val: any) {
                                      return val + '%';
                                    },
                                  },
                                },
                              }}
                              series={[
                                {
                                  name: 'Subject Average',
                                  data: activeStudentData.academicPerformance.averages.map((avg: any) => 
                                    avg.average || avg.score || 0
                                  ),
                                }
                              ]}
                              type="line"
                              height={350}
                            />
                          </div>
                          <div className="col-lg-4">
                            <div className={`${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                              <h6 className={`mb-3 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                                <i className="ti ti-target me-2"></i>Performance Summary
                              </h6>
                              <div className="row">
                                <div className="col-6 mb-3">
                                  <div className={`card ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : ""}`}>
                                    <div className={`card-body text-center ${dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""}`}>
                                      <h4 className={`${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                                        {Math.round(activeStudentData.academicPerformance.averages.reduce((sum: number, avg: any) => 
                                          sum + (avg.average || avg.score || 0), 0
                                        ) / activeStudentData.academicPerformance.averages.length)}%
                                      </h4>
                                      <small className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>Overall Average</small>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-6 mb-3">
                                  <div className={`card ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : ""}`}>
                                    <div className={`card-body text-center ${dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""}`}>
                                      <h4 className={`${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                                        {activeStudentData.academicPerformance.averages.length}
                                      </h4>
                                      <small className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>Subjects</small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3">
                                <h6 className={`mb-2 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>Top Subjects</h6>
                                {activeStudentData.academicPerformance.averages
                                  .sort((a: any, b: any) => 
                                    (b.average || b.score || 0) - (a.average || a.score || 0)
                                  )
                                  .slice(0, 3)
                                  .map((subject: any, index: number) => (
                                    <div key={index} className={`d-flex justify-content-between align-items-center mb-2 p-2 rounded ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : "bg-light"}`}>
                                      <span className={`${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>{subject.subject}</span>
                                      <span className={`badge ${index === 0 ? 'bg-success' : index === 1 ? 'bg-warning' : 'bg-info'}`}>
                                        {subject.average || subject.score || 0}%
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col-12 mb-4">
                    <div className={`card border-0 shadow-sm ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                      <div className={`card-header ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : "bg-white"} border-bottom-0`}>
                        <h5 className={`mb-0 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                          <i className="ti ti-chart-line me-2"></i>Academic Report Graph
                        </h5>
                      </div>
                      <div className={`card-body text-center py-5 ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                        <i className="ti ti-chart-off fs-1 text-muted mb-3"></i>
                        <h6 className={`${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>No Academic Data Available</h6>
                        <p className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                          Academic performance data is not available for this student.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subject Distribution Pie Chart */}
                {activeStudentData && activeStudentData.academicPerformance && activeStudentData.academicPerformance.averages && activeStudentData.academicPerformance.averages.length > 0 ? (
                  <div className="col-lg-6 mb-4">
                    <div className={`card border-0 shadow-sm ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                      <div className={`card-header ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : "bg-white"} border-bottom-0`}>
                        <h5 className={`mb-0 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                          <i className="ti ti-chart-pie me-2"></i>Subject Distribution
                        </h5>
                      </div>
                      <div className={`card-body ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                        <ReactApexChart
                          options={{
                            chart: {
                              type: 'pie',
                              height: 300,
                              background: dataTheme === "dark_data_theme" ? '#2d2d2d' : '#ffffff',
                            },
                            labels: activeStudentData.academicPerformance.averages.map((avg: any) => 
                              avg.subject || 'Subject'
                            ),
                            colors: ['#667eea', '#6fccd8', '#f09346', '#e74c3c', '#9b59b6', '#3498db'],
                            legend: {
                              position: 'bottom',
                              labels: {
                                colors: dataTheme === "dark_data_theme" ? '#ffffff' : '#000000',
                              },
                            },
                            tooltip: {
                              theme: dataTheme === "dark_data_theme" ? 'dark' : 'light',
                              y: {
                                formatter: function (val: any) {
                                  return val + '%';
                                },
                              },
                            },
                            dataLabels: {
                              style: {
                                colors: [dataTheme === "dark_data_theme" ? '#ffffff' : '#000000'],
                              },
                            },
                          }}
                          series={activeStudentData.academicPerformance.averages.map((avg: any) => 
                            ('average' in avg ? avg.average : avg.score) || 0
                          )}
                          type="pie"
                          height={300}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col-lg-6 mb-4">
                    <div className={`card border-0 shadow-sm ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                      <div className={`card-header ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : "bg-white"} border-bottom-0`}>
                        <h5 className={`mb-0 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                          <i className="ti ti-chart-pie me-2"></i>Subject Distribution
                        </h5>
                      </div>
                      <div className={`card-body text-center py-5 ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                        <i className="ti ti-chart-pie-off fs-1 text-muted mb-3"></i>
                        <h6 className={`${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>No Subject Data Available</h6>
                        <p className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                          Subject distribution data is not available for this student.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Trend Chart */}
                {activeStudentData && activeStudentData.academicPerformance && activeStudentData.academicPerformance.averages && activeStudentData.academicPerformance.averages.length > 0 ? (
                  <div className="col-lg-6 mb-4">
                    <div className={`card border-0 shadow-sm ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                      <div className={`card-header ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : "bg-white"} border-bottom-0`}>
                        <h5 className={`mb-0 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                          <i className="ti ti-trending-up me-2"></i>Performance Trend
                        </h5>
                      </div>
                      <div className={`card-body ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                        <ReactApexChart
                          options={{
                            chart: {
                              type: 'area',
                              height: 300,
                              toolbar: {
                                show: false,
                              },
                              background: dataTheme === "dark_data_theme" ? '#2d2d2d' : '#ffffff',
                              foreColor: dataTheme === "dark_data_theme" ? '#ffffff' : '#000000',
                            },
                            series: [
                              {
                                name: 'Performance Score',
                                data: activeStudentData.academicPerformance.averages.map((avg: any) => 
                                  avg.average || avg.score || 0
                                ),
                              }
                            ],
                            xaxis: {
                              categories: activeStudentData.academicPerformance.averages.map((avg: any) => 
                                avg.subject || 'Subject'
                              ),
                              labels: {
                                style: {
                                  colors: dataTheme === "dark_data_theme" ? '#ffffff' : '#000000',
                                },
                              },
                            },
                            yaxis: {
                              labels: {
                                style: {
                                  colors: dataTheme === "dark_data_theme" ? '#ffffff' : '#000000',
                                },
                              },
                            },
                            colors: ['#667eea'],
                            fill: {
                              type: 'gradient',
                              gradient: {
                                shadeIntensity: 1,
                                opacityFrom: 0.7,
                                opacityTo: 0.9,
                                stops: [0, 100],
                              },
                            },
                            stroke: {
                              curve: 'smooth',
                              width: 3,
                            },
                            grid: {
                              borderColor: dataTheme === "dark_data_theme" ? '#404040' : '#e0e0e0',
                            },
                            tooltip: {
                              theme: dataTheme === "dark_data_theme" ? 'dark' : 'light',
                              y: {
                                formatter: function (val: any) {
                                  return val + '%';
                                },
                              },
                            },
                          }}
                          series={[
                            {
                              name: 'Performance Score',
                              data: activeStudentData.academicPerformance.averages.map((avg: any) => 
                                avg.average || avg.score || 0
                              ),
                            }
                          ]}
                          type="area"
                          height={300}
                        />
                      </div>
                    </div>
                        </div>
                ) : (
                  <div className="col-lg-6 mb-4">
                    <div className={`card border-0 shadow-sm ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                      <div className={`card-header ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : "bg-white"} border-bottom-0`}>
                        <h5 className={`mb-0 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                          <i className="ti ti-trending-up me-2"></i>Performance Trend
                        </h5>
                      </div>
                      <div className={`card-body text-center py-5 ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                        <i className="ti ti-trending-down fs-1 text-muted mb-3"></i>
                        <h6 className={`${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>No Performance Data Available</h6>
                        <p className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                          Performance trend data is not available for this student.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                {activeStudentData ? (
                  <>
                  <div className="col-lg-4 col-md-6 col-12 mb-3">
                    <div className={`card h-100 ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                    <div className={`card-body text-center ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                      <div className="avatar avatar-lg bg-primary rounded-circle mx-auto mb-3">
                        <i className="ti ti-calendar-check text-white fs-2"></i>
                      </div>
                          <h4 className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                            {activeStudentData?.attendance?.percentage || 0}%
                          </h4>
                      <p className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"} mb-0`}>Attendance</p>
                      <small className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                            {activeStudentData?.attendance?.presentDays || 0} of {activeStudentData?.attendance?.totalDays || 0} days
                      </small>
                    </div>
                  </div>
                </div>

                  <div className="col-lg-4 col-md-6 col-12 mb-3">
                    <div className={`card h-100 ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                    <div className={`card-body text-center ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                      <div className="avatar avatar-lg bg-success rounded-circle mx-auto mb-3">
                        <i className="ti ti-report-money text-white fs-2"></i>
                      </div>
                          <h4 className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                            {formatCurrency(activeStudentData?.fees?.totalPaid || 0)}
                          </h4>
                      <p className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"} mb-0`}>Total Paid</p>
                      <small className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                            {activeStudentData?.fees?.paymentHistory?.length || 0} payments
                      </small>
                    </div>
                  </div>
                </div>

                  <div className="col-lg-4 col-md-6 col-12 mb-3">
                    <div className={`card h-100 ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                    <div className={`card-body text-center ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                      <div className="avatar avatar-lg bg-warning rounded-circle mx-auto mb-3">
                        <i className="ti ti-alert-circle text-white fs-2"></i>
                      </div>
                          <h4 className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                            {formatCurrency(activeStudentData?.fees?.totalPending || 0)}
                          </h4>
                      <p className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"} mb-0`}>Pending Fees</p>
                      <small className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                            {activeStudentData?.fees?.pendingFees?.length || 0} items
                      </small>
                    </div>
                  </div>
                </div>
                  </>
                ) : (
                  <div className="col-12 mb-4">
                    <div className={`card border-0 shadow-sm ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                      <div className={`card-body text-center py-5 ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                        <i className="ti ti-users fs-1 text-muted mb-3"></i>
                        <h6 className={`${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>No Student Selected</h6>
                        <p className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                          Please select a child from the dropdown to view their statistics.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pending Fees */}
                {activeStudentData && activeStudentData.fees.pendingFees.length > 0 && (
                    <div className="col-12 mb-4">
                    <div className={`card ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : "border-warning"}`}>
                      <div className={`card-header ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : "bg-warning text-white"}`}>
                        <h5 className={`mb-0 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                          <i className="ti ti-alert-triangle me-2"></i>
                          Pending Fees
                        </h5>
                      </div>
                      <div className={`card-body ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                          <AntdTable
                            columns={[
                              { 
                                title: 'Fee Category', 
                                dataIndex: 'feeCategory', 
                                key: 'feeCategory', 
                                ellipsis: true, 
                                responsive: ['md'],
                                render: (text: string) => <span className={dataTheme === "dark_data_theme" ? "text-white" : ""}>{text}</span>
                              },
                              { 
                                title: 'Amount', 
                                dataIndex: 'amount', 
                                key: 'amount', 
                                render: (amount) => <span className={dataTheme === "dark_data_theme" ? "text-white" : ""}>{formatCurrency(amount || 0)}</span>
                              },
                              { 
                                title: 'Due Date', 
                                dataIndex: 'dueDate', 
                                key: 'dueDate', 
                                render: (dueDate) => <span className={dataTheme === "dark_data_theme" ? "text-white" : ""}>{dueDate ? formatDate(dueDate) : 'Not specified'}</span>, 
                                responsive: ['md']
                              },
                              { 
                                title: 'Action', 
                                key: 'action', 
                                render: (_, record) => (
                                record.dueDate ? (
                                      <Link to={routes.studentFees} className={`btn btn-sm btn-primary ${dataTheme === "dark_data_theme" ? "btn-outline-light" : ""}`}>
                                        Pay Now
                                      </Link>
                                ) : null
                                )
                              },
                            ]}
                            dataSource={activeStudentData.fees.pendingFees.map((fee, index) => ({
                              key: index,
                              feeCategory: fee.feeCategory || fee.feeCategory,
                              amount: fee.amount || 0,
                              dueDate: fee.dueDate,
                            }))}
                            pagination={false}
                            size="small"
                            scroll={{ x: true }}
                            locale={{ emptyText: 'No pending fees.' }}
                            className={dataTheme === "dark_data_theme" ? "dark-table" : ""}
                          />
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Payments */}
                {activeStudentData && activeStudentData.fees.paymentHistory.length > 0 && (
                    <div className="col-lg-6 col-md-12 mb-3">
                      <div className={`card h-100 ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                      <div className={`card-header ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : ""}`}>
                        <h5 className={`mb-0 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                          <i className="ti ti-receipt me-2"></i>
                          Recent Payments
                        </h5>
                </div>
                      <div className={`card-body ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                        <div className={`list-group list-group-flush ${dataTheme === "dark_data_theme" ? "dark-list-group" : ""}`}>
                          {activeStudentData.fees.paymentHistory.slice(0, 5).map((payment, index) => (
                            <div key={index} className={`list-group-item d-flex justify-content-between align-items-center ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary text-white" : ""}`}>
                                <div className="flex-grow-1">
                                  <h6 className={`mb-1 small ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>{payment.feeCategory}</h6>
                                <small className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                                  {formatDate(payment.date)} • {payment.method}
                                </small>
              </div>
                                <span className="badge bg-success rounded-pill ms-2">
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
                    <div className="col-lg-6 col-md-12 mb-3">
                      <div className={`card h-100 ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                      <div className={`card-header ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : ""}`}>
                        <h5 className={`mb-0 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                          <i className="ti ti-bell me-2"></i>
                          Recent Notices
                        </h5>
                      </div>
                      <div className={`card-body ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                        <div className={`list-group list-group-flush ${dataTheme === "dark_data_theme" ? "dark-list-group" : ""}`}>
                          {(activeStudentData?.events?.notices || []).slice(0, 5).map((notice, index) => {
                            const title = typeof notice.title === 'string' ? notice.title : '';
                            const message = ('message' in notice && typeof notice.message === 'string') ? notice.message : (('content' in notice && typeof notice.content === 'string') ? notice.content : '');
                            const date = ('publishDate' in notice && typeof notice.publishDate === 'string') ? notice.publishDate : (('date' in notice && typeof notice.date === 'string') ? notice.date : '');
                            const hasAttachment = (notice as any).attachment && typeof (notice as any).attachment === 'string';
                            if (!title && !message && !date) return null;
                            return (
                              <div key={index} className={`list-group-item list-group-item-action pointer ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary text-white" : ""}`} onClick={() => setDetailsModal({ type: 'communication', data: notice })}>
                                  <h6 className={`mb-1 small ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>{title}</h6>
                                  <p className={`mb-1 small ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>{message}</p>
                                <small className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>{formatDate(date)}</small>
                                {hasAttachment && (
                                  <div className="mt-2">
                                    <Button
                                      size="sm"
                                      variant="info"
                                      onClick={e => { e.stopPropagation(); setNoticeAttachment({ show: true, url: (notice as any).attachment }); }}
                                      className={dataTheme === "dark_data_theme" ? "btn-outline-light" : ""}
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
                    <div className="col-lg-6 col-md-12 mb-3">
                      <div className={`card h-100 ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                  <div className={`card-header ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : ""}`}>
                        <h5 className={`mb-0 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                          <i className="ti ti-calendar-event me-2"></i>
                          Recent Events
                        </h5>
                      </div>
                      <div className={`card-body ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                        <div className={`list-group list-group-flush ${dataTheme === "dark_data_theme" ? "dark-list-group" : ""}`}>
                          {(activeStudentData?.events?.events || []).slice(0, 5).map((event, index) => {
                            const title = typeof event.title === 'string' ? event.title : '';
                            const message = ('message' in event && typeof event.message === 'string') ? event.message : (('content' in event && typeof event.content === 'string') ? event.content : '');
                            const date = ('publishDate' in event && typeof event.publishDate === 'string') ? event.publishDate : (('date' in event && typeof event.date === 'string') ? event.date : '');
                            return (
                              <div key={index} className={`list-group-item list-group-item-action pointer ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary text-white" : ""}`} onClick={() => setDetailsModal({ type: 'communication', data: event })}>
                                  <h6 className={`mb-1 small ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>{title}</h6>
                                  <p className={`mb-1 small ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>{message}</p>
                                <small className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>{formatDate(date)}</small>
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
                    <div className="col-12 mb-4">
                <div className={`card ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                  <div className={`card-header ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : ""}`}>
                        <h5 className={`mb-0 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                          <i className="ti ti-calendar me-2"></i>
                          Today's Schedule
                        </h5>
                  </div>
                  <div className={`card-body ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                          <AntdTable
                            columns={[
                              { 
                                title: 'Time', 
                                dataIndex: 'time', 
                                key: 'time', 
                                width: 150,
                                render: (text: string) => <span className={dataTheme === "dark_data_theme" ? "text-white" : ""}>{text}</span>
                              },
                              { 
                                title: 'Subject', 
                                dataIndex: 'subject', 
                                key: 'subject', 
                                ellipsis: true, 
                                responsive: ['md'],
                                render: (text: string) => <span className={dataTheme === "dark_data_theme" ? "text-white" : ""}>{text}</span>
                              },
                              { 
                                title: 'Teacher', 
                                dataIndex: 'teacher', 
                                key: 'teacher', 
                                ellipsis: true, 
                                responsive: ['md'],
                                render: (text: string) => <span className={dataTheme === "dark_data_theme" ? "text-white" : ""}>{text}</span>
                              },
                            ]}
                            dataSource={activeStudentData.timetable.map((entry, index) => ({
                              key: index,
                              time: `${formatTime(entry.startTime)} - ${formatTime(entry.endTime)}`,
                              subject: entry.subject,
                              teacher: entry.teacher,
                            }))}
                            pagination={false}
                            size="small"
                            scroll={{ x: true }}
                            locale={{ emptyText: 'No schedule available for today.' }}
                            className={dataTheme === "dark_data_theme" ? "dark-table" : ""}
                          />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              ) : (
                <div className="row">
                  <div className="col-12">
                    <div className={`card border-0 shadow-sm ${dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}`}>
                      <div className={`card-body text-center py-5 ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                        <div className={`mb-4 ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                          <i className="ti ti-users fs-1 mb-3"></i>
                        </div>
                        <h4 className={`mb-3 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                          <i className="ti ti-info-circle me-2"></i>
                          Select a Child to Continue
                        </h4>
                        <p className={`mb-4 ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                          Please select a child from the dropdown above to view their academic details, fees, attendance, and more.
                        </p>
                        <div className={`alert ${dataTheme === "dark_data_theme" ? "alert-info bg-dark border-info" : "alert-info"} d-inline-block`}>
                          <i className="ti ti-arrow-up me-2"></i>
                          Use the dropdown in the Parent Information card to select your child
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

      {/* Parent Quick Actions Modals */}
      <StudentDetailsModal 
        show={studentDetailsModal.show} 
        onHide={() => setStudentDetailsModal({ show: false, studentId: '' })} 
        studentId={studentDetailsModal.studentId} 
      />
      <AttendanceLeaveModal 
        show={attendanceModal.show} 
        onHide={() => setAttendanceModal({ show: false, studentId: '' })} 
        studentId={attendanceModal.studentId} 
      />
      <FeesModal 
        show={feesModal.show} 
        onHide={() => setFeesModal({ show: false, studentId: '' })} 
        studentId={feesModal.studentId} 
        refetchDashboard={() => {
        }}
        onFeesUpdated={(updatedFees) => {
          setDashboardData(prevData => {
            if (!prevData || !activeStudent) return prevData;
            
            return {
              ...prevData,
              students: prevData.students.map(student => {
                if (student.studentId === activeStudent) {
                  return {
                    ...student,
                    fees: {
                      ...student.fees,
                      pendingFees: updatedFees.filter((fee: any) => fee.status !== 'PAID'),
                      paymentHistory: [
                        ...student.fees.paymentHistory,
                        ...updatedFees.flatMap((fee: any) => fee.Payment || [])
                      ]
                    }
                  };
                }
                return student;
              })
            };
          });
        }}
      />
      <TimetableModal 
        show={timetableModal.show} 
        onHide={() => setTimetableModal({ show: false, studentId: '' })} 
        studentId={timetableModal.studentId} 
      />
      <AssignmentsModal 
        show={assignmentsModal.show} 
        onHide={() => setAssignmentsModal({ show: false, studentId: '' })} 
        studentId={assignmentsModal.studentId} 
      />
      <NoticesModal 
        show={noticesModal.show} 
          onHide={() => setNoticesModal({ show: false, studentId: null })}
          studentId={noticesModal.studentId || ''}
      />
      <ExamResultsModal 
        show={examResultsModal.show} 
        onHide={() => setExamResultsModal({ show: false, studentId: '' })} 
        studentId={examResultsModal.studentId} 
      />
              <AddTicketModal
          show={addTicketModal.show}
          onHide={() => setAddTicketModal({ show: false, studentId: '' })}
          studentId={addTicketModal.studentId}
          parentId={dashboardData?.parentId}
        />
              <ContactModal
          show={contactModal.show}
          onHide={() => setContactModal({ show: false, studentId: '' })}
          studentId={contactModal.studentId}
          parentId={dashboardData?.parentId}
      />

      {/* Notice Attachment Modal */}
      <Modal show={noticeAttachment.show} onHide={() => setNoticeAttachment({ show: false, url: null })} size="lg" centered className={dataTheme === "dark_data_theme" ? "dark-modal" : ""}>
        <Modal.Header closeButton className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}>
          <Modal.Title className={dataTheme === "dark_data_theme" ? "text-white" : ""}>
            <i className="ti ti-paperclip me-2"></i>Notice Attachment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={`text-center ${dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""}`}>
          {noticeAttachment.url && (noticeAttachment.url.endsWith('.pdf') ? (
            <iframe src={noticeAttachment.url} title="Attachment PDF" style={{ width: '100%', height: '70vh' }} />
          ) : (
            <img src={noticeAttachment.url} alt="Attachment" style={{ maxHeight: '70vh', maxWidth: '100%' }} />
          ))}
        </Modal.Body>
      </Modal>

      {/* Add a modal to show details for student, parent, or communication */}
      <AntdModal 
        open={!!detailsModal.type} 
        onCancel={() => setDetailsModal({ type: null, data: null })} 
        footer={null} 
        title={
          <span className={dataTheme === "dark_data_theme" ? "text-white" : ""}>
            <i className="ti ti-info-circle me-2"></i>
            {detailsModal.type === 'student' ? 'Student Details' : detailsModal.type === 'parent' ? 'Parent Details' : 'Communication Details'}
          </span>
        }
        className={dataTheme === "dark_data_theme" ? "dark-antd-modal" : ""}
      >
        {detailsModal.type === 'student' && detailsModal.data && (
          <div className={dataTheme === "dark_data_theme" ? "text-white" : ""}>
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
          <div className={dataTheme === "dark_data_theme" ? "text-white" : ""}>
            <p><b>Name:</b> {detailsModal.data.name}</p>
            <p><b>Email:</b> {detailsModal.data.email}</p>
            <p><b>Children Enrolled:</b> {detailsModal.data.children}</p>
            {guardianStudents && Array.isArray(guardianStudents.students) && guardianStudents.students.length > 0
              ? (
                <div className="mt-4">
                  <h5 className={dataTheme === "dark_data_theme" ? "text-white" : ""}>Children Information</h5>
                  <div className="table-responsive">
                    <table className={`table table-bordered ${dataTheme === "dark_data_theme" ? "table-dark" : ""}`}>
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
          </div>
        )}
        {detailsModal.type === 'communication' && detailsModal.data && (
          <div className={dataTheme === "dark_data_theme" ? "text-white" : ""}>
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

// Add dark mode styles
const darkModeStyles = `
  .dark-mode {
    background-color: #1a1a1a !important;
    color: #ffffff !important;
  }
  
  .dark-mode .card {
    background-color: #2d2d2d !important;
    border-color: #404040 !important;
    color: #ffffff !important;
  }
  
  .dark-mode .card-header {
    background-color: #2d2d2d !important;
    border-color: #404040 !important;
    color: #ffffff !important;
  }
  
  .dark-mode .card-body {
    background-color: #2d2d2d !important;
    color: #ffffff !important;
  }
  
  .dark-mode .form-select {
    background-color: #2d2d2d !important;
    border-color: #404040 !important;
    color: #ffffff !important;
  }
  
  .dark-mode .form-select option {
    background-color: #2d2d2d !important;
    color: #ffffff !important;
  }
  
  .dark-mode .btn-outline-light {
    color: #ffffff !important;
    border-color: #ffffff !important;
  }
  
  .dark-mode .btn-outline-light:hover {
    background-color: #ffffff !important;
    color: #000000 !important;
  }
  
  .dark-mode .dark-table .ant-table {
    background-color: #2d2d2d !important;
    color: #ffffff !important;
  }
  
  .dark-mode .dark-table .ant-table-thead > tr > th {
    background-color: #404040 !important;
    color: #ffffff !important;
    border-color: #555555 !important;
  }
  
  .dark-mode .dark-table .ant-table-tbody > tr > td {
    background-color: #2d2d2d !important;
    color: #ffffff !important;
    border-color: #555555 !important;
  }
  
  .dark-mode .dark-table .ant-table-tbody > tr:hover > td {
    background-color: #404040 !important;
  }
  
  .dark-mode .dark-mode-btn {
    background-color: #2d2d2d !important;
    border-color: #404040 !important;
    color: #ffffff !important;
  }
  
  .dark-mode .dark-mode-btn:hover {
    background-color: #404040 !important;
    border-color: #555555 !important;
  }
  
  .dark-mode .scrollbar-dark::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .dark-mode .scrollbar-dark::-webkit-scrollbar-track {
    background: #2d2d2d;
  }
  
  .dark-mode .scrollbar-dark::-webkit-scrollbar-thumb {
    background: #555555;
    border-radius: 4px;
  }
  
  .dark-mode .scrollbar-dark::-webkit-scrollbar-thumb:hover {
    background: #666666;
  }
  
  .dark-mode .text-light {
    color: #e0e0e0 !important;
  }
  
  .dark-mode .text-white {
    color: #ffffff !important;
  }
  
  .dark-mode .border-secondary {
    border-color: #404040 !important;
  }
  
  .dark-mode .bg-dark {
    background-color: #2d2d2d !important;
  }
  
  /* Dark mode for Bootstrap modals */
  .dark-modal .modal-content {
    background-color: #2d2d2d !important;
    border-color: #404040 !important;
    color: #ffffff !important;
  }
  
  .dark-modal .modal-header {
    background-color: #2d2d2d !important;
    border-bottom-color: #404040 !important;
  }
  
  .dark-modal .modal-body {
    background-color: #2d2d2d !important;
    color: #ffffff !important;
  }
  
  .dark-modal .modal-footer {
    background-color: #2d2d2d !important;
    border-top-color: #404040 !important;
  }
  
  .dark-modal .btn-close {
    filter: invert(1);
  }
  
  /* Dark mode for Antd modals */
  .dark-antd-modal .ant-modal-content {
    background-color: #2d2d2d !important;
    border-color: #404040 !important;
    color: #ffffff !important;
  }
  
  .dark-antd-modal .ant-modal-header {
    background-color: #2d2d2d !important;
    border-bottom-color: #404040 !important;
  }
  
  .dark-antd-modal .ant-modal-title {
    color: #ffffff !important;
  }
  
  .dark-antd-modal .ant-modal-body {
    background-color: #2d2d2d !important;
    color: #ffffff !important;
  }
  
  .dark-antd-modal .ant-modal-close {
    color: #ffffff !important;
  }
  
  .dark-antd-modal .ant-modal-close:hover {
    color: #e0e0e0 !important;
  }
  
  /* Dark mode for tables in modals */
  .dark-modal .table {
    color: #ffffff !important;
  }
  
  .dark-modal .table thead th {
    background-color: #404040 !important;
    border-color: #555555 !important;
    color: #ffffff !important;
  }
  
  .dark-mode .table tbody td {
    background-color: #2d2d2d !important;
    border-color: #555555 !important;
    color: #ffffff !important;
  }
  
  .dark-mode .table tbody tr:hover td {
    background-color: #404040 !important;
  }
  
  .dark-modal .table-dark {
    background-color: #2d2d2d !important;
    color: #ffffff !important;
  }
  
  .dark-modal .table-dark thead th {
    background-color: #404040 !important;
    border-color: #555555 !important;
    color: #ffffff !important;
  }
  
  .dark-modal .table-dark tbody td {
    background-color: #2d2d2d !important;
    border-color: #555555 !important;
    color: #ffffff !important;
  }
  
  /* Dark mode for ApexCharts */
  .dark-mode .apexcharts-canvas {
    background-color: #2d2d2d !important;
  }
  
  .dark-mode .apexcharts-text {
    fill: #ffffff !important;
  }
  
  .dark-mode .apexcharts-title-text {
    fill: #ffffff !important;
  }
  
  .dark-mode .apexcharts-legend-text {
    color: #ffffff !important;
  }
  
  .dark-mode .apexcharts-tooltip {
    background-color: #404040 !important;
    color: #ffffff !important;
    border-color: #555555 !important;
  }
  
  /* Dark mode for form elements */
  .dark-mode .form-control {
    background-color: #2d2d2d !important;
    border-color: #404040 !important;
    color: #ffffff !important;
  }
  
  .dark-mode .form-control:focus {
    background-color: #2d2d2d !important;
    border-color: #667eea !important;
    color: #ffffff !important;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
  }
  
  .dark-mode .form-label {
    color: #ffffff !important;
  }
  
  .dark-mode .form-text {
    color: #e0e0e0 !important;
  }
  
  /* Dark mode for alerts */
  .dark-mode .alert {
    background-color: #2d2d2d !important;
    border-color: #404040 !important;
    color: #ffffff !important;
  }
  
  .dark-mode .alert-success {
    background-color: #1e4d2b !important;
    border-color: #28a745 !important;
    color: #d4edda !important;
  }
  
  .dark-mode .alert-danger {
    background-color: #4d1e1e !important;
    border-color: #dc3545 !important;
    color: #f8d7da !important;
  }
  
  .dark-mode .alert-warning {
    background-color: #4d3a1e !important;
    border-color: #ffc107 !important;
    color: #fff3cd !important;
  }
  
  .dark-mode .alert-info {
    background-color: #1e3a4d !important;
    border-color: #17a2b8 !important;
    color: #d1ecf1 !important;
  }
  
  /* Dark mode for badges */
  .dark-mode .badge {
    color: #ffffff !important;
  }
  
  /* Dark mode for list groups */
  .dark-mode .list-group-item {
    background-color: #2d2d2d !important;
    border-color: #404040 !important;
    color: #ffffff !important;
  }
  
  .dark-mode .list-group-item:hover {
    background-color: #404040 !important;
  }
  
  /* Dark mode for buttons */
  .dark-mode .btn {
    border-color: #404040 !important;
  }
  
  .dark-mode .btn-outline-primary {
    color: #667eea !important;
    border-color: #667eea !important;
  }
  
  .dark-mode .btn-outline-primary:hover {
    background-color: #667eea !important;
    color: #ffffff !important;
  }
  
  .dark-mode .btn-outline-secondary {
    color: #6c757d !important;
    border-color: #6c757d !important;
  }
  
  .dark-mode .btn-outline-secondary:hover {
    background-color: #6c757d !important;
    color: #ffffff !important;
  }
  
  /* Dark mode for dropdowns */
  .dark-mode .dropdown-menu {
    background-color: #2d2d2d !important;
    border-color: #404040 !important;
  }
  
  .dark-mode .dropdown-item {
    color: #ffffff !important;
  }
  
  .dark-mode .dropdown-item:hover {
    background-color: #404040 !important;
    color: #ffffff !important;
  }
  
  /* Dark mode for pagination */
  .dark-mode .pagination .page-link {
    background-color: #2d2d2d !important;
    border-color: #404040 !important;
    color: #ffffff !important;
  }
  
  .dark-mode .pagination .page-link:hover {
    background-color: #404040 !important;
    color: #ffffff !important;
  }
  
  .dark-mode .pagination .page-item.active .page-link {
    background-color: #667eea !important;
    border-color: #667eea !important;
    color: #ffffff !important;
  }
  
  /* Dark mode for spinners */
  .dark-mode .spinner-border {
    color: #667eea !important;
  }
  
  /* Dark mode for tooltips */
  .dark-mode .tooltip .tooltip-inner {
    background-color: #404040 !important;
    color: #ffffff !important;
  }
  
  .dark-mode .tooltip .tooltip-arrow::before {
    border-color: #404040 !important;
  }
  
  /* Dark mode for popovers */
  .dark-mode .popover {
    background-color: #2d2d2d !important;
    border-color: #404040 !important;
    color: #ffffff !important;
  }
  
  .dark-mode .popover-header {
    background-color: #404040 !important;
    border-bottom-color: #555555 !important;
    color: #ffffff !important;
  }
  
  /* Dark mode for progress bars */
  .dark-mode .progress {
    background-color: #404040 !important;
  }
  
  .dark-mode .progress-bar {
    background-color: #667eea !important;
  }
  
  /* Dark mode for custom scrollbars */
  .dark-mode::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .dark-mode::-webkit-scrollbar-track {
    background: #2d2d2d;
  }
  
  .dark-mode::-webkit-scrollbar-thumb {
    background: #555555;
    border-radius: 4px;
  }
  
  .dark-mode::-webkit-scrollbar-thumb:hover {
    background: #666666;
  }
  
  /* Dark mode for React Toastify */
  .dark-mode .Toastify__toast {
    background-color: #2d2d2d !important;
    color: #ffffff !important;
  }
  
  .dark-mode .Toastify__toast--success {
    background-color: #1e4d2b !important;
  }
  
  .dark-mode .Toastify__toast--error {
    background-color: #4d1e1e !important;
  }
  
  .dark-mode .Toastify__toast--warning {
    background-color: #4d3a1e !important;
  }
  
  .dark-mode .Toastify__toast--info {
    background-color: #1e3a4d !important;
  }
  
  .dark-mode .Toastify__close-button {
    color: #ffffff !important;
  }
  
  .dark-mode .Toastify__progress-bar {
    background-color: #667eea !important;
  }
  
  /* Dark mode for list groups */
  .dark-mode .list-group-item {
    background-color: #2d2d2d !important;
    border-color: #404040 !important;
    color: #ffffff !important;
  }
  
  .dark-mode .list-group-item:hover {
    background-color: #404040 !important;
  }
  
  .dark-mode .dark-list-group .list-group-item {
    background-color: #2d2d2d !important;
    border-color: #404040 !important;
    color: #ffffff !important;
  }
  
  .dark-mode .dark-list-group .list-group-item:hover {
    background-color: #404040 !important;
  }
  
  .dark-mode .list-group-item-action:hover {
    background-color: #404040 !important;
    color: #ffffff !important;
  }
  
  .dark-mode .list-group-item-action:focus {
    background-color: #404040 !important;
    color: #ffffff !important;
  }
  
  .dark-modal .modal-dialog,
  .dark-modal .modal-content,
  .dark-modal .modal-body {
    background: #2d2d2d !important;
  }
  
  .dark-modal .modal-dialog {
    background: #2d2d2d !important;
  }
  .dark-modal .modal-content {
    background: #2d2d2d !important;
  }

  .modal-backdrop.show {
    background-color: #111 !important;  /* or #000 for pure black */
    opacity: 0.5 !important;           /* more transparent for dark mode */
  }

  body.dark-mode .modal-backdrop.show {
    background-color: #000 !important;
    opacity: 0.5 !important;
  }

  /* Make Ant Design modal mask (backdrop) transparent in dark mode */
  .dark-antd-modal .ant-modal-root .ant-modal-mask {
    background-color: #111 !important;
    opacity: 0.5 !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleId = 'parent-dashboard-dark-mode-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = darkModeStyles;
    document.head.appendChild(style);
  }
}

export default ParentDashboard;
