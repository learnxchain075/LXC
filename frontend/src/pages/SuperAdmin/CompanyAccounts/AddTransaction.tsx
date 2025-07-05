import { useState } from "react";
import { toast } from "react-toastify";
import { createCompanyTransaction } from "../../../services/superadmin/companyAccountApi";

const AddTransaction = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    date: "",
    transactionType: "INCOME",
    paymentMode: "CASH",
    sourceOrRecipient: "",
    bill: null as File | null,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((p) => ({ ...p, bill: file }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("amount", form.amount);
    fd.append("date", form.date);
    fd.append("transactionType", form.transactionType);
    fd.append("paymentMode", form.paymentMode);
    fd.append("sourceOrRecipient", form.sourceOrRecipient);
    fd.append("createdBy", localStorage.getItem("userId") || "");
    if (form.bill) fd.append("bill", form.bill);
    try {
      await createCompanyTransaction(fd);
      toast.success("Transaction added");
      setForm({
        title: "",
        description: "",
        amount: "",
        date: "",
        transactionType: "INCOME",
        paymentMode: "CASH",
        sourceOrRecipient: "",
        bill: null,
      });
    } catch (err) {
      toast.error("Failed to add");
    }
  };
  return (
     <div className="page-wrapper">
    <div className="container-fluid py-4 px-3 px-md-5">
      <h2 className="mb-3">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Title</label>
          <input className="form-control" name="title" value={form.title} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Amount</label>
          <input type="number" className="form-control" name="amount" value={form.amount} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Date</label>
          <input type="date" className="form-control" name="date" value={form.date} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Transaction Type</label>
          <select className="form-select" name="transactionType" value={form.transactionType} onChange={handleChange}>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Payment Mode</label>
          <select className="form-select" name="paymentMode" value={form.paymentMode} onChange={handleChange}>
            <option value="CASH">Cash</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="UPI">UPI</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Source / Recipient</label>
          <input className="form-control" name="sourceOrRecipient" value={form.sourceOrRecipient} onChange={handleChange} />
        </div>
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea className="form-control" name="description" value={form.description} onChange={handleChange}></textarea>
        </div>
        <div className="col-12">
          <label className="form-label">Upload Bill</label>
          <input type="file" className="form-control" onChange={handleFile} />
        </div>
        <div className="col-12 text-end">
          <button className="btn btn-primary" type="submit">Submit</button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddTransaction;
