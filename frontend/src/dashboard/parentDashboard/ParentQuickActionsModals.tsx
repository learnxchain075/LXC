import React, { useState, useEffect } from 'react';
import { Modal, Spinner, Tab, Tabs, Table, Alert, Button, Form, Image } from 'react-bootstrap';
import { getstudentprofiledetails, getAttendanceLeavesByStudentId, applyStudentLeave, getFeesByStudentId, getLessonsByStudentId, getResourcesByStudentId, getStudentLibraryBooks, getDashboardResourcesByStudentId, getstudentprofiledetailsparents, getExamsResultsByStudentIdParam, IExam } from '../../services/student/StudentAllApi';
import { getStudentTimetable } from '../../services/student/StudentDashboardApi';
import { createFeeOrder, verifyFeePayment } from '../../services/payfee';
import BaseApi from '../../services/BaseApi';
import { getFeesByStudent } from '../../services/accounts/feesServices';
import { createTicket } from '../../services/superadmin/ticketApi';
import { registerMessage } from '../../services/contactserviceMessgae';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table as AntdTable, Button as AntdButton, Modal as AntdModal, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { CloudLightning } from 'react-feather';


const Loader = () => <div className="text-center py-4"><LoadingSkeleton lines={4} height={20} /></div>;
const ErrorMsg = ({ msg }: { msg: string }) => <Alert variant="danger">{msg}</Alert>;
const EmptyMsg = ({ msg }: { msg: string }) => <Alert variant="info">{msg}</Alert>;

const formatDate = (date: string) => {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatTime = (date: string) => {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

// Razorpay loader utility
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}


function FeePaymentModal({ show, onHide, fee }: { show: boolean, onHide: () => void, fee: any }) {
 
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton><Modal.Title>Pay Fee</Modal.Title></Modal.Header>
      <Modal.Body>
        <h5>Pay {fee.category} Fee</h5>
        <p>Amount: <b>₹{fee.amount}</b></p>
        <Alert variant="info">Payment integration coming soon!</Alert>
        <Button variant="primary" onClick={onHide}>Close</Button>
      </Modal.Body>
    </Modal>
  );
}

// Student Details Modal
export function StudentDetailsModal({ show, onHide, studentId }: { show: boolean, onHide: () => void, studentId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  
  useEffect(() => {
    if (!show || !studentId) return;
    setLoading(true);
    setError(null);
    
 
    getstudentprofiledetails(studentId)
      .then(res => { 
        console.log('Student Details Response:', res.data);
        setData(res.data); 
      })
      .catch((err) => {
        console.error('Student Details Error:', err);
        if (err?.response?.status === 404) {
          setError('Student not found. Please check the student ID.');
        } else if (err?.response?.status === 403) {
          setError('Access denied. You may not have permission to view this student\'s details.');
        } else if (err?.message?.includes('Network')) {
          setError('Network error. Please check your internet connection and try again.');
        } else {
          setError('Failed to load student details. Please try again later.');
        }
      })
      .finally(() => setLoading(false));
  }, [show, studentId]);

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Helper function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return 'bg-success';
      case 'PARTIAL':
        return 'bg-warning';
      case 'PENDING':
        return 'bg-info';
      case 'FAILED':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  // Helper function to get payment status badge color
  const getPaymentStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return 'bg-success';
      case 'PENDING':
        return 'bg-warning';
      case 'FAILED':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className={dataTheme === "dark_data_theme" ? "lxc-dark-modal" : ""}
    >
      <Modal.Header closeButton className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}>
        <Modal.Title className={dataTheme === "dark_data_theme" ? "lxc-dark-modal-title" : ""}>
          <i className="ti ti-user me-2"></i>
          Student Details
          {loading && <LoadingSkeleton lines={1} height={16} />}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""}>
        {loading && <Loader />}
        {error && <ErrorMsg msg={error} />}
        {data && (
          <div>
            {/* Student Basic Information */}
            <div className="row mb-4">
              <div className="col-md-3 text-center">
                <img 
                  src={data.profilePic || '/assets/img/default-avatar.png'} 
                  alt={data.name || 'Student'} 
                  className="rounded-circle border border-2"
                  width="100"
                  height="100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="col-md-9">
                <h5 className={`mb-2 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>{data.name || data.studentName || 'Student Name'}</h5>
                <div className="row">
                  <div className="col-md-6">
                    <p className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><strong>Student ID:</strong> {studentId}</p>
                    <p className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><strong>School ID:</strong> {data.schoolId || '-'}</p>
                  </div>
                  <div className="col-md-6">
                    <p className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><strong>Class:</strong> {data.student?.class?.name || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Details */}
            {data.student && (
              <div className="mb-4">
                <h6 className={`border-bottom pb-2 ${dataTheme === "dark_data_theme" ? "text-white border-secondary" : ""}`}>
                  <i className="ti ti-user me-2"></i>Student Information
                </h6>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className={`card ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : ""}`}>
                      <div className={`card-body ${dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""}`}>
                        <h6 className={`${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>Personal Information</h6>
                        <p className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><strong>Roll No:</strong> {data.student.rollNo || '-'}</p>
                        <p className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><strong>Admission No:</strong> {data.student.admissionNo || '-'}</p>
                        <p className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><strong>Date of Birth:</strong> {formatDate(data.student.dateOfBirth)}</p>
                        <p className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><strong>Status:</strong> 
                          <span className={`badge ${data.student.status === 'ACTIVE' ? 'bg-success' : 'bg-warning'} ms-2`}>
                            {data.student.status || '-'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className={`card ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : ""}`}>
                      <div className={`card-body ${dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""}`}>
                        <h6 className={`${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>Academic Information</h6>
                        <p className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><strong>Class:</strong> {data.student.class?.name || '-'}</p>
                        <p className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><strong>Section:</strong> {data.student.class?.section || '-'}</p>
                        <p className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><strong>Academic Year:</strong> {data.student.academicYear || '-'}</p>
                        <p className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><strong>Admission Date:</strong> {formatDate(data.student.admissionDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parent Information */}
                <div className="mt-4">
                  <h6 className={`border-bottom pb-2 ${dataTheme === "dark_data_theme" ? "text-white border-secondary" : ""}`}>
                    <i className="ti ti-users me-2"></i>Parent Information
                  </h6>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className={`card ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : ""}`}>
                        <div className={`card-body ${dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""}`}>
                          <h6 className={`${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>Father's Details</h6>
                          <p className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><strong>Name:</strong> {data.student.fatherName || '-'}</p>
                          <p className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><strong>Email:</strong> {data.student.fatheremail || '-'}</p>
                          <p className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><strong>Phone:</strong> {data.student.fatherPhone || '-'}</p>
                          <p className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><strong>Occupation:</strong> {data.student.fatherOccupation || '-'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className={`card ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : ""}`}>
                        <div className={`card-body ${dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""}`}>
                          <h6 className={`${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>Mother's Details</h6>
                          <p className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><strong>Name:</strong> {data.student.motherName || '-'}</p>
                          <p className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><strong>Email:</strong> {data.student.motherEmail || '-'}</p>
                          <p className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><strong>Phone:</strong> {data.student.motherPhone || '-'}</p>
                          <p className={`mb-1 ${dataTheme === "dark_data_theme" ? "text-light" : ""}`}><strong>Occupation:</strong> {data.student.motherOccupation || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* No Data Message */}
            {(!data || !data.student) && (
              <div className="text-center py-4">
                <i className="ti ti-user-off fs-1 text-muted mb-3"></i>
                <h5 className={`${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>No Student Data Available</h5>
                <p className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                  No student details found for this student ID.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

// Add this helper near the top (with other helpers):
const formatDisplayDate = (date: string) => {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Attendance & Leave Modal
export function AttendanceLeaveModal({ show, onHide, studentId }: { show: boolean, onHide: () => void, studentId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    reason: '',
    fromDate: '',
    toDate: '',
  });
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const userObj = useSelector((state: any) => state.auth.userObj);

  const userId = userObj?.id || data?.student?.userId || localStorage.getItem('userId') || '';

  const fetchAttendanceLeaves = () => {
    setLoading(true);
    setError(null);
    getAttendanceLeavesByStudentId(studentId)
      .then(res => { setData(res.data); })
      .catch(() => setError('Failed to load attendance/leave'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!show) return;
   // console.log('Selected child/studentId:', studentId);
    fetchAttendanceLeaves();
  }, [show, studentId]);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyLoading(true);
    setApplyError(null);
    setApplySuccess(null);
    if (!form.reason.trim() || !form.fromDate || !form.toDate) {
      setApplyError('All fields are required.');
      setApplyLoading(false);
      return;
    }
    if (!userId) {
      setApplyError('User session not found. Please log in again.');
      setApplyLoading(false);
      return;
    }
    try {
   // console.log(studentId);
      await applyStudentLeave({
        userId: studentId,
        reason: form.reason.trim(),
        fromDate: form.fromDate,
        toDate: form.toDate,
      });
      setApplySuccess('Leave request submitted successfully!');
      setForm({ reason: '', fromDate: '', toDate: '' });
      setTimeout(() => {
        setShowApplyModal(false);
        setApplySuccess(null);
        fetchAttendanceLeaves();
      }, 1200);
    } catch (err: any) {
      setApplyError(err?.response?.data?.message || err?.message || 'Failed to submit leave request.');
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        centered
        className={dataTheme === "dark_data_theme" ? "lxc-dark-modal" : ""}
      >
        <Modal.Header closeButton className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}>
          <Modal.Title className={dataTheme === "dark_data_theme" ? "lxc-dark-modal-title" : ""}>
            <i className="ti ti-calendar-due me-2"></i>Attendance & Leave
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""}>
          {loading && <Loader />}
          {error && <ErrorMsg msg={error} />}
          {data && (
            (data.attendance?.length > 0 || data.leaveRequests?.length > 0) ? (
              <Tabs defaultActiveKey="attendance" className="mb-3">
                <Tab eventKey="attendance" title="Attendance">
                  {data.attendance?.length > 0 ? (
                    <Table 
                      striped 
                      bordered 
                      hover 
                      size="sm" 
                      className={dataTheme === "dark_data_theme" ? "table-dark lxc-dark-modal-table" : ""}
                    >
                      <thead><tr><th>Date</th><th>Status</th></tr></thead>
                      <tbody>
                        {data.attendance.map((a: any) => (
                          <tr key={a.id}><td>{formatDate(a.date)}</td><td>{a.present ? 'Present' : 'Absent'}</td></tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : <EmptyMsg msg="No attendance data available." />}
                </Tab>
                <Tab eventKey="leave" title="Leave Requests">
                  <div className="d-flex justify-content-end mb-2">
                    <Button size="sm" variant="primary" onClick={() => setShowApplyModal(true)}>
                      Apply Leave
                    </Button>
                  </div>
                  {data.leaveRequests?.length > 0 ? (
                    <Table 
                      striped 
                      bordered 
                      hover 
                      size="sm" 
                      className={dataTheme === "dark_data_theme" ? "table-dark lxc-dark-modal-table" : ""}
                    >
                      <thead><tr><th>From</th><th>To</th><th>Reason</th><th>Status</th></tr></thead>
                      <tbody>
                        {data.leaveRequests.map((l: any) => (
                          <tr key={l.id}><td>{formatDisplayDate(l.fromDate)}</td><td>{formatDisplayDate(l.toDate)}</td><td>{l.reason}</td><td>{l.status}</td></tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : <EmptyMsg msg="No leave requests found." />}
                </Tab>
              </Tabs>
            ) : <EmptyMsg msg="No attendance or leave data available." />
          )}
        </Modal.Body>
      </Modal>
      {/* Apply Leave Modal */}
      <Modal show={showApplyModal} onHide={() => { setShowApplyModal(false); setApplyError(null); setApplySuccess(null); }} centered className={dataTheme === "dark_data_theme" ? "lxc-dark-modal" : ""}>
        <Modal.Header closeButton className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}>
          <Modal.Title className={dataTheme === "dark_data_theme" ? "lxc-dark-modal-title" : ""}>
            <i className="ti ti-calendar-plus me-2"></i>Apply for Leave
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""}>
          {applySuccess && <Alert variant="success">{applySuccess}</Alert>}
          {applyError && <Alert variant="danger">{applyError}</Alert>}
          <Form onSubmit={handleApplyLeave}>
            <Form.Group className="mb-3">
              <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}>Reason</Form.Label>
              <Form.Control as="textarea" rows={2} value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} required disabled={applyLoading} className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}>From Date</Form.Label>
              <Form.Control type="date" value={form.fromDate} onChange={e => setForm(f => ({ ...f, fromDate: e.target.value }))} required disabled={applyLoading} className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}>To Date</Form.Label>
              <Form.Control type="date" value={form.toDate} onChange={e => setForm(f => ({ ...f, toDate: e.target.value }))} required disabled={applyLoading} className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""} />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowApplyModal(false)} disabled={applyLoading}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={applyLoading}>{applyLoading ? 'Submitting...' : 'Submit'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}


export function FeesModal({ show, onHide, studentId, refetchDashboard, onFeesUpdated }: { 
  show: boolean, 
  onHide: () => void, 
  studentId: string, 
  refetchDashboard?: () => void,
  onFeesUpdated?: (updatedFees: any) => void 
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payFee, setPayFee] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [payModal, setPayModal] = useState<{fee: any, show: boolean} | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payError, setPayError] = useState<string | null>(null);
  const [payConfirm, setPayConfirm] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);

  useEffect(() => {
    if (!show) return;
    setLoading(true);
    setFatalError(null);
    getFeesByStudent(studentId)
      .then(res => setData({ fees: res.data }))
      .catch((err) => {
        if (err?.response?.status === 404) {
          setFatalError('Fee data not found for this student. Please contact school admin.');
        } else if (err?.message?.includes('Network')) {
          setFatalError('Network error. Please check your internet connection and try again.');
        } else {
          setFatalError('An unexpected error occurred while loading fees. Please try again later.');
        }
      })
      .finally(() => setLoading(false));
  }, [show, studentId, paymentStatus]);

 
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_EJh0TkmUgkZNyG';

  async function handlePayNow(fee: any) {
    // Calculate the remaining amount to pay
    const remainingAmount = fee.amount - (fee.amountPaid || 0);
    setPayAmount(remainingAmount);
    setPayError(null);
    setPayConfirm(false);
    setPayModal({ fee, show: true });
  }

  async function handlePayConfirm() {
    setPaying(true);
    setPaymentStatus(null);
    setPaymentError(null);
    setFatalError(null);
    setPayError(null);
    const fee = payModal?.fee;
    if (!fee) {
      toast.error('Fee information not found. Please try again.');
      setPaying(false);
      return;
    }
    const remainingAmount = fee.amount - (fee.amountPaid || 0);
    if (payAmount < 1 || payAmount > remainingAmount) {
      setPayError('Please enter a valid amount between ₹1 and ₹' + remainingAmount);
      setPaying(false);
      return;
    }
    const isRazorpayLoaded = await loadRazorpayScript();
    if (!isRazorpayLoaded) {
      setPaymentError('Payment gateway failed to load. Please check your internet connection and try again.');
      setPaying(false);
      toast.error('Payment gateway unavailable. Please try again later.');
      return;
    }
    try {
     
      const orderRes = await createFeeOrder(fee.id, payAmount);
      const { orderId, amount, currency, success, error } = orderRes.data;
      if (!success) {
        const errorMessage = error || 'Failed to create payment order';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    
      const options = {
        key: razorpayKey,
        amount,
        currency,
        name: 'LearnXChain',
        description: `${fee.category} Fee Payment`,
        order_id: orderId,
        handler: async function (paymentResponse: any) {
          setPayModal(null); 
          setVerifying(true); 
          setPaymentStatus('verifying');
          try {
            const verifyRes = await verifyFeePayment(
              paymentResponse.razorpay_order_id,
              paymentResponse.razorpay_payment_id,
              paymentResponse.razorpay_signature,
              fee.id
            );
          // console.log('Payment Verification Response:', verifyRes.data);
          if (verifyRes.data && (verifyRes.data.status === 'PAID' || verifyRes.data.status === 'PARTIAL')) {
              setPaymentStatus('success');
              setPayFee(null);
              setVerifying(false);
              toast.success('Payment successful! Fee paid.');
              // Update the fees data locally instead of refetching entire dashboard
              setData((prevData: any) => {
                if (!prevData || !prevData.fees) return prevData;
                const updatedFees = prevData.fees.map((fee: any) => {
                  if (fee.id === payModal?.fee?.id) {
                    const newAmountPaid = (fee.amountPaid || 0) + payAmount;
                    const newStatus = newAmountPaid >= fee.amount ? 'PAID' : 'PARTIAL';
                    return {
                      ...fee,
                      status: newStatus,
                      amountPaid: newAmountPaid,
                      Payment: [
                        ...(fee.Payment || []),
                        {
                          id: paymentResponse.razorpay_payment_id,
                          amount: payAmount,
                          method: 'Online',
                          paymentDate: new Date().toISOString(),
                          status: 'SUCCESS',
                          invoiceNumber: `INV-${Date.now()}`,
                          invoiceUrl: `/api/payments/${paymentResponse.razorpay_payment_id}/invoice`,
                          receiptUrl: `/api/payments/${paymentResponse.razorpay_payment_id}/receipt`
                        }
                      ]
                    };
                  }
                  return fee;
                });
                
                // Notify parent component about the updated fees
                if (onFeesUpdated) {
                  onFeesUpdated(updatedFees);
                }
                
                return {
                  ...prevData,
                  fees: updatedFees
                };
              });
            } else {
              setPaymentStatus('failed');
              const errorMessage = verifyRes.data?.message || 'Payment verification failed. Please contact support if amount was deducted.';
              setPaymentError(errorMessage);
              setVerifying(false);
              toast.error(errorMessage);
            }
            // Payment Response
          } catch (err: any) {
            setPaymentStatus('failed');
            const errorMessage = err?.response?.data?.message || err?.message || 'Payment verification failed. Please contact support if amount was deducted.';
            setPaymentError(errorMessage);
            setVerifying(false);
            toast.error(errorMessage);
            // Payment Error
            
            // Reset payment state on verification failure
            setPayAmount(0);
            setPayConfirm(false);
            setPayError(null);
          } finally {
            setPaying(false);
          }
        },
        prefill: {},
        theme: { color: '#0d6efd' },
        modal: {
          ondismiss: function () {
            setPaying(false);
            setPaymentStatus(null);
            setPayModal(null);
            // Reset payment state when modal is dismissed
            setPayAmount(0);
            setPayConfirm(false);
            setPayError(null);
          }
        }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setPaying(false);
        setPaymentStatus('failed');
        setPaymentError('Payment failed: ' + (response.error?.description || 'Unknown error'));
        setPayModal(null);
        setVerifying(false);
        toast.error('Payment failed. Please try again.');
        
        // Reset payment amount and confirmation
        setPayAmount(0);
        setPayConfirm(false);
        setPayError(null);
      });
      rzp.open();
          } catch (err: any) {
        if (err?.response?.status === 404) {
          setFatalError('Payment endpoint not found. Please contact school admin.');
        } else if (err?.message?.includes('Network')) {
          setFatalError('Network error. Please check your internet connection and try again.');
        } else {
          setFatalError(err.message || 'Payment initiation failed.');
        }
        setPaymentStatus('failed');
        setPaying(false);
        setPayModal(null);
        setVerifying(false);
        toast.error('Payment failed. Please try again.');
        
        // Reset payment state on initiation failure
        setPayAmount(0);
        setPayConfirm(false);
        setPayError(null);
      }
  }

  async function handleDownloadReceipt(payment: any, type: 'receipt' | 'invoice' = 'receipt') {
    setDownloading(payment.id);
    try {
      let downloadUrl = '';
      let filename = '';
      
      if (type === 'invoice') {
        // Use the invoice URL from the payment response
        downloadUrl = payment.invoiceUrl || payment.officeInvoiceUrl;
        filename = payment.invoiceNumber ? `${payment.invoiceNumber}.pdf` : `invoice_${payment.id}.pdf`;
      } else {
        // Use the receipt URL from the payment response
        downloadUrl = payment.receiptUrl || payment.invoiceUrl;
        filename = payment.invoiceNumber ? `receipt_${payment.invoiceNumber}.pdf` : `receipt_${payment.id}.pdf`;
      }
      
      if (!downloadUrl) {
        throw new Error(`${type.charAt(0).toUpperCase() + type.slice(1)} URL not available`);
      }
      
      // Ensure URL is absolute
      if (!downloadUrl.startsWith('http')) {
        downloadUrl = `https://api.learnxchain.io${downloadUrl}`;
      }
      
      // Download the file directly from the URL
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} downloaded successfully`);
    } catch (err: any) {
      const errorMessage = err?.message || `Failed to download ${type}. Please try again later.`;
      toast.error(errorMessage);
    } finally {
      setDownloading(null);
    }
  }

  const handleViewDocument = (payment: any, type: 'receipt' | 'invoice' = 'receipt') => {
    try {
      let viewUrl = '';
      
      if (type === 'invoice') {
        viewUrl = payment.invoiceUrl || payment.officeInvoiceUrl;
      } else {
        viewUrl = payment.receiptUrl || payment.invoiceUrl;
      }
      
      if (!viewUrl) {
        toast.error(`${type.charAt(0).toUpperCase() + type.slice(1)} URL not available`);
        return;
      }
      
      // Ensure URL is absolute
      if (!viewUrl.startsWith('http')) {
        viewUrl = `https://api.learnxchain.io${viewUrl}`;
      }
      
      // Open the document in a new tab
      window.open(viewUrl, '_blank');
    } catch (err: any) {
      toast.error(`Failed to open ${type}. Please try again later.`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return 'bg-success';
      case 'PENDING':
        return 'bg-warning';
      case 'FAILED':
        return 'bg-danger';
      case 'PARTIAL':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'upi':
        return 'ti ti-credit-card';
      case 'card':
        return 'ti ti-credit-card';
      case 'netbanking':
        return 'ti ti-building-bank';
      case 'wallet':
        return 'ti ti-wallet';
      default:
        return 'ti ti-credit-card';
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        centered
        className={dataTheme === "dark_data_theme" ? "lxc-dark-modal" : ""}
      >
        <Modal.Header closeButton className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}>
          <Modal.Title className={dataTheme === "dark_data_theme" ? "lxc-dark-modal-title" : ""}>
            <i className="ti ti-report-money me-2"></i>Fees
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""}>
          {loading && <Loader />}
          {fatalError && (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
              <i className="bi bi-emoji-frown text-danger" style={{ fontSize: 48 }}></i>
              <h5 className={`mt-3 ${dataTheme === "dark_data_theme" ? "text-danger" : "text-danger"}`}>{fatalError}</h5>
              <p className={dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}>If this problem persists, please contact your school administrator.</p>
            </div>
          )}
          {verifying && (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
              <LoadingSkeleton lines={3} height={20} />
              <h5 className="text-primary">Verifying your payment...</h5>
              <p className={dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}>Please wait while we confirm your payment with the bank.</p>
            </div>
          )}
          {!fatalError && !verifying && data && (
            <>
              {/* Fee Summary */}
              <div className={`${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : "bg-light"} rounded p-3 mb-4`}>
                <h6 className={`mb-3 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                  <i className="ti ti-calculator me-2"></i>Fee Summary
                </h6>
                <div className="row">
                  <div className="col-md-3 mb-2">
                    <div className="text-center">
                      <div className={`badge bg-primary fs-6 mb-1`}>
                        ₹{data.fees.reduce((sum: number, f: any) => sum + f.amount, 0).toLocaleString()}
                      </div>
                      <div className={`small ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>Total Amount</div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-2">
                    <div className="text-center">
                      <div className={`badge bg-success fs-6 mb-1`}>
                        ₹{data.fees.reduce((sum: number, f: any) => sum + (f.amountPaid || 0), 0).toLocaleString()}
                      </div>
                      <div className={`small ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>Total Paid</div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-2">
                    <div className="text-center">
                      <div className={`badge bg-warning fs-6 mb-1`}>
                        ₹{data.fees.reduce((sum: number, f: any) => sum + (f.amount - (f.amountPaid || 0)), 0).toLocaleString()}
                      </div>
                      <div className={`small ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>Total Due</div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-2">
                    <div className="text-center">
                      <div className={`badge bg-info fs-6 mb-1`}>
                        {data.fees.filter((f: any) => f.status === 'PAID').length}/{data.fees.length}
                      </div>
                      <div className={`small ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>Fees Paid</div>
                    </div>
                  </div>
                </div>
              </div>

              <h6 className={`mb-3 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                <i className="ti ti-alert-triangle me-2"></i>Fee Details
              </h6>
              
              {/* Enhanced Fee Details */}
              <div className={`${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : "bg-white"} rounded border`}>
                <div className={`p-3 border-bottom ${dataTheme === "dark_data_theme" ? "border-secondary" : ""}`}>
                  <h6 className={`mb-0 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                    <i className="ti ti-list me-2"></i>All Fees
                  </h6>
                </div>
                <div className="p-0">
                  {data.fees.map((f: any, idx: number) => (
                    <div key={f.id} className={`p-3 border-bottom ${dataTheme === "dark_data_theme" ? "border-secondary" : ""} ${idx % 2 === 0 ? (dataTheme === "dark_data_theme" ? "bg-dark" : "bg-light") : ""}`}>
                      <div className="row align-items-center">
                        <div className="col-md-3">
                          <div className={`fw-bold ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                            {f.category}
                          </div>
                          <div className={`small ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                            Due: {formatDate(f.dueDate)}
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className={`fw-bold ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                            {formatCurrency(f.amount)}
                          </div>
                          <div className={`small ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                            Original Amount
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className={`fw-bold ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                            {formatCurrency(f.amountPaid || 0)}
                          </div>
                          <div className={`small ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                            Amount Paid
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className={`fw-bold ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                            {formatCurrency(f.amount - (f.amountPaid || 0))}
                          </div>
                          <div className={`small ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                            Balance
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="d-flex align-items-center">
                            <span className={`badge ${getStatusBadge(f.status)} me-2`}>
                              {f.status}
                            </span>
                            {f.status !== 'PAID' && f.amount > (f.amountPaid || 0) && (
                              <Button 
                                size="sm" 
                                variant="success" 
                                disabled={paying} 
                                onClick={() => handlePayNow(f)}
                                className="btn-sm"
                              >
                                <i className="ti ti-credit-card me-1"></i>
                                Pay
                          </Button>
                        )}
                          </div>
                        </div>
                        <div className="col-md-1">
                          <div className="text-end">
                            {f.discount > 0 && (
                              <div className={`badge bg-success ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                                -₹{f.discount}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {f.finePerDay > 0 && (
                        <div className="mt-2">
                          <Alert variant="warning" className="py-2 mb-0">
                            <i className="ti ti-alert-triangle me-1"></i>
                            <small>Late fee: ₹{f.finePerDay} per day after due date</small>
                          </Alert>
                        </div>
                      )}
                    </div>
                  ))}
                  {data.fees.length === 0 && (
                    <div className="p-4 text-center">
                      <i className="ti ti-check-circle fs-1 text-success mb-3"></i>
                      <h6 className={`${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>No Fees Due</h6>
                      <p className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                        All fees have been paid or no fees are currently due.
                      </p>
                    </div>
                  )}
                </div>
              </div>
                        {paymentStatus === 'success' && (
            <Alert variant="success">
              <i className="ti ti-check-circle me-2"></i>
              Payment successful! Fee paid.
            </Alert>
          )}
          {paymentStatus === 'failed' && (
            <Alert variant="danger">
              <i className="ti ti-alert-circle me-2"></i>
              {paymentError || 'Payment failed.'}
              <div className="mt-2">
                <Button 
                  size="sm" 
                  variant="outline-danger" 
                  onClick={() => {
                    setPaymentStatus(null);
                    setPaymentError(null);
                    setPayModal({ fee: payModal?.fee, show: true });
                  }}
                >
                  <i className="ti ti-refresh me-1"></i>
                  Try Again
                </Button>
              </div>
            </Alert>
          )}
          {paymentStatus === 'verifying' && (
            <Alert variant="info">
              <i className="ti ti-loader me-2"></i>
              Verifying payment...
            </Alert>
          )}
              <h6 className={`mt-4 mb-3 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                <i className="ti ti-history me-2"></i>Payment History
              </h6>
              
              {/* Enhanced Payment History */}
              <div className={`${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : "bg-light"} rounded p-3 mb-3`}>
                <div className="row">
                  <div className="col-md-3">
                    <div className="text-center">
                      <div className={`badge ${getStatusBadge('PAID')} fs-6 mb-2`}>
                        {data.fees.filter((f: any) => f.status === 'PAID').length} Paid
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <div className={`badge ${getStatusBadge('PENDING')} fs-6 mb-2`}>
                        {data.fees.filter((f: any) => f.status === 'PENDING').length} Pending
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <div className={`badge ${getStatusBadge('FAILED')} fs-6 mb-2`}>
                        {data.fees.filter((f: any) => f.status === 'FAILED').length} Failed
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <div className="badge bg-info fs-6 mb-2">
                        ₹{data.fees.reduce((sum: number, f: any) => sum + (f.amountPaid || 0), 0).toLocaleString()}
                      </div>
                      <div className={`small ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>Total Paid</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Payment History */}
              <div className={`${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : "bg-white"} rounded border`}>
                <div className={`p-3 border-bottom ${dataTheme === "dark_data_theme" ? "border-secondary" : ""}`}>
                  <h6 className={`mb-0 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                    <i className="ti ti-list me-2"></i>Recent Payments
                  </h6>
                </div>
                <div className="p-0">
                  {data.fees
                    .flatMap((f: any) => f.Payment || [])
                    .sort((a: any, b: any) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
                    .slice(0, 10) // Show only recent 10 payments
                    .map((p: any, idx: number) => (
                      <div key={idx} className={`p-3 border-bottom ${dataTheme === "dark_data_theme" ? "border-secondary" : ""} ${idx % 2 === 0 ? (dataTheme === "dark_data_theme" ? "bg-dark" : "bg-light") : ""}`}>
                        <div className="row align-items-center">
                          <div className="col-md-2">
                            <div className="d-flex align-items-center">
                              <i className={`${getPaymentMethodIcon(p.paymentMethod)} me-2 ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}></i>
                              <span className={`badge ${getStatusBadge(p.status)}`}>
                                {p.status}
                              </span>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className={`fw-bold ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                              {formatCurrency(p.amount)}
                            </div>
                            <div className={`small ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                              {p.paymentMethod || 'Online'}
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className={`${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
                              {formatDate(p.paymentDate)}
                            </div>
                            <div className={`small ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                              {formatTime(p.paymentDate)}
                            </div>
                          </div>
                                                     <div className="col-md-2">
                             <div className={`small ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                               Order: {p.razorpayOrderId?.slice(-8) || 'N/A'}
                             </div>
                             {p.invoiceNumber && (
                               <div className={`small ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`} title={p.invoiceNumber}>
                                 Invoice: {p.invoiceNumber.length > 15 ? p.invoiceNumber.slice(0, 15) + '...' : p.invoiceNumber}
                               </div>
                             )}
                           </div>
                                                     <div className="col-md-2">
                             <div className="d-flex gap-1 flex-wrap">
                               {p.status === 'PAID' && (p.invoiceUrl || p.officeInvoiceUrl) && (
                                 <>
                                   <Button 
                                     size="sm" 
                                     variant="outline-success" 
                                     onClick={() => handleViewDocument(p, 'invoice')} 
                                     title="View Invoice"
                                     className="btn-sm"
                                   >
                                     <i className="ti ti-eye"></i>
                          </Button>
                                   <Button 
                                     size="sm" 
                                     variant="outline-success" 
                                     onClick={() => handleDownloadReceipt(p, 'invoice')} 
                                     disabled={downloading === p.id} 
                                     title="Download Invoice"
                                     className="btn-sm"
                                   >
                                     {downloading === p.id ? (
                                       <LoadingSkeleton lines={1} height={12} />
                                     ) : (
                                       <i className="ti ti-file-text"></i>
                                     )}
                                   </Button>
                                 </>
                               )}
                               <Button 
                                 size="sm" 
                                 variant="outline-info" 
                                 onClick={() => handleViewDocument(p, 'receipt')} 
                                 title="View Receipt"
                                 className="btn-sm"
                               >
                                 <i className="ti ti-eye"></i>
                               </Button>
                               <Button 
                                 size="sm" 
                                 variant="outline-primary" 
                                 onClick={() => handleDownloadReceipt(p, 'receipt')} 
                                 disabled={downloading === p.id || !p.id} 
                                 title="Download Receipt"
                                 className="btn-sm"
                               >
                                 {downloading === p.id ? (
                                   <LoadingSkeleton lines={1} height={12} />
                                 ) : (
                                   <i className="ti ti-download"></i>
                                 )}
                               </Button>
                             </div>
                           </div>
                        </div>
                        {p.failureReason && (
                          <div className="mt-2">
                            <Alert variant="danger" className="py-2 mb-0">
                              <i className="ti ti-alert-circle me-1"></i>
                              <small>{p.failureReason}</small>
                            </Alert>
                          </div>
                        )}
                      </div>
                    ))}
                  {data.fees.flatMap((f: any) => f.Payment || []).length === 0 && (
                    <div className="p-4 text-center">
                      <i className="ti ti-history fs-1 text-muted mb-3"></i>
                      <h6 className={`${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>No Payment History</h6>
                      <p className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
                        No payment records found for this student.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
      {/* Payment Amount Modal */}
      <Modal show={!!payModal?.show} onHide={() => setPayModal(null)} centered className={dataTheme === "dark_data_theme" ? "lxc-dark-modal" : ""}>
        <Modal.Header closeButton className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}>
          <Modal.Title className={dataTheme === "dark_data_theme" ? "lxc-dark-modal-title" : ""}>
            <i className="ti ti-credit-card me-2"></i>Pay Fee
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""}>
          {payModal && (
            <Form>
              <div className="mb-3">
                <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}>Fee Category</Form.Label>
                <div className="d-flex align-items-center gap-2">
                  <span className={dataTheme === "dark_data_theme" ? "text-white" : ""}><b>{payModal.fee.category}</b></span>
                  {payModal.fee.status && (
                    <span className={`badge ${payModal.fee.status === 'PAID' ? 'bg-success' : payModal.fee.status === 'PARTIAL' ? 'bg-warning' : 'bg-danger'}`}>
                      {payModal.fee.status}
                    </span>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}>Total Fee Amount</Form.Label>
                <div className={dataTheme === "dark_data_theme" ? "text-white" : ""}><b>₹{payModal.fee.amount}</b></div>
              </div>
              <div className="mb-3">
                <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}>Amount Already Paid</Form.Label>
                <div className={dataTheme === "dark_data_theme" ? "text-white" : ""}><b>₹{payModal.fee.amountPaid || 0}</b></div>
              </div>
              <div className="mb-3">
                <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}>Remaining Amount</Form.Label>
                <div className={`${dataTheme === "dark_data_theme" ? "text-white" : ""} ${(payModal.fee.amount - (payModal.fee.amountPaid || 0)) > 0 ? "text-danger" : "text-success"}`}>
                  <b>₹{payModal.fee.amount - (payModal.fee.amountPaid || 0)}</b>
                </div>
                {(payModal.fee.amount - (payModal.fee.amountPaid || 0)) <= 0 && (
                  <Alert variant="success" className="mt-2">
                    <i className="ti ti-check-circle me-2"></i>
                    This fee has been fully paid.
                  </Alert>
                )}
              </div>
              <div className="mb-3">
                <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}>Enter Amount to Pay</Form.Label>
                <div className="d-flex gap-2 mb-2">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => setPayAmount(payModal.fee.amount - (payModal.fee.amountPaid || 0))}
                    disabled={paying}
                  >
                    Pay Full Amount
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => setPayAmount(0)}
                    disabled={paying}
                  >
                    Clear
                  </Button>
                </div>
                <Form.Control
                  type="number"
                  min={1}
                  max={payModal.fee.amount - (payModal.fee.amountPaid || 0)}
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  disabled={paying}
                  className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}
                />
                <Form.Text className={dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}>
                  Min: ₹1, Max: ₹{payModal.fee.amount - (payModal.fee.amountPaid || 0)}
                </Form.Text>
                {payError && <Alert variant="danger" className="mt-2">{payError}</Alert>}
              </div>
              
              {/* Payment Summary */}
              {payAmount > 0 && (
                <div className="mb-3 p-3 border rounded">
                  <h6 className={dataTheme === "dark_data_theme" ? "text-white" : ""}>Payment Summary</h6>
                  <div className="row">
                    <div className="col-6">
                      <small className={dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}>Amount to Pay:</small>
                      <div className={dataTheme === "dark_data_theme" ? "text-white" : ""}><b>₹{payAmount}</b></div>
                    </div>
                    <div className="col-6">
                      <small className={dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}>Remaining After Payment:</small>
                      <div className={dataTheme === "dark_data_theme" ? "text-white" : ""}><b>₹{Math.max(0, (payModal.fee.amount - (payModal.fee.amountPaid || 0)) - payAmount)}</b></div>
                    </div>
                  </div>
                </div>
              )}
              
              <Form.Check
                type="checkbox"
                label="I confirm the above amount is correct and wish to proceed."
                checked={payConfirm}
                onChange={e => setPayConfirm(e.target.checked)}
                disabled={paying}
                className={`mb-3 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}
              />
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setPayModal(null)} disabled={paying}>Cancel</Button>
                <Button 
                  variant="primary" 
                  onClick={handlePayConfirm} 
                  disabled={!payConfirm || paying || payAmount < 1 || payAmount > (payModal.fee.amount - (payModal.fee.amountPaid || 0)) || (payModal.fee.amount - (payModal.fee.amountPaid || 0)) <= 0}
                >
                  {paying ? <LoadingSkeleton lines={1} height={16} /> : (payModal.fee.amount - (payModal.fee.amountPaid || 0)) <= 0 ? 'Already Paid' : 'Pay Now'}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
      
      {/* Payment Status Modal */}
      <Modal show={!!paymentStatus} onHide={() => setPaymentStatus(null)} centered backdrop="static" className={dataTheme === "dark_data_theme" ? "lxc-dark-modal" : ""}>
        <Modal.Header closeButton={paymentStatus === 'failed'} className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}>
          <Modal.Title className={dataTheme === "dark_data_theme" ? "lxc-dark-modal-title" : ""}>
            {paymentStatus === 'verifying' && <i className="ti ti-loader me-2"></i>}
            {paymentStatus === 'success' && <i className="ti ti-check-circle me-2 text-success"></i>}
            {paymentStatus === 'failed' && <i className="ti ti-alert-circle me-2 text-danger"></i>}
            Payment Status
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""}>
          {paymentStatus === 'verifying' && (
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5 className={dataTheme === "dark_data_theme" ? "text-white" : ""}>Verifying Payment</h5>
              <p className={dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}>Please wait while we verify your payment...</p>
            </div>
          )}
          
          {paymentStatus === 'success' && (
            <div className="text-center">
              <i className="ti ti-check-circle fs-1 text-success mb-3"></i>
              <h5 className={dataTheme === "dark_data_theme" ? "text-white" : ""}>Payment Successful!</h5>
              <p className={dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}>Your payment has been processed successfully.</p>
              <div className="mt-3">
                <Button variant="success" onClick={() => setPaymentStatus(null)}>
                  <i className="ti ti-check me-2"></i>Done
                </Button>
              </div>
            </div>
          )}
          
          {paymentStatus === 'failed' && (
            <div className="text-center">
              <i className="ti ti-alert-circle fs-1 text-danger mb-3"></i>
              <h5 className={dataTheme === "dark_data_theme" ? "text-white" : ""}>Payment Failed</h5>
              <p className={dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}>
                {paymentError || 'Payment could not be processed. Please try again.'}
              </p>
              <div className="mt-3">
                <Button variant="danger" onClick={() => setPaymentStatus(null)}>
                  <i className="ti ti-x me-2"></i>Close
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}


export function TimetableModal({ show, onHide, studentId }: { show: boolean, onHide: () => void, studentId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  
  useEffect(() => {
    if (!show) return;
    setLoading(true);
    getLessonsByStudentId(studentId)
      .then(res => { setData(res.data); })
      .catch(() => setError('Failed to load timetable'))
      .finally(() => setLoading(false));
  }, [show, studentId]);
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className={dataTheme === "dark_data_theme" ? "lxc-dark-modal" : ""}
    >
      <Modal.Header closeButton className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}>
        <Modal.Title className={dataTheme === "dark_data_theme" ? "lxc-dark-modal-title" : ""}>
          <i className="ti ti-calendar me-2"></i>Timetable
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""}>
        {loading && <Loader />}
        {error && <ErrorMsg msg={error} />}
        {data && (
          data.lessons && data.lessons.length > 0 ? (
            <Table 
              striped 
              bordered 
              hover 
              size="sm" 
              className={dataTheme === "dark_data_theme" ? "table-dark lxc-dark-modal-table" : ""}
            >
              <thead><tr><th>Day</th><th>Subject</th><th>Start</th><th>End</th><th>Teacher</th></tr></thead>
              <tbody>
                {data.lessons.map((l: any) => (
                  <tr key={l.id}>
                    <td>{l.day}</td>
                    <td>{l.subject.name}</td>
                    <td>{formatTime(l.startTime)}</td>
                    <td>{formatTime(l.endTime)}</td>
                    <td>{l.teacher.user.name}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : <EmptyMsg msg="No timetable data available." />
        )}
      </Modal.Body>
    </Modal>
  );
}

export function AssignmentsModal({ show, onHide, studentId }: { show: boolean, onHide: () => void, studentId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  
  useEffect(() => {
    if (!show) return;
    setLoading(true);
    getResourcesByStudentId(studentId)
      .then(res => { setData(res.data); })
      .catch(() => setError('Failed to load assignments/homework'))
      .finally(() => setLoading(false));
  }, [show, studentId]);
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className={dataTheme === "dark_data_theme" ? "lxc-dark-modal" : ""}
    >
      <Modal.Header closeButton className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}>
        <Modal.Title className={dataTheme === "dark_data_theme" ? "lxc-dark-modal-title" : ""}>
          <i className="ti ti-book me-2"></i>Assignments & Homework
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""}>
        {loading && <Loader />}
        {error && <ErrorMsg msg={error} />}
        {data && (
          (data.assignments?.length > 0 || data.homeworks?.length > 0) ? (
            <Tabs defaultActiveKey="assignments" className="mb-3">
              <Tab eventKey="assignments" title="Assignments">
                {data.assignments?.length > 0 ? (
                  <Table 
                    striped 
                    bordered 
                    hover 
                    size="sm" 
                    className={dataTheme === "dark_data_theme" ? "table-dark lxc-dark-modal-table" : ""}
                  >
                    <thead><tr><th>Title</th><th>Status</th><th>Due</th></tr></thead>
                    <tbody>
                      {data.assignments.map((a: any) => (
                        <tr key={a.id}><td>{a.title}</td><td>{a.status}</td><td>{formatDate(a.dueDate)}</td></tr>
                      ))}
                    </tbody>
                  </Table>
                ) : <EmptyMsg msg="No assignments found." />}
              </Tab>
              <Tab eventKey="homework" title="Homework">
                {data.homeworks?.length > 0 ? (
                  <Table 
                    striped 
                    bordered 
                    hover 
                    size="sm" 
                    className={dataTheme === "dark_data_theme" ? "table-dark lxc-dark-modal-table" : ""}
                  >
                    <thead><tr><th>Title</th><th>Status</th><th>Due</th></tr></thead>
                    <tbody>
                      {data.homeworks.map((h: any) => (
                        <tr key={h.id}><td>{h.title}</td><td>{h.status}</td><td>{formatDate(h.dueDate)}</td></tr>
                      ))}
                    </tbody>
                  </Table>
                ) : <EmptyMsg msg="No homework found." />}
              </Tab>
            </Tabs>
          ) : <EmptyMsg msg="No assignments or homework data available." />
        )}
      </Modal.Body>
    </Modal>
  );
}

export function NoticesModal({ show, onHide, studentId }: { show: boolean, onHide: () => void, studentId: string }) {
  const [attachmentModal, setAttachmentModal] = useState<{ show: boolean, url: string | null }>({ show: false, url: null });
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  
  useEffect(() => {
    if (!show || !studentId) return;
    setLoading(true);
    setError(null);
    
    // Get notices and events data from dashboard resources
    getDashboardResourcesByStudentId(studentId)
      .then(res => { 
        console.log('Notices/Events Response:', res.data);
        if (res.data && res.data.success) {
        setData(res.data); 
        } else {
          setError('No notices or events data available.');
        }
      })
      .catch((err) => {
        console.error('Notices/Events Error:', err);
        if (err?.response?.status === 404) {
          setError('No notices or events found for this student.');
        } else if (err?.response?.status === 403) {
          setError('Access denied. You may not have permission to view notices and events.');
        } else if (err?.message?.includes('Network')) {
          setError('Network error. Please check your internet connection and try again.');
        } else {
          setError('Failed to load notices and events. Please try again later.');
        }
      })
      .finally(() => setLoading(false));
  }, [show, studentId]);
  
  if (!studentId) return null;

  const handleViewAttachment = (url: string) => {
    setAttachmentModal({ show: true, url });
  };
  const handleCloseAttachment = () => {
    setAttachmentModal({ show: false, url: null });
  };

  const noticeColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Date',
      dataIndex: 'noticeDate',
      key: 'noticeDate',
      width: 120,
      render: (date: string, record: any) => new Date(date || record.publishDate || record.noticeDate || '').toLocaleDateString(),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span style={{ maxWidth: 220, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Created By',
      dataIndex: 'creator',
      key: 'creator',
      width: 120,
      render: (creator: any) => creator?.name || 'N/A',
    },
    {
      title: 'Attachment',
      dataIndex: 'attachment',
      key: 'attachment',
      width: 120,
      render: (url: string) =>
        url ? (
          <AntdButton size="small" type="primary" onClick={() => handleViewAttachment(url)}>
            View Attachment
          </AntdButton>
        ) : null,
    },
  ];

  const eventColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date: string) => new Date(date || '').toLocaleDateString(),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span style={{ maxWidth: 220, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
        </Tooltip>
      ),
    },
  ];

  const holidayColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span style={{ maxWidth: 220, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <AntdModal 
        open={show} 
        onCancel={onHide} 
        footer={null} 
        width={900} 
        centered 
        title={
          <span className={dataTheme === "dark_data_theme" ? "text-white" : ""}>
            <i className="ti ti-bell me-2"></i>Notices & Events
          </span>
        }
        className={dataTheme === "dark_data_theme" ? "lxc-dark-antd-modal" : ""}
      >
        {loading && (
          <div className="text-center py-4">
            <LoadingSkeleton lines={4} height={20} />
            <p className={`mt-2 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>Loading notices and events...</p>
          </div>
        )}
        
        {error && (
          <Alert variant="danger" className="mb-3">
            <i className="ti ti-alert-circle me-2"></i>
            {error}
          </Alert>
        )}
        
        {!loading && !error && data && (
        <Tabs defaultActiveKey="notices" className="mb-3">
          <Tab eventKey="notices" title="Notices">
            <AntdTable
              columns={noticeColumns}
                dataSource={data.notices || []}
              rowKey="id"
              pagination={false}
              scroll={{ x: true }}
              locale={{ emptyText: 'No notices found.' }}
                className={dataTheme === "dark_data_theme" ? "dark-table" : ""}
            />
          </Tab>
          <Tab eventKey="events" title="Events">
            <AntdTable
              columns={eventColumns}
                dataSource={data.events || []}
              rowKey="id"
              pagination={false}
              scroll={{ x: true }}
              locale={{ emptyText: 'No events found.' }}
                className={dataTheme === "dark_data_theme" ? "dark-table" : ""}
            />
          </Tab>
            {data.holidays && data.holidays.length > 0 && (
            <Tab eventKey="holidays" title="Holidays">
              <AntdTable
                columns={holidayColumns}
                  dataSource={data.holidays}
                rowKey="id"
                pagination={false}
                scroll={{ x: true }}
                locale={{ emptyText: 'No holidays found.' }}
                  className={dataTheme === "dark_data_theme" ? "dark-table" : ""}
              />
            </Tab>
          )}
        </Tabs>
        )}
        
        {!loading && !error && (!data || (!data.notices?.length && !data.events?.length && !data.holidays?.length)) && (
          <div className="text-center py-4">
            <i className="ti ti-bell-off fs-1 text-muted mb-3"></i>
            <h5 className={`${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>No Data Available</h5>
            <p className={`${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
              No notices, events, or holidays found for this student.
            </p>
          </div>
        )}
      </AntdModal>
      <AntdModal 
        open={attachmentModal.show} 
        onCancel={handleCloseAttachment} 
        footer={null} 
        width={800} 
        centered 
        title={
          <span className={dataTheme === "dark_data_theme" ? "text-white" : ""}>
            <i className="ti ti-paperclip me-2"></i>Notice Attachment
          </span>
        }
        className={dataTheme === "dark_data_theme" ? "lxc-dark-antd-modal" : ""}
      >
        <div className={`text-center ${dataTheme === "dark_data_theme" ? "lxc-notice-attachment-preview" : ""}`} style={{ width: '100%' }}>
          {attachmentModal.url && (attachmentModal.url.endsWith('.pdf') ? (
            <iframe src={attachmentModal.url} title="Attachment PDF" style={{ width: '100%', height: '70vh', border: 'none' }} />
          ) : (
            <img src={attachmentModal.url} alt="Attachment" style={{ maxHeight: '70vh', maxWidth: '100%' }} />
          ))}
        </div>
      </AntdModal>
    </>
  );
}


export function NoticeAttachmentModal({ show, onHide, url }: { show: boolean, onHide: () => void, url: string | null }) {
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  return (
    <AntdModal
      open={show}
      onCancel={onHide}
      footer={null}
      width={800}
      centered
      title={
        <span className={dataTheme === "dark_data_theme" ? "text-white" : ""}>
          <i className="ti ti-paperclip me-2"></i>Notice Attachment
        </span>
      }
      className={dataTheme === "dark_data_theme" ? "lxc-dark-antd-modal" : ""}
      closeIcon={<span style={{ color: dataTheme === "dark_data_theme" ? '#fff' : undefined, fontSize: 20 }}>&times;</span>}
    >
      <div className={`d-flex justify-content-center align-items-center ${dataTheme === "dark_data_theme" ? "lxc-notice-attachment-preview" : ""}`} style={{ width: '100%' }}>
        {url && (url.endsWith('.pdf') ? (
          <iframe
            src={url}
            title="Attachment PDF"
            style={{ width: '100%', height: '60vh', border: 'none', background: dataTheme === "dark_data_theme" ? '#23272e' : '#fff', borderRadius: 8 }}
          />
        ) : (
          <img
            src={url}
            alt="Attachment"
            style={{ maxHeight: '60vh', maxWidth: '100%', background: dataTheme === "dark_data_theme" ? '#23272e' : '#fff', borderRadius: 8, boxShadow: dataTheme === "dark_data_theme" ? '0 2px 12px rgba(0,0,0,0.18)' : undefined }}
          />
        ))}
      </div>
    </AntdModal>
  );
}

export function ExamResultsModal({ show, onHide, studentId }: { show: boolean, onHide: () => void, studentId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exams, setExams] = useState<IExam[]>([]);
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);

  useEffect(() => {
    if (!show || !studentId) return;
    setLoading(true);
    setError(null);
    getExamsResultsByStudentIdParam(studentId)
      .then(res => setExams(res.data.exams || []))
      .catch(() => setError('Failed to load exam results'))
      .finally(() => setLoading(false));
  }, [show, studentId]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className={dataTheme === "dark_data_theme" ? "lxc-dark-modal" : ""}
    >
      <Modal.Header closeButton className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}>
        <Modal.Title className={dataTheme === "dark_data_theme" ? "lxc-dark-modal-title" : ""}>
          <i className="ti ti-award me-2"></i>Exam & Result
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""}>
        {loading && <div className="text-center py-4"><LoadingSkeleton lines={4} height={20} /></div>}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && (
          exams.length > 0 ? (
            <div className={`card ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : ""}`}>
              <div className={`card-body ${dataTheme === "dark_data_theme" ? "bg-dark" : ""}`}>
                <div className="row g-3">
                  {exams.map((exam) => {
                    const score = exam.results && exam.results.length > 0 ? exam.results[0].score : null;
                    const isPassed = score !== null && exam.passMark !== null ? score >= exam.passMark : null;
                    return (
                      <div className="col-12 col-md-6" key={exam.id}>
                        <div className={`card shadow-sm border-0 h-100 mb-3 ${dataTheme === "dark_data_theme" ? "bg-dark border-secondary" : ""}`}> 
                          <div className={`card-header d-flex align-items-center ${isPassed === null ? 'bg-secondary' : isPassed ? 'bg-success' : 'bg-danger'} text-white`}>
                            <i className="ti ti-award me-2"></i>
                            <span>{exam.title}</span>
                            {isPassed !== null && (
                              <span className={`badge ms-auto ${isPassed ? 'bg-light text-success' : 'bg-light text-danger'}`}>{isPassed ? 'Passed' : 'Failed'}</span>
                            )}
                          </div>
                          <div className={`card-body ${dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""}`}>
                            <div className="mb-2"><b>Subject:</b> {exam.subject?.name || '-'}</div>
                            <div className="mb-2"><b>Start:</b> {formatDate(exam.startTime)} {formatTime(exam.startTime)} <b>End:</b> {formatDate(exam.endTime)} {formatTime(exam.endTime)}</div>
                            <div className="mb-2"><b>Total Marks:</b> {exam.totalMarks ?? '-'} <b>Pass Mark:</b> {exam.passMark ?? '-'}</div>
                            <div className="mb-2">
                              <b>Attendance:</b>{' '}
                              {exam.ExamAttendance && exam.ExamAttendance.length > 0 ? (
                                exam.ExamAttendance.map((att, idx) => (
                                  <span key={att.id} className="badge bg-info text-dark me-2">
                                    <i className="ti ti-calendar-event me-1"></i>{formatDate(att.date)}
                                  </span>
                                ))
                              ) : <span className={dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}>No attendance record</span>}
                            </div>
                            <div className="mb-2">
                              <b>Score:</b> {score !== null ? (
                                <span className={`badge ${isPassed === null ? 'bg-secondary' : isPassed ? 'bg-success' : 'bg-danger'} ms-2`}>{score}</span>
                              ) : <span className={dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}>Not Available</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : <div className={`text-center ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>No exam results found.</div>
        )}
      </Modal.Body>
    </Modal>
  );
}

// Add Ticket Modal
export function AddTicketModal({ show, onHide, studentId, parentId }: { show: boolean, onHide: () => void, studentId: string, parentId?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const currentUser = useSelector((state: any) => state.auth.userObj);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'medium',
    description: '',
    status: 'open',
    attachment: null as File | null,
    selectedStudent: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.category.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Get user ID from multiple sources
    const userId = currentUser?.id || 
                   parentId ||
                   localStorage.getItem('userId') || 
                   localStorage.getItem('parentId') ||
                   localStorage.getItem('guardianId') ||
                   '';
    
    if (!userId) {
      setError('User session not found. Please log in again.');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      // Create ticket data in the correct format
      const ticketData = {
        title: formData.title.trim(),
        description: formData.selectedStudent 
          ? `${formData.description.trim()}\n\nChild ID: ${formData.selectedStudent}`
          : formData.description.trim(),
        category: formData.category.trim(),
        priority: formData.priority,
        status: formData.status,
        userId: userId
      };
      
      await createTicket(ticketData);
      setSuccess('Ticket submitted successfully! We will get back to you soon.');
      setFormData({
        title: '',
        category: '',
        priority: 'medium',
        description: '',
        status: 'open',
        attachment: null,
        selectedStudent: ''
      });
      setTimeout(() => {
        onHide();
        setSuccess(null);
      }, 2000);
    } catch (err: any) {
      console.error('Ticket submission error:', err);
      if (err?.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = err.response.data.errors.map((error: any) => 
          `${error.path.join('.')}: ${error.message}`
        ).join(', ');
        setError(`Validation error: ${errorMessages}`);
      } else {
        setError(err?.response?.data?.message || 'Failed to submit ticket. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size should be less than 5MB');
      return;
    }
    setFormData(prev => ({ ...prev, attachment: file || null }));
    setError(null);
  };

  // Get dashboard data for student selection
  const dashboardData = useSelector((state: any) => state.dashboard?.data);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className={dataTheme === "dark_data_theme" ? "lxc-dark-modal" : ""}
      dialogClassName={dataTheme === "dark_data_theme" ? "dark-modal-dialog" : undefined}
    >
      <Modal.Header closeButton className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}>
        <Modal.Title className={dataTheme === "dark_data_theme" ? "lxc-dark-modal-title" : ""}>
          <i className="ti ti-ticket me-2"></i>
          Submit Support Ticket
        </Modal.Title>
        <div className={`small ${dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}`}>
          Submit a ticket for any support or inquiry
        </div>
      </Modal.Header>
      <Modal.Body className={dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""}>
        {success && (
          <Alert variant="success" className="mb-3">
            <i className="ti ti-check-circle me-2"></i>
            {success}
          </Alert>
        )}
        {error && (
          <Alert variant="danger" className="mb-3">
            <i className="ti ti-alert-circle me-2"></i>
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}><strong>Title *</strong></Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief description of your issue"
                required
                className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}
                disabled={submitting}
              />
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}><strong>Category</strong></Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}
                disabled={submitting}
              >
                <option value="">Select Category</option>
                <option value="academic">Academic</option>
                <option value="fees">Fees & Payment</option>
                <option value="attendance">Attendance</option>
                <option value="technical">Technical Support</option>
                <option value="general">General Inquiry</option>
                <option value="other">Other</option>
              </Form.Select>
            </div>
          </div>
          
          {/* Student Selection - Optional */}
          {dashboardData?.students && dashboardData.students.length > 0 && (
            <div className="mb-3">
              <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}>
                <strong>Related to Child (Optional)</strong>
              </Form.Label>
              <Form.Select
                value={formData.selectedStudent}
                onChange={(e) => setFormData(prev => ({ ...prev, selectedStudent: e.target.value }))}
                className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}
                disabled={submitting}
              >
                <option value="">Select a child (optional)</option>
                {dashboardData.students.map((student: any) => (
                  <option key={student.studentId} value={student.studentId}>
                    {student.studentInfo?.name || student.name} - {student.studentInfo?.class || student.class}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className={dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}>
                Select a child if this ticket is related to a specific child's issue
              </Form.Text>
            </div>
          )}
          <div className="mb-3">
            <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}><strong>Priority</strong></Form.Label>
            <div className="d-flex gap-3">
              {[
                { value: 'low', label: 'Low', color: 'success' },
                { value: 'medium', label: 'Medium', color: 'warning' },
                { value: 'high', label: 'High', color: 'danger' }
              ].map(priority => (
                <Form.Check
                  key={priority.value}
                  type="radio"
                  name="priority"
                  id={`priority-${priority.value}`}
                  label={priority.label}
                  value={priority.value}
                  checked={formData.priority === priority.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className={`text-${priority.color} ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}
                  disabled={submitting}
                />
              ))}
            </div>
          </div>
          <div className="mb-3">
            <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}><strong>Description *</strong></Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Please provide detailed information about your issue..."
              required
              className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}
              disabled={submitting}
            />
          </div>
          <div className="mb-3">
            <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}><strong>Attachment (Optional)</strong></Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}
              disabled={submitting}
            />
            <Form.Text className={dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}>
              Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
            </Form.Text>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <LoadingSkeleton lines={1} height={16} />
                  Submitting...
                </>
              ) : (
                <>
                  <i className="ti ti-send me-2"></i>
                  Submit Ticket
                </>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

// Contact Modal
export function ContactModal({ show, onHide, studentId, parentId }: { show: boolean, onHide: () => void, studentId: string, parentId?: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const currentUser = useSelector((state: any) => state.auth.userObj);
  const dashboardData = useSelector((state: any) => state.dashboard?.data);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    selectedStudent: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    // Get user ID from multiple sources for contact form
    const userId = currentUser?.id || 
                   parentId ||
                   localStorage.getItem('userId') || 
                   localStorage.getItem('parentId') ||
                   localStorage.getItem('guardianId') ||
                   '';
    
    if (!userId) {
      setError('User session not found. Please log in again.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const messageData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.selectedStudent 
          ? `${formData.message}\n\nRelated to Child ID: ${formData.selectedStudent}`
          : formData.message,
        userId: userId,
        date: new Date()
      };
      
      await registerMessage(messageData);
      
      setSuccess('Message sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        selectedStudent: ''
      });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onHide();
        setSuccess(null);
      }, 2000);
    } catch (err: any) {
      console.error('Contact message error:', err);
      if (err?.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = err.response.data.errors.map((error: any) => 
          `${error.path.join('.')}: ${error.message}`
        ).join(', ');
        setError(`Validation error: ${errorMessages}`);
      } else {
        setError(err?.response?.data?.message || 'Failed to send message. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className={dataTheme === "dark_data_theme" ? "lxc-dark-modal" : ""}
    >
      <Modal.Header closeButton className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}>
        <Modal.Title className={dataTheme === "dark_data_theme" ? "lxc-dark-modal-title" : ""}>
          <i className="ti ti-phone me-2"></i>
          Contact School
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={dataTheme === "dark_data_theme" ? "bg-dark text-white" : ""}>
        {success && (
          <Alert variant="success" className="mb-3">
            <i className="ti ti-check-circle me-2"></i>
            {success}
          </Alert>
        )}
        
        {error && (
          <Alert variant="danger" className="mb-3">
            <i className="ti ti-alert-circle me-2"></i>
            {error}
          </Alert>
        )}

        <div className="mb-4">
          <h6 className={`mb-3 ${dataTheme === "dark_data_theme" ? "text-white" : ""}`}>
            <i className="ti ti-message-circle me-2"></i>
            Send us a Message
          </h6>
          
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}><strong>Your Name *</strong></Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                  className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}><strong>Email *</strong></Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email address"
                  required
                  className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}><strong>Phone Number</strong></Form.Label>
                <Form.Control
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                  className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}><strong>Subject</strong></Form.Label>
                <Form.Control
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief subject of your message"
                  className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}
                />
              </div>
            </div>

            {/* Student Selection - Optional */}
            {dashboardData?.students && dashboardData.students.length > 0 && (
              <div className="mb-3">
                <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}>
                  <strong>Related to Child (Optional)</strong>
                </Form.Label>
                <Form.Select
                  value={formData.selectedStudent}
                  onChange={(e) => setFormData(prev => ({ ...prev, selectedStudent: e.target.value }))}
                  className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}
                  disabled={submitting}
                >
                  <option value="">Select a child (optional)</option>
                  {dashboardData.students.map((student: any) => (
                    <option key={student.studentId} value={student.studentId}>
                      {student.studentInfo?.name || student.name} - {student.studentInfo?.class || student.class}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className={dataTheme === "dark_data_theme" ? "text-light" : "text-muted"}>
                  Select a child if this message is related to a specific child's issue
                </Form.Text>
              </div>
            )}

            <div className="mb-3">
              <Form.Label className={dataTheme === "dark_data_theme" ? "text-white" : ""}><strong>Message *</strong></Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Please provide detailed information about your inquiry..."
                required
                className={dataTheme === "dark_data_theme" ? "bg-dark text-white border-secondary" : ""}
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={onHide} disabled={submitting}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <LoadingSkeleton lines={1} height={16} />
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="ti ti-send me-2"></i>
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

// export const getLessonsByStudentId = async (studentId: string) => {
//   if (!studentId) {
//     return <Alert variant="warning">No student selected.</Alert>;
//   }
//   return await BaseApi.getRequest(`/student/${studentId}/lessons`);
// }; 

// Add dark mode styles for modals
const darkModalStyles = `
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
  
  .dark-modal .form-control {
    background-color: #404040 !important;
    border-color: #555555 !important;
    color: #ffffff !important;
  }
  
  .dark-modal .form-control:focus {
    background-color: #404040 !important;
    border-color: #667eea !important;
    color: #ffffff !important;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
  }
  
  .dark-modal .form-select {
    background-color: #404040 !important;
    border-color: #555555 !important;
    color: #ffffff !important;
  }
  
  .dark-modal .form-select:focus {
    background-color: #404040 !important;
    border-color: #667eea !important;
    color: #ffffff !important;
  }
  
  .dark-modal .form-select option {
    background-color: #404040 !important;
    color: #ffffff !important;
  }
  
  .dark-modal .table {
    color: #ffffff !important;
  }
  
  .dark-modal .table thead th {
    background-color: #404040 !important;
    border-color: #555555 !important;
    color: #ffffff !important;
  }
  
  .dark-modal .table tbody td {
    background-color: #2d2d2d !important;
    border-color: #555555 !important;
    color: #ffffff !important;
  }
  
  .dark-modal .table tbody tr:hover td {
    background-color: #404040 !important;
  }
  
  .dark-modal .nav-tabs .nav-link {
    color: #e0e0e0 !important;
    border-color: #555555 !important;
  }
  
  .dark-modal .nav-tabs .nav-link.active {
    background-color: #404040 !important;
    border-color: #555555 !important;
    color: #ffffff !important;
  }
  
  .dark-modal .nav-tabs .nav-link:hover {
    border-color: #555555 !important;
    color: #ffffff !important;
  }
  
  .dark-modal .alert {
    background-color: #404040 !important;
    border-color: #555555 !important;
    color: #ffffff !important;
  }
  
  .dark-modal .alert-info {
    background-color: #1a3a5f !important;
    border-color: #2a5a8f !important;
  }
  
  .dark-modal .alert-success {
    background-color: #1a5f1a !important;
    border-color: #2a8f2a !important;
  }
  
  .dark-modal .alert-danger {
    background-color: #5f1a1a !important;
    border-color: #8f2a2a !important;
  }
  
  .dark-modal .alert-warning {
    background-color: #5f3a1a !important;
    border-color: #8f5a2a !important;
  }
  
  .dark-modal .list-group-item {
    background-color: #2d2d2d !important;
    border-color: #555555 !important;
    color: #ffffff !important;
  }
  
  .dark-modal .list-group-item:hover {
    background-color: #404040 !important;
  }
  
  .dark-modal .badge {
    color: #ffffff !important;
  }
  
  .dark-modal .text-muted {
    color: #e0e0e0 !important;
  }
  
  .dark-modal .text-light {
    color: #e0e0e0 !important;
  }
  
  .dark-modal .border-secondary {
    border-color: #555555 !important;
  }
  
  .dark-modal .border-bottom {
    border-bottom-color: #555555 !important;
  }
  
  .dark-modal .border-top {
    border-top-color: #555555 !important;
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
  
  /* Dark mode for Antd tables */
  .dark-table .ant-table {
    background-color: #2d2d2d !important;
    color: #ffffff !important;
  }
  
  .dark-table .ant-table-thead > tr > th {
    background-color: #404040 !important;
    color: #ffffff !important;
    border-color: #555555 !important;
  }
  
  .dark-table .ant-table-tbody > tr > td {
    background-color: #2d2d2d !important;
    color: #ffffff !important;
    border-color: #555555 !important;
  }
  
  .dark-table .ant-table-tbody > tr:hover > td {
    background-color: #404040 !important;
  }
  
  .dark-table .ant-table-tbody > tr.ant-table-row:hover > td {
    background-color: #404040 !important;
  }
  
  /* Dark mode for Antd tabs */
  .dark-antd-modal .ant-tabs-tab {
    color: #e0e0e0 !important;
  }
  
  .dark-antd-modal .ant-tabs-tab.ant-tabs-tab-active {
    color: #ffffff !important;
  }
  
  .dark-antd-modal .ant-tabs-tab:hover {
    color: #ffffff !important;
  }
  
  .dark-antd-modal .ant-tabs-ink-bar {
    background-color: #667eea !important;
  }
  
  /* Dark mode for Antd buttons */
  .dark-antd-modal .ant-btn {
    border-color: #555555 !important;
  }
  
  .dark-antd-modal .ant-btn-primary {
    background-color: #667eea !important;
    border-color: #667eea !important;
  }
  
  .dark-antd-modal .ant-btn-primary:hover {
    background-color: #5a6fd8 !important;
    border-color: #5a6fd8 !important;
  }
  
  /* Dark mode for form elements in Antd modals */
  .dark-antd-modal .ant-form-item-label > label {
    color: #ffffff !important;
  }
  
  .dark-antd-modal .ant-input {
    background-color: #404040 !important;
    border-color: #555555 !important;
    color: #ffffff !important;
  }
  
  .dark-antd-modal .ant-input:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
  }
  
  .dark-antd-modal .ant-select-selector {
    background-color: #404040 !important;
    border-color: #555555 !important;
    color: #ffffff !important;
  }
  
  .dark-antd-modal .ant-select-dropdown {
    background-color: #404040 !important;
    border-color: #555555 !important;
  }
  
  .dark-antd-modal .ant-select-item {
    color: #ffffff !important;
  }
  
  .dark-antd-modal .ant-select-item:hover {
    background-color: #2d2d2d !important;
  }
  
  .dark-antd-modal .ant-select-item-option-selected {
    background-color: #667eea !important;
  }
  
  /* Enhanced responsive design for parent actions */
  @media (max-width: 768px) {
    .parent-actions-card .card-body {
      padding: 1rem;
    }
    
    .parent-actions-card .btn {
      min-height: 100px;
      font-size: 0.875rem;
    }
    
    .parent-actions-card .btn i {
      font-size: 1.5rem;
    }
  }
  
  @media (max-width: 576px) {
    .parent-actions-card .card-body {
      padding: 0.75rem;
    }
    
    .parent-actions-card .btn {
      min-height: 90px;
      font-size: 0.8rem;
    }
    
    .parent-actions-card .btn i {
      font-size: 1.25rem;
    }
  }
  
  /* Dark mode enhancements for parent actions */
  .dark-mode .parent-actions-card {
    background-color: #2d2d2d !important;
    border-color: #404040 !important;
  }
  
  .dark-mode .parent-actions-card .card-header {
    background-color: #404040 !important;
    border-bottom-color: #555555 !important;
  }
  
  .dark-mode .parent-actions-card .card-body {
    background-color: #2d2d2d !important;
  }
  
  /* Improved button hover effects for dark mode */
  .dark-mode .btn-outline-warning:hover {
    background-color: #ffc107 !important;
    border-color: #ffc107 !important;
    color: #000000 !important;
  }
  
  .dark-mode .btn-outline-info:hover {
    background-color: #17a2b8 !important;
    border-color: #17a2b8 !important;
    color: #ffffff !important;
  }
`;

// Inject modal styles
if (typeof document !== 'undefined') {
  const modalStyleId = 'parent-modals-dark-mode-styles';
  if (!document.getElementById(modalStyleId)) {
    const style = document.createElement('style');
    style.id = modalStyleId;
    style.textContent = darkModalStyles;
    document.head.appendChild(style);
  }
} 

// Add/adjust dark-modal CSS for full dark modal in dark mode
if (typeof document !== 'undefined') {
  const modalStyleId = 'parent-modals-dark-mode-styles';
  if (!document.getElementById(modalStyleId)) {
    const style = document.createElement('style');
    style.id = modalStyleId;
    style.textContent = `
      .dark-modal .modal-dialog,
      .dark-modal .modal-content,
      .dark-modal .modal-body {
        background: #2d2d2d !important;
      }
    `;
    document.head.appendChild(style);
  }
} 

// Add/adjust dark-modal CSS for full dark modal in dark mode
if (typeof document !== 'undefined') {
  const modalStyleId = 'lxc-parent-modals-dark-mode-styles';
  if (!document.getElementById(modalStyleId)) {
    const style = document.createElement('style');
    style.id = modalStyleId;
    style.textContent = `
      .lxc-dark-modal .modal-content {
        background-color: #23272e !important;
        border-color: #404040 !important;
        color: #ffffff !important;
      }
      .lxc-dark-modal .modal-header {
        background-color: #23272e !important;
        border-bottom-color: #404040 !important;
      }
      .lxc-dark-modal .modal-body {
        background-color: #23272e !important;
        color: #ffffff !important;
      }
      .lxc-dark-modal .modal-footer {
        background-color: #23272e !important;
        border-top-color: #404040 !important;
      }
      .lxc-dark-modal .btn-close {
        filter: invert(1);
      }
      .lxc-dark-modal .form-control,
      .lxc-dark-modal .form-select {
        background-color: #404040 !important;
        border-color: #555555 !important;
        color: #ffffff !important;
      }
      .lxc-dark-modal .form-control:focus,
      .lxc-dark-modal .form-select:focus {
        border-color: #667eea !important;
        box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
      }
      .lxc-dark-modal .modal-title,
      .lxc-dark-modal-title {
        font-size: 1.25rem !important;
        font-weight: 600 !important;
        color: #fff !important;
        letter-spacing: 0.01em;
      }
      .lxc-dark-modal .modal-backdrop.show {
        background-color: #000 !important;
        opacity: 0.5 !important;
      }
      .lxc-dark-modal .table,
      .lxc-dark-modal .table-dark,
      .lxc-dark-modal .list-group-item {
        background-color: #23272e !important;
        color: #fff !important;
        border-color: #404040 !important;
      }
      .lxc-dark-modal .alert {
        background-color: #404040 !important;
        color: #fff !important;
        border-color: #555555 !important;
      }
      .lxc-dark-modal .alert-success {
        background-color: #1a5f1a !important;
        border-color: #2a8f2a !important;
      }
      .lxc-dark-modal .alert-danger {
        background-color: #5f1a1a !important;
        border-color: #8f2a2a !important;
      }
      .lxc-dark-modal .alert-warning {
        background-color: #5f3a1a !important;
        border-color: #8f5a2a !important;
      }
      .lxc-dark-modal .alert-info {
        background-color: #1a3a5f !important;
        border-color: #2a5a8f !important;
      }
      .lxc-dark-modal .badge {
        color: #fff !important;
      }
      .lxc-dark-modal .nav-tabs .nav-link {
        color: #e0e0e0 !important;
        border-color: #555555 !important;
      }
      .lxc-dark-modal .nav-tabs .nav-link.active {
        background-color: #404040 !important;
        color: #fff !important;
      }
      .lxc-dark-modal .nav-tabs .nav-link:hover {
        color: #fff !important;
      }
    `;
    document.head.appendChild(style);
  }
  // Ant Design modal dark mode
  const antdModalStyleId = 'lxc-parent-antd-modals-dark-mode-styles';
  if (!document.getElementById(antdModalStyleId)) {
    const style = document.createElement('style');
    style.id = antdModalStyleId;
    style.textContent = `
      .lxc-dark-antd-modal .ant-modal-content {
        background-color: #23272e !important;
        border-color: #404040 !important;
        color: #fff !important;
      }
      .lxc-dark-antd-modal .ant-modal-header {
        background-color: #23272e !important;
        border-bottom-color: #404040 !important;
      }
      .lxc-dark-antd-modal .ant-modal-title {
        color: #fff !important;
        font-size: 1.25rem !important;
        font-weight: 600 !important;
      }
      .lxc-dark-antd-modal .ant-modal-body {
        background-color: #23272e !important;
        color: #fff !important;
      }
      .lxc-dark-antd-modal .ant-modal-close {
        color: #fff !important;
      }
      .lxc-dark-antd-modal .ant-modal-close:hover {
        color: #e0e0e0 !important;
      }
      .lxc-dark-antd-modal .ant-table {
        background-color: #23272e !important;
        color: #fff !important;
      }
      .lxc-dark-antd-modal .ant-table-thead > tr > th {
        background-color: #404040 !important;
        color: #fff !important;
        border-color: #555555 !important;
      }
      .lxc-dark-antd-modal .ant-table-tbody > tr > td {
        background-color: #23272e !important;
        color: #fff !important;
        border-color: #555555 !important;
      }
      .lxc-dark-antd-modal .ant-table-tbody > tr:hover > td {
        background-color: #404040 !important;
      }
      .lxc-dark-antd-modal .ant-tabs-tab {
        color: #e0e0e0 !important;
      }
      .lxc-dark-antd-modal .ant-tabs-tab.ant-tabs-tab-active {
        color: #fff !important;
      }
      .lxc-dark-antd-modal .ant-tabs-ink-bar {
        background-color: #667eea !important;
      }
      .lxc-dark-antd-modal .ant-btn {
        border-color: #555555 !important;
      }
      .lxc-dark-antd-modal .ant-btn-primary {
        background-color: #667eea !important;
        border-color: #667eea !important;
      }
      .lxc-dark-antd-modal .ant-btn-primary:hover {
        background-color: #5a6fd8 !important;
        border-color: #5a6fd8 !important;
      }
      .lxc-dark-antd-modal .ant-form-item-label > label {
        color: #fff !important;
      }
      .lxc-dark-antd-modal .ant-input,
      .lxc-dark-antd-modal .ant-select-selector {
        background-color: #404040 !important;
        border-color: #555555 !important;
        color: #fff !important;
      }
      .lxc-dark-antd-modal .ant-input:focus {
        border-color: #667eea !important;
        box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
      }
      .lxc-dark-antd-modal .ant-select-dropdown {
        background-color: #404040 !important;
        border-color: #555555 !important;
      }
      .lxc-dark-antd-modal .ant-select-item {
        color: #fff !important;
      }
      .lxc-dark-antd-modal .ant-select-item:hover {
        background-color: #23272e !important;
      }
      .lxc-dark-antd-modal .ant-select-item-option-selected {
        background-color: #667eea !important;
      }
    `;
    document.head.appendChild(style);
  }
} 

// Add/extend dark mode table styles for this modal at the bottom:
if (typeof document !== 'undefined') {
  const lxcDarkModalTableStyleId = 'lxc-dark-modal-table-styles';
  if (!document.getElementById(lxcDarkModalTableStyleId)) {
    const style = document.createElement('style');
    style.id = lxcDarkModalTableStyleId;
    style.textContent = `
      .lxc-dark-modal-table thead th {
        background-color: #404040 !important;
        color: #fff !important;
        border-color: #555555 !important;
      }
      .lxc-dark-modal-table tbody td {
        background-color: #23272e !important;
        color: #fff !important;
        border-color: #404040 !important;
      }
      .lxc-dark-modal-table tbody tr:hover td {
        background-color: #33384a !important;
        color: #fff !important;
      }
    `;
    document.head.appendChild(style);
  }
} 

// Update or add CSS for view modals (details, attachment, document preview) in dark mode
if (typeof document !== 'undefined') {
  const lxcDarkViewModalStyleId = 'lxc-dark-view-modal-styles';
  if (!document.getElementById(lxcDarkViewModalStyleId)) {
    const style = document.createElement('style');
    style.id = lxcDarkViewModalStyleId;
    style.textContent = `
      /* For Bootstrap view modals */
      .lxc-dark-modal .modal-content {
        background-color: #23272e !important;
        color: #fff !important;
        border-color: #404040 !important;
      }
      .lxc-dark-modal .modal-header {
        background-color: #23272e !important;
        border-bottom-color: #404040 !important;
        color: #fff !important;
      }
      .lxc-dark-modal .modal-title,
      .lxc-dark-modal-title {
        color: #fff !important;
        font-size: 1.25rem !important;
        font-weight: 600 !important;
      }
      .lxc-dark-modal .modal-body {
        background-color: #23272e !important;
        color: #fff !important;
      }
      .lxc-dark-modal .modal-footer {
        background-color: #23272e !important;
        border-top-color: #404040 !important;
      }
      .lxc-dark-modal .btn-close {
        filter: invert(1);
      }
      .lxc-dark-modal .btn,
      .lxc-dark-modal .ant-btn {
        color: #fff !important;
        border-color: #555555 !important;
        background: #23272e !important;
      }
      .lxc-dark-modal .btn:hover,
      .lxc-dark-modal .ant-btn:hover {
        background: #33384a !important;
        color: #fff !important;
      }
      .lxc-dark-modal .text-muted,
      .lxc-dark-modal .text-light {
        color: #e0e0e0 !important;
      }
      .lxc-dark-modal .modal-backdrop.show {
        background-color: #000 !important;
        opacity: 0.5 !important;
      }
      .lxc-dark-modal .view-preview-center {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #23272e !important;
        min-height: 60vh;
      }
      .lxc-dark-modal .view-preview-center img,
      .lxc-dark-modal .view-preview-center iframe {
        max-width: 100%;
        max-height: 70vh;
        background: #23272e !important;
        border-radius: 6px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.3);
      }
      /* For Ant Design view modals */
      .lxc-dark-antd-modal .ant-modal-content {
        background-color: #23272e !important;
        color: #fff !important;
        border-color: #404040 !important;
      }
      .lxc-dark-antd-modal .ant-modal-header {
        background-color: #23272e !important;
        border-bottom-color: #404040 !important;
        color: #fff !important;
      }
      .lxc-dark-antd-modal .ant-modal-title {
        color: #fff !important;
        font-size: 1.25rem !important;
        font-weight: 600 !important;
      }
      .lxc-dark-antd-modal .ant-modal-body {
        background-color: #23272e !important;
        color: #fff !important;
      }
      .lxc-dark-antd-modal .ant-modal-close {
        color: #fff !important;
      }
      .lxc-dark-antd-modal .ant-modal-close:hover {
        color: #e0e0e0 !important;
      }
      .lxc-dark-antd-modal .ant-btn {
        color: #fff !important;
        border-color: #555555 !important;
        background: #23272e !important;
      }
      .lxc-dark-antd-modal .ant-btn:hover {
        background: #33384a !important;
        color: #fff !important;
      }
      .lxc-dark-antd-modal .view-preview-center {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #23272e !important;
        min-height: 60vh;
      }
      .lxc-dark-antd-modal .view-preview-center img,
      .lxc-dark-antd-modal .view-preview-center iframe {
        max-width: 100%;
        max-height: 70vh;
        background: #23272e !important;
        border-radius: 6px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.3);
      }
    `;
    document.head.appendChild(style);
  }
} 

// Add or update the CSS for .lxc-notice-attachment-preview at the bottom:
if (typeof document !== 'undefined') {
  const lxcNoticeAttachmentPreviewStyleId = 'lxc-notice-attachment-preview-styles';
  const existingStyle = document.getElementById(lxcNoticeAttachmentPreviewStyleId);
  if (existingStyle) {
    existingStyle.remove();
  }
  const style = document.createElement('style');
  style.id = lxcNoticeAttachmentPreviewStyleId;
  style.textContent = `
    .lxc-dark-antd-modal .lxc-notice-attachment-preview {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #32343a !important;
      border-radius: 14px;
      border: 2px solid #444;
      box-shadow: 0 8px 32px rgba(0,0,0,0.28);
      padding: 18px 0;
      margin: 18px 0;
      min-height: 220px;
      max-width: 90vw;
      max-height: 70vh;
      transition: background 0.2s;
    }
    .lxc-dark-antd-modal .lxc-notice-attachment-preview img,
    .lxc-dark-antd-modal .lxc-notice-attachment-preview iframe {
      background: #23272e !important;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.18);
      max-width: 100%;
      max-height: 60vh;
      margin: 0 auto;
      display: block;
    }
  `;
  document.head.appendChild(style);
} 

if (typeof document !== 'undefined') {
  const lxcGlobalDarkBackdropStyleId = 'lxc-global-dark-backdrop-style';
  if (!document.getElementById(lxcGlobalDarkBackdropStyleId)) {
    const style = document.createElement('style');
    style.id = lxcGlobalDarkBackdropStyleId;
    style.textContent = `
      body[data-theme="dark"] .modal-backdrop.show,
      body.dark-mode .modal-backdrop.show {
        background-color: #23272e !important;
        opacity: 0.85 !important;
      }
      body[data-theme="dark"] .ant-modal-root .ant-modal-mask,
      body.dark-mode .ant-modal-root .ant-modal-mask {
        background: #23272e !important;
        opacity: 0.85 !important;
      }
    `;
    document.head.appendChild(style);
  }
} 