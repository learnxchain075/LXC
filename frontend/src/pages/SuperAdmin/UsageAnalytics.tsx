import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  fetchSuperAdminUsageAnalytics,
  fetchRoles,
  fetchSchoolsWithModules,
  SchoolWithModules,
  UsageParams,
} from "../../services/analyticsService";
import { all_routes } from "../../router/all_routes";
import { Link } from "react-router-dom";

const UsageAnalytics = () => {
  const [filters, setFilters] = useState<UsageParams>({});
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [schools, setSchools] = useState<SchoolWithModules[]>([]);
  const [modules, setModules] = useState<string[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchSuperAdminUsageAnalytics(filters);
      setData(res.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);
  useEffect(() => {
    fetchRoles()
      .then((res) => setRoles(["", ...res.data]))
      .catch(() => setRoles([""]));
    fetchSchoolsWithModules()
      .then((res) => setSchools(res.data))
      .catch(() => setSchools([]));
  }, []);
  const deviceOptions = ["", "Mobile", "Desktop"];
  const rangeOptions = [
    { value: "today", label: "Today" },
    { value: "7", label: "7 Days" },
    { value: "30", label: "30 Days" },
  ];

  if (loading)
    return (
      <div className="page-wrapper">
        <div className="content">Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="page-wrapper">
        <div className="content">Error: {error}</div>
      </div>
    );
  if (!data)
    return (
      <div className="page-wrapper">
        <div className="content">No data</div>
      </div>
    );

  const barSeries = [{ data: Object.values(data.usageByModule) }];
  const barCategories = Object.keys(data.usageByModule);
  const durationSeries = [{ data: Object.values(data.durationByModule || {}) }];
  const durationCategories = Object.keys(data.durationByModule || {});

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <h4 className="page-title">Usage Analytics</h4>
          <Link className="btn btn-primary" to={all_routes.superAdminDashboard}>
            Dashboard
          </Link>
        </div>
        <div className="mb-3 d-flex flex-wrap gap-2">
          <select
            className="form-select w-auto"
            value={filters.role || ""}
            onChange={(e) =>
              setFilters({ ...filters, role: e.target.value || undefined })
            }
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r || "All Roles"}
              </option>
            ))}
          </select>
          <select
            className="form-select w-auto"
            value={filters.device || ""}
            onChange={(e) =>
              setFilters({ ...filters, device: e.target.value || undefined })
            }
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
            onChange={(e) =>
              setFilters({ ...filters, range: e.target.value || undefined })
            }
          >
            {rangeOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <select
            className="form-select w-auto"
            value={filters.module || ""}
            onChange={(e) =>
              setFilters({ ...filters, module: e.target.value || undefined })
            }
          >
            <option value="">All Modules</option>
            {modules.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            className="form-select w-auto"
            value={filters.schoolId || ""}
            onChange={(e) => {
              const id = e.target.value || undefined;
              setFilters({ ...filters, schoolId: id });
              const school = schools.find((s) => s.id === id);
              setModules(school ? school.modules : []);
            }}
          >
            <option value="">All Schools</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.schoolName}
              </option>
            ))}
          </select>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <ReactApexChart
                  type="bar"
                  height={300}
                  series={barSeries}
                  options={{ xaxis: { categories: barCategories } }}
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <ReactApexChart
                  type="bar"
                  height={300}
                  series={durationSeries}
                  options={{ xaxis: { categories: durationCategories } }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageAnalytics;
