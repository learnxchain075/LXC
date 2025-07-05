import React, { useState, useEffect } from "react";
import { AxiosResponse } from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getLessonsByStudentId, ILessonResponse, ILesson, ISubject, ITeacher, IUser } from "../../../../../services/student/StudentAllApi";
import useMobileDetection from "../../../../../core/common/mobileDetection";
import { useSelector } from "react-redux";
import { getStudentId } from "../../../../../utils/general";

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Error caught by boundary
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger m-3">
          <h5>Something went wrong.</h5>
          <p>Please try refreshing the page or contact support.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const StudentTimeTable = () => {
  const isMobile = useMobileDetection();
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const role = useSelector((state: any) => state.auth.userObj.role) || "";
  
  const currentDate = new Date();
  const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const currentDay = daysOfWeek[currentDate.getDay()];
  const currentTime = currentDate.getTime();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const studentId = getStudentId();
        if (!studentId) {
          // Check if we're in a parent context and need to wait for student selection
          const userRole = localStorage.getItem("userRole") || "";
          if (userRole === "parent") {
            setError("Please select a child from the parent dashboard first");
            toast.info("Please select a child from the parent dashboard to view their timetable", { autoClose: 5000 });
          } else {
            setError("Student ID not found. Please log in as a student or select a student.");
          }
          setIsLoading(false);
          return;
        }

              const response = await getLessonsByStudentId(studentId);
        
        if (response.data && response.data.success) {
          setLessons(response.data.lessons || []);
        } else {
          throw new Error('Invalid response format from API');
        }
      } catch (error: any) {
        setError(error.message || 'Failed to fetch lessons data');
        toast.error('Failed to load timetable data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, []); // Empty dependency array to run only once on mount

  // Add effect to refetch when student ID changes
  useEffect(() => {
    const studentId = getStudentId();
    if (studentId && !isLoading) {
      const fetchLessons = async () => {
        try {
          setIsLoading(true);
          setError(null);
          
          const response = await getLessonsByStudentId(studentId);
          
          if (response.data && response.data.success) {
            setLessons(response.data.lessons || []);
            toast.success('Timetable updated for new student');
          } else {
            throw new Error('Invalid response format from API');
          }
        } catch (error: any) {
          setError(error.message || 'Failed to fetch timetable data');
          toast.error('Failed to load timetable for new student');
        } finally {
          setIsLoading(false);
        }
      };

      fetchLessons();
    }
  }, [localStorage.getItem('studentId')]); // Listen to studentId changes

  const formatTime = (isoTime: string) => {
    if (!isoTime) return "N/A";
    return new Date(isoTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isLessonOngoing = (startTime: string, endTime: string) => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    return currentTime >= start && currentTime <= end;
  };

  const currentDayLessons = lessons
    .filter((lesson: ILesson) => lesson.day.toUpperCase() === currentDay)
    .sort((a: ILesson, b: ILesson) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const SkeletonPlaceholder = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
    <span className={`placeholder bg-secondary ${className}`} style={style} />
  );

  const getDayIcon = (day: string) => {
    const icons = {
      'MONDAY': 'bi-calendar-week',
      'TUESDAY': 'bi-calendar-week',
      'WEDNESDAY': 'bi-calendar-week',
      'THURSDAY': 'bi-calendar-week',
      'FRIDAY': 'bi-calendar-week',
      'SATURDAY': 'bi-calendar-week',
      'SUNDAY': 'bi-calendar-week'
    };
    return icons[day as keyof typeof icons] || 'bi-calendar-week';
  };

  return (
    <ErrorBoundary>
      <div className={isMobile ? "page-wrapper bg-light min-vh-100 d-flex flex-column" : "p-4 bg-light min-vh-100 d-flex flex-column"}>
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        
        <div className="content flex-grow-1 overflow-auto">
          <div className="row flex-grow-1">
            <div className="col-12 d-flex flex-column">
              <div className="card flex-fill shadow-sm border-0 rounded-3">
                <div className="card-header bg-white border-0 py-4">
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <div className="d-flex align-items-center">
                      <i className={`bi ${getDayIcon(currentDay)} fs-2 text-primary me-3`}></i>
                      <div>
                        <h4 className="mb-0 fw-semibold text-dark">
                          Timetable for {currentDay.charAt(0) + currentDay.slice(1).toLowerCase()}
                        </h4>
                        <p className="text-muted mb-0">
                          {currentDate.toLocaleDateString('en-GB', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-primary">
                        <i className="bi bi-clock me-1"></i>
                        {currentDate.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit', 
                          hour12: true 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="card-body p-4">
                  {isLoading ? (
                    <div className="placeholder-glow">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="card mb-3 p-3 border-0 shadow-sm">
                          <div className="d-flex justify-content-between mb-2">
                            <SkeletonPlaceholder className="col-3" style={{ height: "1rem" }} />
                            <SkeletonPlaceholder className="col-2" style={{ height: "1rem" }} />
                          </div>
                          <SkeletonPlaceholder className="col-5 mb-2" style={{ height: "1.2rem" }} />
                          <SkeletonPlaceholder className="col-4 mb-2" style={{ height: "1rem" }} />
                          <SkeletonPlaceholder className="col-6" style={{ height: "1rem" }} />
                        </div>
                      ))}
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="alert-heading">Error Loading Timetable</h5>
                        <p className="mb-0">{error}</p>
                      </div>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => window.location.reload()}>
                        <i className="bi bi-arrow-clockwise me-1"></i>Retry
                      </button>
                    </div>
                  ) : currentDayLessons.length > 0 ? (
                    <div className="d-flex flex-column gap-3">
                      {currentDayLessons.map((lesson: ILesson, index: number) => (
                        <div
                          key={lesson.id}
                          className={`card p-4 shadow-sm border-0 rounded-3 transition-all ${
                            index % 2 === 0 ? "bg-white" : "bg-light"
                          } ${isLessonOngoing(lesson.startTime, lesson.endTime) ? "border-2 border-success shadow-lg bg-success bg-opacity-10" : ""}`}
                        >
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center gap-2">
                              <span className="badge bg-danger">
                                <i className="bi bi-building me-1"></i>
                                Room: {lesson.roomNumber || "N/A"}
                              </span>
                              <span className="badge bg-secondary">
                                <i className="bi bi-people me-1"></i>
                                {lesson.name || "N/A"}
                              </span>
                            </div>
                            {isLessonOngoing(lesson.startTime, lesson.endTime) && (
                              <span className="badge bg-success fs-6">
                                <i className="bi bi-play-circle me-1"></i>Ongoing
                              </span>
                            )}
                          </div>
                          
                          <h5 className="fw-bold text-dark mb-3">
                            <i className="bi bi-book text-primary me-2"></i>
                            {lesson.subject?.name || "N/A"}
                          </h5>
                          
                          <div className="row g-3">
                            <div className="col-md-6">
                              <p className="mb-2 text-secondary">
                                <i className="bi bi-clock text-primary me-2"></i>
                                <strong>Time:</strong> {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
                              </p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-2 text-secondary">
                                <i className="bi bi-person text-primary me-2"></i>
                                <strong>Teacher:</strong> {lesson.teacher?.user?.name || "N/A"}
                              </p>
                            </div>
                          </div>
                          
                          {isLessonOngoing(lesson.startTime, lesson.endTime) && (
                            <div className="mt-3 p-3 bg-success bg-opacity-10 rounded-3 border border-success">
                              <p className="mb-0 text-success fw-medium">
                                <i className="bi bi-info-circle me-2"></i>
                                This lesson is currently in progress
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-calendar-x display-1 text-muted mb-4"></i>
                      <h3 className="fw-medium text-muted mb-3">No lessons scheduled for today</h3>
                      <p className="text-muted">Enjoy your free time or check back later for updates</p>
                    </div>
                  )}
                </div>
                
                <div className="card-footer bg-white border-0 p-4">
                  <h6 className="fw-bold text-dark mb-4">
                    <i className="bi bi-cup-hot text-warning me-2"></i>
                    Daily Breaks
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="card bg-primary bg-opacity-10 border-primary border-2 p-3 h-100">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-sun text-primary fs-4 me-2"></i>
                          <span className="badge bg-primary">Morning Break</span>
                        </div>
                        <p className="text-dark mb-0 fw-medium">
                          <i className="bi bi-clock me-1"></i>
                          10:30 - 10:45 AM
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card bg-warning bg-opacity-10 border-warning border-2 p-3 h-100">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-egg-fried text-warning fs-4 me-2"></i>
                          <span className="badge bg-warning text-dark">Lunch</span>
                        </div>
                        <p className="text-dark mb-0 fw-medium">
                          <i className="bi bi-clock me-1"></i>
                          12:15 - 01:30 PM
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card bg-info bg-opacity-10 border-info border-2 p-3 h-100">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-cup-straw text-info fs-4 me-2"></i>
                          <span className="badge bg-info">Evening Break</span>
                        </div>
                        <p className="text-dark mb-0 fw-medium">
                          <i className="bi bi-clock me-1"></i>
                          03:00 - 03:15 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default StudentTimeTable;