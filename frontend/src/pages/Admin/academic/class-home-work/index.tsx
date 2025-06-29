import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { AxiosResponse } from "axios";
import Table from "../../../../core/common/dataTable/index";
import CommonSelect from "../../../../core/common/commonSelect";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import { Link, useLocation } from "react-router-dom";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { all_routes } from "../../../../router/all_routes";
import TooltipOption from "../../../../core/common/tooltipOption";
import { getSubjectByClassId, getSubjectBySchoold } from "../../../../services/teacher/subjectServices";
import { createHomework, getHomeworkById, updateHomework, deleteHomework, getHomeworkByClassId } from "../../../../services/teacher/homework";
import { closeModal } from "../../../Common/modalclose";
import { getClassByschoolId } from "../../../../services/teacher/classServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import useMobileDetection from "../../../../core/common/mobileDetection";
import { useSelector } from "react-redux";
import { Skeleton } from "antd";

interface SelectOption {
  value: string;
  label: string;
}

interface ClassData {
  id: string;
  name: string;
  section: string;
  capacity: number;
  schoolId: string;
  Section?: Array<{ id: string; name: string }>;
}

interface SubjectData {
  id: string;
  name: string;
  classId: string;
}

interface IHomeworkForm {
  id?: string;
  title: string;
  description: string;
  dueDate: Date | string;
  attachment?: string;
  status: "PENDING" | "COMPLETED" | "IN_PROGRESS";
  classId: string;
  sectionId?: string;
  subjectId: string;
}

const ClassHomeWork = ({ teacherdata, classId }: { teacherdata?: any; classId?: any }) => {
  const routes = all_routes;
  const location = useLocation();

  const user = useSelector((state: any) => state.auth.userObj);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [homeworkData, setHomeworkData] = useState<any[]>([]);
  const [classList, setClassList] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [statusOptions] = useState<SelectOption[]>([
    { value: "PENDING", label: "Pending" },
    { value: "COMPLETED", label: "Completed" },
    { value: "IN_PROGRESS", label: "In Progress" },
  ]);
  if (!classId) {
    classId = location.state?.id;
  }
  const [filterFormData, setFilterFormData] = useState<{ classId: string; sectionId: string }>({ classId: "", sectionId: "" });
  const [addFormData, setAddFormData] = useState<{
    classId: string;
    sectionId: string;
    subjectId: string;
    status: string;
    dueDate?: Date;
    attachment?: string;
  }>({ classId: "", sectionId: "", subjectId: "", status: "" });
  const [editFormData, setEditFormData] = useState<{ [key: string]: { classId: string; sectionId: string } }>({});
  const [filterErrors, setFilterErrors] = useState<{ classId?: string; sectionId?: string }>({});
  const [addErrors, setAddErrors] = useState<{ classId?: string; subjectId?: string; title?: string; dueDate?: string; sectionId?: string }>({});
  const [editErrors, setEditErrors] = useState<{ [key: string]: { classId?: string; sectionId?: string } }>({});
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const datafetch = async () => {
    setLoading(true);
    const userId = user.role === "teacher" ? localStorage.getItem("teacherId") : localStorage.getItem("userId");
    try {
      if (userId && selectedClassId) {
        const response = await getHomeworkByClassId(selectedClassId);
        setHomeworkData(response.data);
      } else {
        toast.error("Failed to refresh homework list", {
         position:"top-center" ,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Failed to load homework", {
       position:"top-center" ,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        if (user.role === "admin") {
          const classesResponse = await getClassByschoolId(localStorage.getItem("schoolId") as string);
          const classesData = Array.isArray(classesResponse.data?.data) ? classesResponse.data.data : [];
          setClassList(classesData);
          const subjectsResponse = await getSubjectBySchoold(localStorage.getItem("schoolId") as string);
          setSubjects(subjectsResponse.data.data);
        } else if (user.role === "teacher") {
          if (teacherdata && teacherdata.lessons && teacherdata.lessons.length > 0) {
            const uniqueClasses = Array.from(
              new Map(
                (teacherdata.lessons || [])
                  .filter((lesson: any) => lesson.class)
                  .map((lesson: any) => [lesson.class.id, lesson.class])
              ).values()
            );
            setClassList(uniqueClasses as any);
            const uniqueSubjects = Array.from(
              new Map(
                (teacherdata.lessons || [])
                  .filter((lesson: any) => lesson.subject)
                  .map((lesson: any) => [lesson.subject.id, lesson.subject])
              ).values()
            );
            setSubjects(uniqueSubjects as any);
          } else {
            const response = await getSubjectByClassId(classId);
            setSubjects(response.data.data);
          }
        }
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    if(selectedClassId){
 datafetch();
    }
   
    fetchData();
  }, [teacherdata, user.role]);

  const filteredSubjects = useMemo(() => {
    if (!addFormData.classId) return [];
    const filtered = subjects
      .filter((sub) => sub.classId === addFormData.classId)
      .map((sub) => ({ value: sub.id, label: sub.name }));
    return filtered;
  }, [subjects, addFormData.classId]);

  const handleFilterClassClick = useCallback((classData: ClassData) => {
    setFilterFormData({ classId: classData.id, sectionId: "" });
    setFilterErrors((prev) => ({ ...prev, classId: undefined }));
  }, []);

  const handleFilterSectionClick = useCallback((sectionId: string) => {
    setFilterFormData((prev) => ({ ...prev, sectionId }));
    setFilterErrors((prev) => ({ ...prev, sectionId: undefined }));
  }, []);

  const handleAddClassClick = useCallback((classData: ClassData) => {
    setAddFormData((prev) => ({ ...prev, classId: classData.id, sectionId: classData.section, subjectId: "", status: "" }));
    setAddErrors((prev) => ({ ...prev, classId: undefined, subjectId: undefined }));
  }, []);

  const handleAddSectionClick = useCallback((sectionId: string) => {
    setAddFormData((prev) => ({ ...prev, sectionId }));
    setAddErrors((prev) => ({ ...prev, sectionId: undefined }));
  }, []);

  const handleAddSubjectClick = useCallback((subjectId: string) => {
    setAddFormData((prev) => ({ ...prev, subjectId }));
    setAddErrors((prev) => ({ ...prev, subjectId: undefined }));
  }, []);

  const handleEditClassClick = useCallback((homeworkId: string, classData: ClassData) => {
    setEditFormData((prev) => ({ ...prev, [homeworkId]: { classId: classData.id, sectionId: classData.section } }));
    setEditErrors((prev) => ({ ...prev, [homeworkId]: { ...prev[homeworkId], classId: undefined } }));
  }, []);

  const handleEditSectionClick = useCallback((homeworkId: string, sectionId: string) => {
    setEditFormData((prev) => ({ ...prev, [homeworkId]: { ...prev[homeworkId], sectionId } }));
    setEditErrors((prev) => ({ ...prev, [homeworkId]: { ...prev[homeworkId], sectionId: undefined } }));
  }, []);

  const getAvailableSections = useCallback((classId: string) => {
    const selectedClass = classList.find((cls) => cls.id === classId);
    return selectedClass && selectedClass.section ? [{ value: selectedClass.id, label: selectedClass.section }] : [];
  }, [classList]);

  const getFilteredSubjectsForEdit = useCallback(
    (classId: string) => {
      const filtered = subjects
        .filter((sub) => sub.classId === classId)
        .map((sub) => ({ value: sub.id, label: sub.name }));
      return filtered;
    },
    [subjects]
  );

  const handleApplyClick = useCallback(() => {
    const errors: { classId?: string; sectionId?: string } = {};
    if (!filterFormData.classId) errors.classId = "Please select a class";
    if (filterFormData.classId && !filterFormData.sectionId && getAvailableSections(filterFormData.classId).length > 0)
      errors.sectionId = "Please select a section";
    setFilterErrors(errors);
    if (Object.keys(errors).length === 0 && dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  }, [filterFormData, getAvailableSections]);

  const handleCreateHomework = async (e: React.FormEvent, formData: IHomeworkForm) => {
    e.preventDefault();
    const errors: { classId?: string; subjectId?: string; title?: string; dueDate?: string; sectionId?: string } = {};
    
    if (!selectedClassId && !addFormData.classId) {
      errors.classId = "Please select a class";
    }
    
    if (!addFormData.subjectId) {
      errors.subjectId = "Please select a subject";
    }
    
    if (!formData.title) {
      errors.title = "Please enter a title";
    }
    
    if (!addFormData.dueDate) {
      errors.dueDate = "Please select a submission date";
    }
    
    setAddErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      //console.log("Form errors:", Object.keys(errors));
      toast.error("Please fix the form errors", {
       position:"top-center" ,
        autoClose: 3000,
      });
      return;
    }
    
    try {
      const homeworkData = {
        ...formData,
        classId: selectedClassId || addFormData.classId || "",
        sectionId: addFormData.sectionId || undefined,
        subjectId: addFormData.subjectId,
        status: "PENDING",
      };
      
    //  console.log("createHomework payload", homeworkData);
      await createHomework(homeworkData as any);
      closeModal("add_home_work");
      datafetch();
    
      resetFormData();
      toast.success("Homework added successfully", {
       position:"top-center" ,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error creating homework:", error);
      toast.error("Failed to add homework", {
       position:"top-center" ,
        autoClose: 3000,
      });
    }
  };

  const handleUpdateHomework = async (e: React.FormEvent, homeworkId: string, formData: IHomeworkForm) => {
    e.preventDefault();
    const errors: { classId?: string } = {};
    const editData = editFormData[homeworkId] || { classId: formData.classId, sectionId: formData.sectionId || "" };
    if (!editData.classId) errors.classId = "Please select a class";
    setEditErrors((prev) => ({ ...prev, [homeworkId]: errors }));
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the form errors", {
       position:"top-center" ,
        autoClose: 3000,
      });
      return;
    }

    try {
      await updateHomework(homeworkId, { ...formData, classId: editData.classId, sectionId: editData.sectionId || undefined } as any);
      closeModal(`edit_home_work_${homeworkId}`);
      const response = await getHomeworkById(localStorage.getItem("userId") as string);
      setHomeworkData(Array.isArray(response.data) ? response.data : []);
      toast.success("Homework updated successfully", {
       position:"top-center" ,
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Failed to update homework", {
       position:"top-center" ,
        autoClose: 3000,
      });
    }
  };

  const columns = [
    {
      title: "Subject",
      dataIndex: "subjectId",
      render: (text: string) => subjects.find((sub) => sub.id === text)?.name || text,
      sorter: (a: any, b: any) => a.subjectId.localeCompare(b.subjectId),
    },
    {
      title: "Homework Date",
      dataIndex: "createdAt",
      render: (text: string) => dayjs(text).format("DD-MM-YYYY"),
      sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Submission Date",
      dataIndex: "dueDate",
      render: (text: string) => dayjs(text).format("DD-MM-YYYY"),
      sorter: (a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
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
                data-bs-target={`#edit_home_work_${record.id}`}
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
                onClick={async () => {
                  try {
                    await deleteHomework(record.id);
                    setHomeworkData((prev) => prev.filter((item) => item.id !== record.id));
                    toast.success("Homework deleted successfully", {
                     position:"top-center" ,
                      autoClose: 3000,
                    });
                  } catch (error) {
                    toast.error("Failed to delete homework", {
                     position:"top-center" ,
                      autoClose: 3000,
                    });
                  }
                }}
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

  const ismobile = useMobileDetection();

  const userRole = user.role;
  const isAdminOrSuperAdmin = userRole === "admin" || userRole === "superadmin";
  const mainWrapperClass = isAdminOrSuperAdmin ? "" : "pt-4";

  const handleClassSelect = async (classId: string) => {
    setSelectedClassId(classId);
    setAddFormData((prev) => ({ ...prev, classId, sectionId: "", subjectId: "" }));
    setLoading(true);
    try {
      const response = await getHomeworkByClassId(classId);
      setHomeworkData(response.data);
    } catch (error) {
      setHomeworkData([]);
    } finally {
      setLoading(false);
    }
  };

  const getSectionsForSelectedClass = () => {
    const selectedClass = classList.find((cls) => cls.id === selectedClassId);
    if (selectedClass && selectedClass.Section && Array.isArray(selectedClass.Section)) {
      return selectedClass.Section;
    }
    if (selectedClass && selectedClass.section) {
      return [{ id: selectedClass.id, name: selectedClass.section }];
    }
    return [];
  };

  const resetFormData = () => {
    setAddFormData({
       classId: "", sectionId: "", subjectId: "", status: "", dueDate: undefined, attachment: "",
      title: "",});
    setAddErrors({});
  };


  return (
    // Main wrapper for the component
    <div className="page-wrapper">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Step 1: Show all class names if no class is selected */}
      {!selectedClassId ? (
        <div className="content">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Class Work</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={user.role === "teacher" ? routes.teacherDashboard : routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Academic</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Class Work
                </li>
              </ol>
            </nav>
          </div>
          <div className="row">
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div className="col-md-3 mb-3" key={idx}>
                  <Skeleton active paragraph={{ rows: 1 }} />
                </div>
              ))
            ) : classList.length === 0 ? (
              <div className="col-12 text-center text-muted py-5">No classes found.</div>
            ) : (
              classList.map((cls) => (
                <div className="col-md-3 mb-3" key={cls.id}>
                  <div
                    className="card card-hover pointer"
                    onClick={() => handleClassSelect(cls.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-body text-center">
                      <h5 className="card-title mb-0">{cls.name}</h5>
                      {cls.section && <div className="text-muted">Section: {cls.section}</div>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        // Step 2: Show homework UI for selected class
        <div className={mainWrapperClass}>
          <div className="content">
            <div className="mb-3">
              <button
                className="btn btn-link"
                onClick={() => {
                  setSelectedClassId("");
                }}
              >
                ← Back to Classes
              </button>
            </div>
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Class Work - {classList.find((c) => c.id === selectedClassId)?.name}</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={user.role === "teacher" ? routes.teacherDashboard : routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">Academic</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Class Work
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <TooltipOption />
                <div className="mb-2">
                  <Link to="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add_home_work">
                    <i className="ti ti-square-rounded-plus-filled me-2" />
                    Add Home Work
                  </Link>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Class Home Work</h4>
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
                                <label className="form-label">Subject</label>
                                <select
                                  className="form-control"
                                  value=""
                                  onChange={(e) => {
                                    // Handle subject filter change
                                  }}
                                >
                                  <option value="">Select Subject</option>
                                  {subjects.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                      {sub.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Class</label>
                                <select
                                  className="form-control"
                                  value={filterFormData.classId}
                                  onChange={(e) => {
                                    const selectedClass = classList.find((cls) => cls.id === e.target.value);
                                    if (selectedClass) handleFilterClassClick(selectedClass);
                                  }}
                                >
                                  <option value="" disabled>
                                    Select Class
                                  </option>
                                  {classList.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                      {cls.name}
                                    </option>
                                  ))}
                                </select>
                                {filterErrors.classId && <span className="text-danger">{filterErrors.classId}</span>}
                              </div>
                            </div>
                            {filterFormData.classId && getAvailableSections(filterFormData.classId).length > 0 && (
                              <div className="col-md-12">
                                <div className="mb-3">
                                  <label className="form-label">Section</label>
                                  <select
                                    className="form-control"
                                    value={filterFormData.sectionId}
                                    onChange={(e) => handleFilterSectionClick(e.target.value)}
                                  >
                                    <option value="" disabled>
                                      Select Section
                                    </option>
                                    {getAvailableSections(filterFormData.classId).map((sec) => (
                                      <option key={sec.value} value={sec.value}>
                                        {sec.label}
                                      </option>
                                    ))}
                                  </select>
                                  {filterErrors.sectionId && (
                                    <span className="text-danger">{filterErrors.sectionId}</span>
                                  )}
                                </div>
                              </div>
                            )}
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Status</label>
                                <select
                                  className="form-control"
                                  value=""
                                  onChange={(e) => {
                                    // Handle status filter change
                                  }}
                                >
                                  <option value="">Select Status</option>
                                  {statusOptions.map((status) => (
                                    <option key={status.value} value={status.value}>
                                      {status.label}
                                    </option>
                                  ))}
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
                  <Table
                    columns={columns}
                    dataSource={Array.isArray(homeworkData) ? homeworkData.filter((hw) => hw.classId === selectedClassId) : []}
                    Selection={true}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Home Work Modal */}
      <div className="modal fade" id="add_home_work">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Home Work</h4>
              <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-x" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const homework: IHomeworkForm = {
                  title: formData.get("title") as string,
                  description: formData.get("description") as string,
                  dueDate: addFormData.dueDate ? addFormData.dueDate.toISOString() : new Date().toISOString(),
                  attachment: addFormData.attachment || "",
                  status: "PENDING",
                  classId: selectedClassId || addFormData.classId || "",
                  sectionId: addFormData.sectionId || undefined,
                  subjectId: addFormData.subjectId,
                };
                handleCreateHomework(e, homework);
              }}
            >
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input type="text" name="title" className="form-control" placeholder="Enter homework title" required />
                      {addErrors.title && <span className="text-danger">{addErrors.title}</span>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Class</label>
                      <select
                        className="form-control"
                        value={selectedClassId || addFormData.classId}
                        onChange={(e) => {
                          const selectedClass = classList.find((cls) => cls.id === e.target.value);
                          if (selectedClass) {
                            setSelectedClassId(selectedClass.id);
                            setAddFormData((prev) => ({ ...prev, classId: selectedClass.id, sectionId: "", subjectId: "" }));
                            setAddErrors((prev) => ({ ...prev, classId: undefined }));
                          }
                        }}
                        required
                      >
                        <option value="">Select Class</option>
                        {classList.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                      {addErrors.classId && <span className="text-danger">{addErrors.classId}</span>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Section</label>
                      <select
                        className="form-control"
                        value={addFormData.sectionId}
                        onChange={(e) => handleAddSectionClick(e.target.value)}
                        required
                      >
                        <option value="">Select Section</option>
                        {getSectionsForSelectedClass().length > 0 ? (
                          getSectionsForSelectedClass().map((sec: any) => (
                            <option key={sec.id} value={sec.id}>{sec.name}</option>
                          ))
                        ) : (
                          <option value="" disabled>No sections available</option>
                        )}
                      </select>
                      {addErrors.sectionId && <span className="text-danger">{addErrors.sectionId}</span>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Subject</label>
                      <select
                        className="form-control"
                        name="subjectId"
                        value={addFormData.subjectId}
                        onChange={(e) => handleAddSubjectClick(e.target.value)}
                        required
                      >
                        <option value="">Select Subject</option>
                        {subjects.filter((sub) => sub.classId === (selectedClassId || addFormData.classId)).length > 0 ? (
                          subjects.filter((sub) => sub.classId === (selectedClassId || addFormData.classId)).map((subject) => (
                            <option key={subject.id} value={subject.id}>{subject.name}</option>
                          ))
                        ) : (
                          <option value="" disabled>No subjects available</option>
                        )}
                      </select>
                      {addErrors.subjectId && <span className="text-danger">{addErrors.subjectId}</span>}
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Homework Date</label>
                          <DatePicker
                            className="form-control"
                            format="DD-MM-YYYY"
                            onChange={(date) => {
                              setAddFormData((prev) => ({ ...prev, createdAt: date ? date.toDate() : new Date() }));
                              if (date) setAddErrors((prev) => ({ ...prev, dueDate: undefined }));
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Submission Date</label>
                          <DatePicker
                            className="form-control"
                            format="DD-MM-YYYY"
                            name="dueDate"
                            onChange={(date) => {
                              setAddFormData((prev) => ({ ...prev, dueDate: date ? date.toDate() : new Date() }));
                              if (date) setAddErrors((prev) => ({ ...prev, dueDate: undefined }));
                            }}
                            placeholder="Select Due Date"
                            required
                          />
                          {addErrors.dueDate && <span className="text-danger">{addErrors.dueDate}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Attachment</label>
                      <input
                        type="file"
                        name="attachment"
                        className="form-control"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAddFormData((prev) => ({ ...prev, attachment: file.name }));
                          }
                          if (e.target.value) setAddErrors((prev) => ({ ...prev, attachment: undefined }));
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        className="form-control"
                        rows={4}
                        placeholder="Enter homework description"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal" onClick={resetFormData}>
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  Add Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Home Work Modals */}
      {homeworkData.map((homework) => (
        <div className="modal fade" id={`edit_home_work_${homework.id}`} key={homework.id}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Home Work</h4>
                <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
                  <i className="ti ti-x" />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const editData = editFormData[homework.id] || { classId: homework.classId, sectionId: homework.sectionId || "" };
                  const updatedHomework: IHomeworkForm = {
                    title: formData.get("title") as string,
                    description: formData.get("description") as string,
                    dueDate: formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : new Date(),
                    attachment: formData.get("attachment") as string,
                    status: (formData.get("status") as "PENDING" | "COMPLETED" | "IN_PROGRESS") || homework.status,
                    classId: editData.classId,
                    sectionId: editData.sectionId || undefined,
                    subjectId: formData.get("subjectId") as string,
                  };
                  handleUpdateHomework(e, homework.id, updatedHomework);
                }}
              >
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                          type="text"
                          name="title"
                          className="form-control"
                          defaultValue={homework.title}
                          required
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Class</label>
                            <select
                              className="form-control"
                              value={editFormData[homework.id]?.classId || homework.classId}
                              onChange={(e) => {
                                const selectedClass = classList.find((cls) => cls.id === e.target.value);
                                if (selectedClass) handleEditClassClick(homework.id, selectedClass);
                              }}
                            >
                              <option value="" disabled>
                                Select Class
                              </option>
                              {classList.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                  {cls.name}
                                </option>
                              ))}
                            </select>
                            {editErrors[homework.id]?.classId && (
                              <span className="text-danger">{editErrors[homework.id].classId}</span>
                            )}
                          </div>
                        </div>
                        {(editFormData[homework.id]?.classId || homework.classId) &&
                          getAvailableSections(editFormData[homework.id]?.classId || homework.classId).length > 0 && (
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Section</label>
                                <select
                                  className="form-control"
                                  value={editFormData[homework.id]?.sectionId || homework.sectionId || ""}
                                  onChange={(e) => handleEditSectionClick(homework.id, e.target.value)}
                                >
                                  <option value="">Select Section</option>
                                  {getAvailableSections(
                                    editFormData[homework.id]?.classId || homework.classId
                                  ).map((sec) => (
                                    <option key={sec.value} value={sec.value}>
                                      {sec.label}
                                    </option>
                                  ))}
                                </select>
                                {editErrors[homework.id]?.sectionId && (
                                  <span className="text-danger">{editErrors[homework.id].sectionId}</span>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Subject</label>
                        {getFilteredSubjectsForEdit(editFormData[homework.id]?.classId || homework.classId).length > 0 ? (
                          <select
                            className="form-control"
                            value={editFormData[homework.id]?.subjectId || homework.subjectId}
                            onChange={(e) => {
                              setEditFormData((prev) => ({ ...prev, [homework.id]: { ...prev[homework.id], subjectId: e.target.value } }));
                              setEditErrors((prev) => ({ ...prev, [homework.id]: { ...prev[homework.id], subjectId: undefined } }));
                            }}
                          >
                            <option value="">Select Subject</option>
                            {getFilteredSubjectsForEdit(editFormData[homework.id]?.classId || homework.classId).map((sub) => (
                              <option key={sub.value} value={sub.value}>
                                {sub.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-danger">No subjects available for this class</p>
                        )}
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Homework Date</label>
                            <DatePicker
                              className="form-control"
                              format="DD-MM-YYYY"
                              value={dayjs(homework.createdAt)}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Submission Date</label>
                            <DatePicker
                              className="form-control"
                              format="DD-MM-YYYY"
                              name="dueDate"
                              defaultValue={dayjs(homework.dueDate)}
                              placeholder="Select Due Date"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Attachment</label>
                        <input type="file" name="attachment" className="form-control" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          name="description"
                          className="form-control"
                          rows={4}
                          defaultValue={homework.description}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select
                          className="form-control"
                          value={homework.status}
                          onChange={(e) => {
                            // Handle status change
                          }}
                        >
                          <option value="">Select Status</option>
                          {statusOptions.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ))}

      {/* Delete Modal */}
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form>
              <div className="modal-body text-center">
                <span className="delete-icon">
                  <i className="ti ti-trash-x" />
                </span>
                <h4>Confirm Deletion</h4>
                <p>You want to delete all the marked items, this can't be undone once you delete.</p>
                <div className="d-flex justify-content-center">
                  <Link to="#" className="btn btn-light me-3" data-bs-dismiss="modal">
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

export default ClassHomeWork;