import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTicketById } from "../../../services/superadmin/ticketApi";
import { all_routes } from "../../../router/all_routes";

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const route = all_routes;

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        if (!id) return;
        const res = await getTicketById(id);
        setTicket(res.data);
      } catch (err: any) {
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
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger m-3">{error}</div>;
  }

  if (!ticket) {
    return <div className="p-4">Ticket not found</div>;
  }

  return (
    <div className="page-wrapper">
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
                <li className="breadcrumb-item active" aria-current="page">
                  Ticket{' '}
                  {ticket.ticketNumber
                    ? `#${String(ticket.ticketNumber).padStart(2, '0')}`
                    : ticket.id}
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h4 className="fw-semibold mb-2">{ticket.title}</h4>
            <p className="mb-2">{ticket.description}</p>
            <p className="mb-1">Status: {ticket.status}</p>
            <p className="mb-0">Priority: {ticket.priority}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
