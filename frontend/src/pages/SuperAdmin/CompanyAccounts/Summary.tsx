import { useEffect, useState } from "react";
import dayjs from "dayjs";
import ReactApexChart from "react-apexcharts";
import {
  getCompanySummary,
  getCompanyTransactions,
} from "../../../services/superadmin/companyAccountApi";

const Summary = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
  });
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    getCompanySummary().then((res) => setSummary(res.data || summary));

    const end = dayjs();
    const start = end.subtract(5, "month").startOf("month");
    getCompanyTransactions({
      startDate: start.format("YYYY-MM-DD"),
      endDate: end.endOf("month").format("YYYY-MM-DD"),
    }).then((res) => {
      const list = res.data || [];
      const months: Record<string, { income: number; expense: number }> = {};
      for (let i = 0; i < 6; i++) {
        const key = start.add(i, "month").format("MMM");
        months[key] = { income: 0, expense: 0 };
      }
      list.forEach((t: any) => {
        const key = dayjs(t.date).format("MMM");
        if (!months[key]) return;
        if (t.transactionType === "INCOME") months[key].income += t.amount;
        else months[key].expense += t.amount;
      });
      setMonthlyData(
        Object.keys(months).map((m) => ({
          month: m,
          income: months[m].income,
          expense: months[m].expense,
        }))
      );
    });
  }, []);
  const donutOptions = {
    chart: { type: "donut" },
    labels: ["Income", "Expense"],
    legend: { position: "bottom" },
    colors: ["#28a745", "#dc3545"],
    dataLabels: { enabled: false },
  } as any;

  const areaOptions = {
    chart: { type: "area", toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    colors: ["#3D5EE1", "#E82646"],
    xaxis: { categories: monthlyData.map((m) => m.month) },
    legend: { position: "top" },
  } as any;

  return (
    <div className="page-wrapper">
      <div className="container-fluid py-4 px-3 px-md-5">
        <h2 className="mb-4">Accounts Summary</h2>
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
              <ReactApexChart options={areaOptions} series={[{ name: "Income", data: monthlyData.map(m => m.income) }, { name: "Expense", data: monthlyData.map(m => m.expense) }]} type="area" height={250} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
