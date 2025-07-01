import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTicketsByAssignee } from "../../../services/superadmin/ticketApi";

interface Ticket {
  id: string;
  title: string;
  description: string;
  category?: string;
  status: string;
  priority: string;
}

const EmployeeTickets = () => {
  const user = useSelector((state: any) => state.auth.userObj);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState<"open" | "completed">("open");

  const fetchTickets = async () => {
    if (!user?.id) return;
    const res = await getTicketsByAssignee(user.id);
    setTickets(res.data || []);
  };

  useEffect(() => {
    fetchTickets();
  }, [user?.id]);

  const grouped = tickets.reduce<Record<string, Ticket[]>>((acc, t) => {
    const key = t.category || "Uncategorized";
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  const filtered = Object.entries(grouped).map(([cat, list]) => ({
    category: cat,
    items: list.filter(l =>
      activeTab === "open"
        ? l.status.toLowerCase() !== "closed"
        : l.status.toLowerCase() === "closed"
    ),
  }));

  return (
    <div className="container mt-4">
      <h3>My Tickets</h3>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "open" ? "active" : ""}`} onClick={() => setActiveTab("open")}>Open</button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
        </li>
      </ul>
      {filtered.map(({ category, items }) => (
        <div key={category} className="mb-4">
          <h5>{category}</h5>
          <ul className="list-group">
            {items.map(t => (
              <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{t.title}</span>
                <span className="badge bg-secondary">{t.status}</span>
              </li>
            ))}
            {items.length === 0 && <li className="list-group-item">No tickets</li>}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default EmployeeTickets;
