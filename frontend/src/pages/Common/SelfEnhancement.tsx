import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector as useReduxSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { all_routes } from "../../router/all_routes";
import useMobileDetection from "../../core/common/mobileDetection";
import { getClassByschoolId, getClassesByTeacherId } from "../../services/teacher/classServices";
import { getLessonByteacherId } from "../../services/teacher/lessonServices";
import { 
  createNewspaper, 
  createQuiz, 
  getNewspapersByClassId, 
  getQuizzesByClassId, 
  getAllQuizzes,
  getAllNewspapers,
  updateQuiz,
  deleteQuiz,
  updateNewspaper,
  deleteNewspaper,
  createQuizResult,
  submitNewspaperTranslation,
  INewspaper as IServiceNewspaper, 
  IQuiz as IServiceQuiz 
} from "../../services/teacher/selfEnhancementService";
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
  const user = useReduxSelector((state: any) => state.auth.userObj);
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
  const [addingQuiz, setAddingQuiz] = useState(false);
  const [addingNewspaper, setAddingNewspaper] = useState(false);
  const dataTheme = useReduxSelector((state: any) => state.themeSetting.dataTheme);

 
  const [selectedNewspaper, setSelectedNewspaper] = useState<SelfEnhancementItem | null>(null);
  const [translatedText, setTranslatedText] = useState<string>("");
  const [voiceFile, setVoiceFile] = useState<File | null>(null);

  const openNewspaperSubmissionModal = (newspaper: SelfEnhancementItem) => {
    setSelectedNewspaper(newspaper);
    setTranslatedText("");
    setVoiceFile(null);
  };

  const handleNewspaperSubmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNewspaper) return;

    try {
      await handleNewspaperSubmission(selectedNewspaper.id, translatedText, voiceFile || undefined);
      closeModal("submit_newspaper");
      setSelectedNewspaper(null);
      setTranslatedText("");
      setVoiceFile(null);
    } catch (error) {
      
    }
  };

  const fetchClasses = useCallback(async () => {
    if (isStudent) return;
    try {
      setLoading(true);
      const teacherId = user?.teacherId || localStorage.getItem("teacherId") || "";
      
      if (!teacherId) {
        toast.error("Teacher ID not found", { autoClose: 3000 });
        return;
      }
      
      const response = user.role === "admin"
        ? await getClassByschoolId(localStorage.getItem("schoolId") ?? "")
        : await getClassesByTeacherId(teacherId);
      
      const classesData = response?.data?.data || response?.data || [];
      
      if (!classesData || !Array.isArray(classesData)) {
        toast.error("No classes data received", { autoClose: 3000 });
        return;
      }
      
      const res = await getLessonByteacherId(teacherId);
      setTimetable(Array.isArray(res?.data) ? res.data : res?.data ? [res.data] : []);
      
      const classes = classesData.map((cls: any) => ({
        id: cls.id,
        className: cls.name || cls.className,
        Section: cls.Section?.map((sec: any) => ({
          id: sec.id,
          name: sec.name,
          classId: sec.classId,
        })) || [],
      }));
      
      setClassList(classes);
      
      if (classes.length === 0) {
        toast.warning("No classes found for this teacher", { autoClose: 3000 });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to load classes";
      toast.error(errorMessage, { autoClose: 3000 });
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
     // console.error("Error fetching student items:", error);
      toast.error("Failed to fetch quizzes and newspapers.", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchItemsForClass = useCallback(async (classId: string) => {
    if (!classId) {
      return;
    }
    
    try {
      setLoading(true);
      
      let quizResponse, newspaperResponse;
      
      try {
        quizResponse = await getQuizzesByClassId(classId);
      } catch (quizError: any) {
        const errorMessage = quizError?.response?.data?.message || quizError?.message || "Failed to fetch quizzes";
        toast.error(`Quiz Error: ${errorMessage}`, { autoClose: 3000 });
        quizResponse = { data: [] };
      }
      
      try {
        newspaperResponse = await getNewspapersByClassId(classId);
      } catch (newspaperError: any) {
        const errorMessage = newspaperError?.response?.data?.message || newspaperError?.message || "Failed to fetch newspapers";
        toast.error(`Newspaper Error: ${errorMessage}`, { autoClose: 3000 });
        newspaperResponse = { data: [] };
      }

      const quizData = Array.isArray(quizResponse.data) ? quizResponse.data : (quizResponse.data ? [quizResponse.data] : []);
      const newspaperData = Array.isArray(newspaperResponse.data) ? newspaperResponse.data : (newspaperResponse.data ? [newspaperResponse.data] : []);

      const quizzes: SelfEnhancementItem[] = quizData.map((quiz: IServiceQuiz) => ({
        id: (quiz as any)._id || (quiz as any).id || Math.random().toString(36).substr(2, 9),
        type: "Quiz",
        title: quiz.question,
        options: quiz.options,
        answer: quiz.answer,
        classId: quiz.classId,
        section: "",
        createdAt: new Date().toLocaleDateString(),
      }));

      const newspapers: SelfEnhancementItem[] = newspaperData.map((news: IServiceNewspaper) => ({
        id: (news as any)._id || (news as any).id || Math.random().toString(36).substr(2, 9),
        type: "Newspaper",
        title: news.title,
        content: news.content,
        attachmentCount: typeof news.attachments === 'string' ? 1 : (Array.isArray(news.attachments) ? news.attachments.length : (news.attachments instanceof File ? 1 : 0)),
        classId: news.classId,
        section: "",
        createdAt: new Date().toLocaleDateString(),
      }));

      const filteredItems = selectedSection
        ? [...quizzes, ...newspapers].filter((item) => item.section === selectedSection)
        : [...quizzes, ...newspapers];

      setItems(filteredItems);
      
      if (filteredItems.length === 0) {
        toast.info("No quizzes or newspapers found for this class. You can create new ones!", { autoClose: 3000 });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch items for class";
    
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [selectedSection]);


  useEffect(() => {
    if (isStudent) {
      fetchStudentItems();
    } else {
      fetchClasses();
    }
  }, [fetchClasses, fetchStudentItems, isStudent]);

 
  const fetchAllItems = useCallback(async () => {
    if (isStudent) return;
    
    try {
      setLoading(true);
      
      let allItems: SelfEnhancementItem[] = [];
      
      try {
        const allQuizzesResponse = await getAllQuizzes();
        const allQuizzesData = Array.isArray(allQuizzesResponse.data) ? allQuizzesResponse.data : (allQuizzesResponse.data ? [allQuizzesResponse.data] : []);
        
        const quizzes: SelfEnhancementItem[] = allQuizzesData.map((quiz: IServiceQuiz) => ({
          id: (quiz as any)._id || (quiz as any).id || Math.random().toString(36).substr(2, 9),
          type: "Quiz",
          title: quiz.question,
          options: quiz.options,
          answer: quiz.answer,
          classId: quiz.classId,
          section: "",
          createdAt: new Date().toLocaleDateString(),
        }));
        
        allItems.push(...quizzes);
      } catch (quizError: any) {
        toast.error("Failed to fetch all quizzes", { autoClose: 3000 });
      }
      
      try {
        const allNewspapersResponse = await getAllNewspapers();
        const allNewspapersData = Array.isArray(allNewspapersResponse.data) ? allNewspapersResponse.data : (allNewspapersResponse.data ? [allNewspapersResponse.data] : []);

        const newspapers: SelfEnhancementItem[] = allNewspapersData.map((news: IServiceNewspaper) => ({
          id: (news as any)._id || (news as any).id || Math.random().toString(36).substr(2, 9),
          type: "Newspaper",
          title: news.title,
          content: news.content,
          attachmentCount: typeof news.attachments === 'string' ? 1 : (Array.isArray(news.attachments) ? news.attachments.length : (news.attachments instanceof File ? 1 : 0)),
          classId: news.classId,
          section: "",
          createdAt: new Date().toLocaleDateString(),
        }));

        allItems.push(...newspapers);
      } catch (newspaperError: any) {
        toast.error("Failed to fetch all newspapers", { autoClose: 3000 });
      }
      
      setItems(allItems);
      
      if (allItems.length === 0) {
        toast.info("No quizzes or newspapers found. You can create new ones!", { autoClose: 3000 });
      } else {
        toast.success(`Found ${allItems.length} total items across all classes`, { autoClose: 3000 });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch items";
      
      if (errorMessage.includes("Prisma") || errorMessage.includes("database")) {
        toast.error("Database error occurred. Please try again later.", { autoClose: 3000 });
      } else {
        toast.error(errorMessage, { autoClose: 3000 });
      }
    } finally {
      setLoading(false);
    }
  }, [isStudent]);

  // Fetch items when selectedClass changes
  useEffect(() => {
    if (!isStudent) {
      if (selectedClass) {
        // If a class is selected, fetch items for that specific class
        fetchItemsForClass(selectedClass);
      } else {
        // If no class is selected, fetch all items for all classes
        fetchAllItems();
      }
    }
  }, [selectedClass, selectedSection, isStudent, fetchItemsForClass, fetchAllItems]);

  // Add useEffect to auto-set class when modals open
  useEffect(() => {
    const addQuizModal = document.getElementById('add_quiz');
    const addNewspaperModal = document.getElementById('add_newspaper');
    
    const handleModalShow = (modal: HTMLElement) => {
      // Auto-set the class field when modal opens
      const classSelect = modal.querySelector('select[name="classId"]') as HTMLSelectElement;
      if (classSelect && selectedClass) {
        classSelect.value = selectedClass;
        // Fetch subjects for the selected class if needed
        if (modal.id === 'add_quiz') {
          // For quiz modal, we might need to fetch subjects
          // This can be extended if needed
        }
      }
    };
    
    if (addQuizModal) {
      addQuizModal.addEventListener('shown.bs.modal', () => handleModalShow(addQuizModal));
    }
    
    if (addNewspaperModal) {
      addNewspaperModal.addEventListener('shown.bs.modal', () => handleModalShow(addNewspaperModal));
    }
    
    return () => {
      if (addQuizModal) {
        addQuizModal.removeEventListener('shown.bs.modal', () => handleModalShow(addQuizModal));
      }
      if (addNewspaperModal) {
        addNewspaperModal.removeEventListener('shown.bs.modal', () => handleModalShow(addNewspaperModal));
      }
    };
  }, [selectedClass]);

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
    
    // Use enhanced validation
    const validation = validateQuizForm(formData);
    if (!validation.isValid) {
      toast.error(`Validation failed: ${validation.errors.join(", ")}`, { autoClose: 5000 });
      return;
    }

    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    const classId = formData.get("classId") as string;
    const nonEmptyOptions = quizOptions.filter((opt) => opt.trim() !== "");

    setAddingQuiz(true);
    try {
      const quizData: IServiceQuiz = {
        question,
        options: nonEmptyOptions,
        answer,
        classId,
        maxScore: 100, // Default max score as required by backend
        startDate: new Date(), // Start from now as required by backend
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // End in 7 days as required by backend
      };
      
      await createQuiz(quizData);
      toast.success("Quiz added successfully!", { autoClose: 3000 });
      setQuizOptions([""]);
      
      // Refresh items after adding
      if (classId === selectedClass) {
        await fetchItemsForClass(classId);
      } else {
        // If different class was selected, switch to it
        setSelectedClass(classId);
      }
      closeModal("add_quiz");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to add quiz";
      
      if (errorMessage.includes("Validation failed")) {
        const details = error?.response?.data?.details;
        if (details && Array.isArray(details)) {
          const validationErrors = details.map((err: any) => err.message).join(", ");
          toast.error(`Validation Error: ${validationErrors}`, { autoClose: 5000 });
        } else {
          toast.error(`Quiz Error: ${errorMessage}`, { autoClose: 3000 });
        }
      } else if (errorMessage.includes("Prisma") || errorMessage.includes("database")) {
        toast.error("Database error occurred. Please try again later.", { autoClose: 3000 });
      } else {
        toast.error(`Quiz Error: ${errorMessage}`, { autoClose: 3000 });
      }
    } finally {
      setAddingQuiz(false);
    }
  };

  const handleAddNewspaper = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    // Use enhanced validation according to backend schema
    const validation = validateNewspaperForm(formData);
    if (!validation.isValid) {
      toast.error(`Validation failed: ${validation.errors.join(", ")}`, { autoClose: 5000 });
      return;
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const classId = formData.get("classId") as string;
    const attachments = formData.getAll("attachments") as File[];

    setAddingNewspaper(true);
    try {
      const userId = localStorage.getItem("userId") || "";
      if (!userId) {
        toast.error("User ID not found. Please log in again.", { autoClose: 3000 });
        return;
      }

      // Validate CUID format for userId and classId (backend requirement)
      if (!userId.match(/^c[a-z0-9]{24}$/)) {
        toast.error("Invalid user ID format", { autoClose: 3000 });
        return;
      }

      if (!classId.match(/^c[a-z0-9]{24}$/)) {
        toast.error("Invalid class ID format", { autoClose: 3000 });
        return;
      }

      // Handle attachments - backend only supports single file
      let attachmentFile: File | undefined = undefined;
      if (attachments.length > 0) {
        attachmentFile = attachments[0];
      }

      const newspaperData: IServiceNewspaper = {
        title: title.trim(),
        content: content.trim(),
        attachments: attachmentFile,
        userId,
        classId,
      };
      
      const response = await createNewspaper(newspaperData);
      
      toast.success("Newspaper added successfully!", { autoClose: 3000 });
      
      // Refresh items after adding
      if (classId === selectedClass) {
        await fetchItemsForClass(classId);
      } else {
        setSelectedClass(classId);
      }
      closeModal("add_newspaper");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to add newspaper";
      
      if (errorMessage.includes("Validation failed")) {
        const details = error?.response?.data?.details;
        if (details && Array.isArray(details)) {
          const validationErrors = details.map((err: any) => err.message).join(", ");
          toast.error(`Validation Error: ${validationErrors}`, { autoClose: 5000 });
        } else {
          toast.error(`Newspaper Error: ${errorMessage}`, { autoClose: 3000 });
        }
      } else if (errorMessage.includes("Prisma") || errorMessage.includes("database")) {
        toast.error("Database error occurred. Please try again later.", { autoClose: 3000 });
      } else {
        toast.error(`Newspaper Error: ${errorMessage}`, { autoClose: 3000 });
      }
    } finally {
      setAddingNewspaper(false);
    }
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const classId = formData.get("classId") as string;

    try {
      if (editItem.type === "Quiz") {
        const answer = formData.get("answer") as string;
        const nonEmptyOptions = quizOptions.filter((opt) => opt.trim() !== "");
        if (!title || nonEmptyOptions.length < 2 || !answer || !classId) {
          toast.error("Please provide a question, at least two options, an answer, and a class.", {
            autoClose: 3000,
          });
          return;
        }

        // Validate that the answer is one of the options
        if (!nonEmptyOptions.includes(answer)) {
          toast.error("The answer must be one of the provided options.", { autoClose: 3000 });
          return;
        }
      
        const quizId = editItem.id;
        const updateData = {
          question: title,
          options: nonEmptyOptions,
          answer,
          classId,
          maxScore: 100,
          startDate: new Date(), 
                    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Include required field
        };
        
       // console.log("Updating quiz with validated data:", updateData);
        await updateQuiz(quizId, updateData);
        
      
        if (selectedClass) {
          await fetchItemsForClass(selectedClass);
        }
      } else {
        const content = formData.get("content") as string;
        const attachments = formData.getAll("attachments") as File[];
        if (!title || !content || !classId) {
          toast.error("Please provide a title, content, and a class.", {
            autoClose: 3000,
          });
          return;
        }
        
               const newspaperId = editItem.id;
        const userId = localStorage.getItem("userId") || "";
        if (!userId) {
          toast.error("User ID not found. Please log in again.", { autoClose: 3000 });
          return;
        }

        const updateData = {
          title,
          content,
          classId,
          userId, 
        };
        
        console.log("Updating newspaper with validated data:", updateData);
        await updateNewspaper(newspaperId, updateData);
        
        // Refresh items
        if (selectedClass) {
          await fetchItemsForClass(selectedClass);
        }
      }

      setEditItem(null);
      setQuizOptions([""]);
      toast.success("Item updated successfully!", { autoClose: 3000 });
      closeModal("edit_item");
    } catch (error: any) {
      console.error("Error updating item:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update item";
      
      if (errorMessage.includes("Validation failed")) {
        const details = error?.response?.data?.details;
        if (details && Array.isArray(details)) {
          const validationErrors = details.map((err: any) => err.message).join(", ");
          toast.error(`Validation Error: ${validationErrors}`, { autoClose: 5000 });
        } else {
          toast.error(`Update Error: ${errorMessage}`, { autoClose: 3000 });
        }
      } else {
        toast.error(`Update Error: ${errorMessage}`, { autoClose: 3000 });
      }
    }
  };

  const handleDeleteItem = async (id: string, type: "Quiz" | "Newspaper") => {
    try {
      if (type === "Quiz") {
        await deleteQuiz(id);
      } else {
        await deleteNewspaper(id);
      }
      
   
      if (selectedClass) {
        await fetchItemsForClass(selectedClass);
      }
      
      toast.success("Item deleted successfully!", { autoClose: 3000 });
    } catch (error: any) {
     // console.error("Error deleting item:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete item";
      toast.error(errorMessage, { autoClose: 3000 });
    }
  };

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuiz || !selectedOption) {
      toast.error("Please select an option.", { autoClose: 3000 });
      return;
    }
    
    try {
      const isCorrectAnswer = selectedOption === selectedQuiz.answer;
      setIsCorrect(isCorrectAnswer);
      setAttemptedQuizzes((prev) => new Set(prev).add(selectedQuiz.id));
      
      
      const userId = localStorage.getItem("userId") || "";
      if (!userId) {
        toast.error("User ID not found. Please log in again.", { autoClose: 3000 });
        return;
      }

      if (!selectedQuiz.id) {
        toast.error("Quiz ID not found.", { autoClose: 3000 });
        return;
      }

      
      const quizResultData = {
        userId,
        quizId: selectedQuiz.id,
        score: isCorrectAnswer ? 100 : 0, 
      };

    //  console.log("Submitting quiz result with validated data:", quizResultData);
      await createQuizResult(quizResultData);
      
      if (isCorrectAnswer) {
        toast.success("Correct answer! Quiz result recorded.", { autoClose: 3000 });
      } else {
        toast.error(`Incorrect! Correct answer: ${selectedQuiz.answer}. Quiz result recorded.`, { autoClose: 3000 });
      }
    } catch (error: any) {
      //console.error("Error submitting quiz:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to submit quiz";
      
      if (errorMessage.includes("Validation failed")) {
        const details = error?.response?.data?.details;
        if (details && Array.isArray(details)) {
          const validationErrors = details.map((err: any) => err.message).join(", ");
          toast.error(`Validation Error: ${validationErrors}`, { autoClose: 5000 });
        } else {
          toast.error(`Quiz Submission Error: ${errorMessage}`, { autoClose: 3000 });
        }
      } else {
        toast.error(`Quiz Submission Error: ${errorMessage}`, { autoClose: 3000 });
      }
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

  // Columns for student (no class, section, action)
  const studentColumns = [
    {
      title: "Title",
      dataIndex: "title",
      render: (text: string, record: SelfEnhancementItem) => (
        <Link
          to="#"
          className="link-primary"
          data-bs-toggle="modal"
          data-bs-target={record.type === "Quiz" ? "#take_quiz" : "#submit_newspaper"}
          onClick={() => record.type === "Quiz" ? openQuizModal(record) : openNewspaperSubmissionModal(record)}
        >
          {text}
        </Link>
      ),
      sorter: (a: SelfEnhancementItem, b: SelfEnhancementItem) =>
        a.title.localeCompare(b.title, 'en-US'),
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type: string) => (
        <span className={`badge ${type === "Quiz" ? "bg-primary" : "bg-success"}`}>
          {type}
        </span>
      ),
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
      title: "Created At",
      dataIndex: "createdAt",
      sorter: (a: SelfEnhancementItem, b: SelfEnhancementItem) =>
        a.createdAt.localeCompare(b.createdAt, 'en-US'),
    },
  ];

  // Columns for non-student (admin/teacher)
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      render: (text: string, record: SelfEnhancementItem) => (
        <Link to="#" className="link-primary">{text}</Link>
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
        const classObj = classList.find((cls) => cls.id === classId);
        return classObj ? classObj.className : classId || "N/A";
      },
    },
    {
      title: "Section",
      dataIndex: "section",
      render: (sectionId: string) => {
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
      render: (_: any, record: SelfEnhancementItem) => (
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

  // Add function to handle newspaper submission for students
  const handleNewspaperSubmission = async (newspaperId: string, translatedText: string, voiceFile?: File) => {
    try {
      const studentId = localStorage.getItem("userId") || "";
      if (!studentId) {
        toast.error("Student ID not found. Please log in again.", { autoClose: 3000 });
        return;
      }

      if (!translatedText.trim()) {
        toast.error("Translated text is required.", { autoClose: 3000 });
        return;
      }

     
      const submissionData = {
        newspaperId,
        studentId,
        translatedText: translatedText.trim(),
        voice: voiceFile,
      };

      console.log("Submitting newspaper translation with validated data:", submissionData);
      await submitNewspaperTranslation(submissionData);
      
      toast.success("Newspaper submission recorded successfully!", { autoClose: 3000 });
    } catch (error: any) {
      console.error("Error submitting newspaper:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to submit newspaper";
      
      if (errorMessage.includes("Validation failed")) {
        const details = error?.response?.data?.details;
        if (details && Array.isArray(details)) {
          const validationErrors = details.map((err: any) => err.message).join(", ");
          toast.error(`Validation Error: ${validationErrors}`, { autoClose: 5000 });
        } else {
          toast.error(`Newspaper Submission Error: ${errorMessage}`, { autoClose: 3000 });
        }
      } else {
        toast.error(`Newspaper Submission Error: ${errorMessage}`, { autoClose: 3000 });
      }
    }
  };

  // Enhanced form validation function
  const validateQuizForm = (formData: FormData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    const classId = formData.get("classId") as string;
    const nonEmptyOptions = quizOptions.filter((opt) => opt.trim() !== "");

    if (!question?.trim()) {
      errors.push("Question is required");
    }

    if (nonEmptyOptions.length < 2) {
      errors.push("At least two options are required");
    }

    if (!answer?.trim()) {
      errors.push("Answer is required");
    } else if (!nonEmptyOptions.includes(answer)) {
      errors.push("Answer must be one of the provided options");
    }

    if (!classId) {
      errors.push("Class selection is required");
    }

    return { isValid: errors.length === 0, errors };
  };

  const validateNewspaperForm = (formData: FormData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const classId = formData.get("classId") as string;

    // Validate according to backend schema
    if (!title || title.trim().length === 0) {
      errors.push("Title is required and cannot be empty");
    }

    if (!content || content.trim().length === 0) {
      errors.push("Content is required and cannot be empty");
    }

    if (!classId || classId.trim().length === 0) {
      errors.push("Class selection is required");
    }

    const userId = localStorage.getItem("userId");
    if (!userId || userId.trim().length === 0) {
      errors.push("User ID not found. Please log in again");
    }

    return { isValid: errors.length === 0, errors };
  };



  return (
    <div className={dataTheme === 'dark_data_theme' ? 'dark-theme bg-dark text-light min-vh-100' : ''}>
      <ToastContainer position="top-center" autoClose={3000} theme={dataTheme === 'dark_data_theme' ? 'dark' : 'light'} />
      <div className={(isMobile || user.role === "admin" ? "page-wrapper" : "pt-4") + (dataTheme === 'dark_data_theme' ? ' bg-dark text-light' : '')}>
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className={"my-auto mb-2" + (dataTheme === 'dark_data_theme' ? ' text-light' : '')}>
              <h3 className={"page-title mb-1" + (dataTheme === 'dark_data_theme' ? ' text-light' : '')}>Self Enhancement</h3>
              <nav>
                <ol className={"breadcrumb mb-0" + (dataTheme === 'dark_data_theme' ? ' bg-dark text-light' : '')}>
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard} className={dataTheme === 'dark_data_theme' ? 'text-light' : ''}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#" className={dataTheme === 'dark_data_theme' ? 'text-light' : ''}>Self-Assessment</Link>
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
          
          <div className={dataTheme === 'dark_data_theme' ? 'card bg-dark text-light' : 'card'}>
            <div className={"card-header d-flex align-items-center justify-content-between flex-wrap pb-0" + (dataTheme === 'dark_data_theme' ? ' bg-dark text-light' : '')}>
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
                  {/* Class Selector */}
                  <div className="mb-3 me-3">
                    <label className="form-label fw-semibold me-2">Select Class:</label>
                    <select
                      className="form-select"
                      value={selectedClass}
                      onChange={(e) => {
                        const newClassId = e.target.value;
                        setSelectedClass(newClassId);
                        setSelectedSection("");
                        // The useEffect will handle the data fetching based on selectedClass
                      }}
                      style={{ minWidth: '200px' }}
                    >
                      <option value="">All Classes</option>
                      {classList.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.className}
                        </option>
                      ))}
                    </select>
                  </div>
                  
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
                                    <option value="">All Classes</option>
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
                  <div className="dropdown mb-3 me-2">
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
                  <div className="mb-3">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => {
                        setSelectedClass("");
                        setSelectedSection("");
                      }}
                      disabled={loading}
                    >
                      <i className="ti ti-refresh me-2" />
                      {loading ? "Loading..." : "Show All Classes"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className={"card-body p-0 py-3" + (dataTheme === 'dark_data_theme' ? ' bg-dark text-light' : '')}>
              {loading ? (
                renderTableSkeleton()
              ) : filteredItems.length === 0 ? (
                <div className="text-center p-4">
                  <div className="avatar avatar-lg bg-secondary bg-opacity-10 rounded-circle mb-3">
                    <i className="ti ti-file-off fs-1 text-secondary"></i>
                  </div>
                  <h5 className={dataTheme === 'dark_data_theme' ? 'text-light' : ''}>No {activeTab === "quiz" ? "quizzes" : "newspapers"} found</h5>
                  <p className={dataTheme === 'dark_data_theme' ? 'text-light' : 'text-muted'}>
                    {!isStudent && `Click "Add ${activeTab === "quiz" ? "Quiz" : "Newspaper"}" to create your first item`}
                  </p>
                </div>
              ) : (
                <Table
                  columns={isStudent ? studentColumns : columns}
                  dataSource={filteredItems}
                  rowKey="id"
                  className={dataTheme === 'dark_data_theme' ? 'table-dark' : ''}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <>
        {isStudent && (
          <div className={"modal fade" + (dataTheme === 'dark_data_theme' ? ' modal-dark' : '')} id="take_quiz">
            <div className="modal-dialog modal-dialog-centered">
              <div className={dataTheme === 'dark_data_theme' ? 'modal-content bg-dark text-light' : 'modal-content'}>
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
            <div className={"modal fade" + (dataTheme === 'dark_data_theme' ? ' modal-dark' : '')} id="add_quiz">
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className={dataTheme === 'dark_data_theme' ? 'modal-content bg-dark text-light' : 'modal-content'}>
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
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={addingQuiz}
                      >
                        {addingQuiz ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Adding...
                          </>
                        ) : (
                          "Add Quiz"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className={"modal fade" + (dataTheme === 'dark_data_theme' ? ' modal-dark' : '')} id="add_newspaper">
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className={dataTheme === 'dark_data_theme' ? 'modal-content bg-dark text-light' : 'modal-content'}>
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
                            <label className="form-label">Attachment (Photo/PDF)</label>
                            <input
                              type="file"
                              className="form-control"
                              name="attachments"
                              accept="image/jpeg,image/png,application/pdf"
                            />
                            <small className="text-muted">Only one attachment is supported. If multiple files are selected, only the first one will be uploaded.</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                        Cancel
                      </Link>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={addingNewspaper}
                      >
                        {addingNewspaper ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Adding...
                          </>
                        ) : (
                          "Add Newspaper"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className={"modal fade" + (dataTheme === 'dark_data_theme' ? ' modal-dark' : '')} id="edit_item">
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className={dataTheme === 'dark_data_theme' ? 'modal-content bg-dark text-light' : 'modal-content'}>
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
                                <label className="form-label">Attachment (Photo/PDF)</label>
                                <input
                                  type="file"
                                  className="form-control"
                                  name="attachments"
                                  accept="image/jpeg,image/png,application/pdf"
                                />
                                <small>Current attachments: {editItem?.attachmentCount || 0}. Only one attachment is supported.</small>
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
            <div className={"modal fade" + (dataTheme === 'dark_data_theme' ? ' modal-dark' : '')} id="delete-modal">
              <div className="modal-dialog modal-dialog-centered">
                <div className={dataTheme === 'dark_data_theme' ? 'modal-content bg-dark text-light' : 'modal-content'}>
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
            {/* Newspaper Submission Modal for Students */}
            {isStudent && (
              <div className={"modal fade" + (dataTheme === 'dark_data_theme' ? ' modal-dark' : '')} id="submit_newspaper">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                  <div className={dataTheme === 'dark_data_theme' ? 'modal-content bg-dark text-light' : 'modal-content'}>
                    <div className="modal-header">
                      <h4 className="modal-title">Submit Newspaper Translation</h4>
                      <button type="button" className="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <i className="ti ti-x" />
                      </button>
                    </div>
                    <form onSubmit={handleNewspaperSubmissionSubmit}>
                      <div className="modal-body">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Newspaper Title</label>
                              <p className="form-control-plaintext">{selectedNewspaper?.title}</p>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Original Content</label>
                              <div className="form-control-plaintext" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                {selectedNewspaper?.content}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Your Translation *</label>
                              <textarea
                                className="form-control"
                                rows={4}
                                value={translatedText}
                                onChange={(e) => setTranslatedText(e.target.value)}
                                placeholder="Please provide your translation of the newspaper content..."
                                required
                              />
                              <small className="text-muted">Please translate the content accurately</small>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Voice Recording (Optional)</label>
                              <input
                                type="file"
                                className="form-control"
                                accept="audio/*"
                                onChange={(e) => setVoiceFile(e.target.files?.[0] || null)}
                              />
                              <small className="text-muted">You can record your voice reading the translation</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
                          Cancel
                        </Link>
                        <button type="submit" className="btn btn-primary">
                          Submit Translation
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </>
    </div>
  );
};

export default SelfEnhancement;