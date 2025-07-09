import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDashboardResourcesByStudentId, IHoliday, INotice } from '../../../../../services/student/StudentAllApi';
import { useSelector } from 'react-redux';

type Notice = {
  key: string;
  title: string;
  date: string;
  description: string;
  attachment: string;
  noticeDate: string;
  publishDate: string;
};

type Holiday = {
  key: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
};

type Event = {
  key: string;
  title: string;
  date: string;
  description: string;
  attachment: string;
};

type NoticeBoardData = {
  notices: Notice[];
  holidays: Holiday[];
  events: Event[];
};

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger m-3">
          <h5>Something went wrong.</h5>
          <p>Please try refreshing the page or contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const NoticeBoardstudent = () => {
  const [data, setData] = useState<NoticeBoardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState({ notices: true, events: true, holidays: true });
  const [openHolidayDesc, setOpenHolidayDesc] = useState<{ [key: string]: boolean }>({});

  // Get theme from Redux
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const isDark = dataTheme === 'dark_data_theme';

  const SkeletonPlaceholder = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
    <span className={`placeholder bg-secondary ${className}`} style={style} />
  );

  // Animation for new/unread items
  const highlightStyle = {
    animation: 'highlight-fade 2s ease-in-out',
    background: 'linear-gradient(90deg, #fffbe6 0%, #e6f7ff 100%)',
  };
  const animationStyles = `
    @keyframes highlight-fade {
      0% { background: #fffbe6; }
      100% { background: #fff; }
    }
  `;

  // Helper to check if item is new (published today or in the future)
  const isNew = (dateStr: string) => {
    const today = new Date();
    const itemDate = new Date(dateStr);
    return itemDate >= new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  useEffect(() => {
    setIsLoading(true);
    const studentId = localStorage.getItem('studentId') || '';
    toast.promise(
      getDashboardResourcesByStudentId(studentId)
        .then((response) => {
          if (response.data.success) {
            const notices = response.data.notices
              .filter((notice: INotice) => new Date(notice.publishDate) <= new Date())
              .map((notice: INotice) => ({
                key: notice.id,
                title: notice.title,
                date: new Date(notice.noticeDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }),
                description: notice.message,
                attachment: notice.attachment,
                noticeDate: notice.noticeDate,
                publishDate: notice.publishDate,
              }));
            const events = response.data.notices
              .filter((notice: INotice) => new Date(notice.publishDate) > new Date())
              .map((notice: INotice) => ({
                key: notice.id,
                title: notice.title,
                date: notice.publishDate,
                description: notice.message,
                attachment: notice.attachment,
              }));
            const holidays = response.data.holidays.map((holiday: IHoliday) => ({
              key: holiday.id,
              title: holiday.name,
              startDate: holiday.fromday || holiday.date,
              endDate: holiday.toDay || '',
              description: holiday.description || '',
            }));
            return { notices, holidays, events };
          }
          throw new Error('API response unsuccessful');
        }),
      {
        success: 'Notices and holidays loaded!',
        error: 'Failed to load notices and holidays.',
      }
    )
      .then((transformedData) => {
        setData(transformedData);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [refreshKey]);

  const handleRefresh = () => setRefreshKey((k) => k + 1);
  const handleToggle = (section: keyof typeof show) => setShow((prev) => ({ ...prev, [section]: !prev[section] }));
  const handleHolidayClick = (key: string) => {
    setOpenHolidayDesc((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filtered data
  const filterText = (text: string) => text.toLowerCase().includes(search.toLowerCase());
  const filtered = data
    ? {
        notices: data.notices.filter(
          (n) => filterText(n.title) || filterText(n.description)
        ),
        events: data.events.filter(
          (e) => filterText(e.title) || filterText(e.description)
        ),
        holidays: data.holidays.filter(
          (h) => filterText(h.title)
        ),
      }
    : { notices: [], events: [], holidays: [] };

  return (
    <ErrorBoundary>
      <style>{animationStyles}</style>
      <div className={`container py-4${isDark ? ' bg-dark text-light' : ''}`} style={{ minHeight: '100vh' }}>
        <ToastContainer position="top-center" autoClose={3000} theme={isDark ? 'dark' : 'colored'} />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <h3 className="fw-bold mb-0 d-flex align-items-center gap-2">
            <i className="bi bi-megaphone text-primary fs-2"></i>
            Notice Board
          </h3>
          <div className="d-flex gap-2 align-items-center w-100 w-md-auto">
            <input
              type="text"
              className={`form-control form-control-lg shadow-sm${isDark ? ' bg-secondary text-light border-0' : ''}`}
              placeholder="Search notices, events, holidays..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 320 }}
            />
            <button className="btn btn-outline-primary btn-lg" onClick={handleRefresh} disabled={isLoading}>
            <i className="bi bi-arrow-clockwise me-1"></i>Refresh
          </button>
          </div>
        </div>
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status" />
            <div>Loading...</div>
          </div>
        ) : data ? (
          <div className="row g-4">
            {/* Notices */}
            <div className="col-12 col-lg-4">
              <div className={`card shadow-sm h-100${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                <div className="card-header bg-warning bg-opacity-25 d-flex align-items-center gap-2">
                  <i className="bi bi-bell text-warning fs-4"></i>
                  <span className="fw-bold">Notices</span>
                  <span className="badge bg-warning ms-auto">{filtered.notices.length}</span>
                  <button className="btn btn-sm btn-link ms-2" onClick={() => handleToggle('notices')}>
                    <i className={`bi ${show.notices ? 'bi-caret-down-fill' : 'bi-caret-right-fill'}`}></i>
                  </button>
                    </div>
                {show.notices && (
                  <ul className="list-group list-group-flush">
                    {filtered.notices.length > 0 ? filtered.notices.map((notice) => (
                      <li key={notice.key} className={`list-group-item${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                        <div className="fw-bold mb-1">{notice.title}</div>
                        <div className="text-muted small mb-1">{new Date(notice.noticeDate).toLocaleDateString()}</div>
                        <div className="mb-1">{notice.description}</div>
                        {notice.attachment && (
                          <a href={notice.attachment} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                            <i className="bi bi-paperclip"></i> Attachment
                      </a>
                        )}
                      </li>
                    )) : <li className={`list-group-item text-muted${isDark ? ' bg-dark border-secondary' : ''}`}>No notices found.</li>}
                  </ul>
                    )}
                  </div>
            </div>
            {/* Events */}
            <div className="col-12 col-lg-4">
              <div className={`card shadow-sm h-100${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                <div className="card-header bg-primary bg-opacity-25 d-flex align-items-center gap-2">
                  <i className="bi bi-calendar-event text-primary fs-4"></i>
                  <span className="fw-bold">Events</span>
                  <span className="badge bg-primary ms-auto">{filtered.events.length}</span>
                  <button className="btn btn-sm btn-link ms-2" onClick={() => handleToggle('events')}>
                    <i className={`bi ${show.events ? 'bi-caret-down-fill' : 'bi-caret-right-fill'}`}></i>
                  </button>
                    </div>
                {show.events && (
                  <ul className="list-group list-group-flush">
                    {filtered.events.length > 0 ? filtered.events.map((event) => (
                      <li key={event.key} className={`list-group-item${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                        <div className="fw-bold mb-1">{event.title}</div>
                        <div className="text-muted small mb-1">{new Date(event.date).toLocaleDateString()}</div>
                        <div className="mb-1">{event.description}</div>
                        {event.attachment && (
                          <a href={event.attachment} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                            <i className="bi bi-paperclip"></i> Attachment
                          </a>
                        )}
                      </li>
                    )) : <li className={`list-group-item text-muted${isDark ? ' bg-dark border-secondary' : ''}`}>No events found.</li>}
                  </ul>
                    )}
                  </div>
            </div>
            {/* Holidays */}
            <div className="col-12 col-lg-4">
              <div className={`card shadow-sm h-100${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                <div className="card-header bg-success bg-opacity-25 d-flex align-items-center gap-2">
                  <i className="bi bi-calendar-check text-success fs-4"></i>
                  <span className="fw-bold">Holidays</span>
                  <span className="badge bg-success ms-auto">{filtered.holidays.length}</span>
                  <button className="btn btn-sm btn-link ms-2" onClick={() => handleToggle('holidays')}>
                    <i className={`bi ${show.holidays ? 'bi-caret-down-fill' : 'bi-caret-right-fill'}`}></i>
                  </button>
                    </div>
                {show.holidays && (
                  <ul className="list-group list-group-flush">
                    {filtered.holidays.length > 0 ? filtered.holidays.map((holiday) => (
                      <li key={holiday.key} className={`list-group-item${isDark ? ' bg-dark text-light border-secondary' : ''}`}>
                        <div
                          className="fw-bold mb-1 holiday-title clickable"
                          style={{ cursor: 'pointer', textDecoration: 'underline' }}
                          onClick={() => handleHolidayClick(holiday.key)}
                        >
                          {holiday.title}
                        </div>
                        <div className="text-muted small mb-1">
                          {holiday.endDate
                            ? `${new Date(holiday.startDate).toLocaleDateString()} to ${new Date(holiday.endDate).toLocaleDateString()}`
                            : new Date(holiday.startDate).toLocaleDateString()}
                  </div>
                        {openHolidayDesc[holiday.key] && holiday.description && (
                          <div className="mb-1">{holiday.description}</div>
                        )}
                      </li>
                    )) : <li className={`list-group-item text-muted${isDark ? ' bg-dark border-secondary' : ''}`}>No holidays found.</li>}
                  </ul>
              )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted">
            <i className="bi bi-exclamation-triangle display-4 mb-3"></i>
            <h5>Failed to load data</h5>
            <p>Please try refreshing the page.</p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default NoticeBoardstudent;