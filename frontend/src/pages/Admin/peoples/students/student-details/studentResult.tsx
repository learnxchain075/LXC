import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../../../router/all_routes";
import StudentModals from "../studentModals";
import useMobileDetection from "../../../../../core/common/mobileDetection";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getExamsResultsByStudentId, IExam } from "../../../../../services/student/StudentAllApi";
import { useSelector } from 'react-redux';
import { getAllExamsForStudent } from "../../../../../services/student/StudentAllApi";
import { AxiosResponse } from 'axios';

const StudentResult = () => {
  const routes = all_routes;
  const isMobile = useMobileDetection();
  const [examData, setExamData] = useState<IExam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Get studentId from localStorage
  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    const fetchExamData = async () => {
      if (!studentId) {
        toast.error('Student ID not found in localStorage', { autoClose: 3000 });
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const response = await getAllExamsForStudent(studentId);
        if (response.data.success) {
          setExamData(response.data.exams);
          toast.success('Exams and results loaded successfully!', { autoClose: 3000 });
        } else {
          throw new Error('Failed to load exam data');
        }
      } catch (error: any) {
        console.error('Error fetching exam data:', error);
        toast.error(error.message || 'Failed to load exams and results', { autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchExamData();
  }, [studentId]);

  // Filter exams by title, subject, or code
  const filteredExams = examData.filter(exam => {
    const q = search.toLowerCase();
    return (
      exam.title.toLowerCase().includes(q) ||
      (exam.subject?.name?.toLowerCase().includes(q) || "") ||
      (exam.subject?.code?.toLowerCase().includes(q) || "")
    );
  });

  
  const fetchAllExams = async (id: string) => {
    try {
      const response = await getAllExamsForStudent(id);
      console.log(response.data);
      if (response.data.success) {
        setExamData(response.data.exams);
        toast.success('Exams and results loaded successfully!', { autoClose: 3000 });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load exams and results', { autoClose: 3000 });
    }
  };

  // Modal content for all exams
  const AllExamsModal = () => (
    <div
      className={`modal fade${showModal ? ' show d-block' : ''}`}
      tabIndex={-1}
      role="dialog"
      style={{ background: showModal ? 'rgba(0,0,0,0.5)' : undefined }}
      ref={modalRef}
      aria-modal={showModal ? 'true' : undefined}
      aria-hidden={!showModal}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">All Exams</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
          </div>
          <div className="modal-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {examData.length === 0 ? (
                    <tr><td colSpan={4} className="text-center text-muted">No exams found</td></tr>
                  ) : (
                    examData.map((exam) => {
                      const hasResult = exam.results && exam.results.length > 0;
                      const marksObtained = hasResult ? exam.results[0].score : null;
                      const passMark = exam.passMark ?? 0;
                      const totalMarks = exam.totalMarks ?? 0;
                      const result = marksObtained !== null ? (marksObtained >= passMark ? 'Pass' : 'Fail') : 'Not Published';
                      const examDate = exam.startTime ? new Date(exam.startTime).toLocaleDateString() : 'N/A';
                      return (
                        <tr key={exam.id}>
                          <td>{exam.title}</td>
                          <td>{exam.subject?.name} ({exam.subject?.code})</td>
                          <td>{examDate}</td>
                          <td>
                            <span className={`badge ${result === 'Pass' ? 'bg-success' : result === 'Fail' ? 'bg-danger' : 'bg-secondary'}`}>{result}</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className={isMobile ? "page-wrapper" : "p-3"}>
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        <div className="content">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading exam results...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!filteredExams.length) {
    return (
      <div className={isMobile ? "page-wrapper" : "p-3"}>
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        <div className="content">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body text-center py-5">
                  <i className="bi bi-exclamation-triangle display-4 text-muted mb-3"></i>
                  <h5>No exam results available</h5>
                  <p className="text-muted">No exam results have been published yet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AllExamsModal />
      <div className={isMobile ? "page-wrapper" : "p-3"}>
        <ToastContainer position="top-center" autoClose={3000} theme="colored" />
        <div className="content">
          <div className="row">
            <div className="col-12 d-flex flex-column">
              <div className="row">
                <div className="col-md-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0 d-flex flex-column flex-md-row align-items-md-center justify-content-between pb-0 gap-3">
                      <div>
                        <h4 className="fw-bold text-dark mb-1 d-flex align-items-center">
                          <i className="bi bi-mortarboard text-primary me-2 fs-2"></i>
                          Exams & Results
                        </h4>
                        <div className="small text-muted">View your latest exam results and performance</div>
                      </div>
                      <div className="d-flex align-items-center gap-2" style={{ maxWidth: 480 }}>
                        <div className="input-group">
                          <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-search text-muted"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Search by exam, subject, or code..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                          />
                        </div>
                        <button className="btn btn-primary ms-2" onClick={() => setShowModal(true)}>
                          <i className="bi bi-list-ul me-1"></i> View All Exams
                        </button>
                      </div>
                    </div>
                    <div className="card-body p-0">
                      <div className="accordion" id="accordionExamResults">
                        {filteredExams.map((exam, index) => {
                          const hasResult = exam.results && exam.results.length > 0;
                          const marksObtained = hasResult ? exam.results[0].score : null;
                          const passMark = exam.passMark ?? 0;
                          const totalMarks = exam.totalMarks ?? 0;
                          const result = marksObtained !== null ? (marksObtained >= passMark ? 'Pass' : 'Fail') : 'Not Published';
                          const percentage = marksObtained !== null ? ((marksObtained / totalMarks) * 100).toFixed(2) : 'N/A';
                          const examDate = exam.startTime ? new Date(exam.startTime).toLocaleDateString() : 'N/A';
                          return (
                          <div className="accordion-item border-0 shadow-sm mb-3" key={exam.id}>
                            <h2 className="accordion-header">
                              <button
                                className={`accordion-button ${index === 0 ? '' : 'collapsed'} fw-bold`}
                                type="button"
                                data-bs-toggle="collapse"
                                  data-bs-target={`#exam${exam.id}`}
                                aria-expanded={index === 0 ? 'true' : 'false'}
                                  aria-controls={`exam${exam.id}`}
                              >
                                  <span className={`badge ${result === 'Pass' ? 'bg-success' : result === 'Fail' ? 'bg-danger' : 'bg-secondary'} me-3`}>
                                    <i className={`bi ${result === 'Pass' ? 'bi-check-circle' : result === 'Fail' ? 'bi-x-circle' : 'bi-question-circle'}`}></i>
                                  </span>
                                  <span className="me-2">{exam.title}</span>
                                  <span className="badge bg-light text-dark border ms-2">
                                    {examDate}
                                  </span>
                                  <span className="badge bg-info text-white ms-2">
                                    {exam.subject?.name} ({exam.subject?.code})
                                </span>
                              </button>
                            </h2>
                            <div
                                id={`exam${exam.id}`}
                              className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                                data-bs-parent="#accordionExamResults"
                            >
                                <div className="accordion-body p-0">
                                  <div className="table-responsive" style={{ maxHeight: 350, overflowX: 'auto' }}>
                                    <table className="table table-hover align-middle mb-0">
                                      <thead className="table-light sticky-top">
                                      <tr>
                                          <th className="text-dark">Subject</th>
                                          <th className="text-dark">Max Marks</th>
                                          <th className="text-dark">Min Marks</th>
                                          <th className="text-dark">Marks Obtained</th>
                                          <th className="text-dark text-end">Result</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                          <td className="text-dark">{exam.subject?.name} ({exam.subject?.code})</td>
                                          <td className="text-dark">{totalMarks}</td>
                                          <td className="text-dark">{passMark}</td>
                                          <td className="text-dark">{marksObtained !== null ? marksObtained : <span className="text-muted">Not Published</span>}</td>
                                          <td className="text-end">
                                            <span className={`badge ${result === 'Pass' ? 'bg-success' : result === 'Fail' ? 'bg-danger' : 'bg-secondary'}`}>{result}</span>
                                          </td>
                                        </tr>
                                      <tr className="table-dark">
                                        <td className="text-white fw-bold">
                                          <i className="bi bi-trophy me-1"></i>
                                          Rank : N/A
                                        </td>
                                        <td className="text-white fw-bold">
                                            Total : {totalMarks}
                                        </td>
                                        <td className="text-white" colSpan={2}>
                                            Marks Obtained : {marksObtained !== null ? marksObtained : 'N/A'}
                                        </td>
                                        <td className="text-white text-end">
                                          <div className="d-flex align-items-center justify-content-end">
                                            <span className="me-3">
                                              <i className="bi bi-percent me-1"></i>
                                                {percentage !== 'N/A' ? `${percentage}%` : 'N/A'}
                                            </span>
                                              <span className={`badge ${result === 'Pass' ? 'bg-success' : result === 'Fail' ? 'bg-danger' : 'bg-secondary'}`}>{result}</span>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StudentModals />
    </>
  );
};

export default StudentResult;