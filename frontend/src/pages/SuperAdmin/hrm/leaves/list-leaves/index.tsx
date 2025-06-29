import React, { useRef, useEffect, useState } from "react";
// import { leave } from "../../../../core/data/json/list_leaves";
import { TableData } from "../../../../../core/data/interface";
import Table from "../../../../../core/common/dataTable/index";
import PredefinedDateRanges from "../../../../../core/common/datePicker";
import CommonSelect from "../../../../../core/common/commonSelect";
import { activeList, leaveType } from "../../../../../core/common/selectoption/selectoption";
import { Link } from "react-router-dom";
import { all_routes } from "../../../../../router/all_routes";
import TooltipOption from "../../../../../core/common/tooltipOption";
import { getAllLeaveRequests, approveLeaveRequest, rejectLeaveRequest } from '../../../../../services/teacher/leaveService';
import LoadingSkeleton from '../../../../../components/LoadingSkeleton';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { useSelector } from "react-redux";

const ListLeaves = () => {
  const routes = all_routes;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
const userRole = useSelector((state: any) => state.auth.userObj?.role);
  // Placeholder: get the current user's role (replace with your actual logic)
  const currentUserRole = userRole; // <-- Replace with Redux/Context/Prop as needed

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const fetchLeaveData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllLeaveRequests();
      const records = (response.data || []).map((item: any) => ({
        key: item.id,
        id: item.id,
        submittedBy: item.user?.name || 'N/A',
        reason: item.reason,
        role: item.user?.role || 'N/A',
        leaveDate: `${item.fromDate ? new Date(item.fromDate).toLocaleDateString() : ''} - ${item.toDate ? new Date(item.toDate).toLocaleDateString() : ''}`,
        noofDays: item.fromDate && item.toDate ? Math.ceil((new Date(item.toDate).getTime() - new Date(item.fromDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 : '-',
        appliedOn: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-',
        status: item.isApproved ? item.isApproved.charAt(0).toUpperCase() + item.isApproved.slice(1).toLowerCase() : 'Pending',
        isApproved: item.isApproved,
      }));
      setData(records);
    } catch (err) {
      setError('Failed to fetch leave data');
      toast.error('Failed to fetch leave data');
    } finally {
      setLoading(false);
    }
  };

  // Handle approve action
  const handleApprove = async (record: any) => {
    console.log("🔄 LIST-LEAVES: Approve button clicked");
    console.log("🔄 LIST-LEAVES: Record ID:", record.id);
    console.log("🔄 LIST-LEAVES: Current URL:", window.location.href);
    
    if (!record.id) {
      toast.error('Leave not found');
      return;
    }

    setActionLoading(prev => ({ ...prev, [`approve-${record.id}`]: true }));
    
    try {
      console.log(`Approving leave request with ID: ${record.id}`);
      await approveLeaveRequest(record.id);
      toast.success(`Leave request approved for ${record.submittedBy}`);
      // Refresh the data to show updated status
      await fetchLeaveData();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to approve leave request';
      toast.error(errorMessage);
    } finally {
      setActionLoading(prev => ({ ...prev, [`approve-${record.id}`]: false }));
    }
  };

  // Handle reject action
  const handleReject = async (record: any) => {
    console.log("🔄 LIST-LEAVES: Reject button clicked");
    console.log("🔄 LIST-LEAVES: Record ID:", record.id);
    console.log("🔄 LIST-LEAVES: Current URL:", window.location.href);
    
    if (!record.id) {
      toast.error('Leave ID not found');
      return;
    }

    setActionLoading(prev => ({ ...prev, [`reject-${record.id}`]: true }));
    
    try {
      await rejectLeaveRequest(record.id);
      toast.success(`Leave request rejected for ${record.submittedBy}`);
      // Refresh the data to show updated status
      await fetchLeaveData();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to reject leave request';
      toast.error(errorMessage);
    } finally {
      setActionLoading(prev => ({ ...prev, [`reject-${record.id}`]: false }));
    }
  };

  const columns = [
    { title: 'Submitted By', dataIndex: 'submittedBy', sorter: (a: any, b: any) => a.submittedBy.localeCompare(b.submittedBy) },
    { title: 'Reason', dataIndex: 'reason', sorter: (a: any, b: any) => a.reason.localeCompare(b.reason) },
    { title: 'Role', dataIndex: 'role', sorter: (a: any, b: any) => a.role.localeCompare(b.role) },
    { title: 'Leave Dates', dataIndex: 'leaveDate', sorter: (a: any, b: any) => a.leaveDate.localeCompare(b.leaveDate) },
    { title: 'No of Days', dataIndex: 'noofDays', sorter: (a: any, b: any) => String(a.noofDays).localeCompare(String(b.noofDays)) },
    { title: 'Applied On', dataIndex: 'appliedOn', sorter: (a: any, b: any) => a.appliedOn.localeCompare(b.appliedOn) },
    { title: 'Status', dataIndex: 'status', render: (text: string) => {
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
          <i className="ti ti-circle-filled fs-5 me-1"></i>{text}
        </span>
      );
    }, sorter: (a: any, b: any) => a.status.localeCompare(b.status) },
  ];

  const hasPending = data.some(item => item.isApproved?.toLowerCase() === 'pending');
  const columnsWithAction = [...columns];
  if (currentUserRole === 'admin' && hasPending) {
    columnsWithAction.push({
      title: 'Action',
      key: 'action',
      render: (_text: string, record: any, _index: number) => (
        record.isApproved?.toLowerCase() === 'pending' ? (
          <div className="d-flex gap-2">
            <button 
              className="btn btn-success btn-sm" 
              onClick={() => handleApprove(record)}
              disabled={actionLoading[`approve-${record.id}`]}
            >
              {actionLoading[`approve-${record.id}`] ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  Approving...
                </>
              ) : (
                'Approve'
              )}
            </button>
            <button 
              className="btn btn-danger btn-sm" 
              onClick={() => handleReject(record)}
              disabled={actionLoading[`reject-${record.id}`]}
            >
              {actionLoading[`reject-${record.id}`] ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  Rejecting...
                </>
              ) : (
                'Reject'
              )}
            </button>
          </div>
        ) : null
      )
    } as any);
  }

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
                <h3 className="page-title mb-1">Leave</h3>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <Link to={routes.adminDashboard}>Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#">HRM</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Leave Type
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <TooltipOption />
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#add_leaves"
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Add Leave Type
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Filter Section */}
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Leave List</h4>
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
                                <label className="form-label">Leave Type</label>
                                <CommonSelect
                                  className="select"
                                  options={leaveType}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
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
                  <LoadingSkeleton />
                ) : error ? (
                  <div className="text-danger text-center">{error}</div>
                ) : data.length === 0 ? (
                  <div className="text-center">No leave data found.</div>
                ) : (
                  <Table columns={columnsWithAction} dataSource={data} />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}
        {/* Add Leaves */}
        <div className="modal fade" id="add_leaves">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Leave Type</h4>
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
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Leave Type</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="status-title">
                          <h5>Status</h5>
                          <p>Change the Status by toggle </p>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch-sm"
                          />
                        </div>
                      </div>
                    </div>
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
                    Add Leave Type
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Add Leaves */}
        {/* Edit Leaves */}
        <div className="modal fade" id="edit_leaves">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Leave Type</h4>
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
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Leave Type</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Leave Type"
                          defaultValue="Medical Leave"
                        />
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="status-title">
                          <h5>Status</h5>
                          <p>Change the Status by toggle </p>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="switch-sm2"
                          />
                        </div>
                      </div>
                    </div>
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
                    Save Changes
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit Leaves */}
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

export default ListLeaves;
