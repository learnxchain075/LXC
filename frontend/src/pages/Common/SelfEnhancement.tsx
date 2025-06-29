import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { all_routes } from "../../router/all_routes";
import useMobileDetection from "../../core/common/mobileDetection";
import { getClassByschoolId, getClassesByTeacherId } from "../../services/teacher/classServices";
import { getLessonByteacherId } from "../../services/teacher/lessonServices";
import { createNewspaper, createQuiz, getNewspapersByClassId, getQuizzesByClassId, INewspaper as IServiceNewspaper, IQuiz as IServiceQuiz } from "../../services/teacher/selfEnhancementService";
import { getQuizNewspaperByStudentId, INewspaper, IQuiz } from "../../services/student/StudentAllApi";
import TooltipOption from "../../core/common/tooltipOption";
import PredefinedDateRanges from "../../core/common/datePicker";
import { Table } from "antd";
import { closeModal } from "./modalclose";

interface SelfEnhancementItem {
  id: string;
  type: "Quiz" | "Newspaper";
  title: string;
  options?: string[];
  answer?: string;
  content?: string;
  attachmentCount?: number;
  classId: string;
  section?: string;
  createdAt: string;
}

interface SectionItem {
  id: string;
  name: string;
  classId: string;
}

interface ClassItem {
  id: string;
  className: string;
  Section: SectionItem[];
}

const SelfEnhancement = () => {
  const routes = all_routes;
  const user = useSelector((state: any) => state.auth.userObj);
  const [items, setItems] = useState<SelfEnhancementItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [classList, setClassList] = useState<ClassItem[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [quizOptions, setQuizOptions] = useState<string[]>([""]);
  const [editItem, setEditItem] = useState<SelfEnhancementItem | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<SelfEnhancementItem | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [attemptedQuizzes, setAttemptedQuizzes] = useState<Set<string>>(new Set());
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMobileDetection();
  const isStudent = user?.role === "student";
  const [activeTab, setActiveTab] = useState<"quiz" | "newspaper">("quiz");
  const [loading, setLoading] = useState(false);

  const fetchClasses = useCallback(async () => {
    if (isStudent) return;
    try {
      setLoading(true);
      const teacherId = user?.teacherId || localStorage.getItem("teacherId") || "";
      const response = user.role === "admin"
        ? await getClassByschoolId(localStorage.getItem("schoolId") ?? "")
        : await getClassesByTeacherId(teacherId);
      const res = await getLessonByteacherId(teacherId);
      setTimetable(Array.isArray(res?.data) ? res.data : res?.data ? [res.data] : []);
      
      const classes = response?.data?.classes.map((cls: any) => ({
        id: cls.id,
        className: cls.name || cls.className,
        Section: cls.Section.map((sec: any) => ({
          id: sec.id,
          name: sec.name,
          classId: sec.classId,
        })) || [],
      })) || [];
      
      setClassList(classes);
      
      // Automatically select the first class if available
      if (classes.length > 0) {
        setSelectedClass(classes[0].id);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to load classes", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  }, [user.role, isStudent]);

  const fetchStudentItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getQuizNewspaperByStudentId();
      const quizzes: SelfEnhancementItem[] = response.data.quizzes.map((quiz: IQuiz) => ({
        id: quiz.id,
        type: "Quiz",
        title: quiz.question,
        options: quiz.options,
        answer: quiz.answer,
        classId: "",
        section: "",
        createdAt: quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
      }));
      const newspapers: SelfEnhancementItem[] = response.data.newspapers.map((news: INewspaper) => ({
        id: news.id,
        type: "Newspaper",
        title: news.title,
        content: news.content,
        attachmentCount: news.attachment ? 1 : 0,
        classId: "",
        section: "",
        createdAt: news.createdAt ? new Date(news.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
      }));
      setItems([...quizzes, ...newspapers]);
    } catch (error) {
      console.error("Error fetching student items:", error);
      toast.error("Failed to fetch quizzes and newspapers.", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchItemsForClass = useCallback(async (classId: string) => {
    try {
      setLoading(true);
      const [quizResponse, newspaperResponse] = await Promise.all([
        getQuizzesByClassId(classId),
        getNewspapersByClassId(classId),
      ]);

      const quizzes: SelfEnhancementItem[] = quizResponse.data.map((quiz: IServiceQuiz) => ({
        id: quiz._id || Math.random().toString(36).substr(2, 9),
        type: "Quiz",
        title: quiz.question,
        options: quiz.options,
        answer: quiz.answer,
        classId: quiz.classId,
        section: quiz.section || "",
        createdAt: quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
      }));

      const newspapers: SelfEnhancementItem[] = newspaperResponse.data.map((news: IServiceNewspaper) => ({
        id: news._id || Math.random().toString(36).substr(2, 9),
        type: "Newspaper",
        title: news.title,
        content: news.content,
        attachmentCount: news.attachments?.length || 0,
        classId: news.classId,
        section: news.section || "",
        createdAt: news.createdAt ? new Date(news.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
      }));

      const filteredItems = selectedSection
        ? [...quizzes, ...newspapers].filter((item) => item.section === selectedSection)
        : [...quizzes, ...newspapers];

      setItems(filteredItems);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to fetch items for class.", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  }, [selectedSection]);

  // Fetch data on component mount
  useEffect(() => {
    if (isStudent) {
      fetchStudentItems();
    } else {
      fetchClasses();
    }
  }, [fetchClasses, fetchStudentItems, isStudent]);

  // Fetch items when selectedClass changes
  useEffect(() => {
    if (!isStudent && selectedClass) {
      fetchItemsForClass(selectedClass);
    }
  }, [selectedClass, selectedSection, isStudent, fetchItemsForClass]);

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const addQuizOption = () => {
    setQuizOptions([...quizOptions, ""]);
  };

  const updateQuizOption = (index: number, value: string) => {
    const updatedOptions = [...quizOptions];
    updatedOptions[index] = value;
    setQuizOptions(updatedOptions);
  };

  const removeQuizOption = (index: number) => {
    setQuizOptions(quizOptions.filter((_, i) => i !== index));
  };

  const handleAddQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    const classId = formData.get("classId") as string;
    const sectionId = formData.get("section") as string;
    const nonEmptyOptions = quizOptions.filter((opt) => opt.trim() !== "");

    if (!question || nonEmptyOptions.length < 2 || !answer || !classId || !sectionId) {
      toast.error("Please provide a question, at least two options, an answer, a class, and a section.", { autoClose: 3000 });
      return;
    }

    try {
      const quizData: IServiceQuiz = {
        question,
        options: nonEmptyOptions,
        answer,
        classId,
      };
      await createQuiz(quizData);
      toast.success("Quiz added successfully!", { autoClose: 3000 });
      setQuizOptions([""]);
      
      // Refresh items after adding
      if (classId === selectedClass && (!selectedSection || sectionId === selectedSection)) {
        await fetchItemsForClass(classId);
      } else {
        // If different class was selected, switch to it
        setSelectedClass(classId);
        setSelectedSection(sectionId);
      }
      closeModal("add_quiz");
    } catch (error) {
      console.error("Error adding quiz:", error);
      toast.error("Failed to add quiz.", { autoClose: 3000 });
    }
  };

  const handleAddNewspaper = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const classId = formData.get("classId") as string;
    const sectionId = formData.get("section") as string;
    const attachments = formData.get("attachments") as File;

    if (!title || !content || !classId || !sectionId) {
      toast.error("Please provide a title, content, class, and section.", { autoClose: 3000 });
      return;
    }

    try {
      const newspaperData: IServiceNewspaper = {
        title,
        content,
        attachments,
        userId: localStorage.getItem("userId") || "",
        classId,
      };
      await createNewspaper(newspaperData);
      toast.success("Newspaper added successfully!", { autoClose: 3000 });
      
      // Refresh items after adding
      if (classId === selectedClass && (!selectedSection || sectionId === selectedSection)) {
        await fetchItemsForClass(classId);
      } else {
        // If different class was selected, switch to it
        setSelectedClass(classId);
        setSelectedSection(sectionId);
      }
      closeModal("add_newspaper");
    } catch (error) {
      console.error("Error adding newspaper:", error);
      toast.error("Failed to add newspaper.", { autoClose: 3000 });
    }
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const classId = formData.get("classId") as string;
    const sectionId = formData.get("section") as string;

    try {
      if (editItem.type === "Quiz") {
        const answer = formData.get("answer") as string;
        const nonEmptyOptions = quizOptions.filter((opt) => opt.trim() !== "");
        if (!title || nonEmptyOptions.length < 2 || !answer || !classId || !sectionId) {
          toast.error("Please provide a question, at least two options, an answer, a class, and a section.", {
            autoClose: 3000,
          });
          return;
        }
        setItems(
          items.map((item) =>
            item.id === editItem.id
              ? { ...item, title, options: nonEmptyOptions, answer, classId, section: sectionId }
              : item
          )
        );
      } else {
        const content = formData.get("content") as string;
        const attachments = formData.getAll("attachments") as File[];
        if (!title || !content || !classId || !sectionId) {
          toast.error("Please provide a title, content, class, and a section.", {
            autoClose: 3000,
          });
          return;
        }
        setItems(
          items.map((item) =>
            item.id === editItem.id
              ? { ...item, title, content, attachmentCount: attachments.length, classId, sectionId }
              : item
          )
        );
      }

      setEditItem(null);
      setQuizOptions([""]);
      toast.success("Item updated successfully!", { autoClose: 3000 });
      closeModal("edit_item");
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item.", { autoClose: 3000 });
    }
  };

  const handleDeleteItem = async (id: string, type: "Quiz" | "Newspaper") => {
    try {
      setItems(items.filter((item) => item.id !== id));
      toast.success("Item deleted successfully!", { autoClose: 3000 });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item.", { autoClose: 3000 });
    }
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuiz || !selectedOption) {
      toast.error("Please select an option.", { autoClose: 3000 });
      return;
    }
    const isCorrectAnswer = selectedOption === selectedQuiz.answer;
    setIsCorrect(isCorrectAnswer);
    setAttemptedQuizzes((prev) => new Set(prev).add(selectedQuiz.id));
    if (isCorrectAnswer) {
      toast.success("Correct answer!", { autoClose: 3000 });
    } else {
      toast.error(`Incorrect! Correct answer: ${selectedQuiz.answer}`, { autoClose: 3000 });
    }
  };

  const openQuizModal = (quiz: SelfEnhancementItem) => {
    setSelectedQuiz(quiz);
    setSelectedOption("");
    setIsCorrect(null);
  };

  const getSectionsForClass = (classId: string): SectionItem[] => {
    const selectedClassObj = classList.find((cls) => cls.id === classId);
    return selectedClassObj?.Section || [];
  };

  const filteredItems = items.filter(item => 
    activeTab === "quiz" ? item.type === "Quiz" : item.type === "Newspaper"
  );

  // Bootstrap Skeleton Components
  const renderTableSkeleton = () => {
    const skeletonRows = 5;
    const columnsCount = isStudent ? 6 : 7;
    
    return (
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              {Array(columnsCount).fill(0).map((_, i) => (
                <th key={i}>
                  <div className="placeholder-glow">
                    <span className="placeholder col-6"></span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array(skeletonRows).fill(0).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array(columnsCount).fill(0).map((_, colIndex) => (
                  <td key={colIndex}>
                    <div className="placeholder-glow">
                      <span className="placeholder col-12"></span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderFilterSkeleton = () => (
    <div className="p-3">
      {Array(3).fill(0).map((_, idx) => (
        <div key={idx} className="mb-3">
          <div className="placeholder-glow">
            <span className="placeholder col-12" style={{ height: '38px' }}></span>
          </div>
        </div>
      ))}
      <div className="d-flex justify-content-end mt-2">
        <div className="placeholder-glow">
          <span className="placeholder me-2" style={{ width: '80px', height: '38px' }}></span>
          <span className="placeholder" style={{ width: '80px', height: '38px' }}></span>
        </div>
      </div>
    </div>
  );

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      render: (text: string, record: SelfEnhancementItem) => (
        isStudent && record.type === "Quiz" ? (
          <Link
            to="#"
            className="link-primary"
            data-bs-toggle="modal"
            data-bs-target="#take_quiz"
            onClick={() => openQuizModal(record)}
          >
            {text}
          </Link>
        ) : (
          <Link to="#" className="link-primary">
            {text}
          </Link>
        )
      ),
      sorter: (a: SelfEnhancementItem, b: SelfEnhancementItem) =>
        a.title.localeCompare(b.title, 'en-US'),
    },
    {
      title: "Details",
      dataIndex: "options",
      render: (_: any, record: SelfEnhancementItem) =>
        record.type === "Quiz" ? (
          <span>Options: {record.options?.join(", ")}</span>
        ) : (
          <span>
            {record.content?.substring(0, 50)}
            {record.content && record.content.length > 50 ? "..." : ""}
            {record.attachmentCount ? ` (${record.attachmentCount} attachments)` : ""}
          </span>
        ),
    },
    {
      title: "Class",
      dataIndex: "classId",
      render: (classId: string) => {
        if (isStudent) return "N/A";
        const classObj = classList.find((cls) => cls.id === classId);
        return classObj ? classObj.className : classId || "N/A";
      },
    },
    {
      title: "Section",
      dataIndex: "section",
      render: (sectionId: string) => {
        if (isStudent) return "N/A";
        const classObj = classList.find((cls) => cls.id === selectedClass);
        const section = classObj?.Section.find((sec) => sec.id === sectionId);
        return section ? section.name : sectionId || "N/A";
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      sorter: (a: SelfEnhancementItem, b: SelfEnhancementItem) =>
        a.createdAt.localeCompare(b.createdAt, 'en-US'),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: SelfEnhancementItem) => !isStudent && (
        <div className="d-flex align-items-center">
          <div className="dropdown">
            <Link
              to="#"
              className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="ti ti-dots-vertical fs-14" />
            </Link>
            <ul className="dropdown-menu dropdown-menu-right p-3">
              <li>
                <Link
                  className="dropdown-item rounded-1"
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#edit_item"
                  onClick={() => {
                    setEditItem(record);
                    if (record.type === "Quiz") setQuizOptions(record.options || [""]);
                  }}
                >
                  <i className="ti ti-edit-circle me-2" />
                  Edit
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item rounded-1"
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#delete-modal"
                  onClick={() => handleDeleteItem(record.id, record.type)}
                >
                  <i className="ti ti-trash-x me-2" />
                  Delete
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <ToastContainer />
      <div className={isMobile || user.role === "admin" ? "page-wrapper" : "pt-4"}>
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Self Enhancement</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Self-Assessment</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Self Enhancement
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <TooltipOption />
            </div>
          </div>
          
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
            {/* //  <h4 className="mb-3">Self Enhancement</h4> */}
              
              {/* Tab Navigation and Add Buttons */}
              <div className="d-flex align-items-center flex-wrap">
                {/* Tab Navigation */}
                <div className="d-flex mb-3 me-3">
                  <button 
                    className={`btn ${activeTab === "quiz" ? "btn-primary" : "btn-outline-primary"} me-2`}
                    onClick={() => setActiveTab("quiz")}
                  >
                    Quizzes
                  </button>
                  <button 
                    className={`btn ${activeTab === "newspaper" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setActiveTab("newspaper")}
                  >
                    Newspapers
                  </button>
                </div>
                
                {/* Add Buttons */}
                {!isStudent && (
                  <>
                    {activeTab === "quiz" && (
                      <div className="mb-3 me-2">
                        <Link
                          to="#"
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#add_quiz"
                        >
                          <i className="ti ti-square-rounded-plus-filled me-2" />
                          Add Quiz
                        </Link>
                      </div>
                    )}
                    {activeTab === "newspaper" && (
                      <div className="mb-3">
                        <Link
                          to="#"
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#add_newspaper"
                        >
                          <i className="ti ti-upload me-2" />
                          Add Newspaper
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {!isStudent && (
                <div className="d-flex align-items-center flex-wrap">
                  <div className="input-icon-start mb-3 me-2 position-relative">
                    <PredefinedDateRanges />
                  </div>
                  <div className="dropdown mb-3 me-2">
                    <Link
                      to="#"
                      className="btn btn-outline-light bg-white dropdown-toggle"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                    >
                      <i className="ti ti-filter me-2" />
                      Filter
                    </Link>
                    <div className="dropdown-menu drop-width" ref={dropdownMenuRef}>
                      <form>
                        <div className="d-flex align-items-center border-bottom p-3">
                          <h4>Filter</h4>
                        </div>
                        <div className="p-3 border-bottom pb-0">
                          {loading ? renderFilterSkeleton() : (
                            <div className="row">
                              <div className="col-md-12">
                                <div className="mb-3">
                                  <label className="form-label">Class</label>
                                  <select
                                    className="form-select"
                                    value={selectedClass}
                                    onChange={(e) => {
                                      setSelectedClass(e.target.value);
                                      setSelectedSection("");
                                    }}
                                  >
                                    <option value="">Select Class</option>
                                    {classList.map((cls) => (
                                      <option key={cls.id} value={cls.id}>
                                        {cls.className}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="mb-3">
                                  <label className="form-label">Section</label>
                                  <select
                                    className="form-select"
                                    value={selectedSection}
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                    disabled={!selectedClass}
                                  >
                                    <option value="">Select Section</option>
                                    {getSectionsForClass(selectedClass).map((section) => (
                                      <option key={section.id} value={section.id}>
                                        {section.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-3 d-flex align-items-center justify-content-end">
                          <Link to="#" className="btn btn-light me-3" data-bs-dismiss="modal">
                            Cancel
                          </Link>
                          <Link to="#" className="btn btn-primary" onClick={handleApplyClick}>
                            Apply
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="dropdown mb-3">
                    <Link
                      to="#"
                      className="btn btn-outline-light bg-white dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-sort-ascending-2 me-2" />
                      Sort by
                    </Link>
                    <ul className="dropdown-menu p-3">
                      <li>
                        <Link to="#" className="dropdown-item rounded-1 active">Ascending</Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">Descending</Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">Recently Viewed</Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">Recently Added</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="card-body p-0 py-3">
              {loading ? (
                renderTableSkeleton()
              ) : filteredItems.length === 0 ? (
                <div className="text-center p-4">
                  <div className="avatar avatar-lg bg-secondary bg-opacity-10 rounded-circle mb-3">
                    <i className="ti ti-file-off fs-1 text-secondary"></i>
                  </div>
                  <h5>No {activeTab === "quiz" ? "quizzes" : "newspapers"} found</h5>
                  <p className="text-muted">
                    {!isStudent && `Click "Add ${activeTab === "quiz" ? "Quiz" : "Newspaper"}" to create your first item`}
                  </p>
                </div>
              ) : (
                <Table 
                  columns={columns} 
                  dataSource={filteredItems} 
                  rowKey="id"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <>
        {isStudent && (
          <div className="modal fade" id="take_quiz">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Take Quiz</h4>
                  <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
                    <i className="ti ti-x" />
                  </button>
                </div>
                <form onSubmit={handleQuizSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Question</label>
                      <p>{selectedQuiz?.title}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Options</label>
                      {selectedQuiz?.options?.map((option, index) => (
                        <div key={index} className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="quiz_option"
                            value={option}
                            checked={selectedOption === option}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            disabled={attemptedQuizzes.has(selectedQuiz?.id || "")}
                          />
                          <label className="form-check-label">{option}</label>
                        </div>
                      ))}
                    </div>
                    {isCorrect === false && (
                      <div className="alert alert-danger">
                        Incorrect! Correct answer: {selectedQuiz?.answer}
                      </div>
                    )}
                    {isCorrect === true && (
                      <div className="alert alert-success">
                        Correct!
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                      Close
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={attemptedQuizzes.has(selectedQuiz?.id || "")}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {!isStudent && (
          <>
            <div className="modal fade" id="add_quiz">
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Add Quiz</h4>
                    <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
                      <i className="ti ti-x" />
                    </button>
                  </div>
                  <form onSubmit={handleAddQuiz}>
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Question</label>
                            <input type="text" className="form-control" name="question" required />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Class</label>
                            <select
                              className="form-select"
                              name="classId"
                              required
                              onChange={(e) => setSelectedClass(e.target.value)}
                            >
                              <option value="">Select Class</option>
                              {classList.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                  {cls.className}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Section</label>
                            <select
                              className="form-select"
                              name="section"
                              required
                              disabled={!selectedClass}
                            >
                              <option value="">Select Section</option>
                              {getSectionsForClass(selectedClass).map((section) => (
                                <option key={section.id} value={section.id}>
                                  {section.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Options</label>
                          {quizOptions.map((option, index) => (
                            <div key={index} className="mb-3 d-flex align-items-center">
                              <input
                                type="text"
                                className="form-control me-2"
                                value={option}
                                onChange={(e) => updateQuizOption(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                              />
                              {quizOptions.length > 1 && (
                                <Link to="#" className="text-danger" onClick={() => removeQuizOption(index)}>
                                  <i className="ti ti-trash" />
                                </Link>
                              )}
                            </div>
                          ))}
                          <Link to="#" className="btn btn-primary" onClick={addQuizOption}>
                            <i className="ti ti-square-rounded-plus-filled me-2" />
                            Add Option
                          </Link>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Answer</label>
                            <select className="form-select" name="answer" required>
                              <option value="">Select Correct Answer</option>
                              {quizOptions
                                .filter((opt) => opt.trim() !== "")
                                .map((option, index) => (
                                  <option key={index} value={option}>
                                    {option}
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
                      <button type="submit" className="btn btn-primary">Add Quiz</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal fade" id="add_newspaper">
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Add Newspaper</h4>
                    <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
                      <i className="ti ti-x" />
                    </button>
                  </div>
                  <form onSubmit={handleAddNewspaper}>
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
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Class</label>
                            <select
                              className="form-select"
                              name="classId"
                              required
                              onChange={(e) => setSelectedClass(e.target.value)}
                            >
                              <option value="">Select Class</option>
                              {classList.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                  {cls.className}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Section</label>
                            <select
                              className="form-select"
                              name="section"
                              required
                              disabled={!selectedClass}
                            >
                              <option value="">Select Section</option>
                              {getSectionsForClass(selectedClass).map((section) => (
                                <option key={section.id} value={section.id}>
                                  {section.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Attachments (Photos/PDFs)</label>
                            <input
                              type="file"
                              className="form-control"
                              name="attachments"
                              accept="image/jpeg,image/png,application/pdf"
                              multiple
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                        Cancel
                      </Link>
                      <button type="submit" className="btn btn-primary">Add Newspaper</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal fade" id="edit_item">
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Edit {editItem?.type}</h4>
                    <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
                      <i className="ti ti-x" />
                    </button>
                  </div>
                  <form onSubmit={handleEditItem}>
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">{editItem?.type === "Quiz" ? "Question" : "Title"}</label>
                            <input
                              type="text"
                              className="form-control"
                              name="title"
                              defaultValue={editItem?.title}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Class</label>
                            <select
                              className="form-select"
                              name="classId"
                              defaultValue={editItem?.classId}
                              required
                              onChange={(e) => setSelectedClass(e.target.value)}
                            >
                              <option value="">Select Class</option>
                              {classList.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                  {cls.className}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Section</label>
                            <select
                              className="form-select"
                              name="section"
                              defaultValue={editItem?.section}
                              required
                              disabled={!selectedClass}
                            >
                              <option value="">Select Section</option>
                              {getSectionsForClass(selectedClass || editItem?.classId || "").map((section) => (
                                <option key={section.id} value={section.id}>
                                  {section.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        {editItem?.type === "Quiz" ? (
                          <>
                            <div className="col-md-12">
                              <label className="form-label">Options</label>
                              {quizOptions.map((option, index) => (
                                <div key={index} className="mb-3 d-flex align-items-center">
                                  <input
                                    type="text"
                                    className="form-control me-2"
                                    value={option}
                                    onChange={(e) => updateQuizOption(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                  />
                                  {quizOptions.length > 1 && (
                                    <Link to="#" className="text-danger" onClick={() => removeQuizOption(index)}>
                                      <i className="ti ti-trash" />
                                    </Link>
                                  )}
                                </div>
                              ))}
                              <Link to="#" className="btn btn-primary" onClick={addQuizOption}>
                                <i className="ti ti-square-rounded-plus-filled me-2" />
                                Add Option
                              </Link>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Answer</label>
                                <select className="form-select" name="answer" defaultValue={editItem?.answer} required>
                                  <option value="">Select Correct Answer</option>
                                  {quizOptions
                                    .filter((opt) => opt.trim() !== "")
                                    .map((option, index) => (
                                      <option key={index} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Content</label>
                                <textarea
                                  className="form-control"
                                  name="content"
                                  rows={4}
                                  defaultValue={editItem?.content}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label">Attachments (Photos/PDFs)</label>
                                <input
                                  type="file"
                                  className="form-control"
                                  name="attachments"
                                  accept="image/jpeg,image/png,application/pdf"
                                  multiple
                                />
                                <small>Current attachments: {editItem?.attachmentCount || 0}</small>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="modal-footer">
                      <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                        Cancel
                      </Link>
                      <button type="submit" className="btn btn-primary">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal fade" id="delete-modal">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <form>
                    <div className="modal-body text-center">
                      <span className="delete-icon">
                        <i className="ti ti-trash-x" />
                      </span>
                      <h4>Confirm Deletion</h4>
                      <p>
                        You want to delete this item, this can't be undone once deleted.
                      </p>
                      <div className="d-flex justify-content-center">
                        <Link to="#" className="btn btn-light me-3" data-bs-dismiss="modal">
                          Cancel
                        </Link>
                        <Link to="#" className="btn btn-danger" data-bs-dismiss="modal">
                          Yes, Delete
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default SelfEnhancement;