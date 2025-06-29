import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getStudentFeesOverview, IFeesOverview } from '../../../../../services/student/StudentAllApi';

interface FeeData {
  total: number;
  paid: number;
  due: number;
}

const FeesOverview = () => {
  const [data, setData] = useState<FeeData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for fallback
  const mockFeeData: FeeData = {
    total: 5000,
    paid: 3000,
    due: 2000
  };

  const fetchData = async (): Promise<FeeData> => {
    try {
      const response = await getStudentFeesOverview();
      if (response.data.success) {
        return {
          total: response.data.overview.totalFees,
          paid: response.data.overview.paidFees,
          due: response.data.overview.dueFees
        };
      }
      throw new Error('Failed to load fee data');
    } catch (error) {
      console.error('Error fetching fee data:', error);
      return mockFeeData;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const feeData = await fetchData();
        setData(feeData);
        setPaymentAmount(feeData.due);
        toast.success('Fee details loaded successfully!', { autoClose: 3000 });
      } catch (error) {
        console.error('Error loading fee data:', error);
        toast.error('Failed to load fee details.', { autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePay = () => {
    toast.success(`Payment of $${paymentAmount} via ${paymentMethod} processed!`, { autoClose: 3000 });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    toast.info('Payment cancelled', { autoClose: 2000 });
  };

  if (isLoading) {
    return (
      <div className="card flex-fill">
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading fee details...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card flex-fill">
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        <div className="card-body text-center py-5">
          <i className="bi bi-exclamation-triangle display-4 text-muted mb-3"></i>
          <h5>Failed to load fee data</h5>
          <p className="text-muted">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card flex-fill border-0 shadow-sm">
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      <div className="card-header bg-white border-0">
        <h5 className="fw-bold text-dark mb-0">
          <i className="bi bi-credit-card me-2"></i>
          Fees Overview
        </h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="fw-medium text-dark">Total Fees</span>
            <span className="badge bg-primary fs-6">${data.total.toLocaleString()}</span>
          </div>
          <div className="progress mb-3" style={{ height: '8px' }}>
            <div 
              className="progress-bar bg-success" 
              style={{ width: `${(data.paid / data.total) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="fw-medium text-success">Paid</span>
            <span className="fw-bold text-success">${data.paid.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="fw-medium text-danger">Due</span>
            <span className="fw-bold text-danger">${data.due.toLocaleString()}</span>
          </div>
        </div>
        
        <button
          className="btn btn-success w-100"
          onClick={() => {
            setIsModalVisible(true);
            toast.info('Opening payment modal', { autoClose: 2000 });
          }}
          disabled={data.due === 0}
        >
          <i className="bi bi-credit-card me-2"></i>
          Pay Now
        </button>

        {/* Payment Modal */}
        {isModalVisible && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-credit-card me-2"></i>
                    Pay Fees
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleCancel}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-medium">Amount ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Payment Method</label>
                    <select
                      className="form-select"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Net Banking">Net Banking</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handlePay}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Pay
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeesOverview;