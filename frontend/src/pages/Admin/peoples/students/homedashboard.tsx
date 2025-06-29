import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosResponse } from 'axios';
import {
  getStudentUserById,
  IStudentUser,
  getLessonsByStudentId,
  ILessonResponse,
  ILesson,
  getDashboardResourcesByStudentId,
  INotice,
  IHoliday,
} from '../../../../services/student/StudentAllApi';

type Notice = {
  key: string;
  title: string;
  date: string;
  description: string;
  attachment: string;
};

type Lesson = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
  name: string;
  subject: { name: string };
  teacher: { user: { name: string } };
};

type DashboardData = {
  attendance: { percentage: number; daysPresent: number; totalDays: number };
  notices: Notice[];
  timetable: Lesson[];
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

const HomeDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const currentDay = 'SATURDAY';
  const currentTime = new Date().getTime();

  const mockData: DashboardData = {
    attendance: { percentage: 85, daysPresent: 170, totalDays: 200 },
    notices: [
      { key: '1', title: 'School Assembly', date: 'Jun 20, 2025', description: 'Mandatory assembly at 8 AM.', attachment: '' },
      { key: '2', title: 'Exam Schedule', date: 'Jun 18, 2025', description: 'Final exams start July 1.', attachment: '' },
    ],
    timetable: [
      {
        id: '1',
        day: 'SATURDAY',
        startTime: new Date(`2025-06-21T09:00:00+05:30`).toISOString(),
        endTime: new Date(`2025-06-21T10:00:00+05:30`).toISOString(),
        roomNumber: '101',
        name: 'Class 10A',
        subject: { name: 'Mathematics' },
        teacher: { user: { name: 'Prof. Smith' } },
      },
    ],
  };

  const SkeletonPlaceholder = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
    <span className={`placeholder bg-secondary ${className}`} style={style} />
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const studentId = localStorage.getItem('studentId');
        if (!studentId) throw new Error('Student ID not found');
        const [userResponse, lessonsResponse, resourcesResponse] = await Promise.all([
          getStudentUserById(),
          getLessonsByStudentId(studentId),
          getDashboardResourcesByStudentId(),
        ]);
        let attendance = mockData.attendance;
        if (userResponse.data.student.attendance) {
          const { daysPresent, totalDays } = userResponse.data.student.attendance;
          attendance = {
            percentage: totalDays > 0 ? Math.round((daysPresent / totalDays) * 100) : 0,
            daysPresent,
            totalDays,
          };
        }
        const timetable = lessonsResponse.data.success
          ? lessonsResponse.data.lessons
              .filter((lesson: ILesson) => lesson.day.toUpperCase() === currentDay)
              .sort((a: ILesson, b: ILesson) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
          : mockData.timetable;
        const notices = resourcesResponse.data.success
          ? resourcesResponse.data.notices
              .filter((notice: INotice) => new Date(notice.publishDate) <= new Date())
              .slice(0, 3)
              .map((notice: INotice) => ({
                key: notice.id,
                title: notice.title,
                date: new Date(notice.noticeDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }),
                description: notice.message,
                attachment: notice.attachment || '',
              }))
          : mockData.notices;
        setData({ attendance, notices, timetable });
        toast.success('Dashboard data loaded!', { autoClose: 3000 });
      } catch (error) {
        setData(mockData);
        toast.warn('Failed to load data, using mock data.', { autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatTime = (isoTime: string) => {
    if (!isoTime) return 'N/A';
    return new Date(isoTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const isLessonOngoing = (startTime: string, endTime: string) => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    return currentTime >= start && currentTime <= end;
  };

  return (
    <ErrorBoundary>
      <div className="container-fluid p-4 bg-dark-theme min-vh-100">
        <ToastContainer position="top-right" autoClose={3000} />
        {isLoading ? (
          <div className="placeholder-glow">
            <SkeletonPlaceholder className="col-6 mb-4" style={{ height: "2rem" }} />
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card p-4">
                  <SkeletonPlaceholder className="col-4 mb-3" style={{ height: "1.5rem" }} />
                  <SkeletonPlaceholder className="col-6 mb-2" style={{ height: "2rem" }} />
                  <SkeletonPlaceholder className="col-8" style={{ height: "1rem" }} />
                </div>
              </div>
              <div className="col-md-8">
                <div className="card p-4">
                  <SkeletonPlaceholder className="col-4 mb-3" style={{ height: "1.5rem" }} />
                  {[...Array(2)].map((_, idx) => (
                    <div key={idx} className="mb-3">
                      <SkeletonPlaceholder className="col-6 mb-2" style={{ height: "1.2rem" }} />
                      <SkeletonPlaceholder className="col-8" style={{ height: "1rem" }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-12">
                <div className="card p-4">
                  <SkeletonPlaceholder className="col-4 mb-3" style={{ height: "1.5rem" }} />
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="mb-3">
                      <SkeletonPlaceholder className="col-5 mb-2" style={{ height: "1.2rem" }} />
                      <SkeletonPlaceholder className="col-4 mb-2" style={{ height: "1rem" }} />
                      <SkeletonPlaceholder className="col-6" style={{ height: "1rem" }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : data ? (
          <div>
            <h4 className="text-xl font-semibold mb-4 text-dark dark:text-white">Student Dashboard</h4>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card p-4 shadow-sm bg-white dark:bg-gray-800">
                  <div className="d-flex align-items-center mb-3">
                    <span className="bg-green-100 text-green-800 rounded-circle p-2 me-3">
                      <i className="ti ti-checks text-xl" />
                    </span>
                    <h5 className="font-bold text-dark dark:text-white mb-0">Attendance</h5>
                  </div>
                  <h3 className="text-3xl font-bold text-dark dark:text-white mb-2">{data.attendance.percentage}%</h3>
                  <p className="text-secondary dark:text-gray-400">
                    {data.attendance.daysPresent} of {data.attendance.totalDays} days attended
                  </p>
                </div>
              </div>
              <div className="col-md-8">
                <div className="card p-4 shadow-sm bg-white dark:bg-gray-800">
                  <div className="d-flex align-items-center mb-3">
                    <span className="bg-yellow-100 text-yellow-800 rounded-circle p-2 me-3">
                      <i className="ti ti-bell text-xl" />
                    </span>
                    <h5 className="font-bold text-dark dark:text-white mb-0">Latest Notices</h5>
                  </div>
                  {data.notices.length > 0 ? (
                    data.notices.map((notice) => (
                      <div key={notice.key} className="mb-3">
                        <h6 className="font-bold text-dark dark:text-white mb-1">{notice.title}</h6>
                        <p className="text-sm text-secondary dark:text-gray-400 mb-1">{notice.date}</p>
                        <p className="text-dark dark:text-white mb-1">{notice.description}</p>
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
              </div>
              <div className="col-12">
                <div className="card p-4 shadow-sm bg-white dark:bg-gray-800">
                  <div className="d-flex align-items-center mb-3">
                    <span className="bg-blue-100 text-blue-800 rounded-circle p-2 me-3">
                      <i className="ti ti-calendar text-xl" />
                    </span>
                    <h5 className="font-bold text-dark dark:text-white mb-0">Today's Timetable (Saturday, June 21, 2025)</h5>
                  </div>
                  {data.timetable.length > 0 ? (
                    data.timetable.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className={`card p-3 mb-3 shadow-sm ${index % 2 === 0 ? 'bg-white' : 'bg-light'} ${
                          isLessonOngoing(lesson.startTime, lesson.endTime) ? 'border-2 border-success' : ''
                        } dark:bg-gray-700 dark:text-white`}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-danger text-white">Room: {lesson.roomNumber || 'N/A'}</span>
                          {isLessonOngoing(lesson.startTime, lesson.endTime) && (
                            <span className="badge bg-success text-white">Ongoing</span>
                          )}
                        </div>
                        <h6 className="font-bold text-dark dark:text-white mb-2">{lesson.subject.name || 'N/A'}</h6>
                        <p className="text-sm text-secondary dark:text-gray-400 mb-1">
                          <i className="ti ti-clock me-1" />
                          {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
                        </p>
                        <p className="text-sm text-secondary dark:text-gray-400 mb-1">Class: {lesson.name || 'N/A'}</p>
                        <p className="text-sm text-secondary dark:text-gray-400 mb-0">Teacher: {lesson.teacher.user.name || 'N/A'}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-secondary dark:text-gray-400">No lessons scheduled today.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-secondary dark:text-white">Failed to load data.</div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default HomeDashboard;