import { useState } from "react";
import { useParams } from "react-router-dom";
import { addGitHubRepo } from "../../services/projectService";

const ProjectSettings = () => {
  const { id } = useParams<{ id: string }>();
  const [repoName, setRepoName] = useState("");
  const [token, setToken] = useState("");
  const [info, setInfo] = useState<any>(null);

  const handleSave = async () => {
    if (!id) return;
    const res = await addGitHubRepo(id, { repoName, token });
    setInfo(res.data);
  };

  return (
    <div className="container mt-4">
      <h4>GitHub Integration</h4>
      <div className="mb-3">
        <label className="form-label">Repository (owner/repo)</label>
        <input
          className="form-control"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Token</label>
        <input
          className="form-control"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={handleSave}>
        Link Repo
      </button>
      {info && (
        <div className="mt-3">
          <p>Default Branch: {info.repo.defaultBranch}</p>
          <ul>
            {info.branches?.map((b: any) => <li key={b.name}>{b.name}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectSettings;
