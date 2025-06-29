import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { downloadStudentIdCard } from "../../../../../services/admin/idCardService";
import {
  getAllStudentsInAclass,
  getClassByschoolId,
} from "../../../../../services/teacher/classServices";

interface Class {
  id: string;
  name: string;
}

interface Student {
  id: string;
  rollNo: string;
  admissionNo: string;
  user: { name: string };
}

const StudentIdCardGenerator: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      const schoolId = localStorage.getItem("schoolId") ?? "";
      if (!schoolId) return;
      try {
        const res = await getClassByschoolId(schoolId);
        setClasses(res.data.data || res.data || []);
      } catch (err) {
        toast.error("Failed to load classes");
      }
    };
    fetchClasses();
  }, []);

  const handleClassChange = async (clsId: string) => {
    setSelectedClass(clsId);
    setSelectedStudentId("");
    if (!clsId) return;
    try {
      const res = await getAllStudentsInAclass(clsId);
      let arr: any[] = [];
      if (res?.data && typeof res.data === "object" && !Array.isArray(res.data) && "students" in res.data) {
        arr = (res.data as any).students;
      } else if (Array.isArray(res.data)) {
        arr = res.data;
      }
      setStudents(arr as Student[]);
    } catch (err) {
      setStudents([]);
      toast.error("Failed to load students");
    }
  };

  const handleGenerate = async () => {
    if (!selectedStudentId) return;
    setLoading(true);
    try {
      const res = await downloadStudentIdCard(selectedStudentId);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
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
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Class</label>
                <select
                  className="form-select"
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Student</label>
                <select
                  className="form-select"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  disabled={!selectedClass}
                >
                  <option value="">Select Student</option>
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.user.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedStudentId && (
                <>
                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={
                        students.find((s) => s.id === selectedStudentId)?.user.name || ""
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Roll No</label>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={
                        students.find((s) => s.id === selectedStudentId)?.rollNo || ""
                      }
                    />
                  </div>
                </>
              )}
            </div>
            <button className="btn btn-primary mt-3" onClick={handleGenerate} disabled={loading || !selectedStudentId}>
              {loading ? "Generating..." : "Generate"}
            </button>
            {previewUrl && (
              <div className="mt-4">
                <iframe
                  title="ID Card Preview"
                  src={previewUrl}
                  style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}
                ></iframe>
                <div className="mt-2">
                  <a href={previewUrl} download={`${selectedStudentId}_id_card.pdf`} className="btn btn-success me-2">
                    Download
                  </a>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      const win = window.open(previewUrl);
                      win?.print();
                    }}
                  >
                    Print
                  </button>
                </div>
              </div>
            )}
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentIdCardGenerator;
