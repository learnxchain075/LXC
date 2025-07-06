import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getCompanySummary, exportCompanySummary } from "../../../services/superadmin/companyAccountApi";

const Summary = () => {
  const [summary, setSummary] = useState<any>({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    monthly: [],
    weekly: [],
    paymentMode: [],
    topRecipients: [],
  });
  const [filters, setFilters] = useState({ fromDate: "", toDate: "", type: "ALL", mode: "ALL", recipient: "", category: "" });

  const fetchSummary = () => {
    getCompanySummary(filters).then(res => setSummary(res.data || summary));
  };
  useEffect(() => { fetchSummary(); }, []);

  const handleExport = (fmt: "csv" | "pdf") => {
    exportCompanySummary(fmt, filters).then(res => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `summary.${fmt}`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };
  const donutOptions = {
    chart: { type: "donut" },
    labels: ["Income", "Expense"],
    legend: { position: "bottom" },
    colors: ["#28a745", "#dc3545"],
    dataLabels: { enabled: false },
  } as any;

  const modeOptions = {
    chart: { type: "donut" },
    labels: summary.paymentMode.map((m: any) => m.paymentMode),
    legend: { position: "bottom" },
    dataLabels: { enabled: false },
  } as any;

  const recipientOptions = {
    chart: { type: "bar" },
    xaxis: { categories: summary.topRecipients.map((r: any) => r.sourceOrRecipient) },
  } as any;

  const weeklyOptions = {
    chart: { type: "bar" },
    xaxis: { categories: summary.weekly.map((w: any) => w.week) },
    legend: { position: "top" },
  } as any;

  const areaOptions = {
    chart: { type: "area", toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    colors: ["#3D5EE1", "#E82646"],
    xaxis: { categories: summary.monthly.map((m: any) => m.month) },
    legend: { position: "top" },
  } as any;

  return (
    <div className="page-wrapper">
      <div className="container-fluid py-4 px-3 px-md-5">
        <h2 className="mb-4">Accounts Summary</h2>
        <div className="row g-2 mb-3">
          <div className="col-md-2">
            <input type="date" className="form-control" name="fromDate" value={filters.fromDate} onChange={e => setFilters({ ...filters, fromDate: e.target.value })} />
          </div>
          <div className="col-md-2">
            <input type="date" className="form-control" name="toDate" value={filters.toDate} onChange={e => setFilters({ ...filters, toDate: e.target.value })} />
          </div>
          <div className="col-md-2">
            <select className="form-select" value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
              <option value="ALL">All</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={filters.mode} onChange={e => setFilters({ ...filters, mode: e.target.value })}>
              <option value="ALL">Any Mode</option>
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank</option>
              <option value="UPI">UPI</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="col-md-2">
            <input className="form-control" placeholder="Recipient" value={filters.recipient} onChange={e => setFilters({ ...filters, recipient: e.target.value })} />
          </div>
          <div className="col-md-2">
            <input className="form-control" placeholder="Category" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={fetchSummary}>Apply</button>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary w-100" onClick={() => handleExport('csv')}>CSV</button>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary w-100" onClick={() => handleExport('pdf')}>PDF</button>
          </div>
        </div>
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card p-4 shadow-sm text-center animate-card border-0 bg-light">
              <h6 className="mb-1">Total Income</h6>
              <h3 className="text-success mb-0">{summary.totalIncome}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 shadow-sm text-center animate-card border-0 bg-light">
              <h6 className="mb-1">Total Expense</h6>
              <h3 className="text-danger mb-0">{summary.totalExpense}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 shadow-sm text-center animate-card border-0 bg-light">
              <h6 className="mb-1">Net Balance</h6>
              <h3 className="mb-0">{summary.netBalance}</h3>
            </div>
          </div>
        </div>
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card p-3 shadow-sm border-0">
              <h6 className="mb-3">Income vs Expense</h6>
              <ReactApexChart options={donutOptions} series={[summary.totalIncome, summary.totalExpense]} type="donut" height={250} />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card p-3 shadow-sm border-0">
              <h6 className="mb-3">Last 6 Months</h6>
              <ReactApexChart options={areaOptions} series={[{ name: "Income", data: summary.monthly.map((m: any) => m.income) }, { name: "Expense", data: summary.monthly.map((m: any) => m.expense) }]} type="area" height={250} />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card p-3 shadow-sm border-0">
              <h6 className="mb-3">Payment Modes</h6>
              <ReactApexChart options={modeOptions} series={summary.paymentMode.map((m: any) => m._sum.amount)} type="donut" height={250} />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card p-3 shadow-sm border-0">
              <h6 className="mb-3">Top Recipients</h6>
              <ReactApexChart options={recipientOptions} series={[{ data: summary.topRecipients.map((r: any) => r._sum.amount) }]} type="bar" height={250} />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="card p-3 shadow-sm border-0">
              <h6 className="mb-3">Weekly Trends</h6>
              <ReactApexChart options={weeklyOptions} series={[{ name: 'Income', data: summary.weekly.map((w: any) => w.income) }, { name: 'Expense', data: summary.weekly.map((w: any) => w.expense) }]} type="bar" height={250} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
