import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CollectFeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudent?: any;
}

const CollectFeesModal: React.FC<CollectFeesModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedStudent 
}) => {
  const [processingPayment, setProcessingPayment] = useState(false);
  const [collectFeeForm, setCollectFeeForm] = useState({
    feeType: '',
    amount: '',
    paymentMethod: 'cash',
    receiptNumber: '',
    notes: ''
  });

  // Dummy pending fees data
  const pendingFees = [
    { id: 1, type: 'Tuition Fee', amount: 5000, dueDate: '2024-02-15', status: 'Pending' },
    { id: 2, type: 'Library Fee', amount: 1000, dueDate: '2024-02-20', status: 'Pending' },
    { id: 3, type: 'Transport Fee', amount: 2000, dueDate: '2024-02-25', status: 'Pending' }
  ];

  const handleCollectFee = async () => {
    if (!collectFeeForm.feeType || !collectFeeForm.amount) {
      toast.error('Please fill all required fields');
      return;
    }

    setProcessingPayment(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Fee of ₹${collectFeeForm.amount} collected successfully!`);
      
      // Reset form and close modal
      setCollectFeeForm({
        feeType: '',
        amount: '',
        paymentMethod: 'cash',
        receiptNumber: '',
        notes: ''
      });
      onClose();
      
    } catch (error) {
      toast.error('Failed to collect fee. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleClose = () => {
    setCollectFeeForm({
      feeType: '',
      amount: '',
      paymentMethod: 'cash',
      receiptNumber: '',
      notes: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      
      <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <div className="d-flex align-items-center">
                <h4 className="modal-title mb-0">
                  <i className="ti ti-cash me-2"></i>
                  Collect Fees
                </h4>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={handleClose}
              >
                <i className="ti ti-x" />
              </button>
            </div>
            
            <div className="modal-body">
              {selectedStudent && (
                <div className="alert alert-info mb-3">
                  <i className="ti ti-info-circle me-2"></i>
                  Collecting fees for: <strong>{selectedStudent.user?.name || selectedStudent.name}</strong> 
                  ({selectedStudent.admissionNo})
                </div>
              )}

              {/* Pending Fees Section */}
              <div className="mb-4">
                <h5 className="mb-3">
                  <i className="ti ti-clock me-2"></i>
                  Pending Fees
                </h5>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Fee Type</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingFees.map((fee) => (
                        <tr key={fee.id}>
                          <td>{fee.type}</td>
                          <td>₹{fee.amount}</td>
                          <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                          <td>
                            <span className="badge bg-warning">{fee.status}</span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={() => setCollectFeeForm({
                                ...collectFeeForm,
                                feeType: fee.type,
                                amount: fee.amount.toString()
                              })}
                            >
                              Collect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Fee Type <span className="text-danger">*</span></label>
                      <select 
                        className="form-select"
                        value={collectFeeForm.feeType}
                        onChange={(e) => setCollectFeeForm({...collectFeeForm, feeType: e.target.value})}
                        required
                      >
                        <option value="">Select Fee Type</option>
                        <option value="tuition">Tuition Fee</option>
                        <option value="library">Library Fee</option>
                        <option value="transport">Transport Fee</option>
                        <option value="examination">Examination Fee</option>
                        <option value="sports">Sports Fee</option>
                        <option value="laboratory">Laboratory Fee</option>
                        <option value="computer">Computer Fee</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Amount (₹) <span className="text-danger">*</span></label>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Enter amount"
                        value={collectFeeForm.amount}
                        onChange={(e) => setCollectFeeForm({...collectFeeForm, amount: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Payment Method <span className="text-danger">*</span></label>
                      <select 
                        className="form-select"
                        value={collectFeeForm.paymentMethod}
                        onChange={(e) => setCollectFeeForm({...collectFeeForm, paymentMethod: e.target.value})}
                        required
                      >
                        <option value="cash">Cash</option>
                        <option value="online">Online Payment</option>
                        <option value="cheque">Cheque</option>
                        <option value="card">Card</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Receipt Number</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter receipt number"
                        value={collectFeeForm.receiptNumber}
                        onChange={(e) => setCollectFeeForm({...collectFeeForm, receiptNumber: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Notes</label>
                      <textarea 
                        className="form-control" 
                        rows={3}
                        placeholder="Enter any additional notes (optional)"
                        value={collectFeeForm.notes}
                        onChange={(e) => setCollectFeeForm({...collectFeeForm, notes: e.target.value})}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCollectFee}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="ti ti-cash me-2"></i>
                    Collect Fee
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectFeesModal; 