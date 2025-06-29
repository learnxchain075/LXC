import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  getMonthlyLeaderboard, 
  getClassInternalLeaderboard, 
  getRoadmapLeaderboard,
  ILeaderboardEntry,
  IClassLeaderboardEntry,
  IRoadmapLeaderboardEntry,
  getStudentUserById
} from '../../../../../services/student/StudentAllApi';

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

const getStudentClassId = async (): Promise<string | null> => {
  // Try localStorage first
  const studentData = localStorage.getItem('studentData');
  if (studentData) {
    try {
      const parsed = JSON.parse(studentData);
      if (parsed.classId) return parsed.classId;
      if (parsed.student && parsed.student.classId) return parsed.student.classId;
    } catch {}
  }
  // Fallback: fetch from API
  try {
    const res = await getStudentUserById();
    if (res.data && res.data.student && res.data.student.classId) {
      // Optionally update localStorage for next time
      localStorage.setItem('studentData', JSON.stringify(res.data));
      return res.data.student.classId;
    }
  } catch {}
  return null;
};

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<ILeaderboardEntry[] | IClassLeaderboardEntry[] | IRoadmapLeaderboardEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('monthly');
  const [classId, setClassId] = useState<string>('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        let response;
        let effectiveClassId = classId;
        if ((leaderboardType === 'class' || leaderboardType === 'roadmap') && !effectiveClassId) {
          const fetchedClassId = await getStudentClassId();
          if (fetchedClassId) {
            effectiveClassId = fetchedClassId;
            setClassId(fetchedClassId);
          }
        }
        switch (leaderboardType) {
          case 'monthly':
            response = await getMonthlyLeaderboard();
            if (response.data.success) {
              setLeaderboardData(response.data.leaderboard);
              toast.success('🏆 Monthly leaderboard loaded successfully!', { autoClose: 3000 });
            } else {
              throw new Error('Failed to load monthly leaderboard');
            }
            break;
          case 'class':
            if (!effectiveClassId) throw new Error('Class ID not available');
            response = await getClassInternalLeaderboard(effectiveClassId);
            if (response.data.success) {
              setLeaderboardData(response.data.leaderboard);
              toast.success('📚 Class leaderboard loaded successfully!', { autoClose: 3000 });
            } else {
              throw new Error('Failed to load class leaderboard');
            }
            break;
          case 'roadmap':
            if (!effectiveClassId) throw new Error('Class ID not available');
            response = await getRoadmapLeaderboard(effectiveClassId);
            setLeaderboardData(response.data.leaderboard);
            toast.success('🗺️ Roadmap leaderboard loaded successfully!', { autoClose: 3000 });
            break;
          default:
            throw new Error('Invalid leaderboard type');
        }
      } catch (error: any) {
        console.error('Error fetching leaderboard:', error);
        toast.error(error.message || 'Failed to load leaderboard data', { autoClose: 3000 });
        
        // Fallback to mock data
        const mockData = [
          { id: "1", name: "Minal Setia", position: 1, totalPoints: 950, profilePic: "", rank: 1 },
          { id: "2", name: "John Doe", position: 2, totalPoints: 870, profilePic: "", rank: 2 },
          { id: "3", name: "Jane Smith", position: 3, totalPoints: 820, profilePic: "", rank: 3 },
          { id: "4", name: "Alex Johnson", position: 4, totalPoints: 750, profilePic: "", rank: 4 },
          { id: "5", name: "Sarah Brown", position: 5, totalPoints: 680, profilePic: "", rank: 5 },
        ];
        setLeaderboardData(mockData as any);
        toast.warn('Using sample data due to API error', { autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [leaderboardType, classId]);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="d-flex align-items-center">
            <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-trophy-fill text-dark fs-3"></i>
            </div>
            <span className="badge bg-warning text-dark fs-4 fw-bold px-4 py-3">
              <i className="bi bi-medal me-2 fs-4"></i>1st
            </span>
          </div>
        );
      case 2:
        return (
          <div className="d-flex align-items-center">
            <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-trophy-fill text-white fs-3"></i>
            </div>
            <span className="badge bg-secondary fs-4 fw-bold px-4 py-3">
              <i className="bi bi-medal me-2 fs-4"></i>2nd
            </span>
          </div>
        );
      case 3:
        return (
          <div className="d-flex align-items-center">
            <div className="bg-danger rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-trophy-fill text-white fs-3"></i>
            </div>
            <span className="badge bg-danger fs-4 fw-bold px-4 py-3">
              <i className="bi bi-medal me-2 fs-4"></i>3rd
            </span>
          </div>
        );
      default:
        return (
          <span className="badge bg-light text-dark fs-6 px-3 py-2">
            <i className="bi bi-hash me-1"></i>{rank}th
          </span>
        );
    }
  };

  const getLeaderboardTitle = () => {
    switch (leaderboardType) {
      case 'monthly':
        return 'Monthly Leaderboard';
      case 'class':
        return 'Class Internal Leaderboard';
      case 'roadmap':
        return 'Roadmap Leaderboard';
      default:
        return 'Leaderboard';
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

  const handleRefresh = () => {
    setIsLoading(true);
    setLeaderboardData(null);
    // Trigger useEffect by changing a dependency
    setClassId(prev => prev + '');
  };

  const handleLeaderboardTypeChange = (type: LeaderboardType) => {
    setLeaderboardType(type);
    setLeaderboardData(null);
  };

  if (isLoading) {
    return (
      <div className="card flex-fill p-4 bg-white rounded-lg shadow-sm border-0">
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-primary mb-2">Loading Leaderboard</h5>
          <p className="text-muted mb-0">Please wait while we fetch the latest rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="card flex-fill p-4 bg-white rounded-lg shadow-sm border-0">
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        
        {/* Header */}
        <div className="card-header bg-transparent border-0 mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h4 className="fw-bold text-dark mb-1">
                <i className="bi bi-trophy text-warning me-2"></i>
                {getLeaderboardTitle()}
              </h4>
              <p className="text-muted mb-0">{getLeaderboardDescription()}</p>
            </div>
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Refresh
            </button>
          </div>

          {/* Leaderboard Type Tabs */}
          <div className="nav nav-pills nav-fill" role="tablist">
            <button 
              className={`nav-link ${leaderboardType === 'monthly' ? 'active' : ''}`}
              onClick={() => handleLeaderboardTypeChange('monthly')}
            >
              <i className="bi bi-calendar-month me-1"></i>
              Monthly
            </button>
            <button 
              className={`nav-link ${leaderboardType === 'class' ? 'active' : ''}`}
              onClick={() => handleLeaderboardTypeChange('class')}
            >
              <i className="bi bi-people me-1"></i>
              Class
            </button>
            <button 
              className={`nav-link ${leaderboardType === 'roadmap' ? 'active' : ''}`}
              onClick={() => handleLeaderboardTypeChange('roadmap')}
            >
              <i className="bi bi-map me-1"></i>
              Roadmap
            </button>
          </div>
            </div>

        {/* Leaderboard Content */}
        <div className="card-body p-0">
          {leaderboardData && leaderboardData.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-primary">
                  <tr>
                    <th scope="col" className="border-0 text-white">
                      <i className="bi bi-hash me-1"></i>
                      Rank
                    </th>
                    <th scope="col" className="border-0 text-white">
                      <i className="bi bi-person me-1"></i>
                      Student
                    </th>
                    <th scope="col" className="border-0 text-white">
                      <i className="bi bi-star me-1"></i>
                      {getPointsLabel()}
                    </th>
                    <th scope="col" className="border-0 text-white">
                      <i className="bi bi-graph-up me-1"></i>
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry: any, index: number) => {
                    const isTopThree = entry.rank <= 3;
                    const maxPoints = Math.max(...leaderboardData.map((e: any) => e.totalPoints || e.score || 0));
                    const progressPercentage = maxPoints > 0 ? ((entry.totalPoints || entry.score || 0) / maxPoints) * 100 : 0;
                    
                    return (
                      <tr key={entry.userId || entry.studentId || entry.id} className={isTopThree ? "table-light" : ""}>
                        <td>
                          {getRankBadge(entry.rank)}
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
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
                        <div className="d-flex align-items-center">
                            <span className="fw-bold text-primary me-2">
                              {entry.totalPoints || entry.score || 0}
                            </span>
                            {leaderboardType === 'monthly' && (
                              <div className="d-flex gap-1">
                                <span className="badge bg-info bg-opacity-10 text-info small">
                                  Q: {entry.quizScore || 0}
                                </span>
                                <span className="badge bg-success bg-opacity-10 text-success small">
                                  N: {entry.newspaperScore || 0}
                                </span>
                                <span className="badge bg-warning bg-opacity-10 text-warning small">
                                  D: {entry.doubtsSolved || 0}
                                </span>
                              </div>
                            )}
                            {leaderboardType === 'class' && (
                              <div className="d-flex gap-1">
                                <span className="badge bg-info bg-opacity-10 text-info small">
                                  HW: {entry.homeworkCount || 0}
                                </span>
                                <span className="badge bg-success bg-opacity-10 text-success small">
                                  A: {entry.assignmentScore || 0}
                                </span>
                                <span className="badge bg-warning bg-opacity-10 text-warning small">
                                  E: {entry.examScore || 0}
                                </span>
                              </div>
                            )}
                            {leaderboardType === 'roadmap' && (
                              <div className="d-flex gap-1">
                                <span className="badge bg-info bg-opacity-10 text-info small">
                                  S: {entry.streak || 0}
                                </span>
                                <span className="badge bg-success bg-opacity-10 text-success small">
                                  C: {entry.coins || 0}
                                </span>
                                <span className="badge bg-warning bg-opacity-10 text-warning small">
                                  CR: {entry.completionRate || 0}%
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="progress" style={{ height: "8px" }}>
                            <div
                              className={`progress-bar ${entry.rank === 1 ? 'bg-warning' : entry.rank === 2 ? 'bg-secondary' : entry.rank === 3 ? 'bg-danger' : 'bg-primary'}`}
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
              <button className="btn btn-outline-primary" onClick={handleRefresh}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {leaderboardData && leaderboardData.length > 0 && (
          <div className="card-footer bg-transparent border-0 pt-3">
            <div className="row text-center">
              <div className="col-md-4">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Rankings updated daily
                </small>
              </div>
              <div className="col-md-4">
                <small className="text-muted">
                  <i className="bi bi-calendar me-1"></i>
                  Current month
                </small>
              </div>
              <div className="col-md-4">
                <small className="text-muted">
                  <i className="bi bi-people me-1"></i>
                  {leaderboardData.length} participants
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