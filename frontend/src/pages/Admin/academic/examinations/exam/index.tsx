import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../../../../core/common/dataTable/index";
import PredefinedDateRanges from "../../../../../core/common/datePicker";
import { DatePicker, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { all_routes } from "../../../../../router/all_routes";
import TooltipOption from "../../../../../core/common/tooltipOption";
import { IExam } from "../../../../../services/types/teacher/examService";
import { createExam, deleteExam, getExams, updateExam } from "../../../../../services/teacher/examServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getClassByschoolId } from "../../../../../services/teacher/classServices";
import { getSubjectBySchoold } from "../../../../../services/teacher/subjectServices";
import { closeModal } from "../../../../Common/modalclose";

// Error Boundary
class ErrorBoundary extends React.Component<any, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return <div className="alert alert-danger m-3">Something went wrong. Please refresh.</div>;
    }
    return this.props.children;
  }
}

const Skeleton = () => (
  <div className="text-center py-4">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

interface ClassData {
  id: string;
  name: string;
  section: string;
  capacity: number;
  schoolId: string;
}

interface SubjectData {
  id: string;
  name: string;
  classId?: string;
  class?: { id: string };
}

const Exam = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [exams, setExams] = useState<IExam[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState<IExam | null>(null);
  const [examToDelete, setExamToDelete] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [addFormData, setAddFormData] = useState<{
    classId: string;
    subjectId: string;
    passMark?: string;
    totalMarks?: string;
    roomNumber?: string;
    duration?: string;
  }>({ classId: "", subjectId: "" });
  const [editFormData, setEditFormData] = useState<{
    [key: string]: {
      classId: string;
      subjectId: string;
      passMark?: string;
      totalMarks?: string;
      roomNumber?: string;
      duration?: string;
    };
  }>({});
  const [addErrors, setAddErrors] = useState<{
    classId?: string;
    subjectId?: string;
    title?: string;
    startTime?: string;
    endTime?: string;
    passMark?: string;
    totalMarks?: string;
    roomNumber?: string;
    duration?: string;
  }>({});
  const [editErrors, setEditErrors] = useState<{
    [key: string]: {
      classId?: string;
      subjectId?: string;
      title?: string;
      startTime?: string;
      endTime?: string;
      passMark?: string;
      totalMarks?: string;
      roomNumber?: string;
      duration?: string;
    };
  }>({});
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const today = new Date();
  const defaultValue = dayjs(today);

  // Fetch classes and subjects
  useEffect(() => {
    const fetchClassesAndSubjects = async () => {
      setLoading(true);
      try {
        const classesResponse = await getClassByschoolId(localStorage.getItem("schoolId") ?? "");
        let classesData: any[] = [];
        if (Array.isArray(classesResponse.data)) {
          classesData = classesResponse.data;
        } else if (classesResponse.data && Array.isArray(classesResponse.data.data)) {
          classesData = classesResponse.data.data;
        } else if (classesResponse.data && Array.isArray(classesResponse.data.classes)) {
          classesData = classesResponse.data.classes;
        }
        classesData = classesData.map((cls: any) => ({
          id: cls.id,
          name: cls.name || cls.className || "",
          section: cls.section,
          capacity: cls.capacity,
          schoolId: cls.schoolId,
        }));
        setClasses(classesData);
        const subjectsResponse = await getSubjectBySchoold(localStorage.getItem("schoolId") ?? "");
        setSubjects(subjectsResponse.data.data as any);
      } catch (error) {
        toast.error("Failed to fetch classes/subjects");
      } finally {
        setLoading(false);
      }
    };
    fetchClassesAndSubjects();
  }, []);

  // Fetch exams for selected class and sort by startTime (latest to oldest)
  useEffect(() => {
    if (!selectedClassId) return;
    const fetchExamsForClass = async () => {
      setLoading(true);
      try {
        const examsResponse = await getExams(selectedClassId);
        let examsData: IExam[] = [];
        const resp: any = examsResponse.data;
        if (Array.isArray(resp)) {
          examsData = resp;
        } else if (resp && Array.isArray(resp.data)) {
          examsData = resp.data;
        } else if (resp && Array.isArray(resp.exams)) {
          examsData = resp.exams;
        }
        // Sort exams by startTime (latest to oldest)
        examsData.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
        setExams(examsData);
      } catch (error) {
        setExams([]);
        toast.error("Failed to fetch exams");
      } finally {
        setLoading(false);
      }
    };
    fetchExamsForClass();
  }, [selectedClassId]);

  // Update selectedClassId when addFormData.classId changes
  useEffect(() => {
    if (addFormData.classId) {
      setSelectedClassId(addFormData.classId);
    }
  }, [addFormData.classId]);

  // Filter subjects for add modal
  const filteredSubjects = React.useMemo(() => {
    if (!addFormData.classId) return [];
    return subjects
      .filter((sub) => (sub.classId === addFormData.classId) || (sub.class && sub.class.id === addFormData.classId))
      .map((sub) => ({ id: sub.id, name: sub.name }));
  }, [subjects, addFormData.classId]);

  // Filter subjects for edit modal
  const getFilteredSubjectsForEdit = (classId: string) => {
    if (!classId) return [];
    return subjects
      .filter((sub) => (sub.classId === classId) || (sub.class && sub.class.id === classId))
      .map((sub) => ({ id: sub.id, name: sub.name }));
  };

  // Handle class selection for add modal
  const handleAddClassClick = (classId: string) => {
    setAddFormData((prev) => ({ ...prev, classId, subjectId: "" }));
    setAddErrors((prev) => ({ ...prev, classId: undefined, subjectId: undefined }));
  };

  // Handle subject selection for add modal
  const handleAddSubjectClick = (subjectId: string) => {
    setAddFormData((prev) => ({ ...prev, subjectId }));
    setAddErrors((prev) => ({ ...prev, subjectId: undefined }));
  };

  // Handle class selection for edit modal
  const handleEditClassClick = (examId: string, classId: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [examId]: { ...prev[examId], classId: classId ?? "", subjectId: "" },
    }));
    setEditErrors((prev) => ({
      ...prev,
      [examId]: { ...prev[examId], classId: undefined, subjectId: undefined },
    }));
  };

  // Handle subject selection for edit modal
  const handleEditSubjectClick = (examId: string, subjectId: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [examId]: { ...prev[examId], subjectId: subjectId ?? "" },
    }));
    setEditErrors((prev) => ({
      ...prev,
      [examId]: { ...prev[examId], subjectId: undefined },
    }));
  };

  

  const columns = [
    // {
    //   title: "Class",
    //   dataIndex: "classId",
    //   render: (text: string) => classes.find((cls) => cls.id === text)?.name || text,
    //   sorter: (a: IExam, b: IExam) => (a.classId?.length ?? 0) - (b.classId?.length ?? 0),
    // },
    {
      title: "Subject",
      dataIndex: "subjectName",
      render: (text: string) => subjects.find((sub) => sub.id === text)?.name || text,
      sorter: (a: IExam, b: IExam) => {
        const aSub = subjectName.find((sub) => sub.id === a.subjectName)?.name || "";
        const bSub = subjectName.find((sub) => sub.id === b.subjectName)?.name || "";
        return aSub.localeCompare(bSub);
      },
    },
    {
      title: "Exam Name",
      dataIndex: "title",
      sorter: (a: IExam, b: IExam) => a.title.localeCompare(b.title),
    },
    {
      title: "Exam Date",
      dataIndex: "startTime",
      render: (text: string) => dayjs(text).format("DD-MM-YYYY"),
      sorter: (a: IExam, b: IExam) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
      defaultSortOrder: "descend", // Default sort: latest to oldest
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      render: (text: string) => dayjs(text).format("hh:mm A"),
      sorter: (a: IExam, b: IExam) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      render: (text: string) => dayjs(text).format("hh:mm A"),
      sorter: (a: IExam, b: IExam) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime(),
    },
    {
      title: "Action",
      render: (_: any, record: IExam) => (
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
                  data-bs-target="#edit_exam"
                  onClick={() => {
                    setSelectedExam(record);
                    setEditFormData((prev) => ({
                      ...prev,
                      [record.id]: {
                        classId: record.classId ?? "",
                        subjectId: record.subjectId ?? "",
                        passMark: record.passMark?.toString(),
                        totalMarks: record.totalMarks?.toString(),
                        roomNumber: record.roomNumber?.toString(),
                        duration: record.duration?.toString(),
                      },
                    }));
                  }}
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
                  onClick={() => setExamToDelete(record.id)}
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

  // Handle Add Exam
  const handleAddExam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const scheduleDate = formData.get("examDate") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const passMark = Number(formData.get("passMark")) || 0;
    const totalMarks = Number(formData.get("totalMarks")) || 0;
    const roomNumber = Number(formData.get("roomNumber")) || 0;
    const start = dayjs(`${scheduleDate} ${startTime}`, "DD-MM-YYYY HH:mm");
    const end = dayjs(`${scheduleDate} ${endTime}`, "DD-MM-YYYY HH:mm");
    const duration = end.diff(start, "minute") || 0;
    const examData: any = {
      title: formData.get("title") as string,
      startTime: start.toDate(),
      endTime: end.toDate(),
      classId: addFormData.classId,
      subjectId: addFormData.subjectId,
      passMark,
      totalMarks,
      roomNumber,
      duration,
    };
    const errors: {
      classId?: string;
      subjectId?: string;
      title?: string;
      startTime?: string;
      endTime?: string;
      passMark?: string;
      totalMarks?: string;
      roomNumber?: string;
      duration?: string;
    } = {};
    if (!addFormData.classId) errors.classId = "Please select a class";
    if (!addFormData.subjectId) errors.subjectId = "Please select a subject";
    if (!examData.title) errors.title = "Please enter an exam name";
    if (!scheduleDate || !dayjs(scheduleDate, "DD-MM-YYYY").isValid()) errors.startTime = "Please select a valid exam date";
    if (!startTime) errors.startTime = "Please select a start time";
    if (!endTime) errors.endTime = "Please select an end time";
    if (startTime && endTime && startTime >= endTime) errors.endTime = "End time must be after start time";
    if (passMark === 0) errors.passMark = "Please enter a valid pass mark";
    if (totalMarks === 0) errors.totalMarks = "Please enter a valid total marks";
    if (roomNumber === 0) errors.roomNumber = "Please enter a valid room number";
    if (duration <= 0) errors.duration = "Duration must be positive";
    setAddErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the form errors");
      return;
    }
    try {
      const response = await createExam(examData);
      if (response && response.status >= 200 && response.status < 300) {
        toast.success("Exam created successfully!");
      
        setAddFormData({
          classId: selectedClassId,
          subjectId: "",
          passMark: "",
          totalMarks: "",
          roomNumber: "",
          duration: "",
        });
        setAddErrors({});
        // Reset form fields
        
        closeModal("add_exam");

        // Fetch updated exams
        if (selectedClassId) {
          const examsResponse = await getExams(selectedClassId);
          let examsData: IExam[] = [];
          const resp: any = examsResponse.data;
          if (Array.isArray(resp)) {
            examsData = resp;
          } else if (resp && Array.isArray(resp.data)) {
            examsData = resp.data;
          } else if (resp && Array.isArray(resp.exams)) {
            examsData = resp.exams;
          }
          // Sort exams by startTime (latest to oldest)
          examsData.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
          setExams(examsData);
        }
      } else {
        toast.error("Failed to create exam");
      }
    } catch (error) {
      toast.error("Failed to create exam");
    }
  };

  // Handle Edit Exam
  const handleEditExam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedExam) return;
    const formData = new FormData(e.currentTarget);
    const examDate = formData.get("examDate") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const editData = editFormData[selectedExam.id || ""] || { classId: selectedExam.classId };
    const passMark = Number(formData.get("passMark")) || 0;
    const totalMarks = Number(formData.get("totalMarks")) || 0;
    const roomNumber = Number(formData.get("roomNumber")) || 0;
    const start = dayjs(`${examDate} ${startTime}`, "DD-MM-YYYY HH:mm");
    const end = dayjs(`${examDate} ${endTime}`, "DD-MM-YYYY HH:mm");
    const duration = end.diff(start, "minute") || 0;
    const updatedExam: any = {
      title: formData.get("title") as string,
      startTime: start.toDate(),
      endTime: end.toDate(),
      classId: editData.classId,
      subjectId: editData.subjectId,
      passMark,
      totalMarks,
      roomNumber,
      duration,
    };
    const errors: {
      classId?: string;
      subjectId?: string;
      title?: string;
      startTime?: string;
      endTime?: string;
      passMark?: string;
      totalMarks?: string;
      roomNumber?: string;
      duration?: string;
    } = {};
    if (!editData.classId) errors.classId = "Please select a class";
    if (!editData.subjectId) errors.subjectId = "Please select a subject";
    if (!updatedExam.title) errors.title = "Please enter an exam name";
    if (!examDate || !dayjs(examDate, "DD-MM-YYYY").isValid()) errors.startTime = "Please select a valid exam date";
    if (!startTime) errors.startTime = "Please select a start time";
    if (!endTime) errors.endTime = "Please select an end time";
    if (startTime && endTime && startTime >= endTime) errors.endTime = "End time must be after start time";
    if (passMark === 0) errors.passMark = "Please enter a valid pass mark";
    if (totalMarks === 0) errors.totalMarks = "Please enter a valid total marks";
    if (roomNumber === 0) errors.roomNumber = "Please enter a valid room number";
    if (duration <= 0) errors.duration = "Duration must be positive";
    setEditErrors((prev) => ({ ...prev, [selectedExam.id || ""]: errors }));
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the form errors");
      return;
    }
    try {
      await updateExam(selectedExam.id || "", updatedExam);
      toast.success("Exam updated successfully!");
      if (selectedClassId) {
        const examsResponse = await getExams(selectedClassId);
        let examsData: IExam[] = [];
        const resp: any = examsResponse.data;
        if (Array.isArray(resp)) {
          examsData = resp;
        } else if (resp && Array.isArray(resp.data)) {
          examsData = resp.data;
        } else if (resp && Array.isArray(resp.exams)) {
          examsData = resp.exams;
        }
        // Sort exams by startTime (latest to oldest)
        examsData.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
        setExams(examsData);
      }
      closeModal("edit_exam");
    } catch (error) {
      toast.error("Failed to update exam");
    }
  };

  // Handle Delete Exam
  const handleDeleteExam = async () => {
    if (!examToDelete) return;
    try {
      await deleteExam(examToDelete);
      toast.success("Exam deleted successfully!");
      if (selectedClassId) {
        const examsResponse = await getExams(selectedClassId);
        let examsData: IExam[] = [];
        const resp: any = examsResponse.data;
        if (Array.isArray(resp)) {
          examsData = resp;
        } else if (resp && Array.isArray(resp.data)) {
          examsData = resp.data;
        } else if (resp && Array.isArray(resp.exams)) {
          examsData = resp.exams;
        }
        // Sort exams by startTime (latest to oldest)
        examsData.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
        setExams(examsData);
      }
      closeModal("delete-modal");
    } catch (error) {
      toast.error("Failed to delete exam");
    }
  };

  // Helper for safe error access
  const safeEditError = (id: string | undefined, field: string) => {
    if (!id || !editErrors[id]) return undefined;
    return editErrors[id][field as keyof typeof editErrors[string]];
  };

  // Calculate duration for add form
  const calculateDuration = () => {
    const scheduleDateInput = document.querySelector('input[name="examDate"]') as HTMLInputElement | null;
    const startTimeInput = document.querySelector('input[name="startTime"]') as HTMLInputElement | null;
    const endTimeInput = document.querySelector('input[name="endTime"]') as HTMLInputElement | null;
    if (scheduleDateInput?.value && startTimeInput?.value && endTimeInput?.value) {
      const start = dayjs(`${scheduleDateInput.value} ${startTimeInput.value}`, "DD-MM-YYYY HH:mm");
      const end = dayjs(`${scheduleDateInput.value} ${endTimeInput.value}`, "DD-MM-YYYY HH:mm");
      return end.diff(start, "minute");
    }
    return "";
  };

  // Calculate duration for edit form
  const calculateEditDuration = () => {
    const examDateInput = document.querySelector('input[name="examDate"]') as HTMLInputElement | null;
    const startTimeInput = document.querySelector('input[name="startTime"]') as HTMLInputElement | null;
    const endTimeInput = document.querySelector('input[name="endTime"]') as HTMLInputElement | null;
    if (examDateInput?.value && startTimeInput?.value && endTimeInput?.value) {
      const start = dayjs(`${examDateInput.value} ${startTimeInput.value}`, "DD-MM-YYYY HH:mm");
      const end = dayjs(`${examDateInput.value} ${endTimeInput.value}`, "DD-MM-YYYY HH:mm");
      return end.diff(start, "minute");
    }
    return Number(editFormData[selectedExam?.id || ""]?.duration) || selectedExam?.duration || "";
  };

  return (
    <ErrorBoundary>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Exam</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Exam
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Class List</h4>
            </div>
            <div className="card-body p-0 py-3">
              {loading ? (
                <Skeleton />
              ) : (
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Select
                      showSearch
                      placeholder="Select a class"
                      optionFilterProp="label"
                      value={selectedClassId || undefined}
                      onChange={(value: string) => setSelectedClassId(value)}
                      filterOption={(input, option) =>
                        (option?.label as string).toLowerCase().includes(input.toLowerCase())
                      }
                      style={{ width: "100%" }}
                    >
                      {classes.map((cls) => (
                        <Select.Option
                          key={cls.id}
                          value={cls.id}
                          label={`${cls.name}${cls.section ? `- ${cls.section}` : ""}`}
                        >
                          {cls.name} {cls.section ? `- ${cls.section}` : ""}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>
          {selectedClassId && (
            <>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap mb-3">
                <TooltipOption />
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#add_exam"
                    onClick={() =>
                      setAddFormData((prev) => ({ ...prev, classId: selectedClassId, subjectId: "" }))
                    }
                  >
                    <i className="ti ti-square-rounded-plus-filled me-2" />
                    Add Exam
                  </Link>
                </div>
              </div>
              <div className="card mt-4">
                <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                  <h4 className="mb-3">Exam List for Selected Class</h4>
                </div>
                <div className="card-body p-0 py-3">
                  {loading ? (
                    <Skeleton />
                  ) : exams.length === 0 ? (
                    <div className="text-center py-4">
                      <h4>No Exams Found</h4>
                      <p>Click "Add Exam" to create your first exam</p>
                    </div>
                  ) : (
                    <Table columns={columns} dataSource={exams} Selection={true} />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Exam Modal */}
      <div className="modal fade" id="add_exam">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Exam</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleAddExam}>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Exam Name</label>
                    <input type="text" name="title" className="form-control" required />
                    {addErrors.title && <span className="text-danger">{addErrors.title}</span>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Class</label>
                    <select
                      className="form-control"
                      name="classId"
                      value={addFormData.classId}
                      onChange={(e) => handleAddClassClick(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select Class
                      </option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} {cls.section ? `- ${cls.section}` : ""}
                        </option>
                      ))}
                    </select>
                    {addErrors.classId && <span className="text-danger">{addErrors.classId}</span>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Subject</label>
                    <select
                      className="form-control"
                      name="subjectId"
                      value={addFormData.subjectId}
                      onChange={(e) => handleAddSubjectClick(e.target.value)}
                      required
                      disabled={!addFormData.classId}
                    >
                      <option value="" disabled>
                        Select Subject
                      </option>
                      {filteredSubjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                    {addErrors.subjectId && <span className="text-danger">{addErrors.subjectId}</span>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Exam Date</label>
                    <div className="date-pic">
                      <DatePicker
                        name="examDate"
                        className="form-control datetimepicker"
                        format="DD-MM-YYYY"
                        getPopupContainer={() => document.body}
                        defaultValue={defaultValue}
                        required
                      />
                      <span className="cal-icon">
                        <i className="ti ti-calendar" />
                      </span>
                    </div>
                    {addErrors.startTime && <span className="text-danger">{addErrors.startTime}</span>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Start Time</label>
                    <input type="time" name="startTime" className="form-control" required />
                    {addErrors.startTime && <span className="text-danger">{addErrors.startTime}</span>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">End Time</label>
                    <input type="time" name="endTime" className="form-control" required />
                    {addErrors.endTime && <span className="text-danger">{addErrors.endTime}</span>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Pass Mark</label>
                    <input
                      type="number"
                      name="passMark"
                      className="form-control"
                      value={addFormData.passMark || ""}
                      onChange={(e) => setAddFormData((prev) => ({ ...prev, passMark: e.target.value }))}
                      required
                    />
                    {addErrors.passMark && <span className="text-danger">{addErrors.passMark}</span>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Total Marks</label>
                    <input
                      type="number"
                      name="totalMarks"
                      className="form-control"
                      value={addFormData.totalMarks || ""}
                      onChange={(e) => setAddFormData((prev) => ({ ...prev, totalMarks: e.target.value }))}
                      required
                    />
                    {addErrors.totalMarks && <span className="text-danger">{addErrors.totalMarks}</span>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Room Number</label>
                    <input
                      type="number"
                      name="roomNumber"
                      className="form-control"
                      value={addFormData.roomNumber || ""}
                      onChange={(e) => setAddFormData((prev) => ({ ...prev, roomNumber: e.target.value }))}
                      required
                    />
                    {addErrors.roomNumber && <span className="text-danger">{addErrors.roomNumber}</span>}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Duration (minutes)</label>
                    <input
                      type="number"
                      name="duration"
                      className="form-control"
                      value={calculateDuration()}
                      readOnly
                      required
                    />
                    {addErrors.duration && <span className="text-danger">{addErrors.duration}</span>}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  Add Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Exam Modal */}
      <div className="modal fade" id="edit_exam">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Exam</h4>
              <button
                type="button"
                className="btn-close custom-btn"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleEditExam}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Exam Name</label>
                      <input
                        type="text"
                        name="examName"
                        className="form-control"
                        defaultValue={selectedExam?.title}
                        required
                      />
                      {safeEditError(selectedExam?.id, "title") && (
                        <span className="text-danger">{safeEditError(selectedExam?.id, "title")}</span>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Class</label>
                      <select
                        className="form-control"
                        name="classId"
                        value={editFormData[selectedExam?.id || ""]?.classId || selectedExam?.classId || ""}
                        onChange={(e) => handleEditClassClick(selectedExam?.id || "", e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Select Class
                        </option>
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name} {cls.section ? `- ${cls.section}` : ""}
                          </option>
                        ))}
                      </select>
                      {safeEditError(selectedExam?.id, "classId") && (
                        <span className="text-danger">{safeEditError(selectedExam?.id, "classId")}</span>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Subject</label>
                      <select
                        className="form-control"
                        name="subjectId"
                        value={editFormData[selectedExam?.id || ""]?.subjectId || selectedExam?.subjectId || ""}
                        onChange={(e) => handleEditSubjectClick(selectedExam?.id || "", e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Select Subject
                        </option>
                        {getFilteredSubjectsForEdit(
                          editFormData[selectedExam?.id || ""]?.classId || selectedExam?.classId || ""
                        ).map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                      {safeEditError(selectedExam?.id, "subjectId") && (
                        <span className="text-danger">{safeEditError(selectedExam?.id, "subjectId")}</span>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Exam Date</label>
                      <div className="date-pic">
                        <DatePicker
                          name="examDate"
                          className="form-control datetimepicker"
                          format="DD-MM-YYYY"
                          getPopupContainer={() => document.body}
                          defaultValue={selectedExam ? dayjs(selectedExam.startTime) : defaultValue}
                          required
                        />
                        <span className="cal-icon">
                          <i className="ti ti-calendar" />
                        </span>
                      </div>
                      {safeEditError(selectedExam?.id, "startTime") && (
                        <span className="text-danger">{safeEditError(selectedExam?.id, "startTime")}</span>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Start Time</label>
                      <input
                        type="time"
                        name="startTime"
                        className="form-control"
                        defaultValue={selectedExam ? dayjs(selectedExam.startTime).format("HH:mm") : ""}
                        required
                      />
                      {safeEditError(selectedExam?.id, "startTime") && (
                        <span className="text-danger">{safeEditError(selectedExam?.id, "startTime")}</span>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">End Time</label>
                      <input
                        type="time"
                        name="endTime"
                        className="form-control"
                        defaultValue={selectedExam ? dayjs(selectedExam.endTime).format("HH:mm") : ""}
                        required
                      />
                      {safeEditError(selectedExam?.id, "endTime") && (
                        <span className="text-danger">{safeEditError(selectedExam?.id, "endTime")}</span>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Pass Mark</label>
                      <input
                        type="number"
                        name="passMark"
                        className="form-control"
                        value={editFormData[selectedExam?.id || ""]?.passMark || selectedExam?.passMark || ""}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            [selectedExam?.id || ""]: {
                              ...prev[selectedExam?.id || ""],
                              passMark: e.target.value,
                            },
                          }))
                        }
                        required
                      />
                      {safeEditError(selectedExam?.id, "passMark") && (
                        <span className="text-danger">{safeEditError(selectedExam?.id, "passMark")}</span>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Total Marks</label>
                      <input
                        type="number"
                        name="totalMarks"
                        className="form-control"
                        value={editFormData[selectedExam?.id || ""]?.totalMarks || selectedExam?.totalMarks || ""}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            [selectedExam?.id || ""]: {
                              ...prev[selectedExam?.id || ""],
                              totalMarks: e.target.value,
                            },
                          }))
                        }
                        required
                      />
                      {safeEditError(selectedExam?.id, "totalMarks") && (
                        <span className="text-danger">{safeEditError(selectedExam?.id, "totalMarks")}</span>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Room Number</label>
                      <input
                        type="number"
                        name="roomNumber"
                        className="form-control"
                        value={editFormData[selectedExam?.id || ""]?.roomNumber || selectedExam?.roomNumber || ""}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            [selectedExam?.id || ""]: {
                              ...prev[selectedExam?.id || ""],
                              roomNumber: e.target.value,
                            },
                          }))
                        }
                        required
                      />
                      {safeEditError(selectedExam?.id, "roomNumber") && (
                        <span className="text-danger">{safeEditError(selectedExam?.id, "roomNumber")}</span>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Duration (minutes)</label>
                      <input
                        type="number"
                        name="duration"
                        className="form-control"
                        value={calculateEditDuration()}
                        readOnly
                        required
                      />
                      {safeEditError(selectedExam?.id, "duration") && (
                        <span className="text-danger">{safeEditError(selectedExam?.id, "duration")}</span>
                      )}
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

      {/* Delete Modal */}
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <span className="delete-icon">
                <i className="ti ti-trash-x" />
              </span>
              <h4>Confirm Deletion</h4>
              <p>You want to delete this exam. This action cannot be undone once completed.</p>
              <div className="d-flex justify-content-center">
                <Link to="#" className="btn btn-light me-3" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <button className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDeleteExam}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Exam;