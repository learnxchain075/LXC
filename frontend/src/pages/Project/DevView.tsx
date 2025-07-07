import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTasks } from "../../services/projectService";
import ProjectNav from "./ProjectNav";

const DevView = () => {
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const [tasks, setTasks] = useState<any[]>([]);
  useEffect(() => {
    const fetchTasks = () => {
      getTasks().then((res) => setTasks(res.data || []));
    };
    fetchTasks();
    const intervalId = setInterval(fetchTasks, 30000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className={`page-wrapper ${
      dataTheme === 'dark_data_theme' ? 'bg-dark text-white' : ''
    }`}>
      <ProjectNav />
      <div className="container mt-4">
      <h4>Developer View</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Branch</th>
            <th>PR</th>
            <th>CI Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks
            .filter((t) => t.githubBranches && t.githubBranches.length > 0)
            .map((t) => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>
                  {t.githubBranches.map((b: any) => (
                    <div key={b.id}>
                      <a href={b.url} target="_blank" rel="noreferrer">
                        {b.name}
                      </a>
                    </div>
                  ))}
                </td>
                <td>
                  {t.githubBranches.map(
                    (b: any) =>
                      b.prUrl && (
                        <div key={b.id}>
                          <a href={b.prUrl} target="_blank" rel="noreferrer">
                            PR
                          </a>
                        </div>
                      ),
                  )}
                </td>
                <td>
                  {t.githubBranches.map((b: any) => (
                    <span
                      key={b.id}
                      className={`badge bg-$
                        {b.status === "success" ? "success" : b.status === "failed" ? "danger" : "secondary"} me-1`}
                    >
                      {b.status || "unknown"}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default DevView;
