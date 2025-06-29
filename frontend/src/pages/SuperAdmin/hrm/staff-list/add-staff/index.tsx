import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { all_routes } from "../../../../../router/all_routes";

import {
  bloodGroup,
  gender,
} from "../../../../../core/common/selectoption/selectoption";
import { registerStaff } from "../../../../../services/admin/staffRegister";
import { toast, ToastContainer } from "react-toastify";

const AddStaff = () => {
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
    profilePic: null as File | null,
    schoolId: localStorage.getItem("schoolId") || "", 
  });
  
const[isLoading, setIsLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const data = new FormData();
    // Object.entries(formData).forEach(([key, value]) => {
    //   data.append(key, value);
    // });
    // if (profilePic) {
    //   data.append("profilePic", profilePic);
    // }
    try {
      setIsLoading(true);

      if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.country || !formData.pincode || !formData.bloodType || !formData.sex || !formData.profilePic) {
        toast.error("Please fill all required fields and upload a profile picture.");
        setIsLoading(false);
        return;
      }

      await registerStaff(formData as any);
      toast.success("Staff added successfully" );
      // console.log("Staff added successfully");
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
      profilePic: null as File | null,
      schoolId: localStorage.getItem("schoolId") || ""});
      setProfilePic(null);
      setPreviewUrl(null);
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding staff:", error);
      const errorMessage = (error as any)?.response?.data?.message || "Error adding staff";
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable pauseOnFocusLoss theme="light" />
        <div className="content content-two">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="mb-1">Add Staff</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">HRM</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Add Staff
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-info-square-rounded fs-16" />
                      </span>
                      <h4 className="text-dark">Personal Information</h4>
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="d-flex align-items-center flex-wrap row-gap-3 mb-3">
                          <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                            {previewUrl ? (
                              <img
                                src={previewUrl}
                                alt="Profile Picture"
                                className="img-fluid"
                              />
                            ) : (
                              <i className="ti ti-photo-plus fs-16" />
                            )}
                          </div>
                          <div className="profile-upload">
                            <input
                              type="file"
                              className="form-control"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setProfilePic(file);
                                  setPreviewUrl(URL.createObjectURL(file));
                                  setFormData({...formData, profilePic: file });
                                }
                              }}
                            />
                            <p className="fs-12">
                              Upload image size 4MB, Format JPG, PNG, SVG
                            </p>
                            <Link
                              to="#"
                              className="btn btn-primary mb-3"
                              onClick={() => {
                                setProfilePic(null);
                                setPreviewUrl(null);
                              }}
                            >
                              Remove
                              </Link>
                            
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row row-cols-xxl-5 row-cols-md-6">
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email Address</label>
                          <input
                            type="email"
                            className="form-control"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Address</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.address}
                            onChange={(e) =>
                              setFormData({ ...formData, address: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">City</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.city}
                            onChange={(e) =>
                              setFormData({ ...formData, city: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">State</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.state}
                            onChange={(e) =>
                              setFormData({ ...formData, state: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Country</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.country}
                            onChange={(e) =>
                              setFormData({ ...formData, country: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Pincode</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.pincode}
                            onChange={(e) =>
                              setFormData({ ...formData, pincode: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Blood Group</label>
                          <select
                            className="form-select"
                            value={formData.bloodType}
                            onChange={(e) =>
                              setFormData({ ...formData, bloodType: e.target.value })
                            }
                            required
                          >
                            <option value="">Select Blood Group</option>
                            {bloodGroup.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
               
                          {/* <CommonSelect
                            className="select"
                            options={bloodGroup}
                          /> */}
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Gender</label>
                          <select
                            className="form-select"
                            value={formData.sex}
                            onChange={(e) =>
                              setFormData({ ...formData, sex: e.target.value })
                            }
                            required
                          >
                            <option value="">Select Gender</option>
                            {gender.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                       
                          {/* <CommonSelect
                            className="select"
                            options={gender}
                          /> */}
                        </div>
                      </div>
                  
                      {/* <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">First Name</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Last Name</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Role</label>
                          <CommonSelect
                            className="select"
                            options={staffrole}
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Department</label>
                          <CommonSelect
                            className="select"
                            options={staffDepartment}
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Designation</label>
                          <CommonSelect
                            className="select"
                            options={staffrole}
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Marital Status</label>
                          <CommonSelect
                            className="select"
                            options={Marital}
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Father's Name</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Mother's Name</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Date of Birth</label>
                          <div className="input-icon position-relative">
                            <DatePicker
                              className="form-control datetimepicker"
                              format={{
                                format: "DD-MM-YYYY",
                                type: "mask",
                              }}
                              placeholder="Select Date"
                            />
                            <span className="input-icon-addon">
                              <i className="ti ti-calendar" />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Date of Joining</label>
                          <div className="input-icon position-relative">
                            <span className="input-icon-addon">
                              <i className="ti ti-calendar" />
                            </span>
                            <DatePicker
                              className="form-control datetimepicker"
                              format={{
                                format: "DD-MM-YYYY",
                                type: "mask",
                              }}
                              placeholder="Select Date"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Language Known</label>
                          <TagsInput
                            value={owner}
                            onChange={setOwner}
                          />
                        </div>
                      </div>
                      <div className="col-xxl-4 col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Qualification</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-xxl-4 col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Work Experience</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-xxl-4 col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Note</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-xxl-6 col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Permanent Address</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* Commented out unnecessary sections */}
                {/* <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-user-shield fs-16" />
                      </span>
                      <h4 className="text-dark">Payroll</h4>
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">EPF No</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Basic Salary</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Contract Type</label>
                          <CommonSelect
                            className="select"
                            options={Contract}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Work Shift</label>
                          <CommonSelect className="select" options={Shift} />
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Work Location</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-users fs-16" />
                      </span>
                      <h4 className="text-dark">Leaves</h4>
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Medical Leaves</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Casual Leaves</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Maternity Leaves</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Sick Leaves</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-users fs-16" />
                      </span>
                      <h4 className="text-map">Bank Account Detail</h4>
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Account Name</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Account Number</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Bank Name</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">IFSC Code</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Branch Name</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header bg-light d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-bus-stop fs-16" />
                      </span>
                      <h4 className="text-dark">Transport Information</h4>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                      />
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Route</label>
                          <CommonSelect className="select" options={route} />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Vehicle Number</label>
                          <CommonSelect
                            className="select"
                            options={VehicleNumber}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Pickup Point</label>
                          <CommonSelect
                            className="select"
                            options={PickupPoint}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header bg-light d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-building-fortress fs-16" />
                      </span>
                      <h4 className="text-dark">Hostel Information</h4>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                      />
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Hostel</label>
                          <CommonSelect className="select" options={Hostel} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Room No</label>
                          <CommonSelect className="select" options={roomno} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-building fs-16" />
                      </span>
                      <h4 className="text-dark">Social Media Links</h4>
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Facebook URL</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Twitter URL</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Linkediin URL</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Instagram URL</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-file fs-16" />
                      </span>
                      <h4 className="text-dark">Documents</h4>
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-2">
                          <div className="mb-3">
                            <label className="form-label">Upload Resume</label>
                            <p>Upload image size of 4MB, Accepted Format PDF</p>
                          </div>
                          <div className="d-flex align-items-center flex-wrap">
                            <div className="btn btn-primary drag-upload-btn mb-2 me-2">
                              <i className="ti ti-file-upload me-1" />
                              Change
                              <input
                                type="file"
                                className="form-control image_sign"
                                multiple
                              />
                            </div>
                            <p className="mb-2">Resume.pdf</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-2">
                          <div className="mb-3">
                            <label className="form-label">Upload Joining Letter</label>
                            <p>Upload image size of 4MB, Accepted Format PDF</p>
                          </div>
                          <div className="d-flex align-items-center flex-wrap">
                            <div className="btn btn-primary drag-upload-btn mb-2">
                              <i className="ti ti-file-upload me-1" />
                              Upload Document
                              <input
                                type="file"
                                className="form-control image_sign"
                                multiple
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-file fs-16" />
                      </span>
                      <h4 className="text-dark">Password</h4>
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">New Password</label>
                          <input type="password" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Confirm Password</label>
                          <input type="password" className="form-control" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="text-end">
                  <button type="button" className="btn btn-light me-3">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isLoading ?"Adding..":"Add Staff"} 
                  </button>
                  {/* Commented out Link replaced with submit button */}
                  {/* <Link to={routes.staff} className="btn btn-primary">
                    Add Staff
                  </Link> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;