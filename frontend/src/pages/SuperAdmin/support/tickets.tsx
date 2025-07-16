import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../../router/all_routes";
import CommonSelect from "../../../core/common/commonSelect";
import {
  markAs,
  staffName,
  state,
  ticketDate,
} from "../../../core/common/selectoption/selectoption";
import { getEmployeesBySchool } from "../../../services/admin/employeeService";
import PredefinedDateRanges from "../../../core/common/datePicker";
import TicketsSidebar from "./tickets-sidebar";
import TooltipOption from "../../../core/common/tooltipOption";
import { useEffect, useState, useMemo } from "react";
import AppConfig from "../../../config/config";
import { jwtDecode } from "jwt-decode";
import { createTicket, deleteTicket, getAllTickets, getTicketsBySchool, getTicketsByuserid, updateTicket, getTicketMetadata } from "../../../services/superadmin/ticketApi";
import useMobileDetection from "../../../core/common/mobileDetection";
import { useSelector } from "react-redux";
import { closeModal } from "../../Common/modalclose";
import { toast, ToastContainer } from "react-toastify";
import moment from 'moment';
import "../../../style/css/tickets.css";

interface TicketForm {
  id?: string;
  ticketNumber?: number;
  title: string;
  schoolId?: string;
  userId: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    name: string;
    avatar?: string;
  };
  comments?: number;
  assignedTo?: string;
  assignedToId?: string;
}

const Tickets = ({ teacherdata }: { teacherdata?: any }) => {
  const route = all_routes;
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.userObj);
  const role = user.role;
  const ismobile = useMobileDetection();

  const schoolID = localStorage.getItem("schoolId") || teacherdata?.schoolId || "";
  const userId = localStorage.getItem("userId") || teacherdata?.userId || "";

  const [loading, setLoading] = useState(true);
  const [addingTicket, setAddingTicket] = useState(false);
  const [updatingTicket, setUpdatingTicket] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [priorities, setPriorities] = useState<{ value: string; label: string }[]>([]);
  const [statuses, setStatuses] = useState<{ value: string; label: string }[]>([]);
  const [assignees, setAssignees] = useState<{ value: string; label: string }[]>([]);

  const [TicketData, setTicketData] = useState<TicketForm>({
    title: "",
    schoolId: schoolID || undefined,
    userId: userId,
    description: "",
    category: "",
    priority: "",
    status: "pending",
    assignedTo: "",
  });

  const [schoolTickets, setSchoolTickets] = useState<TicketForm[]>([]);
  const [allTickets, setAllTickets] = useState<TicketForm[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketForm | null>(null);

  const fetchMetadata = async () => {
    try {
      const res = await getTicketMetadata();
      const { categories: c = [], priorities: p = [], statuses: s = [] } = res.data || {};
      setCategories(c.map((v: string) => ({ value: v, label: v })));
      setPriorities(p.map((v: string) => ({ value: v, label: v })));
      setStatuses(s.map((v: string) => ({ value: v, label: v })));
      
      if (schoolID) {
        try {
          const empRes = await getEmployeesBySchool(schoolID);
          setAssignees(
            (empRes.data.staff || []).map((e: any) => ({ value: e.id, label: e.name }))
          );
        } catch (empError) {
          console.error("Failed to load employees:", empError);
          setAssignees([]);
        }
      }
    } catch (error) {
      console.error("Failed to load ticket metadata:", error);
      setCategories([
        { value: "Technical Issue", label: "Technical Issue" },
        { value: "Feature Request", label: "Feature Request" },
        { value: "Bug Report", label: "Bug Report" },
        { value: "General Inquiry", label: "General Inquiry" }
      ]);
      setPriorities([
        { value: "Low", label: "Low" },
        { value: "Medium", label: "Medium" },
        { value: "High", label: "High" }
      ]);
      setStatuses([
        { value: "Open", label: "Open" },
        { value: "Pending", label: "Pending" },
        { value: "Resolved", label: "Resolved" },
        { value: "Closed", label: "Closed" }
      ]);
    }
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      if (role === "superadmin") {
        const res = await getAllTickets();
        setAllTickets(res.data || []);
      } else if (role === "admin") {
        if (!schoolID) {
          toast.error("School ID is required to fetch tickets");
          setSchoolTickets([]);
          return;
        }
        const res = await getTicketsBySchool(schoolID);
        setSchoolTickets(res.data || []);
      } else if (role === "teacher") {
        if (!userId) {
          toast.error("User ID is required to fetch tickets");
          setSchoolTickets([]);
          return;
        }
        const res = await getTicketsByuserid(userId);
        setSchoolTickets(res.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      toast.error("Failed to fetch tickets");
      setAllTickets([]);
      setSchoolTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchMetadata();
  }, [role, schoolID, userId]);

  const handleAddTicket = async () => {
    if (!TicketData.title || !TicketData.description || !TicketData.priority || !TicketData.category) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!userId) {
      toast.error("User ID is required to create a ticket");
      return;
    }

    // Validate CUID format for userId
    if (!userId.match(/^c[a-z0-9]{24}$/)) {
      toast.error("Invalid User ID format. Please log in again.");
      return;
    }

    // Validate CUID format for schoolId if provided
    // if (schoolID && !schoolID.match(/^c[a-z0-9]{24}$/)) {
    //   toast.error("Invalid School ID format.");
    //   return;
    // }

    // Validate CUID format for assignedTo if provided
    if (TicketData.assignedTo && TicketData.assignedTo.trim() && !TicketData.assignedTo.match(/^c[a-z0-9]{24}$/)) {
      toast.error("Invalid Assigned To ID format.");
      return;
    }

    setAddingTicket(true);
    try {
      const ticketPayload: any = {
        title: TicketData.title.trim(),
        description: TicketData.description.trim(),
        category: TicketData.category,
        priority: TicketData.priority,
        status: TicketData.status,
        userId: userId,
      };

      // Only add schoolId if it's valid, not null, and not empty
      if (schoolID && schoolID.trim() && schoolID !== "null" && schoolID !== "undefined" && schoolID.match(/^c[a-z0-9]{24}$/)) {
        ticketPayload.schoolId = schoolID;
      }

      // Only add assignedToId if it's valid, not null, and not empty
      if (TicketData.assignedTo && TicketData.assignedTo.trim() && TicketData.assignedTo !== "null" && TicketData.assignedTo !== "undefined" && TicketData.assignedTo.match(/^c[a-z0-9]{24}$/)) {
        ticketPayload.assignedToId = TicketData.assignedTo;
      }

      const res = await createTicket(ticketPayload);
      
      if (res && res.data) {
        toast.success("Ticket successfully added");
        closeModal("add_ticket");
        fetchTickets();
        setTicketData({
          title: "",
          description: "",
          status: "pending",
          priority: "",
          category: "",
          schoolId: schoolID || undefined,
          userId: userId,
          assignedTo: "",
        });
        
       
        // if (res.data.id) {
        //   navigate(`${route.ticketDetail}/${res.data.id}`);
        // }
      } else {
        toast.error("Failed to create ticket - no response data");
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create ticket";
      
      // Handle specific validation errors
      if (error?.response?.data?.details) {
        const validationErrors = error.response.data.details.map((err: any) => err.message).join(", ");
        toast.error(`Validation Error: ${validationErrors}`, { autoClose: 5000 });
      } else if (errorMessage.includes("Validation failed")) {
        toast.error(`Validation Error: ${errorMessage}`, { autoClose: 5000 });
      } else if (errorMessage.includes("Prisma") || errorMessage.includes("database")) {
        toast.error("Database error occurred. Please try again later.", { autoClose: 3000 });
      } else {
        toast.error(errorMessage, { autoClose: 3000 });
      }
    } finally {
      setAddingTicket(false);
    }
  };

  const handledelete = async (id: string) => {
    try {
      await deleteTicket(id);
      toast.success("Ticket successfully deleted");
      fetchTickets();
    } catch (error: any) {
      console.error("Failed to delete ticket:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete ticket";
      toast.error(errorMessage);
    }
  };

  const handleUpdate = (id: string) => {
    const ticket = (role === "superadmin" ? allTickets : schoolTickets).find((t) => t.id === id);
    setSelectedTicket(ticket || null);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedTicket) return;
    
    setUpdatingTicket(true);
    try {
      const updatePayload: any = {
        title: selectedTicket.title?.trim(),
        description: selectedTicket.description?.trim(),
        category: selectedTicket.category,
        priority: selectedTicket.priority,
        status: selectedTicket.status,
      };

      // Only add assignedToId if it's valid, not null, and not empty
      if (selectedTicket.assignedTo && selectedTicket.assignedTo.trim() && selectedTicket.assignedTo !== "null" && selectedTicket.assignedTo !== "undefined" && selectedTicket.assignedTo.match(/^c[a-z0-9]{24}$/)) {
        updatePayload.assignedToId = selectedTicket.assignedTo;
      }

      await updateTicket(selectedTicket.id!, updatePayload);
      toast.success("Ticket successfully updated");
      fetchTickets();
      setSelectedTicket(null);
      closeModal("update_ticket");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update ticket";
      
      // Handle specific validation errors
      if (error?.response?.data?.details) {
        const validationErrors = error.response.data.details.map((err: any) => err.message).join(", ");
        toast.error(`Validation Error: ${validationErrors}`, { autoClose: 5000 });
      } else if (errorMessage.includes("Validation failed")) {
        toast.error(`Validation Error: ${errorMessage}`, { autoClose: 5000 });
      } else if (errorMessage.includes("Prisma") || errorMessage.includes("database")) {
        toast.error("Database error occurred. Please try again later.", { autoClose: 3000 });
      } else {
        toast.error(errorMessage, { autoClose: 3000 });
      }
    } finally {
      setUpdatingTicket(false);
    }
  };

  const filteredTickets = useMemo(() => {
    const tickets = role === "superadmin" ? allTickets : schoolTickets;
    return tickets
      .filter(ticket => {
        const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
        const matchesSearch = searchTerm === "" ||
          ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Date filtering
        let matchesDate = true;
        if (startDate || endDate) {
          const ticketDate = new Date(ticket.createdAt || "");
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(endDate) : null;
          
          if (start && end) {
            matchesDate = ticketDate >= start && ticketDate <= end;
          } else if (start) {
            matchesDate = ticketDate >= start;
          } else if (end) {
            matchesDate = ticketDate <= end;
          }
        }
        
        return matchesStatus && matchesSearch && matchesDate;
      })
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      });
  }, [role, allTickets, schoolTickets, filterStatus, sortOrder, searchTerm, startDate, endDate]);

  const categoryStats = useMemo(() => {
    const tickets = role === "superadmin" ? allTickets : schoolTickets;
    const stats: Record<string, { open: number; closed: number }> = {};
    tickets.forEach(t => {
      const cat = t.category || "Uncategorized";
      if (!stats[cat]) stats[cat] = { open: 0, closed: 0 };
      if ((t.status || "").toLowerCase() === "closed") {
        stats[cat].closed += 1;
      } else {
        stats[cat].open += 1;
      }
    });
    return stats;
  }, [role, allTickets, schoolTickets]);

  const getPriorityClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'badge-danger';
      case 'medium': return 'badge-warning';
      case 'low': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-warning';
      case 'approved': case 'completed': return 'bg-success';
      case 'rejected': return 'bg-danger';
      case 'in progress': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  const canCreateTicket = role !== "superadmin" && schoolID && userId;

  // 1. Add a helper to detect dark mode
  const dataTheme = useSelector((state: any) => state.themeSetting?.dataTheme);
  const isDark = dataTheme === 'dark_data_theme';
 
  return (
    <div>
      <div className={isDark ? 'container-fluid p-0 bg-dark text-light min-vh-100' : 'container-fluid p-0'}>
        <div className={ismobile ? 'page-wrapper' : role === 'admin' ? 'page-wrapper' : 'pt-4'}>
          <ToastContainer position="top-center" autoClose={3000} theme={isDark ? 'dark' : 'light'} />
          <div className={isDark ? 'content container-fluid bg-dark text-light' : 'content container-fluid'}>
            {/* Header Section */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                  <div className="mb-3 mb-md-0">
                    <h3 className={isDark ? 'page-title mb-0 text-white' : 'page-title mb-0'}>Tickets</h3>
                    <nav aria-label="breadcrumb">
                      <ol className={isDark ? 'breadcrumb mb-0 bg-dark text-light' : 'breadcrumb mb-0'}>
                        <li className="breadcrumb-item">
                          {role === "admin" ? (
                            <Link to={route.adminDashboard} className={isDark ? 'text-light' : ''}>Dashboard</Link>
                          ) : role === "teacher" ? (
                            <Link to={route.teacherDashboard} className={isDark ? 'text-light' : ''}>Dashboard</Link>
                          ) : role === "superadmin" ? (
                            <Link to={route.superAdminDashboard} className={isDark ? 'text-light' : ''}>Dashboard</Link>
                          ) : null}
                        </li>
                        <li className="breadcrumb-item">Support</li>
                        <li className="breadcrumb-item active">Tickets</li>
                      </ol>
                    </nav>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <button className="btn btn-light btn-sm" onClick={fetchTickets}>
                      <i className="ti ti-refresh me-1"></i>
                    </button>
                    <button className="btn btn-light btn-sm">
                      <i className="ti ti-printer me-1"></i>
                    </button>
                    <div className="dropdown">
                      <button className="btn btn-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <i className="ti ti-file-export me-1"></i> Export
                      </button>
                      <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#">PDF</a></li>
                        <li><a className="dropdown-item" href="#">Excel</a></li>
                        <li><a className="dropdown-item" href="#">CSV</a></li>
                      </ul>
                    </div>
                    {canCreateTicket && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#add_ticket"
                      >
                        <i className="ti ti-plus me-1"></i> Add New Ticket
                      </button>
                    )}
                    {!canCreateTicket && role !== "superadmin" && (
                      <div className="alert alert-warning mb-0 py-2 px-3">
                        <small>
                          <i className="ti ti-alert-triangle me-1"></i>
                          {!schoolID ? "School ID required" : !userId ? "User ID required" : "Cannot create tickets"}
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Filters Section */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-12 col-sm-6 col-md-3">
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search tickets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <i className="ti ti-search position-absolute end-0 top-50 translate-middle-y me-2"></i>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-3">
                    <CommonSelect
                      className="select"
                      options={[{ value: 'all', label: 'All Status' }, ...statuses]}
                      onChange={(option) => setFilterStatus(option?.value || 'all')}
                      defaultValue={{ value: 'all', label: 'All Status' }}
                    />
                  </div>
                  <div className="col-12 col-sm-6 col-md-4">
                    <div className="d-flex gap-2">
                      <input 
                        type="date" 
                        className="form-control" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="Start Date"
                      />
                      <input 
                        type="date" 
                        className="form-control" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="End Date"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-2">
                    <button
                      className="btn btn-light w-100"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      <i className={`ti ti-sort-${sortOrder === 'asc' ? 'ascending' : 'descending'}-2 me-1`}></i>
                      Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="row">
              {/* Tickets List */}
              <div className="col-xl-8 col-xxl-9">
                {loading ? (
                  <div className="card">
                    <div className="card-body p-4 text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </div>
                ) : filteredTickets.length === 0 ? (
                  <div className="card">
                    <div className="card-body p-4 text-center">
                      <i className="ti ti-ticket fs-1 text-muted mb-2 d-block"></i>
                      <h5 className={isDark ? 'text-light mb-2' : 'text-muted mb-2'}>No tickets found</h5>
                      <p className={isDark ? 'text-light mb-0' : 'text-muted mb-0'}>
                        {canCreateTicket ? "Please add a ticket to get started." : "No tickets available for your role."}
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredTickets.map((ticket) => (
                    <div className="card mb-3" key={ticket.id}>
                      <div className="card-body p-0">
                        <div className="p-3 border-bottom">
                          <div className="row align-items-center">
                            <div className="col">
                              <div className="d-flex flex-wrap gap-2">
                                <span className={`badge ${getPriorityClass(ticket.priority)}`}>{ticket.priority}</span>
                                <span className={`badge ${getStatusClass(ticket.status)}`}>{ticket.status}</span>
                                {ticket.category && (
                                  <span className="badge bg-info">{ticket.category}</span>
                                )}
                                <span className="badge bg-secondary">
                                  {ticket.ticketNumber
                                    ? `TKT #${String(ticket.ticketNumber).padStart(2, '0')}`
                                    : `#${ticket.id?.slice(0, 6)}`}
                                </span>
                              </div>
                            </div>
                            <div className="col-auto">
                              <div className="d-flex gap-2">
                                {role === "superadmin" && (
                                  <button
                                    type="button"
                                    className="btn btn-light btn-sm"
                                    data-bs-toggle="modal"
                                    data-bs-target="#update_ticket"
                                    onClick={() => handleUpdate(ticket.id!)}
                                  >
                                    <i className="ti ti-edit me-1"></i>
                                    Update
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className="btn btn-light btn-sm"
                                  onClick={() => handledelete(ticket.id!)}
                                >
                                  <i className="ti ti-trash me-1"></i>
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="d-flex">
                            <div className="flex-shrink-0">
                              <div className="avatar avatar-md" style={{ width: 48, height: 48, overflow: 'hidden' }}>
                                {ticket.user?.avatar ? (
                                  <img
                                    src={ticket.user.avatar}
                                    alt={ticket.user.name}
                                    className="rounded-circle"
                                    style={{ width: 48, height: 48, objectFit: 'cover' }}
                                  />
                                ) : (
                                  <span className="avatar-text rounded-circle bg-primary" style={{ width: 48, height: 48, display: 'inline-block', lineHeight: '48px', textAlign: 'center' }}>
                                    {ticket.user?.name?.charAt(0) || 'U'}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h5 className={isDark ? 'mb-1 text-white' : 'mb-1'}>
                                <Link to={`${route.ticketDetail}/${ticket.id}`} className={isDark ? 'text-white' : 'text-body'}>
                                  {ticket.title}
                                </Link>
                              </h5>
                              <p className={isDark ? 'text-light mb-2' : 'text-muted mb-2'}>{ticket.description}</p>
                              <div className="d-flex flex-wrap gap-3 text-muted small">
                                <span>
                                  <i className="ti ti-calendar me-1"></i>
                                  {moment(ticket.createdAt).format('MMM DD, YYYY')}
                                </span>
                                {ticket.updatedAt && (
                                  <span>
                                    <i className="ti ti-clock me-1"></i>
                                    {moment(ticket.updatedAt).fromNow()}
                                  </span>
                                )}
                                {ticket.comments !== undefined && (
                                  <span>
                                    <i className="ti ti-message me-1"></i>
                                    {ticket.comments} Comments
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Sidebar */}
              <div className="col-xl-4 col-xxl-3">
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className={isDark ? 'card-title mb-0 text-white' : 'card-title mb-0'}>Ticket Categories</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex flex-column gap-3">
                      {Object.entries(categoryStats).map(([cat, count]) => (
                        <div key={cat} className="d-flex justify-content-between align-items-center">
                          <span>{cat}</span>
                          <div>
                            {count.open > 0 && (
                              <span className="badge bg-danger me-1">{count.open}</span>
                            )}
                            {count.closed > 0 && (
                              <span className="badge bg-success">{count.closed}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Support Agents Section - Hide if no agents */}
                {assignees.length > 0 && (
                  <div className="card">
                    <div className="card-header">
                      <h5 className={isDark ? 'card-title mb-0 text-white' : 'card-title mb-0'}>Support Agents</h5>
                    </div>
                    <div className="card-body">
                      {assignees.map(agent => (
                        <div className="d-flex align-items-center mb-2" key={agent.value}>
                          <div className="flex-shrink-0">
                            <div className="avatar avatar-sm" style={{ width: 32, height: 32, overflow: 'hidden' }}>
                              <span className="avatar-text rounded-circle bg-primary" style={{ width: 32, height: 32, display: 'inline-block', lineHeight: '32px', textAlign: 'center' }}>
                                {agent.label.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h6 className={isDark ? 'mb-0 text-white' : 'mb-0'}>{agent.label}</h6>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Ticket Modal */}
      <div className="modal fade" id="add_ticket">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Ticket</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Title <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={TicketData.title}
                  onChange={(e) => setTicketData({ ...TicketData, title: e.target.value })}
                  placeholder="Enter ticket title"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description <span className="text-danger">*</span></label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={TicketData.description}
                  onChange={(e) => setTicketData({ ...TicketData, description: e.target.value })}
                  placeholder="Enter ticket description"
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Category <span className="text-danger">*</span></label>
                <CommonSelect
                  className="select"
                  options={categories}
                  onChange={(option) => setTicketData({ ...TicketData, category: option?.value || '' })}
                  defaultValue={categories.find(opt => opt.value === TicketData.category)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Priority <span className="text-danger">*</span></label>
                <CommonSelect
                  className="select"
                  options={priorities}
                  onChange={(option) => setTicketData({ ...TicketData, priority: option?.value || '' })}
                  defaultValue={priorities.find(opt => opt.value === TicketData.priority)}
                />
              </div>
              {assignees.length > 0 && (
                <div className="mb-3">
                  <label className="form-label">Assign To (Optional)</label>
                  <CommonSelect
                    className="select"
                    options={assignees}
                    onChange={(option) => setTicketData({ ...TicketData, assignedTo: option?.value || '' })}
                    defaultValue={assignees.find(opt => opt.value === TicketData.assignedTo)}
                  />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancel</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddTicket}
                disabled={addingTicket || !TicketData.title || !TicketData.description || !TicketData.priority || !TicketData.category}
              >
                {addingTicket ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adding...
                  </>
                ) : (
                  "Add Ticket"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Update Ticket Modal */}
      {selectedTicket && (
        <div className="modal fade" id="update_ticket">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Ticket</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setSelectedTicket(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <CommonSelect
                    className="select"
                    options={statuses}
                    onChange={(option) => setSelectedTicket({ ...selectedTicket, status: option?.value || '' })}
                    defaultValue={statuses.find(opt => opt.value === selectedTicket.status)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Priority</label>
                  <CommonSelect
                    className="select"
                    options={priorities}
                    onChange={(option) => setSelectedTicket({ ...selectedTicket, priority: option?.value || '' })}
                    defaultValue={priorities.find(opt => opt.value === selectedTicket.priority)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <CommonSelect
                    className="select"
                    options={categories}
                    onChange={(option) => setSelectedTicket({ ...selectedTicket, category: option?.value || '' })}
                    defaultValue={categories.find(opt => opt.value === selectedTicket.category)}
                  />
                </div>
                {assignees.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label">Assigned To (Optional)</label>
                    <CommonSelect
                      className="select"
                      options={assignees}
                      onChange={(option) => setSelectedTicket({ ...selectedTicket, assignedTo: option?.value || '' })}
                      defaultValue={assignees.find(opt => opt.value === selectedTicket.assignedTo)}
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  data-bs-dismiss="modal"
                  onClick={() => setSelectedTicket(null)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleUpdateSubmit}
                  disabled={updatingTicket}
                >
                  {updatingTicket ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    "Update Ticket"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;

