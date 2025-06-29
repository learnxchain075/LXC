import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { all_routes } from "../../../../router/all_routes";
import ImageWithBasePath from "../../../../core/common/imageWithBasePath";
import { Table } from "antd";
import CommonSelect from "../../../../core/common/commonSelect";
import { allClass, names, status } from "../../../../core/common/selectoption/selectoption";
import TooltipOption from "../../../../core/common/tooltipOption";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import { IFeesForm, IFeesresponse } from "../feesService";
import { getFeeById, getOverdueFees } from "../../../admin/feesApi";
import { createFee, deleteFee, getAllFees, getFeesBySchool, updateFee } from "../../../accounts/feesServices";
import { getSchoolStudents } from "../../../admin/studentRegister";
import { closeModal } from "../../../../pages/Common/modalclose";

const FeesManagement = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  
  const [fees, setFees] = useState<IFeesresponse[]>([]);
  const [formData, setFormData] = useState<IFeesForm>({
    studentId: "",
    amount: "" as unknown as number,
    paymentDate: new Date(),
    category: "",
    schoolId: localStorage.getItem("schoolId") || "",
    status: "pending",
    scholarship: "" as unknown as number,
    discount: "" as unknown as number,
  });
  
  const [editMode, setEditMode] = useState(false);
  const [currentFeeId, setCurrentFeeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOverdue, setShowOverdue] = useState(false);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

    const [students, setStudents] = useState<any[]>([]);
const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
const [searchKeyword, setSearchKeyword] = useState<string>("");
    const fetchStudents = async () => {
      const schoolId = localStorage.getItem('schoolId');
      if (!schoolId) return;
      try {
        const res = await getSchoolStudents(schoolId);
        setStudents(res.data);
      } catch (err) {
        console.error('Failed to fetch students', err);
      }
    };
 const handleStudentSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.trim().toLowerCase();
    setSearchKeyword(e.target.value);
    const filtered = students.filter((s) =>
      s.rollNo?.toLowerCase().includes(keyword)
    );
  
    setFilteredStudents(filtered);
  
    if (filtered.length === 1) {
      setFormData({ ...formData, studentId: filtered[0].id });
    } else {
      setFormData({ ...formData, studentId: "" });
    }
  };
  
  // Fetch all fees
  const fetchFees = async () => {
    setLoading(true);
    try {
      const response = showOverdue 
        ? await getOverdueFees() 
        : await getFeesBySchool();
      setFees(response.data);
    } catch (error: any) {
      toast.error(`Failed to fetch fees: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
useEffect(()=>{
  fetchStudents();
},[])
  useEffect(() => {
    fetchFees();

  }, [showOverdue]);

  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   render: (text: string) => (
    //     <Link to={routes.feesReport} className="link-primary">
    //       {text}
    //     </Link>
    //   ),
    //   sorter: (a: IFeesresponse, b: IFeesresponse) => a.id.localeCompare(b.id),
    // },
    {
      title: "Name",
      dataIndex: "student",
      render: (text: string, record: IFeesresponse) => (
        <div className="d-flex align-items-center">
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to="#">{record.student.user.name}</Link>
            </p>
          </div>
        </div>
      ),
      sorter: (a: IFeesresponse, b: IFeesresponse) =>
        a.student.user.name.localeCompare(b.student.user.name),
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a: IFeesresponse, b: IFeesresponse) =>
        a.category.localeCompare(b.category),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      sorter: (a: IFeesresponse, b: IFeesresponse) =>
        a.dueDate.localeCompare(b.dueDate),
    },
    
    {
      title: "Discount",
      dataIndex: "discount",
      sorter: (a: IFeesresponse, b: IFeesresponse) =>
        a.discount - b.discount,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      sorter: (a: IFeesresponse, b: IFeesresponse) => a.amount - b.amount,
    },
    {
      title: "Amount Paid",
      dataIndex: "amountPaid",
      sorter: (a: IFeesresponse, b: IFeesresponse) => a.amountPaid - b.amountPaid,
    },
    {
      title: "Scholarship",
      dataIndex: "scholarship",
      sorter: (a: IFeesresponse, b: IFeesresponse) => a.scholarship - b.scholarship,
    },
    {
      title: "Remaining Amount",
      dataIndex: "remainingAmount",
    
      render: (text: string, record: IFeesresponse) => (
        <div className="d-flex align-items-center">
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to="#">{record.amount -record.amountPaid}</Link>
            </p>
          </div>
        </div>
      ),
      sorter: (a: IFeesresponse, b: IFeesresponse) =>
        (a.amount - a.amountPaid) - (b.amount - b.amountPaid),
      
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      render: (text: string) => new Date(text).toLocaleDateString(),
      sorter: (a: IFeesresponse, b: IFeesresponse) =>
        new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime(),
    },
    {
      title: "Fine/Day",
      dataIndex: "finePerDay",
      sorter: (a: IFeesresponse, b: IFeesresponse) => a.finePerDay - b.finePerDay,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <>
          {text === "PAID" ? (
            <span className="badge badge-soft-success d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          ) : (
            <span className="badge badge-soft-danger d-inline-flex align-items-center">
              <i className="ti ti-circle-filled fs-5 me-1"></i>
              {text}
            </span>
          )}
        </>
      ),
      sorter: (a: IFeesresponse, b: IFeesresponse) =>
        a.status.localeCompare(b.status),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: string, record: IFeesresponse) => (
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
                  onClick={() => handleEdit(record.id)}
                >
                  <i className="ti ti-edit-circle me-2" />
                  Edit
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item rounded-1"
                  to="#"
                  onClick={() => handleDelete(record.id)}
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" || name === "discount" || name === "scholarship"
        ? parseFloat(value) || 0
        : value
    });
  };

  const handlepaymentChange = (date: Date) => {
    setFormData({
      ...formData,
      paymentDate: date
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMode && currentFeeId) {
        await updateFee(currentFeeId, formData);
        toast.success("Fee updated successfully");
      } else {
        await createFee(formData as any);
        toast.success("Fee created successfully");
        closeModal("addFeeModal");
      }
      resetForm();
      fetchFees();
    } catch (error: any) {
      toast.error(`Operation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      amount: "" as unknown as number,
      paymentDate: new Date(),
      category: "",
      schoolId: localStorage.getItem("schoolId") || "",
      status: "pending",
      scholarship: "" as unknown as number,
      discount: "" as unknown as number,
    });
    setEditMode(false);
    setCurrentFeeId(null);
  };

  const handleEdit = async (id: string) => {
    try {
      setLoading(true);
      const response = await getFeeById(id);
      setFormData({
        ...response.data,
        paymentDate: new Date(response.data.paymentDate)
      });
      setEditMode(true);
      setCurrentFeeId(id);
    } catch (error: any) {
      toast.error(`Failed to fetch fee: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this fee?")) {
      try {
        setLoading(true);
        await deleteFee(id);
        toast.success("Fee deleted successfully");
        fetchFees();
      } catch (error: any) {
        toast.error(`Failed to delete fee: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Fees Management</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Finance</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Fees Management
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              <div className="mb-2">
                <button
                  className="btn btn-primary d-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#addFeeModal"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Fee
                </button>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          
          {/* Fees List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Fees List</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 po
                sition-relative">
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
                    className="dropdown-menu drop-width "
                    ref={dropdownMenuRef}
                  >
                    <form>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 border-bottom pb-0">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Status</label>
                              <CommonSelect
                                className="select"
                                options={status}
                                defaultValue={status[0]}
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
                <div className="mb-3">
                  <button
                    className={`btn ${showOverdue ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setShowOverdue(!showOverdue)}
                  >
                    {showOverdue ? 'Show All Fees' : 'Show Overdue Fees'}
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body p-0 py-3">
              <Table 
                dataSource={fees} 
                columns={columns} 
                rowKey="id"
                loading={loading}
              />
            </div>
          </div>
          {/* /Fees List */}
        </div>
      </div>
      {/* /Page Wrapper */}

      {/* Add/Edit Fee Modal */}
      <div className="modal fade" id="addFeeModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editMode ? "Edit Fee" : "Add New Fee"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={resetForm}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Student RollNo</label>
                  {/* <input
                    type="text"
                    className="form-control"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    required
                  />
                  <label className="form-label">Student Roll No</label> */}
  <input
    type="text"
    className="form-control"
    value={searchKeyword}
    onChange={handleStudentSearch}
    placeholder="Search Student Roll No"
  />
  {filteredStudents.length > 0 && (
    <ul className="dropdown-menu show position-static border">
      {filteredStudents.map((student) => (
        <li
          key={student.id}
          className="dropdown-item"
          onClick={() => {
            setFormData((prev) => ({
              ...prev,
              studentId: student.id,
            }));
            setSearchKeyword(student.rollNo); 
            setFilteredStudents([]); 
          }}
        >
          {student.rollNo} - {student.fatherName} 
        </li>
      ))}
    </ul>
  )}
</div>
                {/* </div> */}

                <div className="mb-3">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    min="0"
                    // step="0.01"
                
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Payment Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="paymentDate"
                    value={formData.paymentDate.toISOString().split('T')[0]}
                    onChange={(e) => handlepaymentChange(new Date(e.target.value))}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="tuition">Tuition</option>
                    <option value="library">Library</option>
                    <option value="transport">Transport</option>
                    <option value="hostel">Hostel</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Scholarship</label>
                  <input
                    type="number"
                    className="form-control"
                    name="scholarship"
                    value={formData.scholarship}
                    onChange={handleInputChange}
                    min="0"
                    // step="0.01"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Discount (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="0"
                    // max="100"
                  />
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : editMode ? "Update" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default FeesManagement;