import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  getMonthlyLeaderboard, 
  getClassInternalLeaderboard, 
  getRoadmapLeaderboard,
  IClassLeaderboardEntry,
  IRoadmapLeaderboardEntry,
  getStudentUserById
} from '../../../../../services/student/StudentAllApi';
import { useSelector } from 'react-redux';

type LeaderboardEntry = IClassLeaderboardEntry | IRoadmapLeaderboardEntry;
type LeaderboardType = 'monthly' | 'class' | 'roadmap';

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
        <div className="card flex-fill p-4 bg-white rounded-lg shadow-sm border-0">
          <div className="text-center py-5">
            <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
              <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '2rem' }}></i>
            </div>
            <h5 className="text-dark mb-2">Something went wrong</h5>
            <p className="text-muted mb-3">Please try refreshing the page or contact support.</p>
            <button className="btn btn-outline-primary" onClick={() => window.location.reload()}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const SkeletonPlaceholder = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <span className={`placeholder bg-secondary ${className}`} style={style} />
);

// Helper to get student classId from localStorage or API
// studentData is an object like:
// {
//   classId: string,
//   student: { classId: string, ... },
//   ...other fields
// }
const getStudentClassId = async (): Promise<string | null> => {
  // Try localStorage first
  const studentDataRaw = localStorage.getItem('studentData');
  if (studentDataRaw) {
    try {
      const studentData = JSON.parse(studentDataRaw);
      if (studentData.classId) return studentData.classId;
      if (studentData.student && studentData.student.classId) return studentData.student.classId;
    } catch {}
  }
  // Fallback: fetch from API
  try {
    const res = await getStudentUserById();
    if (res.data && res.data.student && res.data.student.classId) {
      localStorage.setItem('studentData', JSON.stringify(res.data));
      return res.data.student.classId;
    }
  } catch {}
  return null;
};

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('monthly');
  const [classId, setClassId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);

    const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError(null);
      try {
        let response;
        let effectiveClassId = classId;
        if ((leaderboardType === 'class' || leaderboardType === 'roadmap') && !effectiveClassId) {
          const fetchedClassId = await getStudentClassId();
          if (fetchedClassId) {
            effectiveClassId = fetchedClassId;
            setClassId(fetchedClassId);
        } else {
          setLeaderboardData([]);
          setError('Your class information could not be found. Please try again or contact support.');
          return;
        }
        }
        switch (leaderboardType) {
          case 'monthly':
            response = await getMonthlyLeaderboard();
            if (response.data.success) {
              setLeaderboardData(response.data.leaderboard);
              toast.success('🏆 Monthly leaderboard loaded successfully!', { autoClose: 3000 });
            } else {
            setLeaderboardData([]);
            setError('Failed to load monthly leaderboard.');
            }
            break;
          case 'class':
          if (!effectiveClassId) {
            setLeaderboardData([]);
            setError('Class ID not available.');
            return;
          }
            response = await getClassInternalLeaderboard(effectiveClassId);
          if (typeof response.data === 'string' && (response.data as string).includes('Cannot GET')) {
            setLeaderboardData([]);
            setError('Coming Soon');
            toast.info('Class leaderboard is coming soon!', { autoClose: 3000 });
            return;
          }
            if (response.data.success) {
              setLeaderboardData(response.data.leaderboard);
              toast.success('📚 Class leaderboard loaded successfully!', { autoClose: 3000 });
            } else {
            setLeaderboardData([]);
            setError('Failed to load class leaderboard.');
            }
            break;
          case 'roadmap':
          if (!effectiveClassId) {
            setLeaderboardData([]);
            setError('Class ID not available.');
            return;
          }
            response = await getRoadmapLeaderboard(effectiveClassId);
          if (typeof response.data === 'string' && (response.data as string).includes('Cannot GET')) {
            setLeaderboardData([]);
            setError('Coming Soon');
            toast.info('Roadmap leaderboard is coming soon!', { autoClose: 3000 });
            return;
          }
            setLeaderboardData(response.data.leaderboard);
            toast.success('🗺️ Roadmap leaderboard loaded successfully!', { autoClose: 3000 });
            break;
          default:
          setLeaderboardData([]);
          setError('Invalid leaderboard type.');
      }
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err);
      setLeaderboardData([]);
      setError(err.message || 'Failed to load leaderboard data. Please try again.');
      toast.error(err.message || 'Failed to load leaderboard data', { autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line
  }, [leaderboardType, classId]);

  // UI helpers
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="badge bg-warning text-dark fs-6 px-3 py-2">🥇 1st</span>;
      case 2:
        return <span className="badge bg-secondary text-light fs-6 px-3 py-2">🥈 2nd</span>;
      case 3:
        return <span className="badge bg-bronze text-light fs-6 px-3 py-2" style={{background:'#cd7f32'}}>🥉 3rd</span>;
      default:
        return <span className="badge bg-light text-dark fs-6 px-3 py-2">{rank}th</span>;
    }
  };

  const getLeaderboardTitle = () => {
    switch (leaderboardType) {
      case 'monthly': return 'Monthly Leaderboard';
      case 'class': return 'Class Internal Leaderboard';
      case 'roadmap': return 'Roadmap Leaderboard';
      default: return 'Leaderboard';
    }
  };

  const getLeaderboardDescription = () => {
    switch (leaderboardType) {
      case 'monthly':
        return 'Top performers based on quizzes, newspapers, and doubt solving';
      case 'class':
        return 'Class rankings based on homework, assignments, and exams';
      case 'roadmap':
        return 'Learning progress and achievement rankings';
      default:
        return 'Student performance rankings';
    }
  };

  const getPointsLabel = () => {
    switch (leaderboardType) {
      case 'monthly':
        return 'Total Points';
      case 'class':
        return 'Academic Score';
      case 'roadmap':
        return 'Achievement Score';
      default:
        return 'Points';
    }
  };

  // Filter leaderboard by participant name
  const filteredLeaderboard = leaderboardData.filter(entry => {
    const name = (entry as any).name || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  // Responsive, competitive, visually appealing UI
  return (
    <ErrorBoundary>
      <div className={`card flex-fill p-4 rounded-lg shadow-sm border-0${dataTheme === 'dark_data_theme' ? ' bg-dark text-light border-secondary' : ' bg-white'}`}>
        <ToastContainer position="top-center" autoClose={3000} theme={dataTheme === 'dark_data_theme' ? 'dark' : 'colored'} />
        {/* Header */}
        <div className={`card-header bg-transparent border-0 mb-4${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}>
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3 gap-3">
            <div>
              <h3 className={`fw-bold mb-1 d-flex align-items-center gap-2${dataTheme === 'dark_data_theme' ? ' text-light' : ' text-dark'}`}> 
                <i className="bi bi-trophy text-warning fs-2"></i>
                {getLeaderboardTitle()}
              </h3>
              <p className={`mb-0${dataTheme === 'dark_data_theme' ? ' text-secondary' : ' text-muted'}`}>Compete, climb, and celebrate your achievements!</p>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <input
                type="text"
                className={`form-control form-control-lg shadow-sm${dataTheme === 'dark_data_theme' ? ' bg-secondary text-light border-0' : ''}`}
                placeholder="Search participant..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ maxWidth: 220 }}
              />
            <button 
                className={`btn btn-outline-primary btn-lg${dataTheme === 'dark_data_theme' ? ' border-secondary' : ''}`}
                onClick={() => setLeaderboardType('monthly')}
                disabled={leaderboardType === 'monthly'}
              >
                <i className="bi bi-calendar-month me-1"></i> Monthly
            </button>
            <button 
                className={`btn btn-outline-primary btn-lg${dataTheme === 'dark_data_theme' ? ' border-secondary' : ''}`}
                onClick={() => setLeaderboardType('class')}
                disabled={leaderboardType === 'class'}
            >
                <i className="bi bi-people me-1"></i> Class
            </button>
            <button 
                className={`btn btn-outline-primary btn-lg${dataTheme === 'dark_data_theme' ? ' border-secondary' : ''}`}
                onClick={() => setLeaderboardType('roadmap')}
                disabled={leaderboardType === 'roadmap'}
            >
                <i className="bi bi-map me-1"></i> Roadmap
            </button>
            </div>
          </div>
            </div>
        {/* Leaderboard Content */}
        <div className="card-body p-0">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5 className="text-primary mb-2">Loading Leaderboard</h5>
              <p className="text-muted mb-0">Please wait while we fetch the latest rankings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '2rem' }}></i>
              </div>
              <h5 className="text-danger mb-2">{error}</h5>
              <button className="btn btn-outline-primary" onClick={fetchLeaderboard}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Retry
              </button>
            </div>
          ) : filteredLeaderboard.length > 0 ? (
            <div className="table-responsive" style={{ maxHeight: 500 }}>
              <table className="table table-hover table-striped align-middle mb-0">
                <thead className="table-primary sticky-top">
                  <tr>
                    <th scope="col" className="border-0 text-white">Rank</th>
                    <th scope="col" className="border-0 text-white">Student</th>
                    <th scope="col" className="border-0 text-white">Points</th>
                    <th scope="col" className="border-0 text-white">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaderboard.map((entry: any, index: number) => {
                    const rank = entry.rank;
                    const isTopThree = rank <= 3;
                    const maxPoints = Math.max(...filteredLeaderboard.map((e: any) => e.totalPoints || e.score || 0));
                    const progressPercentage = maxPoints > 0 ? ((entry.totalPoints || entry.score || 0) / maxPoints) * 100 : 0;
                    return (
                      <tr key={entry.userId || entry.studentId || entry.id} className={isTopThree ? "table-light" : ""}>
                        <td>{getRankBadge(rank)}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '40px', height: '40px' }}>
                              {entry.profilePic ? (
                                <img 
                                  src={entry.profilePic} 
                                  alt={entry.name}
                                  className="rounded-circle"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <i className="bi bi-person text-muted"></i>
                              )}
                            </div>
                            <div>
                              <span className="fw-medium text-dark">{entry.name}</span>
                              {entry.email && (
                                <div className="text-muted small">{entry.email}</div>
                              )}
                            </div>
                          </div>
                        </td>
                      <td>
                          <span className="fw-bold text-primary me-2">{entry.totalPoints || entry.score || 0}</span>
                        </td>
                        <td>
                          <div className="progress" style={{ height: "8px" }}>
                            <div
                              className={`progress-bar ${rank === 1 ? 'bg-warning' : rank === 2 ? 'bg-secondary' : rank === 3 ? 'bg-danger' : 'bg-primary'}`}
                              role="progressbar"
                              style={{ width: `${progressPercentage}%` }}
                              aria-valuenow={entry.totalPoints || entry.score || 0}
                              aria-valuemin={0}
                              aria-valuemax={maxPoints}
                            />
                          </div>
                          <small className="text-muted">{progressPercentage.toFixed(1)}%</small>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-trophy text-muted" style={{ fontSize: '2rem' }}></i>
              </div>
              <h5 className="text-dark mb-2">No Leaderboard Data Available</h5>
              <p className="text-muted mb-3">There are no rankings available for this period.</p>
              <button className="btn btn-outline-primary" onClick={fetchLeaderboard}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Try Again
              </button>
            </div>
          )}
        </div>
        {/* Footer */}
        {filteredLeaderboard.length > 0 && (
          <div className={`card-footer bg-transparent border-0 pt-3${dataTheme === 'dark_data_theme' ? ' text-light' : ''}`}>
            <div className="row text-center">
              <div className="col-md-4">
                <small className={dataTheme === 'dark_data_theme' ? 'text-secondary' : 'text-muted'}>
                  <i className="bi bi-info-circle me-1"></i>
                  Rankings updated daily
                </small>
              </div>
              <div className="col-md-4">
                <small className={dataTheme === 'dark_data_theme' ? 'text-secondary' : 'text-muted'}>
                  <i className="bi bi-calendar me-1"></i>
                  Current month
                </small>
              </div>
              <div className="col-md-4">
                <small className={dataTheme === 'dark_data_theme' ? 'text-secondary' : 'text-muted'}>
                  <i className="bi bi-people me-1"></i>
                  {filteredLeaderboard.length} participants
                </small>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Leaderboard;