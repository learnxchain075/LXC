import React, { useState, useEffect } from "react";
import {
  bloodGroup,
  Contract,
  gender,
  Hostel,
  Marital,
  PickupPoint,
  roomno,
  route,
  Shift,
  staffDepartment,
  staffrole,
  VehicleNumber,
} from "../../../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../../../core/common/commonSelect";
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../../../../router/all_routes";
import { DatePicker } from "antd";
import { TagsInput } from "react-tag-input-component";
import { getStaffById, updateStaff } from "../../../../../services/admin/staffRegister";
import { IStaffBase } from "../../../../../services/types/admin/staffServices";
import { toast, ToastContainer } from "react-toastify";

const EditStaff = () => {
  const routes = all_routes;
  const [owner, setOwner] = useState<string[]>([]);
  const [formData, setFormData] = useState<IStaffBase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id: staffId } = useParams<{ id: string }>();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const res = await getStaffById(staffId);
      setFormData(res.data.staff);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load staff");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsLoading(true);
    try {
      await updateStaff(staffId, formData);
      toast.success("Staff updated successfully");
      setIsLoading(false);
    } catch (err) {
      toast.error("Failed to update staff");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content content-two">
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="mb-1">Edit Staff</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">HRM</li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Edit Staff
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-md-12">
                {isLoading && <div className="skeleton-loader" style={{ height: 300 }} />}
                {error && <div className="text-danger text-center py-4">{error}</div>}
                <form >
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
                      <div className="add-section">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="d-flex align-items-center flex-wrap row-gap-3 mb-3">
                              <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                                <i className="ti ti-photo-plus fs-16" />
                              </div>
                              <div className="profile-upload">
                                <div className="profile-uploader d-flex align-items-center">
                                  <div className="drag-upload-btn mb-3">
                                    Upload
                                    <input
                                      type="file"
                                      className="form-control image-sign"
                                      multiple
                                    />
                                  </div>
                                  <Link to="#" className="btn btn-primary mb-3">
                                    Remove
                                  </Link>
                                </div>
                                <p className="fs-12">
                                  Upload image size 4MB, Format JPG, PNG, SVG
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row row-cols-xxl-5 row-cols-md-6">
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">First Name</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="Kevin"
                              />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Last Name</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="Larry"
                              />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Role</label>

                              <CommonSelect
                                className="select"
                                options={staffrole}
                                defaultValue={staffrole[0]}
                              />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Department</label>
                              <CommonSelect
                                className="select"
                                options={staffDepartment}
                                defaultValue={staffDepartment[0]}
                              />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Designation</label>
                              <CommonSelect
                                className="select"
                                options={staffrole}
                                defaultValue={staffrole[0]}
                              />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Gender</label>
                              <CommonSelect
                                className="select"
                                options={gender}
                                defaultValue={gender[1]}
                              />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Primary Contact Number
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="+1 63423 72397"
                              />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Email Address
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                defaultValue="kevin@example.com"
                              />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Blood Group</label>
                              <CommonSelect
                                className="select"
                                options={bloodGroup}
                                defaultValue={bloodGroup[0]}
                              />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Marital Status
                              </label>
                              <CommonSelect
                                className="select"
                                options={Marital}
                                defaultValue={Marital[0]}
                              />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Father's Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="Janet"
                              />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Mother's Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="Daniel"
                              />
                            </div>
                          </div>
                          <div className="col-xxl col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Date of Birth
                              </label>
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
                              <label className="form-label">
                                Date of Joining
                              </label>
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
                              <label className="form-label">
                                Language Known
                              </label>
                              <TagsInput
                            
                            value={owner}
                            onChange={setOwner}
                          />
                            </div>
                          </div>
                          <div className="col-xxl-4 col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Qualification
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="M.Sc"
                              />
                            </div>
                          </div>
                          <div className="col-xxl-4 col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Work Experience
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={5}
                              />
                            </div>
                          </div>
                          <div className="col-xxl-4  col-xl-3 col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Note</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="Description"
                              />
                            </div>
                          </div>
                          <div className="col-xxl-6 col-xl-3  col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Address</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="3495 Red Hawk Road, Buffalo Lake, MN 55314"
                              />
                            </div>
                          </div>
                          <div className="col-xxl-6 col-xl-3  col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Permanent Address
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="3495 Red Hawk Road, Buffalo Lake, MN 55314"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Personal Information */}
                  {/* Payroll */}
                  <div className="card ">
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
                              defaultValue={Contract[0]}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Work Shift</label>
                            <CommonSelect
                              className="select"
                              options={Shift}
                              defaultValue={Shift[0]}
                            />
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
                  {/* /Payroll */}
                  {/* Leaves */}
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
                            <label className="form-label">
                              Maternity Leaves
                            </label>
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
                  {/* /Leaves */}
                  {/* Bank Details */}
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
                            <input
                              type="text"
                              className="form-control"
                              defaultValue="Kevin"
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Account Number</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={178849035684}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Bank Name</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue="Bank of America"
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">IFSC Code</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue="BOA83209832"
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Branch Name</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue="Cincinnati"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Bank Details */}
                  {/* Transport Information */}
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

                            <CommonSelect
                              className="select"
                              options={route}
                              defaultValue={route[0]}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Vehicle Number</label>
                            <CommonSelect
                              className="select"
                              options={VehicleNumber}
                              defaultValue={VehicleNumber[0]}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Pickup Point</label>
                            <CommonSelect
                              className="select"
                              options={PickupPoint}
                              defaultValue={PickupPoint[0]}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Transport Information */}
                  {/* Hostel Information */}
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
                            <CommonSelect
                              className="select"
                              options={Hostel}
                              defaultValue={Hostel[0]}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Room No</label>
                            <CommonSelect
                              className="select"
                              options={roomno}
                              defaultValue={roomno[0]}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Hostel Information */}
                  {/* Social Media Links */}
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
                  {/* /Social Media Links */}
                  {/* Documents */}
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
                              <label className="form-label">
                                Upload Resume
                              </label>
                              <p>
                                Upload image size of 4MB, Accepted Format PDF
                              </p>
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
                              <label className="form-label">
                                Upload Joining Letter
                              </label>
                              <p>
                                Upload image size of 4MB, Accepted Format PDF
                              </p>
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
                  {/* /Documents */}
                  {/* Password */}
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
                            <label className="form-label">
                              Confirm Password
                            </label>
                            <input type="password" className="form-control" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Password */}
                  <div className="text-end">
                    <button type="button" className="btn btn-light me-3">
                      Cancel
                    </button>
                    <Link to={routes.staff} className="btn btn-primary">
                      Save Changes
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}
      </>
    </div>
  );
};

export default EditStaff;
