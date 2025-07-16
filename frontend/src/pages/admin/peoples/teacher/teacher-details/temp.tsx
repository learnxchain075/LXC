import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactDOM from 'react-dom';
import useMobileDetection from '../../../../../core/common/mobileDetection';
import { all_routes } from '../../../../../router/all_routes';
import { getTeacherById } from '../../../../../services/admin/teacherRegistartion';
import { 
  getTeacherUIDashboardData, 
  getTeacherUILeaveBalances, 
  getTeacherUIAttendanceStats, 
  getTeacherUITodayAttendance, 
  getTeacherUIStudentLeaveRequests, 
  markTeacherUIAttendance, 
  markTeacherUIFaceAttendance, 
  approveTeacherUIStudentLeave, 
  rejectTeacherUIStudentLeave, 
  getTeacherUIClasses, 
  getTeacherUILessons, 
  applyTeacherLeave, 
  getTeacherSalaryInfo, 
  getTeacherLibraryBooks, 
  addTeacherExam,
  ITeacherUIDashboardData,
  ITeacherUIAttendance,
  ITeacherUIAttendanceStats,
  ITeacherUILeaveBalance,
  ITeacherUIStudentLeaveRequest,
  ITeacherUIClassData,
  ITeacherUILesson,
  uploadTeacherFace, 
} from '../../../../../services/teacher/teacherUIService';
import LoadingSkeleton from '../../../../../components/LoadingSkeleton';
import { getClassesByTeacherId } from '../../../../../services/teacher/classServices';
import { createExam } from '../../../../../services/teacher/examallApi';

interface TeacherData {
  id?: string;
  teacherSchoolId?: string;
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  dateofJoin?: string;
  qualification?: string;
  workExperience?: string;
  salary?: number;
  fatherName?: string;
  motherName?: string;
  maritalStatus?: string;
  languagesKnown?: string;
  panNumber?: string;
  address?: string;
  permanentAddress?: string;
  hostelName?: string;
  roomNumber?: string;
  route?: string;
  Resume?: string;
  joiningLetter?: string;
  contractType?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  user?: {
    name?: string;
    email?: string;
    address?: string;
    permanentAddress?: string;
  };
}

interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  attendanceRate: number;
  leaveBalance: number;
  upcomingClasses: number;
  recentActivities: number;
  pendingLeaves: number;
  todayClasses: number;
  assignmentsDue: number;
  notifications: number;
}

interface LeaveBalance {
  total: number;
  used: number;
  remaining: number;
}

interface ClassSchedule {
  id: string;
  className: string;
  subject: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
  day: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  isRead: boolean;
}

const ModalPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return typeof window !== 'undefined' ? ReactDOM.createPortal(children, document.body) : null;
};

// Modal Components

const LeaveRequestModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  request: ITeacherUIStudentLeaveRequest | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  loading?: boolean;
}> = React.memo(({ isOpen, onClose, request, onApprove, onReject, loading = false }) => {
  if (!isOpen || !request) return null;

  return (
    <ModalPortal>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh' }}></div>
      <div className="modal fade show" style={{ display: 'block', zIndex: 1050, position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', pointerEvents: 'none' }} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered modal-lg" style={{ pointerEvents: 'auto' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="ti ti-user-check me-2"></i>
                Student Leave Request Details
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="row">
                {/* Student Information */}
                <div className="col-md-6">
                  <h6 className="text-primary mb-3">
                    <i className="ti ti-user me-2"></i>
                    Student Information
                  </h6>
                  <div className="mb-3">
                    <strong>Student Name:</strong>
                    <p className="text-muted mb-1">{request.studentName}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Class:</strong>
                    <p className="text-muted mb-1">{request.studentClass}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Section:</strong>
                    <p className="text-muted mb-1">{request.studentSection}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Roll Number:</strong>
                    <p className="text-muted mb-1">{request.studentRollNumber}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="col-md-6">
                  <h6 className="text-primary mb-3">
                    <i className="ti ti-phone me-2"></i>
                    Contact Information
                  </h6>
                  <div className="mb-3">
                    <strong>Parent Contact:</strong>
                    <p className="text-muted mb-1">{request.parentContact}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Emergency Contact:</strong>
                    <p className="text-muted mb-1">{request.emergencyContact}</p>
                  </div>
                </div>

                {/* Leave Details */}
                <div className="col-12 mt-3">
                  <h6 className="text-primary mb-3">
                    <i className="ti ti-calendar me-2"></i>
                    Leave Details
                  </h6>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <strong>Leave Type:</strong>
                        <p className="text-muted mb-1">{request.leaveType}</p>
                      </div>
                      <div className="mb-3">
                        <strong>From Date:</strong>
                        <p className="text-muted mb-1">{new Date(request.fromDate).toLocaleDateString()}</p>
                      </div>
                      <div className="mb-3">
                        <strong>To Date:</strong>
                        <p className="text-muted mb-1">{new Date(request.toDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <strong>Status:</strong>
                        <span className={`badge bg-${
                          request.status === 'APPROVED' ? 'success' : 
                          request.status === 'REJECTED' ? 'danger' : 'warning'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      <div className="mb-3">
                        <strong>Submitted On:</strong>
                        <p className="text-muted mb-1">{new Date(request.createdAt).toLocaleDateString()}</p>
                      </div>
                      {request.approvalDate && (
                        <div className="mb-3">
                          <strong>Approved On:</strong>
                          <p className="text-muted mb-1">{new Date(request.approvalDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      {request.approvedBy && (
                        <div className="mb-3">
                          <strong>Approved By:</strong>
                          <p className="text-muted mb-1">{request.approvedBy}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="col-12 mt-3">
                  <h6 className="text-primary mb-3">
                    <i className="ti ti-message-circle me-2"></i>
                    Reason for Leave
                  </h6>
                  <div className="p-3 bg-light rounded">
                    <p className="mb-0">{request.reason}</p>
                  </div>
                </div>

                {/* Medical Certificate */}
                {request.medicalCertificate && (
                  <div className="col-12 mt-3">
                    <h6 className="text-primary mb-3">
                      <i className="ti ti-file-text me-2"></i>
                      Medical Certificate
                    </h6>
                    <div className="p-3 bg-light rounded">
                      <a href={request.medicalCertificate} className="btn btn-sm btn-outline-primary" target="_blank" rel="noopener noreferrer">
                        <i className="ti ti-download me-1"></i>
                        View Certificate
                      </a>
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                {request.rejectionReason && (
                  <div className="col-12 mt-3">
                    <h6 className="text-danger mb-3">
                      <i className="ti ti-alert-circle me-2"></i>
                      Rejection Reason
                    </h6>
                    <div className="p-3 bg-light rounded">
                      <p className="mb-0 text-danger">{request.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              {request.status === 'PENDING' && (
                <>
                  <button 
                    type="button" 
                    className="btn btn-danger me-2" 
                    onClick={() => onReject(request.id)}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Reject'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-success" 
                    onClick={() => onApprove(request.id)}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Approve'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
});

const FaceAttendanceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (file: File) => void;
  loading?: boolean;
}> = React.memo(({ isOpen, onClose, onConfirm, loading = false }) => {
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && !capturedFile) {
      (async () => {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play();
          }
        } catch (err) {
          alert('Could not access camera. Please allow camera access or try a different device.');
          onClose();
        }
      })();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setStream(null);
      setPreviewUrl(null);
      setCapturedFile(null);
    };
    // eslint-disable-next-line
  }, [isOpen]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], 'face-attendance.jpg', { type: 'image/jpeg' });
          setCapturedFile(file);
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
          }
        }
      }, 'image/jpeg', 0.95);
    }
  };

  const handleRetake = async () => {
    setCapturedFile(null);
    setPreviewUrl(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      alert('Could not access camera. Please allow camera access or try a different device.');
      onClose();
    }
  };

  const handleConfirm = () => {
    if (capturedFile && capturedFile instanceof File) {
      ////////console.log('Submitting captured file:', capturedFile);
      onConfirm(capturedFile);
    } else {
      alert('Please capture a valid image before submitting.');
    }
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setPreviewUrl(null);
    setCapturedFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh' }}></div>
      <div className="modal fade show" style={{ display: 'block', zIndex: 1050, position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', pointerEvents: 'none' }} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered" style={{ pointerEvents: 'auto' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="ti ti-camera me-2"></i>
                Face Attendance
              </h5>
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
              <div className="text-center mb-3">
                <p className="text-muted">Align your face in the frame and click Capture.</p>
              </div>
              {!capturedFile ? (
                <div className="text-center">
                  <video
                    ref={videoRef}
                    style={{ width: '100%', maxHeight: 320, borderRadius: 8, background: '#222' }}
                    autoPlay
                    playsInline
                    muted
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  <div className="mt-3">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleCapture}
                      disabled={loading}
                    >
                      <i className="ti ti-camera me-2"></i>
                      {loading ? 'Processing...' : 'Capture'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <img
                    src={previewUrl!}
                    alt="Captured"
                    className="img-fluid rounded mb-3"
                    style={{ maxHeight: 320 }}
                  />
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleRetake}
                      disabled={loading}
                    >
                      <i className="ti ti-refresh me-2"></i>Retake
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleConfirm}
                      disabled={loading || !capturedFile}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="ti ti-check me-2"></i>
                          Mark Attendance
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
});

// Memoized Components
const StatsCard: React.FC<{
  icon: string;
  title: string;
  value: string | number;
  color: string;
  iconColor: string;
}> = React.memo(({ icon, title, value, color, iconColor }) => (
  <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className={`avatar avatar-lg bg-${color}-transparent rounded me-3`}>
            <i className={`${icon} fs-24 text-${iconColor}`}></i>
          </div>
          <div>
            <h3 className="mb-1">{value}</h3>
            <p className="text-muted mb-0">{title}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
));

const ScheduleItem: React.FC<{
  schedule: ClassSchedule;
  index: number;
}> = React.memo(({ schedule, index }) => (
  <div className="timeline-item">
    <div className="timeline-marker bg-primary"></div>
    <div className="timeline-content">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h6 className="mb-1">{schedule.className} - {schedule.subject}</h6>
          <p className="text-muted mb-1">
            <i className="ti ti-clock me-1"></i>
            {new Date(schedule.startTime).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })} - {new Date(schedule.endTime).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </p>
          <small className="text-muted">
            <i className="ti ti-map-pin me-1"></i>
            Room {schedule.roomNumber}
          </small>
        </div>
        <span className="badge bg-primary">{index + 1}</span>
      </div>
    </div>
  </div>
));

const LeaveBalanceItem: React.FC<{
  leaveType: string;
  balance: LeaveBalance;
}> = React.memo(({ leaveType, balance }) => (
  <div className="col-md-6 mb-3">
    <div className="d-flex align-items-center p-3 bg-light rounded">
      <div className="avatar avatar-md bg-primary rounded me-3">
        <i className="ti ti-calendar text-white"></i>
      </div>
      <div className="flex-grow-1">
        <h6 className="mb-1">{leaveType}</h6>
        <div className="progress mb-2" style={{ height: '6px' }}>
          <div 
            className="progress-bar bg-success" 
            style={{ width: `${(balance.remaining / balance.total) * 100}%` }}
          ></div>
        </div>
        <small className="text-muted">
          {balance.remaining} of {balance.total} days remaining
        </small>
      </div>
    </div>
  </div>
));

const StudentLeaveRequestItem: React.FC<{
  request: ITeacherUIStudentLeaveRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (request: ITeacherUIStudentLeaveRequest) => void;
}> = React.memo(({ request, onApprove, onReject, onView }) => (
  <div className="list-group-item px-0">
    <div className="d-flex justify-content-between align-items-start">
      <div className="flex-grow-1" style={{ cursor: 'pointer' }} onClick={() => onView(request)}>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="mb-1">{request.studentName}</h6>
            <p className="text-muted mb-1">
              <small>
                <i className="ti ti-school me-1"></i>
                {request.studentClass} - {request.studentSection} (Roll: {request.studentRollNumber})
              </small>
            </p>
          </div>
          <span className={`badge bg-${
            request.status === 'APPROVED' ? 'success' : 
            request.status === 'REJECTED' ? 'danger' : 'warning'
          }`}>
            {request.status}
          </span>
        </div>
        <p className="text-muted mb-1">
          <i className="ti ti-calendar me-1"></i>
          {request.leaveType}
        </p>
        <small className="text-muted">
          <i className="ti ti-calendar-time me-1"></i>
          {new Date(request.fromDate).toLocaleDateString()} - {new Date(request.toDate).toLocaleDateString()}
        </small>
        {request.parentContact && request.parentContact !== 'N/A' && (
          <div className="mt-1">
            <small className="text-muted">
              <i className="ti ti-phone me-1"></i>
              Parent: {request.parentContact}
            </small>
          </div>
        )}
      </div>
      {request.status === 'PENDING' && (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-success"
            onClick={() => onApprove(request.id)}
            title="Approve Leave"
          >
            <i className="ti ti-check"></i>
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => onReject(request.id)}
            title="Reject Leave"
          >
            <i className="ti ti-x"></i>
          </button>
        </div>
      )}
    </div>
  </div>
));

// Modal Components for Quick Actions

// Leave Application Form Component
const LeaveApplicationForm: React.FC<{
  teacherId: string;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ teacherId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
    emergencyContact: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.leaveType) newErrors.leaveType = 'Leave type is required';
    if (!formData.fromDate) newErrors.fromDate = 'From date is required';
    if (!formData.toDate) newErrors.toDate = 'To date is required';
    if (!formData.reason) newErrors.reason = 'Reason is required';
    
    if (formData.fromDate && formData.toDate) {
      const fromDate = new Date(formData.fromDate);
      const toDate = new Date(formData.toDate);
      if (fromDate > toDate) {
        newErrors.toDate = 'To date must be after from date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await applyTeacherLeave(formData);
      
      if (response.status === 200 || response.status === 201) {
        onSuccess();
      } else {
        const errorMessage = response.data?.message || 'Failed to submit leave application';
        toast.error(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.message || 
                          error.message || 
                          'Failed to submit leave application';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Leave Type *</label>
            <select 
              className={`form-select ${errors.leaveType ? 'is-invalid' : ''}`}
              value={formData.leaveType}
              onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
            >
              <option value="">Select Leave Type</option>
              <option value="SICK">Sick Leave</option>
              <option value="CASUAL">Casual Leave</option>
              <option value="ANNUAL">Annual Leave</option>
              <option value="MATERNITY">Maternity Leave</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.leaveType && <div className="invalid-feedback">{errors.leaveType}</div>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Emergency Contact</label>
            <input 
              type="text" 
              className="form-control"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
              placeholder="Emergency contact number"
            />
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">From Date *</label>
            <input 
              type="date" 
              className={`form-control ${errors.fromDate ? 'is-invalid' : ''}`}
              value={formData.fromDate}
              onChange={(e) => setFormData({...formData, fromDate: e.target.value})}
            />
            {errors.fromDate && <div className="invalid-feedback">{errors.fromDate}</div>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">To Date *</label>
            <input 
              type="date" 
              className={`form-control ${errors.toDate ? 'is-invalid' : ''}`}
              value={formData.toDate}
              onChange={(e) => setFormData({...formData, toDate: e.target.value})}
            />
            {errors.toDate && <div className="invalid-feedback">{errors.toDate}</div>}
          </div>
        </div>
      </div>
      
      <div className="mb-3">
        <label className="form-label">Reason *</label>
        <textarea 
          className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
          rows={3}
          value={formData.reason}
          onChange={(e) => setFormData({...formData, reason: e.target.value})}
          placeholder="Please provide a detailed reason for your leave request"
        />
        {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
      </div>
      
      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
};

// Routine View Component
const RoutineView: React.FC<{
  lessons: ITeacherUILesson[];
  onClose: () => void;
}> = ({ lessons, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  
  // Get unique subjects and classes for filters
  const uniqueSubjects = [...new Set(lessons.map(lesson => lesson.subject?.name).filter(Boolean))];
  const uniqueClasses = [...new Set(lessons.map(lesson => lesson.class?.name).filter(Boolean))];
  
  // Filter lessons based on search and filters
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = searchTerm === '' || 
      lesson.subject?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.class?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.class?.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDay = selectedDay === '' || lesson.day === selectedDay;
    const matchesSubject = selectedSubject === '' || lesson.subject?.name === selectedSubject;
    const matchesClass = selectedClass === '' || lesson.class?.name === selectedClass;
    
    // Date filter logic
    let matchesDate = true;
    if (selectedDate) {
      const lessonDate = new Date(lesson.startTime);
      const filterDate = new Date(selectedDate);
      matchesDate = lessonDate.toDateString() === filterDate.toDateString();
    }
    
    return matchesSearch && matchesDay && matchesSubject && matchesClass && matchesDate;
  });
  
  const getLessonsForDay = (day: string) => {
    return filteredLessons.filter(lesson => lesson.day === day);
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDay('');
    setSelectedSubject('');
    setSelectedClass('');
    setSelectedDate('');
  };

  return (
    <div>
      {/* Search and Filter Controls */}
      <div className="row mb-4">
        <div className="col-md-2">
          <div className="mb-3">
            <label className="form-label">Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by subject, class, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-2">
          <div className="mb-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-1">
          <div className="mb-3">
            <label className="form-label">Day</label>
            <select
              className="form-select"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option value="">All</option>
              {days.map(day => (
                <option key={day} value={day}>{day.slice(0, 3)}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-2">
          <div className="mb-3">
            <label className="form-label">Subject</label>
            <select
              className="form-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-2">
          <div className="mb-3">
            <label className="form-label">Class</label>
            <select
              className="form-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {uniqueClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-3">
          <div className="mb-3 d-flex align-items-end">
            <button
              type="button"
              className="btn btn-outline-secondary me-2"
              onClick={clearFilters}
            >
              <i className="ti ti-refresh me-1"></i>
              Clear Filters
            </button>
            <small className="text-muted">
              {filteredLessons.length} of {lessons.length} lessons
            </small>
          </div>
        </div>
      </div>

      {/* Routine Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Time</th>
              {days.map(day => (
                <th key={day} className="text-center">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from(new Set(filteredLessons.map(l => l.startTime))).sort().map(time => (
              <tr key={time}>
                <td className="fw-bold">{formatTime(time)}</td>
                {days.map(day => {
                  const dayLessons = getLessonsForDay(day).filter(l => l.startTime === time);
                  return (
                    <td key={day} className="text-center">
                      {dayLessons.map(lesson => (
                        <div key={lesson.id} className="p-2 border rounded bg-light mb-1">
                          <strong>{lesson.subject?.name}</strong><br/>
                          <small>{lesson.class?.name} - {lesson.class?.roomNumber}</small>
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Results Message */}
      {filteredLessons.length === 0 && (
        <div className="text-center py-4">
          <i className="ti ti-search text-muted fs-1"></i>
          <h5 className="text-muted mt-3">No lessons found</h5>
          <p className="text-muted">Try adjusting your search criteria or filters</p>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={clearFilters}
          >
            Clear All Filters
          </button>
        </div>
      )}
      
      <div className="d-flex justify-content-end mt-3">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

// Salary Info Component
const SalaryInfo: React.FC<{
  teacherData: TeacherData;
  onClose: () => void;
}> = ({ teacherData, onClose }) => {
  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          <h6 className="text-muted">Basic Information</h6>
          <div className="mb-3">
            <label className="form-label fw-bold">Basic Salary</label>
            <p className="form-control-plaintext">₹{teacherData.salary?.toLocaleString() || 'N/A'}</p>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Contract Type</label>
            <p className="form-control-plaintext">{teacherData.contractType || 'N/A'}</p>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Date of Joining</label>
            <p className="form-control-plaintext">
              {teacherData.dateofJoin ? new Date(teacherData.dateofJoin).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <h6 className="text-muted">Bank Details</h6>
          <div className="mb-3">
            <label className="form-label fw-bold">Bank Name</label>
            <p className="form-control-plaintext">{teacherData.bankName || 'N/A'}</p>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Account Number</label>
            <p className="form-control-plaintext">{teacherData.accountNumber || 'N/A'}</p>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">IFSC Code</label>
            <p className="form-control-plaintext">{teacherData.ifscCode || 'N/A'}</p>
          </div>
        </div>
      </div>
      
      <div className="d-flex justify-content-end mt-3">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

// Library Access Component
const LibraryAccess: React.FC<{
  teacherId: string;
  onClose: () => void;
}> = ({ teacherId, onClose }) => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getTeacherLibraryBooks();
        
        if (response.status === 200) {
          setBooks(response.data || []);
        } else {
          setBooks([]);
        }
      } catch (error: any) {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [teacherId]);

  return (
    <div>
      <h6 className="text-muted mb-3">Your Borrowed Books</h6>
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : books.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Author</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{new Date(book.dueDate).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary">Renew</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-muted">
          <p>No books currently borrowed</p>
        </div>
      )}
      
      <div className="d-flex justify-content-end mt-3">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

// Add Exam Form Component
const AddExamForm: React.FC<{
  teacherId: string;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ teacherId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    examTitle: '',
    title: '', 
    subject: '',
    subjectId: '', 
    classId: '',
    examDate: '',
    startTime: '',
    endTime: '',
    totalMarks: '',
    passMark: '',
    duration: '', 
    roomNumber: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [classes, setClasses] = useState<any[]>([]);
  const [fetchingClasses, setFetchingClasses] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      setFetchingClasses(true);
      try {
        const res = await getClassesByTeacherId(teacherId);
        // Accept both {data: [...]} and [...] shapes
        const arr = Array.isArray(res.data)
          ? res.data
          : Array.isArray((res.data as any)?.data)
          ? (res.data as any).data
          : [];
        setClasses(arr);
      } catch (err) {
        setClasses([]);
      } finally {
        setFetchingClasses(false);
      }
    };
    if (teacherId) fetchClasses();
  }, [teacherId]);

  const selectedClass = classes.find((cls: any) =>
    cls.id === formData.classId ||
    cls.classId === formData.classId ||
    cls.name === formData.classId ||
    cls.className === formData.classId
  );
  const subjects = selectedClass && Array.isArray(selectedClass.Subject) ? selectedClass.Subject : [];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.examTitle) newErrors.examTitle = 'Exam title is required';
    if (!formData.subjectId) newErrors.subject = 'Subject is required';
    if (!formData.classId) newErrors.classId = 'Class is required';
    if (!formData.examDate) newErrors.examDate = 'Exam date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.totalMarks) newErrors.totalMarks = 'Total marks is required';
    if (!formData.passMark) newErrors.passMark = 'Pass mark is required';
    if (!formData.roomNumber) newErrors.roomNumber = 'Room number is required';
    // Validate time
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      if (start >= end) {
        newErrors.endTime = 'End time must be after start time';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
         let duration = 0;
      let startDate: Date | undefined = undefined;
      let endDate: Date | undefined = undefined;
      if (formData.examDate && formData.startTime && formData.endTime) {
        startDate = new Date(`${formData.examDate}T${formData.startTime}`);
        endDate = new Date(`${formData.examDate}T${formData.endTime}`);
        duration = (endDate.getTime() - startDate.getTime()) / 60000;
      }
     
      const payload = {
        passMark: Number(formData.passMark),
        totalMarks: Number(formData.totalMarks),
        duration,
        roomNumber: Number(formData.roomNumber),
        title: formData.examTitle,
        startTime: startDate!,
        endTime: endDate!,
        subjectId: formData.subjectId,
        classId: formData.classId
      };
      ////////console.log('🔍 Submitting exam data:', payload);
      const response = await createExam(payload);
      if (response.status === 200 || response.status === 201) {
        toast.success('Exam added successfully');
        onSuccess();
      } else {
        toast.error('Failed to add exam');
      }
    } catch (error: any) {
      toast.error('Failed to add exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Exam Title *</label>
            <input 
              type="text" 
              className={`form-control ${errors.examTitle ? 'is-invalid' : ''}`}
              value={formData.examTitle}
              onChange={(e) => setFormData({...formData, examTitle: e.target.value})}
              placeholder="Enter exam title"
            />
            {errors.examTitle && <div className="invalid-feedback">{errors.examTitle}</div>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Class *</label>
            <select 
              className={`form-select ${errors.classId ? 'is-invalid' : ''}`}
              value={formData.classId}
              onChange={(e) => {
                setFormData({...formData, classId: e.target.value, subject: ''});
              }}
              disabled={fetchingClasses}
            >
              <option value="">{fetchingClasses ? 'Loading classes...' : 'Select Class'}</option>
              {classes.map(cls => (
                <option key={cls.id || cls.classId} value={cls.id || cls.classId}>
                  {cls.name || cls.className || 'Unknown Class'}
                </option>
              ))}
            </select>
            {fetchingClasses && <div className="spinner-border spinner-border-sm ms-2" role="status"></div>}
            {errors.classId && <div className="invalid-feedback">{errors.classId}</div>}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Subject *</label>
            <select
              className={`form-select ${errors.subject ? 'is-invalid' : ''}`}
              value={formData.subjectId}
              onChange={(e) => {
                const selected = subjects.find((sub: any) => sub.id === e.target.value);
                setFormData({
                  ...formData,
                  subject: selected ? selected.name : '',
                  subjectId: e.target.value
                });
              }}
              disabled={!formData.classId || subjects.length === 0}
            >
              <option value="">
                {!formData.classId
                  ? 'Select a class first'
                  : subjects.length === 0
                    ? 'No subjects found for this class'
                    : 'Select Subject'}
              </option>
              {subjects.map((sub: any, index: number) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
            {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
            {!formData.classId && (
              <small className="text-muted">Please select a class first</small>
            )}
            {subjects.length === 0 && (
              <small className="text-muted">No subjects found for this class</small>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Exam Date *</label>
            <input 
              type="date" 
              className={`form-control ${errors.examDate ? 'is-invalid' : ''}`}
              value={formData.examDate}
              onChange={(e) => setFormData({...formData, examDate: e.target.value})}
            />
            {errors.examDate && <div className="invalid-feedback">{errors.examDate}</div>}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <div className="mb-3">
            <label className="form-label">Start Time *</label>
            <input 
              type="time" 
              className={`form-control ${errors.startTime ? 'is-invalid' : ''}`}
              value={formData.startTime}
              onChange={(e) => setFormData({...formData, startTime: e.target.value})}
            />
            {errors.startTime && <div className="invalid-feedback">{errors.startTime}</div>}
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label className="form-label">End Time *</label>
            <input 
              type="time" 
              className={`form-control ${errors.endTime ? 'is-invalid' : ''}`}
              value={formData.endTime}
              onChange={(e) => setFormData({...formData, endTime: e.target.value})}
            />
            {errors.endTime && <div className="invalid-feedback">{errors.endTime}</div>}
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label className="form-label">Total Marks *</label>
            <input 
              type="number" 
              className={`form-control ${errors.totalMarks ? 'is-invalid' : ''}`}
              value={formData.totalMarks}
              onChange={(e) => setFormData({...formData, totalMarks: e.target.value})}
              placeholder="100"
            />
            {errors.totalMarks && <div className="invalid-feedback">{errors.totalMarks}</div>}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Pass Mark *</label>
            <input
              type="number"
              className={`form-control ${errors.passMark ? 'is-invalid' : ''}`}
              value={formData.passMark}
              onChange={(e) => setFormData({ ...formData, passMark: e.target.value })}
              placeholder="Enter pass mark"
            />
            {errors.passMark && <div className="invalid-feedback">{errors.passMark}</div>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Room Number *</label>
            <input
              type="number"
              className={`form-control ${errors.roomNumber ? 'is-invalid' : ''}`}
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              placeholder="Enter room number"
            />
            {errors.roomNumber && <div className="invalid-feedback">{errors.roomNumber}</div>}
          </div>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea 
          className="form-control"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Enter exam description and instructions"
        />
      </div>
      <div className="d-flex justify-content-end gap-2">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Exam'}
        </button>
      </div>
    </form>
  );
};

// Move the RegisterFaceWebcam component definition here, before Teacherui
const RegisterFaceWebcam: React.FC<{
  loading: boolean;
  onRegister: (file: File) => void;
  onCancel: () => void;
}> = ({ loading, onRegister, onCancel }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!capturedFile) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(mediaStream => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play();
          }
        })
        .catch(() => {
          toast.error('Could not access camera. Please allow camera access or try a different device.');
          onCancel();
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line
  }, [capturedFile]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], 'face-registration.jpg', { type: 'image/jpeg' });
          setCapturedFile(file);
          setPreviewUrl(URL.createObjectURL(blob));
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
          }
        }
      }, 'image/jpeg', 0.95);
    }
  };

  const handleRetake = () => {
    setCapturedFile(null);
    setPreviewUrl(null);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(mediaStream => {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      });
  };

  if (!capturedFile) {
    return (
      <div className="text-center">
        <video
          ref={videoRef}
          style={{ width: '100%', maxHeight: 320, borderRadius: 8, background: '#222' }}
          autoPlay
          playsInline
          muted
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <div className="mt-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCapture}
            disabled={loading}
          >
            <i className="ti ti-camera me-2"></i>
            {loading ? 'Processing...' : 'Capture'}
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="text-center">
      <img
        src={previewUrl!}
        alt="Captured"
        className="img-fluid rounded mb-3"
        style={{ maxHeight: 320 }}
      />
      <div className="d-flex justify-content-center gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleRetake}
          disabled={loading}
        >
          <i className="ti ti-refresh me-2"></i>Retake
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={() => capturedFile && onRegister(capturedFile)}
          disabled={loading || !capturedFile}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Processing...
            </>
          ) : (
            <>
              <i className="ti ti-check me-2"></i>
              Register Face
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const Teacherui: React.FC = () => {
  const routes = all_routes;
  const isMobile = useMobileDetection();
  const userObj = useSelector((state: any) => state.auth.userObj);
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const isDark = dataTheme === "dark_data_theme";

  const [teacherData, setTeacherData] = useState<TeacherData>({});
  const [loading, setLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<ITeacherUIAttendance | null>(null);
  const [attendanceStats, setAttendanceStats] = useState<ITeacherUIAttendanceStats | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalClasses: 0,
    totalStudents: 0,
    attendanceRate: 0,
    leaveBalance: 0,
    upcomingClasses: 0,
    recentActivities: 0,
    pendingLeaves: 0,
    todayClasses: 0,
    assignmentsDue: 0,
    notifications: 0,
  });
  const [leaveBalances, setLeaveBalances] = useState<{ [key: string]: LeaveBalance }>({});
  const [classList, setClassList] = useState<ITeacherUIClassData[]>([]);
  const [lessons, setLessons] = useState<ITeacherUILesson[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<ClassSchedule[]>([]);
  const [studentLeaveRequests, setStudentLeaveRequests] = useState<ITeacherUIStudentLeaveRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const [showLeaveRequestModal, setShowLeaveRequestModal] = useState(false);
  const [showFaceAttendanceModal, setShowFaceAttendanceModal] = useState(false);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<ITeacherUIStudentLeaveRequest | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [showLeaveApplicationModal, setShowLeaveApplicationModal] = useState(false);
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [showRegisterFaceModal, setShowRegisterFaceModal] = useState(false);
  const [registerFaceLoading, setRegisterFaceLoading] = useState(false);

  const teacherId = useMemo(() => localStorage.getItem("teacherId"), []);

  const fetchTeacherDetails = useCallback(async () => {
    try {
      setLoading(true);
      if (!teacherId) {
        toast.error("Teacher ID not found");
        return;
      }

      const response = await getTeacherById(teacherId);
      
      if (response.status === 200) {
        setTeacherData(response.data);
      } else {
        toast.error("Failed to fetch teacher details");
      }
    } catch (error) {
      toast.error("Error loading dashboard");
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [dashboardResponse, classesResponse, lessonsResponse, leaveBalancesResponse] = await Promise.all([
        getTeacherUIDashboardData(),
        getTeacherUIClasses(),
        getTeacherUILessons(),
        getTeacherUILeaveBalances(),
      ]);

      if (dashboardResponse.status === 200) {
        const data = dashboardResponse.data;
        // Try to use a direct attendanceRate if available, else calculate from stats
        let attendanceRate = 0;
        if (typeof data.attendanceRate === 'number') {
          attendanceRate = data.attendanceRate;
        } else if (data.attendanceStats && typeof data.attendanceStats.presentDays === 'number' && typeof data.attendanceStats.totalDays === 'number' && data.attendanceStats.totalDays > 0) {
          attendanceRate = (data.attendanceStats.presentDays / data.attendanceStats.totalDays) * 100;
        } else if (Array.isArray(data.attendance) && data.attendance.length > 0) {
          // Fallback: average percentage from attendance array
          attendanceRate = data.attendance.reduce((sum: number, att: any) => sum + (att.percentage || 0), 0) / data.attendance.length;
        }
        const transformedData = {
          totalClasses: data.classOverview?.length || 0,
          totalStudents: data.classOverview?.reduce((sum: number, cls: any) => sum + (cls.studentCount || 0), 0) || 0,
          attendanceRate: Math.round(attendanceRate),
          leaveBalance: 15,
          upcomingClasses: data.timetable?.length || 0,
          recentActivities: (data.assignments?.map((assignment: any) => ({
            id: assignment.id,
            title: `${assignment.subject} - ${assignment.title}`,
            description: `Assignment due: ${new Date(assignment.dueDate).toLocaleDateString()}`,
            timestamp: assignment.dueDate
          })) || [])
          .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 3),
          pendingLeaves: 0,
          todayClasses: data.timetable?.filter((lesson: any) => 
            lesson.day === new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
          ).length || 0,
          assignmentsDue: data.assignments?.filter((assignment: any) => 
            new Date(assignment.dueDate) > new Date()
          ).length || 0,
          notifications: 0,
        };
        setDashboardStats(transformedData);
        setRecentActivities(transformedData.recentActivities);
      }

      if (classesResponse.status === 200) {
        const transformedClasses = Array.isArray(classesResponse.data) ? 
          classesResponse.data.map((cls: any) => ({
            id: cls.classId || cls.id,
            name: cls.className || cls.name,
            section: cls.section,
            roomNumber: cls.roomNumber,
            totalStudents: cls.studentCount || 0,
            subjects: cls.subjects || []
          })) : [];
        setClassList(transformedClasses);
      }

      if (lessonsResponse.status === 200) {
        const lessonData = Array.isArray(lessonsResponse.data) ? lessonsResponse.data : [lessonsResponse.data];
        const transformedLessons = lessonData.map((lesson: any) => ({
          id: lesson.id,
          subject: {
            id: lesson.subjectId || lesson.id,
            name: lesson.subject
          },
          class: {
            id: lesson.classId || lesson.id,
            name: lesson.class,
            roomNumber: lesson.room
          },
          startTime: lesson.startTime,
          endTime: lesson.endTime,
          day: lesson.day,
          isActive: true
        }));
        setLessons(transformedLessons);
        processTodaySchedule(transformedLessons);
      }

      if (leaveBalancesResponse.status === 200) {
        setLeaveBalances(leaveBalancesResponse.data);
      }
    } catch (error) {
      setDashboardStats({
        totalClasses: 0,
        totalStudents: 0,
        attendanceRate: 0,
        leaveBalance: 0,
        upcomingClasses: 0,
        recentActivities: 0,
        pendingLeaves: 0,
        todayClasses: 0,
        assignmentsDue: 0,
        notifications: 0,
      });
      setClassList([]);
      setLessons([]);
      setTodaySchedule([]);
      setLeaveBalances({});
    }
  }, []);

  const fetchStudentLeaveRequests = useCallback(async () => {
    try {
      const response = await getTeacherUIStudentLeaveRequests();
      if (response.status === 200) {
        const leaveData = Array.isArray(response.data) ? response.data : [response.data];
        
        // Filter only PENDING requests and transform the data
        const transformedLeaves = leaveData
          .filter((leave: any) => leave.isApproved === 'PENDING')
          .map((leave: any) => ({
            id: leave.id,
            studentId: leave.user?.id || '',
            studentName: leave.user?.name || '',
            leaveType: leave.reason || '',
            fromDate: leave.fromDate,
            toDate: leave.toDate,
            reason: leave.reason || '',
            status: leave.isApproved,
            createdAt: leave.createdAt,
            studentClass: leave.user?.student?.class?.name || '',
            studentSection: leave.user?.student?.class?.section?.name || '',
            studentRollNumber: leave.user?.student?.rollNumber || '',
            parentContact: '', 
            emergencyContact: '', 
            medicalCertificate: leave.medicalCertificate || '',
            approvalDate: leave.approvalDate || '',
            approvedBy: leave.approvedBy || '',
            rejectionReason: leave.rejectionReason || ''
          }));
        setStudentLeaveRequests(transformedLeaves);
      }
    } catch (error) {
      //////console.error('Error fetching student leave requests:', error);
      setStudentLeaveRequests([]);
    }
  }, []);

  const fetchAttendanceData = useCallback(async () => {
    try {
      const [todayResponse, statsResponse] = await Promise.all([
        getTeacherUITodayAttendance(),
        getTeacherUIAttendanceStats()
      ]);

      if (todayResponse.status === 200) {
        setTodayAttendance(todayResponse.data);
      }

      if (statsResponse.status === 200) {
        setAttendanceStats(statsResponse.data);
      }
    } catch (error) {
      setTodayAttendance(null);
      setAttendanceStats(null);
    }
  }, []);

  const processTodaySchedule = useCallback((allLessons: ITeacherUILesson[]) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const todayLessons = allLessons.filter(lesson => lesson.day === today);
    
    const schedule = todayLessons.map(lesson => ({
      id: lesson.id,
      className: lesson.class?.name || 'Unknown Class',
      subject: lesson.subject?.name || 'Unknown Subject',
      startTime: lesson.startTime,
      endTime: lesson.endTime,
      roomNumber: lesson.class?.roomNumber || 'N/A',
      day: lesson.day
    }));
    
    setTodaySchedule(schedule);
  }, []);

  const handleQuickAction = useCallback((action: string) => {
    switch (action) {
      case 'apply_leave':
        setShowLeaveApplicationModal(true);
        break;
      case 'view_routine':
        setShowRoutineModal(true);
        break;
      case 'salary_info':
        setShowSalaryModal(true);
        break;
      case 'library':
        setShowLibraryModal(true);
        break;
      case 'mark_attendance':
        setShowFaceAttendanceModal(true);
        break;
      case 'add_exam':
        setShowAddExamModal(true);
        break;
      case 'register_face':
        setShowRegisterFaceModal(true);
        break;
      default:
        break;
    }
  }, []);

  const handleQuickActionConfirm = useCallback(() => {
  }, []);

  const handleViewLeaveRequest = useCallback((request: ITeacherUIStudentLeaveRequest) => {
    setSelectedLeaveRequest(request);
    setShowLeaveRequestModal(true);
  }, []);

  useEffect(() => {
    fetchTeacherDetails();
    fetchDashboardData();
    fetchStudentLeaveRequests();
    fetchAttendanceData();
  }, [fetchTeacherDetails, fetchDashboardData, fetchStudentLeaveRequests, fetchAttendanceData]);

  const attendanceRate = useMemo(() => {
    if (attendanceStats?.attendanceRate) {
      return attendanceStats.attendanceRate;
    }
    
    if (dashboardStats.attendanceRate > 0) {
      return Math.round(dashboardStats.attendanceRate);
    }
    
    return 0;
  }, [attendanceStats, dashboardStats]);

  const statsCards = useMemo(() => {
    const cards = [
      {
        icon: 'ti ti-school',
        title: 'Total Classes',
        value: dashboardStats.totalClasses,
        color: 'primary',
        iconColor: 'primary'
      },
      {
        icon: 'ti ti-users',
        title: 'Total Students',
        value: dashboardStats.totalStudents,
        color: 'success',
        iconColor: 'success'
      },
      {
        icon: 'ti ti-calendar-check',
        title: 'Attendance Rate',
        value: `${attendanceRate}%`,
        color: 'warning',
        iconColor: 'warning'
      },
      {
        icon: 'ti ti-calendar-off',
        title: 'Leave Balance',
        value: dashboardStats.leaveBalance,
        color: 'info',
        iconColor: 'info'
      },
      {
        icon: 'ti ti-bell',
        title: 'Notifications',
        value: dashboardStats.notifications,
        color: 'danger',
        iconColor: 'danger'
      },
      {
        icon: 'ti ti-book',
        title: 'Assignments Due',
        value: dashboardStats.assignmentsDue,
        color: 'secondary',
        iconColor: 'secondary'
      }
    ];
    return cards;
  }, [dashboardStats, attendanceRate]);

  const quickActions = useMemo(() => {
    const actions = [
      {
        label: 'Apply Leave',
        icon: 'ti ti-calendar-due',
        action: 'apply_leave',
        color: 'outline-primary'
      },
      {
        label: 'View Routine',
        icon: 'ti ti-table-options',
        action: 'view_routine',
        color: 'outline-success'
      },
      {
        label: 'Salary Info',
        icon: 'ti ti-report-money',
        action: 'salary_info',
        color: 'outline-warning'
      },
      {
        label: 'Library',
        icon: 'ti ti-library',
        action: 'library',
        color: 'outline-info'
      },
      {
        label: 'Mark Attendance',
        icon: 'ti ti-user-check',
        action: 'mark_attendance',
        color: 'outline-danger'
      },
      {
        label: 'Register Face',
        icon: 'ti ti-user-plus',
        action: 'register_face',
        color: 'outline-secondary'
      },
      {
        label: 'Add Exam',
        icon: 'ti ti-file-text',
        action: 'add_exam',
        color: 'outline-secondary'
      }
    ];
    return actions;
  }, []);

  const handleMarkAttendance = useCallback(async (attendanceData: any) => {
    setAttendanceLoading(true);
    try {
      const response = await markTeacherUIAttendance(attendanceData);
      if (response.status === 200) {
        toast.success('Attendance marked successfully');
        fetchAttendanceData();
      } else {
        toast.error('Failed to mark attendance');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setAttendanceLoading(false);
    }
  }, [fetchAttendanceData]);

  const handleFaceAttendance = useCallback(async (faceData: any) => {
    setAttendanceLoading(true);
    try {
      const response = await markTeacherUIFaceAttendance(faceData);
      if (response.status === 200) {
        toast.success('Face attendance marked successfully');
        setShowFaceAttendanceModal(false);
        fetchAttendanceData();
      } else {
        toast.error('Failed to mark face attendance');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to mark face attendance');
    } finally {
      setAttendanceLoading(false);
    }
  }, [fetchAttendanceData]);

  const handleApproveLeave = useCallback(async (leaveId: string) => {
    setModalLoading(true);
    try {
      const response = await approveTeacherUIStudentLeave(leaveId);
      if (response.status === 200) {
        toast.success('Leave request approved');
        setShowLeaveRequestModal(false);
        fetchStudentLeaveRequests();
      } else {
        toast.error('Failed to approve leave request');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve leave request');
    } finally {
      setModalLoading(false);
    }
  }, [fetchStudentLeaveRequests]);

  const handleRejectLeave = useCallback(async (leaveId: string) => {
    setModalLoading(true);
    try {
      const response = await rejectTeacherUIStudentLeave(leaveId);
      if (response.status === 200) {
        toast.success('Leave request rejected');
        setShowLeaveRequestModal(false);
        fetchStudentLeaveRequests();
      } else {
        toast.error('Failed to reject leave request');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject leave request');
    } finally {
      setModalLoading(false);
    }
  }, [fetchStudentLeaveRequests]);

  const handleRegisterFace = useCallback(async (file: File) => {
    setRegisterFaceLoading(true);
    try {
      const response = await uploadTeacherFace({ image: file });
      if (response.status === 200 || response.status === 201) {
        toast.success('Face registered successfully!');
        setShowRegisterFaceModal(false);
      } else {
        toast.error(response.data?.message || 'Failed to register face');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to register face');
    } finally {
      setRegisterFaceLoading(false);
    }
  }, []);

  const SkeletonPlaceholder = React.memo(({ className = '' }: { className?: string }) => (
    <div className={`placeholder-glow ${className}`}>
      <div className="placeholder col-12"></div>
    </div>
  ));

  if (loading) {
    return (
      <div className={`${isMobile ? "page-wrapper" : "p-3"} bg-dark-theme min-vh-100`}>
        <div className="content">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <SkeletonPlaceholder className="mb-3" />
                  <SkeletonPlaceholder className="mb-3" />
                  <SkeletonPlaceholder className="mb-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? "page-wrapper" : "p-3"} bg-dark-theme min-vh-100`}>
      <div className="content">
        {/* Attendance Status Card */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-0">
                <h5 className="mb-0">
                  <i className="ti ti-clock me-2"></i>
                  Today's Attendance Status
                </h5>
              </div>
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-lg bg-primary-transparent rounded me-3">
                        <i className="ti ti-user-check fs-24 text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Attendance Status</h6>
                    <p className="text-muted mb-0">
                          {todayAttendance ? (
                            <>
                              {todayAttendance.checkIn ? (
                                <span className="text-success">
                                  <i className="ti ti-check me-1"></i>
                                  Checked in at {new Date(todayAttendance.checkIn).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </span>
                              ) : (
                                <span className="text-warning">
                                  <i className="ti ti-clock me-1"></i>
                                  Not checked in yet
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-muted">
                              <i className="ti ti-info-circle me-1"></i>
                              No attendance record for today
                            </span>
                          )}
                    </p>
                  </div>
                      </div>
                      </div>
                  <div className="col-md-6">
                    <div className="d-flex gap-2 justify-content-end">
                      <button
                        className={`btn ${todayAttendance?.checkIn ? 'btn-success' : 'btn-primary'}`}
                        onClick={() => handleMarkAttendance({
                          teacherId,
                          date: new Date(),
                          status: todayAttendance?.checkIn ? 'PRESENT' : 'ABSENT',
                          checkIn: todayAttendance?.checkIn,
                          checkOut: todayAttendance?.checkOut,
                          location: "School Campus",
                          notes: `${todayAttendance?.checkIn ? 'Check-in' : 'Check-out'} marked via dashboard`
                        })}
                        disabled={attendanceLoading || !!todayAttendance?.checkIn}
                      >
                        <i className="ti ti-login me-2"></i>
                        {attendanceLoading ? 'Processing...' : 'Check In'}
                      </button>
                      <button
                        className={`btn ${todayAttendance?.checkOut ? 'btn-success' : 'btn-warning'}`}
                        onClick={() => handleMarkAttendance({
                          teacherId,
                          date: new Date(),
                          status: todayAttendance?.checkOut ? 'PRESENT' : 'ABSENT',
                          checkIn: todayAttendance?.checkIn,
                          checkOut: todayAttendance?.checkOut,
                          location: "School Campus",
                          notes: `${todayAttendance?.checkOut ? 'Check-out' : 'Check-in'} marked via dashboard`
                        })}
                        disabled={attendanceLoading || !todayAttendance?.checkIn || !!todayAttendance?.checkOut}
                      >
                        <i className="ti ti-logout me-2"></i>
                        {attendanceLoading ? 'Processing...' : 'Check Out'}
                      </button>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => setShowFaceAttendanceModal(true)}
                        disabled={attendanceLoading}
                      >
                        <i className="ti ti-camera me-2"></i>
                        Face Attendance
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="col-md-6 col-lg-4 col-xl-2">
                <LoadingSkeleton type="card" />
              </div>
            ))
          ) : (
            statsCards.map((card, index) => (
              <div key={index} className="col-md-6 col-lg-4 col-xl-2">
                <div className={`card border-${card.color} h-100`}>
                  <div className="card-body text-center">
                    <div className={`text-${card.iconColor} mb-3`}>
                      <i className={`${card.icon} fs-1`}></i>
                    </div>
                    <h4 className="card-title mb-1">{card.value}</h4>
                    <p className="card-text text-muted small">{card.title}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Main Content */}
        <div className="row">
          {/* Today's Schedule */}
          <div className="col-xl-9 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="ti ti-calendar me-2"></i>
                  Today's Schedule
                </h5>
                <small className="text-muted">
                  {todaySchedule.length} classes today
                </small>
              </div>
              <div className="card-body">
                {loading ? (
                  <LoadingSkeleton type="table" lines={3} />
                ) : todaySchedule.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Subject</th>
                          <th>Class</th>
                          <th>Room</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todaySchedule.map((schedule) => {
                          const now = new Date();
                          const startTime = new Date(schedule.startTime);
                          const endTime = new Date(schedule.endTime);
                          const isOngoing = now >= startTime && now <= endTime;
                          const isCompleted = now > endTime;
                          
                          return (
                            <tr key={schedule.id}>
                              <td>
                                <strong>
                                  {startTime.toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit',
                                    hour12: true 
                                  })} - {endTime.toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit',
                                    hour12: true 
                                  })}
                                </strong>
                              </td>
                              <td>{schedule.subject}</td>
                              <td>{schedule.className}</td>
                              <td>{schedule.roomNumber}</td>
                              <td>
                                <span className={`badge bg-${
                                  isOngoing ? 'success' :
                                  isCompleted ? 'secondary' : 'warning'
                                }`}>
                                  {isOngoing ? 'Ongoing' :
                                   isCompleted ? 'Completed' : 'Upcoming'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="ti ti-calendar-off text-muted fs-1"></i>
                    <h5 className="text-muted mt-3">No Classes Today</h5>
                    <p className="text-muted">You have no scheduled classes for today</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-xl-3 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent border-0">
                <h5 className="mb-0">
                  <i className="ti ti-bolt me-2"></i>
                  Quick Actions
                </h5>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="row g-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="col-6 col-md-12 mb-2">
                        <LoadingSkeleton type="button" width="100%" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="row g-3">
                    {quickActions.map((action, index) => (
                      <div key={index} className="col-6 col-md-12">
                        <button
                          type="button"
                          className={`quick-action-btn btn btn-outline-${action.color.replace('outline-', '')} w-100 d-flex align-items-center justify-content-center gap-2 py-3 px-2 position-relative fw-semibold shadow-sm rounded-3 border-2`}
                          style={{ minHeight: 60, fontSize: 16, transition: 'transform 0.15s, box-shadow 0.15s' }}
                          onClick={() => handleQuickAction(action.action)}
                          aria-label={action.label}
                        >
                          <span className={`fs-4 ${action.color.replace('outline-', 'text-')}`}> <i className={action.icon}></i> </span>
                          <span className="text-dark text-nowrap">{action.label}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Leave Balances and Student Leave Requests */}
        <div className="row mb-4">
          {/* Leave Balances */}
          <div className="col-xl-6 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="ti ti-calendar-off me-2"></i>
                  Leave Balances
                </h5>
                <small className="text-muted">
                  {Object.keys(leaveBalances).length} leave types
                </small>
              </div>
              <div className="card-body">
                {Object.keys(leaveBalances).length > 0 ? (
                  <>
                <div className="row">
                      {Object.entries(leaveBalances).slice(0, 4).map(([leaveType, balance]) => (
                        <LeaveBalanceItem key={leaveType} leaveType={leaveType} balance={balance} />
                      ))}
                        </div>
                    {Object.keys(leaveBalances).length > 4 && (
                      <div className="text-center mt-3">
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="ti ti-eye me-1"></i>
                          View All Leave Types ({Object.keys(leaveBalances).length - 4} more)
                        </button>
                          </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <i className="ti ti-calendar-off fs-48 text-muted mb-3"></i>
                    <h6 className="text-muted">No leave balance data available</h6>
                    <p className="text-muted mb-0">Leave balance information will appear here when available.</p>
                        </div>
                )}
              </div>
            </div>
          </div>

          {/* Student Leave Requests */}
          <div className="col-xl-6 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="ti ti-calendar-due me-2"></i>
                  Student Leave Requests (Pending)
                </h5>
                <small className="text-muted">
                  Latest {studentLeaveRequests.length} requests
                </small>
              </div>
              <div className="card-body">
                {loading ? (
                  <LoadingSkeleton type="table" lines={3} />
                ) : studentLeaveRequests.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Class</th>
                          <th>Leave Type</th>
                          <th>Duration</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentLeaveRequests.map((request) => (
                          <tr key={request.id}>
                            <td>
                              <div>
                                <strong>{request.studentName}</strong>
                                <br />
                                <small className="text-muted">{request.studentRollNumber}</small>
                              </div>
                            </td>
                            <td>{request.studentClass} - {request.studentSection}</td>
                            <td>
                              <span className={`badge bg-${
                                request.leaveType === 'SICK' ? 'danger' :
                                request.leaveType === 'CASUAL' ? 'warning' :
                                request.leaveType === 'ANNUAL' ? 'info' : 'secondary'
                              }`}>
                                {request.leaveType}
                              </span>
                            </td>
                            <td>
                              {new Date(request.fromDate).toLocaleDateString()} - {new Date(request.toDate).toLocaleDateString()}
                            </td>
                            <td>
                              <span className={`badge bg-${
                                request.status === 'APPROVED' ? 'success' :
                                request.status === 'REJECTED' ? 'danger' : 'warning'
                              }`}>
                                {request.status}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleViewLeaveRequest(request)}
                              >
                                <i className="ti ti-eye me-1"></i>
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="text-center mt-3">
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="ti ti-eye me-1"></i>
                        View All Pending Requests
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="ti ti-calendar-off text-muted fs-1"></i>
                    <h5 className="text-muted mt-3">No Pending Leave Requests</h5>
                    <p className="text-muted">All student leave requests have been processed</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities and Notifications */}
        <div className="row mb-4">
          {/* Recent Activities */}
          <div className="col-xl-8 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="ti ti-activity me-2"></i>
                  Recent Activities
                </h5>
                <small className="text-muted">
                  Latest {recentActivities.length} activities
                </small>
              </div>
              <div className="card-body">
                {loading ? (
                  <LoadingSkeleton type="text" lines={4} />
                ) : recentActivities.length > 0 ? (
                  <>
                <div className="timeline">
                      {recentActivities.map((activity, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-marker bg-info"></div>
                      <div className="timeline-content">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6 className="mb-1">{activity.title}</h6>
                            <p className="text-muted mb-0">{activity.description}</p>
                          </div>
                              <small className="text-muted">{new Date(activity.timestamp).toLocaleDateString()}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                    <div className="text-center mt-3">
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="ti ti-eye me-1"></i>
                        View All Activities
                      </button>
              </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <i className="ti ti-activity fs-48 text-muted mb-3"></i>
                    <h6 className="text-muted">No recent activities</h6>
                    <p className="text-muted mb-0">Your recent activities will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="col-xl-4 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="ti ti-bell me-2"></i>
                  Notifications
                </h5>
                <small className="text-muted">
                  Latest {notifications.length} notifications
                </small>
              </div>
              <div className="card-body">
                {loading ? (
                  <LoadingSkeleton type="text" lines={3} />
                ) : notifications.length > 0 ? (
                  <>
                <div className="list-group list-group-flush">
                      {notifications.slice(0, 3).map((notification) => (
                    <div key={notification.id} className="list-group-item px-0">
                      <div className="d-flex align-items-start">
                        <div className={`avatar avatar-sm bg-${notification.type}-transparent rounded me-3`}>
                          <i className={`ti ti-bell text-${notification.type}`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{notification.title}</h6>
                          <p className="text-muted mb-1">{notification.message}</p>
                              <small className="text-muted">{new Date(notification.timestamp).toLocaleDateString()}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                    <div className="text-center mt-3">
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="ti ti-eye me-1"></i>
                        View All Notifications
                      </button>
              </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <i className="ti ti-bell fs-48 text-muted mb-3"></i>
                    <h6 className="text-muted">No notifications</h6>
                    <p className="text-muted mb-0">New notifications will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

          {/* Documents */}
        <div className="row">
          <div className="col-xl-12 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-0">
                <h5 className="mb-0">
                  <i className="ti ti-file-text me-2"></i>
                  Documents
                </h5>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3 p-3 bg-light rounded">
                  <div className="d-flex align-items-center">
                    <i className="ti ti-pdf text-danger me-3 fs-18"></i>
                    <div>
                      <h6 className="mb-1">Resume</h6>
                      <small className="text-muted">PDF Document</small>
                    </div>
                  </div>
                  {teacherData.Resume ? (
                    <a href={teacherData.Resume} className="btn btn-sm btn-outline-primary" download>
                      <i className="ti ti-download me-1"></i>
                      Download
                    </a>
                  ) : (
                    <span className="text-muted">Not Available</span>
                  )}
                </div>
                <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
                  <div className="d-flex align-items-center">
                    <i className="ti ti-file-text text-primary me-3 fs-18"></i>
                    <div>
                      <h6 className="mb-1">Joining Letter</h6>
                      <small className="text-muted">PDF Document</small>
                    </div>
                  </div>
                  {teacherData.joiningLetter ? (
                    <a href={teacherData.joiningLetter} className="btn btn-sm btn-outline-primary" download>
                      <i className="ti ti-download me-1"></i>
                      Download
                    </a>
                  ) : (
                    <span className="text-muted">Not Available</span>
                  )}
                </div>
              </div>
            </div>
          </div>
              </div>
                  </div>

      {/* Modals */}

      <LeaveRequestModal
        isOpen={showLeaveRequestModal}
        onClose={() => setShowLeaveRequestModal(false)}
        request={selectedLeaveRequest}
        onApprove={handleApproveLeave}
        onReject={handleRejectLeave}
        loading={modalLoading}
      />

      <FaceAttendanceModal
        isOpen={showFaceAttendanceModal}
        onClose={() => setShowFaceAttendanceModal(false)}
        onConfirm={handleFaceAttendance}
        loading={attendanceLoading}
      />
      
      {/* Quick Action Modals */}
      
      {/* Leave Application Modal */}
      {showLeaveApplicationModal && (
        <ModalPortal>
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Apply Leave</h5>
                  <button type="button" className="btn-close" onClick={() => setShowLeaveApplicationModal(false)}></button>
                </div>
                <div className="modal-body">
                  <LeaveApplicationForm 
                    teacherId={teacherId || ''}
                    onSuccess={() => {
                      setShowLeaveApplicationModal(false);
                      toast.success("Leave application submitted successfully");
                    }}
                    onCancel={() => setShowLeaveApplicationModal(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Routine View Modal */}
      {showRoutineModal && (
        <ModalPortal>
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Teacher Routine</h5>
                  <button type="button" className="btn-close" onClick={() => setShowRoutineModal(false)}></button>
                </div>
                <div className="modal-body">
                  <RoutineView 
                    lessons={lessons}
                    onClose={() => setShowRoutineModal(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Salary Info Modal */}
      {showSalaryModal && (
        <ModalPortal>
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Salary Information</h5>
                  <button type="button" className="btn-close" onClick={() => setShowSalaryModal(false)}></button>
                </div>
                <div className="modal-body">
                  <SalaryInfo 
                    teacherData={teacherData}
                    onClose={() => setShowSalaryModal(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Library Modal */}
      {showLibraryModal && (
        <ModalPortal>
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Library Access</h5>
                  <button type="button" className="btn-close" onClick={() => setShowLibraryModal(false)}></button>
                </div>
                <div className="modal-body">
                  <LibraryAccess 
                    teacherId={teacherId || ''}
                    onClose={() => setShowLibraryModal(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Add Exam Modal */}
      {showAddExamModal && (
        <ModalPortal>
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Exam</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddExamModal(false)}></button>
                </div>
                <div className="modal-body">
                  <AddExamForm 
                    teacherId={teacherId || ''}
                    onSuccess={() => {
                      setShowAddExamModal(false);
                      toast.success("Exam added successfully");
                    }}
                    onCancel={() => setShowAddExamModal(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Register Face Modal */}
      {showRegisterFaceModal && (
        <ModalPortal>
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Register Face</h5>
                  <button type="button" className="btn-close" onClick={() => setShowRegisterFaceModal(false)}></button>
                </div>
                <div className="modal-body">
                  <RegisterFaceWebcam
                    loading={registerFaceLoading}
                    onRegister={async (file: File) => {
                      setRegisterFaceLoading(true);
                      try {
                        const response = await uploadTeacherFace({ image: file });
                        if (response.status === 200 || response.status === 201) {
                          toast.success('Face registered successfully!');
                          setShowRegisterFaceModal(false);
                        } else {
                          toast.error(response.data?.message || 'Failed to register face');
                        }
                      } catch (error: any) {
                        toast.error(error.response?.data?.message || 'Failed to register face');
                      } finally {
                        setRegisterFaceLoading(false);
                      }
                    }}
                    onCancel={() => setShowRegisterFaceModal(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default React.memo(Teacherui); 

// export default Teacherui;