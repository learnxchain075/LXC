import { Link } from "react-router-dom";
import {
  markAs,
  names,
  priority,
  staffName,
  ticketStatus,
} from "../../../core/common/selectoption/selectoption";
import { all_routes } from "../../../router/all_routes";
import CommonSelect from "../../../core/common/commonSelect";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import TooltipOption from "../../../core/common/tooltipOption";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllTickets, getTicketsBySchool, getTicketsByuserid, createTicket, getTicketMetadata } from "../../../services/superadmin/ticketApi";
import LoadingSkeleton from "../../../components/LoadingSkeleton";

const TicketDetails = () => {
  const route = all_routes;
  const user = useSelector((state: any) => state.auth.userObj);
  const role = user.role;
  const schoolID = localStorage.getItem("schoolId") || "";
  const userId = localStorage.getItem("userId") || "";

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [priorities, setPriorities] = useState<{ value: string; label: string }[]>([]);
  const [statuses, setStatuses] = useState<{ value: string; label: string }[]>([]);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    status: "Open",
    schoolId: schoolID,
    userId: userId,
  });

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (role === "superadmin") {
        res = await getAllTickets();
      } else if (role === "admin") {
        res = await getTicketsBySchool(schoolID);
      } else if (role === "teacher") {
        res = await getTicketsByuserid(userId);
      }
      setTickets(res?.data || []);
    } catch (err: any) {
      console.error("Error fetching tickets:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to fetch tickets");
      setTickets([]);
    } finally {
      setLoading(false);
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
      console.error("Failed to load ticket metadata:", err);
      // Set default values if API fails
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

  useEffect(() => {
    fetchTickets();
    fetchMetadata();
  }, [role]);

  const handleTicketCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTicket.title || !newTicket.description || !newTicket.category || !newTicket.priority) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await createTicket(newTicket);
      if (response.data) {
        toast.success("Ticket created successfully!");
        fetchTickets();
        setNewTicket({
          title: "",
          description: "",
          category: "",
          priority: "",
          status: "Open",
          schoolId: schoolID,
          userId: userId,
        });
        // Close modal
        const modal = document.getElementById('add_ticket');
        if (modal) {
          const closeButton = modal.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
          if (closeButton) closeButton.click();
        }
      } else {
        toast.error(response.data?.message || "Failed to create ticket");
      }
    } catch (err: any) {
      console.error("Error creating ticket:", err);
      toast.error((err?.response?.data?.message || err?.message || "Failed to create ticket") + " (see console for details)");
    }
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content pb-lg-4 pb-2">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Tickets</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={route.adminDashboard}>Dashboard</Link>
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
              <div className="mb-2">
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#add_ticket"
                  className="btn btn-primary"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add New Ticket
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            {/* Tickets */}
            <div className="col-xl-8 col-xxl-9">
              {/* Ticket List */}
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between p-3 pb-0">
                  <h5 className="text-primary mb-3">IT Support</h5>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-danger mb-3 me-3">
                      <i className="ti ti-circle-filled fs-5 me-1" />
                      High
                    </span>
                    <div className="mb-3">
                      <CommonSelect
                        className="select"
                        options={markAs}
                        defaultValue={markAs[1]}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-body p-0">
                  {loading ? (
                    <div className="p-4">
                      <LoadingSkeleton />
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger m-3">
                      <h5>Error</h5>
                      <p>{error}</p>
                      <button className="btn btn-primary" onClick={fetchTickets}>
                        Retry
                      </button>
                    </div>
                  ) : tickets.length === 0 ? (
                    <div className="text-center p-4 text-muted">
                      <i className="ti ti-ticket fs-1 mb-3 d-block"></i>
                      <h5>No tickets found</h5>
                      <p>Create your first ticket to get started.</p>
                    </div>
                  ) : (
                  <div className="ticket-information ticket-details">
                      {tickets.map((ticket) => (
                        <div key={ticket.id} className="border-bottom p-3">
                          <span className="badge bg-pending rounded-pill mb-1">#{ticket.id}</span>
                          <div className="d-flex align-items-center mb-2">
                            <h5 className="fw-semibold me-2">{ticket.title}</h5>
                            <span className={`badge ${ticket.status === 'Open' ? 'bg-success' : ticket.status === 'Pending' ? 'bg-warning' : 'bg-secondary'} d-flex align-items-center ms-1`}>
                              {ticket.status}
                            </span>
                          </div>
                          <p className="mb-3">{ticket.description}</p>
                          <div className="d-flex align-items-center flex-wrap">
                            <p className="d-flex align-items-center mb-1 me-2">
                              <i className="ti ti-calendar-bolt me-1" />
                              {ticket.updatedAt ? `Updated ${new Date(ticket.updatedAt).toLocaleDateString()}` : ticket.createdAt ? `Created ${new Date(ticket.createdAt).toLocaleDateString()}` : ""}
                            </p>
                            {ticket.priority && (
                              <span className={`badge ${ticket.priority === 'High' ? 'bg-danger' : ticket.priority === 'Medium' ? 'bg-warning' : 'bg-info'} me-2`}>
                                {ticket.priority}
                              </span>
                            )}
                            {ticket.category && (
                              <span className="badge bg-info">
                                {ticket.category}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* /Ticket List */}
              <div className="load-more text-center">
                <Link to="#" className="btn btn-primary">
                  <i className="ti ti-loader-3" />
                  Load More
                </Link>
              </div>
            </div>
            {/* /Tickets */}
            {/* Ticket Details */}
            <div className="col-xl-4 col-xxl-3 theiaStickySidebar">
              <div className="stickybar">
                <div className="stickybar">
                  <div className="card">
                    <div className="card-header p-3">
                      <h4>Ticket Details</h4>
                    </div>
                    <div className="card-body p-0">
                      <div className="border-bottom p-3">
                        <div className="mb-3">
                          <label className="form-label">Change Priority</label>
                          <CommonSelect
                            className="select"
                            options={priority}
                            defaultValue={undefined}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Assign To</label>
                          <CommonSelect
                            className="select"
                            options={names}
                            defaultValue={undefined}
                          />
                        </div>
                        <div className="mb-0">
                          <label className="form-label">Ticket Status</label>
                          <CommonSelect
                            className="select"
                            options={ticketStatus}
                            defaultValue={undefined}
                          />
                        </div>
                      </div>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <span className="avatar avatar-md me-2 flex-shrink-0">
                          <ImageWithBasePath
                            src="assets/img/teachers/teacher-03.jpg"
                            className="rounded-circle"
                            alt="Img"
                          />
                        </span>
                        <div>
                          <span className="fs-12">User</span>
                          <p className="text-dark">Hellana</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <span className="avatar avatar-md me-2 flex-shrink-0">
                          <ImageWithBasePath
                            src="assets/img/teachers/teacher-04.jpg"
                            className="rounded-circle"
                            alt="Img"
                          />
                        </span>
                        <div>
                          <span className="fs-12">Support Agent</span>
                          <p className="text-dark">Angio</p>
                        </div>
                      </div>
                      <div className="border-bottom p-3">
                        <span className="fs-12">Category</span>
                        <p className="text-dark">Repair &amp; Service</p>
                      </div>
                      <div className="border-bottom p-3">
                        <span className="fs-12">Email</span>
                        <p className="text-dark">Hellana@gmail.com</p>
                      </div>
                      <div className="p-3">
                        <span className="fs-12">Last Updated / Closed On</span>
                        <p className="text-dark">25 May 2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Ticket Details */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      {/* Add Ticket */}
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
            <form onSubmit={handleTicketCreation}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="col-form-label">Title <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Title"
                        value={newTicket.title}
                        onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">Event Category <span className="text-danger">*</span></label>
                      <CommonSelect
                        className="select"
                        options={categories}
                        onChange={(option) => setNewTicket({ ...newTicket, category: option?.value || '' })}
                        defaultValue={categories.find(opt => opt.value === newTicket.category)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">Subject</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Subject"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">Assign To</label>
                      <CommonSelect
                        className="select"
                        options={staffName}
                        defaultValue={undefined}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">
                        Ticket Description <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        placeholder="Add Question"
                        value={newTicket.description}
                        onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">Priority <span className="text-danger">*</span></label>
                      <CommonSelect
                        className="select"
                        options={priorities}
                        onChange={(option) => setNewTicket({ ...newTicket, priority: option?.value || '' })}
                        defaultValue={priorities.find(opt => opt.value === newTicket.priority)}
                      />
                    </div>
                    <div className="mb-0">
                      <label className="col-form-label">Status</label>
                      <CommonSelect
                        className="select"
                        options={statuses}
                        onChange={(option) => setNewTicket({ ...newTicket, status: option?.value || 'Open' })}
                        defaultValue={statuses.find(opt => opt.value === newTicket.status)}
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
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!newTicket.title || !newTicket.description || !newTicket.category || !newTicket.priority}
                >
                  Add Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Ticket */}
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default TicketDetails;
