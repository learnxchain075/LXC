import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageWithBasePath from "../../../../../core/common/imageWithBasePath";
import { all_routes } from "../../../../../router/all_routes";
import Table from "../../../../../core/common/dataTable/index";
import { TableData } from "../../../../../core/data/interface";
// import { Studentlist } from '../../../../core/data/json/studentList';
import CommonSelect from '../../../../../core/common/commonSelect';

import { status, promotion, academicYear, allSection } from '../../../../../core/common/selectoption/selectoption';


import PredefinedDateRanges from '../../../../../core/common/datePicker';
import TooltipOption from '../../../../../core/common/tooltipOption';


import { bulkPromoteClass } from '../../../../../services/admin/studentPromotionApi';
import { getClasses } from '../../../../../services/teacher/classServices';
import { getSections } from '../../../../../services/teacher/sectionServices';
// import { bulkPromoteClass } from '../../../../services/admin/studentPromotionApi';
import { useSelector } from 'react-redux';

// Error Boundary Component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Student Promotion Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger m-3">
          <h5>Something went wrong with Student Promotion.</h5>
          <p>Please try refreshing the page or contact support.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const StudentPromotion = () => {
  const { isDark } = useSelector((state: any) => state.theme);
  const [isPromotion, setIsPromotion] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [classOptions, setClassOptions] = useState<{ value: string; label: string }[]>([]);
  const [fromSections, setFromSections] = useState<{ value: string; label: string }[]>([]);
  const [toSections, setToSections] = useState<{ value: string; label: string }[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [form, setForm] = useState({
    fromClassId: "",
    toClassId: "",
    fromSection: "",
    toSection: "",
    academicYear: "2024-2025",
    toSession: "2025-2026",
  });
  const routes = all_routes;

 
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoading(true);
        const res = await getClasses();
        const mapped = res.data.map((c: any) => ({ value: c.id, label: c.name }));
        setClassOptions(mapped);
      } catch (error: any) {
        console.error('Failed to load classes:', error);
        toast.error('Failed to load classes. Please try again.');
        setClassOptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadClasses();
  }, []);

 
  useEffect(() => {
    const loadFromSections = async () => {
      if (!form.fromClassId) {
        setFromSections([]);
        return;
      }

      try {
        setLoading(true);
        const res = await getSections(form.fromClassId);
        const mapped = res.data.map((s: any) => ({ value: s.id, label: s.name }));
        setFromSections(mapped);
      } catch (error: any) {
        console.error('Failed to load from sections:', error);
        toast.error('Failed to load sections. Please try again.');
        setFromSections([]);
      } finally {
        setLoading(false);
      }
    };

    loadFromSections();
  }, [form.fromClassId]);

 
  useEffect(() => {
    const loadToSections = async () => {
      if (!form.toClassId) {
        setToSections([]);
        return;
      }

      try {
        setLoading(true);
        const res = await getSections(form.toClassId);
        const mapped = res.data.map((s: any) => ({ value: s.id, label: s.name }));
        setToSections(mapped);
      } catch (error: any) {
        console.error('Failed to load to sections:', error);
        toast.error('Failed to load sections. Please try again.');
        setToSections([]);
      } finally {
        setLoading(false);
      }
    };

    loadToSections();
  }, [form.toClassId]);

  const handlePromoteStudents = async () => {
    if (!form.fromClassId || !form.toClassId || !form.fromSection || !form.toSection) {
      toast.error('Please fill in all required fields before promoting students.');
      return;
    }

    try {
      setLoading(true);
      const response = await bulkPromoteClass({
        fromClassId: form.fromClassId,
        toClassId: form.toClassId,
        fromSection: form.fromSection,
        toSection: form.toSection,
        academicYear: form.academicYear,
        toSession: form.toSession,
        excludeIds: selectedStudents.length > 0 ? selectedStudents : undefined,
      });

      if (response.data?.message) {
        toast.success(`Successfully promoted ${response.data.count || 0} students!`);
        setIsPromotion(false);
        // Reset form
        setForm({
          fromClassId: "",
          toClassId: "",
          fromSection: "",
          toSection: "",
          academicYear: "2024-2025",
          toSession: "2025-2026",
        });
        setSelectedStudents([]);
      } else {
        toast.error('Failed to promote students. Please try again.');
      }
    } catch (error: any) {
      console.error("Promotion error:", error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to promote students. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelection = (studentId: string, selected: boolean) => {
    if (selected) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedStudents(students.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const columns = [
    {
      title: "Admission No",
      dataIndex: "AdmissionNo",
      render: (text: string) => (
        <Link to={routes.studentDetail} className="link-primary">
          {text}
        </Link>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.AdmissionNo.length - b.AdmissionNo.length,
    },
    {
      title: "Roll No",
      dataIndex: "RollNo",
      sorter: (a: TableData, b: TableData) =>
        a.RollNo.length - b.RollNo.length,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link to="#" className="avatar avatar-md">
            <ImageWithBasePath
              src={record.imgSrc}
              className="img-fluid rounded-circle"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className={`mb-0 ${isDark ? 'text-light' : 'text-dark'}`}>
              <Link to="#">{text}</Link>
            </p>
          </div>
        </div>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.name.length - b.name.length,
    },
    {
      title: "Class",
      dataIndex: "class",
      sorter: (a: TableData, b: TableData) =>
        a.class.length - b.class.length,
    },
    {
      title: "Section",
      dataIndex: "section",
      sorter: (a: TableData, b: TableData) =>
        a.section.length - b.section.length,
    },

    {
      title: "Exam Result",
      dataIndex: "result",
      render: (text: string) => (
        <>
          {text === "Pass" ? (
            <span
              className="badge badge-soft-success d-inline-flex align-items-center"
            >
              <i className='ti ti-circle-filled fs-5 me-1'></i>{text}
            </span>
          ) :
            (
              <span
                className="badge badge-soft-danger d-inline-flex align-items-center"
              >
                <i className='ti ti-circle-filled fs-5 me-1'></i>{text}
              </span>
            )}
        </>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.result.length - b.result.length,
    },
    {
      title: "Action",
      dataIndex: "promotion",
      render: (res: any, record: any) => (
        <div className="table-select mb-0">
          <CommonSelect
            className="select"
            options={promotion}
            defaultValue={promotion[res]}
            onChange={(option) => {
              if (option?.value === 'promote') {
                handleStudentSelection(record.id, true);
              } else if (option?.value === 'exclude') {
                handleStudentSelection(record.id, false);
              }
            }}
          />
        </div>
      ),

    },
  ];
  return (
    <ErrorBoundary>
      <div className={`page-wrapper ${isDark ? 'dark-mode' : ''}`}>
        <ToastContainer 
          position="top-center" 
          autoClose={3000} 
          theme={isDark ? 'dark' : 'colored'}
          toastClassName={`${isDark ? 'bg-dark text-light' : ''}`}
        />
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
                <div className="my-auto mb-2">
                  <h3 className={`page-title mb-1 ${isDark ? 'text-light' : ''}`}>Student Promotion</h3>
                  <nav>
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <Link to={routes.adminDashboard} className={isDark ? 'text-light' : ''}>Dashboard</Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link to="#" className={isDark ? 'text-light' : ''}>Students</Link>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Student Promotion
                      </li>
                    </ol>
                  </nav>
                </div>
                <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                  <TooltipOption />
                  <Link to={routes.studentList} className="btn btn-light ms-2">
                    Exit
                  </Link>

                </div>
              </div>
              <div className={`alert alert-outline-primary bg-primary-transparent p-2 d-flex align-items-center flex-wrap row-gap-2 mb-4 ${isDark ? 'bg-dark border-primary' : ''}`}>
                <i className="ti ti-info-circle me-1" />
                <strong>Note :</strong> Prompting Student from the Present class to
                the Next Class will Create an enrollment of the student to the next
                Session
              </div>
              <div className={`card ${isDark ? 'bg-dark text-light border-secondary' : ''}`}>
                <div className="card-header border-0 pb-0">
                  <div className={`bg-light-gray p-3 rounded ${isDark ? 'bg-secondary' : ''}`}>
                    <h4>Promotion</h4>
                    <p>Select a Class to Promote next session and new class</p>
                  </div>
                </div>
                <div className="card-body">
                  <form >
                    <div className="d-md-flex align-items-center justify-content-between">
                      <div className="card flex-fill w-100">
                        <div className="card-body">
                          <div className="mb-3">
                            <label className="form-label">
                              Current Session <span className="text-danger">*</span>
                            </label>
                            <div className="form-control-plaintext p-0">
                              2024 - 2025
                            </div>
                          </div>
                          <div>
                            <label className="form-label mb-2">
                              Promotion from Class
                              <span className="text-danger"> *</span>
                            </label>
                            <div className="d-block d-md-flex">
                              <div className=" flex-fill me-md-3 me-0 mb-0">
                                <label className="form-label">Class</label>
                                <CommonSelect
                                  className="select"
                                  options={classOptions}
                                  onChange={(o) => setForm({ ...form, fromClassId: o?.value || "" })}
                                />
                              </div>
                              <div className=" flex-fill mb-0">
                                <label className="form-label">Section</label>
                                <CommonSelect
                                  className="select"
                                  options={fromSections}
                                  onChange={(o) => setForm({ ...form, fromSection: o?.value || "" })}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Link
                        to="#"
                        className="badge bg-primary badge-xl exchange-link text-white d-flex align-items-center justify-content-center mx-md-4 mx-auto my-md-0 my-4 flex-shrink-0"
                      >
                        <span>
                          <i className="ti ti-arrows-exchange fs-16" />
                        </span>
                      </Link>
                      <div className="card flex-fill w-100">
                        <div className="card-body">
                          <div className="mb-3">
                            <label className="form-label">
                              Promote to Session{" "}
                              <span className="text-danger"> *</span>
                            </label>
                            <CommonSelect
                              className="select"
                              options={academicYear}
                              onChange={(o) => setForm({ ...form, toSession: o?.value || "" })}
                              defaultValue={academicYear[0]}
                            />
                          </div>
                          <div>
                            <label className="form-label mb-2">
                              Promotion to Class
                              <span className="text-danger"> *</span>
                            </label>
                            <div className="d-block d-md-flex">
                              <div className="flex-fill me-md-3 me-0 mb-0">
                                <label className="form-label">Class</label>
                                <CommonSelect
                                  className="select"
                                  options={classOptions}
                                  onChange={(o) => setForm({ ...form, toClassId: o?.value || "" })}
                                />
                              </div>
                              <div className=" flex-fill ">
                                <label className="form-label">Section</label>
                                <CommonSelect
                                  className="select"
                                  options={toSections}
                                  onChange={(o) => setForm({ ...form, toSection: o?.value || "" })}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="manage-promote-btn d-flex justify-content-center flex-wrap row-gap-2">
                        <button
                          type="reset"
                          className="btn btn-light reset-promote me-3"
                          onClick={() => {
                            setIsPromotion(false);
                            setForm({
                              fromClassId: "",
                              toClassId: "",
                              fromSection: "",
                              toSection: "",
                              academicYear: "2024-2025",
                              toSession: "2025-2026",
                            });
                            setSelectedStudents([]);
                          }}
                          disabled={loading}
                        >
                          Reset Promotion
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary promote-students-btn"
                          onClick={() => {
                            if (!form.fromClassId || !form.toClassId || !form.fromSection || !form.toSection) {
                              toast.error('Please fill in all required fields before proceeding.');
                              return;
                            }
                            setIsPromotion(true);
                          }}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Loading...
                            </>
                          ) : (
                            'Manage Promotion'
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className={`promote-card-main ${isPromotion && 'promote-card-main-show'}`}>
                <div className={`card ${isDark ? 'bg-dark text-light border-secondary' : ''}`}>
                  <div className="card-header border-0 pb-0">
                    <div className={`bg-light-gray p-3 rounded ${isDark ? 'bg-secondary' : ''}`}>
                      <h4>Map Class Sections</h4>
                      <p>Select section mapping of old class to new class</p>
                    </div>
                  </div>
                  <div className="card-body pb-2">
                    <form >
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="card w-100">
                          <div className="card-body">
                            <div className="mb-3">
                              <label className="form-label">
                                From Class<span className="text-danger">*</span>
                              </label>
                              <div className="form-control-plaintext p-0">
                                {classOptions.find(c => c.value === form.fromClassId)?.label || 'Not selected'}
                              </div>
                            </div>
                            <div className="mb-0">
                              <label className="form-label d-block mb-3">
                                Promotion from Section
                                <span className="text-danger"> *</span>
                              </label>
                              <label className="form-label d-block mb-2">
                                Student From Section
                                <span className="text-danger"> *</span>
                              </label>
                              <div className="form-control-plaintext p-0">
                                {fromSections.find(s => s.value === form.fromSection)?.label || 'Not selected'}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Link
                          to="#"
                          className="badge bg-primary badge-xl exchange-link text-white d-flex align-items-center justify-content-center mx-md-4 mx-auto my-md-0 my-4 flex-shrink-0"
                        >
                          <span>
                            <i className="ti ti-arrows-exchange fs-16" />
                          </span>
                        </Link>
                        <div className="card w-100">
                          <div className="card-body">
                            <div className="mb-3">
                              <label className="form-label">
                                Promote to Session{" "}
                                <span className="text-danger"> *</span>
                              </label>
                              <div className="form-control-plaintext p-0">
                                {form.toSession}
                              </div>
                            </div>
                            <div>
                              <label className="form-label mb-2">
                                Assign to Section
                                <span className="text-danger"> *</span>
                              </label>
                              <div className="d-block d-md-flex">
                                <div className=" flex-fill me-0">
                                  <label className="form-label">Class</label>
                                  <div className="form-control-plaintext p-0">
                                    {classOptions.find(c => c.value === form.toClassId)?.label || 'Not selected'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                {/* Students List */}
                <div className={`card ${isDark ? 'bg-dark text-light border-secondary' : ''}`}>
                  <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                    <h4 className="mb-3">Students List</h4>
                    <div className="d-flex align-items-center flex-wrap">
                      <div className="input-icon-start mb-3 me-2 position-relative">

                        <PredefinedDateRanges />
                      </div>
                      <div className="dropdown mb-3">
                        <Link
                          to="#"
                          className={`btn btn-outline-light dropdown-toggle ${isDark ? 'bg-dark text-light border-secondary' : 'bg-white'}`}
                          data-bs-toggle="dropdown"
                        >
                          <i className="ti ti-sort-ascending-2 me-2" />
                          Sort by A-Z{" "}
                        </Link>
                        <ul className={`dropdown-menu p-3 ${isDark ? 'bg-dark text-light' : ''}`}>
                          <li>
                            <Link
                              to="#"
                              className="dropdown-item rounded-1"
                            >
                              Ascending
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className="dropdown-item rounded-1"
                            >
                              Descending
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className="dropdown-item rounded-1"
                            >
                              Recently Viewed
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className="dropdown-item rounded-1"
                            >
                              Recently Added
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-0 py-3">
                    {/* Student List */}
                    {students.length > 0 ? (
                      <Table 
                        dataSource={students} 
                        columns={columns} 
                        Selection={true}
                      />
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted">No students found for the selected criteria.</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* /Students List */}
                <div className="promoted-year text-center">
                  <p>
                    Selected Students will be promoted to {form.toSession} Academic Session
                  </p>
                  <Link
                    to="#"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#student_promote"
                    onClick={(e) => {
                      if (selectedStudents.length === 0) {
                        e.preventDefault();
                        toast.warning('Please select at least one student to promote.');
                      }
                    }}
                  >
                    Promote Students ({selectedStudents.length})
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="student_promote">
        <div className="modal-dialog modal-dialog-centered">
          <div className={`modal-content ${isDark ? 'bg-dark text-light' : ''}`}>
            <div className="modal-body text-center">
              <h4>Confirm Promotion</h4>
              <p>
                Are you sure you want to promote {selectedStudents.length} selected students to the next
                academic session?
              </p>
              <div className="d-flex justify-content-center">
                <Link
                  to="#"
                  className="btn btn-light me-3"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <button
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                  onClick={handlePromoteStudents}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Promoting...
                    </>
                  ) : (
                    'Promote'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}


export default StudentPromotion

