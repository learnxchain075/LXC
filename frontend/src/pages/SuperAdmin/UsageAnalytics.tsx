import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { fetchUsageAnalytics } from "../../services/analyticsService";
import { all_routes } from "../../router/all_routes";
import { Link } from "react-router-dom";

interface GraphPoint {
  date: string;
  staff: number;
  student: number;
  parent: number;
}

const UsageAnalytics = () => {
  const [role, setRole] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchUsageAnalytics({ role: role || undefined });
      setData(res.data);
    } catch (e:any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [role]);

  const roleOptions = ["", "staff", "student", "parent"];

  if (loading) return <div className="page-wrapper"><div className="content">Loading...</div></div>;
  if (error) return <div className="page-wrapper"><div className="content">Error: {error}</div></div>;
  if (!data) return <div className="page-wrapper"><div className="content">No data</div></div>;

  const barSeries = [{
    data: data.topModulesUsed.map((m: any) => m.hits)
  }];
  const barCategories = data.topModulesUsed.map((m: any) => m.module);

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <h4 className="page-title">Usage Analytics</h4>
          <Link className="btn btn-primary" to={all_routes.superAdminDashboard}>Dashboard</Link>
        </div>
        <div className="mb-3">
          <select className="form-select w-auto" value={role} onChange={e => setRole(e.target.value)}>
            {roleOptions.map(r => <option key={r} value={r}>{r || "All Roles"}</option>)}
          </select>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card mb-4">
              <div className="card-body">
                <ReactApexChart type="bar" height={300} series={barSeries} options={{ xaxis:{ categories: barCategories } }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageAnalytics;
