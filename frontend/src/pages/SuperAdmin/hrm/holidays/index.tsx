import React, { useState, useEffect, useRef } from 'react';
import Table from "../../../../core/common/dataTable/index";
import PredefinedDateRanges from '../../../../core/common/datePicker';
import CommonSelect from '../../../../core/common/commonSelect';
import { Link } from 'react-router-dom';
import { all_routes } from '../../../../router/all_routes';
import TooltipOption from '../../../../core/common/tooltipOption';
import { getHolidays, createHoliday, updateHoliday, deleteHoliday, filterHolidaysByDate } from '../../../../services/admin/holidayApi';
import { IholidayForm } from '../../../../services/types/admin/holidayServices';
import  * as bootstrap from 'bootstrap';


// Define the holiday type based on IholidayForm, including id and status
interface Holiday extends IholidayForm {
  id: string;
  status: 'Active' | 'Inactive';
}

const Holiday = () => {
  const routes = all_routes;
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  // State definitions
  const [holidaysList, setHolidaysList] = useState<Holiday[]>([]);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Add form states
  const [addName, setAddName] = useState<string>('');
  const [addDate, setAddDate] = useState<string>('');
  const [addDescription, setAddDescription] = useState<string>('');
  const [addStatus, setAddStatus] = useState<boolean>(true);

  // Edit form states
  const [editName, setEditName] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editStatus, setEditStatus] = useState<boolean>(true);

  // Filter states
  const [filterTitle, setFilterTitle] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');

  //modal for screen
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

  // Fetch holidays on mount
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await getHolidays();
        // console.log("holiday",response.data.data);
        setHolidaysList(response.data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred while fetching holidays.');
        }
      }
    };
    fetchHolidays();
  }, []);

  // Populate edit form when selectedHoliday changes
  useEffect(() => {
    if (selectedHoliday) {
      setEditName(selectedHoliday.name || '');
      setEditDate(selectedHoliday.date || '');
      setEditDescription(selectedHoliday.description || '');
      setEditStatus(selectedHoliday.status === 'Active');
    }
  }, [selectedHoliday]);

  // Handlers
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const schoolId = localStorage.getItem('schoolId');
    if (!schoolId) {
      setError('School ID not found in local storage.');
      return;
    }
    const newHoliday: IholidayForm = {
      name: addName,
      date: addDate,
      description: addDescription || undefined,
      schoolId,
      id: ''
    };
    try {
      await createHoliday(newHoliday);
      const response = await getHolidays();
      setHolidaysList(response.data.data);
      resetAddForm();
      closeModal('add_holiday');
      forceClearBackdrops();
      // closeModal('add_holiday');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        closeModal('add_holiday');
        forceClearBackdrops();
      } else {
        setError('An unknown error occurred while adding the holiday.');
        closeModal('add_holiday');
        forceClearBackdrops();
      }
     
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHoliday) {
      setError('No holiday selected for editing.');
      return;
    }
    const schoolId = localStorage.getItem('schoolId');
    if (!schoolId) {
      setError('School ID not found in local storage.');
      return;
    }
    const updatedHoliday: IholidayForm = {
      name: editName,
      date: editDate,
      description: editDescription || undefined,
      schoolId,
      id: ''
    };
    try {
      await updateHoliday(selectedHoliday.id, updatedHoliday);
      const response = await getHolidays();
      setHolidaysList(response.data);
      closeModal('edit_holiday');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while updating the holiday.');
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedHoliday) {
      setError('No holiday selected for deletion.');
      return;
    }
    try {
      await deleteHoliday(selectedHoliday.id);
      const response = await getHolidays();
      setHolidaysList(response.data);
      closeModal('delete-modal');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while deleting the holiday.');
      }
    }
  };

  const handleApplyFilter = async () => {
    try {
      let filteredData: Holiday[];
      if (filterStartDate && filterEndDate) {
        const response = await filterHolidaysByDate(filterStartDate, filterEndDate);
        filteredData = response.data;
      } else {
        const response = await getHolidays();
        filteredData = response.data;
      }
      if (filterTitle) {
        filteredData = filteredData.filter(holiday =>
          holiday.name.toLowerCase().includes(filterTitle.toLowerCase())
        );
      }
      if (filterStatus) {
        filteredData = filteredData.filter(holiday => holiday.status === filterStatus);
      }
      setHolidaysList(filteredData);
      if (dropdownMenuRef.current) {
        dropdownMenuRef.current.classList.remove('show');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while filtering holidays.');
      }
    }
  };

  // Helper functions
  const resetAddForm = () => {
    setAddName('');
    setAddDate('');
    setAddDescription('');
    setAddStatus(true);
  };

  // const closeModal = (modalId: string) => {
  //   const modal = document.getElementById(modalId);
  //   if (modal) modal.classList.remove('show');
  //   document.body.classList.remove('modal-open');
  //   document.querySelector('.modal-backdrop')?.remove();
  // };

  // Table columns
  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   render: (text: string) => <Link to="#" className="link-primary">{text}</Link>,
    //   sorter: (a: Holiday, b: Holiday) => a.id.localeCompare(b.id),
    // },
    {
      title: "Holiday Title",
      dataIndex: "name",
      sorter: (a: Holiday, b: Holiday) => a.name.localeCompare(b.name),
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a: Holiday, b: Holiday) => a.date.localeCompare(b.date),
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: (a: Holiday, b: Holiday) => (a.description || '').localeCompare(b.description || ''),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <span className={`badge badge-soft-${text === "Active" ? "success" : "danger"} d-inline-flex align-items-center`}>
          <i className='ti ti-circle-filled fs-5 me-1'></i>{text}
        </span>
      ),
      sorter: (a: Holiday, b: Holiday) => a.status.localeCompare(b.status),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: Holiday) => (
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
                data-bs-target="#edit_holiday"
                onClick={() => setSelectedHoliday(record)}
              >
                <i className="ti ti-edit-circle me-2" />Edit
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item rounded-1"
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#delete-modal"
                onClick={() => setSelectedHoliday(record)}
              >
                <i className="ti ti-trash-x me-2" />Delete
              </Link>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Holidays</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">HRM</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Holidays
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
                data-bs-target="#add_holiday"
              >
                <i className="ti ti-square-rounded-plus me-2" />Add Holiday
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
            <h4 className="mb-3">Holidays List</h4>
            <div className="d-flex align-items-center flex-wrap">
              <div className="input-icon-start mb-3 me-2 position-relative">
                <PredefinedDateRanges
                  onChange={(start: string, end: string) => {
                    setFilterStartDate(start);
                    setFilterEndDate(end);
                  }}
                />
              </div>
              <div className="dropdown mb-3 me-2">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white dropdown-toggle"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="outside"
                >
                  <i className="ti ti-filter me-2" />Filter
                </Link>
                <div className="dropdown-menu drop-width" ref={dropdownMenuRef}>
                  <div>
                    <div className="d-flex align-items-center border-bottom p-3">
                      <h4>Filter</h4>
                    </div>
                    <div className="p-3 border-bottom">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Holiday Title</label>
                            <input
                              type="text"
                              className="form-control"
                              value={filterTitle}
                              onChange={(e) => setFilterTitle(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-0">
                            <label className="form-label">Status</label>
                            <CommonSelect
                              className="select"
                              options={[
                                { value: '', label: 'All' },
                                { value: 'Active', label: 'Active' },
                                { value: 'Inactive', label: 'Inactive' },
                              ]}
                              value={filterStatus}
                              onChange={(option: { value: string; label: string }) => setFilterStatus(option.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 d-flex align-items-center justify-content-end">
                      <Link
                        to="#"
                        className="btn btn-light me-3"
                        onClick={() => {
                          setFilterTitle('');
                          setFilterStatus('');
                          setFilterStartDate('');
                          setFilterEndDate('');
                          getHolidays()
                            .then(response => setHolidaysList(response.data))
                            .catch(err => {
                              if (err instanceof Error) {
                                setError(err.message);
                              } else {
                                setError('An unknown error occurred while resetting filters.');
                              }
                            });
                        }}
                      >
                        Reset
                      </Link>
                      <Link
                        to="#"
                        className="btn btn-primary"
                        onClick={handleApplyFilter}
                      >
                        Apply
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dropdown mb-3">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-sort-ascending-2 me-2" />Sort by A-Z
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
            {error && <div className="alert alert-danger">{error}</div>}
            <Table columns={columns} dataSource={holidaysList} rowKey="id" Selection={true}
           
            />
          </div>
        </div>
      </div>

      {/* Add Holiday Modal */}
      <div className="modal fade" id="add_holiday">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Holiday</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="form-label">Holiday Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addName}
                      onChange={(e) => setAddName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={addDate}
                      onChange={(e) => setAddDate(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      rows={4}
                      className="form-control"
                      value={addDescription}
                      onChange={(e) => setAddDescription(e.target.value)}
                    />
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="status-title">
                      <h5>Status</h5>
                      <p>Change the Status by toggle</p>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="switch-sm"
                        checked={addStatus}
                        onChange={(e) => setAddStatus(e.target.checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light me-2"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddSubmit}
              >
                Add Holiday
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Holiday Modal */}
      <div className="modal fade" id="edit_holiday">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Holiday</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="form-label">Holiday Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      rows={4}
                      className="form-control"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="status-title">
                      <h5>Status</h5>
                      <p>Change the Status by toggle</p>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="switch-sm2"
                        checked={editStatus}
                        onChange={(e) => setEditStatus(e.target.checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light me-2"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleEditSubmit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <span className="delete-icon">
                <i className="ti ti-trash-x" />
              </span>
              <h4>Confirm Deletion</h4>
              <p>
                You want to delete this holiday? This action cannot be undone.
              </p>
              <div className="d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-light me-3"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Holiday;