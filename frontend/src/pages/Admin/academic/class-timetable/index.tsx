import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { all_routes } from "../../../../router/all_routes";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import TooltipOption from "../../../../core/common/tooltipOption";
import CommonSelect from "../../../../core/common/commonSelect";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import { Ilesson } from "../../../../services/types/teacher/lessonService";
import { toast, ToastContainer } from "react-toastify";
import dayjs from "dayjs";
import {
  createLesson,
  deleteLesson,
  getLessonByteacherId,
  getLessonsBySchool,
} from "../../../../services/teacher/lessonServices";
import { getSubjectBySchoold } from "../../../../services/teacher/subjectServices";
import { getClassByschoolId } from "../../../../services/teacher/classServices";
import { getTeacherByschoolId } from "../../../../services/admin/teacherRegistartion";
import { useSelector } from "react-redux";
import { closeModal } from "../../../Common/modalclose";
import useMobileDetection from "../../../../core/common/mobileDetection";
import ErrorBoundary from "../../../../components/ErrorBoundary";


const ClassTimetable = () => {
  const routes = all_routes;
  const location = useLocation();
  const id =  localStorage.getItem("userId") || "";
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMobileDetection();
  const [lessons, setLessons] = useState<Ilesson[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [valuesubjectresponse, setSubjectsresponse] = useState<{ data: any[] }>({ data: [] });
  const [isFetchingSubjects, setIsFetchingSubjects] = useState(false);
  const [showClassList, setShowClassList] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(new Set());
  
  const [newLesson, setNewLesson] = useState<Ilesson>({
    name: "",
    day: "MONDAY",
    startTime: new Date(),
    endTime: new Date(),
    subjectId: "",
    classId: "",
    teacherId: "",
    // section: "",
  });

  const userRole = useSelector((state: any) => state.auth.userObj?.role);
  const isAdmin = userRole === "admin" || userRole === "superadmin";

  const subjectColors = [
    "bg-transparent-primary",
    "bg-transparent-danger",
    "bg-transparent-success",
    "bg-transparent-warning",
    "bg-transparent-info",
    "bg-transparent-pending",
    "bg-transparent-light",
  ];

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const toggleAccordion = (classId: string) => {
    setExpandedAccordions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(classId)) {
        newSet.delete(classId);
      } else {
        newSet.add(classId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get all lessons for the school using the school endpoint
        const schoolId = localStorage.getItem("schoolId") ?? "";
        const allLessonsResponse = await getLessonsBySchool(schoolId);
        // Ensure the data is properly typed as Ilesson[]
        const lessonsData = Array.isArray(allLessonsResponse.data) ? allLessonsResponse.data : [];
        setLessons(lessonsData as Ilesson[]);

        const classesResponse = await getClassByschoolId(schoolId);
        let classArr = [];
        if (Array.isArray(classesResponse.data?.data)) {
          classArr = classesResponse.data.data;
        } else if (Array.isArray(classesResponse.data)) {
          classArr = classesResponse.data;
        } else {
          classArr = [];
        }
        setClasses(classArr);

        const teachersResponse = await getTeacherByschoolId(schoolId);
        setTeachers(teachersResponse.data || []);

        const subjectresponse = await getSubjectBySchoold(schoolId);
        setSubjectsresponse(subjectresponse.data || []);
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleClassBoxClick = () => {
    setShowClassList((prev) => !prev);
  };

  const handleClassClick = async (cls: any) => {
    setNewLesson((prev) => ({
      ...prev,
      classId: cls.id,
      // section: "",
      // subjectId: "",
    }));
    setShowClassList(false);
  
    try {
      setIsFetchingSubjects(true);
  
      // Filter subjects for this class
      const filteredSubjects = valuesubjectresponse?.data?.filter((subj) => subj.classId === cls.id) || [];
      setSubjects(filteredSubjects);
  
      // Get the sections string and split into array
      const sectionString = filteredSubjects[0]?.class?.section || ""; // "A,b,c"
      const sectionsArray = sectionString.split(",").map((s:any) => s.trim()); // ["A", "b", "c"]
  
      // Store sections as part of class object or separate state
      setClasses((prev) =>
        prev.map((c) => (c.id === cls.id ? { ...c, sections: sectionsArray } : c))
      );
    } catch (err) {
      // console.error("Error fetching subjects:", err);
      toast.error("Failed to fetch subjects");
    } finally {
      setIsFetchingSubjects(false);
    }
  };
  

  const handleSectionClick = (section: string) => {
    setNewLesson((prev) => ({
      ...prev,
      section,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // console.log("Changing:", name, value); 
    setNewLesson((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimeChange = (field: "startTime" | "endTime", value: string) => {
    setNewLesson((prev) => ({
      ...prev,
      [field]: new Date(`1970-01-01T${value}:00`),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      // console.log("lesson",newLesson);

  if ( !newLesson.classId ||
          !newLesson.teacherId ) {
        toast.warning("Please fill all required fields, including section");
        return;
      }

      await createLesson(newLesson);
      closeModal("add_time_table");
      toast.success("Lesson added successfully!");

      // Refresh all lessons
      const lessonsResponse = await getLessonsBySchool(localStorage.getItem("schoolId") ?? "");
      const lessonsData = Array.isArray(lessonsResponse.data) ? lessonsResponse.data : [];
      setLessons(lessonsData as Ilesson[]);

      setNewLesson({
        name: "",
        day: "MONDAY",
        startTime: new Date(),
        endTime: new Date(),
        subjectId: "",
        classId: "",
        teacherId: "",
        // section: "",
      });
      
      setShowClassList(false);

    
    } catch (error) {
      // console.error("Error adding lesson:", error);
      toast.error("Failed to add lesson");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      setIsLoading(true);
      await deleteLesson(lessonId);
      toast.success("Lesson deleted successfully!");

      // Refresh all lessons
      const lessonsResponse = await getLessonsBySchool(localStorage.getItem("schoolId") ?? "");
      const lessonsData = Array.isArray(lessonsResponse.data) ? lessonsResponse.data : [];
      setLessons(lessonsData as Ilesson[]);
    } catch (error) {
      // console.error("Error deleting lesson:", error);
      toast.error("Failed to delete lesson");
    } finally {
      setIsLoading(false);
    }
  };

  const groupLessonsByDay = (classLessons: Ilesson[]) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days.map((day) => ({
      day,
      lessons: classLessons.filter((lesson) => lesson.day === day.toUpperCase()),
    }));
  };

  const groupLessonsByClass = () => {
    const groupedLessons: { [key: string]: Ilesson[] } = {};
    
    lessons.forEach((lesson) => {
      if (lesson.classId) {
        if (!groupedLessons[lesson.classId]) {
          groupedLessons[lesson.classId] = [];
        }
        groupedLessons[lesson.classId].push(lesson);
      }
    });

    return Object.entries(groupedLessons).map(([classId, classLessons]) => {
      const classInfo = classes.find(c => c.id === classId);
      return {
        classId,
        className: classInfo?.name || "Unknown Class",
        lessons: classLessons,
        dayGroups: groupLessonsByDay(classLessons)
      };
    });
  };

  const getSubjectColor = (subjectId: string) => {
    const index = subjects.findIndex((sub) => sub.id === subjectId) % subjectColors.length;
    return subjectColors[index >= 0 ? index : 0];
  };

  const getClassName = () => {
    const cls = classes.find((c) => c.id === newLesson.classId);
    return cls ? `${cls.name}${newLesson.section ? ` - ${newLesson.section}` : ""}` : "Select Class";
  };
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    const selectedClass = classes.find((cls) => cls.id === classId);
    if (selectedClass) {
      handleClassClick(selectedClass);
    }
  };

  const availableSections = () => {
    const cls = classes.find((c) => c.id === newLesson.classId);
    return cls?.sections || [];
  };
  
  const renderDayColumn = (dayData: { day: string; lessons: Ilesson[] }) => {
    return (
      <div className="d-flex flex-column me-4 flex-fill" key={dayData.day}>
        <div className="mb-3">
          <h6>{dayData.day}</h6>
        </div>
        {dayData.lessons.length > 0 ? (
          dayData.lessons.map((lesson, index) => (
            <div className={`${getSubjectColor(lesson.subjectId)} rounded p-3 mb-4`} key={index}>
              <p className="d-flex align-items-center text-nowrap mb-1">
                <i className="ti ti-clock me-1" />
                {dayjs(lesson.startTime).format("hh:mm A")} -{" "}
                {dayjs(lesson.endTime).format("hh:mm A")}
              </p>
              <p className="text-dark">
                Subject: {valuesubjectresponse.data.find((sub: any) => sub.id === lesson.subjectId)?.name || "N/A"}
              </p>
              <div className="bg-white rounded p-1 mt-3">
                <Link to="#" className="text-muted d-flex align-items-center">
                  <span className="avatar avatar-sm me-2">
                    <ImageWithBasePath src="assets/img/teachers/teacher-01.jpg" alt="Img" />
                  </span>
                  {teachers.find((teacher) => teacher.id === lesson.teacherId)?.user.name || "N/A"}
                </Link>
              </div>
              {isAdmin && (
                <div className="mt-2 d-flex justify-content-end">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteLesson(lesson.id || "")}
                    disabled={isLoading}
                  >
                    <i className="ti ti-trash" />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-transparent-light rounded p-3 mb-4">
            <p className="text-muted">No lessons scheduled</p>
          </div>
        )}
      </div>
    );
  };

  const renderClassAccordion = (classData: any) => {
    const isExpanded = expandedAccordions.has(classData.classId);
    
    return (
      <div className="card mb-3" key={classData.classId}>
        <div className="card-header" role="tab">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="mb-0">
              <button
                className="btn btn-link text-decoration-none"
                type="button"
                onClick={() => toggleAccordion(classData.classId)}
                aria-expanded={isExpanded}
                aria-controls={`collapse-${classData.classId}`}
              >
                <i className={`ti ti-chevron-${isExpanded ? 'down' : 'right'} me-2`}></i>
                {classData.className} Timetable
                <span className="badge bg-primary ms-2">{classData.lessons.length} lessons</span>
              </button>
            </h5>
            {isAdmin && (
              <div className="d-flex align-items-center">
                <Link
                  to="#"
                  className="btn btn-sm btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#add_time_table"
                  onClick={() => setNewLesson(prev => ({ ...prev, classId: classData.classId }))}
                >
                  <i className="ti ti-plus me-1" />
                  Add Lesson
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <div 
          className={`collapse ${isExpanded ? 'show' : ''}`}
          id={`collapse-${classData.classId}`}
        >
          <div className="card-body">
            {classData.lessons.length > 0 ? (
              <div className="d-flex flex-nowrap overflow-auto">
                {classData.dayGroups.map(renderDayColumn)}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted">No lessons scheduled for this class</p>
                {isAdmin && (
                  <Link
                    to="#"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#add_time_table"
                    onClick={() => setNewLesson(prev => ({ ...prev, classId: classData.classId }))}
                  >
                    <i className="ti ti-plus me-2" />
                    Add First Lesson
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className="page-wrapper" >
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Time Table</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Academic</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Time Table
                  </li>
                </ol>
              </nav>
            </div>
            {isAdmin && (
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <TooltipOption />
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#add_time_table"
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Add Time Table
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Timetable Content */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">School Timetables</h4>
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
                                options={classes.map(c => ({ value: c.id, label: c.name }))}
                                defaultValue={{ value: "", label: "Select Class" }}
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
              </div>
            </div>
            <div className="card-body pb-0">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="accordion" id="timetableAccordion">
                  {groupLessonsByClass().map(renderClassAccordion)}
                </div>
              )}
            </div>
            <div className="card-footer border-0 pb-0">
              <div className="row">
                <div className="col-lg-4 col-xxl-4 col-xl-4 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <span className="bg-primary badge badge-sm mb-2">Morning Break</span>
                      <p className="text-dark">
                        <i className="ti ti-clock me-1" />
                        10:30 to 10:45 AM
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-xxl-3 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <span className="bg-warning badge badge-sm mb-2">Lunch</span>
                      <p className="text-dark">
                        <i className="ti ti-clock me-1" />
                        12:15 to 01:15 PM
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-xxl-3 d-flex">
                  <div className="card flex-fill">
                    <div className="card-body">
                      <span className="bg-info badge badge-sm mb-2">Evening Break</span>
                      <p className="text-dark">
                        <i className="ti ti-clock me-1" />
                        03:30 to 03:45 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Time Table Modal */}
        {isAdmin && (
          <div className="modal fade" id="add_time_table">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Add Time Table</h4>
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
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={newLesson.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Day</label>
                          <select
                            className="form-select"
                            name="day"
                            value={newLesson.day}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="MONDAY">Monday</option>
                            <option value="TUESDAY">Tuesday</option>
                            <option value="WEDNESDAY">Wednesday</option>
                            <option value="THURSDAY">Thursday</option>
                            <option value="FRIDAY">Friday</option>
                            <option value="SATURDAY">Saturday</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Start Time</label>
                          <input
                            type="time"
                            className="form-control"
                            value={dayjs(newLesson.startTime).format("HH:mm")}
                            onChange={(e) => handleTimeChange("startTime", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">End Time</label>
                          <input
                            type="time"
                            className="form-control"
                            value={dayjs(newLesson.endTime).format("HH:mm")}
                            onChange={(e) => handleTimeChange("endTime", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Class</label>
                          <select
                            className="form-select"
                            name="classId"
                            value={newLesson.classId}
                            onChange={handleClassChange}
                            disabled={isLoading}
                            required
                          >
                            <option value="">
                              {isLoading ? "Loading classes..." : "Select Class"}
                            </option>
                            {Array.isArray(classes) ? (
                              classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                  {cls.name}
                                </option>
                              ))
                            ) : (
                              <option value="" disabled>
                                No classes available
                              </option>
                            )}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Subject</label>
                          <select
                            className="form-select"
                            name="subjectId"
                            value={newLesson.subjectId}
                            onChange={handleInputChange}
                            disabled={!newLesson.classId || isFetchingSubjects}
                            // required
                          >
                            <option value="">
                              {isFetchingSubjects
                                ? "Loading subjects..."
                                : newLesson.classId
                                ? "Select Subject"
                                : "Select a class first"}
                            </option>
                            {subjects.map((sub) => (
                              <option key={sub.id} value={sub.id}>
                                {sub.name}
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
                            name="teacherId"
                            value={newLesson.teacherId}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">Select Teacher</option>
                            {teachers.map((teacher) => (
                              <option key={teacher.id} value={teacher.id}>
                                {teacher.user.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-light me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="submit"
                    
                     className="btn btn-primary"  disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-1"
                            role="status"
                          ></span>
                          Adding...
                        </>
                      ) : (
                        "Add Lesson"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ClassTimetable;