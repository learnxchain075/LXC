import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, DatePicker } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PredefinedDateRanges from '../../../core/common/datePicker';
import CommonSelect from '../../../core/common/commonSelect';
import {
  expenseName,
  invoiceNumber,
  paymentMethod,
} from '../../../core/common/selectoption/selectoption';
import { all_routes } from '../../../router/all_routes';
import TooltipOption from '../../../core/common/tooltipOption';
import {
  createSchoolExpense,
  getSchoolExpenses,
  updateSchoolExpense,
  deleteSchoolExpense,
} from '../../../services/accounts/schoolExpenseApi';
import { ISchoolExpense, ICreateSchoolExpense, IUpdateSchoolExpense } from '../../../services/types/accounts/schoolExpenseService';
import { getSchoolExpenseCategories } from '../../../services/accounts/schoolExpenseCategoryApi';
import { ISchoolExpenseCategory } from '../../../services/types/accounts/schoolExpenseCategoryService';

import * as bootstrap from 'bootstrap';

import dayjs from 'dayjs'; 




const paymentMethodOptions = paymentMethod.map((method) => ({
  value: method.value,
  label: method.label,
}));

const Expense: React.FC = () => {
  const routes = all_routes;
  const [expenseData, setExpenseData] = useState<ISchoolExpense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addFormData, setAddFormData] = useState<ICreateSchoolExpense>({
    categoryId: '',
    date: new Date(),
    amount: 0,
    description: '',
    invoiceNumber: '',
    paymentMethod: '',
    schoolId: localStorage.getItem('schoolId') ?? '',
  });
  const [editFormData, setEditFormData] = useState<IUpdateSchoolExpense | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [categorylist, setCategoryList] = useState<ISchoolExpenseCategory[]>([]);

  // Fetch expenses
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getSchoolExpenses(localStorage.getItem('schoolId') ?? '');
      // console.log('Response in expense:', response);
      setExpenseData(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategory = async () => {
    try {
      const response = await getSchoolExpenseCategories(localStorage.getItem('schoolId') ?? '');
      // console.log('Category response:', response);
      setCategoryList(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategory();
  }, []);
  const closeModal = (modalId: string) => {
    try {
      const modalElement = document.getElementById(modalId);
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modal.hide();
        modal.dispose(); // Dispose modal instance to prevent state reuse
        // console.log(`${modalId} modal closed and disposed`);

        // Delayed backdrop cleanup to ensure animation completes
        setTimeout(() => {
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach((backdrop) => backdrop.remove());
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
          //console.log(`Removed ${backdrops.length} modal backdrops for ${modalId}`);
        }, 300); // Match Bootstrap's modal transition duration
      } else {
       // console.warn(`Modal with ID ${modalId} not found`);
      }
    } catch (error) {
     // console.error(`Error closing modal ${modalId}:`, error);
    }
  };

  // Fallback to force clear backdrops
  const forceClearBackdrops = () => {
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach((backdrop) => backdrop.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
   // console.log('Force cleared backdrops');
  };

  // Handle add expense
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSchoolExpense(addFormData);
      setAddFormData({
        categoryId: '',
        date: new Date(),
        amount: 0,
        description: '',
        invoiceNumber: '',
        paymentMethod: '',
        schoolId: localStorage.getItem('schoolId') ?? '',
      });
     
      fetchData();
      toast.success('Expense created successfully!', {
        autoClose: 3000,
        position: 'top-right',
      });
      closeModal('add_expenses');
      forceClearBackdrops();
      
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Failed to create expense');
      closeModal('add_expenses');
      forceClearBackdrops();
    }
  };

  // Handle edit expense
  const handleEditExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("editFormData",editFormData);
    if (!editId || !editFormData) return;
    try {
      await updateSchoolExpense(editId, editFormData);
      setEditFormData(null);
      setEditId(null);
      fetchData();
      toast.success('Expense updated successfully!', {
        autoClose: 3000,
        position: 'top-right',
      });
      closeModal('edit_expenses');
      forceClearBackdrops();
    //  bootstrap.Modal.getOrCreateInstance('#edit_expenses')?.hide();

    } catch (error) {
     // console.error('Error updating expense:', error);
      toast.error('Failed to update expense');
      closeModal('edit_expenses');
      forceClearBackdrops();
    }
  };

  // Handle delete expense
  const handleDeleteExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) {
      console.error('No expense ID selected for deletion');
      toast.error('No expense selected for deletion');
      return;
    }
    try {
      // console.log('Deleting expense with ID:', editId);
      await deleteSchoolExpense(editId);
      setEditId(null);
      fetchData();
      toast.success('Expense deleted successfully!', {
        autoClose: 3000,
        position: 'top-right',
      });
       closeModal('delete-modal');
      forceClearBackdrops();
    //  bootstrap.Modal.getOrCreateInstance('#delete-modal')?.hide();

      
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
      closeModal('delete-modal');
      forceClearBackdrops();
    }
  };

  // Handle edit button click
  const handleEditClick = (expense: ISchoolExpense) => {
    setEditId(expense.id);
    setEditFormData({
      categoryId: expense.categoryId,
      date: expense.date,
      amount: expense.amount,
      description: expense.description,
      invoiceNumber: expense.invoiceNumber,
      paymentMethod: expense.paymentMethod,
    });
  };
  const paymentMethods = [
    { label: "Cash", value: "CASH" },
    { label: "Online", value: "ONLINE" },
    { label: "Cheque", value: "CHEQUE" },
    { label: "Bank Transfer", value: "BANK_TRANSFER" },
  ];

  const columns = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   render: (text: string) => (
    //     <Link to="#" className="link-primary">
    //       {text}
    //     </Link>
    //   ),
    //   sorter: (a: ISchoolExpense, b: ISchoolExpense) => a.id.length - b.id.length,
    // },
    // {
    //   title: 'Expense Name',
    //   dataIndex: 'description',
    //   sorter: (a: ISchoolExpense, b: ISchoolExpense) =>
    //     (a.description?.length || 0) - (b.description?.length || 0),
    // },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (category: ISchoolExpense['category']) => category?.name || 'N/A',
      sorter: (a: ISchoolExpense, b: ISchoolExpense) =>
        (a.category?.name || '').length - (b.category?.name || '').length,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date: Date) => new Date(date).toLocaleDateString(),
      sorter: (a: ISchoolExpense, b: ISchoolExpense) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (amount: number) => `${amount.toFixed(2)}`,
      sorter: (a: ISchoolExpense, b: ISchoolExpense) => a.amount - b.amount,
    },
    {
      title: 'Invoice No',
      dataIndex: 'invoiceNumber',
      render: (text: string) => (
        <Link to="#" className="link-primary">
          {text || 'N/A'}
        </Link>
      ),
      sorter: (a: ISchoolExpense, b: ISchoolExpense) =>
        (a.invoiceNumber?.length || 0) - (b.invoiceNumber?.length || 0),
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      render: (method: string) =>
        paymentMethodOptions.find((opt) => opt.value === method)?.label || method,
      sorter: (a: ISchoolExpense, b: ISchoolExpense) => a.paymentMethod.length - b.paymentMethod.length,
    },
    {
      title: 'Action',
      render: (_: any, record: ISchoolExpense) => (
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
                  data-bs-toggle="modal"
                  data-bs-target="#edit_expenses"
                  onClick={() => handleEditClick(record)}
                >
                  <i className="ti ti-edit-circle me-2" />
                  Edit
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item rounded-1"
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#delete-modal"
                  onClick={() => setEditId(record.id)}
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

  return (
    <div>
      <ToastContainer />
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Expense</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Finance & Accounts</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Expense
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
                  data-bs-target="#add_expenses"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Expense
                </Link>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Expense List</h4>
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
                  <div className="dropdown-menu drop-width">
                    <form>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 pb-0 border-bottom">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Expense Name</label>
                              <CommonSelect
                                className="select"
                                options={expenseName}
                                defaultValue={expenseName[0]}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Category</label>
                              <select
                                className="form-control"
                                value={addFormData.categoryId}
                                onChange={(e) =>
                                  setAddFormData({ ...addFormData, categoryId: e.target.value })
                                }
                              >
                                <option value="">Select Category</option>
                                {categorylist.map((category) => (
                                  <option key={category.id} value={category.id}>
                                    {category.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Invoice Number</label>
                              <CommonSelect
                                className="select"
                                options={invoiceNumber}
                                defaultValue={invoiceNumber[0]}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <Link to="#" className="btn btn-light me-3">
                          Reset
                        </Link>
                        <button type="submit" className="btn btn-primary">
                          Apply
                        </button>
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
              {loading ? <div >loading...</div> : <Table 
              dataSource={expenseData} columns={columns} rowKey="id" />}
            </div>
          </div>
        </div>
      </div>
      {/* Add Expense Modal */}
      <div className="modal fade" id="add_expenses">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Expense</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleAddExpense}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    {/* <div className="mb-3">
                      <label className="form-label">Expense Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={addFormData.description || ''}
                        onChange={(e) =>
                          setAddFormData({ ...addFormData, description: e.target.value })
                        }
                        required
                      />
                    </div> */}
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className="form-control"
                        value={addFormData.categoryId}
                        onChange={(e) =>
                          setAddFormData({ ...addFormData, categoryId: e.target.value })
                        }
                        required
                      >
                        <option value="">Select Category</option>
                        {categorylist.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Date</label>
                      <DatePicker
                        className="form-control datetimepicker"
                        format="YYYY-MM-DD"
                        onChange={(date, dateString) =>
                          setAddFormData({ ...addFormData, date: dateString as string })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        value={addFormData.amount}
                        onChange={(e) =>
                          setAddFormData({ ...addFormData, amount: parseFloat(e.target.value)  })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Invoice No</label>
                      <input
                        type="text"
                        className="form-control"
                        value={addFormData.invoiceNumber || ''}
                        onChange={(e) =>
                          setAddFormData({ ...addFormData, invoiceNumber: e.target.value })
                        }
                      />
                    </div>
                    {/* <div className="mb-3">
                      <label className="form-label">Payment Method</label>
                      <CommonSelect
                        className="select"
                        options={paymentMethodOptions}
                        value={addFormData.paymentMethod}
                        onChange={(value) =>
                          setAddFormData({ ...addFormData, paymentMethod: value as string })
                        }
                        required
                      />
                    </div> */}
                    
<div className="mb-3">
  <label className="form-label">Payment Method</label>
  <select
    className="form-select"
    value={addFormData?.paymentMethod ?? ""}
    onChange={(e) => {
      if (addFormData) {
        setAddFormData({
          ...addFormData,
          paymentMethod: e.target.value ,
        });
      }
    }}
    required
  >
    <option value="">Select Payment Method</option>
    {paymentMethods.map((method) => (
      <option key={method.value} value={method.value}>
        {method.label}
      </option>
    ))}
  </select>
</div>
                             <div className="mb-0">
                      <label className="form-label">Description</label>
                      <textarea
                        rows={4}
                        className="form-control"
                        value={addFormData.description || ''}
                        onChange={(e) =>
                          setAddFormData({ ...addFormData, description: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  {loading ?"Adding..":"Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Edit Expense Modal */}
      <div className="modal fade" id="edit_expenses">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Expense</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            {editFormData && (
              <form onSubmit={handleEditExpense}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      {/* <div className="mb-3">
                        <label className="form-label">Expense Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editFormData.description || ''}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, description: e.target.value })
                          }
                          required
                        />
                      </div> */}
                      <div className="mb-3">
                        <label className="form-label">Category</label>
                        <select
                          className="form-control"
                          value={editFormData.categoryId}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, categoryId: e.target.value })
                          }
                          required
                        >
                          <option value="">Select Category</option>
                          {categorylist.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Date</label>
                        <DatePicker
                          className="form-control datetimepicker"
                          format="YYYY-MM-DD"
                          value={editFormData.date ? dayjs(editFormData.date) : null}
                          onChange={(date, dateString) =>
                            setEditFormData({ ...editFormData, date: dateString as string })
                          }
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Amount</label>
                        <input
                          type="number"
                          className="form-control"
                          value={editFormData.amount}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              amount: parseFloat(e.target.value) ,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Invoice No</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editFormData.invoiceNumber || ''}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, invoiceNumber: e.target.value })
                          }
                        />
                      </div>
                      {/* <div className="mb-3">
                        <label className="form-label">Payment Method</label>
                        <CommonSelect
                          className="select"
                          options={paymentMethodOptions}
                          value={editFormData.paymentMethod}
                          onChange={(value) =>
                            setEditFormData({ ...editFormData, paymentMethod: value as string })
                          }
                          required
                        />
                      </div> */}
                      {/* <div className="mb-3">
  <label className="form-label">Payment Method</label>
  <select
    className="form-select"
    value={editFormData.paymentMethod}
    onChange={(e) =>
      setEditFormData({
        ...editFormData,
        paymentMethod: e.target.value,
      })
    }
    required
  >
    <option value="">Select Payment Method</option>
    <option value="CASH">Cash</option>
    <option value="ONLINE">Online</option>
    <option value="CHEQUE">Cheque</option>
    <option value="BANK_TRANSFER">Bank Transfer</option>
  </select>
</div> */}

<div className="mb-3">
  <label className="form-label">Payment Method</label>
  <select
    className="form-select"
    value={editFormData?.paymentMethod || ""}
    onChange={(e) => {
      if (editFormData) {
        setEditFormData({
          ...editFormData,
          paymentMethod: e.target.value,
        });
      }
    }}
    required
  >
    <option value="">Select Payment Method</option>
    {paymentMethods.map((method) => (
      <option key={method.value} value={method.value}>
        {method.label}
      </option>
    ))}
  </select>
</div>
                      <div className="mb-0">
                        <label className="form-label">Description</label>
                        <textarea
                          rows={4}
                          className="form-control"
                          value={editFormData.description || ''}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, description: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      {/* Delete Modal */}
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form onSubmit={handleDeleteExpense}>
              <div className="modal-body text-center">
                <span className="delete-icon">
                  <i className="ti ti-trash-x" />
                </span>
                <h4>Confirm Deletion</h4>
                <p>
                  You want to delete this expense record. This action cannot be undone.
                </p>
                <div className="d-flex justify-content-center">
                  <Link to="#" className="btn btn-light me-3" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-danger">
                   {loading ?"deleting.. ":"Yes, Delete"} 
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expense;