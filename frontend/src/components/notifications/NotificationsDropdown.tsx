import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { getNotifications } from '../../services/projectService';

interface Props {
  userId: string;
}

interface Note {
  id: string;
  message: string;
  type: string;
  task?: { id: string; title: string };
  createdAt: string;
}

const NotificationsDropdown = ({ userId }: Props) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (userId && open) {
      getNotifications(userId).then((res) => setNotes(res.data || []));
    }
  }, [userId, open]);

  return (
    <Dropdown show={open} onToggle={() => setOpen(!open)}>
      <Dropdown.Toggle className="btn btn-outline-light bg-white btn-icon position-relative me-1">
        <i className="ti ti-bell" />
        {notes.length > 0 && <span className="notification-status-dot" />}
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-end">
        {notes.length === 0 && (
          <span className="dropdown-item-text">No notifications</span>
        )}
        {notes.map((n) => (
          <Dropdown.Item key={n.id} className="small">
            <div className="fw-bold">{n.task?.title}</div>
            <div>{n.message}</div>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationsDropdown;
