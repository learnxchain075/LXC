import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getGrades, createGrade, updateGrade, deleteGrade } from "../../../../../services/teacher/gradeServices";
import { Igrade } from "../../../../../services/types/teacher/gradeService";
import TooltipOption from "../../../../../core/common/tooltipOption";
import PredefinedDateRanges from "../../../../../core/common/datePicker";
import CommonSelect from "../../../../../core/common/commonSelect";
import { all_routes } from "../../../../../router/all_routes";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Error Boundary
class ErrorBoundary extends React.Component<any, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return <div className="alert alert-danger m-3">Something went wrong. Please refresh.</div>;
    }
    return this.props.children;
  }
}

const Skeleton = () => (
  <div className="placeholder-glow">
    <div className="placeholder col-12 mb-2" style={{ height: 32 }} />
    <div className="placeholder col-8 mb-2" style={{ height: 24 }} />
    <div className="placeholder col-6" style={{ height: 24 }} />
  </div>
);

const Grade = () => {
  const [grades, setGrades] = useState<Igrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"add" | "edit" | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Igrade | null>(null);
  const [form, setForm] = useState<Partial<Igrade>>({});
  const [submitting, setSubmitting] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const routes = all_routes;

  const fetchGrades = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getGrades();
      setGrades(res.data);
    } catch (e: any) {
      setError("Failed to load grades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const handleOpenModal = (type: "add" | "edit", grade?: Igrade) => {
    setModalType(type);
    setSelectedGrade(type === "edit" && grade ? grade : null);
    setForm(type === "edit" && grade ? { ...grade } : {});
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedGrade(null);
    setForm({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "level" || name === "marksFrom" || name === "marksUpto" || name === "gradePoint" ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modalType === "add") {
        await createGrade(form as Igrade);
        toast.success("Grade added successfully");
      } else if (modalType === "edit" && selectedGrade) {
        await updateGrade((selectedGrade as any).id, form as Igrade);
        toast.success("Grade updated successfully");
      }
      fetchGrades();
      handleCloseModal();
    } catch (err) {
      toast.error("Failed to submit grade");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (grade: any) => {
    if (!window.confirm("Are you sure you want to delete this grade?")) return;
    try {
      await deleteGrade(grade.id);
      toast.success("Grade deleted successfully");
      fetchGrades();
    } catch {
      toast.error("Failed to delete grade");
    }
  };

  return (
    <ErrorBoundary>
      <ToastContainer />
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Grade</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Grade
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
              <div className="mb-2">
                <button className="btn btn-primary" onClick={() => handleOpenModal("add")}>Add Grade</button>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Grade List</h4>
              <div className="d-flex align-items-center flex-wrap">
                <div className="input-icon-start mb-3 me-2 position-relative">
                  <PredefinedDateRanges />
                </div>
              </div>
            </div>
            <div className="card-body p-0 py-3">
              {loading ? (
                <Skeleton />
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Level</th>
                        <th>Grade</th>
                        <th>Marks From</th>
                        <th>Marks Upto</th>
                        <th>Grade Point</th>
                        <th>Status</th>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((g: any) => (
                        <tr key={g.id}>
                          <td>{g.level}</td>
                          <td>{g.grade}</td>
                          <td>{g.marksFrom}</td>
                          <td>{g.marksUpto}</td>
                          <td>{g.gradePoint}</td>
                          <td>{g.status}</td>
                          <td>{g.description}</td>
                          <td>
                            <button className="btn btn-sm btn-info me-2" onClick={() => handleOpenModal("edit", g)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(g)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      {modalType && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalType === "add" ? "Add Grade" : "Edit Grade"}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Level</label>
                    <input type="number" className="form-control" name="level" value={form.level ?? ""} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Grade</label>
                    <input type="text" className="form-control" name="grade" value={form.grade ?? ""} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Marks From</label>
                    <input type="number" className="form-control" name="marksFrom" value={form.marksFrom ?? ""} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Marks Upto</label>
                    <input type="number" className="form-control" name="marksUpto" value={form.marksUpto ?? ""} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Grade Point</label>
                    <input type="number" className="form-control" name="gradePoint" value={form.gradePoint ?? ""} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <input type="text" className="form-control" name="status" value={form.status ?? ""} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" name="description" value={form.description ?? ""} onChange={handleChange} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? "Saving..." : "Save"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default Grade;
