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
    const statusOptions = [
        { value: "PENDING", label: "Pending" },
        { value: "COMPLETED", label: "Completed" },
        { value: "IN_PROGRESS", label: "In Progress" },
    ];

    const fetchClasses = useCallback(async () => {
        try {
            const teacherId = localStorage.getItem("teacherId") || "";
            const response = user.role === "admin"
                ? await getClassByschoolId(localStorage.getItem("schoolId") ?? "")
                : await getClassesByTeacherId(teacherId);
            const res = await getLessonByteacherId(teacherId);
            setTimetable(res?.data  as any|| []);
            setClassList(response?.data?.classes.map(cls => ({
                ...cls,
                Subject: cls.Subject?.map(sub => ({ ...sub, status: sub.status || "Active" })) || [],
                Section: cls.Section || [],
                section: cls.Section?.map(sec => sec.name).join(", ") || cls.section || "N/A",
            })) || []);
        } catch (error) {
            toast.error("Failed to load classes", { autoClose: 3000 });
        }
    }, [user.role]);

    const fetchStudents = useCallback(async (classId: string) => {
        try {
            const response = await getAllStudentsInAclass(classId);
            return response?.data?.students
                .filter(student => student.classId === classId)
                .map(student => ({
                    id: student.id,
                    key: student.id,
                    admissionNo: student.admissionNo || `A${student.id}`,
                    rollNo: student.rollNo || `R${student.id}`,
                    name: student?.user?.name,
                    classId: classList.find(cls => cls.id === classId)?.name || "",
                    sectionId: classList.find(cls => cls.id === classId)?.Section?.find(sec => sec.id === student.sectionId)?.name || student.sectionId,
                    attendance: student.attendance || "Present",
                    present: student.attendance === "Present",
                    absent: student.attendance === "Absent",
                    notes: student.notes || "",
                    img: student?.user.profilePic || "",
                })) || [];
        } catch (error) {
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
            const response = await getPYQById(localStorage.getItem("userId") ?? "");
            setPyqData(response.data.filter(pyq => pyq.classId === classId) || []);
        } catch (error) {
            toast.error("Failed to load PYQ data", { autoClose: 3000 });
        }
    }, []);

    const fetchAssignmentData = useCallback(async (classId: string) => {
        try {
            const response: AxiosResponse<Iassignment[]> = await getAssignments();
            setAssignmentData(response.data.filter(assignment => assignment.classId === classId) || []);
        } catch (error) {
            toast.error("Failed to load assignments", { autoClose: 3000 });
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
            },
        ]);
    };

    const removePyqContent = (index: number) => {
        setNewPyqContents(prev => prev.filter((_, i) => i !== index));
    };

    const handlePyqUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validFiles = newPyqContents.filter(
            content => content.question && content.subjectId && content.topic && content.uploaderId && selectedClass?.id
        );
        if (validFiles.length === 0) {
            toast.error("Please select a valid PDF, subject, topic, and class", { autoClose: 3000 });
            return;
        }
        try {
            setLoading(true);
            for (const content of validFiles) {
                const formData = new FormData();
                if (content.question) formData.append("question", content.question);
                if (content.solution) formData.append("solution", content.solution);
                formData.append("subjectId", content.subjectId);
                formData.append("topic", content.topic);
                formData.append("uploaderId", content.uploaderId);
                formData.append("classId", selectedClass!.id);
                await createPYQ(formData as any);
            }
            closeModal("add_pyq_upload");
            toast.success("PYQ uploaded successfully", { autoClose: 3000 });
            setNewPyqContents([{
                question: null,
                solution: null,
                subjectId: "",
                topic: "",
                uploaderId: localStorage.getItem("userId") ?? "",
            }]);
            fetchPyqData(selectedClass!.id);
        } catch (error) {
            toast.error("Upload failed", { autoClose: 3000 });
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
            sorter: (a: Iassignment, b: Iassignment) => a.title.localeCompare(b.title),
        },
        {
            title: "Class",
            dataIndex: "classId",
            render: (text: string) => classList.find(cls => cls.id === text)?.name || text,
            sorter: (a: Iassignment, b: Iassignment) => a.classId.localeCompare(b.classId),
        },
        {
            title: "Section",
            dataIndex: "sectionId",
            render: (text: string, record: Iassignment) => {
                const cls = classList.find(cls => cls.id === record.classId);
                return cls?.Section?.find(sec => sec.id === text)?.name || text;
            },
            sorter: (a: Iassignment, b: Iassignment) => (a.sectionId || "").localeCompare(b.sectionId || ""),
        },
        {
            title: "Subject",
            dataIndex: "subjectId",
            render: (text: string) => subjects.find(sub => sub.id === text)?.name || text,
            sorter: (a: Iassignment, b: Iassignment) => a.subjectId.localeCompare(b.subjectId),
        },
        {
            title: "Due Date",
            dataIndex: "dueDate",
            render: (text: string) => dayjs(text).format("DD-MM-YYYY"),
            sorter: (a: Iassignment, b: Iassignment) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (_: any, record: Iassignment) => (
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

    return (
        <div>
            <ToastContainer position="top-center" autoClose={3000} />
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
                            <h4 className="mb-3">Classes</h4>
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
                                        <i className="ti ti-filter me-2" /> Filter
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
                                                            <label className="form-label">Class</label>
                                                            <select
                                                                className="form-select"
                                                                onChange={e => handleClassSelect(e.target.value)}
                                                            >
                                                                <option value="">Select Class</option>
                                                                {classList.map(cls => (
                                                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-3 d-flex align-items-center justify-content-end">
                                                <Link to="#" className="btn btn-light me-3">
                                                    Reset
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
                                        <i className="ti ti-sort-ascending-2 me-2" /> Sort by A-Z
                                    </Link>
                                    <ul className="dropdown-menu p-3">
                                        <li><Link to="#" className="dropdown-item rounded-1 active">Ascending</Link></li>
                                        <li><Link to="#" className="dropdown-item rounded-1">Descending</Link></li>
                                        <li><Link to="#" className="dropdown-item rounded-1">Recently Viewed</Link></li>
                                        <li><Link to="#" className="dropdown-item rounded-1">Recently Added</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0 py-3">
                            <Table columns={classColumns} dataSource={classList} rowSelection={{}} />
                        </div>
                    </div>
                    {selectedClass && (
                        <div className="card mt-3">
                            <div className="card-body">
                                <Tabs
                                    defaultActiveKey="pyq"
                                    items={[
                                        {
                                            label: "PYQ",
                                            key: "pyq",
                                            children: <Table columns={pyqColumns} dataSource={pyqData} rowSelection={{}} />,
                                        },
                                        {
                                            label: "Assignment",
                                            key: "assignment",
                                            children: <Table columns={assignmentColumns} dataSource={assignmentData} rowSelection={{}} />,
                                        },
                                        {
                                            label: "Homework",
                                            key: "homework",
                                            children: <Table columns={homeworkColumns} dataSource={homeworkData} rowSelection={{}} />,
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
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h4 className="modal-title text-white">Add PYQ</h4>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close">
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <form onSubmit={handlePyqUpload}>
                            <div className="modal-body p-4">
                                {newPyqContents.map((content, index) => (
                                    <div className="pyq-upload-add mb-4 border rounded-lg p-3 shadow-sm" key={index}>
                                        <div className="d-flex align-items-center flex-wrap gap-3">
                                            <div className="flex-fill">
                                                <div className="mb-3">
                                                    <label className="form-label">Select Question PDF</label>
                                                    <input
                                                        type="file"
                                                        accept="application/pdf"
                                                        className="form-control"
                                                        onChange={e => handlePyqFileChange(e, index, "question")}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Select Solution PDF (Optional)</label>
                                                    <input
                                                        type="file"
                                                        accept="application/pdf"
                                                        className="form-control"
                                                        onChange={e => handlePyqFileChange(e, index, "solution")}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Subject</label>
                                                    <select
                                                        className="form-select"
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
                                                <div className="mb-3">
                                                    <label className="form-label">Topic</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={content.topic}
                                                        onChange={e => handlePyqInputChange(index, "topic", e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            {newPyqContents.length > 1 && (
                                                <div className="mb-3">
                                                    <button type="button" className="btn btn-danger" onClick={() => removePyqContent(index)}>
                                                        <i className="ti ti-trash me-1" /> Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="text-center">
                                    <button type="button" onClick={addPyqContent} className="btn btn-outline-primary">
                                        <i className="ti ti-square-rounded-plus-filled me-2" /> Add Another File
                                    </button>
                                </div>
                            </div>
                            <div className="modal-footer bg-light">
                                <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? "Uploading..." : "Upload PYQ"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="add_assignment">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h4 className="modal-title text-white">Add Assignment</h4>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close">
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <form onSubmit={handleAssignmentUpload}>
                            <div className="modal-body p-4">
                                <div className="row g-3">
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newAssignment.title}
                                                onChange={e => handleAssignmentChange("title", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Class</label>
                                            <select
                                                className="form-select"
                                                value={newAssignment.classId}
                                                onChange={e => {
                                                    handleAssignmentChange("classId", e.target.value);
                                                    handleAssignmentChange("sectionId", ""); // Reset section
                                                }}
                                                required
                                            >
                                                <option value="">Select Class</option>
                                                {classList.map(cls => (
                                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Section</label>
                                            <select
                                                className="form-select"
                                                value={newAssignment.sectionId}
                                                onChange={e => handleAssignmentChange("sectionId", e.target.value)}
                                                required
                                                disabled={!newAssignment.classId}
                                            >
                                                <option value="">Select Section</option>
                                                {newAssignment.classId &&
                                                    classList
                                                        .find(cls => cls.id === newAssignment.classId)
                                                        ?.Section?.map(sec => (
                                                            <option key={sec.id} value={sec.id}>{sec.name}</option>
                                                        ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Subject</label>
                                            <select
                                                className="form-select"
                                                value={newAssignment.subjectId}
                                                onChange={e => handleAssignmentChange("subjectId", e.target.value)}
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
                                            <label className="form-label">Due Date</label>
                                            <DatePicker
                                                className="form-control"
                                                format="DD-MM-YYYY"
                                                onChange={(date: Dayjs | null) => handleAssignmentChange("dueDate", date ? date.toDate() : null)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3" style={{ minWidth: 150 }}>
                                            <label className="form-label">Time Table</label>
                                            {filteredLessons.length > 1 ? (
                                                <select
                                                    className="form-control"
                                                    value={newAssignment.lessonId}
                                                    onChange={(e) => handleAssignmentChange("lessonId", e.target.value)}
                                                    disabled={!newAssignment.subjectId}
                                                >
                                                    <option value="">Select Lesson</option>
                                                    {filteredLessons.map((lesson) => (
                                                        <option key={lesson.id} value={lesson.id}>
                                                            {`${lesson.day} (${new Date(lesson.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} - ${new Date(lesson.endTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })})`}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={filteredLessons.length === 1 ? filteredLessons[0].day : "No lesson selected"}
                                                    readOnly
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Attachment</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={e => handleAssignmentChange("attachment", e.target.files?.[0] || null)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                className="form-control"
                                                rows={4}
                                                value={newAssignment.description}
                                                onChange={e => handleAssignmentChange("description", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer bg-light">
                                <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? "Uploading..." : "Add Assignment"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="add_home_work">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h4 className="modal-title text-white">Add Homework</h4>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close">
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <form onSubmit={handleHomeworkUpload}>
                            <div className="modal-body p-4">
                                <div className="row g-3">
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newHomework.title}
                                                onChange={e => handleHomeworkChange("title", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Class</label>
                                            <select
                                                className="form-select"
                                                value={newHomework.classId}
                                                onChange={e => handleHomeworkChange("classId", e.target.value)}
                                            >
                                                <option value="">Select Class</option>
                                                {classList.map(cls => (
                                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Section</label>
                                            <select
                                                className="form-select"
                                                value={newHomework.sectionId}
                                                onChange={e => handleHomeworkChange("sectionId", e.target.value)}
                                                disabled={!newHomework.classId}
                                            >
                                                <option value="">Select Section</option>
                                                {newHomework.classId &&
                                                    classList
                                                        .find(cls => cls.id === newHomework.classId)
                                                        ?.Section?.map(sec => (
                                                            <option key={sec.id} value={sec.id}>{sec.name}</option>
                                                        ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Subject</label>
                                            <select
                                                className="form-select"
                                                value={newHomework.subjectId}
                                                onChange={e => handleHomeworkChange("subjectId", e.target.value)}
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
                                            <label className="form-label">Homework Date</label>
                                            <DatePicker
                                                className="form-control"
                                                format="DD-MM-YYYY"
                                                onChange={(date: Dayjs | null) => handleHomeworkChange("createdAt", date ? date.toDate() : null)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Submission Date</label>
                                            <DatePicker
                                                className="form-control"
                                                format="DD-MM-YYYY"
                                                onChange={(date: Dayjs | null) => handleHomeworkChange("dueDate", date ? date.toDate() : null)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Attachment</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={e => handleHomeworkChange("attachment", e.target.files?.[0] || null)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                className="form-control"
                                                rows={4}
                                                value={newHomework.description}
                                                onChange={e => handleHomeworkChange("description", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Status</label>
                                            <select
                                                className="form-select"
                                                value={newHomework.status}
                                                onChange={e => handleHomeworkChange("status", e.target.value)}
                                            >
                                                {statusOptions.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            <div className="modal-footer bg-light">
                                <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? "Submitting..." : "Add Homework"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="edit_assignment">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h4 className="modal-title text-white">Edit Assignment</h4>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close">
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <form onSubmit={handleEditAssignment}>
                            <div className="modal-body p-4">
                                <div className="row g-3">
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editAssignment?.title || ""}
                                                onChange={e => handleEditAssignmentChange("title", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Class</label>
                                            <select
                                                className="form-select"
                                                value={editAssignment?.classId || ""}
                                                onChange={e => handleEditAssignmentChange("classId", e.target.value)}
                                                required
                                            >
                                                <option value="">Select Class</option>
                                                {classList.map(cls => (
                                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Section</label>
                                            <select
                                                className="form-select"
                                                value={editAssignment?.sectionId || ""}
                                                onChange={e => handleEditAssignmentChange("sectionId", e.target.value)}
                                                required
                                                disabled={!editAssignment?.classId}
                                            >
                                                <option value="">Select Section</option>
                                                {editAssignment?.classId &&
                                                    classList
                                                        .find(cls => cls.id === editAssignment.classId)
                                                        ?.Section?.map(sec => (
                                                            <option key={sec.id} value={sec.id}>{sec.name}</option>
                                                        ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Subject</label>
                                            <select
                                                className="form-select"
                                                value={editAssignment?.subjectId || ""}
                                                onChange={e => handleEditAssignmentChange("subjectId", e.target.value)}
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
                                            <label className="form-label">Due Date</label>
                                            <DatePicker
                                                className="form-control"
                                                format="DD-MM-YYYY"
                                                value={editAssignment?.dueDate ? dayjs(editAssignment.dueDate) : null}
                                                onChange={(date: Dayjs | null) => handleEditAssignmentChange("dueDate", date ? date.toDate() : null)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Lesson ID (Optional)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editAssignment?.lessonId || ""}
                                                onChange={e => handleEditAssignmentChange("lessonId", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                className="form-control"
                                                rows={4}
                                                value={editAssignment?.description || ""}
                                                onChange={e => handleEditAssignmentChange("description", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer bg-light">
                                <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? "Updating..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {homeworkData.map(record => (
                <div className="modal fade" id={`edit_home_work_${record.id}`} key={record.id}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h4 className="modal-title text-white">Edit Homework</h4>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close">
                                    <i className="ti ti-x" />
                                </button>
                            </div>
                            <form onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                                e.preventDefault();
                                try {
                                    await updateHomework(record.id, { ...record, ...newHomework as any });
                                    closeModal(`edit_home_work_${record.id}`);
                                    toast.success("Homework updated successfully", { autoClose: 3000 });
                                    fetchHomeworkData(selectedClass!.id);
                                } catch (error) {
                                    toast.error("Failed to update homework", { autoClose: 3000 });
                                }
                            }}>
                                <div className="modal-body p-4">
                                    <div className="row g-3">
                                        <div className="col-md-12">
                                            <div className="mb-3">
                                                <label className="form-label">Title</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    defaultValue={record.title}
                                                    onChange={e => handleHomeworkChange("title", e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Class</label>
                                                <select
                                                    className="form-select"
                                                    defaultValue={record.classId}
                                                    onChange={e => handleHomeworkChange("classId", e.target.value)}
                                                >
                                                    <option value="">Select Class</option>
                                                    {classList.map(cls => (
                                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Section</label>
                                                <select
                                                    className="form-select"
                                                    defaultValue={record.sectionId}
                                                    onChange={e => handleHomeworkChange("sectionId", e.target.value)}
                                                    disabled={!record.classId}
                                                >
                                                    <option value="">Select Section</option>
                                                    {record.classId &&
                                                        classList
                                                            .find(cls => cls.id === record.classId)
                                                            ?.Section?.map(sec => (
                                                                <option key={sec.id} value={sec.id}>{sec.name}</option>
                                                            ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Subject</label>
                                                <select
                                                    className="form-select"
                                                    defaultValue={record.subjectId}
                                                    onChange={e => handleHomeworkChange("subjectId", e.target.value)}
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
                                                <label className="form-label">Homework Date</label>
                                                <DatePicker
                                                    className="form-control"
                                                    format="DD-MM-YYYY"
                                                    value={dayjs(record.createdAt)}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Submission Date</label>
                                                <DatePicker
                                                    className="form-control"
                                                    format="DD-MM-YYYY"
                                                    defaultValue={dayjs(record.dueDate)}
                                                    onChange={(date: Dayjs | null) => handleHomeworkChange("dueDate", date ? date.toDate() : null)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Attachment</label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    onChange={e => handleHomeworkChange("attachment", e.target.files?.[0] || null)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="mb-3">
                                                <label className="form-label">Description</label>
                                                <textarea
                                                    className="form-control"
                                                    rows={4}
                                                    defaultValue={record.description}
                                                    onChange={e => handleHomeworkChange("description", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Status</label>
                                                <select
                                                    className="form-select"
                                                    defaultValue={record.status}
                                                    onChange={e => handleHomeworkChange("status", e.target.value)}
                                                >
                                                    {statusOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light">
                                    <Link to="#" className="btn btn-secondary me-2" data-bs-dismiss="modal">
                                        Cancel
                                    </Link>
                                    <button type="submit" className="btn btn-primary">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ))}
            <div className="modal fade" id="delete-modal">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form>
                            <div className="modal-body text-center p-4">
                                <span className="delete-icon text-danger">
                                    <span className="ti ti-trash-x fs-2" />
                                </span>
                                <h4 className="mt-3">Confirm Deletion</h4>
                                <p className="text-muted">You want to delete this item? This action cannot be undone.</p>
                                <div className="d-flex justify-content-center mt-4">
                                    <button type="button" className="btn btn-light me-3" data-bs-dismiss="modal">
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => deleteId && handleDelete(deleteId.id, deleteId.type)}
                                        data-bs-dismiss="modal"
                                    >
                                        Yes, Delete
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcademicUploads;
