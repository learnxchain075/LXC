import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TableData } from "../../../../core/data/interface";
import Table from "../../../../core/common/dataTable/index";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import CommonSelect from "../../../../core/common/commonSelect";
import { activeList, holidays } from "../../../../core/common/selectoption/selectoption";
import { all_routes } from "../../../../router/all_routes";
import TooltipOption from "../../../../core/common/tooltipOption";
import { toast } from "react-toastify";
import {
  getDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  
} from "../../../../services/admin/designationApi" ; // Adjusted import path
import { IDesignationForm } from "../../../../services/types/admin/hrm/designationService";

interface DesignationData extends TableData {
  id: string;
  designation: string;
  status: string;
}

interface IDesignationFormExtended extends IDesignationForm {
  id?: string;
  status?: boolean;
}

const Designation = () => {
  const routes = all_routes;
  const [designations, setDesignations] = useState<DesignationData[]>([]);
  const [formData, setFormData] = useState<IDesignationFormExtended>({
    name: "",
    description: "",
    schoolId: localStorage.getItem("schoolId") || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  // Fetch designations on mount
  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    try {
      setIsLoading(true);
      const schoolId = localStorage.getItem("schoolId");
      if (!schoolId) {
        toast.error("School ID not found");
        return;
      }
      const response = await getDesignations(schoolId);
      // Map the API response to only required fields
      const data = (response.data || []).map((item: any) => ({
        name: item.name,
        description: item.description || '-',
        status: item.status ? "Active" : "Inactive",
        users: (item.users || []).map((u: any) => u.name).join(", ") || '-',
      }));
      setDesignations(data);
    } catch (error) {
      console.error("Error fetching designations:", error);
      toast.error("Failed to fetch designations");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle status toggle
  const handleStatusToggle = () => {
    setFormData((prev) => ({ ...prev, status: !prev.status }));
  };

  // Handle form submission (Add/Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const schoolId = localStorage.getItem("schoolId");
      if (!schoolId) {
        toast.error("School ID not found");
        return;
      }

      const payload: IDesignationFormExtended = {
        name: formData.name,
        description: formData.description,
        schoolId,
        status: formData.status ?? false, // Default to false if undefined
      };

      if (editMode && formData.id) {
        await updateDesignation(formData.id, payload);
        toast.success("Designation updated successfully");
      } else {
        await createDesignation(schoolId, payload);
        toast.success("Designation added successfully");
      }

      // Refresh designations
      await fetchDesignations();

      // Reset form and close modal
      resetForm();
      const closeButton = document.querySelector(
        '[data-bs-dismiss="modal"]'
      ) as HTMLElement;
      closeButton?.click();
    } catch (error) {
      console.error("Error saving designation:", error);
      toast.error(`Failed to ${editMode ? "update" : "add"} designation`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit button click
  const handleEdit = (record: DesignationData) => {
    setEditMode(true);
    setFormData({
      id: record.id,
      name: record.designation,
      description: "", // Adjust if API provides description
      schoolId: localStorage.getItem("schoolId") || "",
      status: record.status === "Active", // Set status based on API data
    });
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      if (formData.id) {
        await deleteDesignation(formData.id);
        toast.success("Designation deleted successfully");
        await fetchDesignations();
        const closeButton = document.querySelector(
          '[data-bs-dismiss="modal"]'
        ) as HTMLElement;
        closeButton?.click();
      }
    } catch (error) {
      console.error("Error deleting designation:", error);
      toast.error("Failed to delete designation");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      schoolId: localStorage.getItem("schoolId") || "",
    });
    setEditMode(false);
  };

  // Table columns
  const columns = [
    {
      title: "Designation",
      dataIndex: "name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: (a: any, b: any) => a.description.localeCompare(b.description),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <span className={`badge badge-soft-${text === "Active" ? "success" : "danger"} d-inline-flex align-items-center`}>
          <i className="ti ti-circle-filled fs-5 me-1"></i>
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
    },
    {
      title: "Assigned Users",
      dataIndex: "users",
      render: (text: string) => <span>{text}</span>,
      sorter: (a: any, b: any) => a.users.localeCompare(b.users),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: DesignationData) => (
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
                data-bs-toggle="modal"
                data-bs-target="#edit_designation"
                onClick={() => handleEdit(record)}
              >
                <i className="ti ti-edit-circle me-2" />
                Edit
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item rounded-1"
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#delete-modal"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, id: record.id }))
                }
              >
                <i className="ti ti-trash-x me-2" />
                Delete
              </Link>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  // Handle filter apply
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Designation</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">HRM</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Designation
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              <div className="mb-2">
                <Link
                  to="#"
                  className="btn btn-primary d-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#add_designation"
                  onClick={() => resetForm()}
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Designation
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Designations List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Designation</h4>
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
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Designation Name</label>
                              <CommonSelect
                                className="select"
                                options={activeList}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-0">
                              <label className="form-label">Status</label>
                              <CommonSelect
                                className="select"
                                options={holidays}
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
              {/* Designation List */}
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <Table
                  columns={columns}
                  dataSource={designations}
                  Selection={true}
                />
              )}
              {/* /Designation List */}
            </div>
          </div>
          {/* /Designations List */}
        </div>
      </div>
      {/* /Page Wrapper */}

      {/* Add Designation */}
      <div className="modal fade" id="add_designation">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Designation</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Designation</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="status-title">
                      <h5>Status</h5>
                      <p>Change the Status by toggle</p>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="switch-sm"
                        checked={formData.status ?? false}
                        onChange={handleStatusToggle}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                      ></span>
                      Adding...
                    </>
                  ) : (
                    "Add Designation"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Designation */}

      {/* Edit Designation */}
      <div className="modal fade" id="edit_designation">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Designation</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Designation</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="status-title">
                      <h5>Status</h5>
                      <p>Change the Status by toggle</p>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="switch-sm2"
                        checked={formData.status ?? false}
                        onChange={handleStatusToggle}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                      ></span>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Edit Designation */}

      {/* Delete Modal */}
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <span className="delete-icon">
                <i className="ti ti-trash-x" />
              </span>
              <h4>Confirm Deletion</h4>
              <p>
                You want to delete this designation. This action cannot be undone.
              </p>
              <div className="d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-light me-3"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                      ></span>
                      Deleting...
                    </>
                  ) : (
                    "Yes, Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Modal */}
    </div>
  );
};

export default Designation;