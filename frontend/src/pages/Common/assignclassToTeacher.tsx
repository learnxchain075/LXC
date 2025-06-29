import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useMobileDetection from "../../core/common/mobileDetection";
import { useSelector } from "react-redux";
import { Table } from "antd";
import PredefinedDateRanges from "../../core/common/datePicker";
import TooltipOption from "../../core/common/tooltipOption";
import {
  getClassByschoolId,
  getTeacherAssignmentsBySchoolId,
  postassignTeacherToaClass,
  updateTeacherAssignment,
  deleteTeacherAssignment,
} from "../../services/teacher/classServices";
import { getTeacherByschoolId } from "../../services/admin/teacherRegistartion";
import { closeModal } from "./modalclose";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import LoadingSkeleton from "../../components/LoadingSkeleton";

interface IClass {
  id: string;
  name: string;
  section?: string;
}

interface ITeacher {
  id: string;
  name: string;
}

const AssignTeacherToClass = () => {
  const routes = all_routes;
  const userObj = useSelector((state: any) => state.auth.userObj);
  const isMobile = useMobileDetection();
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const [classes, setClasses] = useState<IClass[]>([]);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const schoolId = localStorage.getItem("schoolId") ?? "";
        const classResponse = await getClassByschoolId(schoolId);
      //  console.log("classes", classResponse.data);
        const classData = Array.isArray(classResponse.data.data)
          ? classResponse.data.data
          : [];
        setClasses(classData);
        const teacherResponse = await getTeacherByschoolId(schoolId);
        const teacherData = Array.isArray(teacherResponse.data)
          ? teacherResponse.data.map((teacher: any) => ({
              id: teacher.id,
              name: teacher.user?.name || "Unknown",
            }))
          : [];
        setTeachers(teacherData);
        const assignmentResponse = await getTeacherAssignmentsBySchoolId(schoolId);
       // console.log("assignments", assignmentResponse.data);
        const assignmentData = Array.isArray(assignmentResponse.data.classes)
          ? assignmentResponse.data.classes
          : [];
        setAssignments(assignmentData);
        setLoadingData(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data", { autoClose: 3000 });
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // Handle assignment submission
  const handleAssign = async () => {
    if (!selectedClassId || !selectedTeacherId) {
      toast.error("Please select both a class and a teacher", { autoClose: 3000 });
      return;
    }

    setIsLoading(true);
    try {
      await postassignTeacherToaClass({
        classId: selectedClassId,
        teacherId: selectedTeacherId,
      });
      toast.success("Teacher assigned to class successfully", { autoClose: 3000 });

      // Refresh assignments
      const schoolId = localStorage.getItem("schoolId") ?? "";
      const assignmentResponse = await getTeacherAssignmentsBySchoolId(schoolId);
      const assignmentData = Array.isArray(assignmentResponse.data.classes)
        ? assignmentResponse.data.classes
        : [];
      setAssignments(assignmentData);

      // Reset selections
      closeModal("assign_teacher");
      setSelectedClassId("");
      setSelectedTeacherId("");
    } catch (error) {
      console.error("Error assigning teacher:", error);
      toast.error("Failed to assign teacher", { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const handleEdit = (assignment: any) => {
    setSelectedAssignment(assignment);
    setEditModalOpen(true);
    setModalError(null);
  };

  const handleDelete = (assignment: any) => {
    setSelectedAssignment(assignment);
    setDeleteModalOpen(true);
    setModalError(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await updateTeacherAssignment(selectedAssignment.id, {
        classId: selectedAssignment.classId,
        teacherId: selectedAssignment.teacherId,
        status: selectedAssignment.status,
      });
      toast.success("Assignment updated successfully");
      setEditModalOpen(false);
      // Refresh assignments
      const schoolId = localStorage.getItem("schoolId") ?? "";
      const assignmentResponse = await getTeacherAssignmentsBySchoolId(schoolId);
      const assignmentData = Array.isArray(assignmentResponse.data.classes)
        ? assignmentResponse.data.classes
        : [];
      setAssignments(assignmentData);
    } catch (err: any) {
      setModalError("Failed to update assignment");
    } finally {
      setModalLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedAssignment) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await deleteTeacherAssignment(selectedAssignment.id);
      toast.success("Assignment deleted successfully");
      setDeleteModalOpen(false);
      // Refresh assignments
      const schoolId = localStorage.getItem("schoolId") ?? "";
      const assignmentResponse = await getTeacherAssignmentsBySchoolId(schoolId);
      const assignmentData = Array.isArray(assignmentResponse.data.classes)
        ? assignmentResponse.data.classes
        : [];
      setAssignments(assignmentData);
    } catch (err: any) {
      setModalError("Failed to delete assignment");
    } finally {
      setModalLoading(false);
    }
  };

  const columns = [
    {
      title: "Class Name",
      dataIndex: "name",
      render: (text: string, record: any) => record.name || "N/A",
      sorter: (a: any, b: any) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Teacher Name",
      dataIndex: "Teacher",
      render: (_: any, record: any) => record.Teacher && record.Teacher[0] && record.Teacher[0].user?.name ? record.Teacher[0].user.name : "N/A",
      sorter: (a: any, b: any) => {
        const nameA = a.Teacher && a.Teacher[0] && a.Teacher[0].user?.name ? a.Teacher[0].user.name.toLowerCase() : "";
        const nameB = b.Teacher && b.Teacher[0] && b.Teacher[0].user?.name ? b.Teacher[0].user.name.toLowerCase() : "";
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Status",
      dataIndex: "Teacher",
      render: (_: any, record: any) => {
        const status = record.Teacher && record.Teacher[0] ? record.Teacher[0].status : "N/A";
        return status === "Active" ? (
          <span className="badge badge-soft-success d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            {status}
          </span>
        ) : (
          <span className="badge badge-soft-danger d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            {status}
          </span>
        );
      },
      sorter: (a: any, b: any) => {
        const statusA = a.Teacher && a.Teacher[0] ? a.Teacher[0].status : "";
        const statusB = b.Teacher && b.Teacher[0] ? b.Teacher[0].status : "";
        return (statusA || "").localeCompare(statusB || "");
      },
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
                <Link className="dropdown-item rounded-1" to="#" onClick={() => handleEdit(record)}>
                  <i className="ti ti-edit-circle me-2" />
                  Edit
                </Link>
              </li>
              <li>
                <Link className="dropdown-item rounded-1" to="#" onClick={() => handleDelete(record)}>
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

  const userRole = userObj?.role || "teacher";

  return (
    <ErrorBoundary>
      <div className={isMobile || userRole === "admin" ? "page-wrapper" : "pt-4"}>
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Teacher-Class Assignments</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Teachers</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Assign Teachers
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
                  data-bs-target="#assign_teacher"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Assign Teacher
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Assignment Form Modal */}
          <div className="modal fade" id="assign_teacher" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Assign Teacher to Class</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {loadingData ? (
                    <LoadingSkeleton lines={6} />
                  ) : (
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Class</label>
                          <select
                            className="form-select"
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                          >
                            <option value="">Select a class</option>
                            {classes.map((classItem) => (
                              <option key={classItem.id} value={classItem.id}>
                                {classItem.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Teacher</label>
                          <select
                            className="form-select"
                            value={selectedTeacherId}
                            onChange={(e) => setSelectedTeacherId(e.target.value)}
                          >
                            <option value="">Select a teacher</option>
                            {teachers.map((teacher) => (
                              <option key={teacher.id} value={teacher.id}>
                                {teacher.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className={`btn btn-primary ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleAssign}
                    disabled={isLoading}
                  >
                    {isLoading ? "Assigning..." : "Assign Teacher"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Assignments List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Teacher-Class Assignments</h4>
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
                      <div className="p-3 pb-0 border-bottom">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Class</label>
                              <select className="form-select">
                                <option value="">Select a class</option>
                                {classes.map((classItem) => (
                                  <option key={classItem.id} value={classItem.id}>
                                    {classItem.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Teacher</label>
                              <select className="form-select">
                                <option value="">Select a teacher</option>
                                {teachers.map((teacher) => (
                                  <option key={teacher.id} value={teacher.id}>
                                    {teacher.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Status</label>
                              <select className="form-select">
                                <option value="">Select Status</option>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <Link to="#" className="btn btn-light me-3">
                          Reset
                        </Link>
                        <Link to="#" className="btn btn-primary" onClick={handleApplyClick}>
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
                  >
                    <i className="ti ti-sort-ascending-2 me-1" />
                    Sort by A-Z
                  </Link>
                  <ul className="dropdown-menu">
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
                        Recently Added
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body p-0 py-3">
              {loadingData ? (
                <LoadingSkeleton lines={8} />
              ) : (
                <Table dataSource={assignments} columns={columns} rowKey="id" />
              )}
            </div>
          </div>
        </div>
      </div>
      {editModalOpen && selectedAssignment && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Assignment</h5>
                <button type="button" className="btn-close" onClick={() => setEditModalOpen(false)} />
              </div>
              <div className="modal-body">
                <ErrorBoundary>
                  {modalLoading ? (
                    <LoadingSkeleton lines={6} />
                  ) : modalError ? (
                    <div className="text-danger mb-2">{modalError}</div>
                  ) : (
                    <form onSubmit={handleEditSubmit} className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Class</label>
                        <select
                          className="form-select"
                          value={selectedAssignment.classId}
                          onChange={e => setSelectedAssignment({ ...selectedAssignment, classId: e.target.value })}
                        >
                          <option value="">Select a class</option>
                          {classes.map((classItem) => (
                            <option key={classItem.id} value={classItem.id}>
                              {classItem.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Teacher</label>
                        <select
                          className="form-select"
                          value={selectedAssignment.teacherId}
                          onChange={e => setSelectedAssignment({ ...selectedAssignment, teacherId: e.target.value })}
                        >
                          <option value="">Select a teacher</option>
                          {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                              {teacher.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          value={selectedAssignment.status}
                          onChange={e => setSelectedAssignment({ ...selectedAssignment, status: e.target.value })}
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                      </div>
                      <div className="col-12 text-end mt-3">
                        <button type="button" className="btn btn-light me-2" onClick={() => setEditModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                      </div>
                    </form>
                  )}
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>
      )}
      {deleteModalOpen && selectedAssignment && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setDeleteModalOpen(false)} />
              </div>
              <div className="modal-body">
                <ErrorBoundary>
                  {modalLoading ? (
                    <LoadingSkeleton lines={3} />
                  ) : modalError ? (
                    <div className="text-danger mb-2">{modalError}</div>
                  ) : (
                    <>
                      <p>Are you sure you want to delete this assignment?</p>
                      <div className="text-end">
                        <button type="button" className="btn btn-light me-2" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
                        <button type="button" className="btn btn-danger" onClick={confirmDelete}>Delete</button>
                      </div>
                    </>
                  )}
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default AssignTeacherToClass;
