import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAttendanceLeavesByStudentId, IAttendance, applyStudentLeave, getStudentLeaveRequests, ILeaveRequest } from '../../../../../services/student/StudentAllApi';

type AttendanceData = {
  series: number[];
  details: { key: string; date: string; status: string; lesson: string; subject: string }[];
};

const Attendancechartstudent: React.FC = () => {
  const [data, setData] = useState<AttendanceData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'leaves'>('overview');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<ILeaveRequest[]>([]);
  const [isLoadingLeaves, setIsLoadingLeaves] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
    isSubmitting: false,
  });

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
          toast.success('📊 Attendance data loaded successfully!', { autoClose: 3000 });
        } else {
          throw new Error('Failed to load attendance data');
        }
      } catch (error: any) {
        console.error('Error fetching attendance:', error);
        toast.error(error.message || 'Failed to load attendance data', { autoClose: 3000 });
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
    if (isModalVisible || showLeaveModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalVisible, showLeaveModal]);

  const handleShowDetails = () => {
    setActiveTab('details');
    setIsModalVisible(true);
    toast.success('📋 Showing attendance details', { autoClose: 3000 });
  };

  const handleCloseDetails = () => {
    setIsModalVisible(false);
    setActiveTab('overview');
  };

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
    const { leaveType, fromDate, toDate, reason } = leaveForm;
    if (!leaveType || !fromDate || !toDate || !reason) {
      toast.error('Please fill in all fields');
      return;
    }
    setLeaveForm((f) => ({ ...f, isSubmitting: true }));
    try {
      const userId = localStorage.getItem('studentId');
      if (!userId) throw new Error('Student ID not found');
      await applyStudentLeave({
        userId,
        reason: `${leaveType}: ${reason}`,
        fromDate,
        toDate,
        status: 'pending',
        leaveType,
      });
      toast.success('Leave applied successfully!');
      setShowLeaveModal(false);
      setLeaveForm({ leaveType: '', fromDate: '', toDate: '', reason: '', isSubmitting: false });
      
      const response = await getStudentLeaveRequests();
      setLeaveRequests(response.data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to apply leave');
      setLeaveForm((f) => ({ ...f, isSubmitting: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="card flex-fill p-4 bg-white rounded-lg shadow-sm border-0">
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
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
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
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

  return (
    <div className="card flex-fill p-4 bg-white rounded-lg shadow-sm border-0">
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      
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
            <button className="btn btn-outline-primary btn-sm" onClick={() => setShowLeaveModal(true)}>
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
              onClick={() => setIsModalVisible(true)}
            >
              <i className="bi bi-eye me-1"></i>
              View All
            </button>
          </div>
          <div className="row g-2">
            {leaveRequests.slice(0, 3).map((leave, index) => (
              <div key={leave.id || index} className="col-md-4">
                <div className="bg-light rounded-3 p-3 border-start border-3 border-info">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <small className="text-muted">{leave.reason?.split(':')[0] || 'Leave'}</small>
                    <span className={`badge ${leave.status === 'APPROVED' ? 'bg-success' : leave.status === 'REJECTED' ? 'bg-danger' : 'bg-warning'} small`}>
                      {leave.status || 'Pending'}
                    </span>
                  </div>
                  <div className="small text-muted">
                    {leave.fromDate && leave.toDate ? (
                      <>
                        {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                      </>
                    ) : (
                      'Date not specified'
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card-body p-0">
        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="bg-success bg-opacity-10 rounded-3 p-3 text-center border border-success border-opacity-25">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="bi bi-check-circle-fill text-success fs-4 me-2"></i>
                <h3 className="fw-bold text-success mb-0">{presentCount}</h3>
              </div>
              <p className="text-success fw-medium mb-0">Present Days</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-danger bg-opacity-10 rounded-3 p-3 text-center border border-danger border-opacity-25">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="bi bi-x-circle-fill text-danger fs-4 me-2"></i>
                <h3 className="fw-bold text-danger mb-0">{absentCount}</h3>
              </div>
              <p className="text-danger fw-medium mb-0">Absent Days</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-primary bg-opacity-10 rounded-3 p-3 text-center border border-primary border-opacity-25">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="bi bi-calendar-check text-primary fs-4 me-2"></i>
                <h3 className="fw-bold text-primary mb-0">{totalDays}</h3>
              </div>
              <p className="text-primary fw-medium mb-0">Total Days</p>
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
                onClick={handleShowDetails}
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

      {/* Bootstrap Modal */}
      {isModalVisible && (
        <>
          <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex={-1}>
            <div className="modal-dialog modal-xl">
              <div className="modal-content border-0 shadow">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-list-check me-2"></i>
                    Attendance & Leave Details
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={handleCloseDetails}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body p-0">
                  <ul className="nav nav-tabs nav-fill" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button 
                        className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                      >
                        <i className="bi bi-graph-up me-2"></i>
                        Overview
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button 
                        className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                        onClick={() => setActiveTab('details')}
                      >
                        <i className="bi bi-list-ul me-2"></i>
                        Attendance Records
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button 
                        className={`nav-link ${activeTab === 'leaves' ? 'active' : ''}`}
                        onClick={() => setActiveTab('leaves')}
                      >
                        <i className="bi bi-calendar-check me-2"></i>
                        Leave Requests
                        {leaveRequests.length > 0 && (
                          <span className="badge bg-danger ms-2">{leaveRequests.length}</span>
                        )}
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content p-4">
                    {activeTab === 'overview' && (
                      <div className="tab-pane fade show active">
                        <div className="row g-4">
                          <div className="col-md-6">
                            <div className="card border-0 bg-light">
                              <div className="card-body text-center">
                                <h4 className="text-success fw-bold">{presentCount}</h4>
                                <p className="text-muted mb-0">Present Days</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="card border-0 bg-light">
                              <div className="card-body text-center">
                                <h4 className="text-danger fw-bold">{absentCount}</h4>
                                <p className="text-muted mb-0">Absent Days</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="card border-0 bg-light">
                              <div className="card-body text-center">
                                <h4 className="text-primary fw-bold">{calculateAttendancePercentage()}%</h4>
                                <p className="text-muted mb-0">Attendance Rate</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'details' && (
                      <div className="tab-pane fade show active">
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead className="table-primary">
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
                                <tr key={record.key} className={index % 2 === 0 ? 'table-light' : ''}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                        <i className="bi bi-calendar3 text-primary"></i>
                                      </div>
                                      <div>
                                        <span className="fw-medium text-dark">{record.date}</span>
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
                                      <span className="text-muted">{record.lesson}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <i className="bi bi-mortarboard text-warning me-2"></i>
                                      <span className="text-muted">{record.subject}</span>
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
                            <p className="mt-3 text-muted">Loading leave requests...</p>
                          </div>
                        ) : leaveRequests.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th>Type</th>
                                  <th>Date Range</th>
                                  <th>Duration</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {leaveRequests.map((leave, idx) => (
                                  <tr key={leave.id || idx}>
                                    <td>{leave.reason?.split(':')[0]}</td>
                                    <td>{leave.fromDate} - {leave.toDate}</td>
                                    <td>{leave.fromDate && leave.toDate ? (Math.ceil((new Date(leave.toDate).getTime() - new Date(leave.fromDate).getTime()) / (1000 * 60 * 60 * 24)) + 1) : '-'}</td>
                                    <td>
                                      <span className={`badge bg-${leave.status === 'APPROVED' ? 'success' : leave.status === 'REJECTED' ? 'bg-danger' : 'bg-warning'}`}>
                                        {leave.status || 'Pending'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-muted">No leave requests found.</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseDetails}
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
          <div className="modal-backdrop fade show" style={{ zIndex: 2040 }}></div>
        </>
      )}

      {/* Apply Leave Modal */}
      {showLeaveModal && (
        <div className="modal fade show" style={{ display: 'block', zIndex: 2050 }} tabIndex={-1} role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <form onSubmit={handleApplyLeave}>
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-plus-circle me-2"></i>Apply Leave
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowLeaveModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Leave Type</label>
                      <select className="form-select" name="leaveType" value={leaveForm.leaveType} onChange={handleLeaveInput} required>
                        <option value="">Select Leave Type</option>
                        {leaveTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">From Date</label>
                      <input type="date" className="form-control" name="fromDate" value={leaveForm.fromDate} onChange={handleLeaveInput} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">To Date</label>
                      <input type="date" className="form-control" name="toDate" value={leaveForm.toDate} onChange={handleLeaveInput} required min={leaveForm.fromDate} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Duration</label>
                      <div className="form-control-plaintext">
                        {leaveForm.fromDate && leaveForm.toDate ? (
                          <span className="text-primary fw-medium">
                            {Math.ceil((new Date(leaveForm.toDate).getTime() - new Date(leaveForm.fromDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                          </span>
                        ) : (
                          <span className="text-muted">Select dates</span>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Reason</label>
                      <textarea className="form-control" name="reason" rows={4} value={leaveForm.reason} onChange={handleLeaveInput} required placeholder="Please provide a detailed reason for your leave request..."></textarea>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h6 className="fw-bold mb-2">Your Leave Requests</h6>
                    {leaveRequests.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Type</th>
                              <th>Date Range</th>
                              <th>Duration</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {leaveRequests.map((leave, idx) => (
                              <tr key={leave.id || idx}>
                                <td>{leave.reason?.split(':')[0]}</td>
                                <td>{leave.fromDate} - {leave.toDate}</td>
                                <td>{leave.fromDate && leave.toDate ? (Math.ceil((new Date(leave.toDate).getTime() - new Date(leave.fromDate).getTime()) / (1000 * 60 * 60 * 24)) + 1) : '-'}</td>
                                <td>
                                  <span className={`badge bg-${leave.status === 'APPROVED' ? 'success' : leave.status === 'REJECTED' ? 'bg-danger' : 'bg-warning'}`}>
                                    {leave.status || 'Pending'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-muted">No leave requests found.</div>
                    )}
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowLeaveModal(false)}>
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
          <div className="modal-backdrop fade show" style={{ zIndex: 2040 }}></div>
        </div>
      )}
    </div>
  );
};

export default Attendancechartstudent;