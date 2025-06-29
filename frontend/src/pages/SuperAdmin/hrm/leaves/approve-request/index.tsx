import React, { useRef, useEffect, useState } from "react";
import { all_routes } from "../../../../../router/all_routes";
// import { approveRequest } from "../../../../core/data/json/approve_request";
import { Link } from "react-router-dom";
import { TableData } from "../../../../../core/data/interface";
import Table from "../../../../../core/common/dataTable/index";
import PredefinedDateRanges from "../../../../../core/common/datePicker";
import CommonSelect from "../../../../../core/common/commonSelect";
import { activeList, leaveType, MonthDate, Role } from "../../../../../core/common/selectoption/selectoption";
import TooltipOption from "../../../../../core/common/tooltipOption";
import { getLeaveRequestsBySchool, approveLeaveRequest, rejectLeaveRequest } from '../../../../../services/teacher/leaveService';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import type { ColumnsType } from 'antd/es/table';

interface LeaveRequestData {
  id: string;
  status: string;
  submittedBy: string;
  leaveType: string;
  role: string;
  leaveDate: string;
  noofDays: string;
  appliedOn: string;
  isApproved?: string;
}

const ApproveRequest = () => {
  const routes = all_routes;
  // const data = approveRequest;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LeaveRequestData[]>([]);
  const schoolId = localStorage.getItem('schoolId') || '';
  // Placeholder: get the current user's role (replace with Redux/Context/Prop as needed)
  const currentUserRole = 'admin';

  useEffect(() => {
    setLoading(true);
    setError(null);
   // console.log('fetchLeaveData called');
    getLeaveRequestsBySchool(schoolId)
      .then((response) => {
        console.log('getLeaveRequestsBySchool API response:', response);
        const records = (response.data || []).map((item: any) => ({
          key: item.id,
          submittedBy: item.user?.name || 'N/A',
          leaveType: item.reason,
          role: item.user?.role || 'N/A',
          leaveDate: `${item.fromDate ? new Date(item.fromDate).toLocaleDateString() : ''} - ${item.toDate ? new Date(item.toDate).toLocaleDateString() : ''}`,
          noofDays: item.fromDate && item.toDate ? Math.ceil((new Date(item.toDate).getTime() - new Date(item.fromDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 : '-',
          appliedOn: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-',
          status: item.isApproved ? item.isApproved.charAt(0).toUpperCase() + item.isApproved.slice(1).toLowerCase() : 'Pending',
          isApproved: item.isApproved,
          id: item.id,
        }));
        setData(records);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch leave requests');
        toast.error('Failed to fetch leave requests');
        setLoading(false);
      });
  }, [schoolId]);

  const handleApprove = async (id: string) => {
    console.log("🔄 APPROVE-REQUEST: Approve button clicked");
    console.log("🔄 APPROVE-REQUEST: Record ID:", id);
    console.log("🔄 APPROVE-REQUEST: Current URL:", window.location.href);
    
    try {
      console.log(`Approving leave request with ID: ${id}`);
      const response = await approveLeaveRequest(id);
      if (response && (response.status === 200 || response.status === 201)) {
        toast.success('Leave request approved');
        // Refresh data
        const refreshed = await getLeaveRequestsBySchool(schoolId);
        const records = (refreshed.data || []).map((item: any) => ({
          key: item.id,
          submittedBy: item.user?.name || 'N/A',
          leaveType: item.reason,
          role: item.user?.role || 'N/A',
          leaveDate: `${item.fromDate ? new Date(item.fromDate).toLocaleDateString() : ''} - ${item.toDate ? new Date(item.toDate).toLocaleDateString() : ''}`,
          noofDays: item.fromDate && item.toDate ? Math.ceil((new Date(item.toDate).getTime() - new Date(item.fromDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 : '-',
          appliedOn: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-',
          status: item.isApproved ? item.isApproved.charAt(0).toUpperCase() + item.isApproved.slice(1).toLowerCase() : 'Pending',
          isApproved: item.isApproved,
          id: item.id,
        }));
        setData(records);
      } else {
        toast.error('Failed to approve leave request');
      }
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 501) {
        toast.error('This action is not available. Please contact admin.');
      } else if (err?.response?.status === 403) {
        toast.error('You are not authorized to approve this request.');
      } else {
        toast.error('Failed to approve leave request');
      }
    }
  };

  const handleReject = async (id: string) => {
    console.log("🔄 APPROVE-REQUEST: Reject button clicked");
    console.log("🔄 APPROVE-REQUEST: Record ID:", id);
    console.log("🔄 APPROVE-REQUEST: Current URL:", window.location.href);
    
    try {
      const response = await rejectLeaveRequest(id);
      if (response && (response.status === 200 || response.status === 201)) {
        toast.success('Leave request rejected');
        // Refresh data
        const refreshed = await getLeaveRequestsBySchool(schoolId);
        const records = (refreshed.data || []).map((item: any) => ({
          key: item.id,
          submittedBy: item.user?.name || 'N/A',
          leaveType: item.reason,
          role: item.user?.role || 'N/A',
          leaveDate: `${item.fromDate ? new Date(item.fromDate).toLocaleDateString() : ''} - ${item.toDate ? new Date(item.toDate).toLocaleDateString() : ''}`,
          noofDays: item.fromDate && item.toDate ? Math.ceil((new Date(item.toDate).getTime() - new Date(item.fromDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 : '-',
          appliedOn: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-',
          status: item.isApproved ? item.isApproved.charAt(0).toUpperCase() + item.isApproved.slice(1).toLowerCase() : 'Pending',
          isApproved: item.isApproved,
          id: item.id,
        }));
        setData(records);
      } else {
        toast.error('Failed to reject leave request');
      }
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 501) {
        toast.error('This action is not available. Please contact admin.');
      } else if (err?.response?.status === 403) {
        toast.error('You are not authorized to reject this request.');
      } else {
        toast.error('Failed to reject leave request');
      }
    }
  };

  const columns = [
    {
      title: "Submitted By",
      dataIndex: "submittedBy",
      sorter: (a: LeaveRequestData, b: LeaveRequestData) => a.submittedBy.length - b.submittedBy.length,
    },
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      sorter: (a: LeaveRequestData, b: LeaveRequestData) => a.leaveType.length - b.leaveType.length,
    },
    {
      title: "Role",
      dataIndex: "role",
      sorter: (a: LeaveRequestData, b: LeaveRequestData) => a.role.length - b.role.length,
    },
    {
      title: "Leave Date",
      dataIndex: "leaveDate",
      sorter: (a: LeaveRequestData, b: LeaveRequestData) => a.leaveDate.length - b.leaveDate.length,
    },
    {
      title: "No of Days",
      dataIndex: "noofDays",
      sorter: (a: LeaveRequestData, b: LeaveRequestData) => String(a.noofDays).length - String(b.noofDays).length,
    },
    {
      title: "Applied On",
      dataIndex: "appliedOn",
      sorter: (a: LeaveRequestData, b: LeaveRequestData) => a.appliedOn.length - b.appliedOn.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => {
        let badgeClass = '';
        if (text.toLowerCase() === 'approved') {
          badgeClass = 'badge bg-success';
        } else if (text.toLowerCase() === 'pending') {
          badgeClass = 'badge bg-warning text-dark';
        } else {
          badgeClass = 'badge bg-danger';
        }
        return (
          <span className={`${badgeClass} d-inline-flex align-items-center`} style={{ fontWeight: 600, letterSpacing: 1 }}>
            <i className="ti ti-circle-filled fs-5 me-1"></i>
            {text}
          </span>
        );
      },
      sorter: (a: LeaveRequestData, b: LeaveRequestData) => a.status.length - b.status.length,
    }
  ];

  // Only add the action column if there are pending requests and user is admin
  if (currentUserRole === 'admin' && data.some(item => item.isApproved?.toLowerCase() === 'pending')) {
    columns.push({
      title: "Action",
      key: "action",
      render: (_text: string, record: any, _index: number) => (
        record.isApproved?.toLowerCase() === 'pending' ? (
          <div className="d-flex gap-2">
            <button 
              className="btn btn-success btn-sm" 
              onClick={() => handleApprove(record.id)}
            >
              Approve
            </button>
            <button 
              className="btn btn-danger btn-sm" 
              onClick={() => handleReject(record.id)}
            >
              Reject
            </button>
          </div>
        ) : null
      )
    } as any);
  }

  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  return (
    <div>
      <>
        <ToastContainer position="top-center" autoClose={3000} />
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1">Approved Leave Request</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">HRM</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Approved Leave Request
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              </div>
            </div>
            {/* Page Header*/}
            {/* Filter Section */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Approved Leave Request List</h4>
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
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Leave Type</label>
                               
                                <CommonSelect
                                  className="select"
                                  options={leaveType}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Role</label>
                                <CommonSelect
                                  className="select"
                                  options={Role}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-0">
                                <label className="form-label">
                                  From - To Date
                                </label>
                                <CommonSelect
                                  className="select"
                                  options={MonthDate}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-0">
                                <label className="form-label">Status</label>
                                <CommonSelect
                                  className="select"
                                  options={activeList}
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
              <div className="card-body p-0 py-3">
                {loading ? (
                  <div className="text-center"><i className="ti ti-loader-3 me-2" />Loading...</div>
                ) : error ? (
                  <div className="text-danger text-center">{error}</div>
                ) : data.length === 0 ? (
                  <div className="text-center">No leave requests found.</div>
                ) : (
                  <Table columns={columns} dataSource={data} />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}
        {/* Leave Request */}
        <div className="modal fade" id="leave_request">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Leave Request</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form >
                <div className="modal-body">
                  <div className="student-leave-info">
                    <ul>
                      <li>
                        <span>Submitted By</span>
                        <h6>James Deckar</h6>
                      </li>
                      <li>
                        <span>ID / Roll No</span>
                        <h6>9004</h6>
                      </li>
                      <li>
                        <span>Role</span>
                        <h6>Student</h6>
                      </li>
                      <li>
                        <span>Leave Type</span>
                        <h6>Medical Leave</h6>
                      </li>
                      <li>
                        <span>No of Days</span>
                        <h6>2</h6>
                      </li>
                      <li>
                        <span>Applied On</span>
                        <h6>04 May 2024</h6>
                      </li>
                      <li>
                        <span>Authoity</span>
                        <h6>Jacquelin</h6>
                      </li>
                      <li>
                        <span>Leave</span>
                        <h6>05 May 2024 - 07 may 2024</h6>
                      </li>
                    </ul>
                  </div>
                  <div className="mb-3 leave-reason">
                    <h6 className="mb-1">Reason</h6>
                    <span>Headache &amp; fever</span>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Approval Status</label>
                    <div className="d-flex align-items-center check-radio-group">
                      <label className="custom-radio">
                        <input type="radio" name="radio" checked />
                        <span className="checkmark" />
                        Pending
                      </label>
                      <label className="custom-radio">
                        <input type="radio" name="radio" />
                        <span className="checkmark" />
                        Approved
                      </label>
                      <label className="custom-radio">
                        <input type="radio" name="radio" />
                        <span className="checkmark" />
                        Disapproved
                      </label>
                    </div>
                  </div>
                  <div className="mb-0">
                    <label className="form-label">Note</label>
                    <textarea
                      className="form-control"
                      placeholder="Add Comment"
                      rows={4}
                      defaultValue={""}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link to="#" className="btn btn-primary" data-bs-dismiss="modal">
                    Submit
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Leave Request */}
        {/* Delete Modal */}
        <div className="modal fade" id="delete-modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form >
                <div className="modal-body text-center">
                  <span className="delete-icon">
                    <i className="ti ti-trash-x" />
                  </span>
                  <h4>Confirm Deletion</h4>
                  <p>
                    You want to delete all the marked items, this cant be undone
                    once you delete.
                  </p>
                  <div className="d-flex justify-content-center">
                    <Link
                      to="#"
                      className="btn btn-light me-3"
                      data-bs-dismiss="modal"
                    >
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
        {/* /Delete Modal */}
      </>
    </div>
  );
};

export default ApproveRequest;
