import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosResponse } from 'axios';
import {
  getStudentUserById,
  IStudentUser,
  getLessonsByStudentId,
  ILessonResponse,
  ILesson,
  getDashboardResourcesByStudentId,
  INotice,
  IHoliday,
  getFeesByStudentId,
  IFeeResponse,
  IFee,
  getAttendanceLeavesByStudentId,
  IAttendanceLeavesResponse,
  IAttendance,
  getExamsResultsByStudentId,
  IExamsResultsResponse,
  IExam,
  getQuizNewspaperByStudentId,
  IQuizNewspaperResponse,
  IQuiz,
  INewspaper,
} from '../../../../services/student/StudentAllApi';

interface DashboardData {
  personalInfo: {
    name: string;
    class: string;
    rollNo: string;
    profilePic: string;
    email: string;
  };
  attendance: {
    percentage: number;
    daysPresent: number;
    totalDays: number;
    recentRecords: Array<{
      date: string;
      status: string;
    }>;
  };
  fees: {
    pendingFees: IFee[];
    totalPending: number;
    paymentHistory: Array<{
      category: string;
      amount: number;
      date: string;
      method: string;
    }>;
  };
  timetable: ILesson[];
  notices: Array<{
  key: string;
  title: string;
  date: string;
  description: string;
  attachment: string;
  }>;
  events: Array<{
    id: string;
    title: string;
    date: string;
    description: string;
  }>;
  assignments: Array<{
  id: string;
    title: string;
    description: string;
    dueDate: string;
    status: string;
    subject: string;
  }>;
  exams: IExam[];
  quizzes: IQuiz[];
  newspapers: INewspaper[];
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
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
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const HomeDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const currentDay = daysOfWeek[currentDate.getDay()];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const studentId = localStorage.getItem('studentId');
        if (!studentId) {
          throw new Error('Student ID not found');
        }

        // Fetch all data in parallel
        const [
          userResponse,
          lessonsResponse,
          resourcesResponse,
          feesResponse,
          attendanceResponse,
          examsResponse,
          quizNewspaperResponse,
        ] = await Promise.all([
          getStudentUserById(),
          getLessonsByStudentId(studentId),
          getDashboardResourcesByStudentId(),
          getFeesByStudentId(studentId),
          getAttendanceLeavesByStudentId(studentId),
          getExamsResultsByStudentId(),
          getQuizNewspaperByStudentId(),
        ]);

        // Process personal info
        const personalInfo = {
          name: userResponse.data.name,
          class: userResponse.data.student.class?.name || 'N/A',
          rollNo: userResponse.data.student.rollNo || 'N/A',
          profilePic: userResponse.data.profilePic || '',
          email: userResponse.data.email,
        };

        // Process attendance
        let attendance = {
          percentage: 0,
          daysPresent: 0,
          totalDays: 0,
          recentRecords: [],
        };

        if (attendanceResponse.data.success) {
          const attendanceData = attendanceResponse.data.attendance;
          const totalDays = attendanceData.length;
          const presentDays = attendanceData.filter((a: IAttendance) => a.present).length;
          const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
          const recentRecords = attendanceData.slice(0, 10).map((a: IAttendance) => ({
            date: new Date(a.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
            status: a.present ? 'Present' : 'Absent',
          }));

          attendance = {
            percentage,
            daysPresent: presentDays,
            totalDays,
            recentRecords,
          };
        }

        // Process fees
        let fees = {
          pendingFees: [],
          totalPending: 0,
          paymentHistory: [],
        };

        if (feesResponse.data.success) {
          const feesData = feesResponse.data.fees;
          const pendingFees = feesData.filter((f: IFee) => f.status === 'Pending' || f.status === 'Overdue');
          const totalPending = pendingFees.reduce((sum: number, fee: IFee) => sum + (fee.amount - fee.amountPaid), 0);
          const paymentHistory = feesData.flatMap((f: IFee) =>
            f.Payment.map((p) => ({
              category: f.category,
              amount: p.amount,
              date: p.paymentDate,
              method: p.method || 'Unknown',
            }))
          );

          fees = {
            pendingFees,
            totalPending,
            paymentHistory,
          };
        }

        // Process timetable
        const timetable = lessonsResponse.data.success
          ? lessonsResponse.data.lessons.filter((lesson: ILesson) => lesson.day.toUpperCase() === currentDay)
          : [];

        // Process notices
        const notices = resourcesResponse.data.success
          ? resourcesResponse.data.notices
              .filter((notice: INotice) => new Date(notice.publishDate) <= new Date())
              .slice(0, 5)
              .map((notice: INotice) => ({
                key: notice.id,
                title: notice.title,
                date: new Date(notice.noticeDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }),
                description: notice.message,
                attachment: notice.attachment || '',
              }))
          : [];

        // Process events (using holidays as events for now)
        const events = resourcesResponse.data.success
          ? resourcesResponse.data.holidays
              .filter((holiday: IHoliday) => new Date(holiday.date) >= new Date())
              .slice(0, 5)
              .map((holiday: IHoliday) => ({
                id: holiday.id,
                title: holiday.name,
                date: new Date(holiday.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }),
                description: holiday.description || '',
              }))
          : [];

        // Process assignments (mock data for now)
        const assignments = [
          {
            id: '1',
            title: 'Mathematics Assignment',
            description: 'Complete exercises 1-10 from Chapter 5',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Pending',
            subject: 'Mathematics',
          },
          {
            id: '2',
            title: 'English Essay',
            description: 'Write a 500-word essay on environmental conservation',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Pending',
            subject: 'English',
          },
        ];

        // Process exams
        const exams = examsResponse.data.success ? examsResponse.data.exams.slice(0, 5) : [];

        // Process quizzes and newspapers
        const quizzes = quizNewspaperResponse.data.success ? quizNewspaperResponse.data.quizzes.slice(0, 5) : [];
        const newspapers = quizNewspaperResponse.data.success ? quizNewspaperResponse.data.newspapers.slice(0, 5) : [];

        setData({
          personalInfo,
          attendance,
          fees,
          timetable,
          notices,
          events,
          assignments,
          exams,
          quizzes,
          newspapers,
        });

        toast.success('Dashboard data loaded successfully!', { autoClose: 3000 });
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to load dashboard data';
        setError(errorMessage);
        toast.error(errorMessage, { autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatTime = (isoTime: string) => {
    if (!isoTime) return 'N/A';
    return new Date(isoTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isLessonOngoing = (startTime: string, endTime: string) => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    return currentTime >= start && currentTime <= end;
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'warning';
    return 'danger';
  };

  const getFeeStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const SkeletonPlaceholder = ({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) => (
    <span className={`placeholder bg-secondary ${className}`} style={style} />
  );

  if (isLoading) {
  return (
      <div className="container-fluid p-4 bg-light min-vh-100">
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
          <div className="placeholder-glow">
          <SkeletonPlaceholder className="col-6 mb-4" style={{ height: '2rem' }} />
            <div className="row g-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="col-md-4">
                <div className="card p-4">
                  <SkeletonPlaceholder className="col-4 mb-3" style={{ height: '1.5rem' }} />
                  <SkeletonPlaceholder className="col-6 mb-2" style={{ height: '2rem' }} />
                  <SkeletonPlaceholder className="col-8" style={{ height: '1rem' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid p-4 bg-light min-vh-100">
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        <div className="alert alert-danger d-flex justify-content-between align-items-start">
          <div>
            <h5 className="alert-heading">Error Loading Dashboard</h5>
            <p className="mb-0">{error}</p>
          </div>
          <button className="btn btn-outline-primary btn-sm" onClick={() => window.location.reload()}>
            <i className="bi bi-arrow-clockwise me-1"></i>Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container-fluid p-4 bg-light min-vh-100">
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        <div className="text-center text-muted">
          <i className="bi bi-exclamation-triangle display-1 mb-4"></i>
          <h3>No dashboard data available</h3>
          <p>Please try refreshing the page or contact support.</p>
        </div>
      </div>
    );
  }

  const { personalInfo, attendance, fees, timetable, notices, events, assignments, exams, quizzes, newspapers } = data;

  return (
    <ErrorBoundary>
      <div className="container-fluid p-4 bg-light min-vh-100">
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />

        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold text-dark mb-1">
                  <i className="bi bi-house-door text-primary me-2"></i>
                  Welcome back, {personalInfo.name}!
                </h2>
                <p className="text-muted mb-0">
                  {formatDate(currentDate.toISOString())} • {personalInfo.class} • Roll No: {personalInfo.rollNo}
                </p>
                    </div>
              <div className="text-end">
                <div className="badge bg-primary fs-6">
                  <i className="bi bi-clock me-1"></i>
                  {currentDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div
                  className={`bg-${getAttendanceColor(attendance.percentage)} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}
                  style={{ width: '60px', height: '60px' }}
                >
                  <i className={`bi bi-check-circle-fill text-${getAttendanceColor(attendance.percentage)} fs-3`}></i>
                </div>
                <h3 className="fw-bold text-dark mb-1">{attendance.percentage}%</h3>
                <p className="text-muted mb-0">Attendance</p>
                <small className="text-muted">
                  {attendance.daysPresent} of {attendance.totalDays} days
                </small>
              </div>
            </div>
                    </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-currency-dollar text-warning fs-3"></i>
                </div>
                <h3 className="fw-bold text-dark mb-1">₹{fees.totalPending.toLocaleString()}</h3>
                <p className="text-muted mb-0">Pending Fees</p>
                <small className="text-muted">{fees.pendingFees.length} items</small>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-calendar-event text-info fs-3"></i>
                </div>
                <h3 className="fw-bold text-dark mb-1">{events.length}</h3>
                <p className="text-muted mb-0">Upcoming Events</p>
                <small className="text-muted">This month</small>
              </div>
            </div>
                  </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-4">
                <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-book text-success fs-3"></i>
                </div>
                <h3 className="fw-bold text-dark mb-1">{assignments.length}</h3>
                <p className="text-muted mb-0">Active Assignments</p>
                <small className="text-muted">Due soon</small>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <ul className="nav nav-tabs card-header-tabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                      type="button"
                    >
                      <i className="bi bi-grid me-2"></i>Overview
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 'academics' ? 'active' : ''}`}
                      onClick={() => setActiveTab('academics')}
                      type="button"
                    >
                      <i className="bi bi-mortarboard me-2"></i>Academics
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 'activities' ? 'active' : ''}`}
                      onClick={() => setActiveTab('activities')}
                      type="button"
                    >
                      <i className="bi bi-activity me-2"></i>Activities
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 'services' ? 'active' : ''}`}
                      onClick={() => setActiveTab('services')}
                      type="button"
                    >
                      <i className="bi bi-gear me-2"></i>Services
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body p-4">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="row g-4">
                    {/* Today's Timetable */}
                    <div className="col-md-6">
                      <h5 className="fw-bold text-dark mb-3">
                        <i className="bi bi-calendar-week text-primary me-2"></i>
                        Today's Schedule ({currentDay.charAt(0) + currentDay.slice(1).toLowerCase()})
                      </h5>
                      {timetable.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                          {timetable.map((lesson, index) => (
                            <div
                              key={lesson.id}
                              className={`card p-3 border-0 shadow-sm ${
                                isLessonOngoing(lesson.startTime, lesson.endTime)
                                  ? 'border-2 border-success bg-success bg-opacity-10'
                                  : 'bg-white'
                              }`}
                            >
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <span className="badge bg-primary">
                                  <i className="bi bi-building me-1"></i>
                                  Room {lesson.roomNumber || 'N/A'}
                                </span>
                                {isLessonOngoing(lesson.startTime, lesson.endTime) && (
                                  <span className="badge bg-success">
                                    <i className="bi bi-play-circle me-1"></i>Ongoing
                                  </span>
                                )}
                              </div>
                              <h6 className="fw-bold text-dark mb-2">{lesson.subject.name}</h6>
                              <p className="text-muted mb-1">
                                <i className="bi bi-clock me-1"></i>
                                {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
                              </p>
                              <p className="text-muted mb-0">
                                <i className="bi bi-person me-1"></i>
                                {lesson.teacher.user.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <i className="bi bi-calendar-x display-4 text-muted mb-3"></i>
                          <p className="text-muted">No classes scheduled for today</p>
                        </div>
                      )}
                    </div>

                    {/* Upcoming Events */}
                    <div className="col-md-6">
                      <h5 className="fw-bold text-dark mb-3">
                        <i className="bi bi-calendar-event text-warning me-2"></i>
                        Upcoming Events
                      </h5>
                      {events.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                          {events.slice(0, 5).map((event) => (
                            <div key={event.id} className="card p-3 border-0 shadow-sm bg-white">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <span className="badge bg-warning text-dark">Event</span>
                                <small className="text-muted">{event.date}</small>
                              </div>
                              <h6 className="fw-bold text-dark mb-2">{event.title}</h6>
                              <p className="text-muted mb-0 small">{event.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <i className="bi bi-calendar-x display-4 text-muted mb-3"></i>
                          <p className="text-muted">No upcoming events</p>
                        </div>
                      )}
                    </div>

                    {/* Recent Assignments */}
                    <div className="col-12">
                      <h5 className="fw-bold text-dark mb-3">
                        <i className="bi bi-journal-text text-info me-2"></i>
                        Recent Assignments
                      </h5>
                      {assignments.length > 0 ? (
                        <div className="row g-3">
                          {assignments.slice(0, 4).map((assignment) => (
                            <div key={assignment.id} className="col-md-6">
                              <div className="card p-3 border-0 shadow-sm bg-white">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <span className={`badge bg-${getFeeStatusColor(assignment.status)}`}>
                                    {assignment.status}
                    </span>
                                  <small className="text-muted">Due: {formatDate(assignment.dueDate)}</small>
                                </div>
                                <h6 className="fw-bold text-dark mb-2">{assignment.title}</h6>
                                <p className="text-muted mb-2 small">{assignment.description}</p>
                                <p className="text-muted mb-0">
                                  <i className="bi bi-book me-1"></i>
                                  {assignment.subject}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <i className="bi bi-journal-x display-4 text-muted mb-3"></i>
                          <p className="text-muted">No assignments available</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Academics Tab */}
                {activeTab === 'academics' && (
                  <div className="row g-4">
                    {/* Recent Exams */}
                    <div className="col-md-6">
                      <h5 className="fw-bold text-dark mb-3">
                        <i className="bi bi-calendar-check text-danger me-2"></i>
                        Recent Exams
                      </h5>
                      {exams.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                          {exams.slice(0, 5).map((exam) => (
                            <div key={exam.id} className="card p-3 border-0 shadow-sm bg-white">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className="fw-bold text-dark mb-1">{exam.title}</h6>
                                  <p className="text-muted mb-0">{exam.subject.name}</p>
                                </div>
                                <small className="text-muted">{formatDate(exam.scheduleDate || exam.startTime)}</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <i className="bi bi-calendar-x display-4 text-muted mb-3"></i>
                          <p className="text-muted">No recent exams</p>
                        </div>
                        )}
                      </div>

                    {/* Attendance Records */}
                    <div className="col-md-6">
                      <h5 className="fw-bold text-dark mb-3">
                        <i className="bi bi-list-check text-success me-2"></i>
                        Recent Attendance
                      </h5>
                      {attendance.recentRecords.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                          {attendance.recentRecords.slice(0, 5).map((record, index) => (
                            <div key={index} className="card p-3 border-0 shadow-sm bg-white">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h6 className="fw-bold text-dark mb-1">{record.date}</h6>
                                  <p className="text-muted mb-0">Daily attendance</p>
                                </div>
                                <span className={`badge bg-${record.status === 'Present' ? 'success' : 'danger'}`}>
                                  {record.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <i className="bi bi-list-x display-4 text-muted mb-3"></i>
                          <p className="text-muted">No attendance records</p>
                        </div>
                  )}
                </div>
              </div>
                )}

                {/* Activities Tab */}
                {activeTab === 'activities' && (
                  <div className="row g-4">
                    {/* Quizzes */}
                    <div className="col-md-6">
                      <h5 className="fw-bold text-dark mb-3">
                        <i className="bi bi-puzzle text-warning me-2"></i>
                        Available Quizzes
                      </h5>
                      {quizzes.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                          {quizzes.slice(0, 3).map((quiz) => (
                            <div key={quiz.id} className="card p-3 border-0 shadow-sm bg-white">
                              <h6 className="fw-bold text-dark mb-2">{quiz.question}</h6>
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                  Score: {quiz.score || 'Not attempted'}
                                </small>
                                <button className="btn btn-sm btn-primary">Take Quiz</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <i className="bi bi-puzzle display-4 text-muted mb-3"></i>
                          <p className="text-muted">No quizzes available</p>
                        </div>
                      )}
                    </div>

                    {/* Newspapers */}
                    <div className="col-md-6">
                      <h5 className="fw-bold text-dark mb-3">
                        <i className="bi bi-newspaper text-info me-2"></i>
                        School Newspapers
                      </h5>
                      {newspapers.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                          {newspapers.slice(0, 3).map((newspaper) => (
                            <div key={newspaper.id} className="card p-3 border-0 shadow-sm bg-white">
                              <h6 className="fw-bold text-dark mb-2">{newspaper.title}</h6>
                              <p className="text-muted mb-2 small">{newspaper.content}</p>
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                  {formatDate(newspaper.createdAt)}
                                </small>
                                <button className="btn btn-sm btn-outline-primary">Read More</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <i className="bi bi-newspaper display-4 text-muted mb-3"></i>
                          <p className="text-muted">No newspapers available</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Services Tab */}
                {activeTab === 'services' && (
                  <div className="row g-4">
                    {/* Fee Details */}
                    <div className="col-md-6">
                      <h5 className="fw-bold text-dark mb-3">
                        <i className="bi bi-currency-dollar text-success me-2"></i>
                        Fee Details
                      </h5>
                      {fees.pendingFees.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                          {fees.pendingFees.slice(0, 3).map((fee) => (
                            <div key={fee.id} className="card p-3 border-0 shadow-sm bg-white">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <span className={`badge bg-${getFeeStatusColor(fee.status)}`}>
                                  {fee.status}
                                </span>
                                <small className="text-muted">Due: {formatDate(fee.dueDate)}</small>
                              </div>
                              <h6 className="fw-bold text-dark mb-2">{fee.category}</h6>
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <p className="text-muted mb-0 small">
                                    Amount: ₹{fee.amount.toLocaleString()}
                                  </p>
                                  <p className="text-muted mb-0 small">
                                    Paid: ₹{fee.amountPaid.toLocaleString()}
                                  </p>
                                </div>
                                <button className="btn btn-sm btn-primary">Pay Now</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <i className="bi bi-check-circle display-4 text-success mb-3"></i>
                          <p className="text-muted">All fees are up to date!</p>
                        </div>
                      )}
                    </div>

                    {/* Notices */}
                    <div className="col-md-6">
                      <h5 className="fw-bold text-dark mb-3">
                        <i className="bi bi-bell text-warning me-2"></i>
                        Latest Notices
                      </h5>
                      {notices.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                          {notices.slice(0, 3).map((notice) => (
                            <div key={notice.key} className="card p-3 border-0 shadow-sm bg-white">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <span className="badge bg-info">Notice</span>
                                <small className="text-muted">{notice.date}</small>
                              </div>
                              <h6 className="fw-bold text-dark mb-2">{notice.title}</h6>
                              <p className="text-muted mb-0 small">{notice.description}</p>
                            </div>
                          ))}
                      </div>
                  ) : (
                        <div className="text-center py-4">
                          <i className="bi bi-bell display-4 text-muted mb-3"></i>
                          <p className="text-muted">No notices available</p>
                        </div>
                  )}
                </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default HomeDashboard;