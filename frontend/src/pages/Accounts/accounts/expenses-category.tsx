import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonSelect from '../../../core/common/commonSelect';
import { category2 } from '../../../core/common/selectoption/selectoption';
import PredefinedDateRanges from '../../../core/common/datePicker';
import { all_routes } from '../../../router/all_routes';
import TooltipOption from '../../../core/common/tooltipOption';
import * as bootstrap from 'bootstrap';
import {
  createSchoolExpenseCategory,
  getSchoolExpenseCategories,
  updateSchoolExpenseCategory,
  deleteSchoolExpenseCategory,
} from '../../../services/accounts/schoolExpenseCategoryApi';
import {
  ISchoolExpenseCategory,
  ICreateSchoolExpenseCategory,
  IUpdateSchoolExpenseCategory,
} from '../../../services/types/accounts/schoolExpenseCategoryService';

// Define interface for table data (replacing TableData)
interface ExpenseCategoryTableData {
  id: string;
  category: string;
  description?: string;
}

const ExpensesCategory: React.FC = () => {
  const routes = all_routes;
  const [categories, setCategories] = useState<ISchoolExpenseCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addFormData, setAddFormData] = useState<ICreateSchoolExpenseCategory>({
    name: '',
    schoolId: localStorage.getItem('schoolId') ?? '',
  });
  const [editFormData, setEditFormData] = useState<IUpdateSchoolExpenseCategory | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [description, setDescription] = useState<string>(''); 
  const [editDescription, setEditDescription] = useState<string>(''); 
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
  // Fetch expense categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getSchoolExpenseCategories(localStorage.getItem('schoolId') ?? '');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching expense categories:', error);
      toast.error('Failed to fetch expense categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle add category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSchoolExpenseCategory(addFormData);
      setAddFormData({ name: '', schoolId: localStorage.getItem('schoolId') ?? '' });
      setDescription('');
      fetchCategories();
      toast.success('Expense category created successfully!');
      closeModal('add_expenses_category');
      forceClearBackdrops();
      // document.getElementById('add_expenses_category')?.classList.remove('show');
    } catch (error) {
      console.error('Error creating expense category:', error);
      toast.error('Failed to create expense category');
      closeModal('add_expenses_category');
      forceClearBackdrops();
    }
  };

  // Handle edit category
  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId || !editFormData) return;
    try {
      await updateSchoolExpenseCategory(editId, editFormData);
      setEditFormData(null);
      setEditId(null);
      setEditDescription('');
      fetchCategories();
      toast.success('Expense category updated successfully!');
      closeModal('edit_expenses_category');
      forceClearBackdrops();
      // document.getElementById('edit_expenses_category')?.classList.remove('show');
    } catch (error) {
      console.error('Error updating expense category:', error);
      toast.error('Failed to update expense category');
      closeModal('edit_expenses_category');
      forceClearBackdrops();
    }
  };

 
  const handleDeleteCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    try {
      await deleteSchoolExpenseCategory(editId);
      setEditId(null);
      fetchCategories();
      toast.success('Expense category deleted successfully!');
      closeModal('delete-modal');
      forceClearBackdrops();
      // document.getElementById('delete-modal')?.classList.remove('show');
    } catch (error) {
      console.error('Error deleting expense category:', error);
      toast.error('Failed to delete expense category');
      closeModal('delete-modal');
      forceClearBackdrops();
    }
  };

  // Handle edit button click
  const handleEditClick = (category: ISchoolExpenseCategory) => {
    setEditId(category.id);
    setEditFormData({ name: category.name });
    setEditDescription(''); 
  };

  // Table columns
  const columns = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   render: (text: string) => (
    //     <Link to="#" className="link-primary">
    //       {text}
    //     </Link>
    //   ),
    //   sorter: (a: ExpenseCategoryTableData, b: ExpenseCategoryTableData) => a.id.length - b.id.length,
    // },
    {
      title: 'Category',
      dataIndex: 'category',
      sorter: (a: ExpenseCategoryTableData, b: ExpenseCategoryTableData) =>
        a.category.length - b.category.length,
    },
    // {
    //   title: 'Description',
    //   dataIndex: 'description',
    //   render: (text: string) => text || 'N/A',
    //   sorter: (a: ExpenseCategoryTableData, b: ExpenseCategoryTableData) =>
    //     (a.description?.length || 0) - (b.description?.length || 0),
    // },
    {
      title: 'Action',
      render: (_: any, record: ExpenseCategoryTableData) => (
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
                  data-bs-target="#edit_expenses_category"
                  onClick={() => handleEditClick(categories.find((c) => c.id === record.id)!)}
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

  
  const tableData: ExpenseCategoryTableData[] = categories.map((category) => ({
    id: category.id,
    category: category.name,
    description: '', 
  }));

  return (
    <div>
     
     
      <div className="page-wrapper">
        <div className="content">
        <ToastContainer position="top-right" autoClose={3000} />
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Expense Category</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Finance & Accounts</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Expense Category
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
                  data-bs-target="#add_expenses_category"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Category
                </Link>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Expense Category List</h4>
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
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Category</label>
                              <CommonSelect
                                className="select"
                                options={category2}
                                defaultValue={category2[0]}
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
              {/* Expenses Category List */}
            
              {/* <Table dataSource={data} columns={columns} Selection={true} /> */}
              
              {loading ? (
            <div>loading</div>
              ) : (
                <Table dataSource={tableData} columns={columns} rowKey="id" />
              )}
              {/* /Expenses Category List */}
            </div>
          </div>
        </div>
      </div>
      {/* Add Expenses Category */}
      <div className="modal fade" id="add_expenses_category">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Category</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
         
            {/* <form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Category </label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="mb-0">
                      <label className="form-label">Description</label>
                      <textarea
                        rows={4}
                        className="form-control"
                        defaultValue={""}
                      />
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
                <button type="submit" className="btn btn-primary">
                  Add Category
                </button>
              </div>
            </form> */}
        
            <form onSubmit={handleAddCategory}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        className="form-control"
                        value={addFormData.name}
                        onChange={(e) =>
                          setAddFormData({ ...addFormData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    {/* <div className="mb-0">
                      <label className="form-label">Description</label>
                      <textarea
                        rows={4}
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  {loading ?"Adding" :"Add"} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Edit Expenses Category */}
      <div className="modal fade" id="edit_expenses_category">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Category</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
       
            {/* <form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Category </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Category"
                        defaultValue="Utilities"
                      />
                    </div>
                    <div className="mb-0">
                      <label className="form-label">Description</label>
                      <textarea
                        rows={4}
                        className="form-control"
                        placeholder="text"
                        defaultValue={
                          "Expenses related to electricity, water, and gas"
                        }
                      />
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
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form> */}
      
            {editFormData && (
              <form onSubmit={handleEditCategory}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Category</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editFormData.name}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="mb-0">
                        <label className="form-label">Description</label>
                        <textarea
                          rows={4}
                          className="form-control"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
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
      
            {/* <form>
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
                  <button type="submit" className="btn btn-danger">
                    Yes, Delete
                  </button>
                </div>
              </div>
            </form> */}
          
            <form onSubmit={handleDeleteCategory}>
              <div className="modal-body text-center">
                <span className="delete-icon">
                  <i className="ti ti-trash-x" />
                </span>
                <h4>Confirm Deletion</h4>
                <p>
                  You want to delete this expense category. This action cannot be undone.
                </p>
                <div className="d-flex justify-content-center">
                  <Link to="#" className="btn btn-light me-3" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-danger">
                    Yes, Delete
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

export default ExpensesCategory;