import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import TooltipOption from "../../../core/common/tooltipOption";
import PredefinedDateRanges from "../../../core/common/datePicker";
import CommonSelect from "../../../core/common/commonSelect";
import Table from "../../../core/common/dataTable/index";
import useMobileDetection from "../../../core/common/mobileDetection";
import { TableData } from "../../../core/data/interface";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getStudentId } from "../../../utils/general";

const AttendanceReport = () => {
  const routes = all_routes;
  const isMobile = useMobileDetection();
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState<TableData[]>([]);
  const [filterData, setFilterData] = useState({
    class: "",
    section: "",
    name: "",
    dateRange: "",
  });

  // Sample options for filters
  const allClass = [
    { value: "class-1", label: "Class 1" },
    { value: "class-2", label: "Class 2" },
    { value: "class-3", label: "Class 3" },
  ];

  const allSection = [
    { value: "section-a", label: "Section A" },
    { value: "section-b", label: "Section B" },
    { value: "section-c", label: "Section C" },
  ];

  const names = [
    { value: "john-smith", label: "John Smith" },
    { value: "sarah-johnson", label: "Sarah Johnson" },
  ];

  const AttendanceTypeList = [
    { value: "present", label: "Present" },
    { value: "absent", label: "Absent" },
    { value: "late", label: "Late" },
    { value: "halfday", label: "Half Day" },
  ];

  const count = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "15", label: "15" },
    { value: "20", label: "20" },
  ];

  const renderTitle = (date: string, day: string) => (
    <div className="text-center">
      <div className="fw-bold">{date}</div>
      <div className="text-muted small">{day}</div>
    </div>
  );

  const handleFilterChange = (field: string, value: string) => {
    setFilterData(prev => ({ ...prev, [field]: value }));
  };

  const handleExport = (type: 'pdf' | 'excel') => {
    toast.info(`Exporting as ${type.toUpperCase()}...`, { autoClose: 2000 });
    // Add export logic here
  };

  const handleFilterSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API endpoint
      const studentId = getStudentId();
      if (!studentId) {
        toast.error("Please select a student first");
        return;
      }

      // TODO: Replace with actual API call
      // const response = await getAttendanceReport(studentId, filterData);
      // setAttendanceData(response.data);

      // For now, show empty state
      setAttendanceData([]);
      toast.success("Filters applied successfully!");
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error("Failed to fetch attendance data");
      setAttendanceData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "Student/Date",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 200,
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <div className="avatar avatar-md me-2">
            <ImageWithBasePath
              src={record.img || "/assets/img/profiles/avatar-default.jpg"}
              className="img-fluid rounded-circle"
              alt="img"
            />
          </div>
          <div>
            <p className="text-dark mb-0 fw-medium">{text}</p>
            <small className="text-muted">Student ID: {record.key}</small>
          </div>
        </div>
      ),
    },
    {
      title: "Attendance %",
      dataIndex: "percentage",
      key: "percentage",
      width: 120,
      render: (text: string, record: any) => (
        <div className="text-center">
          <span className={`badge ${record.percentClass === 'text-success' ? 'bg-success' : 'bg-warning'} fs-6`}>
            {text}
          </span>
        </div>
      ),
    },
    {
      title: "Summary",
      key: "summary",
      width: 200,
      render: (text: string, record: any) => (
        <div className="d-flex gap-2 justify-content-center">
          <span className="badge bg-success">P: {record.p}</span>
          <span className="badge bg-warning">L: {record.l}</span>
          <span className="badge bg-danger">A: {record.a}</span>
          <span className="badge bg-dark">H: {record.h}</span>
          <span className="badge bg-info">F: {record.f}</span>
        </div>
      ),
    },
    {
      title: () => renderTitle("01", "M"),
      dataIndex: "m01",
      key: "m01",
      width: 60,
      render: (text: string) => (
        <div className="text-center">
          {text === "1" ? (
            <span className="attendance-dot bg-success" title="Present"></span>
          ) : text === "2" ? (
            <span className="attendance-dot bg-warning" title="Late"></span>
          ) : text === "3" ? (
            <span className="attendance-dot bg-dark" title="Half Day"></span>
          ) : text === "4" ? (
            <span className="attendance-dot bg-danger" title="Absent"></span>
          ) : (
            <span className="attendance-dot bg-info" title="Holiday"></span>
          )}
        </div>
      ),
    },
    {
      title: () => renderTitle("02", "T"),
      dataIndex: "t02",
      key: "t02",
      width: 60,
      render: (text: string) => (
        <div className="text-center">
          {text === "1" ? (
            <span className="attendance-dot bg-success" title="Present"></span>
          ) : text === "2" ? (
            <span className="attendance-dot bg-warning" title="Late"></span>
          ) : text === "3" ? (
            <span className="attendance-dot bg-dark" title="Half Day"></span>
          ) : text === "4" ? (
            <span className="attendance-dot bg-danger" title="Absent"></span>
          ) : (
            <span className="attendance-dot bg-info" title="Holiday"></span>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col-md-6">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Attendance Report</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Report</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Attendance Report
                  </li>
                </ol>
              </nav>
            </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex justify-content-end align-items-center flex-wrap gap-2">
              <TooltipOption />
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-primary dropdown-toggle"
                      type="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-file-export me-2" />
                  Export
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button 
                          className="dropdown-item" 
                          onClick={() => handleExport('pdf')}
                        >
                          <i className="ti ti-file-type-pdf me-2" />
                      Export as PDF
                        </button>
                  </li>
                  <li>
                        <button 
                          className="dropdown-item" 
                          onClick={() => handleExport('excel')}
                        >
                          <i className="ti ti-file-type-xls me-2" />
                          Export as Excel
                        </button>
                  </li>
                </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="ti ti-filter me-2" />
                Filters
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                              <label className="form-label">Class</label>
                              <CommonSelect
                    className="form-select"
                                options={allClass}
                    value={filterData.class}
                    onChange={(value) => handleFilterChange('class', value)}
                    placeholder="Select Class"
                              />
                            </div>
                <div className="col-md-3">
                              <label className="form-label">Section</label>
                              <CommonSelect
                    className="form-select"
                                options={allSection}
                    value={filterData.section}
                    onChange={(value) => handleFilterChange('section', value)}
                    placeholder="Select Section"
                              />
                            </div>
                <div className="col-md-3">
                  <label className="form-label">Student Name</label>
                              <CommonSelect
                    className="form-select"
                                options={names}
                    value={filterData.name}
                    onChange={(value) => handleFilterChange('name', value)}
                    placeholder="Select Student"
                              />
                            </div>
                <div className="col-md-3">
                  <label className="form-label">Date Range</label>
                  <PredefinedDateRanges />
                          </div>
                <div className="col-12">
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-primary" 
                      onClick={handleFilterSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Applying...
                        </>
                      ) : (
                        <>
                          <i className="ti ti-search me-2" />
                          Apply Filters
                        </>
                      )}
                    </button>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => setFilterData({ class: "", section: "", name: "", dateRange: "" })}
                    >
                      <i className="ti ti-refresh me-2" />
                      Clear Filters
                    </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

          {/* Attendance Legend */}
          <div className="card mb-4">
            <div className="card-body">
              <h6 className="card-title mb-3">Attendance Legend</h6>
              <div className="d-flex flex-wrap gap-3">
                <div className="d-flex align-items-center">
                  <span className="attendance-dot bg-success me-2" title="Present"></span>
                  <span>Present</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="attendance-dot bg-danger me-2" title="Absent"></span>
                  <span>Absent</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="attendance-dot bg-warning me-2" title="Late"></span>
                  <span>Late</span>
                      </div>
                <div className="d-flex align-items-center">
                  <span className="attendance-dot bg-dark me-2" title="Half Day"></span>
                  <span>Half Day</span>
                  </div>
                <div className="d-flex align-items-center">
                  <span className="attendance-dot bg-info me-2" title="Holiday"></span>
                  <span>Holiday</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Attendance Report</h5>
                <div className="d-flex gap-2">
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-secondary dropdown-toggle"
                      type="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-sort-ascending-2 me-2" />
                      Sort by
                    </button>
                    <ul className="dropdown-menu">
                      <li><button className="dropdown-item">Name A-Z</button></li>
                      <li><button className="dropdown-item">Name Z-A</button></li>
                      <li><button className="dropdown-item">Attendance %</button></li>
                      <li><button className="dropdown-item">Recently Updated</button></li>
                  </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              {isLoading ? (
                <div className="text-center p-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading attendance data...</p>
                </div>
              ) : attendanceData.length > 0 ? (
                <div className="table-responsive">
                  <Table 
                    dataSource={attendanceData} 
                    columns={columns} 
                    Selection={false}
                    loading={isLoading}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => 
                        `${range[0]}-${range[1]} of ${total} items`,
                    }}
                  />
                </div>
              ) : (
                <div className="text-center p-5">
                  <div className="mb-4">
                    <i className="ti ti-calendar-off fs-1 text-muted"></i>
                  </div>
                  <h5 className="text-muted mb-3">No Attendance Data Available</h5>
                  <p className="text-muted mb-4">
                    No attendance records found for the selected criteria. 
                    Please try adjusting your filters or contact the administrator.
                  </p>
                  <div className="d-flex justify-content-center gap-2">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => setFilterData({ class: "", section: "", name: "", dateRange: "" })}
                    >
                      <i className="ti ti-refresh me-2" />
                      Clear Filters
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={handleFilterSubmit}
                    >
                      <i className="ti ti-search me-2" />
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .attendance-dot {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          cursor: pointer;
        }
        
        .card {
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .card-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px 12px 0 0 !important;
        }
        
        .btn {
          border-radius: 8px;
          font-weight: 500;
        }
        
        .form-select, .form-control {
          border-radius: 8px;
        }
        
        .table-responsive {
          border-radius: 0 0 12px 12px;
        }
        
        @media (max-width: 768px) {
          .page-header .row {
            flex-direction: column;
            align-items: stretch;
          }
          
          .d-flex.gap-2 {
            flex-wrap: wrap;
          }
          
          .attendance-dot {
            width: 10px;
            height: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default AttendanceReport;
