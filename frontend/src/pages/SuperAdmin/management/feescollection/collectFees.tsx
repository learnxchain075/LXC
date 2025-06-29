import React, { useEffect, useRef, useState } from "react";
import { all_routes } from "../../../../router/all_routes";
import { Link } from "react-router-dom";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import CommonSelect from "../../../../core/common/commonSelect";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  AdmissionNo,
  allClass,
  allSection,
  amount,
  DueDate,
  feeGroup,
  feesTypes,
  fineType,
  ids,
  names,
  rollno,
  status,
} from "../../../../core/common/selectoption/selectoption";
import { TableData } from "../../../../core/data/interface";
// import Table from "../../../../core/common/dataTable/index";
import FeesModal from "./feesModal";

import StudentModals from "../../../../pages/Admin/peoples/students/studentModals";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import TooltipOption from "../../../../core/common/tooltipOption";
import { getSchoolFees } from "../../../../services/admin/feesCollection";
import { Table } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CollectFees = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [collectFee,setcollectFee]=useState<any[]>([])
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Static data for demonstration
  const pendingFees = [
    {
      id: 1,
      studentName: "John Doe",
      rollNo: "2024001",
      class: "Class 10",
      section: "A",
      feeType: "Tuition Fee",
      totalAmount: 50000,
      amountPaid: 30000,
      pendingAmount: 20000,
      dueDate: "2024-12-31",
      finePerDay: 100
    },
    {
      id: 2,
      studentName: "Jane Smith",
      rollNo: "2024002", 
      class: "Class 9",
      section: "B",
      feeType: "Library Fee",
      totalAmount: 5000,
      amountPaid: 0,
      pendingAmount: 5000,
      dueDate: "2024-12-15",
      finePerDay: 50
    },
    {
      id: 3,
      studentName: "Mike Johnson",
      rollNo: "2024003",
      class: "Class 11",
      section: "C",
      feeType: "Transport Fee",
      totalAmount: 15000,
      amountPaid: 5000,
      pendingAmount: 10000,
      dueDate: "2024-12-20",
      finePerDay: 75
    }
  ];

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const handleCollectFees = (fee: any) => {
    setSelectedFee(fee);
  };

  const handlePayment = async () => {
    if (!selectedFee) return;
    
    setProcessingPayment(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (paymentMethod === 'cash') {
        toast.success(`Cash payment of ₹${selectedFee.pendingAmount.toLocaleString()} collected successfully!`);
      } else {
        toast.success(`Online payment of ₹${selectedFee.pendingAmount.toLocaleString()} processed successfully!`);
      }
      
      // Close modal
      const modal = document.getElementById('add_fees_collect');
      if (modal) {
        const bootstrapModal = require('bootstrap').Modal.getInstance(modal);
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      }
      
      // Reset form
      setSelectedFee(null);
      setPaymentMethod('cash');
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const fetchFee = async () => {
    setLoading(true);
    try {
      const res = await getSchoolFees(localStorage.getItem("schoolId") || "");
     // console.log('Fees API response:', res);
      if (res.status === 200) {
        setcollectFee(res.data);
      }
    } catch (error) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
fetchFee();
  },[])
  const columns = [
    {
      title: "Amount ($)",
      dataIndex: "amount",
      sorter: (a: any, b: any) => a.amount - b.amount,
    },
    {
      title: "Amount Paid ($)",
      dataIndex: "amountPaid",
      sorter: (a: any, b: any) => a.amountPaid - b.amountPaid,
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a: any, b: any) => a.category.localeCompare(b.category),
    },
    {
      title: "Discount (%)",
      dataIndex: "discount",
      sorter: (a: any, b: any) => a.discount - b.discount,
    },
    {
      title: "Scholarship (%)",
      dataIndex: "scholarship",
      sorter: (a: any, b: any) => a.scholarship - b.scholarship,
    },
    {
      title: "Fine / Day ($)",
      dataIndex: "finePerDay",
      sorter: (a: any, b: any) => a.finePerDay - b.finePerDay,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      render: (text: string) => new Date(text).toLocaleDateString(),
      sorter: (a: any, b: any) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      render: (text: string) => new Date(text).toLocaleDateString(),
      sorter: (a: any, b: any) =>
        new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime(),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) =>
        text === "PAID" ? (
          <span className="badge badge-soft-success d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            {text}
          </span>
        ) : (
          <span className="badge badge-soft-danger d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            {text}
          </span>
        ),
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
    },
    {
      title: "Action",
      dataIndex: "status",
      render: (text: string, record: any) =>
        text === "Paid" ? (
          <Link to={routes.studentFees} className="btn btn-light">
            View Details
          </Link>
        ) : (
          <Link
            to="#"
            className="btn btn-light"
            data-bs-toggle="modal"
            data-bs-target="#add_fees_collect"
            onClick={() => handleCollectFees(record)}
          >
            Collect Fees
          </Link>
        ),
    },
  ];
  
  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      
      {/* Collect Fees Modal */}
      <div className="modal fade" id="add_fees_collect" tabIndex={-1} aria-labelledby="collectFeesModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <div className="d-flex align-items-center">
                <h4 className="modal-title mb-0">
                  <i className="ti ti-credit-card me-2"></i>
                  Collect Fees
                </h4>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setSelectedFee(null);
                  setPaymentMethod('cash');
                }}
              >
                <i className="ti ti-x" />
              </button>
            </div>
            
            <div className="modal-body">
              {selectedFee ? (
                <>
                  {/* Student Information */}
                  <div className="card bg-light mb-4">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <h6 className="text-primary mb-3">
                            <i className="ti ti-user me-2"></i>
                            Student Information
                          </h6>
                          <div className="d-flex flex-column gap-2">
                            <div>
                              <small className="text-muted">Name:</small>
                              <div className="fw-bold">{selectedFee.studentName || "N/A"}</div>
                            </div>
                            <div>
                              <small className="text-muted">Roll No:</small>
                              <div className="fw-bold">{selectedFee.rollNo || "N/A"}</div>
                            </div>
                            <div>
                              <small className="text-muted">Class:</small>
                              <div className="fw-bold">{selectedFee.class || "N/A"} - {selectedFee.section || "N/A"}</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <h6 className="text-primary mb-3">
                            <i className="ti ti-receipt me-2"></i>
                            Fee Details
                          </h6>
                          <div className="d-flex flex-column gap-2">
                            <div>
                              <small className="text-muted">Fee Type:</small>
                              <div className="fw-bold">{selectedFee.category || selectedFee.feeType || "N/A"}</div>
                            </div>
                            <div>
                              <small className="text-muted">Due Date:</small>
                              <div className="fw-bold text-danger">{selectedFee.dueDate ? new Date(selectedFee.dueDate).toLocaleDateString() : "N/A"}</div>
                            </div>
                            <div>
                              <small className="text-muted">Fine per Day:</small>
                              <div className="fw-bold text-warning">₹{selectedFee.finePerDay || 0}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="card border-primary mb-4">
                    <div className="card-header bg-primary text-white">
                      <h6 className="mb-0">
                        <i className="ti ti-calculator me-2"></i>
                        Payment Summary
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="text-center">
                            <small className="text-muted">Total Amount</small>
                            <div className="h5 mb-0 text-muted">₹{(selectedFee.amount || selectedFee.totalAmount || 0).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="text-center">
                            <small className="text-muted">Amount Paid</small>
                            <div className="h5 mb-0 text-success">₹{(selectedFee.amountPaid || 0).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="text-center">
                            <small className="text-muted">Pending Amount</small>
                            <div className="h4 mb-0 text-danger fw-bold">₹{((selectedFee.amount || selectedFee.totalAmount || 0) - (selectedFee.amountPaid || 0)).toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="card mb-4">
                    <div className="card-header">
                      <h6 className="mb-0">
                        <i className="ti ti-credit-card me-2"></i>
                        Select Payment Method
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-check payment-method-card">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="paymentMethod"
                              id="cashPayment"
                              value="cash"
                              checked={paymentMethod === 'cash'}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label className="form-check-label w-100" htmlFor="cashPayment">
                              <div className="card border-2 h-100" style={{ borderColor: paymentMethod === 'cash' ? '#0d6efd' : '#dee2e6' }}>
                                <div className="card-body text-center">
                                  <i className="ti ti-cash fs-1 text-success mb-2"></i>
                                  <h6 className="mb-1">Cash Payment</h6>
                                  <small className="text-muted">Pay in cash at the counter</small>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-check payment-method-card">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="paymentMethod"
                              id="onlinePayment"
                              value="online"
                              checked={paymentMethod === 'online'}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label className="form-check-label w-100" htmlFor="onlinePayment">
                              <div className="card border-2 h-100" style={{ borderColor: paymentMethod === 'online' ? '#0d6efd' : '#dee2e6' }}>
                                <div className="card-body text-center">
                                  <i className="ti ti-device-mobile fs-1 text-primary mb-2"></i>
                                  <h6 className="mb-1">Online Payment</h6>
                                  <small className="text-muted">Pay online via card/UPI</small>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Amount */}
                  <div className="card bg-light">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <h6 className="mb-2">Payment Amount</h6>
                          <div className="h3 mb-0 text-primary fw-bold">₹{((selectedFee.amount || selectedFee.totalAmount || 0) - (selectedFee.amountPaid || 0)).toLocaleString()}</div>
                          <small className="text-muted">Total amount to be collected</small>
                        </div>
                        <div className="col-md-4 text-end">
                          <button
                            type="button"
                            className="btn btn-primary btn-lg"
                            onClick={handlePayment}
                            disabled={processingPayment}
                          >
                            {processingPayment ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Processing...
                              </>
                            ) : (
                              <>
                                <i className="ti ti-credit-card me-2"></i>
                                {paymentMethod === 'cash' ? 'Collect Cash' : 'Process Payment'}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Pending Fees List */}
                  <div className="mb-4">
                    <h6 className="text-primary mb-3">
                      <i className="ti ti-alert-circle me-2"></i>
                      Pending Fees
                    </h6>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Student</th>
                            <th>Class</th>
                            <th>Fee Type</th>
                            <th>Pending Amount</th>
                            <th>Due Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingFees.map((fee) => (
                            <tr key={fee.id}>
                              <td>
                                <div>
                                  <div className="fw-bold">{fee.studentName}</div>
                                  <small className="text-muted">{fee.rollNo}</small>
                                </div>
                              </td>
                              <td>{fee.class} - {fee.section}</td>
                              <td>
                                <span className="badge bg-primary">{fee.feeType}</span>
                              </td>
                              <td>
                                <div className="fw-bold text-danger">₹{fee.pendingAmount.toLocaleString()}</div>
                              </td>
                              <td>
                                <div className="text-danger">{new Date(fee.dueDate).toLocaleDateString()}</div>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleCollectFees(fee)}
                                >
                                  <i className="ti ti-credit-card me-1"></i>
                                  Collect
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => {
                  setSelectedFee(null);
                  setPaymentMethod('cash');
                }}
              >
                Close
              </button>
              {selectedFee && (
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => setSelectedFee(null)}
                >
                  <i className="ti ti-arrow-left me-1"></i>
                  Back to List
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Fees Collection</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Fees Collection</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Collect Fees
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
            </div>
          </div>
          {/* /Page Header */}
          {/* Students List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Fees List</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative">
                  <PredefinedDateRanges />
                </div>
                <div className="dropdown mb-3 me-2">
                  <Link
                    to="#"
                    className="btn btn-outline-light bg-white dropdown-toggle"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                  >
                    <i className="ti ti-filter me-2" />
                    Filter
                  </Link>
                  <div
                    className="dropdown-menu drop-width"
                    ref={dropdownMenuRef}
                  >
                    <form>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 border-bottom">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Admisson No</label>
                              <CommonSelect
                                className="select"
                                options={AdmissionNo}
                                defaultValue={AdmissionNo[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Roll No</label>
                              <CommonSelect
                                className="select"
                                options={rollno}
                                defaultValue={rollno[0]}
                              />
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Student</label>
                              <CommonSelect
                                className="select"
                                options={names}
                                defaultValue={names[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Class</label>
                              <CommonSelect
                                className="select"
                                options={allClass}
                                defaultValue={allClass[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Section</label>
                              <CommonSelect
                                className="select"
                                options={allSection}
                                defaultValue={allSection[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-0">
                              <label className="form-label">Amount</label>
                              <CommonSelect
                                className="select"
                                options={amount}
                                defaultValue={amount[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-0">
                              <label className="form-label">Last Date</label>
                              <CommonSelect
                                className="select"
                                options={DueDate}
                                defaultValue={DueDate[0]}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <Link to="#" className="btn btn-light me-3">
                          Reset
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-primary"
                          onClick={handleApplyClick}
                        >
                          Apply
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="dropdown mb-3">
                  <Link
                    to="#"
                    className="btn btn-outline-light bg-white dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-sort-ascending-2 me-2" />
                    Sort by A-Z{" "}
                  </Link>
                  <ul className="dropdown-menu p-3">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Ascending
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Descending
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Recently Viewed
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Recently Added
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body p-0 py-3">
              {/* Student List */}
              {/* <Table dataSource={collectFee}
              columns={columns}
              key="id"
              loading={loading}
               Selection={true} /> */}
              {/* /Student List */}
              <Table 
                dataSource={collectFee} 
                columns={columns} 
                rowKey="id"
                loading={loading}
              />
            </div>
          </div>
          {/* /Students List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      <StudentModals />
    </>
  );
};

export default CollectFees;
