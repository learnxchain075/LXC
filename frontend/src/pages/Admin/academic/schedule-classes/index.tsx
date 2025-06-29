import React, { useRef, useState, useEffect } from "react";
import Table from "../../../../core/common/dataTable/index";
// import { scheduleClass } from "../../../core/data/json/schedule_class";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import {
  activeList,
  classselect,
  startTime,
} from "../../../../core/common/selectoption/selectoption";
import CommonSelect from "../../../../core/common/commonSelect";
import { TableData } from "../../../../core/data/interface";
import { Link } from "react-router-dom";
import { all_routes } from "../../../../router/all_routes";
import TooltipOption from "../../../../core/common/tooltipOption";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllScheduleClasses,
  createScheduleClass,
  updateScheduleClass,
  deleteScheduleClass,
  getScheduleClassesByType,
  getScheduleClassesByStatus,
  filterScheduleClassesByDate,
  IScheduleClass,
  ICreateScheduleClass,
  IUpdateScheduleClass,
} from "../../../../services/admin/scheduleClassApi";
import LoadingSkeleton from "../../../../components/Loader";
import {
  createLesson,
  getLessons,
  updateLesson,
  deleteLesson,
} from "../../../../services/teacher/lessonServices";
import { Ilesson } from "../../../../services/types/teacher/lessonService";
import { getClasses } from "../../../../services/teacher/classServices";
import { getAllTeacher } from "../../../../services/admin/teacherRegistartion";
import { getSubjectByClassId } from "../../../../services/teacher/subjectServices";
import TimePicker from "react-time-picker";
import { closeModal } from "../../../Common/modalclose";

const ScheduleClasses = () => {
  const routes = all_routes;
  // const data = scheduleClass;
  const route = all_routes
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const obj = useSelector((state: any) => state.auth.userObj);
  
  // State management
  const [scheduleClasses, setScheduleClasses] = useState<IScheduleClass[]>([]);
  const [filteredScheduleClasses, setFilteredScheduleClasses] = useState<IScheduleClass[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedScheduleClass, setSelectedScheduleClass] = useState<IScheduleClass | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  
  // Filter states
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
    startDate: "",
    endDate: "",
  });
  
  // Form states
  const [formData, setFormData] = useState<ICreateScheduleClass>({
    type: "",
    startTime: "",
    endTime: "",
    status: "Active",
    schoolId: localStorage.getItem("schoolId") || "",
    classId: "",
    subjectId: "",
    teacherId: "",
    dayOfWeek: "",
  });

  // Dynamic dropdown state
  const [classOptions, setClassOptions] = useState<any[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<any[]>([]);
  const [teacherOptions, setTeacherOptions] = useState<any[]>([]);

  // Mobile detection
  const isMobile = window.innerWidth <= 768;

  // Add state for errors and loading
  const [formError, setFormError] = useState<string>("");
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [subjectLoading, setSubjectLoading] = useState(false);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  // Fetch classes, teachers, subjects
  useEffect(() => {
    getClasses().then((res) => {
      setClassOptions(res.data.map((cls: any) => ({ value: cls.id, label: cls.name })));
    });
    setTeacherLoading(true);
    getAllTeacher()
      .then((res) => {
        setTeacherOptions(res.data.map((t: any) => ({ value: t.teacherId || t.teacher?.id || t.id, label: t.name })));
      })
      .catch(() => setTeacherOptions([]))
      .finally(() => setTeacherLoading(false));
  }, []);

  useEffect(() => {
    if (formData.classId) {
      setSubjectLoading(true);
      getSubjectByClassId(formData.classId)
        .then((res) => {
          if (Array.isArray(res.data?.data) && res.data.data.length > 0) {
            const mappedSubjects = res.data.data.map((s: any) => ({ value: s.id, label: s.name }));
            setSubjectOptions(mappedSubjects);
          } else {
            setSubjectOptions([]);
          }
        })
        .catch(() => setSubjectOptions([]))
        .finally(() => setSubjectLoading(false));
    } else {
      setSubjectOptions([]);
    }
  }, [formData.classId]);

  // Fetch schedule classes for table
  const fetchScheduleClasses = async () => {
    setIsLoading(true);
    try {
      const schoolId = localStorage.getItem("schoolId") || "";
      const res = await getAllScheduleClasses(schoolId);
      setScheduleClasses(res.data || []);
      setFilteredScheduleClasses(res.data || []);
    } catch {
      toast.error("Failed to fetch schedule classes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleClasses();
  }, []);

  // Improved handleScheduleClassSubmit with validation
  const handleScheduleClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsLoading(true);

    // Compose a valid ISO date for today with the selected time
    const today = new Date().toISOString().split('T')[0];
    const startTimeISO = formData.startTime ? `${today}T${formData.startTime}:00.000Z` : "";
    const endTimeISO = formData.endTime ? `${today}T${formData.endTime}:00.000Z` : "";

    const apiData: any = {
      ...formData,
      name: formData.name || "Lesson",
      day: formData.dayOfWeek ? formData.dayOfWeek.toUpperCase() : "",
      startTime: startTimeISO,
      endTime: endTimeISO,
    };
   
    delete apiData.dayOfWeek;
    delete apiData.type;

   // console.log("apiData before validation:", apiData);

  
    if (
      !apiData.name ||
      !apiData.startTime ||
      !apiData.endTime ||
      !apiData.classId ||
      !apiData.subjectId ||
      !apiData.teacherId ||
      !apiData.day ||
      apiData.endTime <= apiData.startTime
    ) {
      toast.error("All fields are required.");
      setFormError("All fields are required.");
      setIsLoading(false);
      return;
    }

    try {
      if (isEditMode && selectedScheduleClass) {
        await updateScheduleClass(selectedScheduleClass.id, { ...apiData, id: selectedScheduleClass.id });
        toast.success("Schedule updated successfully!");
      } else {
        await createScheduleClass(apiData);
        toast.success("Schedule created successfully!");
      }
      fetchScheduleClasses();
      resetForm();
      closeModal("add_Schedule");
    } catch {
      setFormError("Failed to save schedule");
      toast.error("Failed to save schedule");
    } finally {
      setIsLoading(false);
    }
  };

  // Edit handler
  const editScheduleClass = (schedule: IScheduleClass) => {
    setSelectedScheduleClass(schedule);
    setFormData({
      type: schedule.type,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      status: schedule.status,
      schoolId: schedule.schoolId,
      classId: schedule.classId || "",
      subjectId: schedule.subjectId || "",
      teacherId: schedule.teacherId || "",
      dayOfWeek: schedule.dayOfWeek || "",
    });
    setIsEditMode(true);
  };

  // Delete handler
  const handleDelete = async (schedule?: IScheduleClass) => {
    if (schedule) {
      setSelectedScheduleClass(schedule);
    }
    if (!selectedScheduleClass) return;
    setIsLoading(true);
    try {
      await deleteScheduleClass(selectedScheduleClass.id);
      toast.success("Schedule deleted successfully!");
      fetchScheduleClasses();
      resetForm();
      closeModal("delete-modal");
    } catch {
      toast.error("Failed to delete schedule");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter schedule classes
  const filterScheduleClasses = () => {
    let filtered = [...scheduleClasses];
    if (selectedType) {
      filtered = filtered.filter(schedule => schedule.type === selectedType);
    }
    if (selectedStatus) {
      filtered = filtered.filter(schedule => schedule.status === selectedStatus);
    }
    if (searchTerm) {
      filtered = filtered.filter(schedule =>
        schedule.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.startTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.endTime.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredScheduleClasses(filtered);
  };

  // Apply filters
  const applyFilters = async () => {
    setIsLoading(true);
    try {
      const schoolId = localStorage.getItem("schoolId") || "";
      let response;
      if (selectedType) {
        response = await getScheduleClassesByType(schoolId, selectedType);
      } else if (selectedStatus) {
        response = await getScheduleClassesByStatus(schoolId, selectedStatus as "Active" | "Inactive");
      } else if (dateRange.startDate && dateRange.endDate) {
        response = await filterScheduleClassesByDate(schoolId, dateRange.startDate, dateRange.endDate);
      } else {
        response = await getAllScheduleClasses(schoolId);
      }
      setFilteredScheduleClasses(response.data || []);
      handleApplyClick();
    } catch {
      toast.error("Failed to apply filters");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedType("");
    setSelectedStatus("");
    setSearchTerm("");
    setDateRange({ startDate: "", endDate: "" });
    setFilteredScheduleClasses(scheduleClasses);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      type: "",
      startTime: "",
      endTime: "",
      status: "Active",
      schoolId: localStorage.getItem("schoolId") || "",
      classId: "",
      subjectId: "",
      teacherId: "",
      dayOfWeek: "",
    });
    setSelectedScheduleClass(null);
    setIsEditMode(false);
  };

  

  const columns = [
    // {
    //   title: "Type",
    //   dataIndex: "type",
    //   render: (text: any, record: any) => record.type || "",
    // },
    {
      title: "Class",
      dataIndex: "class",
      render: (text: any, record: any) => record.class?.name || record.classId,
    },
    {
      title: "Subject",
      dataIndex: "subject",
      render: (text: any, record: any) => record.subject?.name || record.subjectId,
    },
    {
      title: "Teacher",
      dataIndex: "teacherId",
      render: (text: any, record: any) => {
        const teacher = teacherOptions.find(t => t.value === record.teacherId);
        return teacher ? teacher.label : record.teacherId;
      }
    },
    {
      title: "Day",
      dataIndex: "day",
      render: (text: any, record: any) => record.day || record.dayOfWeek,
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      render: (text: string) => text ? new Date(text).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      render: (text: string) => text ? new Date(text).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
            <span
          className={`badge badge-soft-${text === "Active" ? "success" : "danger"} d-inline-flex align-items-center tw-text-xs`}
            >
          <i className={`ti ti-circle-filled fs-5 me-1`}></i>
          {text}
            </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: string, record: any) => (
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
                  onClick={() => editScheduleClass(record as IScheduleClass)}
                    data-bs-toggle="modal"
                    data-bs-target="#edit_Schedule"
                  >
                    <i className="ti ti-edit-circle me-2" />
                    Edit
                  </Link>
                </li>
                <li>
                  <Link
                  className="dropdown-item rounded-1 text-danger"
                    to="#"
                  onClick={() => handleDelete(record as IScheduleClass)}
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
    },
  ];

  return (
    <div>
      <ToastContainer />
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3 tw-py-2">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1 tw-text-xl sm:tw-text-2xl lg:tw-text-3xl">Schedule</h3>
              <nav>
                <ol className="breadcrumb mb-0 tw-text-sm">
                  <li className="breadcrumb-item">
                    <Link to={route.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Classes </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Schedule
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <TooltipOption />
              <div className="mb-2">
                <Link
                  to="#"
                  className="btn btn-primary tw-text-sm sm:tw-text-base"
                  data-bs-toggle="modal"
                  data-bs-target="#add_Schedule"
                  onClick={resetForm}
                >
                  <i className="ti ti-square-rounded-plus-filled me-2" />
                  Add Schedule
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          
          {/* Search and Filters */}
          <div className="card tw-border tw-border-gray-200 tw-rounded-lg tw-mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12 col-md-6 col-lg-3">
                  <label className="form-label tw-text-sm">Search</label>
                  <input
                    type="text"
                    className="form-control tw-text-sm"
                    placeholder="Search by type, time..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <label className="form-label tw-text-sm">Type</label>
                  <select
                    className="form-control tw-text-sm"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">Select Type</option>
                    {classselect.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                  <label className="form-label tw-text-sm">Status</label>
                  <select
                    className="form-control tw-text-sm"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">Select Status</option>
                    {activeList.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6 col-lg-3 d-flex align-items-end">
                  <div className="d-flex gap-2 w-100">
                    <button
                      className="btn btn-primary tw-text-sm flex-fill"
                      onClick={applyFilters}
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Apply"}
                    </button>
                    <button
                      className="btn btn-light tw-text-sm"
                      onClick={resetFilters}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Classes List */}
          <div className="card tw-border tw-border-gray-200 tw-rounded-lg">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0 tw-p-4">
              <h4 className="mb-3 tw-text-lg sm:tw-text-xl">Schedule Classes</h4>
              <div className="d-flex align-items-center flex-wrap gap-2">
                <div className="input-icon-start mb-3 me-2 position-relative">
                  <PredefinedDateRanges />
                </div>
                <div className="dropdown mb-3 me-2">
                  <Link
                    to="#"
                    className="btn btn-outline-light bg-white dropdown-toggle tw-text-sm"
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
                              <label className="form-label tw-text-sm">Type</label>
                              <select
                                className="form-control tw-text-sm"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                              >
                                <option value="">Select Type</option>
                                {classselect.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label tw-text-sm">Status</label>
                              <select
                                className="form-control tw-text-sm"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                              >
                                <option value="">Select Status</option>
                                {activeList.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <Link to="#" className="btn btn-light me-3 tw-text-sm" onClick={resetFilters}>
                          Reset
                        </Link>
                        <Link
                          to="#"
                          className="btn btn-primary tw-text-sm"
                          onClick={applyFilters}
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
                    className="btn btn-outline-light bg-white dropdown-toggle tw-text-sm"
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
              {isLoading ? (
                <div className="p-4 w-100">
                  <LoadingSkeleton />
                </div>
              ) : filteredScheduleClasses.length === 0 ? (
                <div className="tw-text-center tw-text-gray-500 tw-py-8">
                  <i className="ti ti-calendar-off fs-1 mb-3"></i>
                  <p>No schedule classes found</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table 
                    columns={columns} 
                    dataSource={filteredScheduleClasses} 
                    Selection={true}
                  />
                </div>
              )}
            </div>
          </div>
          {/* /Schedule Classes List */}
        </div>
      </div>
      {/* /Page Wrapper */}
      
      {/* Modals */}
      <div>
        {/* Add Schedule */}
        <div className="modal fade" id="add_Schedule">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Schedule</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleScheduleClassSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="form-label tw-text-sm">Class</label>
                      <select
                        className="form-control tw-text-sm"
                        value={formData.classId}
                        onChange={e => setFormData({ ...formData, classId: e.target.value, subjectId: "" })}
                        required
                      >
                        <option value="">Select Class</option>
                        {classOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label tw-text-sm">Subject</label>
                      {subjectLoading ? (
                        <div className="tw-text-xs tw-text-gray-500">Loading subjects...</div>
                      ) : subjectOptions.length === 0 ? (
                        <div className="tw-text-xs tw-text-gray-500">No subjects available</div>
                      ) : (
                        <select
                          className="form-control tw-text-sm"
                          value={formData.subjectId}
                          onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                          required
                        >
                          <option value="">Select Subject</option>
                          {subjectOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label tw-text-sm">Teacher</label>
                      {teacherLoading ? (
                        <div className="tw-text-xs tw-text-gray-500">Loading teachers...</div>
                      ) : teacherOptions.length === 0 ? (
                        <div className="tw-text-xs tw-text-gray-500">No teachers available</div>
                      ) : (
                        <select
                          className="form-control tw-text-sm"
                          value={formData.teacherId}
                          onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                          required
                        >
                          <option value="">Select Teacher</option>
                          {teacherOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label tw-text-sm">Day</label>
                      <select
                        className="form-control tw-text-sm"
                        value={formData.dayOfWeek}
                        onChange={e => setFormData({ ...formData, dayOfWeek: e.target.value })}
                        required
                      >
                        <option value="">Select Day</option>
                        {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label tw-text-sm">Start Time</label>
                      <input
                        type="time"
                        className="form-control tw-text-sm"
                        value={formData.startTime || ""}
                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label tw-text-sm">End Time</label>
                      <input
                        type="time"
                        className="form-control tw-text-sm"
                        value={formData.endTime || ""}
                        onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label tw-text-sm">Type</label>
                      <select
                        className="form-control tw-text-sm"
                        value={formData.type || ""}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Class">Class</option>
                        <option value="Lesson">Lesson</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label tw-text-sm">Lesson Name</label>
                      <input
                        type="text"
                        className="form-control tw-text-sm"
                        value={formData.name || ""}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  {formError && <div className="tw-text-xs tw-text-red-500 tw-mb-2">{formError}</div>}
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2 tw-text-sm"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button 
                    type="submit" 
                    className="btn btn-primary tw-text-sm"
                    disabled={
                      isLoading ||
                      !formData.startTime ||
                      !formData.endTime ||
                      !formData.classId ||
                      !formData.subjectId ||
                      !formData.teacherId ||
                      !formData.dayOfWeek ||
                      formData.endTime <= formData.startTime
                    }
                  >
                    {isLoading ? "Saving..." : "Add Schedule"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add Schedule */}
        
        {/* Edit Schedule */}
        <div className="modal fade" id="edit_Schedule">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Schedule</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleScheduleClassSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="form-label tw-text-sm">Class</label>
                      <select
                        className="form-control tw-text-sm"
                        value={formData.classId}
                        onChange={e => setFormData({ ...formData, classId: e.target.value })}
                        required
                      >
                        <option value="">Select Class</option>
                        {classOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label tw-text-sm">Subject</label>
                      <select
                        className="form-control tw-text-sm"
                        value={formData.subjectId}
                        onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                        required
                      >
                        <option value="">Select Subject</option>
                        {subjectOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label tw-text-sm">Teacher</label>
                      <select
                        className="form-control tw-text-sm"
                        value={formData.teacherId}
                        onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                        required
                      >
                        <option value="">Select Teacher</option>
                        {teacherOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label tw-text-sm">Day</label>
                      <select
                        className="form-control tw-text-sm"
                        value={formData.dayOfWeek}
                        onChange={e => setFormData({ ...formData, dayOfWeek: e.target.value })}
                        required
                      >
                        <option value="">Select Day</option>
                        {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label tw-text-sm">Start Time</label>
                      <input
                        type="time"
                        className="form-control tw-text-sm"
                        value={formData.startTime || ""}
                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label tw-text-sm">End Time</label>
                      <input
                        type="time"
                        className="form-control tw-text-sm"
                        value={formData.endTime || ""}
                        onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2 tw-text-sm"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button 
                    type="submit" 
                    className="btn btn-primary tw-text-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Edit Schedule */}
        
        {/* Delete Modal */}
        <div className="modal fade" id="delete-modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={(e) => { e.preventDefault(); handleDelete(); }}>
                <div className="modal-body text-center">
                  <span className="delete-icon">
                    <i className="ti ti-trash-x" />
                  </span>
                  <h4>Confirm Deletion</h4>
                  <p>
                    You want to delete this schedule class? This cannot be undone
                    once you delete.
                  </p>
                  <div className="d-flex justify-content-center">
                    <Link
                      to="#"
                      className="btn btn-light me-3 tw-text-sm"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button 
                      type="submit" 
                      className="btn btn-danger tw-text-sm"
                      disabled={isLoading}
                    >
                      {isLoading ? "Deleting..." : "Yes, Delete"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Delete Modal */}
      </div>
    </div>
  );
};

export default ScheduleClasses;
