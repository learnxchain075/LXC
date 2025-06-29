import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Table, Tabs } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { all_routes } from "../../router/all_routes";
import TooltipOption from "../../core/common/tooltipOption";
import useMobileDetection from "../../core/common/mobileDetection";
import { useSelector } from "react-redux";
import PredefinedDateRanges from "../../core/common/datePicker";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { closeModal } from "../Common/modalclose";
import { createPYQ, getPYQById } from "../../services/admin/pyqQuestionApi";
import { createHomework, getHomeworkByClassId, updateHomework, deleteHomework } from "../../services/teacher/homework";
import { getClassesByTeacherId, getClassByschoolId, getAllStudentsInAclass } from "../../services/teacher/classServices";
import { getSubjectByClassId, getSubjectBySchoold } from "../../services/teacher/subjectServices";
import { AxiosResponse } from "axios";
import { Iassignment } from "../../services/types/teacher/assignmentService";
import { createAssignment, deleteAssignment, getAssignments, updateAssignment, getAssignmentById } from "../../services/teacher/assignmentServices";
import { getLessonByteacherId } from "../../services/teacher/lessonServices";
import { getAllPYQs } from "../../services/admin/pyqQuestionApi";

const MAX_SIZE_MB = 5;

interface Class {
    id: string;
    name: string;
    section?: string;
    Subject?: { id: string; name: string; status: string }[];
    Section?: { id: string; name: string }[];
    students?: Student[];
}

interface Student {
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
}

interface Subject {
    id: string;
    name: string;
}

interface Pyq {
    id: string;
    subject: string;
    fileName: string;
    fileSize: string;
    classId: string;
}

interface Homework {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    createdAt: string;
    attachment?: File | null;
    status: string;
    classId: string;
    sectionId: string;
    subjectId: string;
}

interface PyqContent {
    question: File | null;
    solution: File | null;
    subjectId: string;
    topic: string;
    uploaderId: string;
    classId?: string;
}

interface AcademicUploadsProps {
    teacherdata?: unknown;
}

const AcademicUploads: React.FC<AcademicUploadsProps> = ({ teacherdata }: AcademicUploadsProps) => {
    const routes = all_routes;
    const user = useSelector((state: any) => state.auth.userObj);
    const isMobile = useMobileDetection();
    const dropdownMenuRef = useRef<HTMLDivElement>(null);
    const [classList, setClassList] = useState<Class[]>([]);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [filteredClassList, setFilteredClassList] = useState<Class[]>([]);
    const [pyqData, setPyqData] = useState<Pyq[]>([]);
    const [assignmentData, setAssignmentData] = useState<Iassignment[]>([]);
    const [homeworkData, setHomeworkData] = useState<Homework[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [timetable, setTimetable] = useState<any[]>([]);
    const [newPyqContents, setNewPyqContents] = useState<PyqContent[]>([
        {
            question: null,
            solution: null,
            subjectId: "",
            topic: "",
            uploaderId: localStorage.getItem("userId") ?? "",
        },
    ]);
    const [newAssignment, setNewAssignment] = useState<Iassignment>({
        title: "",
        description: "",
        subjectId: "",
        classId: "",
        dueDate: null,
        lessonId: "",
        attachment: undefined,
        sectionId: "",
    });
    const [newHomework, setNewHomework] = useState<Homework>({
        title: "",
        description: "",
        dueDate: null,
        attachment: null,
        status: "PENDING",
        classId: "",
        sectionId: "",
        subjectId: "",
    });
    const [editAssignment, setEditAssignment] = useState<Iassignment | null>(null);
    const [deleteId, setDeleteId] = useState<{ id: string; type: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const statusOptions = [
        { value: "PENDING", label: "Pending" },
        { value: "COMPLETED", label: "Completed" },
        { value: "IN_PROGRESS", label: "In Progress" },
    ];

    const fetchClasses = useCallback(async () => {
        try {
            setLoading(true);
            const teacherId = localStorage.getItem("teacherId") || "";
            const response = user.role === "admin"
                ? await getClassByschoolId(localStorage.getItem("schoolId") ?? "")
                : await getClassesByTeacherId(teacherId);
            const res = await getLessonByteacherId(teacherId);
            
            console.log("Classes API Response:", response);
            console.log("Lessons API Response:", res);
            
            setTimetable(res?.data as any || []);
            
            // Handle different possible response structures for classes
            let classesData = [];
            const responseData = (response as any)?.data;
            
            if (responseData?.data && Array.isArray(responseData.data)) {
                classesData = responseData.data;
            } else if (responseData?.classes && Array.isArray(responseData.classes)) {
                classesData = responseData.classes;
            } else if (Array.isArray(responseData)) {
                classesData = responseData;
            } else if (Array.isArray(response)) {
                classesData = response;
            }
            
            // Ensure classesData is an array before mapping
            if (!Array.isArray(classesData)) {
                console.error("classesData is not an array:", classesData);
                toast.error("Invalid classes data format received", { autoClose: 3000 });
                setClassList([]);
                return;
            }
            
            const processedClasses = classesData.map((cls: any) => ({
                ...cls,
                Subject: cls.Subject?.map((sub: any) => ({ ...sub, status: sub.status || "Active" })) || [],
                Section: cls.Section || [],
                section: cls.Section?.map((sec: any) => sec.name).join(", ") || cls.section || "N/A",
            }));
            
            setClassList(processedClasses);
            console.log("Processed Classes:", processedClasses);
            
            if (processedClasses.length > 0) {
                toast.success(`Successfully loaded ${processedClasses.length} classes`, { autoClose: 2000 });
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
            toast.error("Failed to load classes", { autoClose: 3000 });
            setClassList([]);
        } finally {
            setLoading(false);
        }
    }, [user.role]);

    const fetchStudents = useCallback(async (classId: string) => {
        try {
            const response = await getAllStudentsInAclass(classId);
            console.log("Students API Response:", response);
            
            // Handle different possible response structures
            let studentsData = [];
            const responseData = (response as any)?.data;
            
            if (responseData?.data && Array.isArray(responseData.data)) {
                studentsData = responseData.data;
            } else if (responseData?.students && Array.isArray(responseData.students)) {
                studentsData = responseData.students;
            } else if (Array.isArray(responseData)) {
                studentsData = responseData;
            } else if (Array.isArray(response)) {
                studentsData = response;
            }
            
            // Ensure studentsData is an array before filtering
            if (!Array.isArray(studentsData)) {
                console.error("studentsData is not an array:", studentsData);
                toast.error("Invalid students data format received", { autoClose: 3000 });
                return [];
            }
            
            const filteredStudents = studentsData
                .filter((student: any) => student.classId === classId)
                .map((student: any) => ({
                    id: student.id,
                    key: student.id,
                    admissionNo: student.admissionNo || `A${student.id}`,
                    rollNo: student.rollNo || `R${student.id}`,
                    name: student?.user?.name || "Unknown Student",
                    classId: classList.find(cls => cls.id === classId)?.name || "",
                    sectionId: classList.find(cls => cls.id === classId)?.Section?.find(sec => sec.id === student.sectionId)?.name || student.sectionId,
                    attendance: student.attendance || "Present",
                    present: student.attendance === "Present",
                    absent: student.attendance === "Absent",
                    notes: student.notes || "",
                    img: student?.user?.profilePic || "",
                }));
            
            console.log("Filtered Students:", filteredStudents);
            
            if (filteredStudents.length > 0) {
                toast.success(`Successfully loaded ${filteredStudents.length} students`, { autoClose: 2000 });
            }
            
            return filteredStudents;
        } catch (error) {
            console.error("Error fetching students:", error);
            toast.error("Failed to load students", { autoClose: 3000 });
            return [];
        }
    }, [classList]);

    useEffect(() => {
        if (newAssignment.classId && newAssignment.subjectId) {
            const matchingLessons = timetable.filter(
                (lesson) => lesson.classId === newAssignment.classId && lesson.subjectId === newAssignment.subjectId
            );
            if (matchingLessons.length === 1) {
                setNewAssignment((prev) => ({ ...prev, lessonId: matchingLessons[0].id }));
            } else {
                setNewAssignment((prev) => ({ ...prev, lessonId: "" }));
            }
        } else {
            setNewAssignment((prev) => ({ ...prev, lessonId: "" }));
        }
    }, [newAssignment.classId, newAssignment.subjectId, timetable]);

    const fetchSubjects = useCallback(async (classId: string) => {
        try {
            const response: AxiosResponse<{ data: Subject[] }> = user.role === "admin"
                ? await getSubjectBySchoold(localStorage.getItem("schoolId") ?? "")
                : await getSubjectByClassId(classId);
            setSubjects(response.data.data || []);
        } catch (error) {
            toast.error("Failed to load subjects", { autoClose: 3000 });
        }
    }, [user.role]);

    const fetchPyqData = useCallback(async (classId: string) => {
        try {
            const response = await getAllPYQs();
            console.log("PYQ API Response:", response);
            
            // Handle different possible response structures
            let pyqData = [];
            const responseData = (response as any)?.data;
            
            if (responseData?.data && Array.isArray(responseData.data)) {
                pyqData = responseData.data;
            } else if (Array.isArray(responseData)) {
                pyqData = responseData;
            } else if (Array.isArray(response)) {
                pyqData = response;
            }
            
            // Ensure pyqData is an array before filtering
            if (!Array.isArray(pyqData)) {
                console.error("pyqData is not an array:", pyqData);
                toast.error("Invalid PYQ data format received", { autoClose: 3000 });
                setPyqData([]);
                return;
            }
            
            const filteredPyq = pyqData.filter((pyq: any) => pyq.classId === classId);
            setPyqData(filteredPyq);
            console.log("Filtered PYQ Data:", filteredPyq);
            
            if (filteredPyq.length > 0) {
                toast.success(`Successfully loaded ${filteredPyq.length} PYQ files`, { autoClose: 2000 });
            }
        } catch (error) {
            console.error("Error fetching PYQ data:", error);
            toast.error("Failed to load PYQ data", { autoClose: 3000 });
            setPyqData([]);
        }
    }, []);

    const fetchAssignmentData = useCallback(async (classId: string) => {
        try {
            const response: AxiosResponse<any> = await getAssignments();
            console.log("Assignment API Response:", response);
            
            // Handle different possible response structures
            let assignmentData = [];
            const responseData = response?.data;
            
            if (responseData?.data && Array.isArray(responseData.data)) {
                assignmentData = responseData.data;
            } else if (Array.isArray(responseData)) {
                assignmentData = responseData;
            } else if (Array.isArray(response)) {
                assignmentData = response;
            }
            
            // Ensure assignmentData is an array before filtering
            if (!Array.isArray(assignmentData)) {
                console.error("assignmentData is not an array:", assignmentData);
                toast.error("Invalid assignment data format received", { autoClose: 3000 });
                setAssignmentData([]);
                return;
            }
            
            const filteredAssignments = assignmentData.filter((assignment: any) => assignment.classId === classId);
            setAssignmentData(filteredAssignments);
            console.log("Filtered Assignment Data:", filteredAssignments);
            
            if (filteredAssignments.length > 0) {
                toast.success(`Successfully loaded ${filteredAssignments.length} assignments`, { autoClose: 2000 });
            }
        } catch (error) {
            console.error("Error fetching assignment data:", error);
            toast.error("Failed to load assignments", { autoClose: 3000 });
            setAssignmentData([]);
        }
    }, []);

    const fetchHomeworkData = useCallback(async (classId: string) => {
        try {
            const response: AxiosResponse<Homework[]> = await getHomeworkByClassId(classId);
            setHomeworkData(response.data || []);
        } catch (error) {
            toast.error("Failed to load homework data", { autoClose: 3000 });
        }
    }, []);

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    const handleClassSelect = useCallback(async (classId: string) => {
        const selected = classList.find(cls => cls.id === classId);
        if (selected) {
            if (!selected.students) {
                const students = await fetchStudents(classId);
                setClassList(prev =>
                    prev.map(cls =>
                        cls.id === classId ? { ...cls, students, Section: cls.Section || [] } : cls
                    )
                );
                setSelectedClass({ ...selected, students, Section: selected.Section || [] });
            } else {
                setSelectedClass({ ...selected, Section: selected.Section || [] });
            }
            await Promise.allSettled([
                fetchSubjects(classId),
                fetchPyqData(classId),
                fetchAssignmentData(classId),
                fetchHomeworkData(classId),
            ]);
        }
    }, [classList, fetchStudents, fetchSubjects, fetchPyqData, fetchAssignmentData, fetchHomeworkData]);

    const handlePyqFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: "question" | "solution") => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) {
            setNewPyqContents(prev =>
                prev.map((content, i) =>
                    i === index ? { ...content, [field]: null } : content
                )
            );
            return;
        }
        if (selectedFile.type !== "application/pdf") {
            toast.error("Only PDF files are allowed", { autoClose: 3000 });
            return;
        }
        if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
            toast.error(`File size should not exceed ${MAX_SIZE_MB}MB`, { autoClose: 3000 });
            return;
        }
        setNewPyqContents(prev =>
            prev.map((content, i) =>
                i === index ? { ...content, [field]: selectedFile } : content
            )
        );
        toast.success(`Ready to upload: ${selectedFile.name}`, { autoClose: 3000 });
    };

    const handlePyqInputChange = (index: number, field: string, value: string) => {
        setNewPyqContents(prev =>
            prev.map((content, i) =>
                i === index ? { ...content, [field]: value } : content
            )
        );
    };

    const handlePyqSubjectChange = (index: number, value: string) => {
        setNewPyqContents(prev =>
            prev.map((content, i) =>
                i === index ? { ...content, subjectId: value } : content
            )
        );
    };

    const filteredLessons = useMemo(
        () =>
            newAssignment.classId && newAssignment.subjectId
                ? timetable.filter(
                    (lesson) => lesson.classId === newAssignment.classId && lesson.subjectId === newAssignment.subjectId
                )
                : [],
        [timetable, newAssignment.classId, newAssignment.subjectId]
    );

    const addPyqContent = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setNewPyqContents(prev => [
            ...prev,
            {
                question: null,
                solution: null,
                subjectId: "",
                topic: "",
                uploaderId: localStorage.getItem("userId") ?? "",
                classId: selectedClass?.id || "",
            },
        ]);
    };

    const removePyqContent = (index: number) => {
        setNewPyqContents(prev => prev.filter((_, i) => i !== index));
    };

    const handlePyqUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validFiles = newPyqContents.filter(
            content => content.question && content.solution && content.subjectId && content.topic && content.uploaderId && selectedClass?.id
        );
        if (validFiles.length === 0) {
            toast.error("Please select both question and solution files, subject, topic, and class", { autoClose: 3000 });
            return;
        }
        try {
            setLoading(true);
            for (const content of validFiles) {
                const formData = new FormData();
                
                // Add files
                if (content.question) {
                    formData.append("question", content.question);
                }
                if (content.solution) {
                    formData.append("solution", content.solution);
                }
                
                // Add other fields
                formData.append("subjectId", content.subjectId);
                formData.append("classId", selectedClass!.id);
                formData.append("uploaderId", content.uploaderId);
                formData.append("topic", content.topic);
                
                console.log("Uploading PYQ with formData:", {
                    subjectId: content.subjectId,
                    classId: selectedClass!.id,
                    uploaderId: content.uploaderId,
                    topic: content.topic,
                    questionFile: content.question?.name,
                    solutionFile: content.solution?.name
                });
                
                await createPYQ(formData);
            }
            closeModal("add_pyq_upload");
            toast.success("PYQ uploaded successfully! 🎉", { autoClose: 3000 });
            setNewPyqContents([{
                question: null,
                solution: null,
                subjectId: "",
                topic: "",
                uploaderId: localStorage.getItem("userId") ?? "",
            }]);
            fetchPyqData(selectedClass!.id);
        } catch (error) {
            console.error("PYQ upload error:", error);
            toast.error("Upload failed. Please check your files and try again.", { autoClose: 4000 });
        } finally {
            setLoading(false);
        }
    };

    const handleAssignmentChange = (field: keyof Iassignment, value: string | Date | File | null) => {
        setNewAssignment(prev => ({ ...prev, [field]: value }));
    };

    const handleEditAssignmentChange = (field: keyof Iassignment, value: string | Date | null) => {
        setEditAssignment(prev => (prev ? { ...prev, [field]: value } : null));
    };

    const handleAssignmentUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newAssignment.title || !newAssignment.subjectId || !newAssignment.classId || !newAssignment.dueDate || !newAssignment.sectionId) {
            toast.error("Please fill all required fields, including section", { autoClose: 3000 });
            return;
        }
        try {
            setLoading(true);
            await createAssignment({
                ...newAssignment,
                dueDate: newAssignment.dueDate instanceof Date ? newAssignment.dueDate : new Date(newAssignment.dueDate as any),
            });
            closeModal("add_assignment");
            toast.success("Assignment uploaded successfully", { autoClose: 3000 });
            setNewAssignment({
                title: "",
                description: "",
                subjectId: "",
                classId: "",
                dueDate: null,
                lessonId: "",
                attachment: undefined,
                sectionId: "",
            });
            fetchAssignmentData(selectedClass!.id);
        } catch (error) {
            toast.error("Upload failed", { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleEditAssignment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editAssignment?.id || !editAssignment.title || !editAssignment.subjectId || !editAssignment.classId || !editAssignment.dueDate || !editAssignment.sectionId) {
            toast.error("Please fill all required fields, including section", { autoClose: 3000 });
            return;
        }
        try {
            setLoading(true);
            await updateAssignment(editAssignment.id, {
                title: editAssignment.title,
                description: editAssignment.description,
                subjectId: editAssignment.subjectId,
                classId: editAssignment.classId,
                sectionId: editAssignment.sectionId,
                dueDate: editAssignment.dueDate instanceof Date ? editAssignment.dueDate.toISOString() : editAssignment.dueDate,
                lessonId: editAssignment.lessonId,
            });
            closeModal("edit_assignment");
            toast.success("Assignment updated successfully", { autoClose: 3000 });
            setEditAssignment(null);
            fetchAssignmentData(selectedClass!.id);
        } catch (error) {
            toast.error("Update failed", { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleHomeworkChange = (field: keyof Homework, value: string | Date | File | null) => {
        setNewHomework(prev => ({ ...prev, [field]: value }));
    };

    const handleHomeworkUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newHomework.title || !newHomework.classId || !newHomework.subjectId || !newHomework.dueDate || !selectedClass?.id) {
            toast.error("Please fill all required fields", { autoClose: 3000 });
            return;
        }
        try {
            setLoading(true);
            const homework = {
                ...newHomework,
                classId: selectedClass.id,
                dueDate:
                    newHomework.dueDate && newHomework.dueDate instanceof Date
                        ? newHomework.dueDate.toISOString()
                        : "",
            };
            await createHomework(homework as any);
            closeModal("add_home_work");
            toast.success("Homework added successfully", { autoClose: 3000 });
            setNewHomework({
                title: "",
                description: "",
                dueDate: null,
                attachment: null,
                status: "PENDING",
                classId: "",
                sectionId: "",
                subjectId: "",
            });
            fetchHomeworkData(selectedClass.id);
        } catch (error) {
            toast.error("Failed to add homework", { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, type: string) => {
        try {
            if (type === "pyq") {
                setPyqData(prev => prev.filter(item => item.id !== id));
            } else if (type === "homework") {
                await deleteHomework(id);
                setHomeworkData(prev => prev.filter(item => item.id !== id));
            } else if (type === "assignment") {
                await deleteAssignment(id);
                setAssignmentData(prev => prev.filter(item => item.id !== id));
            }
            toast.success(`${type.toUpperCase()} deleted successfully`, { autoClose: 3000 });
        } catch (error) {
            toast.error(`Failed to delete ${type}`, { autoClose: 3000 });
        }
    };

    const handleApplyClick = () => {
        if (dropdownMenuRef.current) {
            dropdownMenuRef.current.classList.remove("show");
        }
    };

    const openEditAssignmentModal = async (assignmentId: string) => {
        try {
            const response: AxiosResponse<Iassignment> = await getAssignmentById(assignmentId);
            setEditAssignment({
                ...response.data,
                dueDate: response.data.dueDate ? new Date(response.data.dueDate) : null,
            });
        } catch (error) {
            toast.error("Failed to load assignment", { autoClose: 3000 });
        }
    };

    const classColumns = [
        {
            title: "Class Name",
            dataIndex: "name",
            render: (text: string, record: Class) => (
                <Link
                    to="#"
                    onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        handleClassSelect(record.id);
                    }}
                    className="text-blue-600 hover:underline"
                >
                    {text}
                </Link>
            ),
            sorter: (a: Class, b: Class) => a.name.localeCompare(b.name),
        },
        {
            title: "Section",
            dataIndex: "section",
            render: (text: string, record: Class) => record.Section?.map(sec => sec.name).join(", ") || "N/A",
            sorter: (a: Class, b: Class) => (a.section || "").localeCompare(b.section || ""),
        },
    ];

    const pyqColumns = [
        {
            title: "Subject",
            dataIndex: "subject",
            render: (text: string, record: Pyq) => (
                <Link to="#" className="link-primary">
                    {record.subject || "N/A"}
                </Link>
            ),
            sorter: (a: Pyq, b: Pyq) => (a.subject || "").localeCompare(b.subject || ""),
        },
        {
            title: "File Name",
            dataIndex: "fileName",
            render: (text: string) => <span className="text-muted">{text || "N/A"}</span>,
            sorter: (a: Pyq, b: Pyq) => (a.fileName || "").localeCompare(b.fileName || ""),
        },
        {
            title: "File Size",
            dataIndex: "fileSize",
            sorter: (a: Pyq, b: Pyq) => {
                const getSizeInKB = (size: string) => parseFloat(size?.replace("KB", "") || "0");
                return getSizeInKB(a.fileSize) - getSizeInKB(b.fileSize);
            },
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (_: any, record: Pyq) => (
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
                            <a
                                className="dropdown-item rounded-1"
                                href={`/files/${record.fileName}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="ti ti-eye me-2" />
                                View
                            </a>
                        </li>
                        <li>
                            <a className="dropdown-item rounded-1" href={`/download/${record.id}`}>
                                <i className="ti ti-download me-2" />
                                Download
                            </a>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="dropdown-item rounded-1 text-danger"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-modal"
                                onClick={() => setDeleteId({ id: record.id, type: "pyq" })}
                            >
                                <i className="ti ti-trash me-2" />
                                Delete
                            </button>
                        </li>
                    </ul>
                </div>
            ),
        },
    ];

    const assignmentColumns = [
        {
            title: "Title",
            dataIndex: "title",
            render: (text: string) => <span className="fw-semibold">{text || "N/A"}</span>,
            sorter: (a: any, b: any) => (a.title || "").localeCompare(b.title || ""),
        },
        {
            title: "Description",
            dataIndex: "description",
            render: (text: string) => (
                <span className="text-muted">
                    {text ? (text.length > 50 ? `${text.substring(0, 50)}...` : text) : "No description"}
                </span>
            ),
        },
        {
            title: "Subject",
            dataIndex: "subject",
            render: (subject: any) => (
                <span className="badge bg-primary-subtle text-primary">
                    {subject?.name || "N/A"}
                </span>
            ),
            sorter: (a: any, b: any) => (a.subject?.name || "").localeCompare(b.subject?.name || ""),
        },
        {
            title: "Class",
            dataIndex: "class",
            render: (classData: any) => (
                <span className="badge bg-info-subtle text-info">
                    {classData?.name || "N/A"}
                </span>
            ),
            sorter: (a: any, b: any) => (a.class?.name || "").localeCompare(b.class?.name || ""),
        },
        {
            title: "Section",
            dataIndex: "section",
            render: (section: any) => (
                <span className="badge bg-warning-subtle text-warning">
                    {section?.name || "N/A"}
                </span>
            ),
            sorter: (a: any, b: any) => (a.section?.name || "").localeCompare(b.section?.name || ""),
        },
        {
            title: "Due Date",
            dataIndex: "dueDate",
            render: (text: string) => (
                <span className={`fw-semibold ${new Date(text) < new Date() ? 'text-danger' : 'text-success'}`}>
                    {dayjs(text).format("DD-MM-YYYY")}
                </span>
            ),
            sorter: (a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text: string) => (
                <span className={`badge ${text === 'Pending' ? 'bg-warning' : text === 'Completed' ? 'bg-success' : 'bg-secondary'}`}>
                    {text || "Pending"}
                </span>
            ),
            sorter: (a: any, b: any) => (a.status || "").localeCompare(b.status || ""),
        },
        {
            title: "Attachment",
            dataIndex: "attachment",
            render: (text: string) => (
                text ? (
                    <a 
                        href={text} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm"
                    >
                        <i className="ti ti-download me-1"></i>
                        View
                    </a>
                ) : (
                    <span className="text-muted">No file</span>
                )
            ),
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (_: any, record: any) => (
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
                                data-bs-target="#edit_assignment"
                                onClick={() => openEditAssignmentModal(record.id)}
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
                                onClick={() => setDeleteId({ id: record.id, type: "assignment" })}
                            >
                                <i className="ti ti-trash-x me-2" />
                                Delete
                            </Link>
                        </li>
                    </ul>
                </div>
            ),
        },
    ];

    const homeworkColumns = [
        {
            title: "Subject",
            dataIndex: "subjectId",
            render: (text: string) => subjects.find(sub => sub.id === text)?.name || text,
            sorter: (a: Homework, b: Homework) => a.subjectId.localeCompare(b.subjectId),
        },
        {
            title: "Homework Date",
            dataIndex: "createdAt",
            render: (text: string) => dayjs(text).format("DD-MM-YYYY"),
            sorter: (a: Homework, b: Homework) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        },
        {
            title: "Submission Date",
            dataIndex: "dueDate",
            render: (text: string) => dayjs(text).format("DD-MM-YYYY"),
            sorter: (a: Homework, b: Homework) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (_: any, record: Homework) => (
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
                                data-bs-target={`#edit_home_work_${record.id}`}
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
                                onClick={() => setDeleteId({ id: record.id, type: "homework" })}
                            >
                                <i className="ti ti-trash-x me-2" />
                                Delete
                            </Link>
                        </li>
                    </ul>
                </div>
            ),
        },
    ];

    const currentDateTime = new Date(); 

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentClasses = (filteredClassList.length > 0 ? filteredClassList : classList).slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil((filteredClassList.length > 0 ? filteredClassList.length : classList.length) / itemsPerPage);

    const handleSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);
        setCurrentPage(1); // Reset to first page when searching
        if (searchTerm.trim() === "") {
            setFilteredClassList([]);
        } else {
            const filtered = classList.filter(cls => 
                cls.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredClassList(filtered);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <ToastContainer position="top-center" autoClose={3000} />
            <style>
                {`
                    .bg-gradient-primary {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    }
                    .bg-light-primary {
                        background-color: rgba(102, 126, 234, 0.1);
                    }
                    .bg-light-success {
                        background-color: rgba(40, 167, 69, 0.1);
                    }
                    .bg-light-info {
                        background-color: rgba(23, 162, 184, 0.1);
                    }
                    .file-upload-area {
                        transition: all 0.3s ease;
                        cursor: pointer;
                    }
                    .file-upload-area:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    }
                    .file-upload-area.border-primary:hover {
                        border-color: #667eea !important;
                        background-color: rgba(102, 126, 234, 0.15) !important;
                    }
                    .file-upload-area.border-success:hover {
                        border-color: #28a745 !important;
                        background-color: rgba(40, 167, 69, 0.15) !important;
                    }
                    .cursor-pointer {
                        cursor: pointer;
                    }
                    .pyq-upload-card {
                        transition: all 0.3s ease;
                    }
                    .pyq-upload-card:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 6px 20px rgba(0,0,0,0.1) !important;
                    }
                    .border-2 {
                        border-width: 2px !important;
                    }
                    .border-dashed {
                        border-style: dashed !important;
                    }
                    .transition-all {
                        transition: all 0.3s ease;
                    }
                    .hover-shadow:hover {
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                        transform: translateY(-2px);
                    }
                    .card.cursor-pointer {
                        transition: all 0.3s ease;
                    }
                    .card.cursor-pointer:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                    }
                    .badge.bg-primary-subtle {
                        background-color: rgba(102, 126, 234, 0.1) !important;
                        color: #667eea !important;
                    }
                    .badge.bg-info-subtle {
                        background-color: rgba(23, 162, 184, 0.1) !important;
                        color: #17a2b8 !important;
                    }
                    .badge.bg-warning-subtle {
                        background-color: rgba(255, 193, 7, 0.1) !important;
                        color: #ffc107 !important;
                    }
                    .table-responsive {
                        border-radius: 8px;
                        overflow: hidden;
                    }
                    .ant-table-thead > tr > th {
                        background-color: #f8f9fa !important;
                        border-bottom: 2px solid #dee2e6 !important;
                        font-weight: 600 !important;
                    }
                    .ant-table-tbody > tr:hover > td {
                        background-color: rgba(102, 126, 234, 0.05) !important;
                    }
                `}
            </style>
            <div className={isMobile ? "page-wrapper" : "pt-4"}>
                <div className="content">
                    <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
                        <div className="my-auto mb-2">
                            <h3 className="page-title mb-1">Academic Uploads</h3>
                        </div>
                        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                            <TooltipOption />
                            {(user.role === "admin" || user.role === "teacher") && selectedClass && (
                                <>
                                    <div className="mb-2 me-2">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm"
                                            data-bs-toggle="modal"
                                            data-bs-target="#add_pyq_upload"
                                        >
                                            <i className="ti ti-square-rounded-plus-filled me-2" /> Add PYQ
                                        </button>
                                    </div>
                                    <div className="mb-2 me-2">
                                        <Link
                                            to="#"
                                            className="btn btn-primary btn-sm"
                                            data-bs-toggle="modal"
                                            data-bs-target="#add_assignment"
                                        >
                                            <i className="ti ti-square-rounded-plus-filled me-2" /> Add Assignment
                                        </Link>
                                    </div>
                                    <div className="mb-2">
                                        <Link
                                            to="#"
                                            className="btn btn-primary btn-sm"
                                            data-bs-toggle="modal"
                                            data-bs-target="#add_home_work"
                                        >
                                            <i className="ti ti-square-rounded-plus-filled me-2" /> Add Homework
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                            <h4 className="mb-3">Class Management</h4>
                            <div className="d-flex align-items-center flex-wrap gap-2">
                                <div className="input-group" style={{ width: '300px' }}>
                                    <span className="input-group-text bg-light border-end-0">
                                        <i className="ti ti-search text-muted"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0"
                                        placeholder="Search classes..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={fetchClasses}
                                    className="btn btn-outline-primary btn-sm"
                                    disabled={loading}
                                >
                                    <i className="ti ti-refresh me-1"></i>
                                    {loading ? "Loading..." : "Refresh"}
                                </button>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            {loading ? (
                                <div className="text-center p-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2 text-muted">Loading classes...</p>
                                </div>
                            ) : classList.length === 0 ? (
                                <div className="text-center p-4">
                                    <i className="ti ti-school-off fs-1 text-muted mb-3"></i>
                                    <h5 className="text-muted">No Classes Found</h5>
                                    <p className="text-muted">No classes are available at the moment.</p>
                                    <button 
                                        onClick={fetchClasses} 
                                        className="btn btn-primary btn-sm"
                                    >
                                        <i className="ti ti-refresh me-1"></i>
                                        Refresh
                                    </button>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="border-0">
                                                    <div className="d-flex align-items-center">
                                                        <i className="ti ti-school me-2 text-primary"></i>
                                                        Class Name
                                                    </div>
                                                </th>
                                                <th className="border-0">
                                                    <i className="ti ti-book me-2 text-info"></i>
                                                    Subjects
                                                </th>
                                                <th className="border-0">
                                                    <i className="ti ti-users me-2 text-warning"></i>
                                                    Sections
                                                </th>
                                                <th className="border-0">
                                                    <i className="ti ti-user me-2 text-success"></i>
                                                    Students
                                                </th>
                                                <th className="border-0">
                                                    <i className="ti ti-file-text me-2 text-danger"></i>
                                                    Assignments
                                                </th>
                                                <th className="border-0 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentClasses.map((cls) => (
                                                <tr 
                                                    key={cls.id} 
                                                    className={`cursor-pointer transition-all ${selectedClass?.id === cls.id ? 'table-primary' : ''}`}
                                                    onClick={() => handleClassSelect(cls.id)}
                                                >
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className={`avatar avatar-sm me-3 ${selectedClass?.id === cls.id ? 'bg-primary' : 'bg-light'}`}>
                                                                <i className={`ti ti-school ${selectedClass?.id === cls.id ? 'text-white' : 'text-muted'}`}></i>
                                                            </div>
                                                            <div>
                                                                <h6 className={`mb-0 ${selectedClass?.id === cls.id ? 'text-primary fw-bold' : ''}`}>
                                                                    {cls.name}
                                                                </h6>
                                                                {selectedClass?.id === cls.id && (
                                                                    <small className="text-primary">
                                                                        <i className="ti ti-check me-1"></i>
                                                                        Selected
                                                                    </small>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-info-subtle text-info">
                                                            {cls.Subject?.length || 0} Subjects
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-warning-subtle text-warning">
                                                            {cls.Section?.length || 0} Sections
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-success-subtle text-success">
                                                            {cls.students?.length || 0} Students
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-danger-subtle text-danger">
                                                            {assignmentData.filter(a => a.classId === cls.id).length} Assignments
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <button
                                                            className={`btn btn-sm ${selectedClass?.id === cls.id ? 'btn-primary' : 'btn-outline-primary'}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleClassSelect(cls.id);
                                                            }}
                                                        >
                                                            {selectedClass?.id === cls.id ? (
                                                                <>
                                                                    <i className="ti ti-check me-1"></i>
                                                                    Active
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <i className="ti ti-arrow-right me-1"></i>
                                                                    Select
                                                                </>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {totalPages > 1 && (
                                        <div className="d-flex justify-content-between align-items-center p-3 border-top">
                                            <div className="text-muted">
                                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, (filteredClassList.length > 0 ? filteredClassList.length : classList.length))} of {(filteredClassList.length > 0 ? filteredClassList.length : classList.length)} classes
                                            </div>
                                            <nav aria-label="Class pagination">
                                                <ul className="pagination pagination-sm mb-0">
                                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => handlePageChange(currentPage - 1)}
                                                            disabled={currentPage === 1}
                                                        >
                                                            <i className="ti ti-chevron-left"></i>
                                                        </button>
                                                    </li>
                                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                        const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                                                        return (
                                                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                                <button
                                                                    className="page-link"
                                                                    onClick={() => handlePageChange(page)}
                                                                >
                                                                    {page}
                                                                </button>
                                                            </li>
                                                        );
                                                    })}
                                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => handlePageChange(currentPage + 1)}
                                                            disabled={currentPage === totalPages}
                                                        >
                                                            <i className="ti ti-chevron-right"></i>
                                                        </button>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    {selectedClass && (
                        <div className="card mt-3">
                            <div className="card-header bg-gradient-primary text-white">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <div className="avatar avatar-lg bg-white bg-opacity-25 rounded-circle me-3 d-flex align-items-center justify-content-center">
                                            <i className="ti ti-school fs-4 text-white"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-white mb-0">{selectedClass.name}</h4>
                                            <small className="text-white-50">
                                                {selectedClass.Subject?.length || 0} Subjects • {selectedClass.Section?.length || 0} Sections • {selectedClass.students?.length || 0} Students
                                            </small>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="badge bg-white bg-opacity-25 text-white me-2">
                                            <i className="ti ti-check me-1"></i>
                                            Active Class
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <Tabs
                                    defaultActiveKey="pyq"
                                    items={[
                                        {
                                            label: (
                                                <span>
                                                    <i className="ti ti-file-text me-2"></i>
                                                    PYQ Files
                                                    {pyqData.length > 0 && (
                                                        <span className="badge bg-primary ms-2">{pyqData.length}</span>
                                                    )}
                                                </span>
                                            ),
                                            key: "pyq",
                                            children: loading ? (
                                                <div className="text-center p-4">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <p className="mt-2 text-muted">Loading PYQ data...</p>
                                                </div>
                                            ) : pyqData.length === 0 ? (
                                                <div className="text-center p-4">
                                                    <i className="ti ti-file-off fs-1 text-muted mb-3"></i>
                                                    <h5 className="text-muted">No PYQ Files</h5>
                                                    <p className="text-muted">No PYQ files uploaded for this class yet.</p>
                                                </div>
                                            ) : (
                                                <div className="table-responsive">
                                                    <Table columns={pyqColumns} dataSource={pyqData} rowSelection={{}} />
                                                </div>
                                            ),
                                        },
                                        {
                                            label: (
                                                <span>
                                                    <i className="ti ti-book me-2"></i>
                                                    Assignments
                                                    {assignmentData.length > 0 && (
                                                        <span className="badge bg-success ms-2">{assignmentData.length}</span>
                                                    )}
                                                </span>
                                            ),
                                            key: "assignment",
                                            children: loading ? (
                                                <div className="text-center p-4">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <p className="mt-2 text-muted">Loading assignments...</p>
                                                </div>
                                            ) : assignmentData.length === 0 ? (
                                                <div className="text-center p-4">
                                                    <i className="ti ti-book-off fs-1 text-muted mb-3"></i>
                                                    <h5 className="text-muted">No Assignments</h5>
                                                    <p className="text-muted">No assignments created for this class yet.</p>
                                                </div>
                                            ) : (
                                                <div className="table-responsive">
                                                    <Table columns={assignmentColumns} dataSource={assignmentData} rowSelection={{}} />
                                                </div>
                                            ),
                                        },
                                        {
                                            label: (
                                                <span>
                                                    <i className="ti ti-home me-2"></i>
                                                    Homework
                                                    {homeworkData.length > 0 && (
                                                        <span className="badge bg-warning ms-2">{homeworkData.length}</span>
                                                    )}
                                                </span>
                                            ),
                                            key: "homework",
                                            children: loading ? (
                                                <div className="text-center p-4">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <p className="mt-2 text-muted">Loading homework...</p>
                                                </div>
                                            ) : homeworkData.length === 0 ? (
                                                <div className="text-center p-4">
                                                    <i className="ti ti-home-off fs-1 text-muted mb-3"></i>
                                                    <h5 className="text-muted">No Homework</h5>
                                                    <p className="text-muted">No homework assigned for this class yet.</p>
                                                </div>
                                            ) : (
                                                <div className="table-responsive">
                                                    <Table columns={homeworkColumns} dataSource={homeworkData} rowSelection={{}} />
                                                </div>
                                            ),
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="modal fade" id="add_pyq_upload">
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content border-0 shadow-lg">
                        <div className="modal-header bg-gradient-primary text-white border-0">
                            <div className="d-flex align-items-center">
                                <div className="avatar avatar-lg bg-white bg-opacity-25 rounded-circle me-3 d-flex align-items-center justify-content-center">
                                    <i className="ti ti-file-text fs-4 text-white"></i>
                                </div>
                                <div>
                                    <h4 className="modal-title text-white mb-0">Upload PYQ Files</h4>
                                    <small className="text-white-50">Previous Year Question Papers</small>
                                </div>
                            </div>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close">
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <form onSubmit={handlePyqUpload}>
                            <div className="modal-body p-4">
                                <div className="alert alert-info border-0 bg-light-info">
                                    <div className="d-flex align-items-center">
                                        <i className="ti ti-info-circle fs-4 text-info me-2"></i>
                                        <div>
                                            <strong>Upload Guidelines:</strong>
                                            <ul className="mb-0 mt-1">
                                                <li>Only PDF files are allowed (max {MAX_SIZE_MB}MB)</li>
                                                <li>Question file is required, solution file is optional</li>
                                                <li>Select appropriate subject and topic for better organization</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                {newPyqContents.map((content, index) => (
                                    <div className="pyq-upload-card mb-4 border rounded-3 p-4 shadow-sm bg-light" key={index}>
                                        <div className="d-flex align-items-start justify-content-between mb-3">
                                            <h6 className="mb-0 text-primary">
                                                <i className="ti ti-file-plus me-2"></i>
                                                File Set #{index + 1}
                                            </h6>
                                            {newPyqContents.length > 1 && (
                                                <button 
                                                    type="button" 
                                                    className="btn btn-outline-danger btn-sm" 
                                                    onClick={() => removePyqContent(index)}
                                                >
                                                    <i className="ti ti-trash me-1"></i> Remove
                                                </button>
                                            )}
                                        </div>
                                        
                                <div className="row g-3">
                                    <div className="col-md-6">
                                                <div className="upload-field">
                                                    <label className="form-label fw-semibold">
                                                        <i className="ti ti-file-question me-1 text-primary"></i>
                                                        Question PDF *
                                                    </label>
                                                    <div className="file-upload-area border-2 border-dashed border-primary rounded-3 p-3 text-center bg-light-primary">
                                            <input
                                                type="file"
                                                            accept="application/pdf"
                                                            className="form-control d-none"
                                                            id={`question-${index}`}
                                                            onChange={e => handlePyqFileChange(e, index, "question")}
                                                        />
                                                        <label htmlFor={`question-${index}`} className="cursor-pointer mb-0">
                                                            {content.question ? (
                                                                <div className="text-success">
                                                                    <i className="ti ti-check-circle fs-2 mb-2"></i>
                                                                    <p className="mb-1 fw-semibold">{content.question.name}</p>
                                                                    <small className="text-muted">
                                                                        {(content.question.size / 1024 / 1024).toFixed(2)} MB
                                                                    </small>
                                        </div>
                                                            ) : (
                                                                <div className="text-muted">
                                                                    <i className="ti ti-upload fs-2 mb-2"></i>
                                                                    <p className="mb-1">Click to upload question PDF</p>
                                                                    <small>or drag and drop</small>
                                    </div>
                                                            )}
                                                        </label>
                                        </div>
                                    </div>
                                </div>
                                            
                                    <div className="col-md-6">
                                                <div className="upload-field">
                                                    <label className="form-label fw-semibold">
                                                        <i className="ti ti-file-check me-1 text-success"></i>
                                                        Solution PDF (Optional)
                                                    </label>
                                                    <div className="file-upload-area border-2 border-dashed border-success rounded-3 p-3 text-center bg-light-success">
                                            <input
                                                type="file"
                                                            accept="application/pdf"
                                                            className="form-control d-none"
                                                            id={`solution-${index}`}
                                                            onChange={e => handlePyqFileChange(e, index, "solution")}
                                                        />
                                                        <label htmlFor={`solution-${index}`} className="cursor-pointer mb-0">
                                                            {content.solution ? (
                                                                <div className="text-success">
                                                                    <i className="ti ti-check-circle fs-2 mb-2"></i>
                                                                    <p className="mb-1 fw-semibold">{content.solution.name}</p>
                                                                    <small className="text-muted">
                                                                        {(content.solution.size / 1024 / 1024).toFixed(2)} MB
                                                                    </small>
                                        </div>
                                                            ) : (
                                                                <div className="text-muted">
                                                                    <i className="ti ti-upload fs-2 mb-2"></i>
                                                                    <p className="mb-1">Click to upload solution PDF</p>
                                                                    <small>or drag and drop</small>
                                    </div>
                                                            )}
                                                        </label>
                                        </div>
                                    </div>
                                        </div>
                                            
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                                    <label className="form-label fw-semibold">
                                                        <i className="ti ti-book me-1 text-info"></i>
                                                        Subject *
                                                    </label>
                                            <select
                                                        className="form-select border-2"
                                                        value={content.subjectId}
                                                        onChange={e => handlePyqSubjectChange(index, e.target.value)}
                                                required
                                            >
                                                <option value="">Select Subject</option>
                                                {subjects.map(sub => (
                                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                            
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                                    <label className="form-label fw-semibold">
                                                        <i className="ti ti-tag me-1 text-warning"></i>
                                                        Topic *
                                                    </label>
                                            <input
                                                type="text"
                                                        className="form-control border-2"
                                                        placeholder="e.g., Algebra, Calculus, etc."
                                                        value={content.topic}
                                                        onChange={e => handlePyqInputChange(index, "topic", e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                            </div>
                                        </div>
                                ))}
                                
                                <div className="text-center">
                                    <button type="button" onClick={addPyqContent} className="btn btn-outline-primary btn-lg">
                                        <i className="ti ti-plus me-2"></i>
                                        Add Another File Set
                                    </button>
                                </div>
                        </div>
                            <div className="modal-footer bg-light border-0">
                                <button type="button" className="btn btn-secondary btn-lg me-2" data-bs-dismiss="modal">
                                    <i className="ti ti-x me-1"></i>
                                        Cancel
                                    </button>
                                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <i className="ti ti-upload me-1"></i>
                                            Upload PYQ Files
                                        </>
                                    )}
                                    </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcademicUploads;
