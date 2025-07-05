import { useEffect, useState } from "react";
import { getCompanySummary } from "../../../services/superadmin/companyAccountApi";

const Summary = () => {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });
  useEffect(() => {
    getCompanySummary().then((res) => setSummary(res.data || summary));
  }, []);
  return (
    <div className="container-fluid py-4 px-3 px-md-5">
      <h2 className="mb-3">Summary</h2>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h6>Total Income</h6>
            <h3 className="text-success">{summary.totalIncome}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h6>Total Expense</h6>
            <h3 className="text-danger">{summary.totalExpense}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h6>Net Balance</h6>
            <h3>{summary.netBalance}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
