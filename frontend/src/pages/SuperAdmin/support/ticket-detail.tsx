import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTicketById } from "../../../services/superadmin/ticketApi";
import { all_routes } from "../../../router/all_routes";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const route = all_routes;

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        if (!id) {
          setError("Ticket ID is required");
          setLoading(false);
          return;
        }
        
        setLoading(true);
        setError(null);
        
        const res = await getTicketById(id);
        if (res.data) {
          setTicket(res.data);
        } else {
          setError("Ticket not found");
        }
      } catch (err: any) {
        console.error("Error fetching ticket:", err);
        setError(
          err?.response?.data?.message || err?.message || "Failed to load ticket"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content pb-lg-4 pb-2">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="content pb-lg-4 pb-2">
          <div className="alert alert-danger m-3">
            <h5>Error</h5>
            <p>{error}</p>
            <Link to={route.tickets} className="btn btn-primary">
              Back to Tickets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="page-wrapper">
        <div className="content pb-lg-4 pb-2">
          <div className="alert alert-warning m-3">
            <h5>Ticket Not Found</h5>
            <p>The requested ticket could not be found.</p>
            <Link to={route.tickets} className="btn btn-primary">
              Back to Tickets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="content pb-lg-4 pb-2">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h3 className="page-title mb-1">Ticket Details</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={route.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">Support</li>
                <li className="breadcrumb-item">
                  <Link to={route.tickets}>Tickets</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Ticket{' '}
                  {ticket.ticketNumber
                    ? `#${String(ticket.ticketNumber).padStart(2, '0')}`
                    : ticket.id}
                </li>
              </ol>
            </nav>
          </div>
          <div>
            <Link to={route.tickets} className="btn btn-outline-primary">
              <i className="ti ti-arrow-left me-1"></i>
              Back to Tickets
            </Link>
          </div>
        </div>
        
        <div className="row">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title mb-0">{ticket.title}</h4>
              </div>
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="text-muted mb-2">Status</h6>
                    <span className={`badge ${ticket.status === 'Open' ? 'bg-success' : ticket.status === 'Pending' ? 'bg-warning' : 'bg-secondary'}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted mb-2">Priority</h6>
                    <span className={`badge ${ticket.priority === 'High' ? 'bg-danger' : ticket.priority === 'Medium' ? 'bg-warning' : 'bg-info'}`}>
                      {ticket.priority}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h6 className="text-muted mb-2">Description</h6>
                  <p className="mb-0">{ticket.description}</p>
                </div>
                
                {ticket.category && (
                  <div className="mb-4">
                    <h6 className="text-muted mb-2">Category</h6>
                    <span className="badge bg-info">{ticket.category}</span>
                  </div>
                )}
                
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-muted mb-2">Created</h6>
                    <p className="mb-0">
                      {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted mb-2">Last Updated</h6>
                    <p className="mb-0">
                      {ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Ticket Information</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <h6 className="text-muted mb-1">Ticket ID</h6>
                  <p className="mb-0 font-monospace">
                    {ticket.ticketNumber
                      ? `TKT-${String(ticket.ticketNumber).padStart(4, '0')}`
                      : ticket.id}
                  </p>
                </div>
                
                {ticket.user && (
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Created By</h6>
                    <p className="mb-0">{ticket.user.name || 'Unknown'}</p>
                  </div>
                )}
                
                {ticket.assignedTo && (
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Assigned To</h6>
                    <p className="mb-0">{ticket.assignedTo}</p>
                  </div>
                )}
                
                <div className="mb-3">
                  <h6 className="text-muted mb-1">School ID</h6>
                  <p className="mb-0">{ticket.schoolId || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
