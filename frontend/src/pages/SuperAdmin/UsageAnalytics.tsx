import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { fetchSuperAdminUsageAnalytics, UsageParams } from "../../services/analyticsService";
import { all_routes } from "../../router/all_routes";
import { Link } from "react-router-dom";


const UsageAnalytics = () => {
  const [filters, setFilters] = useState<UsageParams>({});
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchSuperAdminUsageAnalytics(filters);
      setData(res.data);
    } catch (e:any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [filters]);
  const roleOptions = ["", "staff", "student", "parent"];
  const deviceOptions = ["", "Mobile", "Desktop"];
  const rangeOptions = [
    { value: "today", label: "Today" },
    { value: "7", label: "7 Days" },
    { value: "30", label: "30 Days" },
  ];

  if (loading) return <div className="page-wrapper"><div className="content">Loading...</div></div>;
  if (error) return <div className="page-wrapper"><div className="content">Error: {error}</div></div>;
  if (!data) return <div className="page-wrapper"><div className="content">No data</div></div>;

  const barSeries = [{ data: Object.values(data.usageByModule) }];
  const barCategories = Object.keys(data.usageByModule);

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <h4 className="page-title">Usage Analytics</h4>
          <Link className="btn btn-primary" to={all_routes.superAdminDashboard}>Dashboard</Link>
        </div>
        <div className="mb-3 d-flex flex-wrap gap-2">
          <select
            className="form-select w-auto"
            value={filters.role || ""}
            onChange={(e) => setFilters({ ...filters, role: e.target.value || undefined })}
          >
            {roleOptions.map((r) => (
              <option key={r} value={r}>
                {r || "All Roles"}
              </option>
            ))}
          </select>
          <select
            className="form-select w-auto"
            value={filters.device || ""}
            onChange={(e) => setFilters({ ...filters, device: e.target.value || undefined })}
          >
            {deviceOptions.map((r) => (
              <option key={r} value={r}>
                {r || "All Devices"}
              </option>
            ))}
          </select>
          <select
            className="form-select w-auto"
            value={filters.range || ""}
            onChange={(e) => setFilters({ ...filters, range: e.target.value || undefined })}
          >
            {rangeOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="form-control w-auto"
            placeholder="Module"
            value={filters.module || ""}
            onChange={(e) => setFilters({ ...filters, module: e.target.value || undefined })}
          />
          <input
            type="text"
            className="form-control w-auto"
            placeholder="School ID"
            value={filters.schoolId || ""}
            onChange={(e) => setFilters({ ...filters, schoolId: e.target.value || undefined })}
          />
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
