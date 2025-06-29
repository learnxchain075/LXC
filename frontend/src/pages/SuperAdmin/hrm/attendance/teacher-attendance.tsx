import React, { useRef, useState, useEffect } from 'react'
// import { teacherAttendance } from '../../../core/data/json/teacher_attendance';
import { TableData } from '../../../../core/data/interface';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../core/common/imageWithBasePath';
// import Table from "../../../../core/common/dataTable/index";
import PredefinedDateRanges from '../../../../core/common/datePicker';
import CommonSelect from '../../../../core/common/commonSelect';
import { attendance, studentclass, studentName, teacherId } from '../../../../core/common/selectoption/selectoption';
import { all_routes } from '../../../../router/all_routes';
import TooltipOption from '../../../../core/common/tooltipOption';
import { Table } from 'antd';
import { getAttendances } from '../../../../services/teacher/attendanceService';
import LoadingSkeleton from '../../../../components/LoadingSkeleton';
import { toast, ToastContainer } from 'react-toastify';

const TeacherAttendance = () => {
  const routes = all_routes;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  // Handle state change for each row
  const handleOptionChange = (index:any, value:any) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = value;
    setSelectedOptions(newSelectedOptions);
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: 'Class',
      dataIndex: 'class',
      sorter: (a: any, b: any) => a.class.localeCompare(b.class),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text: string) => (
        <span className={`badge badge-soft-${text === 'Present' ? 'success' : 'danger'} d-inline-flex align-items-center`}>
          <i className="ti ti-circle-filled fs-5 me-1"></i>
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
    },
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAttendances()
      .then((response) => {
        console.log('Teacher attendance API response:', response);
        // Map backend data to readable table rows
        const records = (response.data || []).map((item: any, idx: number) => ({
          key: idx,
          name: item.student?.user?.name || 'N/A',
          class: item.lesson?.name || 'N/A',
          date: item.date ? new Date(item.date).toLocaleDateString() : 'N/A',
          status: item.present ? 'Present' : 'Absent',
        }));
        setData(records);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch teacher attendance');
        toast.error('Failed to fetch teacher attendance');
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} />
      {/* Main Wrapper */}
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Teacher Attendance</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                     <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                     <Link to="#">Report</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Teacher Attendance
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <TooltipOption />
            </div>
          </div>
          {/* /Page Header */}
          {/* Teacher Attendence List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Teacher Attendance List</h4>
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
                    <form >
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 border-bottom">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">ID</label>
                              <CommonSelect
                                    className="select"
                                    options={teacherId}
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
                              <label className="form-label">Attendance</label>
                              <CommonSelect
                                    className="select"
                                    options={attendance}
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
                       <Link
                        to="#"
                        className="dropdown-item rounded-1 active"
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
            <div className="card-body">
              {loading ? (
                <LoadingSkeleton />
              ) : error ? (
                <div className="text-danger text-center">{error}</div>
              ) : data.length === 0 ? (
                <div className="text-center">No teacher attendance data found.</div>
              ) : (
                <Table columns={columns} dataSource={data} rowKey="key" />
              )}
            </div>
          </div>
          {/* /Teacher Attendence List */}
        </div>
      </div>
      {/* /Page Wrapper */}
    </div>
  )
}

export default TeacherAttendance