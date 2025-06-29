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
import { getFeesByStudentId, IFee } from "../../../../../services/student/StudentAllApi";

const StudentFees = () => {
  const routes = all_routes;
  const isMobile = useMobileDetection();
  const [feesData, setFeesData] = useState<IFee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2024 / 2025');

  // Mock fees data for fallback
  const mockFeesData = [
    {
      id: '1',
      studentId: '1',
      schoolId: '1',
      amount: 2000,
      amountPaid: 2000,
      dueDate: '2024-03-25',
      category: 'Admission Fees',
      finePerDay: 10,
      status: 'Paid',
      discount: 200,
      scholarship: 0,
      paymentDate: '2024-01-25',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-25',
      lastReminderSentAt: null,
      Payment: [{
        id: '1',
        amount: 2000,
        status: 'Completed',
        method: 'Cash',
        razorpayOrderId: 'order_123',
        razorpayPaymentId: 'pay_123',
        paymentDate: '2024-01-25',
        createdAt: '2024-01-25'
      }],
      school: {
        id: '1',
        schoolName: 'Sample School'
      }
    },
    {
      id: '2',
      studentId: '1',
      schoolId: '1',
      amount: 2500,
      amountPaid: 2500,
      dueDate: '2024-04-10',
      category: 'Monthly Fees',
      finePerDay: 10,
      status: 'Paid',
      discount: 250,
      scholarship: 0,
      paymentDate: '2024-04-03',
      createdAt: '2024-01-01',
      updatedAt: '2024-04-03',
      lastReminderSentAt: null,
      Payment: [{
        id: '2',
        amount: 2500,
        status: 'Completed',
        method: 'Cash',
        razorpayOrderId: 'order_124',
        razorpayPaymentId: 'pay_124',
        paymentDate: '2024-04-03',
        createdAt: '2024-04-03'
      }],
      school: {
        id: '1',
        schoolName: 'Sample School'
      }
    }
  ];

  useEffect(() => {
    const fetchFeesData = async () => {
      try {
        setIsLoading(true);
        const response = await getFeesByStudentId('current-student-id');
        
        if (response.data.success) {
          setFeesData(response.data.fees);
          toast.success('Fees data loaded successfully!', { autoClose: 3000 });
        } else {
          throw new Error('Failed to load fees data');
        }
      } catch (error: any) {
        console.error('Error fetching fees data:', error);
        setFeesData(mockFeesData);
        toast.warning('Using sample data due to API error', { autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeesData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return (
          <span className="badge bg-success d-inline-flex align-items-center">
            <i className="bi bi-check-circle me-1"></i>
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="badge bg-warning d-inline-flex align-items-center">
            <i className="bi bi-clock me-1"></i>
            Pending
          </span>
        );
      case 'overdue':
        return (
          <span className="badge bg-danger d-inline-flex align-items-center">
            <i className="bi bi-exclamation-triangle me-1"></i>
            Overdue
          </span>
        );
      default:
        return (
          <span className="badge bg-secondary d-inline-flex align-items-center">
            <i className="bi bi-question-circle me-1"></i>
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateTotal = () => {
    return feesData.reduce((sum, fee) => sum + fee.amount, 0);
  };

  const calculateTotalPaid = () => {
    return feesData.reduce((sum, fee) => sum + fee.amountPaid, 0);
  };

  const calculateTotalDiscount = () => {
    return feesData.reduce((sum, fee) => sum + fee.discount, 0);
  };

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
                  <p className="mt-3 text-muted">Loading fees data...</p>
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
                    <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between flex-wrap pb-0">
                      <h4 className="mb-3 fw-bold text-dark">
                        <i className="bi bi-credit-card me-2"></i>
                        Fees Management
                      </h4>
                      <div className="d-flex align-items-center flex-wrap">
                        <div className="dropdown mb-3 me-2">
                          <button
                            className="btn btn-outline-primary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="outside"
                          >
                            <i className="bi bi-calendar me-2" />
                            Year: {selectedYear}
                          </button>
                          <ul className="dropdown-menu p-3">
                            <li>
                              <button 
                                className="dropdown-item rounded-1"
                                onClick={() => setSelectedYear('2024 / 2025')}
                              >
                                Year: 2024 / 2025
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item rounded-1"
                                onClick={() => setSelectedYear('2023 / 2024')}
                              >
                                Year: 2023 / 2024
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item rounded-1"
                                onClick={() => setSelectedYear('2022 / 2023')}
                              >
                                Year: 2022 / 2023
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-0 py-3">
                      {feesData.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead className="table-light">
                            <tr>
                              <th>Fees Group</th>
                              <th>Fees Code</th>
                              <th>Due Date</th>
                                <th>Amount ($)</th>
                              <th>Status</th>
                              <th>Ref ID</th>
                              <th>Mode</th>
                              <th>Date Paid</th>
                              <th>Discount ($)</th>
                              <th>Fine ($)</th>
                            </tr>
                          </thead>
                          <tbody>
                              {feesData.map((fee) => (
                                <tr key={fee.id}>
                                  <td>
                                    <p className="text-primary fees-group mb-0">
                                      {fee.category}
                                      <span className="d-block text-muted small">
                                        ({fee.school.schoolName})
                                  </span>
                                </p>
                              </td>
                              <td>
                                    <span className="text-muted">{fee.category.toLowerCase().replace(/\s+/g, '-')}</span>
                              </td>
                                  <td>{formatDate(fee.dueDate)}</td>
                                  <td>
                                    <span className="fw-bold">${fee.amount.toLocaleString()}</span>
                              </td>
                                  <td>{getStatusBadge(fee.status)}</td>
                              <td>
                                    <span className="text-muted">#{fee.id}</span>
                              </td>
                                  <td>
                                    {fee.Payment.length > 0 ? fee.Payment[0].method : 'N/A'}
                              </td>
                              <td>
                                    {fee.paymentDate ? formatDate(fee.paymentDate) : 'N/A'}
                              </td>
                                  <td>
                                    <span className="text-success">${fee.discount}</span>
                              </td>
                              <td>
                                    <span className="text-danger">$0</span>
                              </td>
                            </tr>
                              ))}
                              <tr className="table-dark">
                                <td className="text-white fw-bold">Total</td>
                                <td className="text-white"></td>
                                <td className="text-white"></td>
                                <td className="text-white fw-bold">${calculateTotal().toLocaleString()}</td>
                                <td className="text-white"></td>
                                <td className="text-white"></td>
                                <td className="text-white"></td>
                                <td className="text-white"></td>
                                <td className="text-white fw-bold">${calculateTotalDiscount()}</td>
                                <td className="text-white fw-bold">$0</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      ) : (
                        <div className="text-center py-5">
                          <i className="bi bi-credit-card display-4 text-muted mb-3"></i>
                          <h5>No fees records found</h5>
                          <p className="text-muted">No fees have been assigned to this student yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
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

export default StudentFees;
