import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAttendanceLeavesByStudentId, IAttendance, applyStudentLeave, getStudentLeaveRequests, ILeaveRequest } from '../../../../../services/student/StudentAllApi';
import { useSelector } from 'react-redux';
import ReactDOM from 'react-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type AttendanceData = {
  series: number[];
  details: { key: string; date: string; status: string; lesson: string; subject: string }[];
};

const Attendancechartstudent: React.FC = () => {
  const [data, setData] = useState<AttendanceData | null>(null);
  const [modalType, setModalType] = useState<'none' | 'details' | 'leave'>("none");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'leaves'>('overview');
  const [leaveRequests, setLeaveRequests] = useState<ILeaveRequest[]>([]);
  const [isLoadingLeaves, setIsLoadingLeaves] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    isSubmitting: false,
  });
  const [prevApprovedIds, setPrevApprovedIds] = useState<string[]>([]);

  // Get theme from Redux
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);

  const student = useSelector((state: any) => state.auth?.user?.student);
  const documents = [
    student?.medicalCertificate && {
      name: "Medical Certificate.pdf",
      url: student.medicalCertificate,
    },
    student?.transferCertificate && {
      name: "Transfer Certificate.pdf",
      url: student.transferCertificate,
    },
  ].filter(Boolean);

  const leaveTypes = [
    'Medical Leave',
    'Casual Leave',
    'Maternity Leave',
    'Sick Leave',
    'Other',
  ];

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setIsLoading(true);
    const studentId = localStorage.getItem("studentId"); 
        
        if (!studentId) {
          throw new Error('Student ID not found');
        }

        const response = await getAttendanceLeavesByStudentId(studentId);
        
          if (response.data.success) {
            const details = response.data.attendance.map((entry: IAttendance) => ({
              key: entry.id,
              date: new Date(entry.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              status: entry.present ? 'Present' : 'Absent', 
              lesson: entry.lesson.name,
              subject: entry.lesson.subject.name,
            }));
          
            const present = details.filter((d) => d.status === 'Present').length;
            const absent = details.filter((d) => d.status === 'Absent').length;
          const late = 0; // Assuming no late status
            const series = [present, absent, late];
          
          setData({ series, details });
        } else {
          throw new Error('Failed to load attendance data');
        }
      } catch (error: any) {
        console.error('Error fetching attendance:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchLeaveRequests = async () => {
      try {
        setIsLoadingLeaves(true);
        const response = await getStudentLeaveRequests();
        setLeaveRequests(response.data || []);
      } catch (error: any) {
        console.error('Error fetching leave requests:', error);
      } finally {
        setIsLoadingLeaves(false);
      }
    };

    fetchAttendanceData();
    fetchLeaveRequests();
  }, []);

  useEffect(() => {
    if (modalType !== 'none') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalType]);

  const openDetailsModal = () => {
    setActiveTab('details');
    setModalType('details');
  };

  const openLeaveModal = () => setModalType('leave');
  const closeModal = () => setModalType('none');

  const calculateAttendancePercentage = () => {
    const present = data?.details.filter((entry) => entry.status === 'Present').length || 0;
    const total = data?.details.length || 0;
    return total === 0 ? '0.00' : ((present / total) * 100).toFixed(2);
  };

  const getAttendanceStatus = (percentage: string) => {
    const num = parseFloat(percentage);
    if (num >= 90) return { status: 'Excellent', color: 'success', icon: 'bi-emoji-smile' };
    if (num >= 80) return { status: 'Good', color: 'info', icon: 'bi-emoji-neutral' };
    if (num >= 70) return { status: 'Fair', color: 'warning', icon: 'bi-emoji-frown' };
    return { status: 'Needs Improvement', color: 'danger', icon: 'bi-emoji-dizzy' };
  };

  const handleLeaveInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { leaveType, startDate, endDate, reason } = leaveForm;
    if (!leaveType || !startDate || !endDate || !reason) {
      return;
    }
    setLeaveForm((f) => ({ ...f, isSubmitting: true }));
    try {
      const userId = localStorage.getItem('studentId');
      if (!userId) throw new Error('Student ID not found');
      await applyStudentLeave({
        userId,
        reason: `${leaveType}: ${reason}`,
        fromDate: startDate,
        toDate: endDate,
        status: 'pending',
        leaveType,
      });
      toast.success('Leave applied successfully!');
      closeModal();
      setLeaveForm({ leaveType: '', startDate: '', endDate: '', reason: '', isSubmitting: false });
      const response = await getStudentLeaveRequests();
      setLeaveRequests(response.data || []);
    } catch (error: any) {
      setLeaveForm((f) => ({ ...f, isSubmitting: false }));
      toast.error(error.message || 'Failed to apply leave');
    }
  };

  useEffect(() => {
    if (leaveRequests.length > 0) {
      const approvedIds = leaveRequests.filter(l => l.status === 'APPROVED').map(l => l.id);
      const newApproved = approvedIds.filter(id => !prevApprovedIds.includes(id));
      // if (newApproved.length > 0) {
      //   toast.success('Your leave has been approved!');
      // }
      setPrevApprovedIds(approvedIds);
    }
  }, [leaveRequests]);

  if (isLoading) {
    return (
      <div className="card flex-fill p-4 bg-white rounded-lg shadow-sm border-0">
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-primary mb-2">Loading Attendance Data</h5>
          <p className="text-muted mb-0">Please wait while we fetch your attendance information...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card flex-fill p-4 bg-white rounded-lg shadow-sm border-0">
        <div className="text-center py-5">
          <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
            <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '2rem' }}></i>
          </div>
          <h5 className="text-dark mb-2">No Attendance Data Available</h5>
          <p className="text-muted mb-3">We couldn't find any attendance records for you at the moment.</p>
          <button className="btn btn-outline-primary" onClick={() => window.location.reload()}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const attendanceStatus = getAttendanceStatus(calculateAttendancePercentage());
  const presentCount = data.details.filter(d => d.status === 'Present').length;
  const absentCount = data.details.filter(d => d.status === 'Absent').length;
  const totalDays = data.details.length;

  const chartOptions = {
    chart: {
      type: 'donut' as const,
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 2,
        left: 0,
        blur: 4,
        opacity: 0.1,
      },
    },
    labels: ['Present', 'Absent', 'Late'],
    colors: ['#28a745', '#dc3545', '#ffc107'],
    legend: {
      position: 'bottom' as const,
      fontSize: '14px',
      fontFamily: 'inherit',
      labels: { colors: '#6c757d' },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      style: { 
        fontSize: '14px',
        fontWeight: 'bold',
        colors: ['#fff', '#fff', '#000'],
      },
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 1,
        left: 1,
        blur: 2,
        opacity: 0.3,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '16px',
              fontFamily: 'inherit',
              color: '#6c757d',
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '24px',
              fontFamily: 'inherit',
              fontWeight: 'bold',
              color: '#495057',
              offsetY: 5,
            },
            total: {
              show: true,
              label: 'Total Days',
              fontSize: '14px',
              fontFamily: 'inherit',
              color: '#6c757d',
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 280 },
          legend: { position: 'bottom' as const },
        },
      },
    ],
  };

  const detailsWithRealTime = data.details.map((entry) => ({
    ...entry,
    date: new Date(entry.date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }),
  }));

  // Render modals using React Portal to ensure they are always centered relative to the viewport
  const modalRoot = document.getElementById('modal-root') || document.body;

  return (
    <div className="card flex-fill p-4 bg-white rounded-lg shadow-sm border-0">
      
      {/* Header */}
      <div className="card-header bg-transparent border-0 mb-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <h4 className="fw-bold text-dark mb-1">
              <i className="bi bi-graph-up text-primary me-2"></i>
              Attendance Overview
            </h4>
            <p className="text-muted mb-0">Track your daily attendance and performance</p>
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button className="btn btn-outline-primary btn-sm" onClick={openLeaveModal}>
              <i className="bi bi-plus-circle me-1"></i>
              <span className="d-none d-sm-inline">Apply Leave</span>
              <span className="d-inline d-sm-none">Leave</span>
            </button>
            <span className={`badge bg-${attendanceStatus.color} px-3 py-2 d-none d-md-inline-block pulse`}>
              <i className={`bi ${attendanceStatus.icon} me-2 fs-4 bounce`}></i>
              <span className="fs-5 fw-bold align-middle">{attendanceStatus.status}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Applied Leaves Section */}
      {leaveRequests.length > 0 && (
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="fw-bold text-dark mb-0">
              <i className="bi bi-calendar-check text-info me-2"></i>
              Applied Leaves ({leaveRequests.length})
            </h6>
            <button 
              className="btn btn-outline-info btn-sm"
              onClick={openDetailsModal}
            >
              <i className="bi bi-eye me-1"></i>
              View All
            </button>
          </div>
          <div className="row g-2">
            {leaveRequests.slice(0, 3).map((leave, index) => {
              const leaveType = leave.reason?.split(':')[0] || 'Leave';
              const fromDate = leave.fromDate ? new Date(leave.fromDate) : null;
              const toDate = leave.toDate ? new Date(leave.toDate) : null;
              const dateRange = fromDate && toDate
                ? `${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`
                : 'Date not specified';
              const status = leave.status || 'Pending';
              return (
              <div key={leave.id || index} className="col-md-4">
                <div className="bg-light rounded-3 p-3 border-start border-3 border-info">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                      <small className="text-muted">{leaveType}</small>
                      <span className={`badge ${status === 'APPROVED' ? 'bg-success' : status === 'REJECTED' ? 'bg-danger' : 'bg-warning'} small`}>
                        {status}
                    </span>
                  </div>
                  <div className="small text-muted">
                      {dateRange}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card-body p-0">
        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className={`bg-success bg-opacity-10 rounded-3 p-3 text-center border border-success border-opacity-25${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}>
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="bi bi-check-circle-fill text-success fs-4 me-2"></i>
                <h3 className="fw-bold text-success mb-0">{presentCount}</h3>
              </div>
              <p className={`fw-medium mb-0${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}>Present Days</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className={`bg-danger bg-opacity-10 rounded-3 p-3 text-center border border-danger border-opacity-25${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}>
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="bi bi-x-circle-fill text-danger fs-4 me-2"></i>
                <h3 className="fw-bold text-danger mb-0">{absentCount}</h3>
              </div>
              <p className={`fw-medium mb-0${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}>Absent Days</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className={`bg-primary bg-opacity-10 rounded-3 p-3 text-center border border-primary border-opacity-25${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}>
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="bi bi-calendar-check text-primary fs-4 me-2"></i>
                <h3 className="fw-bold text-primary mb-0">{totalDays}</h3>
              </div>
              <p className={`fw-medium mb-0${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}>Total Days</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="row align-items-center">
          <div className="col-lg-5 mb-4 mb-lg-0">
            <div className="text-center text-lg-start">
              <div className="mb-3">
                <h2 className="fw-bold text-primary mb-1 pulse" style={{ fontSize: '2rem' }}>
                  <span className="fs-1" style={{ fontWeight: 700 }}>{calculateAttendancePercentage()}<span className="fs-5 align-top">%</span></span>
                </h2>
                <p className="text-muted mb-2">Overall Attendance Rate</p>
                <div className="d-md-none mb-3">
                  <span className={`badge bg-${attendanceStatus.color} px-4 py-3 pulse`}>
                    <i className={`bi ${attendanceStatus.icon} me-2 fs-2 bounce`}></i>
                    <span className="fs-3 fw-bold align-middle">{attendanceStatus.status}</span>
                  </span>
                </div>
              </div>
              
              <div className="bg-light rounded-3 p-3 mb-3">
                <div className="row text-center">
                  <div className="col-6">
                    <small className="text-muted d-block">Present</small>
                    <span className="fw-bold text-success">{presentCount}</span>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">Absent</small>
                    <span className="fw-bold text-danger">{absentCount}</span>
                  </div>
                </div>
              </div>

              <button 
                className="btn btn-primary btn-lg w-100 w-lg-auto"
                onClick={openDetailsModal}
              >
                <i className="bi bi-list-ul me-2"></i>
                View Detailed Records
              </button>
            </div>
          </div>
          
          <div className="col-lg-7">
            <div className="d-flex justify-content-center">
              <ReactApexChart 
                options={chartOptions} 
                series={data.series} 
                type="donut" 
                height={350} 
                width="100%" 
          />
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {modalType === 'details' && ReactDOM.createPortal(
        <>
          <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex={-1}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div
                className={`modal-content${dataTheme === 'dark_data_theme' ? ' bg-dark text-light border-secondary' : ' bg-white'}`}
                style={{
                  background: dataTheme === 'dark_data_theme' ? '#23272b' : '#fff',
                  boxShadow: '0 0 24px rgba(0,0,0,0.3)',
                  border: dataTheme === 'dark_data_theme' ? '1px solid #fff' : undefined,
                }}
              >
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-list-check me-2"></i>
                    Attendance & Leave Details
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={closeModal} aria-label="Close"></button>
                </div>
                <div className={`modal-body p-0${dataTheme === 'dark_data_theme' ? ' bg-dark text-light' : ''}`}>
                  <ul className="nav nav-tabs nav-fill" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button 
                        className={`nav-link${activeTab === 'overview' ? ' active' : ''}${dataTheme === 'dark_data_theme' ? (activeTab === 'overview' ? ' bg-dark text-light border border-secondary' : ' text-light') : ''}`}
                        onClick={() => setActiveTab('overview')}
                      >
                        <i className={`bi bi-graph-up me-2${dataTheme === 'dark_data_theme' ? ' text-light' : ' text-primary'}`}></i>
                        Overview
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button 
                        className={`nav-link${activeTab === 'details' ? ' active' : ''}${dataTheme === 'dark_data_theme' ? (activeTab === 'details' ? ' bg-dark text-light border border-secondary' : ' text-light') : ''}`}
                        onClick={() => setActiveTab('details')}
                      >
                        <i className={`bi bi-list-ul me-2${dataTheme === 'dark_data_theme' ? ' text-light' : ' text-primary'}`}></i>
                        Attendance Records
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button 
                        className={`nav-link${activeTab === 'leaves' ? ' active' : ''}${dataTheme === 'dark_data_theme' ? (activeTab === 'leaves' ? ' bg-dark text-light border border-secondary' : ' text-light') : ''}`}
                        onClick={() => setActiveTab('leaves')}
                      >
                        <i className={`bi bi-calendar-check me-2${dataTheme === 'dark_data_theme' ? ' text-light' : ' text-primary'}`}></i>
                        Leave Requests
                        {leaveRequests.length > 0 && (
                          <span className="badge bg-danger ms-2">{leaveRequests.length}</span>
                        )}
                      </button>
                    </li>
                  </ul>

                  <div className={`tab-content p-4${dataTheme === 'dark_data_theme' ? ' bg-dark text-light' : ''}`}>
                    {activeTab === 'overview' && (
                      <div className="tab-pane fade show active">
                        <div className="row g-4">
                          <div className="col-md-6">
                            <div className={`card border-0${dataTheme === 'dark_data_theme' ? ' bg-dark text-light border-secondary' : ' bg-light'}`}>
                              <div className="card-body text-center">
                                <h4 className="fw-bold" style={{ color: dataTheme === 'dark_data_theme' ? '#4ade80' : '' }}>{presentCount}</h4>
                                <p className={`mb-0${dataTheme === 'dark_data_theme' ? ' text-secondary' : ' text-muted'}`}>Present Days</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className={`card border-0${dataTheme === 'dark_data_theme' ? ' bg-dark text-light border-secondary' : ' bg-light'}`}>
                              <div className="card-body text-center">
                                <h4 className="fw-bold" style={{ color: dataTheme === 'dark_data_theme' ? '#f87171' : '' }}>{absentCount}</h4>
                                <p className={`mb-0${dataTheme === 'dark_data_theme' ? ' text-secondary' : ' text-muted'}`}>Absent Days</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className={`card border-0${dataTheme === 'dark_data_theme' ? ' bg-dark text-light border-secondary' : ' bg-light'}`}>
                              <div className="card-body text-center">
                                <h4 className="fw-bold" style={{ color: dataTheme === 'dark_data_theme' ? '#60a5fa' : '' }}>{calculateAttendancePercentage()}%</h4>
                                <p className={`mb-0${dataTheme === 'dark_data_theme' ? ' text-secondary' : ' text-muted'}`}>Attendance Rate</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'details' && (
                      <div className="tab-pane fade show active">
                        <div className={`table-responsive${dataTheme === 'dark_data_theme' ? ' bg-dark border border-secondary rounded-2 p-2' : ''}`}>
                          <table className={`table${dataTheme === 'dark_data_theme' ? ' table-dark text-light border-secondary' : ''}`}>
                            <thead className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : 'table-primary'}>
                              <tr>
                                <th scope="col" className="border-0">
                                  <i className="bi bi-calendar me-1"></i>
                                  Date & Time
                                </th>
                                <th scope="col" className="border-0">
                                  <i className="bi bi-check-circle me-1"></i>
                                  Status
                                </th>
                                <th scope="col" className="border-0">
                                  <i className="bi bi-book me-1"></i>
                                  Lesson
                                </th>
                                <th scope="col" className="border-0">
                                  <i className="bi bi-mortarboard me-1"></i>
                                  Subject
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {detailsWithRealTime.map((record, index) => (
                                <tr key={record.key} className={dataTheme === 'dark_data_theme' ? '' : (index % 2 === 0 ? 'table-light' : '')}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div className={`bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3${dataTheme === 'dark_data_theme' ? ' bg-opacity-25' : ''}`} style={{ width: '40px', height: '40px' }}>
                                        <i className="bi bi-calendar3 text-primary"></i>
                                      </div>
                                      <div>
                                        <span className={`fw-medium${dataTheme === 'dark_data_theme' ? ' text-light' : ' text-dark'}`}>{record.date}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <span className={`badge ${record.status === 'Present' ? 'bg-success' : 'bg-danger'} fs-6 px-3 py-2`}>
                                      <i className={`bi ${record.status === 'Present' ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                                      {record.status}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <i className="bi bi-book text-info me-2"></i>
                                      <span className={dataTheme === 'dark_data_theme' ? 'text-light' : 'text-muted'}>{record.lesson}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <i className="bi bi-mortarboard text-warning me-2"></i>
                                      <span className={dataTheme === 'dark_data_theme' ? 'text-light' : 'text-muted'}>{record.subject}</span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {activeTab === 'leaves' && (
                      <div className="tab-pane fade show active">
                        {isLoadingLeaves ? (
                          <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className={`mt-3${dataTheme === 'dark_data_theme' ? ' text-light' : ' text-muted'}`}>Loading leave requests...</p>
                          </div>
                        ) : leaveRequests.length > 0 ? (
                          <div className={`table-responsive${dataTheme === 'dark_data_theme' ? ' bg-dark border border-secondary rounded-2 p-2' : ''}`}>
                            <table className={`table${dataTheme === 'dark_data_theme' ? ' table-dark text-light border-secondary' : ''}`}>
                              <thead className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : 'table-light'}>
                                <tr>
                                  <th className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : ''}>Type</th>
                                  <th className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : ''}>Date Range</th>
                                  <th className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : ''}>Duration</th>
                                  <th className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : ''}>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {leaveRequests.map((leave, idx) => {
                                  const leaveType = leave.reason?.split(':')[0] || '-';
                                  const fromDate = leave.fromDate ? new Date(leave.fromDate) : null;
                                  const toDate = leave.toDate ? new Date(leave.toDate) : null;
                                  const dateRange = fromDate && toDate
                                    ? `${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`
                                    : 'Date not specified';
                                  const duration = fromDate && toDate
                                    ? (Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1)
                                    : '-';
                                  const status = leave.status || leave.isApproved || 'Pending';
                                  return (
                                    <tr key={leave.id || idx} className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : ''}>
                                      <td className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : ''}>{leaveType}</td>
                                      <td className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : ''}>{dateRange}</td>
                                      <td className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : ''}>{duration}</td>
                                      <td className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : ''}>
                                        <span className={`badge bg-${status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'danger' : status === 'PENDING' ? 'warning' : 'secondary'}`}>{status}</span>
                                    </td>
                                  </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className={dataTheme === 'dark_data_theme' ? 'text-secondary' : 'text-muted'}>No leave requests found.</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className={`modal-footer${dataTheme === 'dark_data_theme' ? ' bg-dark border-secondary' : ' bg-light'}`}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={closeModal}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Close
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={() => window.print()}
                  >
                    <i className="bi bi-printer me-1"></i>
                    Print Report
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            style={{
              background: dataTheme === 'dark_data_theme' ? 'rgba(0,0,0,0.6)' : '',
              zIndex: 1040,
            }}
          ></div>
        </>,
        modalRoot
      )}

      {/* Apply Leave Modal */}
      {modalType === 'leave' && ReactDOM.createPortal(
        <>
          <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div
                className={`modal-content${dataTheme === 'dark_data_theme' ? ' bg-dark text-light border-secondary' : ' bg-white'}`}
                style={{
                  background: dataTheme === 'dark_data_theme' ? '#23272b' : '#fff',
                  boxShadow: '0 0 24px rgba(0,0,0,0.3)',
                  border: dataTheme === 'dark_data_theme' ? '1px solid #fff' : undefined,
                }}
              >
              <form onSubmit={handleApplyLeave}>
                  <div className={`modal-header bg-primary text-white`}>
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-plus-circle me-2"></i>Apply Leave
                  </h5>
                    <button type="button" className="btn-close btn-close-white" onClick={closeModal} aria-label="Close"></button>
                </div>
                  <div className={`modal-body p-4${dataTheme === 'dark_data_theme' ? ' bg-dark text-light' : ''}`}>
                  <div className="row g-3">
                    <div className="col-md-6">
                        <label className={`form-label fw-medium${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}>Leave Type</label>
                        <select
                          className={`form-select${dataTheme === 'dark_data_theme' ? ' bg-dark text-light border-secondary' : ''}`}
                          name="leaveType"
                          value={leaveForm.leaveType}
                          onChange={handleLeaveInput}
                          required
                          style={dataTheme === 'dark_data_theme' ? { color: '#fff', backgroundColor: '#23272b', borderColor: '#fff' } : {}}
                        >
                          <option value="" style={dataTheme === 'dark_data_theme' ? { color: '#aaa', backgroundColor: '#23272b' } : {}}>Select Leave Type</option>
                        {leaveTypes.map((type) => (
                            <option key={type} value={type} style={dataTheme === 'dark_data_theme' ? { color: '#fff', backgroundColor: '#23272b' } : {}}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                        <label className={`form-label fw-medium${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}>Start Date</label>
                        <input type="date" className={`form-control${dataTheme === 'dark_data_theme' ? ' bg-dark text-light border-secondary' : ''}`} name="startDate" value={leaveForm.startDate} onChange={handleLeaveInput} required placeholder="dd-mm-yyyy" style={dataTheme === 'dark_data_theme' ? { color: '#fff', backgroundColor: '#23272b', borderColor: '#fff' } : {}} />
                    </div>
                    <div className="col-md-6">
                        <label className={`form-label fw-medium${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}>End Date</label>
                        <input type="date" className={`form-control${dataTheme === 'dark_data_theme' ? ' bg-dark text-light border-secondary' : ''}`} name="endDate" value={leaveForm.endDate} onChange={handleLeaveInput} required min={leaveForm.startDate} placeholder="dd-mm-yyyy" style={dataTheme === 'dark_data_theme' ? { color: '#fff', backgroundColor: '#23272b', borderColor: '#fff' } : {}} />
                    </div>
                    <div className="col-md-6">
                        <label className={`form-label fw-medium${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}>Duration</label>
                        <div className={`form-control-plaintext${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}>Select dates</div>
                    </div>
                    <div className="col-12">
                        <label className={`form-label fw-medium${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}>Reason</label>
                        <textarea className={`form-control${dataTheme === 'dark_data_theme' ? ' bg-dark text-light border-secondary' : ''}`} name="reason" rows={4} value={leaveForm.reason} onChange={handleLeaveInput} required placeholder="Please provide a detailed reason for your leave request..." style={dataTheme === 'dark_data_theme' ? { color: '#fff', backgroundColor: '#23272b', borderColor: '#fff' } : {}}></textarea>
                    </div>
                  </div>
                  <div className="mt-4">
                      <h6 className={`fw-bold mb-2${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}>Your Leave Requests</h6>
                    {leaveRequests.length > 0 ? (
                        <div className={`table-responsive${dataTheme === 'dark_data_theme' ? ' bg-dark border border-secondary rounded-2 p-2' : ''}`}>
                          <table className={`table${dataTheme === 'dark_data_theme' ? ' table-dark text-light border-secondary' : ''}`}>
                            <thead className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : 'table-light'}>
                            <tr>
                                <th className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : ''}>Type</th>
                                <th className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : ''}>Date Range</th>
                                <th className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : ''}>Duration</th>
                                <th className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : ''}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                              {leaveRequests.map((leave, idx) => {
                                const leaveType = leave.reason?.split(':')[0] || '-';
                                const fromDate = leave.fromDate ? new Date(leave.fromDate) : null;
                                const toDate = leave.toDate ? new Date(leave.toDate) : null;
                                const dateRange = fromDate && toDate
                                  ? `${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`
                                  : 'Date not specified';
                                const duration = fromDate && toDate
                                  ? (Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1)
                                  : '-';
                                const status = leave.status || leave.isApproved || 'Pending';
                                return (
                                  <tr key={leave.id || idx} className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : ''}>
                                    <td className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : ''}>{leaveType}</td>
                                    <td className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : ''}>{dateRange}</td>
                                    <td className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : ''}>{duration}</td>
                                    <td className={dataTheme === 'dark_data_theme' ? 'bg-dark text-light border-secondary' : ''}>
                                      <span className={`badge bg-${status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'danger' : status === 'PENDING' ? 'warning' : 'secondary'}`}>{status}</span>
                                </td>
                              </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                        <div className={dataTheme === 'dark_data_theme' ? 'text-secondary' : 'text-muted'}>No leave requests found.</div>
                    )}
                  </div>
                </div>
                  <div className={`modal-footer${dataTheme === 'dark_data_theme' ? ' bg-dark border-secondary' : ' bg-light'}`}>
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    <i className="bi bi-x-circle me-1"></i>Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={leaveForm.isSubmitting}>
                    {leaveForm.isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Applying...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-1"></i>Apply Leave
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
          <div
            className="modal-backdrop fade show"
            style={{
              background: dataTheme === 'dark_data_theme' ? 'rgba(0,0,0,0.6)' : '',
              zIndex: 1040,
            }}
          ></div>
        </>,
        modalRoot
      )}
      <ToastContainer position="top-center" autoClose={3000} theme={dataTheme === 'dark_data_theme' ? 'dark' : 'colored'} />
    </div>
  );
};

export default Attendancechartstudent;