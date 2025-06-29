import { useEffect, useState } from "react";
import { getSchoolStudents } from "../../services/admin/studentRegister";
import { toast, ToastContainer } from "react-toastify";
import BaseApi from "../../services/BaseApi";
import { getFeesByStudent } from "../../services/accounts/feesServices";
import { useSelector, useDispatch } from "react-redux";
import useMobileDetection from "../../core/common/mobileDetection";
import { Table, Tag, Space, Collapse } from "antd";
import "antd/dist/reset.css";
import { getFeesByStudentId, IFeeResponse, IFee, IPayment, ISchool } from "../../services/student/StudentAllApi";
import { setMiniSidebar, setExpandMenu } from "../../Store/sidebarSlice";
import type { ColumnsType } from "antd/es/table";
import { CaretRightOutlined } from "@ant-design/icons";

// Interfaces for type safety
interface IPaymentHistory {
  id: string;
  amount: number;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  paymentMethod: string | null;
  status: string;
  paymentDate: string;
  failureReason: string | null;
}

interface IFeeData {
  id: string;
  studentId: string;
  schoolId: string;
  amount: number;
  amountPaid: number;
  dueDate: string;
  category: string;
  finePerDay: number;
  status: string;
  discount: number;
  scholarship: number;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
  lastReminderSentAt: string | null;
  Payment: IPaymentHistory[];
  student?: {
    rollNo: string;
    name: string;
  };
}

export const PayFeeManagement = () => {
  const [students, setStudents] = useState<any[]>([]);
  const user = useSelector((state: any) => state.auth.userObj);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [studentFee, setStudentFee] = useState<number>(0);
  const [paidFee, setPaidFee] = useState<number>(0);
  const [feeData, setFeeData] = useState<IFeeData[]>([]);
  const [formData, setFormData] = useState({
    studentId: user.role === "student" ? localStorage.getItem("studentId") || "" : "",
    amount: 0 as number,
    category: "",
    schoolId: localStorage.getItem("schoolId") || "",
    feeId: "",
  });
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentConfigured, setPaymentConfigured] = useState(false); // New state for payment configuration
  const ismobile = useMobileDetection();
  const dispatch = useDispatch();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [razorpayKey, setRazorpayKey] = useState<string>("rzp_test_EJh0TkmUgkZNyG");

  // Fetch payment settings on component mount
  const fetchPaymentSettings = async () => {
    try {
      const schoolId = localStorage.getItem("schoolId");
      if (!schoolId) {
        console.warn("No school ID found");
        setPaymentConfigured(false);
        return;
      }

      const response = await BaseApi.getRequest(`/school/admin/payment-secret/school/${schoolId}`);
      if (response.data && response.data.keyId) {
        console.log("Fetched Razorpay key:", response.data.keyId);
        setRazorpayKey(response.data.keyId);
        setPaymentConfigured(true);
      } else {
        console.warn("No payment key found in settings");
        setPaymentConfigured(false);
      }
    } catch (error: any) {
      console.warn("Failed to fetch payment settings:", error);
      setPaymentConfigured(false);
      if (error.response?.status === 404) {
        toast.warning("Payment gateway not configured for this school.");
      } else if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Failed to load payment settings. Please try again later.");
      }
    }
  };

  const fetchStudents = async () => {
    const schoolId = localStorage.getItem("schoolId");
    if (!schoolId) return;
    try {
      setLoading(true);
      const res = await getSchoolStudents(schoolId);
     // console.log("Fetched students:", res.data);
      setStudents(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentFee = async (studentId: string) => {
    try {
      setLoading(true);
      setFetchError(null);
      let res: any;
      if (user.role === "student") {
        res = await getFeesByStudentId(studentId);
      } else {
        res = await getFeesByStudent(studentId);
      }
      console.log("Fetched fee data:", res.data);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        console.log("Setting feeId to:", res.data[0]?.id);
        setFormData((prevData) => ({
          ...prevData,
          feeId: res.data[0]?.id || "",
        }));
        setStudentFee(res.data[0]?.amount || 0);
        setPaidFee(res.data[0]?.amountPaid || 0);
        setFeeData(res.data || []);
      } else {
        setFeeData([]);
        setStudentFee(0);
        setPaidFee(0);
        setFetchError("No fee data found for this student.");
      }
    } catch (err) {
      setFeeData([]);
      setStudentFee(0);
      setPaidFee(0);
      setFetchError("Failed to fetch student fee details.");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.trim().toLowerCase();
    setSearchKeyword(e.target.value);
    const filtered = students.filter((s) =>
      s.rollNo?.toLowerCase().includes(keyword)
    );
    setFilteredStudents(filtered);
    setFormData({ ...formData, studentId: "" });
    setFeeData([]);
    setStudentFee(0);
    setPaidFee(0);
    setFetchError(null);
  };

  const handleStudentSelect = (student: any) => {
    setFormData({ ...formData, studentId: student.id });
    setSearchKeyword(student.rollNo);
    setFilteredStudents([]);
    fetchStudentFee(student.id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "amount" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  // Auto-select category when fee data is loaded
  useEffect(() => {
    if (feeData.length > 0) {
      const firstFee = feeData[0];
      if (firstFee.category && !formData.category) {
        setFormData(prevData => ({
          ...prevData,
          category: firstFee.category
        }));
      }
    }
  }, [feeData]);

  // Helper function to get category display name
  const getCategoryDisplayName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'tuition': 'Tuition Fee',
      'library': 'Library Fee',
      'transport': 'Transport Fee',
      'hostel': 'Hostel Fee',
      'other': 'Other Fee'
    };
    return categoryMap[category] || category;
  };

  // Helper function to get category badge color
  const getCategoryBadgeColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'tuition': 'bg-primary',
      'library': 'bg-info',
      'transport': 'bg-warning',
      'hostel': 'bg-success',
      'other': 'bg-secondary'
    };
    return colorMap[category] || 'bg-secondary';
  };

  const resetForm = () => {
    setFormData({
      studentId: user.role === "student" ? localStorage.getItem("studentId") || "" : "",
      amount: 0 as number,
      category: "",
      schoolId: localStorage.getItem("schoolId") || "",
      feeId: "",
    });
    setSearchKeyword("");
    setFilteredStudents([]);
    setFeeData([]);
    setStudentFee(0);
    setPaidFee(0);
  };

  useEffect(() => {
    if (user.role === "student") {
      fetchStudentFee(localStorage.getItem("studentId") || "");
    } else {
      fetchStudents();
    }
    fetchPaymentSettings();
    // eslint-disable-next-line
  }, [user.role, dispatch]);

  const handlePayment = async () => {
    if (!formData.studentId || !formData.amount || !formData.category) {
      toast.error("Please fill all the fields.");
      return;
    }
    if (formData.amount < 0) {
      toast.error("Amount Can Not Be Negative.");
      return;
    }
    if (formData.amount > studentFee - paidFee) {
      toast.error(`Amount should not be greater than your total fee (${studentFee - paidFee}).`);
      return;
    }

    if (!paymentConfigured) {
      toast.error("Payment gateway not configured. Please contact your school administrator.");
      return;
    }

    try {
      setLoading(true);
      setPaymentProcessing(true);
      const isRazorpayLoaded = await loadRazorpayScript();
      if (isRazorpayLoaded === false) {
        toast.error("Razorpay SDK failed to load. Please try again later.");
        return;
      }

      // Log payment initiation details
      console.log("Initiating payment with formData:", formData);
      console.log("Using Razorpay key:", razorpayKey);
      console.log("Creating order with data:", { amount: formData.amount, feeId: formData.feeId });

      const response = await BaseApi.postRequest("/school/fee/create-order", {
        amount: formData.amount,
        feeId: formData.feeId,
      });

      console.log("Order creation response:", response.data);

      if (!response.data.success) {
        if (response.data.details?.statusCode === 401) {
          toast.error("Payment gateway authentication failed. Please contact your school administrator.");
        } else {
          throw new Error(response.data.error || "Failed to create order");
        }
        return;
      }

      const { orderId, amount, currency } = response.data;

      const options = {
        key: razorpayKey,
        amount,
        currency,
        name: "LearnXChain",
        description: `${formData.category} Fee Payment`,
        order_id: orderId,
        handler: async function (paymentResponse: any) {
          console.log("Payment response:", paymentResponse);
          try {
            setPaymentProcessing(true);
            toast.info("Verifying payment...");
            
            const verifyRes = await BaseApi.postRequest("/school/fee/verify-payment", {
              paymentId: paymentResponse.razorpay_payment_id,
              orderId: paymentResponse.razorpay_order_id,
              razorpaySignature: paymentResponse.razorpay_signature,
              feeId: formData.feeId || "",
            });

            if (verifyRes.data && (verifyRes.data.success || verifyRes.data.status)) {
              toast.success("Payment successful! Fee paid successfully.");
              // Always refetch latest fee data for the current student before resetting the form
              if (user.role === "student") {
                await fetchStudentFee(localStorage.getItem("studentId") || "");
              } else {
                await fetchStudentFee(formData.studentId);
              }
              resetForm();
            } else {
              toast.error(verifyRes.data?.message || "Payment verification failed.");
            }
          } catch (error: any) {
            toast.error("Payment verification failed");
            console.error("Verification error:", error.response?.data || error.message);
          } finally {
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: localStorage.getItem("userName") || "",
          email: localStorage.getItem("userEmail") || "",
          contact: localStorage.getItem("userPhone") || "",
        },
        theme: {
          color: "#0d6efd",
        },
        modal: {
          ondismiss: function() {
            setPaymentProcessing(false);
            console.log("Payment modal closed");
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        setPaymentProcessing(false);
        console.error("Payment failed:", response.error);
        toast.error("Payment failed: " + (response.error?.description || "Unknown error"));
      });

      rzp.on("payment.cancelled", function (response: any) {
        setPaymentProcessing(false);
        console.log("Payment cancelled:", response);
        toast.info("Payment was cancelled");
      });

      rzp.open();
    } catch (error: any) {
      console.error("Payment initiation error:", error.response?.data || error.message);
      toast.error("Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
      setPaymentProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePayment();
  };

  const columns: ColumnsType<IFeeData> = [
    // Define your columns here
    {
      title: "Student Info",
      dataIndex: "student",
      key: "student",
      fixed: "left",
      render: (student: any, record: IFeeData) => (
        <div>
          <div className="fw-bold">{record?.student?.name || "N/A"}</div>
          <div className="text-muted small">{record?.student?.rollNo || "N/A"}</div>
        </div>
      ),
    },
    {
      title: "Fee Details",
      dataIndex: "category",
      key: "feeDetails",
      render: (category: string, record: IFeeData) => (
        <div>
          <span className={`badge ${getCategoryBadgeColor(category)} mb-2`}>{getCategoryDisplayName(category)}</span>
          <div className="d-flex flex-column">
            <div>Total: <span className="fw-bold">₹{record.amount.toLocaleString()}</span></div>
            <div>Paid: <span className="text-success fw-bold">₹{record.amountPaid.toLocaleString()}</span></div>
            <div>Due: <span className="text-danger fw-bold">₹{(record.amount - record.amountPaid).toLocaleString()}</span></div>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: string) => {
        const badgeClass = status === "PAID" ? "bg-success" : 
                          status === "PARTIAL" ? "bg-warning" : "bg-danger";
        return <span className={`badge ${badgeClass}`}>{status}</span>;
      },
    },
    {
      title: "Important Dates",
      key: "dates",
      render: (_, record: IFeeData) => (
        <div className="d-flex flex-column gap-1">
          <div>
            <small className="text-muted">Due Date:</small><br/>
            <span className="fw-semibold">{new Date(record.dueDate).toLocaleDateString()}</span>
          </div>
          {record.paymentDate && (
            <div>
              <small className="text-muted">Last Paid:</small><br/>
              <span className="fw-semibold">{new Date(record.paymentDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Additional Info",
      key: "additional",
      render: (_, record: IFeeData) => (
        <div className="d-flex flex-column gap-1">
          {record.discount > 0 && (
            <div><small className="text-muted">Discount:</small> <span className="fw-bold">₹{record.discount}</span></div>
          )}
          {record.scholarship > 0 && (
            <div><small className="text-muted">Scholarship:</small> <span className="fw-bold">₹{record.scholarship}</span></div>
          )}
          {record.finePerDay > 0 && (
            <div><small className="text-muted">Fine/Day:</small> <span className="fw-bold text-danger">₹{record.finePerDay}</span></div>
          )}
        </div>
      ),
    },
  ];

  const expandedRowRender = (record: IFeeData) => {
    const paymentColumns: ColumnsType<IPaymentHistory> = [
      {
        title: "Payment Date",
        dataIndex: "paymentDate",
        key: "paymentDate",
        render: (date: string) => (
          <span className="small">{new Date(date).toLocaleString()}</span>
        ),
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        render: (amount: number) => (
          <span className="fw-bold">₹{amount.toLocaleString()}</span>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status: string) => {
          const badgeClass = status === "PAID" ? "bg-success" : 
                            status === "PENDING" ? "bg-warning" : "bg-danger";
          return <span className={`badge ${badgeClass}`}>{status}</span>;
        },
      },
      {
        title: "Payment Method",
        dataIndex: "paymentMethod",
        key: "paymentMethod",
        render: (method: string | null) => (
          <span className="text-capitalize">{method || "N/A"}</span>
        ),
      },
      {
        title: "Transaction ID",
        key: "transactionId",
        render: (_, record: IPaymentHistory) => (
          <div className="d-flex flex-column gap-1">
            <div className="small">
              <span className="text-muted">Order:</span>
              <span className="ms-1 font-monospace">{record.razorpayOrderId}</span>
            </div>
            {record.razorpayPaymentId && (
              <div className="small">
                <span className="text-muted">Payment:</span>
                <span className="ms-1 font-monospace">{record.razorpayPaymentId}</span>
              </div>
            )}
          </div>
        ),
      },
    ];

    return (
      <div className="p-3 bg-light rounded">
        <h6 className="mb-3 text-primary">Payment History</h6>
        <div className="table-responsive">
          <Table
            columns={paymentColumns}
            dataSource={record.Payment}
            pagination={false}
            size="small"
            rowKey="id"
          />
        </div>
      </div>
    );
  };

  const isAdminOrSuperadmin = user.role === "admin" || user.role === "superadmin";
  const isDueClear = studentFee - paidFee <= 0;

  return (
    <>
      <div className={isAdminOrSuperadmin ? "page-wrapper min-vh-100" : "p-4 min-vh-100"}>
        <ToastContainer position="top-center" autoClose={3000} />
        
        {/* Payment Processing Overlay */}
        {paymentProcessing && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
               style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
            <div className="bg-white p-4 rounded shadow text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Processing Payment...</span>
              </div>
              <h5>Processing Payment...</h5>
              <p className="text-muted mb-0">Please do not close this window or refresh the page.</p>
            </div>
          </div>
        )}
        
        <div className="content container-fluid">
          <div className="row justify-content-center">
            <div className={isAdminOrSuperadmin ? "col-12" : "col-sm-12"}>
              {/* Main Payment Card */}
              <div className="card shadow border-0">
                <div className="card-header bg-light border-bottom">
                  <div className="d-flex align-items-center justify-content-between">
                    <h6 className="mb-0 text-primary">
                      <i className="ti ti-wallet me-2"></i>
                      Pay Fee
                    </h6>
                    {!paymentConfigured && (
                      <span className="badge bg-warning text-dark">
                        <i className="ti ti-alert-triangle me-1"></i>
                        Payment Gateway Not Configured
                      </span>
                    )}
                  </div>
                </div>
                <div className="card-body p-4">
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="text-muted">Loading fee details...</p>
                    </div>
                  ) : isAdminOrSuperadmin ? (
                    <form onSubmit={handleSubmit}>
                      {/* Student Search Section */}
                      <div className="row mb-4">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label fw-semibold">
                              <i className="ti ti-search me-1"></i>
                              Search Student
                            </label>
                            <div className="position-relative">
                              <input
                                type="text"
                                className="form-control form-control-lg"
                                value={searchKeyword}
                                onChange={handleStudentSearch}
                                placeholder="Enter student roll number..."
                              />
                              <i className="ti ti-user position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                            </div>
                            {filteredStudents.length > 0 && (
                              <div className="position-absolute w-100 bg-white border rounded shadow-sm mt-1" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                {filteredStudents.map((student) => (
                                  <div
                                    key={student.id}
                                    className="p-3 border-bottom cursor-pointer hover-bg-light"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleStudentSelect(student)}
                                  >
                                    <div className="fw-medium">{student.rollNo}</div>
                                    <div className="small text-muted">{student.fatherName}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Payment Form Section */}
                      {formData.studentId && !isDueClear && (
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group mb-3">
                              <label className="form-label fw-semibold">
                                <i className="ti ti-currency-rupee me-1"></i>
                                Payment Amount
                              </label>
                              {formData.feeId && (
                                <div className="alert alert-info py-2 mb-2">
                                  <i className="ti ti-info-circle me-1"></i>
                                  Remaining Amount: <strong>₹{(studentFee - paidFee).toLocaleString()}</strong>
                                </div>
                              )}
                              <input
                                type="number"
                                className="form-control form-control-lg"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                min="0"
                                max={studentFee - paidFee}
                                disabled={isDueClear}
                                required
                                placeholder="Enter amount to pay..."
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group mb-3">
                              <label className="form-label fw-semibold">
                                <i className="ti ti-category me-1"></i>
                                Fee Category
                              </label>
                              {formData.category && (
                                <div className="alert alert-success py-2 mb-2">
                                  <i className="ti ti-check-circle me-1"></i>
                                  Selected: <span className={`badge ${getCategoryBadgeColor(formData.category)}`}>
                                    {getCategoryDisplayName(formData.category)}
                                  </span>
                                </div>
                              )}
                              <select
                                className="form-control form-control-lg"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">Select Category</option>
                                <option value="tuition">Tuition Fee</option>
                                <option value="library">Library Fee</option>
                                <option value="transport">Transport Fee</option>
                                <option value="hostel">Hostel Fee</option>
                                <option value="other">Other Fee</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Payment Summary Card */}
                      {formData.studentId && formData.category && formData.amount > 0 && (
                        <div className="card bg-light border-primary mb-4">
                          <div className="card-body">
                            <div className="row align-items-center">
                              <div className="col-md-8">
                                <h6 className="mb-2 text-primary">
                                  <i className="ti ti-receipt me-2"></i>
                                  Payment Summary
                                </h6>
                                <div className="d-flex flex-wrap gap-3">
                                  <div>
                                    <small className="text-muted">Category:</small>
                                    <div>
                                      <span className={`badge ${getCategoryBadgeColor(formData.category)}`}>
                                        {getCategoryDisplayName(formData.category)}
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <small className="text-muted">Amount:</small>
                                    <div className="fw-bold text-success">₹{formData.amount.toLocaleString()}</div>
                                  </div>
                                  <div>
                                    <small className="text-muted">Remaining:</small>
                                    <div className="fw-bold text-danger">₹{(studentFee - paidFee - formData.amount).toLocaleString()}</div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4 text-end">
                                <div className="h4 mb-0 text-primary">₹{formData.amount.toLocaleString()}</div>
                                <small className="text-muted">Total Payment</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {formData.studentId && !isDueClear && (
                        <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-lg"
                            onClick={resetForm}
                          >
                            <i className="ti ti-refresh me-1"></i>
                            Reset
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={loading || paymentProcessing || isDueClear || !paymentConfigured}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Processing...
                              </>
                            ) : paymentProcessing ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Payment in Progress...
                              </>
                            ) : !paymentConfigured ? (
                              <>
                                <i className="ti ti-alert-triangle me-1"></i>
                                Payment Not Configured
                              </>
                            ) : (
                              <>
                                <i className="ti ti-credit-card me-1"></i>
                                Pay Fee
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Fee Details Table */}
                      {formData.studentId && (
                        <div className="mt-5">
                          <div className="d-flex align-items-center mb-3">
                            <i className="ti ti-receipt me-2 text-primary"></i>
                            <h6 className="mb-0 text-primary">Fee Payment Details</h6>
                          </div>
                          <div className="table-responsive">
                            <Table
                              columns={columns}
                              dataSource={feeData}
                              rowKey="id"
                              pagination={false}
                              expandable={{
                                expandedRowRender,
                                expandIcon: ({ expanded, onExpand, record }) => (
                                  <button 
                                    className="btn btn-link btn-sm p-0 text-primary"
                                    onClick={e => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      onExpand(record, e);
                                    }}
                                  >
                                    <i className={`ti ti-chevron-${expanded ? 'down' : 'right'}`}></i>
                                  </button>
                                ),
                              }}
                              scroll={{ x: true }}
                              className="table-hover"
                            />
                          </div>
                        </div>
                      )}
                      
                      {fetchError && (
                        <div className="alert alert-danger text-center my-3">
                          <i className="ti ti-alert-circle me-2"></i>
                          {fetchError}
                        </div>
                      )}
                    </form>
                  ) : user.role === "student" ? (
                    <>
                      {isDueClear ? (
                        <div className="alert alert-success text-center py-4" role="alert">
                          <i className="ti ti-check-circle fs-1 mb-3 d-block"></i>
                          <h5>All Clear!</h5>
                          <p className="mb-0">Your dues are clear till now.</p>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit}>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group mb-3">
                                <label className="form-label fw-semibold">
                                  <i className="ti ti-currency-rupee me-1"></i>
                                  Payment Amount
                                </label>
                                {formData.feeId && (
                                  <div className="alert alert-info py-2 mb-2">
                                    <i className="ti ti-info-circle me-1"></i>
                                    Remaining Amount: <strong>₹{(studentFee - paidFee).toLocaleString()}</strong>
                                  </div>
                                )}
                                <input
                                  type="number"
                                  className="form-control form-control-lg"
                                  name="amount"
                                  value={formData.amount}
                                  onChange={handleInputChange}
                                  min="0"
                                  max={studentFee - paidFee}
                                  disabled={isDueClear}
                                  required
                                  placeholder="Enter amount to pay..."
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group mb-3">
                                <label className="form-label fw-semibold">
                                  <i className="ti ti-category me-1"></i>
                                  Fee Category
                                </label>
                                {formData.category && (
                                  <div className="alert alert-success py-2 mb-2">
                                    <i className="ti ti-check-circle me-1"></i>
                                    Selected: <span className={`badge ${getCategoryBadgeColor(formData.category)}`}>
                                      {getCategoryDisplayName(formData.category)}
                                    </span>
                                  </div>
                                )}
                                <select
                                  className="form-control form-control-lg"
                                  name="category"
                                  value={formData.category}
                                  onChange={handleInputChange}
                                  required
                                >
                                  <option value="">Select Category</option>
                                  <option value="tuition">Tuition Fee</option>
                                  <option value="library">Library Fee</option>
                                  <option value="transport">Transport Fee</option>
                                  <option value="hostel">Hostel Fee</option>
                                  <option value="other">Other Fee</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Payment Summary Card for Students */}
                          {formData.category && formData.amount > 0 && (
                            <div className="card bg-light border-primary mb-4">
                              <div className="card-body">
                                <div className="row align-items-center">
                                  <div className="col-md-8">
                                    <h6 className="mb-2 text-primary">
                                      <i className="ti ti-receipt me-2"></i>
                                      Payment Summary
                                    </h6>
                                    <div className="d-flex flex-wrap gap-3">
                                      <div>
                                        <small className="text-muted">Category:</small>
                                        <div>
                                          <span className={`badge ${getCategoryBadgeColor(formData.category)}`}>
                                            {getCategoryDisplayName(formData.category)}
                                          </span>
                                        </div>
                                      </div>
                                      <div>
                                        <small className="text-muted">Amount:</small>
                                        <div className="fw-bold text-success">₹{formData.amount.toLocaleString()}</div>
                                      </div>
                                      <div>
                                        <small className="text-muted">Remaining:</small>
                                        <div className="fw-bold text-danger">₹{(studentFee - paidFee - formData.amount).toLocaleString()}</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-4 text-end">
                                    <div className="h4 mb-0 text-primary">₹{formData.amount.toLocaleString()}</div>
                                    <small className="text-muted">Total Payment</small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-lg"
                              onClick={resetForm}
                            >
                              <i className="ti ti-refresh me-1"></i>
                              Reset
                            </button>
                            <button
                              type="submit"
                              className="btn btn-primary btn-lg"
                              disabled={loading || paymentProcessing || isDueClear || !paymentConfigured}
                            >
                              {loading ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                  Processing...
                                </>
                              ) : paymentProcessing ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                  Payment in Progress...
                                </>
                              ) : !paymentConfigured ? (
                                <>
                                  <i className="ti ti-alert-triangle me-1"></i>
                                  Payment Not Configured
                                </>
                              ) : (
                                <>
                                  <i className="ti ti-credit-card me-1"></i>
                                  Pay Fee
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      )}
                      
                      {/* Fee Details Table for Students */}
                      <div className="mt-5">
                        <div className="d-flex align-items-center mb-3">
                          <i className="ti ti-receipt me-2 text-primary"></i>
                          <h6 className="mb-0 text-primary">Your Fee Details</h6>
                        </div>
                        <Table
                          columns={columns}
                          dataSource={feeData}
                          rowKey="id"
                          pagination={false}
                          expandable={{
                            expandedRowRender,
                            expandIcon: ({ expanded, onExpand, record }) => (
                              <button 
                                className="btn btn-link btn-sm p-0 text-primary"
                                onClick={e => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onExpand(record, e);
                                }}
                              >
                                <i className={`ti ti-chevron-${expanded ? 'down' : 'right'}`}></i>
                              </button>
                            ),
                          }}
                          scroll={{ x: true }}
                          className="table-hover"
                        />
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      console.log("Razorpay script loaded successfully");
      resolve(true);
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}