import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../../../../core/common/dataTable/index";
import PredefinedDateRanges from "../../../../../core/common/datePicker";
import CommonSelect from "../../../../../core/common/commonSelect";
import { allClass, classSection, weeklytest } from "../../../../../core/common/selectoption/selectoption";
import { all_routes } from "../../../../../router/all_routes";
import TooltipOption from "../../../../../core/common/tooltipOption";
import { getExamAttendance } from "../../../../../services/teacher/classServices";
import { getExams } from "../../../../../services/teacher/examServices";
import { IExamAttendance } from "../../../../../services/types/teacher/examattendance";
import { IExam } from "../../../../../services/types/teacher/examService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from 'react-redux';
import { getClasses, getClassesByTeacherId } from '../../../../../services/teacher/classServices';

// Add custom styles for the dropdown
const dropdownStyles = `
  .exam-dropdown-item {
    transition: background-color 0.2s ease;
  }
  .exam-dropdown-item:hover {
    background-color: #f8f9fa !important;
  }
  .exam-dropdown-item:last-child {
    border-bottom: none !important;
  }
`;

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

// Helper function to format date
const formatDate = (dateString: string | Date) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return "Invalid Date";
  }
};

const ExamAttendance = () => {
  const obj = useSelector((state: any) => state.auth.userObj);
  const [attendance, setAttendance] = useState<IExamAttendance[]>([]);
  const [exams, setExams] = useState<IExam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const routes = all_routes;
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [examSearch, setExamSearch] = useState<string>("");
  const [showExamDropdown, setShowExamDropdown] = useState(false);

  // Fetch classes based on role
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        if (obj.role === "admin") {
          const res = await getClasses();
          setClasses(res.data);
        } else if (obj.role === "teacher") {
          const res = await getClassesByTeacherId(obj.id);
          setClasses(res.data);
        } else {
          setClasses([]);
        }
      } catch (e) {
        setClasses([]);
      }
    };
    if (obj.role === "admin" || obj.role === "teacher") fetchClasses();
  }, [obj.role, obj.id]);

  // Fetch exams for selected class (admin/teacher)
  useEffect(() => {
    const fetchExamsList = async () => {
      setLoading(true);
      try {
        if (obj.role === "admin" || obj.role === "teacher") {
          if (!selectedClassId) {
            setExams([]);
            setLoading(false);
            return;
          }
          const res = await getExams(selectedClassId);
         // console.log('Exam API response:', res);
          setExams(res.data.map((exam: any) => ({
            ...exam,
            // Map backend fields to frontend expectations
            subjectId: exam.subjectName || "",
            date: exam.startTime || exam.scheduleDate || new Date(),
            // Ensure all required fields are present
            title: exam.title || "Untitled Exam",
            startTime: exam.startTime || new Date(),
            endTime: exam.endTime || new Date(),
            classId: exam.classId || selectedClassId,
          })));
        } else if (obj.role === "student") {
          setExams([]);
        }
      } catch (e) {
        setExams([]);
        setError("Failed to load exams");
      } finally {
        setLoading(false);
      }
    };
    if (obj.role === "admin" || obj.role === "teacher") fetchExamsList();
  }, [selectedClassId, obj.role]);

  // Fetch attendance for selected exam
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError(null);
      try {
        if (obj.role === "student") {
          
          setAttendance([]); 
        } else if (selectedExamId) {
          const res = await getExamAttendance(selectedExamId);
        //  console.log('Attendance API response:', res);
          setAttendance(res.data);
        } else {
          setAttendance([]);
        }
      } catch (e) {
        setAttendance([]);
        setError("Failed to load attendance");
      } finally {
        setLoading(false);
      }
    };
    if ((obj.role === "admin" || obj.role === "teacher") && !selectedExamId) {
      setAttendance([]);
      return;
    }
    fetchAttendance();
  }, [selectedExamId, obj.role]);

  // Filter exams for search
  const filteredExams = exams.filter(
    (exam) =>
      exam.title.toLowerCase().includes(examSearch.toLowerCase()) ||
      (exam.subjectName && exam.subjectName.toLowerCase().includes(examSearch.toLowerCase()))
  );

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const handleExamSelect = (examId: string) => {
    setSelectedExamId(examId);
    setShowExamDropdown(false);
    setExamSearch("");
  };

  const columns = [
    {
      title: "Student Name",
      dataIndex: "studentName",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Exam Name",
      dataIndex: "examTitle",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text: Date) => <span>{new Date(text).toLocaleDateString()}</span>,
    },
    {
      title: "Present",
      dataIndex: "present",
      render: (present: boolean) => (
        <span className={present ? "badge bg-success" : "badge bg-danger"}>{present ? "Present" : "Absent"}</span>
      ),
    },
  ];

  const selectedExam = exams.find(exam => exam.id === selectedExamId);

  return (
    <ErrorBoundary>
      <ToastContainer />
      <style>{dropdownStyles}</style>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Exam Attendance</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Report</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Exam Attendance
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
            </div>
          </div>
          {/* Class selection for admin/teacher */}
          {(obj.role === "admin" || obj.role === "teacher") && (
            <div className="mb-3">
              <label className="form-label">Select Class</label>
              <select
                className="form-control"
                value={selectedClassId}
                onChange={e => {
                  setSelectedClassId(e.target.value);
                  setSelectedExamId("");
                }}
                disabled={loading}
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} {cls.section ? `- ${cls.section}` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
          {/* Combined search and select exam for admin/teacher */}
          {(obj.role === "admin" || obj.role === "teacher") && selectedClassId && (
            <div className="mb-3">
              <label className="form-label">Search & Select Exam</label>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by exam name or subject..."
                  value={examSearch}
                  onChange={e => setExamSearch(e.target.value)}
                  onFocus={() => setShowExamDropdown(true)}
                  onBlur={() => setTimeout(() => setShowExamDropdown(false), 200)}
                />
                {selectedExam && (
                  <div className="mt-2">
                    <small className="text-muted">
                      Selected: {selectedExam.title} ({selectedExam.subjectName || selectedExam.subjectId}) - {formatDate(selectedExam.startTime || selectedExam.date)}
                    </small>
                  </div>
                )}
                {showExamDropdown && (
                  <div className="position-absolute w-100 bg-white border rounded shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                    {filteredExams.length === 0 ? (
                      <div className="p-2 text-muted">No exams found</div>
                    ) : (
                      filteredExams.map(exam => (
                        <div
                          key={exam.id}
                          className="p-2 border-bottom exam-dropdown-item"
                          style={{ cursor: 'pointer' }}
                          onMouseDown={() => handleExamSelect(exam.id)}
                        >
                          <div className="fw-medium">{exam.title}</div>
                          <div className="small text-muted">
                            {exam.subjectName || exam.subjectId} • {formatDate(exam.startTime || exam.date)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="attendance-types page-header justify-content-end">
            <ul className="attendance-type-list">
              <li>
                <span className="attendance-icon bg-success">
                  <i className="ti ti-checks" />
                </span>
                Present
              </li>
              <li>
                <span className="attendance-icon bg-danger">
                  <i className="ti ti-x" />
                </span>
                Absent
              </li>
              <li>
                <span className="attendance-icon bg-pending">
                  <i className="ti ti-clock-x" />
                </span>
                Late
              </li>
            </ul>
          </div>
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Exam Attendance</h4>
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
                              <CommonSelect className="select" options={allClass} />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Section</label>
                              <CommonSelect className="select" options={classSection} />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Exam Type</label>
                              <CommonSelect className="select" options={weeklytest} />
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
                <Skeleton />
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : attendance.length === 0 ? (
                <div className="alert alert-info">{(obj.role === "admin" || obj.role === "teacher") && !selectedExamId ? "Please select a class and exam to view attendance." : "No attendance records found."}</div>
              ) : (
                <Table columns={columns} dataSource={attendance} Selection={true} />
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ExamAttendance;
