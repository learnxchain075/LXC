import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Skeleton } from "antd";
import { useSelector } from "react-redux";
import { getClassByschoolId } from "../../services/teacher/classServices";
import { getTeacherById } from "../../services/admin/teacherRegistartion";
import { createSubject, updateSubject, deleteSubject, getSubjectByClassId } from "../../services/teacher/subjectServices";
import { Isubject } from "../../services/types/teacher/subjectService";
import PredefinedDateRanges from "../../core/common/datePicker";
import CommonSelect from "../../core/common/commonSelect";
import { all_routes } from "../../router/all_routes";
import { language } from "../../core/common/selectoption/selectoption";
import useMobileDetection from "../../core/common/mobileDetection";
import TooltipOption from "../../core/common/tooltipOption";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { closeModal } from "./modalclose";
import ErrorBoundary from "../../components/ErrorBoundary";

interface TeacherData {
  lessons?: any[];
  [key: string]: any;
}

interface ClassData {
  id: string;
  name: string;
  status: string;
  subjects?: SubjectData[];
}

interface SubjectData {
  id: string;
  name: string;
  code: string;
  type: string;
  classId: string;
  status?: string;
}

const Classesshow = ({ teacherdata }: { teacherdata?: TeacherData }) => {
  const routes = all_routes;
  const [classList, setClassList] = useState<ClassData[]>([]);
  const [subjectsList, setSubjectsList] = useState<SubjectData[]>([]);
  const isMobile = useMobileDetection();
  const obj = useSelector((state: any) => state.auth.userObj);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const [newSubject, setNewSubject] = useState<Isubject>({
    name: "",
    code: "",
    type: "Theory",
    classId: "",
  });
  const [editingSubject, setEditingSubject] = useState<SubjectData | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<SubjectData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSubjectsForClasses = async (classes: ClassData[]) => {
    try {
      const classesWithSubjects = await Promise.all(
        classes.map(async (classItem) => {
          try {
            const subjectsResponse = await getSubjectByClassId(classItem.id);
            const subjects = Array.isArray(subjectsResponse.data?.data) 
              ? subjectsResponse.data.data 
              : [];
            return { ...classItem, subjects };
          } catch (error) {
            return { ...classItem, subjects: [] };
          }
        })
      );
      setClassList(classesWithSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchDataMobile = async () => {
    setLoading(true);
    try {
      const response = await getTeacherById(localStorage.getItem("teacherId") ?? "");
      if (response.status === 200) {
        const teacherDetails = response.data;
        const lessons = Array.isArray(teacherDetails.lessons) ? teacherDetails.lessons : [];
        const sortedLessons = lessons.sort((a: any, b: any) =>
          (a.classId || "").localeCompare(b.classId || "")
        );
        const processedLessons = sortedLessons.reduce((acc: any, lesson: any, index: number) => {
          const prevLesson = sortedLessons[index - 1];
          const isFirstInClass = !prevLesson || prevLesson.classId !== lesson.classId;
          return [...acc, { ...lesson, isFirstInClass }];
        }, []);
        setClassList(processedLessons);
      } else {
        setClassList([]);
      }
    } catch (error) {
      setClassList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      if (obj.role === "admin") {
        const response = await getClassByschoolId(localStorage.getItem("schoolId") ?? "");
        const dataArr = Array.isArray(response.data?.data) ? response.data.data : [];
        await fetchSubjectsForClasses(dataArr);
      }
    } catch (error) {
      setClassList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [obj.role]);

  useEffect(() => {
    if (obj.role === "teacher" && teacherdata) {
      setLoading(true);
      const lessons = Array.isArray(teacherdata.lessons) ? teacherdata.lessons : [];
      const sortedLessons = lessons.sort((a: any, b: any) =>
        (a.classId || "").localeCompare(b.classId || "")
      );
      const processedLessons = sortedLessons.reduce((acc: any, lesson: any, index: number) => {
        const prevLesson = sortedLessons[index - 1];
        const isFirstInClass = !prevLesson || prevLesson.classId !== lesson.classId;
        return [...acc, { ...lesson, isFirstInClass }];
      }, []);
      setClassList(processedLessons);
      setLoading(false);
    } else if (obj.role === "teacher") {
      fetchDataMobile();
    }
  }, [obj.role, teacherdata]);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current && dropdownMenuRef.current.classList) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name || !newSubject.classId) {
      toast.error("Please fill in all required fields", { autoClose: 3000 });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createSubject(newSubject);
      if (response.status === 200) {
        toast.success("Subject added successfully", { autoClose: 3000 });
        await fetchClasses();
        setNewSubject({ name: "", code: "", type: "Theory", classId: "" });
        closeModal("add_subject");
      }
    } catch (error) {
      console.error("Error adding subject:", error);
      toast.error("Failed to add subject", { autoClose: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject || !editingSubject.name) {
      toast.error("Please fill in all required fields", { autoClose: 3000 });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateSubject(editingSubject.id, {
        name: editingSubject.name,
        code: editingSubject.code,
        type: editingSubject.type,
      });
      if (response.status === 200) {
        toast.success("Subject updated successfully", { autoClose: 3000 });
        await fetchClasses();
        setEditingSubject(null);
        closeModal("edit_subject");
      }
    } catch (error) {
      console.error("Error updating subject:", error);
      toast.error("Failed to update subject", { autoClose: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubject = async () => {
    if (!deletingSubject) return;

    setIsSubmitting(true);
    try {
      const response = await deleteSubject(deletingSubject.id);
      if (response.status === 200) {
        toast.success("Subject deleted successfully", { autoClose: 3000 });
        await fetchClasses();
        setDeletingSubject(null);
        closeModal("delete-modal");
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error("Failed to delete subject", { autoClose: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (subject: SubjectData) => {
    setEditingSubject(subject);
  };

  const openDeleteModal = (subject: SubjectData) => {
    setDeletingSubject(subject);
  };

  const columns: any[] = [
    {
      title: "Class",
      dataIndex: "name",
      render: (text: any, record: any) => <span>{record.name || text}</span>,
      sorter: (a: any, b: any) => (a.name?.length || 0) - (b.name?.length || 0),
    },
    {
      title: "Subjects",
      dataIndex: "subjects",
      render: (subjects: SubjectData[], record: any) => {
        if (obj.role === "teacher") {
          return record.subject?.name || "N/A";
        }
        return (
          <div>
            {subjects && subjects.length > 0 ? (
              subjects.map((subject, index) => (
                <span key={subject.id} className="badge badge-soft-primary me-1 mb-1">
                  {subject.name}
                </span>
              ))
            ) : (
              <span className="text-muted">No subjects</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: any) => (
        <span
          className={`badge badge-soft-${text === "Active" ? "success" : "danger"} d-inline-flex align-items-center`}
        >
          <i className="ti ti-circle-filled fs-5 me-1"></i>
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => (a.status?.length || 0) - (b.status?.length || 0),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => (
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
              {obj.role === "admin" && record.subjects && record.subjects.length > 0 && (
                <>
                  {record.subjects.map((subject: SubjectData) => (
                    <li key={subject.id}>
                      <div className="dropdown-item rounded-1 d-flex justify-content-between align-items-center">
                        <span>{subject.name}</span>
                        <div>
                          <Link
                            to="#"
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => openEditModal(subject)}
                            data-bs-toggle="modal"
                            data-bs-target="#edit_subject"
                          >
                            <i className="ti ti-edit-circle" />
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => openDeleteModal(subject)}
                            data-bs-toggle="modal"
                            data-bs-target="#delete-modal"
                          >
                            <i className="ti ti-trash-x" />
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </>
              )}
              {obj.role === "admin" && (
                <li>
                  <Link
                    className="dropdown-item rounded-1"
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#add_subject"
                    onClick={() => setNewSubject({ ...newSubject, classId: record.id })}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Add Subject
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      ),
    },
  ];

  if (obj.role === "teacher") {
    columns.unshift({
      title: "Class Name",
      dataIndex: "className",
      render: (_: any, record: any) => {
        if (!record.isFirstInClass) {
          return <span></span>;
        }
        return <span>{record.class?.name}</span>;
      },
      sorter: (a: any, b: any) => (a.class?.name?.length || 0) - (b.class?.name?.length || 0),
    });
  }

  return (
    <ErrorBoundary>
      <div className={isMobile || obj.role === "admin" ? "page-wrapper" : "pt-4"}>
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Classes</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Classes
                  </li>
                </ol>
              </nav>
            </div>
            {obj.role === "admin" && (
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <TooltipOption />
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#add_subject"
                  >
                    <i className="ti ti-square-rounded-plus-filled me-2" />
                    Add Subject
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Class Details</h4>
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
                              <label className="form-label">Name</label>
                              <CommonSelect
                                className="select"
                                options={language}
                                defaultValue={language[0]}
                              />
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
                <Skeleton active paragraph={{ rows: 6 }} />
              ) : (
                <Table columns={columns} dataSource={Array.isArray(classList) ? classList : []} rowKey="id" />
              )}
            </div>
          </div>
        </div>
      </div>

      {obj.role === "admin" && (
        <div className="modal fade" id="add_subject">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Subject</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleAddSubject}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Subject Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Subject Name"
                          value={newSubject.name}
                          onChange={(e) =>
                            setNewSubject({ ...newSubject, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Subject Code</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Subject Code"
                          value={newSubject.code}
                          onChange={(e) =>
                            setNewSubject({ ...newSubject, code: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Type</label>
                        <select
                          className="form-select"
                          value={newSubject.type}
                          onChange={(e) =>
                            setNewSubject({ ...newSubject, type: e.target.value })
                          }
                        >
                          <option value="Theory">Theory</option>
                          <option value="Practical">Practical</option>
                          <option value="Both">Both</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Class</label>
                        {loading ? (
                          <Skeleton.Input active style={{ width: "100%" }} />
                        ) : (
                          <select
                            className="form-select"
                            value={newSubject.classId}
                            onChange={(e) =>
                              setNewSubject({ ...newSubject, classId: e.target.value })
                            }
                          >
                            <option value="">Select a class</option>
                            {(Array.isArray(classList) ? classList : []).map((classItem) => (
                              <option key={classItem.id} value={classItem.id}>
                                {classItem.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className={`btn btn-primary ${isSubmitting ? "opacity-50" : ""}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Adding..." : "Add Subject"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="modal fade" id="edit_subject">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Subject</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleEditSubject}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Subject Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Subject Name"
                        value={editingSubject?.name || ""}
                        onChange={(e) =>
                          setEditingSubject(editingSubject ? { ...editingSubject, name: e.target.value } : null)
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Subject Code</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Subject Code"
                        value={editingSubject?.code || ""}
                        onChange={(e) =>
                          setEditingSubject(editingSubject ? { ...editingSubject, code: e.target.value } : null)
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Type</label>
                      <select
                        className="form-select"
                        value={editingSubject?.type || "Theory"}
                        onChange={(e) =>
                          setEditingSubject(editingSubject ? { ...editingSubject, type: e.target.value } : null)
                        }
                      >
                        <option value="Theory">Theory</option>
                        <option value="Practical">Practical</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className={`btn btn-primary ${isSubmitting ? "opacity-50" : ""}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Subject"}
                </button>
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
                  Are you sure you want to delete the subject "{deletingSubject?.name}"? This action cannot be undone.
                </p>
                <div className="d-flex justify-content-center">
                  <Link to="#" className="btn btn-light me-3" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteSubject}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Classesshow;