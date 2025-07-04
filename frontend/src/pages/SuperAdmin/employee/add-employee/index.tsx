import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { all_routes } from "../../../../router/all_routes";
import { registerEmployee } from "../../../../services/admin/employeeService";

const AddEmployee = () => {
  const routes = all_routes;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    bloodType: "",
    sex: "",
    employeeType: "",
    company: "",
    profilePic: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.country ||
      !formData.pincode ||
      !formData.bloodType ||
      !formData.sex ||
      !formData.profilePic
    ) {
      toast.error("Please fill all required fields and upload a profile picture.");
      return;
    }
    try {
      setLoading(true);
      await registerEmployee(formData as any);
      toast.success("Employee added successfully");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        bloodType: "",
        sex: "",
        employeeType: "",
        company: "",
        profilePic: null,
      });
      setPreviewUrl(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to add employee";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="content content-two">
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="mb-1">Add Employee</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.superAdminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Add Employee
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Address"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="City"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="State"
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Country"
                    value={formData.country}
                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Blood Type"
                    value={formData.bloodType}
                    onChange={e => setFormData({ ...formData, bloodType: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={formData.sex}
                    onChange={e => setFormData({ ...formData, sex: e.target.value })}
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={formData.employeeType}
                    onChange={e =>
                      setFormData({ ...formData, employeeType: e.target.value })
                    }
                  >
                    <option value="">Select Employee Type</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="LIBRARIAN">Librarian</option>
                    <option value="ADMINISTRATOR">Administrator</option>
                    <option value="SUPPORT">Support</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Company"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="file"
                    className="form-control"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({ ...formData, profilePic: file });
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>
                {previewUrl && (
                  <div className="col-md-6">
                    <img src={previewUrl} alt="preview" className="img-fluid" />
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
