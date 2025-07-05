import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCompanyTransactions, deleteCompanyTransaction } from "../../../services/superadmin/companyAccountApi";

const AllTransactions = () => {
  const [list, setList] = useState<any[]>([]);
  const fetchData = async () => {
    try {
      const res = await getCompanyTransactions();
      setList(res.data || []);
    } catch (err) {
      toast.error("Failed to load");
    }
  };
  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete transaction?")) return;
    try {
      await deleteCompanyTransaction(id);
      toast.success("Deleted");
      fetchData();
    } catch (err) {
      toast.error("Failed");
    }
  };

  return (
    <div className="container-fluid py-4 px-3 px-md-5">
      <h2 className="mb-3">All Transactions</h2>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>Bill</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((t) => (
              <tr key={t.id}>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.title}</td>
                <td>
                  <span className={t.transactionType === "INCOME" ? "text-success" : "text-danger"}>{t.transactionType}</span>
                </td>
                <td>{t.amount}</td>
                <td>{t.paymentMode}</td>
                <td>
                  {t.billUrl && (
                    <a href={t.billUrl} target="_blank" rel="noreferrer">
                      View
                    </a>
                  )}
                </td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllTransactions;
