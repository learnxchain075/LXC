import { useEffect, useState } from "react";
import { getTasks } from "../../services/projectService";

const DevView = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  useEffect(() => {
    getTasks().then((res) => setTasks(res.data || []));
  }, []);
  return (
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
  );
};

export default DevView;
