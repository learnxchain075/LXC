import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllStaff, deleteStaff, getStaffById, updateStaff } from "../../../../../services/admin/staffRegister";
import { IStaffBase } from "../../../../../services/types/admin/staffServices";
import { toast, ToastContainer } from "react-toastify";
import {
  departmentName,
  designationName,
  morefilterStaff,
  staffName,
} from "../../../../../core/common/selectoption/selectoption";
import ImageWithBasePath from "../../../../../core/common/imageWithBasePath";
import { TableData } from "../../../../../core/data/interface";
import PredefinedDateRanges from "../../../../../core/common/datePicker";
import CommonSelect from "../../../../../core/common/commonSelect";
import { all_routes } from "../../../../../router/all_routes";
import TooltipOption from "../../../../../core/common/tooltipOption";

const Staff = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [staffList, setStaffList] = useState<IStaffBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<IStaffBase | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<IStaffBase | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await getAllStaff();
      setStaffList(res.data.staff || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to load staff");
      setLoading(false);
    }
  };

  const handleView = async (id: string) => {
    try {
      const res = await getStaffById(id);
      setSelectedStaff(res.data);
      setShowDetailsModal(true);
    } catch (err) {
      toast.error("Failed to fetch staff details");
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await getStaffById(id);
      setEditForm(res.data);
      setShowEditModal(true);
    } catch (err) {
      toast.error("Failed to fetch staff details");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStaff(id);
      toast.success("Staff deleted successfully");
      fetchStaff();
    } catch (err) {
      toast.error("Failed to delete staff");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    try {
      await updateStaff(editForm.id, editForm);
      toast.success("Staff updated successfully");
      setShowEditModal(false);
      fetchStaff();
    } catch (err) {
      toast.error("Failed to update staff");
    }
  };

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text: string, record: any) => (
        <Link to="#" onClick={() => handleView(record.id)} className="link-primary">
          {record.id}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) => a.id.length - b.id.length,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center" onClick={() => handleView(record.id)}>
          <Link to="#" className="avatar avatar-md">
            <ImageWithBasePath
              src={record.img}
              className="img-fluid rounded-circle"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to="#">{text}</Link>
            </p>
          </div>
        </div>
      ),
      sorter: (a: TableData, b: TableData) => a.name.length - b.name.length,
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: (a: TableData, b: TableData) => a.department.length - b.department.length,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      sorter: (a: TableData, b: TableData) => a.designation.length - b.designation.length,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a: TableData, b: TableData) => a.phone.length - b.phone.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a: TableData, b: TableData) => a.email.length - b.email.length,
    },
    {
      title: "Date of Join",
      dataIndex: "dateOfJoin",
      sorter: (a: TableData, b: TableData) => a.dateOfJoin.length - b.dateOfJoin.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
        <div className="d-flex align-items-center">
          <div className="dropdown">
            <Link
              to="#"
              className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="ti ti-dots-vertical fs-14" />
            </Link>
            <ul className="dropdown-menu dropdown-menu-right p-3">
              <li>
                <Link
                  className="dropdown-item rounded-1"
                  to="#"
                  onClick={() => handleView(record.id)}
                >
                  <i className="ti ti-menu me-2" />
                  View Staff
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item rounded-1"
                  to="#"
                  onClick={() => handleEdit(record.id)}
                >
                  <i className="ti ti-edit-circle me-2" />
                  Edit
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item rounded-1"
                  to="#"
                  onClick={() => handleDelete(record.id)}
                >
                  <i className="ti ti-trash-x me-2" />
                  Delete
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Staffs</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">HRM</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Staffs
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              <div className="mb-2">
                <Link
                  to={routes.addStaff}
                  className="btn btn-primary d-flex align-items-center"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Staff
                </Link>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Staff List</h4>
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
                  <div className="dropdown-menu drop-width" ref={dropdownMenuRef}>
                    <form>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 border-bottom">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <CommonSelect
                                className="select"
                                options={staffName}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Department</label>
                              <CommonSelect
                                className="select"
                                options={departmentName}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-0">
                              <label className="form-label">Designation</label>
                              <CommonSelect
                                className="select"
                                options={designationName}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-0">
                              <label className="form-label">More Filter</label>
                              <CommonSelect
                                className="select"
                                options={morefilterStaff}
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
                    Sort by A-Z
                  </Link>
                  <ul className="dropdown-menu p-3">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1 active">
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
              <ToastContainer position="top-center" autoClose={3000} />
              {loading ? (
                <div className="skeleton-loader" style={{ height: 300 }} />
              ) : error ? (
                <div className="text-danger text-center py-4">{error}</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center">
                            No staff found
                          </td>
                        </tr>
                      ) : (
                        staffList.map((staff) => (
                          <tr key={staff.email} onClick={() => handleView(staff.id)}>
                            <td>{staff.name}</td>
                            <td>{staff.email}</td>
                            <td>{staff.phone}</td>
                            <td>{staff.address}</td>
                            <td>
                              <Link
                                to="#"
                                className="btn btn-sm btn-info me-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleView(staff.id);
                                }}
                              >
                                View
                              </Link>
                              <Link
                                to="#"
                                className="btn btn-sm btn-warning me-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(staff.id);
                                }}
                              >
                                Edit
                              </Link>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(staff.id);
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showDetailsModal && selectedStaff && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Staff Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)} />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 text-center mb-3">
                    <img
                      src={
                        selectedStaff.profilePic
                          ? typeof selectedStaff.profilePic === 'string'
                            ? selectedStaff.profilePic
                            : URL.createObjectURL(selectedStaff.profilePic)
                          : '/public/assets/img/users/default.png'
                      }
                      alt="Profile"
                      className="img-fluid rounded-circle mb-2"
                      style={{ width: 120, height: 120, objectFit: 'cover' }}
                    />
                    <h5 className="mt-2">{selectedStaff.name}</h5>
                    <div className="text-muted">{selectedStaff.email}</div>
                    <div>{selectedStaff.phone}</div>
                  </div>
                  <div className="col-md-8">
                    <div className="row g-2">
                      <div className="col-6"><strong>Address:</strong> {selectedStaff.address}</div>
                      <div className="col-6"><strong>City:</strong> {selectedStaff.city}</div>
                      <div className="col-6"><strong>State:</strong> {selectedStaff.state}</div>
                      <div className="col-6"><strong>Country:</strong> {selectedStaff.country}</div>
                      <div className="col-6"><strong>Pincode:</strong> {selectedStaff.pincode}</div>
                      <div className="col-6"><strong>Blood Type:</strong> {selectedStaff.bloodType || '-'}</div>
                      <div className="col-6"><strong>Sex:</strong> {selectedStaff.sex || '-'}</div>
                      <div className="col-6"><strong>School ID:</strong> {selectedStaff.schoolId}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditModal && editForm && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Staff</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} />
              </div>
              <form onSubmit={handleEditSubmit} className="modal-body row g-3">
                <div className="col-md-4 text-center">
                  <img
                    src={
                      editForm.profilePic
                        ? typeof editForm.profilePic === 'string'
                          ? editForm.profilePic
                          : URL.createObjectURL(editForm.profilePic)
                        : '/public/assets/img/users/default.png'
                    }
                    alt="Profile"
                    className="img-fluid rounded-circle mb-2"
                    style={{ width: 120, height: 120, objectFit: 'cover' }}
                  />
                  <input
                    type="file"
                    className="form-control mt-2"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setEditForm({ ...editForm, profilePic: e.target.files[0] });
                      }
                    }}
                  />
                </div>
                <div className="col-md-8 row g-2">
                  <div className="col-6">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={editForm.city}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={editForm.state}
                      onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      name="country"
                      value={editForm.country}
                      onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      className="form-control"
                      name="pincode"
                      value={editForm.pincode}
                      onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Blood Type</label>
                    <select
                      className="form-select"
                      name="bloodType"
                      value={editForm.bloodType || ''}
                      onChange={(e) => setEditForm({ ...editForm, bloodType: e.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="O+">O+</option>
                      <option value="AB+">AB+</option>
                      <option value="A-">A-</option>
                      <option value="B-">B-</option>
                      <option value="O-">O-</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label">Sex</label>
                    <select
                      className="form-select"
                      name="sex"
                      value={editForm.sex || ''}
                      onChange={(e) => setEditForm({ ...editForm, sex: e.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHERS">Others</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">School ID</label>
                    <input
                      type="text"
                      className="form-control"
                      name="schoolId"
                      value={editForm.schoolId}
                      onChange={(e) => setEditForm({ ...editForm, schoolId: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="col-12 text-end mt-3">
                  <button type="button" className="btn btn-light me-2" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
