
// import React, { useState, useEffect } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { getDashboardResourcesByStudentId, IHoliday, INotice } from '../../../../../services/student/StudentAllApi';

// type Notice = {
//   key: string;
//   title: string;
//   date: string;
//   description: string;
//   attachment: string;
//   noticeDate: string;
//   publishDate: string;
// };

// type Holiday = {
//   key: string;
//   title: string;
//   startDate: string;
//   endDate: string;
// };

// type NoticeBoardData = {
//   notices: Notice[];
//   holidays: Holiday[];
// };

// const NoticeBoardstudent = () => {
//   const [data, setData] = useState<NoticeBoardData | null>(null);

//   useEffect(() => {
//     toast.promise(
//       getDashboardResourcesByStudentId()
//         .then((response) => {
//           if (response.data.success) {
//             const notices = response.data.notices.map((notice: INotice) => ({
//               key: notice.id,
//               title: notice.title,
//               date: new Date(notice.noticeDate).toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: 'short',
//                 day: 'numeric',
//               }),
//               description: notice.message,
//               attachment: notice.attachment,
//               noticeDate: new Date(notice.noticeDate).toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: 'short',
//                 day: 'numeric',
//               }),
//               publishDate: new Date(notice.publishDate).toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: 'short',
//                 day: 'numeric',
//               }),
//             }));
//             const holidays = response.data.holidays.map((holiday: IHoliday) => ({
//               key: holiday.id,
//               title: holiday.name,
//               startDate: new Date(holiday.date).toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: 'short',
//                 day: 'numeric',
//               }),
//               endDate: holiday.toDay
//                 ? new Date(holiday.toDay).toLocaleDateString('en-US', {
//                     year: 'numeric',
//                     month: 'short',
//                     day: 'numeric',
//                   })
//                 : new Date(holiday.date).toLocaleDateString('en-US', {
//                     year: 'numeric',
//                     month: 'short',
//                     day: 'numeric',
//                   }),
//             }));
//             return { notices, holidays };
//           }
//           throw new Error('API response unsuccessful');
//         }),
//       {
//        // pending: 'Fetching notices and holidays...',
//         success: 'Notices and holidays loaded!',
//         error: 'Failed to load notices and holidays.',
//       }
//     )
//       .then((transformedData) => setData(transformedData))
//       .catch((error) => console.error(error));
//   }, []);

//   if (!data) return <div className="text-center dark:text-white">Loading...</div>;

//   return (
//     <div className="card flex-fill">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="card-header">
//         <h5 className="dark:text-white">Notice Board & Holidays</h5>
//       </div>
//       <div className="card-body">
//         <h6 className="font-bold mb-2 dark:text-white">Notices</h6>
//         {data.notices.map((notice) => (
//           <div key={notice.key} className="mb-4 p-2 border rounded dark:border-gray-600">
//             <h6 className="font-bold dark:text-white">{notice.title}</h6>
//             <p className="text-sm text-gray-500 dark:text-gray-400">Notice Date: {notice.noticeDate}</p>
//             <p className="text-sm text-gray-500 dark:text-gray-400">Publish Date: {notice.publishDate}</p>
//             <p className="dark:text-white">{notice.description}</p>
//             {notice.attachment && (
//               <a
//                 href={notice.attachment}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-sm text-blue-500 hover:underline dark:text-blue-400"
//               >
//                 View Attachment
//               </a>
//             )}
//           </div>
//         ))}
//         <h6 className="font-bold mb-2 mt-4 dark:text-white">Holidays</h6>
//         {data.holidays.map((holiday) => (
//           <div key={holiday.key} className="mb-4 p-2 border rounded dark:border-gray-600">
//             <h6 className="font-bold dark:text-white">{holiday.title}</h6>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               {holiday.startDate} to {holiday.endDate}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default NoticeBoardstudent;

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDashboardResourcesByStudentId, IHoliday, INotice } from '../../../../../services/student/StudentAllApi';

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

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
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

  const SkeletonPlaceholder = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
    <span className={`placeholder bg-secondary ${className}`} style={style} />
  );

  useEffect(() => {
    setIsLoading(true);
    toast.promise(
      getDashboardResourcesByStudentId()
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
                noticeDate: new Date(notice.noticeDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }),
                publishDate: new Date(notice.publishDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }),
              }));
            const events = response.data.notices
              .filter((notice: INotice) => new Date(notice.publishDate) > new Date())
              .map((notice: INotice) => ({
                key: notice.id,
                title: notice.title,
                date: new Date(notice.publishDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }),
                description: notice.message,
                attachment: notice.attachment,
              }));
            const holidays = response.data.holidays.map((holiday: IHoliday) => ({
              key: holiday.id,
              title: holiday.name,
              startDate: new Date(holiday.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }),
              endDate: holiday.toDay
                ? new Date(holiday.toDay).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : new Date(holiday.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  }),
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
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  return (
    <ErrorBoundary>
      <div className="container-fluid p-4 bg-dark-theme min-vh-100">
        <ToastContainer position="top-center" autoClose={3000} />
        {isLoading ? (
          <div className="placeholder-glow">
            <SkeletonPlaceholder className="col-6 mb-4" style={{ height: "2rem" }} />
            {['Events', 'Notices', 'Holidays'].map((category, index) => (
              <div key={index} className="mb-5">
                <SkeletonPlaceholder className="col-4 mb-3" style={{ height: "1.5rem" }} />
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="card mb-3 p-3 shadow-sm bg-white dark:bg-gray-800">
                    <div className="d-flex align-items-center mb-2">
                      <SkeletonPlaceholder className="rounded-circle me-3" style={{ width: "40px", height: "40px" }} />
                      <SkeletonPlaceholder className="col-4" style={{ height: "1.2rem" }} />
                    </div>
                    <SkeletonPlaceholder className="col-6 mb-2" style={{ height: "1rem" }} />
                    <SkeletonPlaceholder className="col-8" style={{ height: "1rem" }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : data ? (
          <div className="card flex-fill shadow-sm bg-white dark:bg-gray-900 p-4">
            <h5 className="text-xl font-semibold mb-4 dark:text-white">Notice Board</h5>
            <div className="mb-5">
              <h6 className="font-bold text-lg mb-3 dark:text-white">Events</h6>
              {data.events.length > 0 ? (
                data.events.map((event) => (
                  <div key={event.key} className="card mb-3 p-3 shadow-sm bg-white dark:bg-gray-800">
                    <div className="d-flex align-items-center mb-2">
                      <span className="bg-blue-100 text-blue-800 rounded-circle p-2 me-3">
                        <i className="ti ti-calendar-event text-xl" />
                      </span>
                      <span className="badge bg-blue-500 text-white">Event</span>
                    </div>
                    <h6 className="font-bold text-dark dark:text-white mb-2">{event.title}</h6>
                    <p className="text-sm text-secondary dark:text-gray-400 mb-2">
                      <i className="ti ti-clock me-1" /> {event.date}
                    </p>
                    <p className="text-dark dark:text-white mb-2">{event.description}</p>
                    {event.attachment && (
                      <a
                        href={event.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline dark:text-blue-400"
                      >
                        View Attachment
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-secondary dark:text-gray-400">No upcoming events.</p>
              )}
            </div>
            <div className="mb-5">
              <h6 className="font-bold text-lg mb-3 dark:text-white">Notices</h6>
              {data.notices.length > 0 ? (
                data.notices.map((notice) => (
                  <div key={notice.key} className="card mb-3 p-3 shadow-sm bg-white dark:bg-gray-800">
                    <div className="d-flex align-items-center mb-2">
                      <span className="bg-yellow-100 text-yellow-800 rounded-circle p-2 me-3">
                        <i className="ti ti-bell text-xl" />
                      </span>
                      <span className="badge bg-yellow-500 text-white">Notice</span>
                    </div>
                    <h6 className="font-bold text-dark dark:text-white mb-2">{notice.title}</h6>
                    <p className="text-sm text-secondary dark:text-gray-400 mb-2">
                      <i className="ti ti-clock me-1" /> Notice Date: {notice.noticeDate} | Publish Date: {notice.publishDate}
                    </p>
                    <p className="text-dark dark:text-white mb-2">{notice.description}</p>
                    {notice.attachment && (
                      <a
                        href={notice.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline dark:text-blue-400"
                      >
                        View Attachment
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-secondary dark:text-gray-400">No notices available.</p>
              )}
            </div>
            <div>
              <h6 className="font-bold text-lg mb-3 dark:text-white">Holidays</h6>
              {data.holidays.length > 0 ? (
                data.holidays.map((holiday) => (
                  <div key={holiday.key} className="card mb-3 p-3 shadow-sm bg-white dark:bg-gray-800">
                    <div className="d-flex align-items-center mb-2">
                      <span className="bg-green-100 text-green-800 rounded-circle p-2 me-3">
                        <i className="ti ti-beach text-xl" />
                      </span>
                      <span className="badge bg-green-500 text-white">Holiday</span>
                    </div>
                    <h6 className="font-bold text-dark dark:text-white mb-2">{holiday.title}</h6>
                    <p className="text-sm text-secondary dark:text-gray-400 mb-2">
                      <i className="ti ti-clock me-1" /> {holiday.startDate} to {holiday.endDate}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-secondary dark:text-gray-400">No holidays scheduled.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-secondary dark:text-white">Failed to load data.</div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default NoticeBoardstudent;