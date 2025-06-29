

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { all_routes } from "../../router/all_routes";
import useMobileDetection from "../../core/common/mobileDetection";
import { Table } from "antd";
import { getClassesByTeacherId, getClassByschoolId } from "../../services/teacher/classServices";
import { createAnswer, createDoubt, getAnswersByDoubtId, getDoubtsBySchoolId, getDoubtsByUserId, IAnswer, IDoubt } from "../../services/teacher/doubtForumService";
import { PlusCircle } from "react-feather";
import { Button } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

interface ClassItem {
  id: string;
  name: string;
  Section: { id: string; name: string; classId: string }[];
  Subject: { id: string; name: string; code: string; type: string; classId: string }[];
}

const DoubtForum = () => {
  const routes = all_routes;
  const user = useSelector((state: any) => state.auth.userObj);
  const isMobile = useMobileDetection();
  const [doubts, setDoubts] = useState<IDoubt[]>([]);
  const [selectedDoubtId, setSelectedDoubtId] = useState<string | null>(null);
  const [answersByDoubt, setAnswersByDoubt] = useState<{ [doubtId: string]: IAnswer[] }>({});
  const [classList, setClassList] = useState<ClassItem[]>([]);
  const [answerInputs, setAnswerInputs] = useState<Record<string, string>>({});
  const [newDoubt, setNewDoubt] = useState({ title: "", content: "", classId: "", subjectId: "" });
  const [isPosting, setIsPosting] = useState(false);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

  const [activeTab, setActiveTab] = useState<"all" | "mine">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const doubtsPerPage = 10;
  const currentUserId = user?.userId || localStorage.getItem("userId") || "";
  const [filterClassId, setFilterClassId] = useState<string>("");
  const [filterSubjectId, setFilterSubjectId] = useState<string>("");

  
  const formatRelativeTime = (dateString: string) => {
    const currentTime = new Date("2025-05-31T05:47:00.000Z"); 
    const targetTime = new Date(dateString);
    const diffMs = currentTime.getTime() - targetTime.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    const targetTimeIST = new Date(targetTime.getTime() + 5.5 * 60 * 60 * 1000); 
    const hours = targetTimeIST.getHours() % 12 || 12;
    const minutes = targetTimeIST.getMinutes().toString().padStart(2, "0");
    const ampm = targetTimeIST.getHours() >= 12 ? "PM" : "AM";
    const timeStr = `${hours}:${minutes} ${ampm}`;

    if (diffDays === 0) {
      return `Today at ${timeStr}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${timeStr}`;
    } else {
      return `${targetTimeIST.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${timeStr}`;
    }
  };

  const fetchClasses = useCallback(async () => {
    try {
      const teacherId = user?.teacherId || localStorage.getItem("teacherId") || "";
      const schoolId = localStorage.getItem("schoolId") || "";
      const response = user.role === "admin"
        ? await getClassByschoolId(schoolId)
        : await getClassesByTeacherId(teacherId);
      setClassList(response?.data?.classes || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to load classes.", { autoClose: 3000 });
    }
  }, [user.role]);

  const fetchDoubts = useCallback(async () => {
    try {
      const userId = user?.userId || localStorage.getItem("userId") || "";
      const schoolId = localStorage.getItem("schoolId") || "";
      const response = user.role === "admin"
        ? await getDoubtsBySchoolId(schoolId)
        : await getDoubtsByUserId(userId);
      setDoubts(response.data || []);
    } catch (error) {
      console.error("Error fetching doubts:", error);
      toast.error("Failed to load doubts.", { autoClose: 3000 });
    }
  }, [user]);

  const fetchAnswers = useCallback(async (doubtId: string) => {
    try {
      const response = await getAnswersByDoubtId(doubtId);
      setAnswersByDoubt((prev) => ({
        ...prev,
        [doubtId]: response.data || [],
      }));
    } catch (error) {
      console.error("Error fetching answers:", error);
      toast.error("Failed to load answers.", { autoClose: 3000 });
    }
  }, []);

  useEffect(() => {
    fetchClasses();
    fetchDoubts();
  }, [fetchClasses, fetchDoubts]);

  const handleCreateDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, content, classId, subjectId } = newDoubt;
    const userId = user?.userId || localStorage.getItem("userId") || "";

    if (!title || !content || !classId || !subjectId || !userId) {
      toast.error("Please fill all required fields.", { autoClose: 3000 });
      return;
    }

    setIsPosting(true); 
    try {
      const doubtData: IDoubt = { title, content, userId, classId, subjectId };
      await createDoubt(doubtData);
      toast.success("Doubt created successfully!", { autoClose: 3000 });
      fetchDoubts();
      setNewDoubt({ title: "", content: "", classId: "", subjectId: "" });
    } catch (error) {
      console.error("Error creating doubt:", error);
      toast.error("Failed to create doubt.", { autoClose: 3000 });
    } finally {
      setIsPosting(false); 
    }
  };

  const handleCreateAnswer = async (doubtId: string) => {
    const content = answerInputs[doubtId] || "";
    const userId = user?.userId || localStorage.getItem("userId") || "";

    if (!content || !userId) {
      toast.error("Please provide an answer.", { autoClose: 3000 });
      return;
    }

    try {
      const answerData: IAnswer = { content, userId, doubtId };
      await createAnswer(answerData);
      toast.success("Answer posted successfully!", { autoClose: 3000 });
      fetchAnswers(doubtId);
      setAnswerInputs((prev) => ({ ...prev, [doubtId]: "" }));
    } catch (error) {
      console.error("Error creating answer:", error);
      toast.error("Failed to post answer.", { autoClose: 3000 });
    }
  };

  const handleDeleteDoubt = async (doubtId: string) => {
    toast.error("Delete API is not available.", { autoClose: 3000 });
  };

  const handleUpvote = async (doubtId: string, answerId: string) => {
    toast.error("Upvote API is not available.", { autoClose: 3000 });
  };

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const getSubjectsForClass = (classId: string) => {
    const selectedClassObj = classList.find((cls) => cls.id === classId);
    return selectedClassObj?.Subject || [];
  };

  const filteredDoubts = doubts.filter((d) => {
    let match = true;
    if (filterClassId) match = match && d.classId === filterClassId;
    if (filterSubjectId) match = match && d.subjectId === filterSubjectId;
    return match;
  });

  const paginatedDoubts = filteredDoubts.slice((currentPage - 1) * doubtsPerPage, currentPage * doubtsPerPage);

  const renderDoubtCard = (doubt: any) => (
    <div key={doubt.id} className="mb-5 shadow-lg border border-primary-subtle rounded hover-scale-98">
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <h3 className="h5 fw-bold text-primary mb-2">
              <span className="text-primary fw-bold">Title: </span>{doubt.title}
            </h3>
            <div className="d-flex gap-2 mb-2">
              <span className="badge bg-primary-subtle text-primary rounded-pill text-xs fw-semibold">
                {classList.find(cls => cls.id === doubt.classId)?.name || doubt.classId}
              </span>
              <span className="badge bg-success-subtle text-success rounded-pill text-xs fw-semibold">
                {classList.flatMap(cls => cls.Subject).find(sub => sub.id === doubt.subjectId)?.name || doubt.subjectId}
              </span>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-primary text-white"
              onClick={() => {
                document.querySelector(".card-body")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Post Doubt
            </button>
            {doubt.userId === currentUserId && (
              <button 
                onClick={() => handleDeleteDoubt(doubt.id)}
                className="btn btn-sm btn-light text-danger border-0"
              >
                <i className="bi bi-trash"></i>
              </button>
            )}
          </div>
        </div>

        <p className="text-muted">
          <span className="text-primary fw-semibold">Content: </span>{doubt.content}
        </p>
        <p className="text-sm text-muted">
          Asked by <span className="fw-medium text-primary">{doubt.user?.name || "Unknown"}</span>
          {doubt.createdAt && ` on ${formatRelativeTime(doubt.createdAt)}`}
        </p>

        <button
          onClick={() => {
            if (selectedDoubtId === doubt.id) {
              setSelectedDoubtId(null);
            } else {
              setSelectedDoubtId(doubt.id);
              if (!answersByDoubt[doubt.id]) {
                fetchAnswers(doubt.id);
              }
            }
          }}
          className={`btn btn-outline-primary btn-sm mt-3 transition-all duration-300 ${selectedDoubtId === doubt.id ? 'bg-primary text-white border-primary' : ''}`}
        >
          <i className="bi bi-chat-left-text me-1"></i>
          {selectedDoubtId === doubt.id
            ? "Hide Answers"
            : `Show Answers${answersByDoubt[doubt.id]?.length > 0 ? ` (${answersByDoubt[doubt.id].length})` : ""}`}
        </button>

        {selectedDoubtId === doubt.id && (
          <div className="mt-4 pt-4 border-top">
            {answersByDoubt[doubt.id]?.length === 0 ? (
              <p className="text-muted fst-italic text-center py-3">
                No answers yet. Be the first to help!
              </p>
            ) : (
              answersByDoubt[doubt.id]?.map(answer => (
                <div key={answer.id} className="p-3 rounded border-start border-4 border-primary mb-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <p className="text-dark mb-2">{answer.content}</p>
                      <p className="text-xs text-muted">
                        By <span className="fw-medium text-primary">{answer.user?.name || "Unknown"}</span>
                        {answer.createdAt && ` on ${formatRelativeTime(answer.createdAt)}`}
                      </p>
                    </div>
                    <button
                      onClick={() => answer.id && handleUpvote(doubt.id, answer.id)}
                      className="btn btn-sm btn-light text-success d-flex align-items-center gap-1"
                    >
                      <i className="bi bi-hand-thumbs-up"></i>
                      <span className="fw-semibold">{answer.upvotes || 0}</span>
                    </button>
                  </div>
                </div>
              ))
            )}

            <div className="d-flex gap-3 align-items-end mt-3">
              <textarea
                className="form-control"
                placeholder="Share your knowledge and help your classmates..."
                rows={3}
                value={answerInputs[doubt.id] || ""}
                onChange={(e) =>
                  setAnswerInputs(prev => ({ ...prev, [doubt.id]: e.target.value }))
                }
              />
              <button
                className="btn btn-primary"
                disabled={!answerInputs[doubt.id]?.trim()}
                onClick={() => handleCreateAnswer(doubt.id)}
              >
                <i className="bi bi-send me-1"></i>
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div >
      <ToastContainer />
      <div className={isMobile ? "page-wrapper" : ""}>
        <div className="content">
          <div className="card bg-white">
            <div className="card p-0 py-2 px-3 bg-white">
              <div className="min-vh-100">
                <div className="container py-3">
                  <div className="text-center mb-2">
                    <h1 className="fs-2 fw-bold  text-primary">
                      📚 Student Doubt Forum
                    </h1>
                    <p className="text-muted  fs-2.5">Ask questions, share knowledge, and learn together!</p>
                  </div>

                  {/* Create Doubt Section */}
                  <div className="card mb-5 shadow-lg border border-primary-subtle">
                    <div className="card-body p-4">
                      <h2 className="h4 fw-bold  fs-3 d-flex align-items-center gap-2 text-primary mb-4">
                        <i className="bi bi-plus-circle text-primary fs-4"></i>
                        Ask a Question
                      </h2>
                      <div className="mb-4">
                        <label className="form-label text-muted fw-bold fs-3">Title</label>
                        <input
                          type="text"
                          className="form-control fs-3"
                          placeholder="What's your question about?"
                          value={newDoubt.title}
                          onChange={e => setNewDoubt({ ...newDoubt, title: e.target.value })}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label text-muted fs-3">Description</label>
                        <textarea
                          className="form-control  fs-4.5"
                          rows={4}
                          style={{ minHeight: "120px" }}
                          placeholder="Describe your doubt in detail..."
                          value={newDoubt.content}
                          onChange={e => setNewDoubt({ ...newDoubt, content: e.target.value })}
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <label className="form-label text-muted">Class</label>
                          <select
                            className="form-select"
                            value={newDoubt.classId}
                            onChange={e => setNewDoubt({ ...newDoubt, classId: e.target.value, subjectId: "" })}
                          >
                            <option value="">Select Class</option>
                            {classList.map((cls) => (
                              <option key={cls.id} value={cls.id}>
                                {cls.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6 mb-4">
                          <label className="form-label text-muted">Subject</label>
                          <select
                            className="form-select"
                            value={newDoubt.subjectId}
                            onChange={e => setNewDoubt({ ...newDoubt, subjectId: e.target.value })}
                            disabled={!newDoubt.classId}
                          >
                            <option value="">Select Subject</option>
                            {getSubjectsForClass(newDoubt.classId).map((sub) => (
                              <option key={sub.id} value={sub.id}>
                                {sub.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mb-4">
                        <button
                          onClick={handleCreateDoubt}
                          className="btn w-100 fs-3.25 py-2 btn-primary"
                          disabled={isPosting || !newDoubt.title.trim() || !newDoubt.content.trim() || !newDoubt.classId || !newDoubt.subjectId}
                        >
                          {isPosting ? (
                            <span>
                              <i className="bi bi-hourglass-split me-2"></i>
                              Posting...
                            </span>
                          ) : (
                            <span>
                              <i className="bi bi-plus-circle me-2"></i>
                              Post Your Question
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="row mb-5 p-3 bg-white rounded shadow-sm border border-light-subtle">
                    <div className="col-sm-6 mb-4">
                      <label className="form-label text-muted">Filter by Class</label>
                      <select
                        className="form-select"
                        value={filterClassId}
                        onChange={e => {
                          setFilterClassId(e.target.value);
                          setFilterSubjectId("");
                        }}
                      >
                        <option value="">All Classes</option>
                        {classList.map(cls => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-sm-6 mb-4">
                      <label className="form-label text-muted">Filter by Subject</label>
                      <select
                        className="form-select"
                        value={filterSubjectId}
                        onChange={e => setFilterSubjectId(e.target.value)}
                        disabled={!filterClassId}
                      >
                        <option value="">All Subjects</option>
                        {getSubjectsForClass(filterClassId).map(sub => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tabs */}
                  {/* <ul className="nav nav-tabs mb-2 mt-2 bg-light rounded overflow-hidden">
                    <li className="nav-item w-50">
                      <button
                        className={`nav-link w-100 fs-3.5 fw-semibold ${activeTab === 'all' ? 'bg-primary text-white' : 'bg-light-subtle text-primary'}`}
                        onClick={() => setActiveTab('all')}
                      >
                        All Questions ({filteredDoubts.length})
                      </button>
                    </li>
                    <li className="nav-item w-50">
                      <button
                        className={`nav-link w-100 fs-3.5 fw-semibold ${activeTab === 'mine' ? 'bg-primary text-white' : 'bg-light-subtle text-primary'}`}
                        onClick={() => setActiveTab('mine')}
                      >
                        My Questions ({filteredDoubts.filter(d => d.userId === currentUserId).length})
                      </button>
                    </li>
                  </ul> */}
                  <ul className="nav nav-tabs mb-2 mt-2 rounded overflow-hidden">
  <li className="nav-item d-inline-block">
    <button
      className={`nav-link fs-3.5 fw-semibold px-4 ${activeTab === 'all' ? 'bg-primary text-white' : 'bg-light-subtle text-primary'}`}
      onClick={() => setActiveTab('all')}
    >
      All Questions ({filteredDoubts.length})
    </button>
  </li>
  <li className="nav-item d-inline-block ms-2">
    <button
      className={`nav-link fs-3.5 fw-semibold px-4 ${activeTab === 'mine' ? 'bg-primary text-white' : 'bg-light-subtle text-primary'}`}
      onClick={() => setActiveTab('mine')}
    >
      My Questions ({filteredDoubts.filter(d => d.userId === currentUserId).length})
    </button>
  </li>
</ul>


                  {/* Tab Content */}
                  {activeTab === 'all' ? (
                    paginatedDoubts.length ? (
                      <div className="mb-5">{paginatedDoubts.map(renderDoubtCard)}</div>
                    ) : (
                      <div className="card p-4 text-center bg-light mb-5">
                        <p className="text-muted fs-5">No questions found matching your filters.</p>
                        <p className="text-muted mt-2">Try adjusting your filters or be the first to ask a question!</p>
                      </div>
                    )
                  ) : (
                    filteredDoubts.filter(d => d.userId === currentUserId).length ? (
                      <div className="mb-5">
                        {filteredDoubts
                          .filter(d => d.userId === currentUserId)
                          .map((doubt) => renderDoubtCard(doubt))}
                      </div>
                    ) : (
                      <div className="card p-4 text-center mb-5">
                        <p className="text-muted fs-5 mb-2">You haven't asked any questions yet.</p>
                        <p className="text-muted">Start by asking your first question above!</p>
                      </div>
                    )
                  )}

                  {/* Pagination Controls */}
                  {filteredDoubts.length > doubtsPerPage && (
                    <div className="d-flex justify-content-center align-items-center mt-5 gap-3">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="btn btn-outline-primary"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 bg-light text-primary rounded fw-medium">
                        Page {currentPage} of {Math.ceil(filteredDoubts.length / doubtsPerPage)}
                      </span>
                      <button
                        disabled={currentPage * doubtsPerPage >= filteredDoubts.length}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="btn btn-outline-primary"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Doubt Modal - Commented Out */}
      {/*
      <div className="modal fade" id="create_doubt">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Create Doubt</h4>
              <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-x" />
              </button>
            </div>
            <form onSubmit={handleCreateDoubt}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input type="text" className="form-control" name="title" required />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Content</label>
                      <textarea className="form-control" name="content" rows={4} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Class</label>
                      <select
                        className="form-select"
                        name="classId"
                        required
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      >
                        <option value="">Select Class</option>
                        {classList.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Subject</label>
                      <select className="form-select" name="subjectId" required disabled={!selectedClass}>
                        <option value="">Select Subject</option>
                        {getSubjectsForClass(selectedClass).map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">Create Doubt</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      */}

      {/* View Doubt and Answers Modal - Commented Out */}
      {/*
      <div className="modal fade" id="view_doubt">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">{selectedDoubt?.title}</h4>
              <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <p><strong>Content:</strong> {selectedDoubt?.content}</p>
                <p><strong>Class:</strong> {classList.find((cls) => cls.id === selectedDoubt?.classId)?.name || selectedDoubt?.classId}</p>
                <p><strong>Subject:</strong> {
                  classList
                    .flatMap((cls) => cls.Subject)
                    .find((sub) => sub.id === selectedDoubt?.subjectId)?.name || selectedDoubt?.subjectId
                }</p>
                <p><strong>Posted:</strong> {selectedDoubt?.createdAt && new Date(selectedDoubt.createdAt).toLocaleString()}</p>
              </div>
              <hr />
              <h5>Answers</h5>
              <div className="mb-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
                {answers.length > 0 ? (
                  answers.map((answer) => (
                    <div key={answer.id} className="border-bottom py-2">
                      <p className="mb-1">{answer.content}</p>
                      <small className="text-muted">
                        By User {answer.userId} on {answer.createdAt && new Date(answer.createdAt).toLocaleString()}
                      </small>
                    </div>
                  ))
                ) : (
                  <p>No answers yet.</p>
                )}
              </div>
              <form onSubmit={handleCreateAnswer}>
                <div className="mb-3">
                  <label className="form-label">Post an Answer</label>
                  <textarea className="form-control" name="content" rows={3} required />
                </div>
                <button type="submit" className="btn btn-primary">Post Answer</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      */}
    </div>
  );
};

export default DoubtForum;