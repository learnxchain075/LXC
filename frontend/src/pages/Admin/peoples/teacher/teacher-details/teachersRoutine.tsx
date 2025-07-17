import React, { useEffect, useState } from 'react';
import TeacherModal from '../teacherModal';
import { Link } from 'react-router-dom';
import { all_routes } from '../../../../../router/all_routes';
import TeacherBreadcrumb from './teacherBreadcrumb';
import useMobileDetection from '../../../../../core/common/mobileDetection';
import { getTeacherById } from '../../../../../services/admin/teacherRegistartion';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import LoadingSkeleton from '../../../../../components/LoadingSkeleton';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const formatTimeLabel = (date: string | Date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
  });
};

const TeachersRoutine = () => {
  const routes = all_routes;
  const isMobile = useMobileDetection();
  const [lessons, setLessons] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterDay, setFilterDay] = useState('All');
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterClass, setFilterClass] = useState('All');
  const userObj = useSelector((state: any) => state.auth.userObj);
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const isDarkMode = dataTheme === 'dark_data_theme';

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
  const fetchTeacherDetails = async () => {
      setIsLoading(true);
    const teacherId = localStorage.getItem('teacherId');
      if (!teacherId) { setIsLoading(false); return; }
    try {
      const response = await getTeacherById(teacherId);
      if (response.status === 200) {
          setLessons(response.data.lessons || []);
      } else {
        toast.error('Failed to fetch teacher details');
      }
    } catch (error) {
      toast.error('Error fetching teacher details');
      } finally {
        setIsLoading(false);
    }
  };
    fetchTeacherDetails();
  }, [userObj?.role]);

  // Extract unique time slots from lessons
  const allTimes = Array.from(new Set(
    lessons.flatMap(lesson => [lesson.startTime, lesson.endTime])
      .filter(Boolean)
      .map(t => formatTimeLabel(t))
  ));
  allTimes.sort((a, b) => {
    const d1 = new Date('1970-01-01T' + a);
    const d2 = new Date('1970-01-01T' + b);
    return d1.getTime() - d2.getTime();
  });

  // Map lessons by [day][time]
  const lessonGrid: Record<string, Record<string, any>> = {};
  for (const lesson of lessons) {
    const day = (lesson.day || '').toUpperCase();
    const time = formatTimeLabel(lesson.startTime);
    if (!lessonGrid[time]) lessonGrid[time] = {};
    lessonGrid[time][day] = lesson;
  }

  // Filtering
  const filteredLessons = lessons.filter(lesson => {
    let match = true;
    if (search) {
      const s = search.toLowerCase();
      match = [lesson.subject?.name, lesson.class?.name, lesson.class?.Section?.[0]?.name]
        .filter(Boolean)
        .some(val => val.toLowerCase().includes(s));
    }
    if (filterDate) {
        const lessonDate = new Date(lesson.startTime).toISOString().split('T')[0];
      match = match && lessonDate === filterDate;
    }
    if (filterDay !== 'All') {
      match = match && (lesson.day || '').toUpperCase() === filterDay.toUpperCase();
    }
    if (filterSubject !== 'All') {
      match = match && lesson.subject?.name === filterSubject;
    }
    if (filterClass !== 'All') {
      match = match && lesson.class?.name === filterClass;
    }
    return match;
  });

  // For filter dropdowns
  const allSubjects = Array.from(new Set(lessons.map(l => l.subject?.name).filter(Boolean)));
  const allClasses = Array.from(new Set(lessons.map(l => l.class?.name).filter(Boolean)));

  // Rebuild grid for filtered lessons
  const filteredGrid: Record<string, Record<string, any>> = {};
  for (const lesson of filteredLessons) {
    const day = (lesson.day || '').toUpperCase();
    const time = formatTimeLabel(lesson.startTime);
    if (!filteredGrid[time]) filteredGrid[time] = {};
    filteredGrid[time][day] = lesson;
  }
  const gridTimes = Object.keys(filteredGrid).length > 0 ? Object.keys(filteredGrid) : allTimes;

  // Color palette for lesson cards
  const lessonColors = [
    '#e3f2fd', 
    '#fce4ec', 
    '#e8f5e9', 
    '#fff3e0', 
    '#f3e5f5', 
    '#fffde7',
    '#ffe0b2',
    '#d1c4e9',
    '#b2dfdb',
    '#c8e6c9',
  ];

  if (isLoading) {
  return (
      <div className={isMobile ? 'page-wrapper bg-dark-theme min-vh-100 d-flex flex-column' : 'p-3 bg-dark-theme min-vh-100 d-flex flex-column'}>
        <div className="content flex-grow-1 bg-dark-theme overflow-auto">
          <div className="row flex-grow-1">
            <div className="col-12 d-flex flex-column">
              <div className="row h-100">
                <div className="card flex-fill">
                  <div className="card-header pb-2">
                    <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                      <div className="placeholder-glow col-3 mb-2" style={{ height: 40 }}></div>
                      <div className="placeholder-glow col-2 mb-2" style={{ height: 40 }}></div>
                      <div className="placeholder-glow col-2 mb-2" style={{ height: 40 }}></div>
                      <div className="placeholder-glow col-2 mb-2" style={{ height: 40 }}></div>
    </div>
    </div>
                  <div className="card-body">
                    <LoadingSkeleton type="table" lines={6} />
                            </div>
                                    </div>
                                  </div>
                              </div>
                          </div>
                    </div>
                  </div>
    );
  }

  return (
    <div className={isMobile ? 'page-wrapper bg-dark-theme min-vh-100 d-flex flex-column' : 'p-3 bg-dark-theme min-vh-100 d-flex flex-column'}>
        <div className="content flex-grow-1 bg-dark-theme overflow-auto">
          <div className="row flex-grow-1">
            <div className="col-12 d-flex flex-column">
              <div className="row h-100">
                <div className="card flex-fill">
                <div className="card-header pb-2">
                  <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                    <input type="text" className="form-control" style={{maxWidth:200}} placeholder="Search by subject, class" value={search} onChange={e => setSearch(e.target.value)} />
                    <input type="date" className="form-control" style={{maxWidth:160}} value={filterDate} onChange={e => setFilterDate(e.target.value)} />
                    <select className="form-select" style={{maxWidth:140}} value={filterDay} onChange={e => setFilterDay(e.target.value)}>
                      <option value="All">All Days</option>
                      {DAYS.map((d, i) => <option key={d} value={d}>{DAY_LABELS[i]}</option>)}
                    </select>
                    <select className="form-select" style={{maxWidth:160}} value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
                      <option value="All">All Subjects</option>
                      {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select className="form-select" style={{maxWidth:160}} value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                      <option value="All">All Classes</option>
                      {allClasses.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button className="btn btn-outline-info" onClick={() => { setSearch(''); setFilterDate(''); setFilterDay('All'); setFilterSubject('All'); setFilterClass('All'); }}>Clear Filters</button>
                   {/* <span className="text-muted ms-2">{filteredLessons.length} of {lessons.length} lessons</span> */}
                      </div>
                      </div>
                  <div className="card-body">
                  <div className="table-responsive">
                    <table className={classNames('table', 'align-middle', 'text-center', isDarkMode ? 'table-dark' : 'table-bordered', 'timetable-grid')} style={isDarkMode ? { borderCollapse: 'separate', borderSpacing: 0, border: '1px solid #444' } : {}}>
                      <thead className={isDarkMode ? '' : 'table-light'}>
                        <tr>
                          <th style={{minWidth:100, borderRight: isDarkMode ? '1px solid #444' : undefined}}>Time</th>
                          {DAY_LABELS.map(day => <th key={day} style={isDarkMode ? { borderRight: '1px solid #444', borderLeft: '1px solid #444' } : {}}>{day}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {gridTimes.map((time, rowIdx) => (
                          <tr key={time} style={isDarkMode ? { borderTop: '1px solid #444' } : {}}>
                            <td className="fw-bold" style={isDarkMode ? { borderRight: '1px solid #444', background: '#222' } : {}}>{time}</td>
                            {DAYS.map((day, colIdx) => {
                              const lesson = filteredGrid[time]?.[day];
                              // Pick color based on row and col for variety
                              const colorIdx = (rowIdx * DAYS.length + colIdx) % lessonColors.length;
                              const cardBg = isDarkMode ? undefined : lessonColors[colorIdx];
                        return (
                                <td key={day} style={{verticalAlign:'middle', minWidth:160, borderLeft: isDarkMode ? '1px solid #444' : undefined, borderRight: isDarkMode ? '1px solid #444' : undefined, borderTop: isDarkMode ? '1px solid #444' : undefined, borderBottom: isDarkMode ? '1px solid #444' : undefined}}>
                                  {lesson ? (
                                    <div
                                      className={classNames('border', 'rounded', 'p-2', 'text-start', isDarkMode ? 'bg-dark text-light' : '')}
                                      style={{minHeight:80, background: cardBg}}
                                    >
                                      <div className="fw-semibold">{lesson.subject?.name}</div>
                                      <div className="small text-muted">{lesson.class?.name} {lesson.class?.Section?.[0]?.name || ''}</div>
                                      <div className="small">{formatTimeLabel(lesson.startTime)} - {formatTimeLabel(lesson.endTime)}</div>
                                      <div className="small text-secondary">Room: {lesson.class?.roomNumber || 'N/A'}</div>
                            </div>
                                  ) : null}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                                    </div>
                                  </div>
                              </div>
                          </div>
                    </div>
                  </div>
      </div>
      <TeacherModal />
      <div className="row mt-4">
                      <div className="col-lg-4 col-xxl-4 col-xl-4 d-flex">
                        <div className="card flex-fill">
                          <div className="card-body bg-transparent-primary">
                            <span className="bg-primary badge badge-sm mb-2">Morning Break</span>
                            <p className="text-dark">
                              <i className="ti ti-clock me-1" />
                              10:30 to 10:45 AM
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-xxl-3 d-flex">
                        <div className="card flex-fill">
                          <div className="card-body bg-transparent-warning">
                            <span className="bg-warning badge badge-sm mb-2">Lunch</span>
                            <p className="text-dark">
                              <i className="ti ti-clock me-1" />
                              12:15 to 01:30 PM
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-xxl-3 d-flex">
                        <div className="card flex-fill">
                          <div className="card-body bg-transparent-info">
                            <span className="bg-info badge badge-sm mb-2">Evening Break</span>
                            <p className="text-dark">
                              <i className="ti ti-clock me-1" />
                              03:00 to 03:15 PM
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
  );
};

export default TeachersRoutine;
