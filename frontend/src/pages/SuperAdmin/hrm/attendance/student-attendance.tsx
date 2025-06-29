import React, { useRef, useState, useEffect } from "react";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import CommonSelect from "../../../../core/common/commonSelect";
import {
  AdmissionNumber,
  classSection,
  RollNumber,
  studentclass,
  studentName,
} from "../../../../core/common/selectoption/selectoption";
// import { studentAttendance } from "../../../core/data/json/student_attendance";
import { TableData } from "../../../../core/data/interface";
import Table from "../../../../core/common/dataTable/index";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../../../../router/all_routes";
import TooltipOption from "../../../../core/common/tooltipOption";
import useMobileDetection from "../../../../core/common/mobileDetection";
import { useSelector } from "react-redux";
import { getStudentAttendanceAndLeave } from '../../../../services/teacher/attendanceService';
import LoadingSkeleton from '../../../../components/LoadingSkeleton';
import { toast, ToastContainer } from 'react-toastify';
import { downloadAttendanceReport, getAttendanceReport } from "../../../../services/admin/teacherAttendanceApi";

const StudentAttendance = ({ teacherdata }:{teacherdata?:any})=> {
  const routes = all_routes;
  const obj =useSelector((state:any) => state.auth.userObj);
  const ismobile = useMobileDetection();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [studentId, setStudentId] = useState('');
  const [attendanceReport, setAttendanceReport] = useState<any[]>([]);
  const [downloading, setDownloading] = useState(false);
  const schoolId = useSelector((state: any) => state.auth.userObj?.schoolId || localStorage.getItem('schoolId') || '');
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const fetchAttendance = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getStudentAttendanceAndLeave(id);
     // console.log('Student attendance API response:', response);
      const attendanceRecords = response.data?.attendance || [];
      if (!attendanceRecords.length) {
        setError('No attendance data found for this student');
        toast.error('No attendance data found for this student');
        setData([]);
        setLoading(false);
        return;
      }
      // Map to readable table rows if possible
      const mapped = attendanceRecords.map((item: any, idx: number) => ({
        key: idx,
        admissionNo: item.admissionNo || '-',
        rollNo: item.rollNo || '-',
        name: item.name || '-',
        class: item.class || '-',
        section: item.section || '-',
        attendance: item.status || '-',
        notes: item.notes || '',
      }));
      setData(mapped);
      setSelectedOptions(mapped.map(() => 'Present'));
    } catch (err) {
      setError('Failed to fetch attendance');
      toast.error('Failed to fetch attendance');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchAttendance(studentId);
    }
  }, [studentId]);

  useEffect(() => {
    if (schoolId) {
      setLoading(true);
      getAttendanceReport(schoolId)
        .then(res => {
          // Support both {data: [...]} and [...] as response
          const report = res.data && Array.isArray(res.data.data) ? res.data.data : res.data;
          setAttendanceReport(report || []);
          setLoading(false);
          console.log('Attendance Report API response:', res);
        })
        .catch(() => setLoading(false));
    }
  }, [schoolId]);

  // Dynamically generate columns for admin summary report
  const getDynamicColumns = (dataArr: any[]) => {
    if (!Array.isArray(dataArr) || dataArr.length === 0) return [];
    const keys = Object.keys(dataArr[0]).filter(k => k !== 'key');
    return keys.map(key => ({
      title: key.charAt(0).toUpperCase() + key.slice(1),
      dataIndex: key,
      key,
    }));
  };

  useEffect(() => {
    if (!studentId && attendanceReport.length > 0) {
      // If admin and response is a flat array of objects (summary), use it directly
      if (
        obj.role === 'admin' &&
        Array.isArray(attendanceReport) &&
        attendanceReport.length > 0 &&
        typeof attendanceReport[0] === 'object' &&
        !Array.isArray(attendanceReport[0]) &&
        !attendanceReport[0].students // no nested students property
      ) {
        setData(attendanceReport.map((item: any, idx: number) => ({ key: idx, ...item })));
      } else {
        // Map the attendanceReport to the table format (old format)
        const mapped = attendanceReport.flatMap((report: any, idx: number) =>
          (report.students || []).map((student: any, sidx: number) => ({
            key: `${idx}-${sidx}`,
            admissionNo: student.admissionNo || '-',
            rollNo: student.rollNo || '-',
            name: student.name || '-',
            class: report.class || '-',
            section: report.section || '-',
            attendance: student.status || '-',
            notes: '',
          }))
        );
        setData(mapped);
        setSelectedOptions(mapped.map(() => 'Present'));
      }
    }
  }, [attendanceReport, studentId, obj.role]);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  // Handle state change for each row
  const handleOptionChange = (index: any, value: any) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = value;
    setSelectedOptions(newSelectedOptions);
  };
  const columns = [
    {
      title: "AdmissionNo",
      dataIndex: "admissionNo",
      render: (text: string, record: any, index: number) => (
        <>
          <Link to="#" className="link-primary">
            {record.admissionNo}
          </Link>
        </>
      ),
      sorter: (a: TableData, b: TableData) =>
        a.admissionNo.length - b.admissionNo.length,
    },
    {
      title: "Roll No",
      dataIndex: "rollNo",
      sorter: (a: TableData, b: TableData) => a.rollNo.length - b.rollNo.length,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link to="#" className="avatar avatar-md">
            <ImageWithBasePath
              src={record.img}
              className="img-fluid rounded-circle"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to="#">{text}</Link>
            </p>
          </div>
        </div>
      ),
      sorter: (a: TableData, b: TableData) => a.name.length - b.name.length,
    },
    {
      title: "Class",
      dataIndex: "class",
      sorter: (a: TableData, b: TableData) => a.class.length - b.class.length,
    },
    {
      title: "Section",
      dataIndex: "section",
      sorter: (a: TableData, b: TableData) =>
        a.section.length - b.section.length,
    },
    {
      title: "Attendance",
      dataIndex: "attendance",
      render: (text: string, record: any ) => (
        <div className="d-flex align-items-center check-radio-group flex-nowrap">
          <label className="custom-radio">
            <input 
              type="radio" 
              name={`student${record.key}`} 
              defaultChecked={record.present === "true"} 
            />
            <span className="checkmark" />
            Present
          </label>
          <label className="custom-radio">
            <input 
              type="radio" 
              name={`student${record.key}`} 
              defaultChecked={record.Late === "true"} 
            />
            <span className="checkmark" />
            Late
          </label>
          <label className="custom-radio">
            <input 
              type="radio" 
              name={`student${record.key}`} 
              defaultChecked={record.Absent === "true"} 
            />
            <span className="checkmark" />
            Absent
          </label>
          <label className="custom-radio">
            <input 
              type="radio" 
              name={`student${record.key}`} 
              defaultChecked={record.Holiday === "true"} 
            />
            <span className="checkmark" />
            Holiday
          </label>
          <label className="custom-radio">
            <input 
              type="radio" 
              name={`student${record.key}`} 
              defaultChecked={record.Halfday === "true"} 
            />
            <span className="checkmark" />
            Halfday
          </label>
        </div>
      ),
      sorter: (a: TableData, b: TableData) => a.attendance.length - b.attendance.length,
    },
    {
      title: "Notes",
      dataIndex: "notes",
      render: (text: string, record: any) => (
        <div>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Name"
          />
        </div>
      ),
      sorter: (a: TableData, b: TableData) => a.notes.length - b.notes.length,
    },
  ];

  const handleExportClick = () => {
    setShowExportDropdown((prev) => !prev);
  };

  const handleExportOption = async (type: 'pdf' | 'excel') => {
    setDownloading(true);
    setShowExportDropdown(false);
    try {
      const res = await downloadAttendanceReport(type);
      
      // Create blob from response data
      const blob = new Blob([res.data], {
        type: type === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Attendance_Report_${Date.now()}.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`${type.toUpperCase()} report downloaded successfully!`);
    } catch (err) {
      console.error('Download error:', err);
      toast.error(`Failed to download ${type.toUpperCase()} report.`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
        <ToastContainer position="top-center" autoClose={3000} />
     {/* <div className={isMobile ? "page-wrapper" : "p-3"}> */}
           <div className={ismobile ? "page-wrapper" : obj.role==="admin" ?"page-wrapper" :"p-3"}>
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Student Attendance</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Report</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Student Attendance
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap position-relative">
              <TooltipOption />
              {/* Only keep the latest Export Button with Dropdown */}
              <div className="dropdown ms-2">
                <button
                  className="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  onClick={handleExportClick}
                  disabled={downloading}
                >
                  Export
                </button>
                <ul className={`dropdown-menu${showExportDropdown ? ' show' : ''}`} style={{ minWidth: 150 }}>
                  <li>
                    <button className="dropdown-item" onClick={() => handleExportOption('pdf')} disabled={downloading}>
                      Download PDF
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => handleExportOption('excel')} disabled={downloading}>
                      Download Excel
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Student List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Student Attendance List</h4>
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
                  <div
                    className="dropdown-menu drop-width"
                    ref={dropdownMenuRef}
                  >
                    <form>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 border-bottom">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Admission No</label>
                              <CommonSelect
                                className="select"
                                options={AdmissionNumber}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Roll No</label>
                              <CommonSelect
                                className="select"
                                options={RollNumber}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Name</label>
                              <CommonSelect
                                className="select"
                                options={studentName}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-0">
                              <label className="form-label">Class</label>
                              <CommonSelect
                                className="select"
                                options={studentclass}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-0">
                              <label className="form-label">Section</label>

                              <CommonSelect
                                className="select"
                                options={classSection}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Student ID</label>
                              <input
                                type="text"
                                className="form-control"
                                value={studentId}
                                onChange={e => setStudentId(e.target.value)}
                                placeholder="Enter Student ID"
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
            <div className="card-body">
              {loading ? (
                <LoadingSkeleton />
              ) : error ? (
                <div className="text-danger text-center">{error}</div>
              ) : data.length === 0 ? (
                <div className="text-center">No attendance data found.</div>
              ) : (
                // If admin and summary format, use dynamic columns
                obj.role === 'admin' &&
                Array.isArray(data) &&
                data.length > 0 &&
                typeof data[0] === 'object' &&
                !Array.isArray(data[0]) &&
                !data[0].students ? (
                  <Table columns={getDynamicColumns(data)} dataSource={data} />
                ) : (
                  <Table columns={columns} dataSource={data} />
                )
              )}
            </div>
          </div>
          {/* /Student List */}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
