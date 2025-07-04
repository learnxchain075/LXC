import React, { useState, useEffect } from 'react';
import { Modal, Spinner, Tab, Tabs, Table, Alert, Button, Form, Image } from 'react-bootstrap';
import { getstudentprofiledetails, getAttendanceLeavesByStudentId, applyStudentLeave, getFeesByStudentId, getLessonsByStudentId, getResourcesByStudentId, getStudentLibraryBooks, getDashboardResourcesByStudentId, getstudentprofiledetailsparents, getExamsResultsByStudentIdParam, IExam } from '../../services/student/StudentAllApi';
import { getStudentTimetable } from '../../services/student/StudentDashboardApi';
import { createFeeOrder, verifyFeePayment } from '../../services/payfee';
import BaseApi from '../../services/BaseApi';
import { getFeesByStudent } from '../../services/accounts/feesServices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table as AntdTable, Button as AntdButton, Modal as AntdModal, Tooltip } from 'antd';


const Loader = () => <div className="text-center py-4"><Spinner animation="border" variant="primary" /></div>;
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

// Studentpending
export function StudentDetailsModal({ show, onHide, studentId }: { show: boolean, onHide: () => void, studentId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!show) return;
    setLoading(true);
    BaseApi.getRequest(`/school/student/${studentId}`)
      .then(res => { setData(res.data); console.log('Student Details Modal Data:', res.data); })
      .catch(() => setError('Failed to load student details'))
      .finally(() => setLoading(false));
  }, [show, studentId]);
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton><Modal.Title>Student Details</Modal.Title></Modal.Header>
      <Modal.Body>
        {loading && <Loader />}
        {error && <ErrorMsg msg={error} />}
        {data && (
          <div>
            <h5>{data.name}</h5>
            <p><b>Class:</b> {data.class} <b>Roll No:</b> {data.rollNo}</p>
            <p><b>Email:</b> {data.email} <b>Phone:</b> {data.phone}</p>
            <p><b>Admission Date:</b> {formatDate(data.admissionDate)}</p>
           
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

// Attendance & Leave Modal
export function AttendanceLeaveModal({ show, onHide, studentId }: { show: boolean, onHide: () => void, studentId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!show) return;
    setLoading(true);
    getAttendanceLeavesByStudentId(studentId)
      .then(res => { setData(res.data); })
      .catch(() => setError('Failed to load attendance/leave'))
      .finally(() => setLoading(false));
  }, [show, studentId]);
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton><Modal.Title>Attendance & Leave</Modal.Title></Modal.Header>
      <Modal.Body>
        {loading && <Loader />}
        {error && <ErrorMsg msg={error} />}
        {data && (
          (data.attendance?.length > 0 || data.leaveRequests?.length > 0) ? (
            <Tabs defaultActiveKey="attendance" className="mb-3">
              <Tab eventKey="attendance" title="Attendance">
                {data.attendance?.length > 0 ? (
                  <Table striped bordered hover size="sm">
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
                {data.leaveRequests?.length > 0 ? (
                  <Table striped bordered hover size="sm">
                    <thead><tr><th>From</th><th>To</th><th>Reason</th><th>Status</th></tr></thead>
                    <tbody>
                      {data.leaveRequests.map((l: any) => (
                        <tr key={l.id}><td>{formatDate(l.startDate)}</td><td>{formatDate(l.endDate)}</td><td>{l.reason}</td><td>{l.status}</td></tr>
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
  );
}


export function FeesModal({ show, onHide, studentId, refetchDashboard }: { show: boolean, onHide: () => void, studentId: string, refetchDashboard: () => void }) {
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
    setPayAmount(fee.amount);
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
    if (!fee) return;
    if (payAmount < 1 || payAmount > fee.amount) {
      setPayError('Please enter a valid amount.');
      setPaying(false);
      return;
    }
    const isRazorpayLoaded = await loadRazorpayScript();
    if (!isRazorpayLoaded) {
      setPaymentError('Razorpay SDK failed to load. Please try again.');
      setPaying(false);
      return;
    }
    try {
     
      const orderRes = await createFeeOrder(fee.id, payAmount);
      const { orderId, amount, currency, success, error } = orderRes.data;
      if (!success) throw new Error(error || 'Failed to create order');
    
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
          //  console.log('Payment Verification Response:', verifyRes.data);
            if (verifyRes.data && (verifyRes.data.status === 'PAID' || verifyRes.data.success)) {
              setPaymentStatus('success');
              setPayFee(null);
              setVerifying(false);
              toast.success('Payment successful! Fee paid.');
              refetchDashboard();
            } else {
              setPaymentStatus('failed');
              setPaymentError(verifyRes.data?.message || 'Payment verification failed.');
              setVerifying(false);
              toast.error('Payment failed. Please try again.');
            }
            console.log('Payment Response:', verifyRes.data);
          } catch (err: any) {
            setPaymentStatus('failed');
            setPaymentError('Payment verification failed.');
            setVerifying(false);
            toast.error('Payment failed. Please try again.');
            console.log('Payment Error:', err);
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
    }
  }

  async function handleDownloadReceipt(paymentId: string) {
    setDownloading(paymentId);
    try {
      const res = await BaseApi.getRequest(`/school/fee/receipt/${paymentId}?copy=user`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt_${paymentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Failed to download receipt');
    } finally {
      setDownloading(null);
    }
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>Fees</Modal.Title></Modal.Header>
        <Modal.Body>
          {loading && <Loader />}
          {fatalError && (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
              <i className="bi bi-emoji-frown text-danger" style={{ fontSize: 48 }}></i>
              <h5 className="mt-3 text-danger">{fatalError}</h5>
              <p className="text-muted">If this problem persists, please contact your school administrator.</p>
            </div>
          )}
          {verifying && (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
              <Spinner animation="border" variant="primary" className="mb-3" />
              <h5 className="text-primary">Verifying your payment...</h5>
              <p className="text-muted">Please wait while we confirm your payment with the bank.</p>
            </div>
          )}
          {!fatalError && !verifying && data && (
            <>
              <h6>Pending Fees</h6>
              <Table striped bordered hover size="sm">
                <thead><tr><th>Category</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {data.fees.map((f: any) => (
                    <tr key={f.id}>
                      <td>{f.category}</td>
                      <td>{f.amount}</td>
                      <td>{formatDate(f.dueDate)}</td>
                      <td>{f.status}</td>
                      <td>
                        {f.status !== 'PAID' && f.amount > 0 && (
                          <Button size="sm" variant="success" disabled={paying} onClick={() => handlePayNow(f)}>
                            Pay Now
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {paymentStatus === 'success' && <Alert variant="success">Payment successful! Fee paid.</Alert>}
              {paymentStatus === 'failed' && <Alert variant="danger">{paymentError || 'Payment failed.'}</Alert>}
              {paymentStatus === 'verifying' && <Alert variant="info">Verifying payment...</Alert>}
              <h6 className="mt-3">Payment History</h6>
              <Table striped bordered hover size="sm">
                <thead><tr><th>Amount</th><th>Method</th><th>Date</th><th>Receipt</th></tr></thead>
                <tbody>
                  {data.fees
                    .flatMap((f: any) => f.Payment || [])
                    .sort((a: any, b: any) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
                    .map((p: any, idx: number) => (
                      <tr key={idx}>
                        <td>{p.amount}</td>
                        <td>{p.method}</td>
                        <td>{formatDate(p.paymentDate)}</td>
                        <td>
                          <Button size="sm" variant="outline-primary" onClick={() => handleDownloadReceipt(p.id)} disabled={downloading === p.id || !p.id} title="Download Receipt">
                            {downloading === p.id ? <Spinner size="sm" animation="border" /> : <><i className="ti ti-download me-1"></i>Download</>}
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
      </Modal>
      {/* Payment Amount Modal */}
      <Modal show={!!payModal?.show} onHide={() => setPayModal(null)} centered>
        <Modal.Header closeButton><Modal.Title>Pay Fee</Modal.Title></Modal.Header>
        <Modal.Body>
          {payModal && (
            <Form>
              <div className="mb-3">
                <Form.Label>Fee Category</Form.Label>
                <div><b>{payModal.fee.category}</b></div>
              </div>
              <div className="mb-3">
                <Form.Label>Due Amount</Form.Label>
                <div><b>₹{payModal.fee.amount}</b></div>
              </div>
              <div className="mb-3">
                <Form.Label>Enter Amount to Pay</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={payModal.fee.amount}
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  disabled={paying}
                />
                <Form.Text muted>Min: ₹1, Max: ₹{payModal.fee.amount}</Form.Text>
                {payError && <Alert variant="danger" className="mt-2">{payError}</Alert>}
              </div>
              <Form.Check
                type="checkbox"
                label="I confirm the above amount is correct and wish to proceed."
                checked={payConfirm}
                onChange={e => setPayConfirm(e.target.checked)}
                disabled={paying}
                className="mb-3"
              />
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setPayModal(null)} disabled={paying}>Cancel</Button>
                <Button variant="primary" onClick={handlePayConfirm} disabled={!payConfirm || paying || payAmount < 1 || payAmount > payModal.fee.amount}>
                  {paying ? <Spinner size="sm" animation="border" /> : 'Pay Now'}
                </Button>
              </div>
            </Form>
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
  useEffect(() => {
    if (!show) return;
    setLoading(true);
    getLessonsByStudentId(studentId)
      .then(res => { setData(res.data); })
      .catch(() => setError('Failed to load timetable'))
      .finally(() => setLoading(false));
  }, [show, studentId]);
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton><Modal.Title>Timetable</Modal.Title></Modal.Header>
      <Modal.Body>
        {loading && <Loader />}
        {error && <ErrorMsg msg={error} />}
        {data && (
          data.lessons && data.lessons.length > 0 ? (
            <Table striped bordered hover size="sm">
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
  useEffect(() => {
    if (!show) return;
    setLoading(true);
    getResourcesByStudentId(studentId)
      .then(res => { setData(res.data); })
      .catch(() => setError('Failed to load assignments/homework'))
      .finally(() => setLoading(false));
  }, [show, studentId]);
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton><Modal.Title>Assignments & Homework</Modal.Title></Modal.Header>
      <Modal.Body>
        {loading && <Loader />}
        {error && <ErrorMsg msg={error} />}
        {data && (
          (data.assignments?.length > 0 || data.homeworks?.length > 0) ? (
            <Tabs defaultActiveKey="assignments" className="mb-3">
              <Tab eventKey="assignments" title="Assignments">
                {data.assignments?.length > 0 ? (
                  <Table striped bordered hover size="sm">
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
                  <Table striped bordered hover size="sm">
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

export function NoticesModal({ show, onHide, student }: { show: boolean, onHide: () => void, student: any }) {
  const [attachmentModal, setAttachmentModal] = useState<{ show: boolean, url: string | null }>({ show: false, url: null });
  if (!student) return null;
  const { events } = student;

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
      dataIndex: 'publishDate',
      key: 'publishDate',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
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
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 180,
      ellipsis: true,
      render: (text: string, record: any) => text || record.name,
    },
    {
      title: 'Date',
      dataIndex: 'start',
      key: 'start',
      width: 120,
      render: (date: string, record: any) => new Date(date || record.date).toLocaleDateString(),
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
      <AntdModal open={show} onCancel={onHide} footer={null} width={900} centered title="Notices & Events">
        <Tabs defaultActiveKey="notices" className="mb-3">
          <Tab eventKey="notices" title="Notices">
            <AntdTable
              columns={noticeColumns}
              dataSource={events.notices}
              rowKey="id"
              pagination={false}
              scroll={{ x: true }}
              locale={{ emptyText: 'No notices found.' }}
            />
          </Tab>
          <Tab eventKey="announcements" title="Announcements">
            <AntdTable
              columns={[
                { title: 'Title', dataIndex: 'title', key: 'title', width: 180, ellipsis: true },
                { title: 'Date', dataIndex: 'publishDate', key: 'publishDate', width: 120, render: (date: string) => new Date(date).toLocaleDateString() },
                { title: 'Message', dataIndex: 'message', key: 'message', ellipsis: true, render: (text: string) => (
                  <Tooltip title={text}>
                    <span style={{ maxWidth: 220, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
                  </Tooltip>
                ) },
                { title: 'Attachment', dataIndex: 'attachment', key: 'attachment', width: 120, render: (url: string) => url ? (
                  <AntdButton size="small" type="primary" onClick={() => handleViewAttachment(url)}>
                    View Attachment
                  </AntdButton>
                ) : null },
              ]}
              dataSource={events.announcements || []}
              rowKey="id"
              pagination={false}
              scroll={{ x: true }}
              locale={{ emptyText: 'No announcements found.' }}
            />
          </Tab>
          <Tab eventKey="events" title="Events">
            <AntdTable
              columns={eventColumns}
              dataSource={events.events}
              rowKey="id"
              pagination={false}
              scroll={{ x: true }}
              locale={{ emptyText: 'No events found.' }}
            />
          </Tab>
          <Tab eventKey="communication" title="Communication">
            <AntdTable
              columns={[
                { title: 'Title', dataIndex: 'title', key: 'title', width: 180, ellipsis: true },
                { title: 'Date', dataIndex: 'publishDate', key: 'publishDate', width: 120, render: (date: string) => new Date(date).toLocaleDateString() },
                { title: 'Message', dataIndex: 'message', key: 'message', ellipsis: true, render: (text: string) => (
                  <Tooltip title={text}>
                    <span style={{ maxWidth: 220, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
                  </Tooltip>
                ) },
                { title: 'Attachment', dataIndex: 'attachment', key: 'attachment', width: 120, render: (url: string) => url ? (
                  <AntdButton size="small" type="primary" onClick={() => handleViewAttachment(url)}>
                    View Attachment
                  </AntdButton>
                ) : null },
              ]}
              dataSource={student.communication || []}
              rowKey="id"
              pagination={false}
              scroll={{ x: true }}
              locale={{ emptyText: 'No communication found.' }}
            />
          </Tab>
          {events.holidays && (
            <Tab eventKey="holidays" title="Holidays">
              <AntdTable
                columns={holidayColumns}
                dataSource={events.holidays}
                rowKey="id"
                pagination={false}
                scroll={{ x: true }}
                locale={{ emptyText: 'No holidays found.' }}
              />
            </Tab>
          )}
        </Tabs>
      </AntdModal>
      <AntdModal open={attachmentModal.show} onCancel={handleCloseAttachment} footer={null} width={800} centered title="Notice Attachment">
        <div className="text-center">
          {attachmentModal.url && (attachmentModal.url.endsWith('.pdf') ? (
            <iframe src={attachmentModal.url} title="Attachment PDF" style={{ width: '100%', height: '70vh' }} />
          ) : (
            <img src={attachmentModal.url} alt="Attachment" style={{ maxHeight: '70vh', maxWidth: '100%' }} />
          ))}
        </div>
      </AntdModal>
    </>
  );
}


export function ExamResultsModal({ show, onHide, studentId }: { show: boolean, onHide: () => void, studentId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exams, setExams] = useState<IExam[]>([]);

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
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton><Modal.Title>Exam & Result</Modal.Title></Modal.Header>
      <Modal.Body>
        {loading && <div className="text-center py-4"><Spinner animation="border" variant="primary" /></div>}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && (
          exams.length > 0 ? (
            <div className="card">
              <div className="card-body">
                <div className="row g-3">
                  {exams.map((exam) => {
                    const score = exam.results && exam.results.length > 0 ? exam.results[0].score : null;
                    const isPassed = score !== null && exam.passMark !== null ? score >= exam.passMark : null;
                    return (
                      <div className="col-12 col-md-6" key={exam.id}>
                        <div className={`card shadow-sm border-0 h-100 mb-3`}> 
                          <div className={`card-header d-flex align-items-center ${isPassed === null ? 'bg-secondary' : isPassed ? 'bg-success' : 'bg-danger'} text-white`}>
                            <i className="ti ti-award me-2"></i>
                            <span>{exam.title}</span>
                            {isPassed !== null && (
                              <span className={`badge ms-auto ${isPassed ? 'bg-light text-success' : 'bg-light text-danger'}`}>{isPassed ? 'Passed' : 'Failed'}</span>
                            )}
                          </div>
                          <div className="card-body">
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
                              ) : <span className="text-muted">No attendance record</span>}
                            </div>
                            <div className="mb-2">
                              <b>Score:</b> {score !== null ? (
                                <span className={`badge ${isPassed === null ? 'bg-secondary' : isPassed ? 'bg-success' : 'bg-danger'} ms-2`}>{score}</span>
                              ) : <span className="text-muted">Not Available</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : <div className="text-center text-muted">No exam results found.</div>
        )}
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