import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../../../../router/all_routes";
import { OverlayTrigger,  Tooltip } from "react-bootstrap";
import { IPaymentSecertForm } from "../../../../services/types/admin/paymentsecertService";
import { 
  createPaymentSecret, 
  getPaymentSecretBySchoolId, 
  updatePaymentSecret
} from "../../../../services/admin/paymentsecertApi";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';

const PaymentGateways = () => {
  const routes = all_routes;
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<IPaymentSecertForm>({
    keyId: "",
    keySecret: "",
    schoolId: localStorage.getItem("schoolId") || "",
  });
  const [paymentSecretId, setPaymentSecretId] = useState<string>("");

  useEffect(() => {
    const fetchPaymentSecret = async () => {
      try {
        setIsLoading(true);
        const response = await getPaymentSecretBySchoolId(localStorage.getItem("schoolId") || "");
        // Adjust mapping based on actual API response structure
        // Try response.data.data or response.data if not nested
        const secret = response.data?.data || response.data;
        if (secret && (secret.keyId || secret.keySecret)) {
          setFormData({
            keyId: secret.keyId,
            keySecret: secret.keySecret,
            schoolId: secret.schoolId
          });
          setPaymentSecretId(secret._id || secret.id || "");
          setIsEdit(true);
        } else {
          toast.error(response.data.message || "Failed to fetch payment secret");
          console.error("Payment secret fetch error:", response);
        }
      } catch (err: any) {
        toast.error((err?.response?.data?.message || err?.message || "Failed to fetch payment secret") + " (see console for details)");
        console.error("Payment secret fetch exception:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPaymentSecret();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!formData.schoolId) {
        toast.error("School ID missing");
        return;
      }
      if (isEdit && paymentSecretId) {
        await updatePaymentSecret(paymentSecretId, formData);
        toast.success("Payment details updated successfully!");
      } else {
        await createPaymentSecret(formData);
        toast.success("Payment details saved successfully!");
        setIsEdit(true);
      }
      // Close modal
      const closeButton = document.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
      if (closeButton) {
        closeButton.click();
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Failed to save payment details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when modal is closed without saving
    if (isEdit) {
      // Don't reset if we're in edit mode
      return;
    }
    setFormData({
      keyId: "",
      keySecret: "",
      schoolId: localStorage.getItem("schoolId") || "",
    });
    setPaymentSecretId("");
  };

  return (
    <div className="page-wrapper">
       <ToastContainer position="top-center" autoClose={3000} />
      <div className="content bg-white">
        {/* Header Section */}
        <div className="d-md-flex d-block align-items-center justify-content-between border-bottom pb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Financial Settings</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to="index">Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Settings</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Financial Settings
                </li>
              </ol>
            </nav>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <div className="pe-1 mb-2">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-top">Refresh</Tooltip>}
              >
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white btn-icon me-1"
                >
                  <i className="ti ti-refresh" />
                </Link>
              </OverlayTrigger>
            </div>
          </div>
        </div>

        {/* Main Content Area - Centered Layout */}
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-80 p-4">
          <div className="w-100" style={{ maxWidth: "1200px" }}>
            <div className="row justify-content-center">
              <div className="col-xxl-8 col-xl-10">
                <div className="card shadow-sm border-0">
                  <div className="card-body p-4">
                    <form>
                      <div className="d-flex flex-column align-items-center mb-4">
                        <h5 className="mb-2 text-center">Payment Gateways</h5>
                        <p className="text-muted text-center">Payments Settings Configuration</p>
                      </div>

                      {/* Payment Gateway Card - Centered */}
                      <div className="d-flex justify-content-center">
                        <div className="col-xxl-6 col-xl-8">
                          <div className="card flex-fill">
                            <div className="card-header d-flex align-items-center justify-content-between border-0 mb-3 pb-0">
                              <span className="d-inline-flex align-items-center justify-content-center border rounded p-2">
                                <ImageWithBasePath
                                  src="assets/img/payment-gateway/payment-gateway-05.svg"
                                  alt="Razorpay Logo"
                                />
                              </span>
                              <div className="d-flex align-items-center">
                                <span className={`badge bg-transparent-${isEdit ? 'success' : 'dark'} text-${isEdit ? 'success' : 'dark'} me-2`}>
                                  {isEdit ? "Connected" : "Not Connected"}
                                </span>
                              </div>
                            </div>
                            <div className="card-body pt-0 text-center">
                              <p className="mb-4">
                                Razorpay is a comprehensive payment gateway and financial solutions
                                provider in India.
                              </p>
                              <div className="d-flex justify-content-center">
                                <Link
                                  to="#"
                                  className="btn btn-outline-light fw-semibold"
                                  data-bs-toggle="modal"
                                  data-bs-target="#connect_payment"
                                >
                                  <i className="ti ti-tool me-2" />
                                  {isEdit ? "Edit" : "Add"} Integration
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal - Centered */}
      <div className="modal fade" id="connect_payment">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title text-center w-100">Razorpay Integration</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleClose}
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">API Key</label>
                  <input
                    type="text"
                    name="keyId"
                    className="form-control"
                    placeholder="Enter API Key"
                    value={formData.keyId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Secret Key</label>
                  <input
                    type="text"
                    name="keySecret"
                    className="form-control"
                    placeholder="Enter Secret Key"
                    value={formData.keySecret}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-light me-3"
                  data-bs-dismiss="modal"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary px-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      {isEdit ? "Updating..." : "Saving..."}
                    </>
                  ) : (
                    isEdit ? "Update" : "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateways;