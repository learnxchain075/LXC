import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, ConfigProvider, theme as antdTheme } from "antd";
import { all_routes } from "../../../../../router/all_routes";
import TooltipOption from "../../../../../core/common/tooltipOption";
import useMobileDetection from "../../../../../core/common/mobileDetection";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { closeModal } from "../../../../Common/modalclose";
import {
  createExam,
  getExamsByClass,
  createExamResults,
  getExamResults,
  CreateExamInput,
} from "../../../../../services/teacher/examallApi";
import { getAllStudentsInAclass, getClassByschoolId, getClasses, getClassesByTeacherId } from "../../../../../services/teacher/classServices";
import { getTeacherById } from "../../../../../services/admin/teacherRegistartion";
import { getSections } from '../../../../../services/teacher/sectionServices';
import { getSchoolStudents } from "../../../../../services/admin/studentRegister";
import { getSubjectByClassId } from '../../../../../services/teacher/subjectServices';
import LoadingSkeleton from "../../../../../components/LoadingSkeleton";
import { getStudentResults } from '../../../../../services/teacher/resultDeclareServices';
import { getExamById, getExams } from '../../../../../services/teacher/examServices';


// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger m-3">
          <h5>Something went wrong.</h5>
          <p>Please try refreshing the page or contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

interface ExamScheduleRecord {
  id: string;
  subject: string;
  examDate: string;
  startTime: string;
  endTime: string;
  duration: string;
  roomNo: string;
  maxMarks: string;
  minMarks: string;
  title: string;
  classId: string;
  sectionId?: string;
  subjectName?: string;
  [key: string]: any;
}
// getClassByschoolId   for admin to get all classes in a school
// getExamsByClass      to get exams by class id
//use for admin 
//getSchoolStudents; // to get all students in a school
//for uplaod result 
interface ExamResultRecord {
  id: string;
  studentId: string;
  admissionNo: string;
  studentName: string;
  img: string;
  roll: string;
  marks: { [subjectId: string]: string };
  total: string;
  percent: string;
  grade: string;
  result: string;
  classId?: string;
  sectionId?: string;
  examId: string;
}

interface StudentMarks {
  [examId: string]: string;
}

interface StudentRecord {
  id: string;
  key: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  classId: string;
  sectionId: string;
  attendance: string;
  present: boolean;
  absent: boolean;
  notes: string;
  img: string;
  marks?: StudentMarks;
}

interface TeacherData {
  lessons?: {
    id: string;
    name: string;
    classId: string;
    class?: {
      name: string;
      Section?: { id: string; name: string }[];
    };
  }[];
  [key: string]: any;
}

const ExamSchedule = ({ teacherdata }: { teacherdata?: TeacherData }) => {
  const routes = all_routes;
  const obj = useSelector((state: any) => state.auth.userObj);
  const [allExams, setAllExams] = useState<ExamScheduleRecord[]>([]);
  const [exams, setExams] = useState<ExamScheduleRecord[]>([]);
  const [results, setResults] = useState<ExamResultRecord[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamScheduleRecord | null>(null);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [newContents, setNewContents] = useState([{}]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoadingExams, setIsLoadingExams] = useState<boolean>(false);
  const [isLoadingResults, setIsLoadingResults] = useState<boolean>(false);
  const isMobile = useMobileDetection();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(false);
  const [studentSearchTerm, setStudentSearchTerm] = useState<string>("");
  const [modalClassId, setModalClassId] = useState<string>("");
  const [modalSectionId, setModalSectionId] = useState<string>("");
  const [modalSubjectId, setModalSubjectId] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isStudentListOpen, setIsStudentListOpen] = useState<boolean>(false);
  const [localTeacherData, setLocalTeacherData] = useState<TeacherData | null>(null);
  const [isLoadingTeacher, setIsLoadingTeacher] = useState<boolean>(false); 
  const [sectionOptions, setSectionOptions] = useState<any[]>([]);
  const [isLoadingSections, setIsLoadingSections] = useState<boolean>(false);
  const [sectionError, setSectionError] = useState<string>("");
  const [classes, setClasses] = useState<any[]>([]);
  const [examSearch, setExamSearch] = useState<string>("");
  const [classSubjects, setClassSubjects] = useState<any[]>([]);
  const [studentsMessage, setStudentsMessage] = useState<string>("");
  const [marksObtained, setMarksObtained] = useState<string>("");
  const [allSchoolStudents, setAllSchoolStudents] = useState<any[]>([]);
  const [selectedStudentForResults, setSelectedStudentForResults] = useState<string>("");
  const [studentSearchTermForResults, setStudentSearchTermForResults] = useState<string>("");
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState<boolean>(false);
  const [isLoadingSchoolStudents, setIsLoadingSchoolStudents] = useState<any>("");
  const [selectedExamIdForView, setSelectedExamIdForView] = useState<string>("");
  const [viewResultClassId, setViewResultClassId] = useState<string>("");
  const [viewResultStudents, setViewResultStudents] = useState<any[]>([]);
  const [viewResultStudentSearch, setViewResultStudentSearch] = useState<string>("");
  const [viewResultSelectedStudent, setViewResultSelectedStudent] = useState<any>(null);
  const [viewResultStudentResults, setViewResultStudentResults] = useState<any[]>([]);
  const [isLoadingViewResultStudents, setIsLoadingViewResultStudents] = useState(false);
  const [isLoadingViewResultStudentResults, setIsLoadingViewResultStudentResults] = useState(false);
  const [viewResultError, setViewResultError] = useState<string>("");

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const isDarkMode = dataTheme === 'dark_data_theme';

  const fetchSchoolStudentsforresult = async (classid:string) => {
    setIsLoadingSchoolStudents(true);
    try {
      const response = await getAllStudentsInAclass(classid);
      if (response.status === 200) {
        setAllSchoolStudents(response.data);
      } else {
        toast.error("Failed to fetch school students");
      }
    } catch (error) {
      toast.error("Error fetching school students");
    } finally {
      setIsLoadingSchoolStudents(false);
    }
  }
  const fetchTeacherDetails = async () => {
    try {
      setIsLoadingTeacher(true);
      const response = await getTeacherById(localStorage.getItem("teacherId") ?? "");
      if (response.status === 200) {
        setLocalTeacherData(response.data);
      } else {
        toast.error("Failed to fetch teacher details");
      }
    } catch (error) {
      toast.error("Error fetching teacher details");
    } finally {
      setIsLoadingTeacher(false);
    }
  };
 
  useEffect(() => {
    if (teacherdata) {
      setLocalTeacherData(teacherdata);
      setIsLoadingTeacher(false);
    } else {
      fetchTeacherDetails();
    }
  }, [teacherdata, obj.role]);

  // Fetch classes based on role
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        if (obj.role === "admin") {
          const res = await getClasses();
         // //console.log('[API] getClasses response:', res);
          setClasses(res.data.data || []);
        } else if (obj.role === "teacher") {
          const res = await getClassesByTeacherId(localStorage.getItem("teacherId") || "");
         // //console.log('[API] getClassesByTeacherId response:', res);
          setClasses(res.data.data || []);
        } else {
          setClasses([]);
        }
      } catch (e) {
        setClasses([]);
      }
    };
    if (obj.role === "admin" || obj.role === "teacher") fetchClasses();
  }, [obj.role, obj.id]);

  // Fetch exams for selected class (admin/teacher)
  useEffect(() => {
    const fetchExamsList = async () => {
      setIsLoadingExams(true);
      try {
        if (obj.role === "admin" || obj.role === "teacher") {
          if (!selectedClassId) {
            setAllExams([]);
            setExams([]);
            setIsLoadingExams(false);
            return;
          }
          const response = await getExamsByClass(selectedClassId);
          ////console.log('[API] getExamsByClass response:', response);
          const formattedExams = response.data.map((exam: any) => {
            const fallbackClassId = selectedClassId || obj?.classId || obj?.id || '';
            const mappedClassId = exam.classId || fallbackClassId;
            return {
              id: exam.id,
              title: exam.title,
              subjectId: exam.subjectId,
              subject: exam.subjectName || exam.subjectId || '',
              examDate: exam.startTime,
              startTime: exam.startTime,
              endTime: exam.endTime,
              duration: exam.duration ? `${exam.duration} min` : '-',
              roomNumber: exam.roomNumber,
              roomNo: exam.roomNumber ? exam.roomNumber.toString() : '-',
              totalMarks: exam.totalMarks,
              maxMarks: exam.totalMarks ? exam.totalMarks.toString() : '-',
              passMark: exam.passMark,
              minMarks: exam.passMark ? exam.passMark.toString() : '-',
              classId: mappedClassId,
              sectionId: exam.sectionId,
              subjectName: exam.subjectName || '',
            };
          });
          setAllExams(formattedExams);
          setExams(formattedExams);
        } else if (obj.role === "student") {
          setAllExams([]);
          setExams([]);
        }
      } catch (error) {
        setAllExams([]);
        setExams([]);
      } finally {
        setIsLoadingExams(false);
      }
    };
    if (obj.role === "admin" || obj.role === "teacher") fetchExamsList();
  }, [selectedClassId, obj.role]);

  const SkeletonPlaceholder = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
    <span className={`placeholder bg-secondary ${className}`} style={style} />
  );

  const classOptions = localTeacherData?.lessons?.reduce((acc: any[], lesson: any) => {
    if (!acc.find((opt) => opt.value === lesson.classId)) {
      acc.push({
        value: lesson.classId,
        label: lesson.class?.name || "Unknown Class",
      });
    }
    return acc;
  }, []) || [];

  // Use role-based class options
  const roleBasedClassOptions = obj.role === "admin" ? 
    classes.map(cls => ({
      value: cls.id,
      label: `${cls.name} ${cls.section ? `- ${cls.section}` : ""}`
    })) : 
    classOptions;

  const subjectOptions = localTeacherData?.lessons?.reduce((acc: any[], lesson: any) => {
    if (!acc.find((opt) => opt.value === lesson.id)) {
      acc.push({
        value: lesson.id,
        label: lesson.name || "Unknown Subject",
      });
    }
    return acc;
  }, []) || [];

  const roleBasedSubjectOptions = obj.role === "admin" ? 
   
    subjectOptions : 
    subjectOptions;

  const fetchSections = async (classId: string) => {
    setIsLoadingSections(true);
    setSectionError("");
    try {
      let sections = localTeacherData?.lessons
        ?.filter((lesson: any) => lesson.classId === classId)
        ?.flatMap((lesson: any) => lesson.class?.Section || []);
      if (!sections || sections.length === 0) {
        const res = await getSections(classId);
        if (res.status === 200 && Array.isArray(res.data.Section)) {
          sections = res.data.Section;
        } else {
          sections = [];
        }
      }
      setSectionOptions(
        (sections || []).map((section: any) => ({
          value: section.id,
          label: section.name || 'Unknown Section',
        }))
      );
    } catch (err) {
      setSectionError('Failed to load sections');
      setSectionOptions([]);
    } finally {
      setIsLoadingSections(false);
    }
  };

  useEffect(() => {
    if (modalClassId) {
      fetchSections(modalClassId);
    } else {
      setSectionOptions([]);
    }
  }, [modalClassId, localTeacherData]);

  // 2. Update filteredExams to include search and sort logic
  const filteredExams = exams
    .filter((exam) => {
      // Filter by section if selected
      const matchesSection = selectedSection ? exam.sectionId === selectedSection : true;
      // Search by exam name or subject
      const matchesSearch = exam.title.toLowerCase().includes(examSearch.toLowerCase()) ||
        (exam.subjectName || '').toLowerCase().includes(examSearch.toLowerCase());
      return matchesSection && matchesSearch;
    })
    .sort((a, b) => {
      // Sort by exam name (A-Z or Z-A)
      if (sortOrder === 'asc') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

  const modalFilteredExams = allExams.filter((exam) => {
    const matchesClass = modalClassId ? exam.classId === modalClassId : true;
    return matchesClass;
  });

  const filteredStudents = students.filter((student) =>
    studentSearchTerm
      ? student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        student.admissionNo.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(studentSearchTerm.toLowerCase())
      : true
  );

  useEffect(() => {
    if (selectedClassId) {
      fetchExams();
      fetchResults();
      fetchStudents(selectedClassId);
    } else {
      setAllExams([]);
      setExams([]);
      setResults([]);
      setStudents([]);
    }
  }, [selectedClassId]);

  useEffect(() => {
    setExams(
      allExams.filter((exam) =>
        selectedSection ? exam.sectionId === selectedSection : true
      )
    );
  }, [selectedSection, allExams]);

  const fetchExams = async (classId: string = selectedClassId) => {
    if (!classId) {
      toast.error("Please select a class");
      return;
    }
    setIsLoadingExams(true);
    const toastId = toast.loading("Fetching exams...");
    try {
      const response = await getExamsByClass(classId);
      const formattedExams = response.data.map((exam: any) => {
        const fallbackClassId = classId || selectedClassId || obj?.classId || obj?.id || '';
        const mappedClassId = exam.classId || fallbackClassId;
        return {
          id: exam.id,
          title: exam.title,
          subjectId: exam.subjectId,
          subject: exam.subjectName || exam.subjectId || '',
          examDate: exam.startTime,
          startTime: exam.startTime,
          endTime: exam.endTime,
          duration: exam.duration ? `${exam.duration} min` : '-',
          roomNumber: exam.roomNumber,
          roomNo: exam.roomNumber ? exam.roomNumber.toString() : '-',
          totalMarks: exam.totalMarks,
          maxMarks: exam.totalMarks ? exam.totalMarks.toString() : '-',
          passMark: exam.passMark,
          minMarks: exam.passMark ? exam.passMark.toString() : '-',
          classId: mappedClassId,
          sectionId: exam.sectionId,
          subjectName: exam.subjectName || '',
        };
      });
      setAllExams(formattedExams);
      if (classId === selectedClassId) {
        setExams(formattedExams);
      }
      toast.update(toastId, { render: "Exams loaded successfully", type: "success", isLoading: false, autoClose: 3000 });
    } catch (error) {
      toast.update(toastId, { render: "Failed to fetch exams", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setIsLoadingExams(false);
    }
  };

  const fetchResults = async () => {
    if (!selectedClassId) {
      toast.error("Please select a class");
      return;
    }
    setIsLoadingResults(true);
    const toastId = toast.loading("Fetching results...");
    try {
      // Fetch all results
      const response = await getExamResults();
      // Fetch students for the selected class
      const studentsRes = await getAllStudentsInAclass(selectedClassId);
      let studentsArray: any[] = [];
      if (studentsRes?.data && typeof studentsRes.data === 'object' && !Array.isArray(studentsRes.data) && 'students' in studentsRes.data && Array.isArray((studentsRes.data as any).students)) {
        studentsArray = (studentsRes.data as any).students;
      } else if (Array.isArray(studentsRes?.data)) {
        studentsArray = studentsRes.data;
      }
      const studentsMap = Object.fromEntries(studentsArray.map((s: any) => [s.id, s]));
      // Format results
      const formattedResults = (response.data || []).filter((r: any) => r.examId && r.studentId).map((r: any) => {
        const student = studentsMap[r.studentId] || {};
        return {
          id: r.id,
          studentId: r.studentId,
          admissionNo: student.admissionNo || r.studentId,
          studentName: student.user?.name || r.studentId,
          img: student.user?.profilePic || "",
          roll: student.rollNo || "",
          marks: { [r.examId]: r.score },
          total: r.score?.toString() || "",
          percent: "",
          grade: "",
          result: r.score !== undefined ? (r.score >= 35 ? "Pass" : "Fail") : "",
          classId: student.classId || "",
          sectionId: student.sectionId || "",
          examId: r.examId,
        };
      });
      setResults(formattedResults);
      toast.update(toastId, { render: "Results loaded successfully", type: "success", isLoading: false, autoClose: 3000 });
    } catch (error) {
      setResults([]);
      toast.update(toastId, { render: "Failed to fetch results", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setIsLoadingResults(false);
    }
  };

  const fetchSubjectsForClass = async (classId: string) => {
    if (!classId) {
      setClassSubjects([]);
      ////console.log('[fetchSubjectsForClass] No classId provided');
      return;
    }
    try {
      ////console.log('[fetchSubjectsForClass] Fetching subjects for classId:', classId);
      const res = await getSubjectByClassId(classId);
      ////console.log('[API] getSubjectByClassId response:', res);
      const arr = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
      setClassSubjects(arr);
      ////console.log('[fetchSubjectsForClass] Subjects fetched:', arr);
    } catch (e) {
      setClassSubjects([]);
      ////console.log('[fetchSubjectsForClass] Error fetching subjects:', e);
    }
  };

  const fetchStudents = async (classId: string, sectionId?: string) => {
    if (!classId) return;
    setIsLoadingStudents(true);
    try {
      const response = await getAllStudentsInAclass(classId);
      ////console.log('[API] getAllStudentsInAclass response:', response);
      let studentsArray: any[] = [];
      if (response?.data && typeof response.data === 'object' && !Array.isArray(response.data) && 'students' in response.data && Array.isArray((response.data as any).students)) {
        studentsArray = (response.data as any).students;
      } else if (Array.isArray(response?.data)) {
        studentsArray = response.data;
      }
      let formattedStudents = studentsArray
        ?.filter((student: any) => student.classId === classId)
        ?.map((student: any) => ({
          id: student.id,
          key: student.id,
          admissionNo: student.admissionNo || `A${student.id}`,
          rollNo: student.rollNo || `R${student.id}`,
          name: student?.user?.name || "Unknown",
          classId: classOptions.find((opt) => opt.value === classId)?.label || "",
          sectionId: sectionOptions.find((opt) => opt.value === student.sectionId)?.label || "",
          attendance: student.attendance || "Present",
          present: student.attendance === "Present",
          absent: student.attendance === "Absent",
          notes: student.notes || "",
          img: student?.user?.profilePic || "",
        })) || [];
      setStudents(formattedStudents);
      setStudentsMessage(formattedStudents.length === 0 ? "No students found for this class/section." : "");
    } catch (error) {
      ////console.error("Error fetching students:", error);
      setStudents([]);
      setStudentsMessage("Failed to fetch students. Please try again later.");
    } finally {
      setIsLoadingStudents(false);
    }
  };

  // Function to fetch all students for a class (for upload result modal)
  const fetchAllStudentsForClass = async (classId: string) => {
    if (!classId) return;
    setIsLoadingStudents(true);
    try {
      const response = await getAllStudentsInAclass(classId);
      let studentsArray: any[] = [];
      if (response?.data && typeof response.data === 'object' && !Array.isArray(response.data) && 'students' in response.data && Array.isArray((response.data as any).students)) {
        studentsArray = (response.data as any).students;
      } else if (Array.isArray(response?.data)) {
        studentsArray = response.data;
      }
      let formattedStudents = studentsArray
        ?.filter((student: any) => student.classId === classId)
        ?.map((student: any) => ({
          id: student.id,
          key: student.id,
          admissionNo: student.admissionNo || `A${student.id}`,
          rollNo: student.rollNo || `R${student.id}`,
          name: student?.user?.name || "Unknown",
          classId: classOptions.find((opt) => opt.value === classId)?.label || "",
          sectionId: sectionOptions.find((opt) => opt.value === student.sectionId)?.label || "",
          attendance: student.attendance || "Present",
          present: student.attendance === "Present",
          absent: student.attendance === "Absent",
          notes: student.notes || "",
          img: student?.user?.profilePic || "",
        })) || [];
      setStudents(formattedStudents);
      setStudentsMessage(formattedStudents.length === 0 ? "No students found for this class." : "");
    } catch (error) {
      setStudents([]);
      setStudentsMessage("Failed to fetch students. Please try again later.");
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handleApplyClick = () => {
    if (dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  };

  const handleReset = () => {
    setSelectedClassId("");
    setSelectedSection("");
    setSearchTerm("");
    setStudentSearchTerm("");
    setModalClassId("");
    setModalSectionId("");
    setModalSubjectId("");
    setSelectedStudentId("");
    setAllExams([]);
    setExams([]);
    setResults([]);
    setStudents([]);
    setIsStudentListOpen(false);
  };

  const addNewContent = () => {
    setNewContents([...newContents, {}]);
  };

  const removeContent = (index: number) => {
    setNewContents(newContents.filter((_, i) => i !== index));
  };

  const handleAddExam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    // Get start and end times
    const startTime = new Date(formData.get("startTime") as string);
    const endTime = new Date(formData.get("endTime") as string);
    
    // Calculate duration automatically in minutes
    const durationInMs = endTime.getTime() - startTime.getTime();
    const durationInMinutes = Math.round(durationInMs / (1000 * 60));
    
    // Get classId from form or use selectedClassId as fallback
    const classId = formData.get("class") as string || formData.get("classId") as string || selectedClassId;
    
    const examData: CreateExamInput = {
      passMark: Number(formData.get("minMarks")),
      totalMarks: Number(formData.get("maxMarks")),
      duration: durationInMinutes, // Auto-calculated
      roomNumber: Number(formData.get("roomNo")),
      title: formData.get("examName") as string,
      startTime: startTime,
      endTime: endTime,
      subjectId: formData.get("subject") as string,
      classId: classId,
    };

    if (!examData.classId || !examData.subjectId || !examData.title) {
      toast.error("Class, subject, and exam name are required");
      return;
    }

    if (durationInMinutes <= 0) {
      toast.error("End time must be after start time");
      return;
    }

    const toastId = toast.loading("Creating exam...");
    try {
      const response = await createExam(examData);
      if (response.status === 200 || response.status === 201) {
        // Show toast at center
        toast.success("Exam created", { position: "top-center", autoClose: 3000 });
        // Refresh the exam list without reloading the page
        fetchExams(examData.classId);
        closeModal("add_exam_schedule");
      } else {
        toast.error("Failed to create exam");
      }
    } catch (error) {
      toast.error("Failed to create exam");
    }
  };

  const handleEditExam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedExam) {
      toast.error("No exam selected for editing");
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const examData: CreateExamInput = {
      passMark: Number(formData.get("minMarks")),
      totalMarks: Number(formData.get("maxMarks")),
      duration: Number(formData.get("duration")),
      roomNumber: Number(formData.get("roomNo")),
      title: formData.get("examName") as string,
      startTime: new Date(formData.get("startTime") as string),
      endTime: new Date(formData.get("endTime") as string),
      subjectId: formData.get("subject") as string,
      classId: formData.get("class") as string,
    };

    if (!examData.classId || !examData.subjectId || !examData.title) {
      toast.error("Class, subject, and exam name are required");
      return;
    }

    const toastId = toast.loading("Updating exam...");
    try {
      toast.update(toastId, { render: "Coming soon", type: "success", isLoading: false, autoClose: 3000 });
      fetchExams();
      setSelectedExam(null);
      closeModal("edit_exam_schedule");
    } catch (error) {
      toast.update(toastId, { render: "Failed to update exam", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleDeleteExam = async () => {
    if (!selectedExam) {
      toast.error("No exam selected for deletion");
      return;
    }

    const toastId = toast.loading("Deleting exam...");
    try {
      toast.update(toastId, { render: "Coming soon!", type: "success", isLoading: false, autoClose: 3000 });
      fetchExams();
      setSelectedExam(null);
      closeModal("delete-modal");
    } catch (error) {
      toast.update(toastId, { render: "Failed to delete exam", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const handleUploadResult = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const examId = (e.target as any).examId?.value;
    if (!examId) {
      toast.error("Please select an exam first");
      return;
    }
    if (!selectedStudentId) {
      toast.error("Please select a student");
      return;
    }
    if (!marksObtained || isNaN(Number(marksObtained))) {
      toast.error("Please enter valid score");
      return;
    }
    const score = Number(marksObtained);
    if (score < 0 || score > parseFloat(allExams.find(e => e.id === examId)?.maxMarks || "0")) {
      toast.error(`Score must be between 0 and ${allExams.find(e => e.id === examId)?.maxMarks}`);
      return;
    }
    // Payload must match: { studentId: string, examId: string, score: number }
    try {
      setIsLoadingResults(true);
      const response = await createExamResults({
        studentId: selectedStudentId,
        examId: examId,
        score: score
      });
      if (response.status === 200 || response.status === 201) {
        toast.success("Result uploaded successfully");
        setSelectedStudentId("");
        setMarksObtained("");
        setStudentSearchTerm("");
        setStudents([]);
        setSelectedExam(null);
        // Keep the class - don't clear selectedClassId
        // Keep the class - don't clear selectedSection
        setModalSectionId("");
        setModalSubjectId("");
        setIsStudentListOpen(false);
        closeModal("upload_result");
        fetchResults();
      } else {
        throw new Error("Failed to upload result");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to upload result. Please try again.");
    } finally {
      setIsLoadingResults(false);
    }
  };

  const handleStudentSelect = (student: StudentRecord) => {
    setSelectedStudentId(student.id);
    setStudentSearchTerm(`${student.name} (${student.admissionNo})`);
    setIsStudentListOpen(false);
    setMarksObtained("");
  };

  const formatDate = (iso: string) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  };
  const formatTime = (iso: string) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '-' : d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Check if any exam has section data
  const hasSectionData = exams.some(exam => exam.sectionId);

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "title",
      key: "title",
      render: (text: string) => text || '-',
    },
    {
      title: "Subject",
      dataIndex: "subjectName",
      key: "subjectName",
      render: (text: string, record: any) => (
        <span>{text || record.subject || subjectOptions.find((sub) => sub.value === record.subjectId)?.label || subjectOptions.find((sub) => sub.id === record.subjectId)?.name || record.subjectId || '-'}</span>
      ),
    },
    {
      title: "Exam Date",
      dataIndex: "startTime",
      key: "examDate",
      render: formatDate,
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: formatTime,
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: formatTime,
    },
    {
      title: "Duration (min)",
      dataIndex: "duration",
      key: "duration",
      render: (text: any) => (text !== undefined && text !== null ? text : '-'),
    },
    {
      title: "Room No",
      dataIndex: "roomNumber",
      key: "roomNumber",
      render: (text: any) => (text !== undefined && text !== null ? text : '-'),
    },
    {
      title: "Max Marks",
      dataIndex: "totalMarks",
      key: "totalMarks",
      render: (text: any) => (text !== undefined && text !== null ? text : '-'),
    },
    {
      title: "Min Marks",
      dataIndex: "passMark",
      key: "passMark",
      render: (text: any) => (text !== undefined && text !== null ? text : '-'),
    },
    // Only show section column if there's section data
    ...(hasSectionData ? [{
      title: "Section",
      dataIndex: "sectionId",
      key: "sectionId",
      render: (text: string) => (
        <span>{sectionOptions.find((sec) => sec.value === text)?.label || '-'}</span>
      ),
    }] : []),
  ];

  const resultColumns = [
    {
      title: "Admission No",
      dataIndex: "admissionNo",
      render: (text: string) => <Link to="#" className="link-primary">{text}</Link>,
      sorter: (a: ExamResultRecord, b: ExamResultRecord) => a.admissionNo.length - b.admissionNo.length,
    },
    {
      title: "Student Name",
      dataIndex: "studentName",
      render: (text: string, record: ExamResultRecord) => (
        <div className="d-flex align-items-center">
          <Link to={routes.studentDetail} className="avatar avatar-md">
            <img src={record.img} className="img-fluid rounded-circle" alt="img" />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to={routes.studentDetail}>{text}</Link>
            </p>
            <span className="fs-12">{record.roll}</span>
          </div>
        </div>
      ),
      sorter: (a: ExamResultRecord, b: ExamResultRecord) => a.studentName.length - b.studentName.length,
    },
    ...subjectOptions.map((subject) => ({
      title: subject.label,
      dataIndex: "marks",
      render: (marks: { [key: string]: string }) => {
        const mark = marks[subject.value];
        return mark && parseInt(mark) < 35 ? (
          <span className="text-danger">{mark}</span>
        ) : (
          <span className="attendance-range">{mark || "-"}</span>
        );
      },
      sorter: (a: ExamResultRecord, b: ExamResultRecord) => {
        const markA = a.marks[subject.value] || "0";
        const markB = b.marks[subject.value] || "0";
        return markA.length - markB.length;
      },
    })),
    {
      title: "Total",
      dataIndex: "total",
      sorter: (a: ExamResultRecord, b: ExamResultRecord) => a.total.length - b.total.length,
    },
    {
      title: "Percent",
      dataIndex: "percent",
      sorter: (a: ExamResultRecord, b: ExamResultRecord) => a.percent.length - b.percent.length,
    },
    {
      title: "Grade",
      dataIndex: "grade",
      sorter: (a: ExamResultRecord, b: ExamResultRecord) => a.grade.length - b.grade.length,
    },
    {
      title: "Result",
      dataIndex: "result",
      render: (text: string) => (
        <span className={`badge badge-soft-${text === "Pass" ? "success" : "danger"} d-inline-flex align-items-center`}>
          <i className="ti ti-circle-filled fs-5 me-1"></i>
          {text}
        </span>
      ),
      sorter: (a: ExamResultRecord, b: ExamResultRecord) => a.result.length - b.result.length,
    },
  ];

  const filteredResults = results.filter((result) => {
    const matchesClass = selectedClassId ? (result as any).classId === selectedClassId : true;
    const matchesSection = selectedSection ? (result as any).sectionId === selectedSection : true;
    const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSection && matchesSearch;
  });

  // Helper: Filter subjects by selected class
  const getSubjectsForClass = (classId: string) => {
    if (!classId) return [];
    if (obj.role === "admin") {
      // For admin, filter all subjects by classId if possible
      return subjectOptions.filter((sub: any) => sub.classId === classId);
    } else {
      // For teacher, filter their subjects by classId
      return subjectOptions.filter((sub: any) => sub.classId === classId);
    }
  };

  // Helper: Get unique sections for a class
  const getSectionsForClass = (classId: string) => {
    if (!classId) return [];
    // Filter lessons for the selected class and get unique sections
    const lessons = localTeacherData?.lessons?.filter((lesson: any) => lesson.classId === classId) || [];
    const allSections = lessons.flatMap((lesson: any) => lesson.class?.Section || []);
    // Unique by section id
    const uniqueSections = Array.from(new Map(allSections.map((sec: any) => [sec.id, sec])).values());
    return uniqueSections.map((section: any) => ({ value: section.id, label: section.name || 'Unknown Section' }));
  };

  // Add function to fetch all school students
  const fetchAllSchoolStudents = async () => {
    try {
      const response = await getSchoolStudents(localStorage.getItem("schoolId") || "");
      setAllSchoolStudents(response.data || []);
    } catch (error) {
      setAllSchoolStudents([]);
    }
  };

  // Filter students for search dropdown
  const filteredSchoolStudents = allSchoolStudents.filter((student) =>
    studentSearchTermForResults
      ? student.user?.name?.toLowerCase().includes(studentSearchTermForResults.toLowerCase()) ||
        student.admissionNo?.toLowerCase().includes(studentSearchTermForResults.toLowerCase()) ||
        student.rollNo?.toLowerCase().includes(studentSearchTermForResults.toLowerCase())
      : true
  );

  // Filter results for selected student
  const filteredResultsForStudent = results.filter((result) => {
    const matchesStudent = selectedStudentForResults ? result.studentId === selectedStudentForResults : true;
    const matchesClass = selectedClassId ? (result as any).classId === selectedClassId : true;
    const matchesSection = selectedSection ? (result as any).sectionId === selectedSection : true;
    const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStudent && matchesClass && matchesSection && matchesSearch;
  });

  // Handle student selection for results
  const handleStudentSelectForResults = (student: any) => {
    setSelectedStudentForResults(student.id);
    setStudentSearchTermForResults(`${student.user?.name || 'Unknown'} (${student.admissionNo || student.rollNo})`);
    setIsStudentDropdownOpen(false);
  };

  // Add click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.student-search-dropdown')) {
        setIsStudentDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update useEffect to fetch school students when modal opens
  useEffect(() => {
    const viewResultModal = document.getElementById('view_exam_results');
    if (!viewResultModal) return;
    const handleShow = () => {
      fetchResults();
      fetchAllSchoolStudents();
    };
    const handleHide = () => {
      setSelectedClassId("");
      setSelectedSection("");
      setSearchTerm("");
      setResults([]);
      setSelectedStudentForResults("");
      setStudentSearchTermForResults("");
      setIsStudentDropdownOpen(false);
    };
    viewResultModal.addEventListener('show.bs.modal', handleShow);
    viewResultModal.addEventListener('hidden.bs.modal', handleHide);
    return () => {
      viewResultModal.removeEventListener('show.bs.modal', handleShow);
      viewResultModal.removeEventListener('hidden.bs.modal', handleHide);
    };
  }, []);

  // Add useEffect for upload result modal to auto-fetch data when class is selected
  useEffect(() => {
    const uploadResultModal = document.getElementById('upload_result');
    if (!uploadResultModal) return;
    
    const handleShow = () => {
      if (modalClassId) {
        // Auto-fetch sections, subjects, and exams for the selected class
        setSectionOptions(getSectionsForClass(modalClassId));
        fetchSubjectsForClass(modalClassId);
        
        // Check if we need to fetch exams for this class
        const classExams = allExams.filter(exam => exam.classId === modalClassId);
        if (classExams.length === 0) {
          // Fetch exams for this class if not already loaded
          fetchExams(modalClassId);
        }
        
        // Fetch all students for this class
        fetchAllStudentsForClass(modalClassId);
      }
    };
    
    const handleHide = () => {
      // Reset modal state when modal closes
      setModalSectionId("");
      setModalSubjectId("");
      setStudentSearchTerm("");
      setSelectedStudentId("");
      setIsStudentListOpen(false);
      setStudents([]);
      setMarksObtained("");
    };
    
    uploadResultModal.addEventListener('show.bs.modal', handleShow);
    uploadResultModal.addEventListener('hidden.bs.modal', handleHide);
    
    return () => {
      uploadResultModal.removeEventListener('show.bs.modal', handleShow);
      uploadResultModal.removeEventListener('hidden.bs.modal', handleHide);
    };
  }, [modalClassId, allExams]);

  // Handler to fetch students when class changes
  const handleViewResultClassChange = async (classId: string) => {
    setViewResultClassId(classId);
    setViewResultStudents([]);
    setViewResultStudentSearch("");
    setViewResultSelectedStudent(null);
    setViewResultStudentResults([]);
    setIsLoadingViewResultStudents(true);
    setViewResultError("");
    try {
      const res = await getAllStudentsInAclass(classId);
      let studentsArray: any[] = [];
      if (res?.data && typeof res.data === 'object' && !Array.isArray(res.data) && 'students' in res.data && Array.isArray((res.data as any).students)) {
        studentsArray = (res.data as any).students;
      } else if (Array.isArray(res?.data)) {
        studentsArray = res.data;
      }
      setViewResultStudents(studentsArray);
    } catch (e) {
      setViewResultError('Failed to fetch students.');
      setViewResultStudents([]);
    } finally {
      setIsLoadingViewResultStudents(false);
    }
  };

  // Handler to fetch student results when a student is selected
  const handleViewResultStudentClick = async (student: any) => {
    setViewResultSelectedStudent(student);
    setViewResultStudentResults([]);
    setIsLoadingViewResultStudentResults(true);
    setViewResultError("");
    try {
      // Fetch all results for the student
      const res = await getStudentResults(viewResultClassId, student.id);
      const results = res.data || [];
      // Fetch all exams for the class to map examId to title
      let examMap: Record<string, string> = {};
      try {
        const examsRes = await getExams(viewResultClassId);
        if (Array.isArray(examsRes.data)) {
          examMap = examsRes.data.reduce((acc: Record<string, string>, exam: any) => {
            acc[exam.id] = exam.title;
            return acc;
          }, {});
        }
      } catch (e) {
        // If fetching exams fails, fallback to empty map
        examMap = {};
      }
      // Attach exam title to each result
      const resultsWithTitles = results.map((result: any) => ({
        ...result,
        examTitle: examMap[result.examId] || '-',
      }));
      setViewResultStudentResults(resultsWithTitles);
    } catch (e) {
      setViewResultError('Failed to fetch student results.');
      setViewResultStudentResults([]);
    } finally {
      setIsLoadingViewResultStudentResults(false);
    }
  };

  // Add useEffect to auto-set class when modal opens
  useEffect(() => {
    const modal = document.getElementById('add_exam_schedule');
    if (modal) {
      const handleModalShow = () => {
        ////console.log('[Add Exam Modal] Opened. selectedClassId:', selectedClassId);
        if (selectedClassId) {
          fetchSubjectsForClass(selectedClassId);
          //console.log('[Add Exam Modal] Called fetchSubjectsForClass with:', selectedClassId);
        }
      };
      
      modal.addEventListener('shown.bs.modal', handleModalShow);
      return () => {
        modal.removeEventListener('shown.bs.modal', handleModalShow);
      };
    }
  }, [selectedClassId]);

  if (isLoadingExams) {
    return (
      <div className="container py-5">
        <LoadingSkeleton lines={8} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container-fluid">
        <ToastContainer position="top-center" autoClose={3000} />
        <div className={isMobile || obj.role === "admin" ? "page-wrapper" : "p-3"}>
          <div className="content">
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3 tw-py-2">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1 tw-text-xl sm:tw-text-2xl lg:tw-text-3xl">Exam Schedule</h3>
              </div>
              {selectedClassId && (
                <div className="my-auto mb-2">
                  <Link
                    to="#"
                    className="btn btn-outline-light bg-white tw-text-sm"
                    onClick={() => handleReset()}
                  >
                    <i className="ti ti-arrow-left me-2" />
                    Back to Classes
                  </Link>
                </div>
              )}
            </div>

            {/* Class selection for admin/teacher */}
            {(obj.role === "admin" || obj.role === "teacher") && (
              <div className="mb-3">
                <label className="form-label">Select Class</label>
                <select
                  className="form-control"
                  value={selectedClassId}
                  onChange={e => {
                    setSelectedClassId(e.target.value);
                   
                    setSelectedSection("");
                  }}
                  disabled={isLoadingExams}
                >
                  <option value="">Select Class</option>
                  {roleBasedClassOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Exam search and dropdown for admin/teacher */}
            {(obj.role === "admin" || obj.role === "teacher") && selectedClassId && (
              <div className="mb-3">
                <label className="form-label">Search Exam</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Search by exam name or subject"
                  value={examSearch}
                  onChange={e => setExamSearch(e.target.value)}
                />
              </div>
            )}

            {/* Student: no dropdown, just schedule */}

            {/* Action buttons for admin/teacher */}
            {(obj.role === "admin" || obj.role === "teacher") && selectedClassId && (
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap tw-mb-3">
                {/* <TooltipOption /> */}
                <div className="mb-2 me-2">
                  <Link
                    to="#"
                    className="btn btn-primary tw-text-sm sm:tw-text-base"
                    data-bs-toggle="modal"
                    data-bs-target="#add_exam_schedule"
                  >
                    <i className="ti ti-square-rounded-plus-filled me-2" />
                    Add Exam Schedule
                  </Link>
                </div>
                <div className="mb-2 me-2">
                  <Link
                    to="#"
                    className="btn btn-primary tw-text-sm sm:tw-text-base"
                    data-bs-toggle="modal"
                    data-bs-target="#upload_result"
                    onClick={() => {
                      setModalClassId(selectedClassId);
                      // Auto-fetch sections, subjects, and exams for the selected class
                      if (selectedClassId) {
                        setSectionOptions(getSectionsForClass(selectedClassId));
                        fetchSubjectsForClass(selectedClassId);
                        
                        // Check if we need to fetch exams for this class
                        const classExams = allExams.filter(exam => exam.classId === selectedClassId);
                        if (classExams.length === 0) {
                          // Fetch exams for this class if not already loaded
                          fetchExams(selectedClassId);
                        }
                        
                        // Fetch all students for this class
                        fetchAllStudentsForClass(selectedClassId);
                      }
                    }}
                  >
                    <i className="ti ti-upload me-2" />
                    Upload Result
                  </Link>
                </div>
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary tw-text-sm sm:tw-text-base"
                    data-bs-toggle="modal"
                    data-bs-target="#view_exam_results"
                  >
                    <i className="ti ti-eye me-2" />
                    View Exam Results
                  </Link>
                </div>
              </div>
            )}

            <div className="card tw-border tw-border-gray-200 tw-rounded-lg">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0 tw-p-4">
                <h4 className="mb-3 tw-text-lg sm:tw-text-xl">Exam Schedule</h4>
                <div className="d-flex align-items-center flex-wrap">
                  {/* <div className="dropdown mb-3 me-2">
                    <Link
                      to="#"
                      className="btn btn-outline-light bg-white dropdown-toggle tw-text-sm"
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
                          <div className="row">
                            <div className="col-md-12">
                              <div className="mb-3">
                                <label className="form-label tw-text-sm">Class</label>
                                {isLoadingTeacher ? (
                                  <SkeletonPlaceholder className="col-12" style={{ height: "2.5rem" }} />
                                ) : (
                                  <select
                                    className="form-control tw-text-sm"
                                    value={selectedClassId}
                                    onChange={e => {
                                      setSelectedClassId(e.target.value);
                                      // Only fetch exams for the new class, do not reset all state
                                      // No need to clear allExams, exams, results, students, etc. here
                                      // Section will be reset if class changes
                                      setSelectedSection("");
                                    }}
                                    disabled={isLoadingExams}
                                  >
                                    <option value="">Select Class</option>
                                    {roleBasedClassOptions.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>
                            </div>
                            {hasSectionData && (
                              <div className="col-md-12">
                                <div className="mb-3">
                                  <label className="form-label tw-text-sm">Section</label>
                                  {isLoadingSections ? (
                                    <SkeletonPlaceholder className="col-12" style={{ height: '2.5rem' }} />
                                  ) : sectionError ? (
                                    <div className="text-danger">{sectionError}</div>
                                  ) : (
                                    <select
                                      className="form-control tw-text-sm"
                                      value={selectedSection}
                                      onChange={e => setSelectedSection(e.target.value)}
                                      disabled={!selectedClassId || isLoadingSections}
                                    >
                                      <option value="">Select Section</option>
                                      {sectionOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="p-3 d-flex align-items-center justify-content-end">
                          <Link to="#" className="btn btn-light me-3 tw-text-sm" onClick={handleReset}>
                            Reset
                          </Link>
                          <Link to="#" className="btn btn-primary tw-text-sm" onClick={handleApplyClick}>
                            Apply
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div> */}
                  <div className="dropdown mb-3">
                    <Link
                      to="#"
                      className="btn btn-outline-light bg-white dropdown-toggle tw-text-sm"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-sort-ascending-2 me-2" />
                      Sort by A-Z
                    </Link>
                    <ul className="dropdown-menu p-3">
                      <li>
                        <Link to="#" className={`dropdown-item rounded-1 tw-text-sm${sortOrder === 'asc' ? ' active' : ''}`} onClick={() => setSortOrder('asc')}>
                          Ascending
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className={`dropdown-item rounded-1 tw-text-sm${sortOrder === 'desc' ? ' active' : ''}`} onClick={() => setSortOrder('desc')}>
                          Descending
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1 tw-text-sm" disabled>
                          Recently Viewed
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1 tw-text-sm" disabled>
                          Recently Added
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="mb-3">
                    <Link
                      to="#"
                      className="btn btn-outline-light bg-white tw-text-sm"
                      onClick={() => {
                        fetchExams();
                        fetchResults();
                        toast.info("Data refreshed");
                      }}
                    >
                      <i className="ti ti-refresh me-2" />
                      Refresh
                    </Link>
                  </div>
                </div>
              </div>
              <div className="card-body p-0 py-3">
                {isLoadingExams || isLoadingTeacher ? (
                  <div className="p-4">
                    <table className="table">
                      <thead>
                        <tr>
                          {columns.map((_, index) => (
                            <th key={index}>
                              <div className="placeholder-glow">
                                <SkeletonPlaceholder className="col-8" />
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[...Array(3)].map((_, i) => (
                          <tr key={i}>
                            {columns.map((_, j) => (
                              <td key={j}>
                                <div className="placeholder-glow">
                                  <SkeletonPlaceholder className="col-12" />
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : filteredExams.length === 0 ? (
                  <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '150px' }}>
                    <p className="text-center text-muted mb-2" style={{ fontSize: '1.1rem' }}>No exams available</p>
                    <p className="text-center text-secondary" style={{ fontSize: '0.95rem' }}>Please choose a class</p>
                  </div>
                ) : (
                  <ConfigProvider
                    theme={{
                      algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                    }}
                  >
                    <Table
                      columns={columns}
                      dataSource={filteredExams}
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                      loading={isLoadingExams || isLoadingTeacher}
                    />
                  </ConfigProvider>
                )}
              </div>
            </div>
          </div>
        </div>

        {selectedClassId && (
          <>
            <div className="modal fade" id="add_exam_schedule">
              <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content border-0 shadow-lg">
                  <div className="modal-header bg-gradient-primary text-white border-0">
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-lg bg-white bg-opacity-25 rounded-circle me-3 d-flex align-items-center justify-content-center">
                        <i className="ti ti-calendar-event fs-4 text-white"></i>
                      </div>
                      <div>
                        <h4 className="modal-title text-white mb-0">Add Exam Schedule</h4>
                        <small className="text-white-50">Create new exam schedule for students</small>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <i className="ti ti-x"></i>
                    </button>
                  </div>
                  <form onSubmit={handleAddExam}>
                    <div className="modal-body p-4">
                      {isLoadingTeacher ? (
                        <div className="row">
                          {[...Array(8)].map((_, index) => (
                            <div key={index} className="col-md-6">
                              <div className="mb-3 placeholder-glow">
                                <SkeletonPlaceholder className="col-6 mb-1" style={{ height: "1rem" }} />
                                <SkeletonPlaceholder className="col-12" style={{ height: "2.5rem" }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        newContents.map((_, index) => {
                          const classIdForThisForm = (newContents[index] as any).classId || selectedClassId;
                          const selectedClassObj = classes.find(cls => cls.id === classIdForThisForm);
                          const subjectsFromClass = selectedClassObj && Array.isArray(selectedClassObj.Subject) ? selectedClassObj.Subject : [];
                          return (
                            <div className="exam-schedule-add border rounded-3 p-4 mb-4 bg-light" key={index}>
                              <div className="d-flex align-items-center justify-content-between mb-3">
                                <h6 className="mb-0 text-primary">
                                  <i className="ti ti-calendar-plus me-2"></i>
                                  Exam Schedule #{index + 1}
                                </h6>
                                {newContents.length > 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => removeContent(index)}
                                  >
                                    <i className="ti ti-trash me-1"></i> Remove
                                  </button>
                                )}
                              </div>
                              <div className="row g-3">
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                      <i className="ti ti-school me-1 text-primary"></i>
                                      Class *
                                    </label>
                                    <select
                                      className="form-select border-2"
                                      name="class"
                                      value={selectedClassId}
                                      required
                                      disabled
                                      onChange={e => {
                                        const newClassId = e.target.value;
                                        (newContents[index] as any).classId = newClassId;
                                        setSectionOptions(getSectionsForClass(newClassId));
                                        fetchSubjectsForClass(newClassId);
                                      }}
                                    >
                                      <option value="">Select Class</option>
                                      {roleBasedClassOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                    <small className="text-muted">Automatically set from class selection above</small>
                                    {/* Hidden input to ensure classId is submitted */}
                                    <input type="hidden" name="classId" value={selectedClassId} />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                      <i className="ti ti-edit me-1 text-info"></i>
                                      Exam Name *
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control border-2"
                                      name="examName"
                                      placeholder="Enter exam name"
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                      <i className="ti ti-calendar me-1 text-success"></i>
                                      Start Time *
                                    </label>
                                    <input
                                      type="datetime-local"
                                      className="form-control border-2"
                                      name="startTime"
                                      required
                                      onChange={(e) => {
                                        // Auto-calculate duration when start time changes
                                        const startTime = new Date(e.target.value);
                                        const endTimeInput = (e.target.form as HTMLFormElement)?.querySelector('input[name="endTime"]') as HTMLInputElement;
                                        if (endTimeInput && endTimeInput.value) {
                                          const endTime = new Date(endTimeInput.value);
                                          const durationInMs = endTime.getTime() - startTime.getTime();
                                          const durationInMinutes = Math.round(durationInMs / (1000 * 60));
                                          const durationInput = (e.target.form as HTMLFormElement)?.querySelector('input[name="duration"]') as HTMLInputElement;
                                          if (durationInput && durationInMinutes > 0) {
                                            durationInput.value = durationInMinutes.toString();
                                          }
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                      <i className="ti ti-calendar me-1 text-warning"></i>
                                      End Time *
                                    </label>
                                    <input
                                      type="datetime-local"
                                      className="form-control border-2"
                                      name="endTime"
                                      required
                                      onChange={(e) => {
                                        // Auto-calculate duration when end time changes
                                        const endTime = new Date(e.target.value);
                                        const startTimeInput = (e.target.form as HTMLFormElement)?.querySelector('input[name="startTime"]') as HTMLInputElement;
                                        if (startTimeInput && startTimeInput.value) {
                                          const startTime = new Date(startTimeInput.value);
                                          const durationInMs = endTime.getTime() - startTime.getTime();
                                          const durationInMinutes = Math.round(durationInMs / (1000 * 60));
                                          const durationInput = (e.target.form as HTMLFormElement)?.querySelector('input[name="duration"]') as HTMLInputElement;
                                          if (durationInput && durationInMinutes > 0) {
                                            durationInput.value = durationInMinutes.toString();
                                          }
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                      <i className="ti ti-clock me-1 text-info"></i>
                                      Duration (min) *
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control border-2"
                                      name="duration"
                                      placeholder="Auto-calculated"
                                      required
                                      readOnly
                                      style={{ backgroundColor: '#f8f9fa' }}
                                    />
                                    <small className="text-muted">Automatically calculated from start and end time</small>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                      <i className="ti ti-building me-1 text-secondary"></i>
                                      Room Number *
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control border-2"
                                      name="roomNo"
                                      placeholder="Enter room number"
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                      <i className="ti ti-book me-1 text-primary"></i>
                                      Subject *
                                    </label>
                                    <select 
                                      className="form-select border-2" 
                                      name="subject" 
                                      required 
                                      disabled={!classIdForThisForm || subjectsFromClass.length === 0}
                                    >
                                      <option value="">
                                        {!classIdForThisForm
                                          ? 'Select a class first'
                                          : subjectsFromClass.length === 0
                                            ? 'No subjects found for this class'
                                            : 'Select Subject'}
                                      </option>
                                      {subjectsFromClass.map((opt: any) => (
                                        <option key={opt.id} value={opt.id}>
                                          {opt.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                      <i className="ti ti-target me-1 text-success"></i>
                                      Max Marks *
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control border-2"
                                      name="maxMarks"
                                      placeholder="Enter max marks"
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                      <i className="ti ti-check me-1 text-warning"></i>
                                      Min Marks (Pass) *
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control border-2"
                                      name="minMarks"
                                      placeholder="Enter minimum marks to pass"
                                      required
                                    />
                                  </div>
                                </div>
                                {/* Commented out unwanted fields */}
                                {/* 
                                <div className="col-md-4">
                                  <div className="mb-3">
                                    <label className="form-label fw-semibold">Section</label>
                                    <select
                                      className="form-select border-2"
                                      name="section"
                                      disabled={!((newContents[index] as any)?.classId) || isLoadingSections}
                                    >
                                      <option value="">Select Section</option>
                                      {getSectionsForClass(((newContents[index] as any)?.classId) || '').map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="mb-3">
                                    <label className="form-label fw-semibold">Exam Date</label>
                                    <input
                                      type="date"
                                      className="form-control border-2"
                                      name="examDate"
                                      required
                                    />
                                  </div>
                                </div>
                                */}
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={addNewContent}
                          className="btn btn-outline-primary btn-lg"
                        >
                          <i className="ti ti-plus me-2"></i>
                          Add Another Exam Schedule
                        </button>
                      </div>
                    </div>
                    <div className="modal-footer bg-light border-0">
                      <button type="button" className="btn btn-secondary btn-lg me-2" data-bs-dismiss="modal">
                        <i className="ti ti-x me-1"></i>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary btn-lg">
                        <i className="ti ti-plus me-1"></i>
                        Create Exam Schedule
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal fade" id="edit_exam_schedule">
              <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Edit Exam Schedule</h4>
                    <button
                      type="button"
                      className="btn-close custom-btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <i className="ti ti-x" />
                    </button>
                  </div>
                  <form onSubmit={handleEditExam}>
                    <div className="modal-body">
                      {isLoadingTeacher ? (
                        <div className="row">
                          {[...Array(9)].map((_, index) => (
                            <div key={index} className="col-md-4">
                              <div className="mb-3 placeholder-glow">
                                <SkeletonPlaceholder className="col-6 mb-1" style={{ height: "1rem" }} />
                                <SkeletonPlaceholder className="col-12" style={{ height: "2.5rem" }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="row">
                          <div className="col-md-12">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="mb-3">
                                  <label className="form-label tw-text-sm">Class</label>
                                  <select
                                    className="form-control tw-text-sm"
                                    name="class"
                                    defaultValue={selectedExam?.classId}
                                    required
                                    onChange={e => {
                                      setSectionOptions(getSectionsForClass(e.target.value));
                                      fetchSubjectsForClass(e.target.value);
                                    }}
                                  >
                                    <option value="">Select Class</option>
                                    {roleBasedClassOptions.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="mb-3">
                                  <label className="form-label tw-text-sm">Section</label>
                                  <select
                                    className="form-control tw-text-sm"
                                    name="section"
                                    defaultValue={selectedExam?.sectionId}
                                    disabled={!selectedExam?.classId || isLoadingSections}
                                  >
                                    <option value="">Select Section</option>
                                    {getSectionsForClass(selectedExam?.classId || '').map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="mb-3">
                                  <label className="form-label tw-text-sm">Exam Name</label>
                                  <input
                                    type="text"
                                    className="form-control tw-text-sm"
                                    name="examName"
                                    defaultValue={selectedExam?.title}
                                    placeholder="Enter exam name"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="mb-3">
                                  <label className="form-label tw-text-sm">Start Time</label>
                                  <input
                                    type="datetime-local"
                                    className="form-control tw-text-sm"
                                    name="startTime"
                                    defaultValue={selectedExam?.startTime}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="mb-3">
                                  <label className="form-label tw-text-sm">End Time</label>
                                  <input
                                    type="datetime-local"
                                    className="form-control tw-text-sm"
                                    name="endTime"
                                    defaultValue={selectedExam?.endTime}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="mb-3">
                                  <label className="form-label tw-text-sm">Duration (min)</label>
                                  <input
                                    type="number"
                                    className="form-control tw-text-sm"
                                    name="duration"
                                    defaultValue={selectedExam?.duration?.replace(" min", "")}
                                    placeholder="Enter duration"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="exam-schedule-row d-flex align-items-center flex-wrap column-gap-3">
                            <div className="shedule-info flex-fill">
                              <div className="mb-3">
                                <label className="form-label tw-text-sm">Exam Date</label>
                                <input
                                  type="date"
                                  className="form-control tw-text-sm"
                                  name="examDate"
                                  defaultValue={selectedExam?.examDate}
                                  required
                                />
                              </div>
                            </div>
                            <div className="shedule-info flex-fill">
                              <div className="mb-3">
                                <label className="form-label tw-text-sm">Subject</label>
                                <select
                                  className="form-control tw-text-sm"
                                  name="subject"
                                  defaultValue={selectedExam?.subject}
                                  required
                                  disabled={!selectedExam?.classId}
                                >
                                  <option value="">Select Subject</option>
                                  {Array.isArray(classSubjects) && classSubjects.map((opt) => (
                                    <option key={opt.id || opt.value} value={opt.id || opt.value}>
                                      {opt.name || opt.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="shedule-info flex-fill">
                              <div className="mb-3">
                                <label className="form-label tw-text-sm">Room No</label>
                                <input
                                  type="number"
                                  className="form-control tw-text-sm"
                                  name="roomNo"
                                  defaultValue={selectedExam?.roomNo}
                                  placeholder="Enter room number"
                                  required
                                />
                              </div>
                            </div>
                            <div className="shedule-info flex-fill">
                              <div className="d-flex align-items-end">
                                <div className="mb-0 flex-fill">
                                  <label className="form-label tw-text-sm">Min Marks</label>
                                  <input
                                    type="number"
                                    className="form-control tw-text-sm"
                                    name="minMarks"
                                    defaultValue={selectedExam?.minMarks}
                                    placeholder="Enter min marks"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="modal-footer">
                      <Link to="#" className="btn btn-light me-2 tw-text-sm" data-bs-dismiss="modal">
                        Cancel
                      </Link>
                      <button type="submit" className="btn btn-primary tw-text-sm">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal fade" id="upload_result">
              <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Upload Result</h4>
                    <button
                      type="button"
                      className="btn-close custom-btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => {
                        setModalClassId("");
                        setModalSectionId("");
                        setModalSubjectId("");
                        setStudentSearchTerm("");
                        setSelectedStudentId("");
                        setIsStudentListOpen(false);
                      }}
                    >
                      <i className="ti ti-x"></i>
                    </button>
                  </div>
                  <form onSubmit={handleUploadResult}>
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label tw-text-sm">Class</label>
                            <input
                              type="text"
                              className="form-control tw-text-sm"
                              value={roleBasedClassOptions.find(opt => opt.value === modalClassId)?.label || modalClassId || ''}
                              readOnly
                              disabled
                            />
                            <input
                              type="hidden"
                              name="class"
                              value={modalClassId}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label tw-text-sm">Section</label>
                            <select
                              className="form-control tw-text-sm"
                              name="section"
                              value={modalSectionId}
                              onChange={e => {
                                setModalSectionId(e.target.value);
                                // Don't clear students - keep all students for the class
                                // Section can be used for filtering if needed
                              }}
                              disabled={!modalClassId}
                            >
                              <option value="">Select Section</option>
                              {getSectionsForClass(modalClassId || '').map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="mb-3">
                            <label className="form-label tw-text-sm">Subject</label>
                            <select
                              className="form-control tw-text-sm"
                              name="subject"
                              value={modalSubjectId}
                              onChange={(e) => setModalSubjectId(e.target.value)}
                              required
                              disabled={!modalClassId}
                            >
                              <option value="">Select Subject</option>
                              {Array.isArray(classSubjects) && classSubjects.map((opt) => (
                                <option key={opt.id || opt.value} value={opt.id || opt.value}>
                                  {opt.name || opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="mb-3">
                            <label className="form-label tw-text-sm">Exam</label>
                            <select className="form-control tw-text-sm" name="examId" required>
                              <option value="">Select Exam</option>
                              {modalFilteredExams.length === 0 ? (
                                <option value="" disabled>
                                  No exams available
                                </option>
                              ) : (
                                modalFilteredExams.map((exam) => (
                                  <option key={exam.id} value={exam.id}>
                                    {exam.title} - {formatDate(exam.examDate)}
                                  </option>
                                ))
                              )}
                            </select>
                          </div>
                          <div className="mb-3">
                            <label className="form-label tw-text-sm">Search Student</label>
                            <div className="position-relative student-search-dropdown">
                              <input
                                type="text"
                                className="form-control tw-text-sm"
                                placeholder="Search by name, roll no, or admission no"
                                value={studentSearchTerm}
                                onChange={(e) => {
                                  setStudentSearchTerm(e.target.value);
                                  setIsStudentListOpen(true);
                                }}
                                onFocus={() => setIsStudentListOpen(true)}
                                autoComplete="off"
                                readOnly={!!selectedStudentId}
                              />
                              {(studentSearchTerm || isStudentListOpen) && students.length > 0 && !selectedStudentId && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    zIndex: 1000,
                                    background: '#fff',
                                    border: '1px solid #eee',
                                    borderRadius: 4,
                                    maxHeight: 200,
                                    overflowY: 'auto',
                                  }}
                                >
                                  {filteredStudents.length === 0 ? (
                                    <div className="text-muted p-2">No students found</div>
                                  ) : (
                                    filteredStudents.map((student) => (
                                      <div
                                        key={student.id}
                                        style={{ cursor: 'pointer', padding: 8, borderBottom: '1px solid #f0f0f0', background: selectedStudentId === student.id ? '#f5f5f5' : 'white' }}
                                        onClick={() => handleStudentSelect(student)}
                                      >
                                        <b>{student.name}</b> ({student.admissionNo || student.rollNo})
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                              {selectedStudentId && (
                                <button
                                  type="button"
                                  className="btn btn-sm position-absolute"
                                  style={{ right: "10px", top: "50%", transform: "translateY(-50%)", zIndex: 1001 }}
                                  onClick={() => {
                                    setSelectedStudentId("");
                                    setStudentSearchTerm("");
                                    setIsStudentListOpen(false);
                                  }}
                                >
                                  <i className="ti ti-x"></i>
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label tw-text-sm">Marks Obtained</label>
                            <input
                              type="number"
                              className="form-control tw-text-sm"
                              name="marksObtained"
                              placeholder="Enter Marks Obtained"
                              required
                              value={marksObtained}
                              onChange={e => setMarksObtained(e.target.value)}
                            />
                          </div>
                          {studentsMessage && (
                            <div className="alert alert-info">{studentsMessage}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-light me-2 tw-text-sm"
                        data-bs-dismiss="modal"
                        onClick={() => {
                          setModalClassId("");
                          setModalSectionId("");
                          setModalSubjectId("");
                          setStudentSearchTerm("");
                          setSelectedStudentId("");
                          setIsStudentListOpen(false);
                        }}
                        disabled={isLoadingResults}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary tw-text-sm"
                        disabled={isLoadingResults}
                      >
                        {isLoadingResults ? "Uploading..." : "Upload"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal fade" id="view_exam_results">
              <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">View Exam Results</h4>
                    <button
                      type="button"
                      className="btn-close custom-btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => {
                        setViewResultClassId("");
                        setViewResultStudents([]);
                        setViewResultStudentSearch("");
                        setViewResultSelectedStudent(null);
                        setViewResultStudentResults([]);
                        setViewResultError("");
                      }}
                    >
                      <i className="ti ti-x"></i>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label tw-text-sm">Class</label>
                          <select
                            className="form-control tw-text-sm"
                            value={viewResultClassId}
                            onChange={e => handleViewResultClassChange(e.target.value)}
                          >
                            <option value="">Select Class</option>
                            {roleBasedClassOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    {isLoadingViewResultStudents ? (
                      <div className="text-center py-4">Loading students...</div>
                    ) : viewResultError ? (
                      <div className="alert alert-danger">{viewResultError}</div>
                    ) : viewResultClassId && (
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label tw-text-sm">Search Student</label>
                            <input
                              type="text"
                              className="form-control tw-text-sm"
                              placeholder="Search by name, roll no, or admission no"
                              value={viewResultStudentSearch}
                              onChange={e => setViewResultStudentSearch(e.target.value)}
                            />
                          </div>
                          <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #eee', borderRadius: 4 }}>
                            {viewResultStudents.filter(student => {
                              const search = viewResultStudentSearch.toLowerCase();
                              return (
                                student.user?.name?.toLowerCase().includes(search) ||
                                student.admissionNo?.toLowerCase().includes(search) ||
                                student.rollNo?.toLowerCase().includes(search)
                              );
                            }).map(student => (
                              <div
                                key={student.id}
                                style={{ cursor: 'pointer', padding: 8, borderBottom: '1px solid #f0f0f0', background: viewResultSelectedStudent?.id === student.id ? '#f5f5f5' : 'white' }}
                                onClick={() => handleViewResultStudentClick(student)}
                              >
                                <b>{student.user?.name || 'Unknown'}</b> ({student.admissionNo || student.rollNo})
                              </div>
                            ))}
                            {viewResultStudents.length === 0 && <div className="text-muted p-2">No students found</div>}
                          </div>
                        </div>
                        <div className="col-md-6 d-flex align-items-center justify-content-center">
                          {isLoadingViewResultStudentResults ? (
                            <div>Loading results...</div>
                          ) : viewResultSelectedStudent ? (
                            <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.1)' }}>
                              <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h5 className="modal-title">Results for {viewResultSelectedStudent.user?.name || viewResultSelectedStudent.admissionNo}</h5>
                                    <button type="button" className="btn-close" onClick={() => setViewResultSelectedStudent(null)}></button>
                                  </div>
                                  <div className="modal-body">
                                    {viewResultStudentResults.length === 0 ? (
                                      <div>No results found for this student.</div>
                                    ) : (
                                      <table className="table table-bordered">
                                        <thead>
                                          <tr>
                                            <th>Exam Name</th>
                                            <th>Score</th>
                                            <th>Result</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {viewResultStudentResults.map((result: any) => (
                                            <tr key={result.id}>
                                              <td>{result.examTitle || '-'}</td>
                                              <td>{result.score ?? '-'}</td>
                                              <td>{typeof result.score === 'number' ? (result.score >= 35 ? 'Pass' : 'Fail') : '-'}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-muted">Select a student to view results</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <Link to="#" className="btn btn-light tw-text-sm" data-bs-dismiss="modal">
                      Close
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id="delete-modal">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleDeleteExam();
                    }}
                  >
                    <div className="modal-body text-center">
                      <span className="delete-icon">
                        <i className="ti ti-trash-x"></i>
                      </span>
                      <h4 className="modal-title">Confirm Deletion</h4>
                      <p className="modal-text">
                        You want to delete this exam schedule? This cannot be undone.
                      </p>
                      <div className="d-flex justify-content-center">
                        <Link to="#" className="btn btn-light me-2 tw-text-sm" data-bs-dismiss="modal">
                          Cancel
                        </Link>
                        <button type="submit" className="btn btn-danger tw-text-sm">
                          Yes, Delete
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ExamSchedule;