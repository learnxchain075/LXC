import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AddFeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudent?: any;
}

const AddFeesModal: React.FC<AddFeesModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedStudent 
}) => {
  const [processingPayment, setProcessingPayment] = useState(false);
  const [addFeeForm, setAddFeeForm] = useState({
    feeType: '',
    amount: '',
    dueDate: '',
    description: ''
  });

  const handleAddFee = async () => {
    if (!addFeeForm.feeType || !addFeeForm.amount || !addFeeForm.dueDate) {
      toast.error('Please fill all required fields');
      return;
    }

    setProcessingPayment(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Fee of ₹${addFeeForm.amount} added successfully!`);
      
      // Reset form and close modal
      setAddFeeForm({
        feeType: '',
        amount: '',
        dueDate: '',
        description: ''
      });
      onClose();
      
    } catch (error) {
      toast.error('Failed to add fee. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleClose = () => {
    setAddFeeForm({
      feeType: '',
      amount: '',
      dueDate: '',
      description: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      
      <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <div className="d-flex align-items-center">
                <h4 className="modal-title mb-0">
                  <i className="ti ti-plus me-2"></i>
                  Add Fees
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
                  Adding fees for: <strong>{selectedStudent.user?.name || selectedStudent.name}</strong> 
                  ({selectedStudent.admissionNo})
                </div>
              )}
              
              <form>
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Fee Type <span className="text-danger">*</span></label>
                      <select 
                        className="form-select"
                        value={addFeeForm.feeType}
                        onChange={(e) => setAddFeeForm({...addFeeForm, feeType: e.target.value})}
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
                        value={addFeeForm.amount}
                        onChange={(e) => setAddFeeForm({...addFeeForm, amount: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Due Date <span className="text-danger">*</span></label>
                      <input 
                        type="date" 
                        className="form-control"
                        value={addFeeForm.dueDate}
                        onChange={(e) => setAddFeeForm({...addFeeForm, dueDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea 
                        className="form-control" 
                        rows={3}
                        placeholder="Enter fee description (optional)"
                        value={addFeeForm.description}
                        onChange={(e) => setAddFeeForm({...addFeeForm, description: e.target.value})}
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
                className="btn btn-success"
                onClick={handleAddFee}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="ti ti-plus me-2"></i>
                    Add Fee
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

export default AddFeesModal; 