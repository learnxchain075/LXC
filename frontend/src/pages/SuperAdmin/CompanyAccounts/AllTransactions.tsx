import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import AppConfig from "../../../config/config";
import {
  filterCompanyTransactions,
  deleteCompanyTransaction,
  updateCompanyTransaction,
} from "../../../services/superadmin/companyAccountApi";

const AllTransactions = () => {
  const [list, setList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [summary, setSummary] = useState({ income: 0, expense: 0 });
  const [billUrl, setBillUrl] = useState<string | null>(null);
  const [detailTx, setDetailTx] = useState<any | null>(null);
  const [editTx, setEditTx] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    amount: "",
    date: "",
    transactionType: "INCOME",
    paymentMode: "CASH",
    sourceOrRecipient: "",
    category: "",
    bill: null as File | null,
  });
  const [filters, setFilters] = useState({
    search: "",
    fromDate: "",
    toDate: "",
    type: "ALL",
    mode: "ALL",
    category: "",
    recipient: "",
    minAmount: "",
    maxAmount: "",
    billAttached: "all",
    sortBy: "date",
    sortOrder: "desc",
  });
  const buildParams = () => {
    const params: any = { page, perPage: 10, sortBy: filters.sortBy, sortOrder: filters.sortOrder };
    if (filters.search) params.search = filters.search;
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate) params.toDate = filters.toDate;
    if (filters.type !== "ALL") params.type = filters.type;
    if (filters.mode !== "ALL") params.mode = filters.mode;
    if (filters.category) params.category = filters.category;
    if (filters.recipient) params.recipient = filters.recipient;
    if (filters.minAmount) params.minAmount = filters.minAmount;
    if (filters.maxAmount) params.maxAmount = filters.maxAmount;
    if (filters.billAttached !== "all") params.billAttached = filters.billAttached === "yes";
    return params;
  };

  const fetchData = async () => {
    try {
      const res = await filterCompanyTransactions(buildParams());
      setList(res.data.data || []);
      setPageCount(res.data.pageCount);
      setTotalRecords(res.data.totalCount);
      setSummary({ income: res.data.totalIncome, expense: res.data.totalExpense });
    } catch (err) {
      toast.error("Failed to load");
    }
  };
  useEffect(() => { fetchData(); }, [page]);

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

  const handleEditOpen = (tx: any) => {
    setEditTx(tx);
    setEditForm({
      title: tx.title,
      description: tx.description,
      amount: tx.amount,
      date: tx.date.split("T")[0],
      transactionType: tx.transactionType,
      paymentMode: tx.paymentMode,
      sourceOrRecipient: tx.sourceOrRecipient,
      category: tx.category || "",
      bill: null,
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((p) => ({ ...p, [name]: value }));
  };

  const handleEditFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditForm((p) => ({ ...p, bill: file }));
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((p) => ({ ...p, [name]: value }));
  };

  const applyFilters = () => {
    setPage(1);
    fetchData();
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      fromDate: "",
      toDate: "",
      type: "ALL",
      mode: "ALL",
      minAmount: "",
      maxAmount: "",
      billAttached: "all",
      sortBy: "date",
      sortOrder: "desc",
    });
    setPage(1);
    fetchData();
  };

  const handleExport = (format: "csv" | "pdf") => {
    const params = new URLSearchParams(buildParams() as any).toString();
    window.open(`${AppConfig.apiGateway.BASE_URL}/company-accounts/transactions/export/${format}?${params}`, "_blank");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTx) return;
    const fd = new FormData();
    fd.append("title", editForm.title);
    fd.append("description", editForm.description);
    fd.append("amount", editForm.amount);
    fd.append("date", editForm.date);
    fd.append("transactionType", editForm.transactionType);
    fd.append("paymentMode", editForm.paymentMode);
    fd.append("sourceOrRecipient", editForm.sourceOrRecipient);
    fd.append("category", editForm.category);
    fd.append("createdBy", editTx.createdBy || "");
    if (editForm.bill) fd.append("bill", editForm.bill);
    try {
      await updateCompanyTransaction(editTx.id, fd);
      toast.success("Updated");
      setEditTx(null);
      fetchData();
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  return (
    
    <div className="page-wrapper">
    <div className="container-fluid py-4 px-3 px-md-5">
      <h2 className="mb-3">All Transactions</h2>
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Search"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-2">
          <input type="date" className="form-control" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} />
        </div>
        <div className="col-md-2">
          <input type="date" className="form-control" name="toDate" value={filters.toDate} onChange={handleFilterChange} />
        </div>
        <div className="col-md-2">
          <select className="form-select" name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="ALL">All Type</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" name="mode" value={filters.mode} onChange={handleFilterChange}>
            <option value="ALL">All Mode</option>
            <option value="CASH">Cash</option>
            <option value="BANK_TRANSFER">Bank</option>
            <option value="UPI">UPI</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="col-md-2">
          <input className="form-control" placeholder="Recipient" name="recipient" value={filters.recipient} onChange={handleFilterChange} />
        </div>
        <div className="col-md-2">
          <input className="form-control" placeholder="Category" name="category" value={filters.category} onChange={handleFilterChange} />
        </div>
        <div className="col-md-2">
          <select className="form-select" name="billAttached" value={filters.billAttached} onChange={handleFilterChange}>
            <option value="all">Bill?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className="col-md-2">
          <input type="number" className="form-control" placeholder="Min" name="minAmount" value={filters.minAmount} onChange={handleFilterChange} />
        </div>
        <div className="col-md-2">
          <input type="number" className="form-control" placeholder="Max" name="maxAmount" value={filters.maxAmount} onChange={handleFilterChange} />
        </div>
        <div className="col-md-2">
          <select className="form-select" name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="title">Title</option>
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange}>
            <option value="asc">ASC</option>
            <option value="desc">DESC</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={applyFilters}>Apply</button>
        </div>
        <div className="col-md-2">
          <button className="btn btn-secondary w-100" onClick={resetFilters}>Reset</button>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          Total Records: {totalRecords} | Income: {summary.income} | Expense: {summary.expense}
        </div>
        <div>
          <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleExport("csv")}>Download CSV</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => handleExport("pdf")}>Download PDF</button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Description</th>
              <th>Recipient</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>Bill</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((t) => (
              <tr key={t.id}>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-link p-0" onClick={() => setDetailTx(t)}>{t.title}</button>
                </td>
                <td>{t.description.length > 30 ? `${t.description.slice(0, 30)}...` : t.description}</td>
                <td>{t.sourceOrRecipient}</td>
                <td>
                  <span className={`badge ${t.transactionType === "INCOME" ? "bg-success" : "bg-danger"}`}>{t.transactionType}</span>
                </td>
                <td>{t.amount}</td>
                <td>{t.paymentMode}</td>
                <td>
                  {t.billUrl ? (
                    <button className="btn btn-link p-0" onClick={() => setBillUrl(t.billUrl)}>🧾</button>
                  ) : (
                    ""
                  )}
                </td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditOpen(t)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav>
        <ul className="pagination">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => page > 1 && setPage(page - 1)}>Prev</button>
          </li>
          {Array.from({ length: pageCount }).map((_, i) => (
            <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
            </li>
          ))}
          <li className={`page-item ${page === pageCount ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => page < pageCount && setPage(page + 1)}>Next</button>
          </li>
        </ul>
      </nav>

      <Modal show={!!billUrl} onHide={() => setBillUrl(null)} size="xl" centered>
        <div className="modal-header">
          <h4 className="modal-title">Bill Attachment</h4>
          <button type="button" className="btn-close" onClick={() => setBillUrl(null)} />
        </div>
        <div className="modal-body">
          {billUrl && (
            <iframe
              src={billUrl}
              style={{ width: "100%", height: "70vh" }}
              className="border-0"
              title="bill"
            />
          )}
        </div>
        {billUrl && (
          <div className="modal-footer">
            <a href={billUrl} className="btn btn-primary" download>
              Download
            </a>
          </div>
        )}
      </Modal>

      <Modal show={!!detailTx} onHide={() => setDetailTx(null)} size="lg" centered>
        <div className="modal-header">
          <h4 className="modal-title">Transaction Details</h4>
          <button type="button" className="btn-close" onClick={() => setDetailTx(null)} />
        </div>
        <div className="modal-body">
          {detailTx && (
            <div>
              <p><strong>Title:</strong> {detailTx.title}</p>
              <p><strong>Description:</strong> {detailTx.description}</p>
              <p><strong>Recipient:</strong> {detailTx.sourceOrRecipient}</p>
              <p><strong>Date:</strong> {new Date(detailTx.date).toLocaleDateString()}</p>
              <p><strong>Type:</strong> {detailTx.transactionType}</p>
              <p><strong>Amount:</strong> {detailTx.amount}</p>
              <p><strong>Mode:</strong> {detailTx.paymentMode}</p>
              {detailTx.billUrl && (
                <button className="btn btn-link p-0" onClick={() => { setBillUrl(detailTx.billUrl); }}>
                  View Bill
                </button>
              )}
            </div>
          )}
        </div>
      </Modal>

      <Modal show={!!editTx} onHide={() => setEditTx(null)} size="lg" centered>
        <div className="modal-header">
          <h4 className="modal-title">Edit Transaction</h4>
          <button type="button" className="btn-close" onClick={() => setEditTx(null)} />
        </div>
        <form onSubmit={handleEditSubmit}>
          <div className="modal-body row g-3">
            <div className="col-md-6">
              <label className="form-label">Title</label>
              <input className="form-control" name="title" value={editForm.title} onChange={handleEditChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Amount</label>
              <input type="number" className="form-control" name="amount" value={editForm.amount} onChange={handleEditChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" name="date" value={editForm.date} onChange={handleEditChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Transaction Type</label>
              <select className="form-select" name="transactionType" value={editForm.transactionType} onChange={handleEditChange}>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Payment Mode</label>
              <select className="form-select" name="paymentMode" value={editForm.paymentMode} onChange={handleEditChange}>
                <option value="CASH">Cash</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Source / Recipient</label>
              <input className="form-control" name="sourceOrRecipient" value={editForm.sourceOrRecipient} onChange={handleEditChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Category</label>
              <input className="form-control" name="category" value={editForm.category} onChange={handleEditChange} />
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" value={editForm.description} onChange={handleEditChange}></textarea>
            </div>
            <div className="col-12">
              <label className="form-label">Upload Bill</label>
              <input type="file" className="form-control" onChange={handleEditFile} />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" type="submit">Update</button>
          </div>
        </form>
      </Modal>
    </div>
    </div>
  );
};

export default AllTransactions;
