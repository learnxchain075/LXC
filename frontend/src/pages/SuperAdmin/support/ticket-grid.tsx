import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import CommonSelect from "../../../core/common/commonSelect";
import {
  assigned,
  markAs,
  staffName,
  ticketDate,
} from "../../../core/common/selectoption/selectoption";
import PredefinedDateRanges from "../../../core/common/datePicker";
import TicketsSidebar from "./tickets-sidebar";
import TooltipOption from "../../../core/common/tooltipOption";
import { useEffect, useState } from "react";
import { createTicket, deleteTicket, getAllTickets, getTicketsBySchool, getTicketsByuserid, updateTicket, getTicketMetadata } from "../../../services/superadmin/ticketApi";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

import useMobileDetection from "../../../core/common/mobileDetection";


const timeAgo = (dateString: string) => {
  if (!dateString) return "Recently updated";
  
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
};

// Priority badge styling
const getPriorityClass = (priority: string) => {
  if (!priority) return 'badge-primary';
  
  switch (priority.toLowerCase()) {
    case 'high': return 'badge-danger';
    case 'medium': return 'badge-warning';
    case 'low': return 'badge-success';
    default: return 'badge-primary';
  }
};

// Status badge styling
const getStatusClass = (status: string) => {
  if (!status) return 'bg-outline-info';
  
  switch (status.toLowerCase()) {
    case 'open': return 'bg-open';
    case 'pending': return 'bg-pending';
    case 'resolved': return 'bg-resolved';
    case 'closed': return 'bg-closed';
    default: return 'bg-outline-info';
  }
};

const TicketGrid = ({ teacherdata }: { teacherdata?: any }) => {
  const route = all_routes;
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.userObj);
  const role = user.role;
  
  // Get school ID based on role
  const getSchoolId = () => {
    if (role === "superadmin") return "";
    if (role === "teacher") return teacherdata?.schoolId || "";
    return localStorage.getItem("schoolId") || "";
  };

  // Get user ID based on role
  const getUserId = () => {
    if (role === "teacher") return localStorage.getItem("userId") || "";
    return localStorage.getItem("userId") || "";
  };

  const schoolID = getSchoolId();
  const userId = getUserId();
  // console.log("object",userId);

  const [ticketData, setTicketData] = useState<TicketForm>({
    title: "",
    schoolId: schoolID,
    userId: userId,
    description: "",
    category: "",
    priority: "",
    status: "pending",
  });

  const [schoolTickets, setSchoolTickets] = useState<TicketForm[]>([]);
  const [allTickets, setAllTickets] = useState<TicketForm[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketForm | null>(null);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [priorities, setPriorities] = useState<{ value: string; label: string }[]>([]);
  const [statuses, setStatuses] = useState<{ value: string; label: string }[]>([]);

  const fetchTickets = async () => {
    try {
      if (role === "superadmin") {
        const res = await getAllTickets();
        setAllTickets(res.data || []);
      } else if (role === "admin") {
        const res = await getTicketsBySchool(schoolID);
        setSchoolTickets(res.data || []);
      } else if (role === "teacher") {
        const res = await getTicketsByuserid(userId);
        setSchoolTickets(res.data || []);
      }
          } catch (error) {
        toast.error("Failed to load tickets");
      }
  };

  const fetchMetadata = async () => {
    try {
      const res = await getTicketMetadata();
      const { categories: c = [], priorities: p = [], statuses: s = [] } = res.data || {};
      setCategories(c.map((v: string) => ({ value: v, label: v })));
      setPriorities(p.map((v: string) => ({ value: v, label: v })));
      setStatuses(s.map((v: string) => ({ value: v, label: v })));
          } catch (err) {
        // Failed to load ticket metadata
      }
  };

  useEffect(() => {
    fetchTickets();
    fetchMetadata();
  }, [role, schoolID, userId]);

  const handleAddTicket = async () => {
    try {
      if (!ticketData.title || !ticketData.description || !ticketData.priority || !ticketData.category) {
        toast.error("Please fill all required fields");
        return;
      }
      const res = await createTicket(ticketData);
      if (res) {
        toast.success("Ticket successfully added");
        closeModal("add_ticket");
        fetchTickets();
        handleCancel();
        navigate(`${route.ticketDetail}/${res.data.id}`);
      }
          } catch (error) {
        toast.error("Failed to create ticket");
      }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTicket(id);
      toast.success("Ticket successfully deleted");
      fetchTickets();
          } catch (error) {
        toast.error("Failed to delete ticket");
      }
  };

  const handleCancel = () => {
    setTicketData({
      title: "",
      description: "",
      status: "pending",
      priority: "",
      category: "",
      schoolId: schoolID,
      userId: userId,
    });
  };

  const handleUpdate = (id: string) => {
    const tickets = role === "superadmin" ? allTickets : schoolTickets;
    const ticket = tickets.find(t => t.id === id);
    if (ticket) setSelectedTicket(ticket);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedTicket) return;
    
    try {
      await updateTicket(selectedTicket.id, selectedTicket);
      toast.success("Ticket successfully updated");
      fetchTickets();
      setSelectedTicket(null);
      closeModal("update_ticket");
          } catch (error) {
        toast.error("Failed to update ticket");
      }
  };

  const closeModal = (id: string) => {
    const modal = document.getElementById(id);
    if (modal) {
      const closeButton = modal.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
      if (closeButton) closeButton.click();
    }
  };

  const ticketsToShow = role === "superadmin" ? allTickets : schoolTickets;
  const hasTickets = ticketsToShow.length > 0;
const ismobile=useMobileDetection();
  return (
    <>
     <div className={ismobile ? "page-wrapper" : role==="admin" ?"page-wrapper" :"page-wrapper"}>
        <ToastContainer position="top-center" autoClose={3000} />
        <div className="content pb-lg-4 pb-2">
          <div className="row">
            <div className="col-md-12">
              <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
                <div className="my-auto mb-2">
                  <h3 className="page-title mb-1">Tickets</h3>
                  <nav>
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        {role === "admin" ? (
                          <Link to={route.adminDashboard}>Dashboard</Link>
                        ) : role === "teacher" ? (
                          <Link to={route.teacherDashboard}>Dashboard</Link>
                        ) : role === "superadmin" ? (
                          <Link to={route.superAdminDashboard}>Dashboard</Link>
                        ) : (
                          ""
                        )}
                      </li>
                      <li className="breadcrumb-item">Support</li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Tickets
                      </li>
                    </ol>
                  </nav>
                </div>
                <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                  <TooltipOption />
                  {role !== "superadmin" && (
                    <div className="mb-2">
                      <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#add_ticket"
                        className="btn btn-primary"
                      >
                        <i className="ti ti-square-rounded-plus me-2" />
                        Add New Ticket
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between flex-wrap p-3 bg-white pb-0 mb-4">
            <div className="dropdown me-2 mb-3">
              <Link
                to="#"
                className="dropdown-toggle text-default fw-medium d-inline-flex align-items-center p-1 border-0 fs-18 fw-semibold"
                data-bs-toggle="dropdown"
              >
                All Tickets
              </Link>
              <ul className="dropdown-menu p-3">
                <li>
                  <Link to="#" className="dropdown-item rounded-1">
                    Open
                  </Link>
                </li>
                <li>
                  <Link to="#" className="dropdown-item rounded-1">
                    Inprogress
                  </Link>
                </li>
                <li>
                  <Link to="#" className="dropdown-item rounded-1">
                    Closed
                  </Link>
                </li>
                <li>
                  <Link to="#" className="dropdown-item rounded-1">
                    Reopened
                  </Link>
                </li>
              </ul>
            </div>
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
                  <form action="tickets">
                    <div className="d-flex align-items-center border-bottom p-3">
                      <h4>Filter</h4>
                    </div>
                    <div className="p-3 pb-0 border-bottom">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Assigned to</label>
                            <CommonSelect
                              className="select"
                              options={assigned}
                              defaultValue={undefined}
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Select Date</label>
                            <CommonSelect
                              className="select"
                              options={ticketDate}
                              defaultValue={undefined}
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Status</label>
                            <CommonSelect
                              className="select"
                              options={statuses}
                              defaultValue={undefined}
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
                        data-bs-dismiss="modal"
                        className="btn btn-primary"
                      >
                        Apply
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
              <div className="d-flex align-items-center bg-white border rounded-2 p-1 mb-3 me-2">
                <Link
                  to={route.tickets}
                  className="btn btn-icon bg-light btn-sm me-1 primary-hover"
                >
                  <i className="ti ti-list-tree" />
                </Link>
                <Link
                  to={route.ticketGrid}
                  className="active btn btn-icon btn-sm primary-hover"
                >
                  <i className="ti ti-grid-dots" />
                </Link>
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
          <div className="row">
            <div className="col-xl-8 col-xxl-9">
              {hasTickets ? (
                <div className="row">
                  {ticketsToShow.map((ticket) => (
                    <div className="col-md-6" key={ticket.id}>
                      <div className="card mb-3">
                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap p-3 pb-0">
                          <h5 className="text-primary mb-3">General</h5>
                          <div className="d-flex align-items-center mb-1">
                            <span className={`badge ${getPriorityClass(ticket.priority)} d-inline-flex align-items-center mb-2 me-4`}>
                              <i className="ti ti-circle-filled fs-5 me-1" />
                              {ticket.priority || "Medium"}
                            </span>
                            <div className="mb-2">
                              <CommonSelect
                                className="select"
                                options={markAs}
                                defaultValue={markAs[1]}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="card-body p-3 pb-0">
                          <div className="d-flex align-items-center justify-content-between flex-wrap">
                            <div className="d-flex align-items-center flex-wrap">
                              <span className="avatar avatar-xxl me-2 mb-3">
                                <ImageWithBasePath
                                  src="assets/img/students/student-11.jpg"
                                  alt="img"
                                />
                              </span>
                              <div className="mb-3">
                                <span className={`badge ${getStatusClass(ticket.status)} rounded-pill mb-1`}>
                                  #{ticket.id ? ticket.id.slice(0, 8) : "TK" + Math.floor(Math.random() * 10000)}
                                </span>
                                <div className="d-flex align-items-center mb-2">
                                  <h5 className="fw-semibold me-2">
                                    <Link to={`${route.ticketDetail}/${ticket.id}`}>
                                      {ticket.title}
                                    </Link>
                                  </h5>
                                  <span className={`badge ${getStatusClass(ticket.status)} d-flex align-items-center ms-1`}>
                                    <i className="ti ti-circle-filled fs-5 me-1" />
                                    {ticket.status || "Pending"}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center flex-wrap">
                                  <p className="d-flex align-items-center me-2 mb-1">
                                    <ImageWithBasePath
                                      src="assets/img/teachers/teacher-02.jpg"
                                      className="avatar avatar-xs rounded-circle me-2"
                                      alt="img"
                                    />
                                    Assigned to
                                    <span className="text-dark ms-1"> Support</span>
                                  </p>
                                  <p className="d-flex align-items-center mb-1 me-2">
                                    <i className="ti ti-calendar-bolt me-1" />
                                    {ticket.updatedAt ? `Updated ${timeAgo(ticket.updatedAt)}` : "Recently updated"}
                                  </p>
                                  <p className="d-flex align-items-center mb-1">
                                    <i className="ti ti-message-share me-1" />
                                    0 Comments
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="mb-3">
                              <button
                                type="button"
                                onClick={() => handleDelete(ticket.id)}
                                className="btn btn-outline-danger d-flex align-items-center lh-1"
                              >
                                <i className="ti ti-trash-x me-1" />
                                Delete
                              </button>
                              {role === "superadmin" && (
                                <button
                                  type="button"
                                  data-bs-toggle="modal"
                                  data-bs-target="#update_ticket"
                                  onClick={() => handleUpdate(ticket.id)}
                                  className="btn btn-outline-primary d-flex align-items-center lh-1 mt-2"
                                >
                                  <i className="ti ti-edit me-1" />
                                  Update
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="bg-light-300 p-3 rounded mb-3">
                            <p className="mb-1">
                              Last Comment from Support Agent
                              <span className="text-dark"> Support</span>
                            </p>
                            <p className="mb-2">
                              {ticket.description?.substring(0, 100) || "No comments yet"}
                            </p>
                            <Link
                              to="#"
                              className="d-inline-flex align-items-center text-primary fw-medium"
                              data-bs-toggle="offcanvas"
                              data-bs-target="#ticket-reply"
                            >
                              <i className="ti ti-reload me-1" />
                              Reply
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card">
                  <div className="card-body d-flex align-items-center justify-content-center p-5 flex-column">
                    <h5 className="text-muted mb-2">No tickets found</h5>
                    <p className="text-muted mb-0">
                      {role === "superadmin" 
                        ? "There are currently no tickets in the system" 
                        : "Please add a ticket to get started"}
                    </p>
                  </div>
                </div>
              )}
              {hasTickets && (
                <div className="text-center mb-xl-0 mb-4">
                  <Link to="#" className="btn btn-primary">
                    <i className="ti ti-loader-3 me-2" />
                    Load More
                  </Link>
                </div>
              )}
            </div>
            {/* <TicketsSidebar /> */}
          </div>
        </div>
      </div>

      {/* Add Ticket Modal */}
      <div className="modal fade" id="add_ticket">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Ticket</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Title"
                        value={ticketData.title}
                        onChange={(e) =>
                          setTicketData({ ...ticketData, title: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Ticket Description</label>
                      <textarea
                        className="form-control"
                        placeholder="Add description"
                        value={ticketData.description}
                        onChange={(e) =>
                          setTicketData({
                            ...ticketData,
                            description: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <CommonSelect
                        className="select"
                        options={categories}
                        onChange={(option: any) =>
                          setTicketData({
                            ...ticketData,
                            category: option.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Priority</label>
                      <CommonSelect
                        className="select"
                        options={priorities}
                        onChange={(option: any) =>
                          setTicketData({
                            ...ticketData,
                            priority: option.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddTicket}
                  disabled={!ticketData.title || !ticketData.description || !ticketData.priority || !ticketData.category}
                >
                  Add Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Update Ticket Modal */}
      {selectedTicket && (
        <div className="modal fade" id="update_ticket">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Update Ticket</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setSelectedTicket(null)}
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-0">
                        <label className="form-label">Status</label>
                        <CommonSelect
                          className="select"
                          options={statuses}
                          defaultValue={statuses.find(
                            (opt) => opt.value === selectedTicket.status
                          )}
                          onChange={(option: any) =>
                            setSelectedTicket({ ...selectedTicket, status: option.value })
                          }
                        />
                      </div>
                      <div className="mt-3">
                        <label className="form-label">Priority</label>
                        <CommonSelect
                          className="select"
                          options={priorities}
                          defaultValue={priorities.find((opt) => opt.value === selectedTicket.priority)}
                          onChange={(option: any) =>
                            setSelectedTicket({ ...selectedTicket, priority: option.value })
                          }
                        />
                      </div>
                      <div className="mt-3">
                        <label className="form-label">Category</label>
                        <CommonSelect
                          className="select"
                          options={categories}
                          defaultValue={categories.find((opt) => opt.value === selectedTicket.category)}
                          onChange={(option: any) =>
                            setSelectedTicket({ ...selectedTicket, category: option.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                    onClick={() => setSelectedTicket(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleUpdateSubmit}
                  >
                    Update Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Ticket View Offcanvas */}
      <div
        className="offcanvas offcanvas-end custom-offcanvas"
        tabIndex={-1}
        id="ticket-reply"
      >
        <div className="offcanvas-header border-bottom d-flex align-items-center justify-content-between p-3">
          <div className="d-flex align-items-center">
            <h5 className="me-2 mb-2">Ticket Details</h5>
            <div className="dropdown me-1 mb-2 ms-1">
              <Link
                to="#"
                className="dropdown-toggle  badge bg-outline-danger fs-12 text-danger d-inline-flex align-items-center p-1"
                data-bs-toggle="dropdown"
              >
                Open
              </Link>
              <ul className="dropdown-menu p-3">
                <li>
                  <Link to="#" className="dropdown-item rounded-1">
                    Open
                  </Link>
                </li>
                <li>
                  <Link to="#" className="dropdown-item rounded-1">
                    Closed
                  </Link>
                </li>
                <li>
                  <Link to="#" className="dropdown-item rounded-1">
                    Reopened
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <h5 className="text-primary me-2">General</h5>
            <button
              type="button"
              className="close-btn"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
              <i className="ti ti-x" />
            </button>
          </div>
        </div>
        <div className="offcanvas-body p-0">
          <div className="d-flex align-items-center justify-content-between flex-wrap border-bottom p-3 pb-0">
            <div className="d-block mb-3">
              <div className="d-flex align-items-center mb-2">
                <span className="badge bg-pending rounded-pill me-3">
                  #TK0003
                </span>
                <span className="badge badge-success d-inline-flex align-items-center">
                  <i className="ti ti-circle-filled fs-5 me-1" />
                  Low
                </span>
              </div>
              <div className="d-flex align-items-center flex-wrap">
                <p className="d-flex align-items-center me-2 mb-1">
                  <ImageWithBasePath
                    src="assets/img/teachers/teacher-01.jpg"
                    className="avatar avatar-xs rounded-circle me-2"
                    alt="img"
                  />
                  Assigned to <span className="text-dark ms-1"> Support</span>
                </p>
                <p className="d-flex align-items-center mb-1 me-2">
                  <i className="ti ti-calendar-bolt me-1" />
                  Updated 22 hours ago
                </p>
              </div>
            </div>
            <div className="mb-3">
              <CommonSelect
                className="select"
                options={markAs}
                defaultValue={markAs[1]}
              />
            </div>
          </div>
          <div className="border-bottom p-3 pb-0">
            <div className="d-flex">
              <span className="avatar avatar-xxl flex-shrink-0 me-4 mb-3">
                <ImageWithBasePath
                  src="assets/img/students/student-11.jpg"
                  alt="Img"
                />
              </span>
              <div>
                <div
                  className="alert bg-dark rounded d-flex align-items-center justify-content-between mb-3"
                  role="alert"
                >
                  <p className="mb-0">
                    Note!&nbsp;This ticket is closed. If you want to re-open it,
                    just post a reply below.
                  </p>
                  <button
                    type="button"
                    className="btn-close opacity-100 text-white p-0"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  >
                    <span>
                      <i className="ti ti-x" />
                    </span>
                  </button>
                </div>
                <div className="mb-3">
                  <div className="summernote">
                    Write a new comment, send your team notification by typing @
                    followed by their name
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <Link to="#" className="btn btn-light">
                      <i className="ti ti-pin" />
                      Attachment
                    </Link>
                    <Link to="#" className="btn btn-primary">
                      Post Comment
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-bottom p-3 pb-0">
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-xl me-2 flex-shrink-0">
                <ImageWithBasePath
                  src="assets/img/students/student-11.jpg"
                  alt="Img"
                />
              </span>
              <div>
                <h6 className="mb-1">James Hendriques</h6>
                <p>
                  <i className="ti ti-calendar-bolt me-1" />
                  Updated 5 hours ago
                </p>
              </div>
            </div>
            <div>
              <div className="mb-3">
                <h5 className="mb-1">Impact on Work</h5>
                <p>
                  This issue disrupts meetings, delays task completion, and
                  affects my overall productivity.
                </p>
              </div>
              <span className="badge bg-light">
                Screenshot.png
                <i className="ti ti-download ms-1" />
              </span>
              <div className="d-flex align-items-center my-3">
                <Link
                  to="#"
                  className="d-inline-flex align-items-center text-primary fw-medium me-3"
                >
                  <i className="ti ti-reload me-1" />
                  Reply
                </Link>
                <p className="d-flex align-items-center">
                  <i className="ti ti-message-share me-1" />9 Comments
                </p>
              </div>
              <div className="mb-3">
                <div className="summernote">
                  Write a new comment, send your team notification by typing @
                  followed by their name
                </div>
                <div className="d-flex align-items-center justify-content-between mt-3">
                  <Link to="#" className="btn btn-light">
                    <i className="ti ti-pin" />
                    Attachment
                  </Link>
                  <Link to="#" className="btn btn-primary">
                    Post Comment
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="border-bottom p-3 pb-0">
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-xl me-2 flex-shrink-0">
                <ImageWithBasePath
                  src="assets/img/profiles/avatar-19.jpg"
                  alt="Img"
                />
              </span>
              <div>
                <h6 className="mb-1">Support Agent Angio</h6>
                <p>
                  <i className="ti ti-calendar-bolt me-1" />
                  Updated 5 hours ago
                </p>
              </div>
            </div>
            <div>
              <div className="mb-3">
                <p>
                  Switch on the side panel &amp; update the OS, Login in to the
                  device manager and update the password
                </p>
              </div>
              <div className="d-flex align-items-center my-3">
                <Link
                  to="#"
                  className="d-inline-flex align-items-center text-primary fw-medium me-3"
                >
                  <i className="ti ti-reload me-1" />
                  Reply
                </Link>
                <p className="d-flex align-items-center">
                  <i className="ti ti-message-share me-1" />5 Comments
                </p>
              </div>
            </div>
          </div>
          <div className="border-bottom p-3 pb-0">
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-xl me-2 flex-shrink-0">
                <ImageWithBasePath
                  src="assets/img/profiles/avatar-01.jpg"
                  alt="Img"
                />
              </span>
              <div>
                <h6 className="mb-1">Marilyn Siegle</h6>
                <p>
                  <i className="ti ti-calendar-bolt me-1" />
                  Updated 6 hours ago
                </p>
              </div>
            </div>
            <div>
              <div className="mb-3">
                <p>
                  Check the System and Application logs in the Event Viewer for
                  warnings or errors that coincide with the times the freezes
                  occur.
                </p>
              </div>
              <div className="d-flex align-items-center my-3">
                <Link
                  to="#"
                  className="d-inline-flex align-items-center text-primary fw-medium me-3"
                >
                  <i className="ti ti-reload me-1" />
                  Reply
                </Link>
                <p className="d-flex align-items-center">
                  <i className="ti ti-message-share me-1" />7 Comments
                </p>
              </div>
            </div>
          </div>
          <div className="p-3 pb-0">
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-xl me-2 flex-shrink-0">
                <ImageWithBasePath
                  src="assets/img/profiles/avatar-22.jpg"
                  alt="Img"
                />
              </span>
              <div>
                <h6 className="mb-1">Brian Foust</h6>
                <p>
                  <i className="ti ti-calendar-bolt me-1" />
                  Updated 8 hours ago
                </p>
              </div>
            </div>
            <div>
              <div className="mb-3">
                <p>
                  Check the System and Application logs in the Event Viewer for
                  warnings or errors that coincide with the times the freezes
                  occur.
                </p>
              </div>
              <div className="d-flex align-items-center my-3">
                <Link
                  to="#"
                  className="d-inline-flex align-items-center text-primary fw-medium me-3"
                >
                  <i className="ti ti-reload me-1" />
                  Reply
                </Link>
                <p className="d-flex align-items-center">
                  <i className="ti ti-message-share me-1" />9 Comments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketGrid;