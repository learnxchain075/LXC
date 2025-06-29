import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CollectFeesModal = () => {
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
                                                            <div className="fw-bold">{selectedFee.studentName}</div>
                                                        </div>
                                                        <div>
                                                            <small className="text-muted">Roll No:</small>
                                                            <div className="fw-bold">{selectedFee.rollNo}</div>
                                                        </div>
                                                        <div>
                                                            <small className="text-muted">Class:</small>
                                                            <div className="fw-bold">{selectedFee.class} - {selectedFee.section}</div>
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
                                                            <div className="fw-bold">{selectedFee.feeType}</div>
                                                        </div>
                                                        <div>
                                                            <small className="text-muted">Due Date:</small>
                                                            <div className="fw-bold text-danger">{new Date(selectedFee.dueDate).toLocaleDateString()}</div>
                                                        </div>
                                                        <div>
                                                            <small className="text-muted">Fine per Day:</small>
                                                            <div className="fw-bold text-warning">₹{selectedFee.finePerDay}</div>
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
                                                        <div className="h5 mb-0 text-muted">₹{selectedFee.totalAmount.toLocaleString()}</div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="text-center">
                                                        <small className="text-muted">Amount Paid</small>
                                                        <div className="h5 mb-0 text-success">₹{selectedFee.amountPaid.toLocaleString()}</div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="text-center">
                                                        <small className="text-muted">Pending Amount</small>
                                                        <div className="h4 mb-0 text-danger fw-bold">₹{selectedFee.pendingAmount.toLocaleString()}</div>
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
                                                    <div className="h3 mb-0 text-primary fw-bold">₹{selectedFee.pendingAmount.toLocaleString()}</div>
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
        </>
    );
};

export default CollectFeesModal; 