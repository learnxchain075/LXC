import React, { useEffect, useRef, useState } from "react";
import { Table } from "antd";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import {
  activeList,
  classSection,
  classSylabus,
} from "../../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../../core/common/commonSelect";
import { Link } from "react-router-dom";
import TooltipOption from "../../../../core/common/tooltipOption";
import { all_routes } from "../../../../router/all_routes";
import { createClass, getClassByschoolId } from "../../../../services/teacher/classServices";
import type { Iclassform } from "../../../../services/types/teacher/classService";
import { useAppSelector } from "../../../../Store/hooks";
import { toast, ToastContainer } from "react-toastify";

const Classes = () => {
  const routes = all_routes;
  const [classData, setClassData] = useState<Iclassform[]>([]);
  const userObj = useAppSelector((state) => state.auth.userObj);
  const role = userObj?.role;
  const [formData, setFormData] = useState({
    name: "",
    capacity: 0,
    schoolId: localStorage.getItem("schoolId") || "",
    roomNumber: "",
    section: "",
  });
  const [loading, setLoading] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClass(formData);
      toast.success("Class created successfully");
      setFormData({
        name: "",
        capacity: 0,
        schoolId: localStorage.getItem("schoolId") || "",
        roomNumber: "",
        section: "",
      });
      setLoading(true);
      const res = await getClassByschoolId(localStorage.getItem("schoolId") ?? "");
      setClassData(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      console.error("Error creating class:", error);
      toast.error("Error creating class");
      setClassData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const res = await getClassByschoolId(localStorage.getItem("schoolId") ?? "");
        setClassData(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (error) {
        toast.error("Error fetching classes");
        setClassData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const dropdownMenuRef = useRef(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const columns = [
    {
      title: "Class",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Section",
      dataIndex: "Section",
      render: (sections) => (Array.isArray(sections) ? sections.map((sec) => sec.name).join(", ") : "None"),
      sorter: (a, b) => {
        const aSections = Array.isArray(a.Section) ? a.Section.map((sec) => sec.name).join(", ") : "";
        const bSections = Array.isArray(b.Section) ? b.Section.map((sec) => sec.name).join(", ") : "";
        return aSections.length - bSections.length;
      },
    },
    {
      title: "Room Number",
      dataIndex: "roomNumber",
      sorter: (a, b) => a.roomNumber.localeCompare(b.roomNumber),
    },
  ];

  if (role === "admin" || role === "teacher") {
    columns.push(
      {
        title: "No of Students",
        dataIndex: "capacity",
        sorter: (a, b) => a.capacity - b.capacity,
      },
      {
        title: "Action",
        dataIndex: "action",
        render: () => (
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
                    data-bs-toggle="modal"
                    data-bs-target="#edit_class"
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
                  >
                    <i className="ti ti-trash-x me-2" />
                    Delete
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        ),
      }
    );
  }

  return (
    <div>
      <div className="page-wrapper">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Classes List</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Classes</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    All Classes
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              {(role === "admin" || role === "teacher") && (
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#add_class"
                  >
                    <i className="ti ti-square-rounded-plus-filled me-2" />
                    Add Class
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Classes List</h4>
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
                      <div className="p-3 border-bottom pb-0">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Class</label>
                              <CommonSelect
                                className="select"
                                options={classSylabus}
                                defaultValue={classSylabus[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Section</label>
                              <CommonSelect
                                className="select"
                                options={classSection}
                                defaultValue={classSection[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Status</label>
                              <CommonSelect
                                className="select"
                                options={activeList}
                                defaultValue={activeList[0]}
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
              {loading ? (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Class</th>
                        <th>Section</th>
                        <th>Room Number</th>
                        {(role === "admin" || role === "teacher") && <th>No of Students</th>}
                        {(role === "admin" || role === "teacher") && <th>Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, index) => (
                        <tr key={index}>
                          <td><div className="placeholder placeholder-glow w-100"><span className="placeholder col-6"></span></div></td>
                          <td><div className="placeholder placeholder-glow w-100"><span className="placeholder col-6"></span></div></td>
                          <td><div className="placeholder placeholder-glow w-100"><span className="placeholder col-6"></span></div></td>
                          {(role === "admin" || role === "teacher") && (
                            <td><div className="placeholder placeholder-glow w-100"><span className="placeholder col-6"></span></div></td>
                          )}
                          {(role === "admin" || role === "teacher") && (
                            <td><div className="placeholder placeholder-glow w-100"><span className="placeholder col-4"></span></div></td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : classData.length === 0 ? (
                <div className="text-center">No classes found.</div>
              ) : (
                <Table columns={columns} dataSource={classData} rowKey="id" />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="add_class">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Class</h4>
              <button
                type="button"
                className="WebkitAppearance: none;"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Class Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">No of Students</label>
                  <input
                    type="number"
                    className="form-control"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Room Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                  Add Class
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal fade" id="edit_class">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Class</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Class Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Class Name"
                    defaultValue="I"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Section</label>
                  <CommonSelect
                    className="select"
                    options={classSection}
                    defaultValue={classSection[0]}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">No of Students</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter no of Students"
                    defaultValue={30}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Room Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Room Number"
                    defaultValue="101"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <Link to="#" className="btn btn-primary" data-bs-dismiss="modal">
                  Save Changes
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form>
              <div className="modal-body text-center">
                <span className="delete-icon">
                  <i className="ti ti-trash-x" />
                </span>
                <h4>Confirm Deletion</h4>
                <p>
                  You want to delete all the marked items, this can't be undone
                  once you delete.
                </p>
                <div className="d-flex justify-content-center">
                  <Link
                    to="#"
                    className="btn btn-light me-3"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link to="#" className="btn btn-danger" data-bs-dismiss="modal">
                    Yes, Delete
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classes;