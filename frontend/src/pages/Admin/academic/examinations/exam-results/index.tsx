import React, { useEffect, useRef, useState } from "react";
import ImageWithBasePath from '../../../../../core/common/imageWithBasePath';
import { Link } from 'react-router-dom';
import PredefinedDateRanges from '../../../../../core/common/datePicker';
import CommonSelect from '../../../../../core/common/commonSelect';
import { all_routes } from '../../../../../router/all_routes';
import TooltipOption from '../../../../../core/common/tooltipOption';
import useMobileDetection from '../../../../../core/common/mobileDetection';
import { useSelector } from 'react-redux';
import { getExamResults } from "../../../../../services/teacher/examallApi";
import { getExams } from "../../../../../services/teacher/examServices";
import { IExam } from "../../../../../services/types/teacher/examService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Table as AntdTable } from 'antd';
import type { ExamResult } from '../../../../../services/teacher/examallApi';
import type { ColumnType } from 'antd/es/table';
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

interface Exam {
  id: string;
  title: string;
  subjectId: string;
  createdAt: string;
}

const ExamResult = ({ teacherdata }: { teacherdata?: any }) => {
  const routes = all_routes;
  const obj = useSelector((state: any) => state.auth.userObj);
  const ismobile = useMobileDetection();

  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [examSearch, setExamSearch] = useState<string>("");
  const [showExamDropdown, setShowExamDropdown] = useState(false);
  const [filterFormData, setFilterFormData] = useState<{
    classId: string;
    sectionId: string;
    examTitle: string;
  }>({ classId: "", sectionId: "", examTitle: "" });
  const [filterErrors, setFilterErrors] = useState<{
    classId?: string;
    sectionId?: string;
    examTitle?: string;
  }>({});
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const filterFormRef = useRef<HTMLFormElement | null>(null);

  const columns: ColumnType<ExamResult>[] = [
    {
      title: "Student",
      dataIndex: "studentName",
      key: "studentName",
      sorter: (a: ExamResult, b: ExamResult) => a.studentId.localeCompare(b.studentId),
      filterSearch: true,
      onFilter: (value: boolean | React.Key, record: ExamResult) =>
        record.studentId.includes(String(value)),
    },
    {
      title: "Exam Name",
      dataIndex: "examId",
      key: "examId",
      render: (examId: string) => exams.find((exam) => exam.id === examId)?.title || examId,
      sorter: (a: ExamResult, b: ExamResult) => {
        const examA = exams.find((exam) => exam.id === a.examId)?.title || "";
        const examB = exams.find((exam) => exam.id === b.examId)?.title || "";
        return examA.localeCompare(examB);
      },
    },
    {
      title: "Marks Obtained",
      dataIndex: "score",
      key: "score",
      sorter: (a: any, b: any) => (a.score ?? 0) - (b.score ?? 0),
      render: (score: any) => (
        <span className={typeof score === 'number' && score >= 33 ? "text-success" : "text-danger"}>{typeof score === 'number' ? score : '-'}</span>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => {
        const d = new Date(date);
        return isNaN(d.getTime()) ? '-' : d.toLocaleDateString();
      },
      sorter: (a: ExamResult, b: ExamResult) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => {
        if (!date) return '-';
        const d = new Date(date);
        return isNaN(d.getTime()) ? '-' : d.toLocaleDateString();
      },
      sorter: (a: ExamResult, b: ExamResult) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
  ];

  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [results, setResults] = useState<ExamResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        toast.error("Failed to load classes", { position: "top-right", autoClose: 3000 });
      }
    };
    if (obj.role === "admin" || obj.role === "teacher") fetchClasses();
  }, [obj.role, obj.id]);

  // Fetch exams for selected class
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
          setExams(
            res.data.map((exam: any) => ({
              id: exam.id,
              title: exam.title,
              subjectId: exam.subjectName || exam.subjectId || "",
              createdAt: exam.startTime || exam.createdAt || new Date().toISOString(),
            }))
          );
        } else if (obj.role === "student") {
          setExams([]);
        }
      } catch (e: any) {
        setExams([]);
        setError(e.message || "Failed to load exams");
        toast.error("Failed to load exams", { position: "top-right", autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };
    if (obj.role === "admin" || obj.role === "teacher") fetchExamsList();
  }, [selectedClassId, obj.role]);

  // Fetch results for selected exam
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        let res;
        if (obj.role === "student") {
          res = await getExamResults();
          setResults(res.data.map((r: any) => ({ ...r, score: r.score ?? r.marksObtained ?? 0 })));
        } else if (selectedExamId) {
          res = await getExamResults(selectedExamId);
          setResults(res.data.map((r: any) => ({ ...r, score: r.score ?? r.marksObtained ?? 0 })));
        } else {
          setResults([]);
        }
        setFilteredResults(res?.data || []);
      } catch (e: any) {
        setResults([]);
        setFilteredResults([]);
        setError(e.message || "Failed to load results");
        toast.error("Failed to load results", { position: "top-right", autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };
    if ((obj.role === "admin" || obj.role === "teacher") && !selectedExamId) {
      setResults([]);
      setFilteredResults([]);
      return;
    }
    fetchResults();
  }, [selectedExamId, obj.role, obj.id]);

  // Filter exams for search
  const filteredExams = exams.filter(
    (exam) =>
      exam.title.toLowerCase().includes(examSearch.toLowerCase()) ||
      exam.subjectId.toLowerCase().includes(examSearch.toLowerCase()) ||
      formatDate(exam.createdAt).toLowerCase().includes(examSearch.toLowerCase())
  );

  const handleExamSelect = (examId: string) => {
    setSelectedExamId(examId);
    setShowExamDropdown(false);
    setExamSearch("");
  };

  // Handle filter form submission
  const handleApplyClick = () => {
    const errors: { classId?: string; sectionId?: string; examTitle?: string } = {};
    if (!filterFormData.classId) errors.classId = "Please select a class";
    if (filterFormData.classId && !filterFormData.sectionId) {
      const selectedClass = classes.find((cls) => cls.id === filterFormData.classId);
      if (selectedClass?.section) errors.sectionId = "Please select a section";
    }
    if (!filterFormData.examTitle) errors.examTitle = "Please select an exam";

    setFilterErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the filter errors", { position: "top-right", autoClose: 3000 });
      return;
    }

    // Apply filters to results
    const filtered = results.filter((result) => {
      const exam = exams.find((e) => e.id === result.examId);
      const classMatch = filterFormData.classId ? ((exam as any)?.classId || '') === filterFormData.classId : true;
      const sectionMatch = filterFormData.sectionId
        ? classes.find((c) => c.id === ((exam as any)?.classId || ''))?.section === filterFormData.sectionId
        : true;
      const examMatch = filterFormData.examTitle ? exam?.title === filterFormData.examTitle : true;
      return classMatch && sectionMatch && examMatch;
    });

    setFilteredResults(filtered);

    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }

    // Reset the filter form
    if (filterFormRef.current) {
      filterFormRef.current.reset();
    }
    setFilterFormData({ classId: "", sectionId: "", examTitle: "" });
  };

  // Reset filter form
  const handleResetClick = () => {
    setFilterFormData({ classId: "", sectionId: "", examTitle: "" });
    setFilterErrors({});
    setFilteredResults(results);
    if (filterFormRef.current) {
      filterFormRef.current.reset();
    }
  };

  // Get available sections for the selected class in filter
  const getAvailableSections = (classId: string) => {
    const selectedClass = classes.find((cls) => cls.id === classId);
    return selectedClass && selectedClass.section
      ? [{ value: selectedClass.section, label: selectedClass.section }]
      : [];
  };

  // In the rendering logic for the table, filter results by selectedExamId
  const displayedResults = selectedExamId
    ? filteredResults.filter((result) => result.examId === selectedExamId)
    : [];

  const selectedExam = exams.find(exam => exam.id === selectedExamId);

  return (
    <ErrorBoundary>
      <ToastContainer />
      <style>{dropdownStyles}</style>
      <div className={ismobile || obj.role === "admin" ? "page-wrapper" : "pt-4"}>
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Exam Results</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Exam Results
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
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  setSelectedExamId("");
                  setFilterFormData({ classId: "", sectionId: "", examTitle: "" });
                  setFilteredResults(results);
                }}
                disabled={loading}
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
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
                  placeholder="Search by exam name, subject, or date..."
                  value={examSearch}
                  onChange={(e) => setExamSearch(e.target.value)}
                  onFocus={() => setShowExamDropdown(true)}
                  onBlur={() => setTimeout(() => setShowExamDropdown(false), 200)}
                />
                {selectedExam && (
                  <div className="mt-2">
                    <small className="text-muted">
                      Selected: {selectedExam.title} ({selectedExam.subjectId}) - {formatDate(selectedExam.createdAt)}
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
                            {exam.subjectId} • {formatDate(exam.createdAt)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Exam Results</h4>
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
                    <form ref={filterFormRef}>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 border-bottom pb-0">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Class</label>
                              <select
                                className="form-control"
                                value={filterFormData.classId}
                                onChange={(e) =>
                                  setFilterFormData((prev) => ({
                                    ...prev,
                                    classId: e.target.value,
                                    sectionId: "",
                                  }))
                                }
                              >
                                <option value="">Select Class</option>
                                {classes.map((cls) => (
                                  <option key={cls.id} value={cls.id}>
                                    {cls.name}
                                  </option>
                                ))}
                              </select>
                              {filterErrors.classId && (
                                <span className="text-danger">{filterErrors.classId}</span>
                              )}
                            </div>
                          </div>
                          {filterFormData.classId && getAvailableSections(filterFormData.classId).length > 0 && (
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Section</label>
                                <select
                                  className="form-control"
                                  value={filterFormData.sectionId}
                                  onChange={(e) =>
                                    setFilterFormData((prev) => ({
                                      ...prev,
                                      sectionId: e.target.value,
                                    }))
                                  }
                                >
                                  <option value="">Select Section</option>
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
                              <label className="form-label">Exam Title</label>
                              <select
                                className="form-control"
                                value={filterFormData.examTitle}
                                onChange={(e) =>
                                  setFilterFormData((prev) => ({
                                    ...prev,
                                    examTitle: e.target.value,
                                  }))
                                }
                              >
                                <option value="">Select Exam</option>
                                {exams.map((exam) => (
                                  <option key={exam.id} value={exam.title}>
                                    {exam.title}
                                  </option>
                                ))}
                              </select>
                              {filterErrors.examTitle && (
                                <span className="text-danger">{filterErrors.examTitle}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <Link to="#" className="btn btn-light me-3" onClick={handleResetClick}>
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
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {loading ? (
                <Skeleton />
              ) : displayedResults.length === 0 ? (
                <div className="alert alert-info">
                  {selectedExamId ? "No results found." : "Please select a class and exam to view results."}
                </div>
              ) : (
                <AntdTable
                  columns={columns}
                  dataSource={displayedResults}
                  rowKey="id"
                  pagination={{
                    total: displayedResults.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} results`,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ExamResult;