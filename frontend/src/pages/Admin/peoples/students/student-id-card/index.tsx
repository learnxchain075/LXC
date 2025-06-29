import React, { useState } from "react";
import { downloadStudentIdCard } from "../../../../../services/admin/idCardService";

const StudentIdCardGenerator: React.FC = () => {
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!studentId) return;
    setLoading(true);
    try {
      const res = await downloadStudentIdCard(studentId);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${studentId}_id_card.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate ID card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">Generate Student ID Card</h4>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Student ID</label>
              <input
                type="text"
                className="form-control"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter Student ID"
              />
            </div>
            <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentIdCardGenerator;
