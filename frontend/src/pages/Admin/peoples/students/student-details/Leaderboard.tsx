import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type LeaderboardEntry = {
  id: string;
  name: string;
  position: number;
  totalPoints: number;
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

const SkeletonPlaceholder = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <span className={`placeholder bg-secondary ${className}`} style={style} />
);

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Mock data for the leaderboard
  const mockData: LeaderboardEntry[] = [
    { id: "1", name: "Minal Setia", position: 1, totalPoints: 950 },
    { id: "2", name: "John Doe", position: 2, totalPoints: 870 },
    { id: "3", name: "Jane Smith", position: 3, totalPoints: 820 },
    { id: "4", name: "Alex Johnson", position: 4, totalPoints: 750 },
    { id: "5", name: "Sarah Brown", position: 5, totalPoints: 680 },
  ];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        // Replace with actual API call: const response = await getLeaderboardData();
        const response = mockData;
        setLeaderboardData(response);
        toast.success("Leaderboard loaded successfully!", { autoClose: 3000 });
      } catch (error) {
        setLeaderboardData(mockData);
        toast.warn("Failed to load leaderboard data, using mock data.", { autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankBadge = (position: number) => {
    switch (position) {
      case 1:
        return <span className="badge bg-warning text-dark"><i className="ti ti-medal me-1" />1st</span>;
      case 2:
        return <span className="badge bg-secondary"><i className="ti ti-medal me-1" />2nd</span>;
      case 3:
        return <span className="badge bg-bronze"><i className="ti ti-medal me-1" />3rd</span>;
      default:
        return <span className="badge bg-light text-dark">{position}th</span>;
    }
  };

  return (
    <ErrorBoundary>
      <div className="container-fluid p-4 bg-dark-theme min-vh-100">
        <ToastContainer position="top-center" autoClose={3000} />
        <div className="card shadow-sm bg-white dark:bg-gray-800 p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h4 className="text-dark dark:text-white mb-0">Monthly Leaderboard</h4>
            <button className="btn btn-outline-light bg-white btn-icon">
              <i className="ti ti-refresh" />
            </button>
          </div>
          {isLoading ? (
            <div className="placeholder-glow">
              <SkeletonPlaceholder className="col-4 mb-3" style={{ height: "1.5rem" }} />
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th><SkeletonPlaceholder className="col-12" style={{ height: "1rem" }} /></th>
                    <th><SkeletonPlaceholder className="col-12" style={{ height: "1rem" }} /></th>
                    <th><SkeletonPlaceholder className="col-12" style={{ height: "1rem" }} /></th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, idx) => (
                    <tr key={idx}>
                      <td><SkeletonPlaceholder className="col-8" style={{ height: "1rem" }} /></td>
                      <td><SkeletonPlaceholder className="col-4" style={{ height: "1rem" }} /></td>
                      <td><SkeletonPlaceholder className="col-10" style={{ height: "1rem" }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : leaderboardData ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th className="text-dark dark:text-white">Name</th>
                    <th className="text-dark dark:text-white">Position</th>
                    <th className="text-dark dark:text-white">Total Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry) => (
                    <tr key={entry.id} className={entry.position <= 3 ? "table-light" : ""}>
                      <td className="text-dark dark:text-white">{entry.name}</td>
                      <td>{getRankBadge(entry.position)}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="me-2 text-dark dark:text-white">{entry.totalPoints}</span>
                          <div className="progress w-100" style={{ height: "10px" }}>
                            <div
                              className={`progress-bar ${entry.position === 1 ? 'bg-success' : entry.position === 2 ? 'bg-info' : entry.position === 3 ? 'bg-warning' : 'bg-primary'}`}
                              role="progressbar"
                              style={{ width: `${(entry.totalPoints / 1000) * 100}%` }}
                              aria-valuenow={entry.totalPoints}
                              aria-valuemin={0}
                              aria-valuemax={1000}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-secondary dark:text-gray-400">
              No leaderboard data available.
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Leaderboard;