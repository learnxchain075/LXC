import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import useMobileDetection from '../../../../../core/common/mobileDetection';
import { getTeacherUIDashboardData } from '../../../../../services/teacher/teacherUIService';
import dayjs from 'dayjs';
import LoadingSkeleton from '../../../../../components/LoadingSkeleton';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6F91', '#FFB347', '#B0E57C'];

const getDayName = () => dayjs().format('dddd').toUpperCase();
const getCurrentTime = () => dayjs();

const Teacherui: React.FC = () => {
  const isMobile = useMobileDetection();
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const isDarkMode = dataTheme === 'dark_data_theme';
  const theme = isDarkMode ? 'dark' : 'light';
  const teacherId = useMemo(() => localStorage.getItem('teacherId'), []);

  // State for dashboard data
  const [classOverview, setClassOverview] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!teacherId) return;
    getTeacherUIDashboardData()
      .then((res) => {
        const data = res.data;
        setClassOverview(Array.isArray(data.classOverview) ? data.classOverview : []);
        setAssignments(Array.isArray(data.assignments) ? data.assignments : []);
        setTimetable(Array.isArray(data.timetable) ? data.timetable : []);
        setEvents(Array.isArray(data.events) ? data.events : []);
        setAttendance(Array.isArray(data.attendance) ? data.attendance : []);
      })
      .finally(() => setLoading(false));
  }, [teacherId]);

  // --- Top Cards Data ---
  const totalClasses = classOverview.length;
  const totalAssignments = assignments.length;
  const totalStudents = classOverview.reduce((sum, c) => sum + (c.studentCount || 0), 0);

  // --- Today's Timetable ---
  const todayDay = getDayName();
  const now = getCurrentTime();
  const todaysLessons = timetable.filter((l: any) => (l.day || '').toUpperCase() === todayDay);

  // --- Ongoing class logic ---
  const isLessonOngoing = (start: string, end: string) => {
    const startTime = dayjs(start);
    const endTime = dayjs(end);
    return now.isAfter(startTime) && now.isBefore(endTime);
  };

  // --- Attendance Chart Data ---
  const attendanceChartData = attendance.map((a: any, idx: number) => ({
    name: a.className,
    attendance: a.percentage || 0,
    color: COLORS[idx % COLORS.length],
  }));

  // --- Assignments Grouped by Class ---
  const assignmentsByClass: Record<string, any[]> = {};
  assignments.forEach((a: any) => {
    const className = a.className || a.class || '';
    if (!assignmentsByClass[className]) assignmentsByClass[className] = [];
    assignmentsByClass[className].push(a);
  });

  return (
    <div className={`${isMobile ? 'page-wrapper' : 'p-3'} bg-dark-theme min-vh-100`}>
      <div className="content">
        {/* Top Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-4 col-12">
            {loading ? <LoadingSkeleton type="card" /> : (
              <div className={`card shadow ${isDarkMode ? 'bg-dark text-light' : ''}`}> 
                <div className="card-body text-center">
                  <h6>Total Classes</h6>
                  <h2>{totalClasses}</h2>
                </div>
              </div>
            )}
          </div>
          <div className="col-md-4 col-12">
            {loading ? <LoadingSkeleton type="card" /> : (
              <div className={`card shadow ${isDarkMode ? 'bg-dark text-light' : ''}`}> 
                <div className="card-body text-center">
                  <h6>Total Assignments</h6>
                  <h2>{totalAssignments}</h2>
                </div>
              </div>
            )}
          </div>
          <div className="col-md-4 col-12">
            {loading ? <LoadingSkeleton type="card" /> : (
              <div className={`card shadow ${isDarkMode ? 'bg-dark text-light' : ''}`}> 
                <div className="card-body text-center">
                  <h6>Total Students</h6>
                  <h2>{totalStudents}</h2>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Row 1: Class Overview & Attendance Overview */}
        <div className="row g-4 mb-4">
          <div className="col-md-7 col-12">
            <div className={`card shadow ${isDarkMode ? 'bg-dark text-light' : ''}`}> 
              <div className="card-body">
                <h6>Class Overview</h6>
                {loading ? (
                  <LoadingSkeleton type="table" />
                ) : classOverview.length === 0 ? (
                  <div className="text-center text-muted">No class data</div>
                ) : (
                  <div className="table-responsive">
                    <table className={`table ${isDarkMode ? 'table-dark' : 'table-light'} table-bordered`}>
                      <thead>
                        <tr>
                          <th>Class Name</th>
                          <th>Students</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classOverview.map((cls: any, idx: number) => (
                          <tr key={idx}>
                            <td>{cls.className}</td>
                            <td>{cls.studentCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-5 col-12">
            <div className={`card shadow ${isDarkMode ? 'bg-dark text-light' : ''}`}> 
              <div className="card-body d-flex flex-column align-items-center">
                <h6>Attendance Overview</h6>
                {loading ? (
                  <LoadingSkeleton type="card" />
                ) : attendanceChartData.length === 0 ? (
                  <div className="text-center text-muted">No attendance data</div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={attendanceChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#444' : undefined} />
                      <XAxis dataKey="name" stroke={isDarkMode ? '#fff' : undefined} />
                      <YAxis stroke={isDarkMode ? '#fff' : undefined} />
                      <Tooltip wrapperStyle={isDarkMode ? { background: '#222', color: '#fff' } : {}}/>
                      <Bar dataKey="attendance" name="Attendance %">
                        {attendanceChartData.map((entry, idx) => (
                          <Cell key={`cell-att-${idx}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Assignments & Today's Timetable */}
        <div className="row g-4 mb-4">
          <div className="col-md-7 col-12">
            <div className={`card shadow ${isDarkMode ? 'bg-dark text-light' : ''}`}> 
              <div className="card-body">
                <h6>Assignments</h6>
                {loading ? (
                  <LoadingSkeleton type="table" />
                ) : assignments.length === 0 ? (
                  <div className="text-center text-muted">No assignments</div>
                ) : (
                  Object.entries(assignmentsByClass).map(([className, assigns], idx) => (
                    <div key={className} className="mb-3">
                      <h6 className="mb-2">{className || 'Unknown Class'}</h6>
                      <div className="table-responsive">
                        <table className={`table ${isDarkMode ? 'table-dark' : 'table-light'} table-bordered`}>
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Subject</th>
                              <th>Due Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {assigns.map((a: any, i: number) => (
                              <tr key={i}>
                                <td>{a.title || a.name}</td>
                                <td>{a.subject || '-'}</td>
                                <td>{a.dueDate ? dayjs(a.dueDate).format('DD MMM YYYY') : '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="col-md-5 col-12">
            <div className={`card shadow ${isDarkMode ? 'bg-dark text-light' : ''}`}> 
              <div className="card-body">
                <h6>Today's Timetable</h6>
                {loading ? (
                  <LoadingSkeleton type="table" />
                ) : todaysLessons.length === 0 ? (
                  <div className="text-center text-muted">No lessons scheduled for today</div>
                ) : (
                  <div className="table-responsive">
                    <table className={`table ${isDarkMode ? 'table-dark' : 'table-light'} table-bordered`}>
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Class</th>
                          <th>Room</th>
                          <th>Start Time</th>
                          <th>End Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todaysLessons.map((l: any, idx: number) => {
                          const ongoing = isLessonOngoing(l.startTime, l.endTime);
                          return (
                            <tr key={idx} className={ongoing ? 'table-success fw-bold' : ''}>
                              <td>{l.subject?.name || l.subject || '-'}</td>
                              <td>{l.class?.name || l.class || '-'}</td>
                              <td>{l.room || '-'}</td>
                              <td>{dayjs(l.startTime).format('hh:mm A')}</td>
                              <td>{dayjs(l.endTime).format('hh:mm A')}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Upcoming Events */}
        <div className="row g-4 mb-4">
          <div className="col-12">
            <div className={`card shadow ${isDarkMode ? 'bg-dark text-light' : ''}`}> 
              <div className="card-body">
                <h6>Upcoming Events</h6>
                {loading ? (
                  <LoadingSkeleton type="card" />
                ) : events.length === 0 ? (
                  <div className="text-center text-muted">No upcoming events</div>
                ) : (
                  <div className="row">
                    {events.map((e: any, idx: number) => (
                      <div className="col-md-4 col-12 mb-3" key={idx}>
                        <div className={`card h-100 ${isDarkMode ? 'bg-secondary text-light' : ''}`}> 
                          <div className="card-body">
                            <h6>{e.name}</h6>
                            <div><span className="badge bg-info">{e.date ? dayjs(e.date).format('DD MMM YYYY') : '-'}</span></div>
                            {e.description && <p className="mt-2 mb-0">{e.description}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teacherui;