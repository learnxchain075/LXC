import React, { useEffect, useRef, useState } from "react";
import Table from "../../../../core/common/dataTable/index";
import { TableData } from "../../../../core/data/interface";
// import { payroll } from "../../../core/data/json/pay-roll";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import CommonSelect from "../../../../core/common/commonSelect";
import {
  month,
  staffName,
  year,
} from "../../../../core/common/selectoption/selectoption";
import { Link } from "react-router-dom";
import { all_routes } from "../../../../router/all_routes";
import TooltipOption from "../../../../core/common/tooltipOption";
import { IPayrollForm } from "../../../../services/types/admin/hrm/payrollService";
import { getPayrollsBySchool, createPayroll } from "../../../../services/admin/payrollApi";
import AppConfig from "../../../../config/config";
import { toast, ToastContainer } from 'react-toastify';
import LoadingSkeleton from '../../../../components/LoadingSkeleton';
import { getStaffBySchool } from "../../../../services/admin/staffRegister";
import { getTeacherByschoolId } from "../../../../services/admin/teacherRegistartion";
import { getSchoolStudents } from "../../../../services/admin/studentRegister";

// Error Boundary for Payroll
class PayrollErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger m-3">
          <h5>Something went wrong in Payroll.</h5>
          <p>{this.state.error?.message || 'An unexpected error occurred.'}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Payroll = () => {
  // const data = payroll;
   
  const schoolid = localStorage.getItem('schoolId') ?? '';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payrollData, setPayrollData] = useState<IPayrollForm[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addForm, setAddForm] = useState({
    userId: '',
    periodStart: '',
    periodEnd: '',
    grossSalary: '',
    deductions: '',
    status: 'Pending',
  });
  const [staffList, setStaffList] = useState<any[]>([]);
  const [userType, setUserType] = useState<'staff' | 'teacher' | 'student'>('staff');

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchPayrollData = async () => {
      try {
        const response = await getPayrollsBySchool(schoolid);
        // Handle both { data: [...] } and { success, data: [...] }
        const data = response.data?.data || response.data || [];
        setPayrollData(data);
      } catch (error: any) {
        setError('Failed to fetch payroll data');
        toast.error('Failed to fetch payroll data');
      } finally {
        setLoading(false);
      }
    };
    fetchPayrollData();
  }, [schoolid]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let res;
        if (userType === 'staff') {
          res = await getStaffBySchool(schoolid);
          setStaffList(Array.isArray(res.data) ? res.data : []);
        } else if (userType === 'teacher') {
          res = await getTeacherByschoolId(schoolid);
          setStaffList(Array.isArray(res.data) ? res.data : []);
        } else if (userType === 'student') {
          res = await getSchoolStudents(schoolid);
          setStaffList(Array.isArray(res.data) ? res.data : []);
        }
      } catch (e) {
        setStaffList([]);
      }
    };
    if (schoolid) fetchUsers();
  }, [schoolid, userType, showAddModal]);

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.userId || addForm.userId === "") {
      toast.error('Please select a valid user.');
      return;
    }
    if (!addForm.periodStart || !addForm.periodEnd || !addForm.grossSalary) {
      toast.error('Please fill all required fields');
      return;
    }
    setAddLoading(true);
    try {
      const payload = {
        userId: addForm.userId,
        schoolId: schoolid,
        periodStart: addForm.periodStart,
        periodEnd: addForm.periodEnd,
        grossSalary: Number(addForm.grossSalary),
        deductions: addForm.deductions ? Number(addForm.deductions) : 0,
        status: addForm.status,
      };
      await createPayroll(schoolid, payload);
      toast.success('Payroll added successfully');
      setShowAddModal(false);
      setAddForm({ userId: '', periodStart: '', periodEnd: '', grossSalary: '', deductions: '', status: 'Pending' });
      // Refresh payroll list
      setLoading(true);
      const response = await getPayrollsBySchool(schoolid);
      const data = response.data?.data || response.data || [];
      setPayrollData(data);
    } catch (error: any) {
      const msg = error?.response?.data?.message || error.message || '';
      if (msg.includes('Foreign key constraint failed')) {
        toast.error('Payroll creation failed: Invalid user selected.');
      } else {
        toast.error('Failed to add payroll');
      }
    } finally {
      setAddLoading(false);
      setLoading(false);
    }
  };

  
  const mappedPayrollData = (payrollData || []).map((item: any) => ({
    key: item.id,
    name: item.user?.name || '-',
    period: item.periodStart && item.periodEnd ? `${new Date(item.periodStart).toLocaleDateString()} - ${new Date(item.periodEnd).toLocaleDateString()}` : '-',
    grossSalary: item.grossSalary,
    deductions: item.deductions || 0,
    netSalary: typeof item.grossSalary === 'number' && typeof item.deductions === 'number' ? item.grossSalary - item.deductions : '-',
    paymentDate: item.paymentDate ? new Date(item.paymentDate).toLocaleDateString() : '-',
    status: item.status,
  }));

  const columns = [
    { title: 'Name', dataIndex: 'name', sorter: (a: any, b: any) => a.name.localeCompare(b.name) },
    { title: 'Period', dataIndex: 'period', sorter: (a: any, b: any) => a.period.localeCompare(b.period) },
    { title: 'Gross Salary', dataIndex: 'grossSalary', sorter: (a: any, b: any) => a.grossSalary - b.grossSalary },
    { title: 'Deductions', dataIndex: 'deductions', sorter: (a: any, b: any) => a.deductions - b.deductions },
    { title: 'Net Salary', dataIndex: 'netSalary', sorter: (a: any, b: any) => a.netSalary - b.netSalary },
    { title: 'Payment Date', dataIndex: 'paymentDate', sorter: (a: any, b: any) => a.paymentDate.localeCompare(b.paymentDate) },
    { title: 'Status', dataIndex: 'status', render: (text: string) => (
      <span className={`badge badge-soft-${text === 'PAID' ? 'success' : text === 'UNPAID' ? 'danger' : 'warning'} d-inline-flex align-items-center`}>
        <i className="ti ti-circle-filled fs-5 me-1"></i>{text}
            </span>
    ), sorter: (a: any, b: any) => a.status.localeCompare(b.status) },
  ];
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };
  const routes = all_routes;
  return (
    <PayrollErrorBoundary>
      <div>
        <>
          {/* Page Wrapper */}
            <ToastContainer position="top-center" autoClose={3000} />
          <div className="page-wrapper">
            <div className="content">
              {/* Page Header */}
              <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
                <div className="my-auto mb-2">
                  <h3 className="page-title mb-1">Payroll</h3>
                  <nav>
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <Link to={routes.adminDashboard}>Dashboard</Link>
                      </li>
                      <li className="breadcrumb-item">
                        <Link to="#">HRM</Link>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Payroll
                      </li>
                    </ol>
                  </nav>
                </div>
                <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <TooltipOption />
                  <div className="mb-2">
                    <button className="btn btn-primary d-flex align-items-center" onClick={() => setShowAddModal(true)}>
                      <i className="ti ti-square-rounded-plus me-2" />
                      Add Payroll
                    </button>
                  </div>
                </div>
              </div>
              {/* Page Header*/}
              {/* Filter Section */}
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                  <h4 className="mb-3">Payroll List</h4>
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
                                  <label className="form-label">All Staffs</label>
                                  <CommonSelect
                                    className="select"
                                    options={staffName}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Month</label>
                                  <CommonSelect
                                    className="select"
                                    options={month}
                                  />
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="mb-0">
                                  <label className="form-label">Year</label>
                                  <CommonSelect
                                    className="select"
                                    options={year}
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
                  ) : mappedPayrollData.length === 0 ? (
                    <div className="text-center">No payroll data found.</div>
                  ) : (
                    <Table columns={columns} dataSource={mappedPayrollData} />
                  )}
                </div>
              </div>
              {/* /Filter Section */}
            </div>
          </div>
          {/* /Page Wrapper */}
        </>
        {/* Add Payroll Modal */}
        {showAddModal && (
          <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Add Payroll</h4>
                  <button type="button" className="btn-close custom-btn-close" onClick={() => setShowAddModal(false)} aria-label="Close">
                    <i className="ti ti-x" />
                  </button>
                </div>
                <form onSubmit={handleAddPayroll}>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <label className="form-label">User Type</label>
                        <select className="form-select" value={userType} onChange={e => setUserType(e.target.value as any)}>
                          <option value="staff">Staff</option>
                          <option value="teacher">Teacher</option>
                          <option value="student">Student</option>
                        </select>
                      </div>
                      <div className="col-md-12 mb-3">
                        <label className="form-label">Name</label>
                        <select
                          className="form-select"
                          name="userId"
                          value={addForm.userId}
                          onChange={handleAddChange}
                          required
                        >
                          <option value="">Select {userType.charAt(0).toUpperCase() + userType.slice(1)}</option>
                          {staffList.map((user: any) => (
                            <option key={user.userId || user.id} value={user.userId || user.id}>{user.user?.name || user.name || user.fullName}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Period Start</label>
                        <input type="date" className="form-control" name="periodStart" value={addForm.periodStart} onChange={handleAddChange} required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Period End</label>
                        <input type="date" className="form-control" name="periodEnd" value={addForm.periodEnd} onChange={handleAddChange} required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Gross Salary</label>
                        <input type="number" className="form-control" name="grossSalary" value={addForm.grossSalary} onChange={handleAddChange} required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Deductions</label>
                        <input type="number" className="form-control" name="deductions" value={addForm.deductions} onChange={handleAddChange} />
                      </div>
                      <div className="col-md-12 mb-3">
                        <label className="form-label">Status</label>
                        <select className="form-select" name="status" value={addForm.status} onChange={handleAddChange} required>
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Unpaid">Unpaid</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-light me-2" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={addLoading}>
                      {addLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                          Adding...
                        </>
                      ) : (
                        "Add Payroll"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </PayrollErrorBoundary>
  );
};

export default Payroll;
