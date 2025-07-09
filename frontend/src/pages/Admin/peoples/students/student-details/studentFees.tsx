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
import { useSelector } from 'react-redux';

const StudentFees = () => {
  const routes = all_routes;
  const isMobile = useMobileDetection();
  const [feesData, setFeesData] = useState<IFee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2024 / 2025');
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);

  useEffect(() => {
    const fetchFeesData = async () => {
      try {
        setIsLoading(true);
        const studentId = localStorage.getItem('studentId');
        if (!studentId) throw new Error('Student ID not found');
        const response = await getFeesByStudentId(studentId);
        if (response.data.success) {
          setFeesData(response.data.fees);
          toast.success('Fees data loaded successfully!', { autoClose: 3000 });
        } else {
          throw new Error('Failed to load fees data');
        }
      } catch (error: any) {
       // console.error('Error fetching fees data:', error);
        setFeesData([]);
        toast.error('No fees data found or API error', { autoClose: 3000 });
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
      <div className={isMobile ? "page-wrapper" : `p-3${dataTheme === 'dark_data_theme' ? ' bg-dark text-light' : ''}`}>
        <ToastContainer position="top-center" autoClose={3000} theme={dataTheme === 'dark_data_theme' ? 'dark' : 'colored'} />
        <div className="content">
          <div className="row">
            <div className="col-12">
              <div className={`card${dataTheme === 'dark_data_theme' ? ' bg-dark text-light border-secondary' : ''}`}>
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
      <div className={isMobile ? "page-wrapper" : `p-3${dataTheme === 'dark_data_theme' ? ' bg-dark text-light' : ''}`}>
        <ToastContainer position="top-center" autoClose={3000} theme={dataTheme === 'dark_data_theme' ? 'dark' : 'colored'} />
        <div className="content">
          <div className="row">
            <div className="col-12 d-flex flex-column">
              <div className="row">
                <div className="col-md-12">
                  <div className={`card border-0 shadow-sm${dataTheme === 'dark_data_theme' ? ' bg-dark text-light border-secondary' : ''}`}>
                    <div className={`card-header${dataTheme === 'dark_data_theme' ? ' bg-dark text-light border-secondary' : ' bg-white' } border-0 d-flex align-items-center justify-content-between flex-wrap pb-0`}>
                      <h4 className={`mb-3 fw-bold${dataTheme === 'dark_data_theme' ? ' text-light' : ' text-dark'}`}>
                        <i className={`bi bi-credit-card me-2${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}></i>
                        Fees Management
                      </h4>
                      <div className="d-flex align-items-center flex-wrap">
                        <div className="dropdown mb-3 me-2">
                          <button
                            className={`btn btn-outline-primary dropdown-toggle${dataTheme === 'dark_data_theme' ? ' border-secondary btn-outline-light text-light' : ''}`}
                            type="button"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="outside"
                          >
                            <i className={`bi bi-calendar me-2${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}></i>
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
                          <table className={`table table-hover${dataTheme === 'dark_data_theme' ? ' table-dark text-light border-secondary' : ''}`}>
                            <thead className={dataTheme === 'dark_data_theme' ? 'table-dark text-light border-secondary' : 'table-light'}>
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
                              <tr className={dataTheme === 'dark_data_theme' ? 'table-secondary' : 'table-dark'}>
                                <td className={dataTheme === 'dark_data_theme' ? 'text-dark fw-bold' : 'text-white fw-bold'}>Total</td>
                                <td className={dataTheme === 'dark_data_theme' ? 'text-dark' : 'text-white'}></td>
                                <td className={dataTheme === 'dark_data_theme' ? 'text-dark' : 'text-white'}></td>
                                <td className={dataTheme === 'dark_data_theme' ? 'text-dark fw-bold' : 'text-white fw-bold'}>${calculateTotal().toLocaleString()}</td>
                                <td className={dataTheme === 'dark_data_theme' ? 'text-dark' : 'text-white'}></td>
                                <td className={dataTheme === 'dark_data_theme' ? 'text-dark' : 'text-white'}></td>
                                <td className={dataTheme === 'dark_data_theme' ? 'text-dark' : 'text-white'}></td>
                                <td className={dataTheme === 'dark_data_theme' ? 'text-dark' : 'text-white'}></td>
                                <td className={dataTheme === 'dark_data_theme' ? 'text-dark fw-bold' : 'text-white fw-bold'}>${calculateTotalDiscount()}</td>
                                <td className={dataTheme === 'dark_data_theme' ? 'text-dark fw-bold' : 'text-white fw-bold'}>$0</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      ) : (
                        <div className={`text-center py-5${dataTheme === 'dark_data_theme' ? ' bg-dark text-light rounded-4 shadow border border-secondary' : ''}`}>
                          <i className={`bi bi-credit-card display-4 mb-3${dataTheme === 'dark_data_theme' ? ' text-light' : ' text-muted'}`}></i>
                          <h5 className={dataTheme === 'dark_data_theme' ? 'text-light' : 'text-muted'}>No fees records found</h5>
                          <p className={dataTheme === 'dark_data_theme' ? 'text-light' : 'text-muted'}>No fees have been assigned to this student yet.</p>
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
