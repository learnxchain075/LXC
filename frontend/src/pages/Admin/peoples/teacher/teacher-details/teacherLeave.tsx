import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { all_routes } from "../../../../../router/all_routes";
import useMobileDetection from "../../../../../core/common/mobileDetection";
import { useSelector } from "react-redux";
import {
  getAllStudentsInAclass,
  getClassByschoolId,
  getClassesByTeacherId,
} from "../../../../../services/teacher/classServices";
import { getLessonByteacherId } from "../../../../../services/teacher/lessonServices";
import {
  createLeaveRequest,
  getMyLeaves,
  getAllLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
  getLeaveRequestsBySchool,
} from "../../../../../services/teacher/leaveService";

import { ILeaveRequest } from "../../../../../services/types/teacher/ILeaveRequest";
import {
  AttendancePayload,
} from "../../../../../services/types/teacher/attendanceService";
import { markMultipleAttendance } from "../../../../../services/teacher/attendanceService";
import PredefinedDateRanges from "../../../../../core/common/datePicker";
import TeacherModal from "../teacherModal";
import { getTeacherById } from "../../../../../services/admin/teacherRegistartion";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
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

interface Lesson {
  id: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  class: {
    id: string;
    name: string;
    section: string;
    classId: string;
    schoolId: string;
    capacity: number;
    roomNumber: string | null;
  };
  subject: { id: string; name: string; code: string; classId: string; status: string };
  type: number;
}

interface TeacherLeaveProps {
  teacherdata?: any;
}

const TeacherLeave = ({ teacherdata }: TeacherLeaveProps) => {
  const routes = all_routes;
  const isMobile = useMobileDetection();
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const user = useSelector((state: any) => state.auth.userObj);
  const isDark = dataTheme === "dark_data_theme";
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [classList, setClassList] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [timetable, setTimetable] = useState<Lesson[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [studentLeaveRequests, setStudentLeaveRequests] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [localTeacherData, setLocalTeacherData] = useState<any>(null);
  const [loadingLeaveRequests, setLoadingLeaveRequests] = useState(false);

  const [leaveForm, setLeaveForm] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });
  const [filterFormData, setFilterFormData] = useState({
    classId: "",
    sectionId: "",
    name: "",
    admissionNo: "",
    rollNo: "",
  });
  const [addFormData, setAddFormData] = useState({
    classId: "",
    sectionId: "",
    subjectId: "",
    status: "",
  });
  const [filterErrors, setFilterErrors] = useState<{
    classId?: string;
    sectionId?: string;
  }>({});
  const [addErrors, setAddErrors] = useState<{
    classId?: string;
    sectionId?: string;
    subjectId?: string;
  }>({});


  const fetchTeacherDetails = async () => {
    try {
      setIsDataLoading(true); 
      const response = await getTeacherById(localStorage.getItem("teacherId") ?? "");
      if (response.status === 200) {
        const teacherDetails = response.data;
        // console.log("Teacher Details:", teacherDetails);
        setLocalTeacherData(teacherDetails);
      } else {
        console.error("Failed to fetch teacher details");
        toast.error("Failed to fetch teacher details");
      }
    } catch (error) {
      console.error("Error fetching teacher details:", error);
      toast.error("Error fetching teacher details");
    } finally {
      setIsDataLoading(false);
    }
  };


  useEffect(() => {
    if (teacherdata) {
      setLocalTeacherData(teacherdata);
      setIsDataLoading(false);
    } else {
      fetchTeacherDetails();
    }
  }, [teacherdata, user?.role]);

  type LeaveType = "Medical Leave" | "Casual Leave" | "Maternity Leave" | "Sick Leave";
 
  const staticLeaveBalances: Record<LeaveType, { total: number; used: number }> = {
    "Medical Leave": {
      total: parseInt(localTeacherData?.medicalLeave) || 0,
      used: 0,
    },
    "Casual Leave": {
      total: parseInt(localTeacherData?.casualLeave) || 0,
      used: 0,
    },
    "Maternity Leave": {
      total: parseInt(localTeacherData?.maternityLeave) || 0,
      used: 0,
    },
    "Sick Leave": {
      total: parseInt(localTeacherData?.sickLeave) || 0,
      used: 0,
    },
  };
  const [leaveBalances, setLeaveBalances] = useState(staticLeaveBalances);

  const currentDateTime = new Date(); // Updated to use current date
  const currentDateStr = currentDateTime.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Skeleton Placeholder Component
  const SkeletonPlaceholder = ({ className = "" }) => (
    <span className={`placeholder bg-secondary ${className}`} />
  );

  useEffect(() => {
    if (user?.user) {
      setAttendance((prev) => {
        if (!prev.find((att: any) => att.date === currentDateStr)) {
          return [
            ...prev,
            {
              date: currentDateStr,
              status: "Present",
              timestamp: currentDateTime.toLocaleTimeString("en-IN", {
                hour12: true,
              }),
            },
          ];
        }
        return prev;
      });
    } else {
      setAttendance((prev) => {
        if (!prev.find((att: any) => att.date === currentDateStr)) {
          return [
            ...prev,
            {
              date: currentDateStr,
              status: "Absent",
              timestamp: currentDateTime.toLocaleTimeString("en-IN", {
                hour12: true,
              }),
            },
          ];
        }
        return prev;
      });
    }
  }, [user, currentDateStr]);

  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true);
      try {
        if (user.role === "admin") {
          const classesResponse = await getClassByschoolId(
            localStorage.getItem("schoolId") as string
          );
          setClassList(Array.isArray(classesResponse.data) ? classesResponse.data : []);
        } else if (user.role === "teacher") {
          const teacherId = localStorage.getItem("teacherId") as string;
          const [lessonsResponse, classesResponse] = await Promise.all([
            getLessonByteacherId(teacherId),
            getClassesByTeacherId(teacherId),
          ]);
          setTimetable(lessonsResponse?.data as any || []);
          
       
          let classesData = [];
          const responseData = (classesResponse as any)?.data;
          
          if (responseData?.data && Array.isArray(responseData.data)) {
            classesData = responseData.data;
          } else if (responseData?.classes && Array.isArray(responseData.classes)) {
            classesData = responseData.classes;
          } else if (Array.isArray(responseData)) {
            classesData = responseData;
          } else if (Array.isArray(classesResponse)) {
            classesData = classesResponse;
          }
          
          setClassList(classesData);
        }

        const leavesResponse = await getMyLeaves();
        const leaveData = leavesResponse.data.map((leave: ILeaveRequest) => ({
          id: leave?.id || "",
          leaveType: leave.reason.split(":")[0].trim(),
          leaveDate: `${new Date(leave.fromDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          })} - ${new Date(leave.toDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          })}`,
          noOfDays:
            Math.ceil(
              (new Date(leave.toDate).getTime() - new Date(leave.fromDate).getTime()) /
                (1000 * 60 * 60 * 24)
            ) + 1,
          appliedOn: new Date(leave.fromDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status: leave.status
            ? leave.status.charAt(0).toUpperCase() + leave.status.slice(1)
            : "",
        }));
        setLeaves(leaveData);

        const usedDays = leaveData.reduce((acc: any, leave: any) => {
          const type = leave.leaveType;
          acc[type] = (acc[type] || 0) + leave.noOfDays;
          return acc;
        }, {});
        setLeaveBalances((prev) => {
          const updated = { ...prev };
          (Object.keys(usedDays) as LeaveType[]).forEach((type) => {
            if (updated[type]) {
              updated[type] = { ...updated[type], used: usedDays[type] };
            }
          });
          return updated;
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsDataLoading(false);
      }
    };
   
    if (localTeacherData) {
      fetchData();
    } else {
      setIsDataLoading(false); 
    }
  }, [user.role, localTeacherData]);

  // Fetch student leave requests
  const fetchStudentLeaveRequests = useCallback(async () => {
    if (user.role !== "teacher") return;
    
    setLoadingLeaveRequests(true);
    try {
      const schoolId = localStorage.getItem("schoolId");
      if (!schoolId) {
        toast.error("School ID not found");
        return;
      }
console.log("object",schoolId);
      const response = await getLeaveRequestsBySchool(schoolId);
      
      const allLeaveRequests = response.data || [];
      
      // Filter for student leave requests that are pending approval
      const studentRequests = allLeaveRequests.filter((request: any) => {
        return request.user?.role === "student" && 
               request.status === "pending" &&
               request.user?.student?.schoolId === schoolId;
      });

      const processedRequests = studentRequests.map((request: any) => ({
        id: request.id,
        studentName: request.user?.name || "Unknown Student",
        studentId: request.user?.id,
        admissionNo: request.user?.student?.admissionNo || "N/A",
        classId: request.user?.student?.classId || "N/A",
        sectionId: request.user?.student?.sectionId || "N/A",
        leaveType: request.reason.split(":")[0].trim(),
        reason: request.reason.split(":").slice(1).join(":").trim(),
        fromDate: new Date(request.fromDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        toDate: new Date(request.toDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        noOfDays: Math.ceil(
          (new Date(request.toDate).getTime() - new Date(request.fromDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1,
        appliedOn: new Date(request.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: request.status || "pending",
      }));

      setStudentLeaveRequests(processedRequests);
    } catch (error) {
      console.error("Error fetching student leave requests:", error);
      toast.error("Failed to load student leave requests");
    } finally {
      setLoadingLeaveRequests(false);
    }
  }, [user.role]);

  // Handle approve/reject leave requests
  const handleApproveLeave = async (leaveId: string) => {
    try {
      await approveLeaveRequest(leaveId);
      toast.success("Leave request approved successfully");
      fetchStudentLeaveRequests(); // Refresh the list
    } catch (error) {
      console.error("Error approving leave request:", error);
      toast.error("Failed to approve leave request");
    }
  };

  const handleRejectLeave = async (leaveId: string) => {
    try {
      await rejectLeaveRequest(leaveId);
      toast.success("Leave request rejected successfully");
      fetchStudentLeaveRequests(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting leave request:", error);
      toast.error("Failed to reject leave request");
    }
  };

  useEffect(() => {
    if (localTeacherData && user.role === "teacher") {
      fetchStudentLeaveRequests();
    }
  }, [localTeacherData, user.role, fetchStudentLeaveRequests]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (addFormData.classId && addFormData.sectionId) {
        setLoadingStudents(true);
        try {
          const response = await getAllStudentsInAclass(addFormData.classId);
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
            setStudents([]);
            return;
          }
          
          const filteredStudents = studentsData
            .filter((student: any) => student.classId === addFormData.classId)
            .map((student: any) => ({
              id: student.id,
              key: student.id,
              admissionNo: student.admissionNo || `A${student.id}`,
              rollNo: student.rollNo || `R${student.id}`,
              name: student?.user?.name || "Unknown Student",
              classId: getClassNameById(addFormData.classId) || "",
              sectionId: getSectionNameById(addFormData.classId, addFormData.sectionId) || "",
              attendance: student.attendance || "Present",
              present: student.attendance === "Present",
              absent: student.attendance === "Absent",
              notes: student.notes || "",
              img: student?.user?.profilePic || "",
            }));
          
          setStudents(filteredStudents);
        } catch (error) {
          console.error("Error fetching students:", error);
          toast.error("Failed to load students");
          setStudents([]);
        } finally {
          setLoadingStudents(false);
        }
      } else {
        setStudents([]);
      }
    };
    fetchStudents();
  }, [addFormData.classId, addFormData.sectionId]);

  useEffect(() => {
    if (addFormData.classId && addFormData.subjectId) {
      const matchingLessons = timetable.filter(
        (lesson) =>
          lesson.classId === addFormData.classId &&
          lesson.subjectId === addFormData.subjectId
      );
      if (matchingLessons.length === 1) {
        setAddFormData((prev) => ({ ...prev, status: matchingLessons[0].id }));
      } else {
        setAddFormData((prev) => ({ ...prev, status: "" }));
      }
    } else {
      setAddFormData((prev) => ({ ...prev, status: "" }));
    }
  }, [addFormData.classId, addFormData.subjectId, timetable]);

  const getAvailableSections = useCallback(
    (classId: string) => {
      const selectedClass = classList.find((cls) => cls.id === classId);
      return (
        selectedClass?.Section?.map((section: any) => ({
          value: section.id,
          label: section.name,
        })) || []
      );
    },
    [classList]
  );
  const getClassNameById = useCallback(
    (classId: string) => {
      const selectedClass = classList.find((cls) => cls.id === classId);
      return selectedClass?.name || "";
    },
    [classList]
  );
  const getSectionNameById = useCallback(
    (classId: string, sectionId: string) => {
      const selectedClass = classList.find((cls) => cls.id === classId);
      const selectedSection = selectedClass?.Section?.find(
        (section: any) => section.id === sectionId
      );
      return selectedSection?.name || "";
    },
    [classList]
  );
  const getAvailableSubjects = useCallback(
    (classId: string) => {
      const selectedClass = classList.find((cls) => cls.id === classId);
      return (
        selectedClass?.Subject?.map((subject: any) => ({
          value: subject.id,
          label: subject.name,
        })) || []
      );
    },
    [classList]
  );

  const filteredLessons = useMemo(
    () =>
      addFormData.classId && addFormData.subjectId
        ? timetable.filter(
            (lesson) =>
              lesson.classId === addFormData.classId &&
              lesson.subjectId === addFormData.subjectId
          )
        : [],
    [timetable, addFormData.classId, addFormData.subjectId]
  );

  const handleAddClassClick = useCallback(
    (classData: any) => {
      setAddFormData((prev) => ({
        ...prev,
        classId: classData.id,
        sectionId: "",
        subjectId: "",
        status: "",
      }));
      setAddErrors({});
    },
    []
  );

  const handleAddSectionClick = useCallback((sectionId: string) => {
    setAddFormData((prev) => ({ ...prev, sectionId }));
    setAddErrors((prevErrors) => ({ ...prevErrors, sectionId: undefined }));
  }, []);

  const handleAddSubjectClick = useCallback((subjectId: string) => {
    setAddFormData((prev) => ({ ...prev, subjectId }));
    setAddErrors((prevErrors) => ({ ...prevErrors, subjectId: undefined }));
  }, []);

  const handleSelectLesson = useCallback((lessonId: string) => {
    setAddFormData((prev) => ({ ...prev, status: lessonId }));
    setAddErrors((prevErrors) => ({ ...prevErrors, status: undefined }));
  }, []);

  const handleFilterClassClick = useCallback((classData: any) => {
    setFilterFormData((prev) => ({ ...prev, classId: classData.id, sectionId: "" }));
    setFilterErrors({});
  }, []);

  const handleFilterSectionClick = useCallback((sectionId: string) => {
    setFilterFormData((prev) => ({ ...prev, sectionId }));
    setFilterErrors((prevErrors) => ({ ...prevErrors, sectionId: undefined }));
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesClass = filterFormData.classId
        ? student.classId === filterFormData.classId
        : true;
      const matchesSection = filterFormData.sectionId
        ? student.sectionId === filterFormData.sectionId
        : true;
      return matchesClass && matchesSection;
    });
  }, [students, filterFormData]);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { leaveType, fromDate, toDate, reason } = leaveForm;
    if (!leaveType || !fromDate || !toDate || !reason) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      if (from < new Date(currentDateStr)) {
        toast.error("From date cannot be in the past");
        return;
      }
      if (to < from) {
        toast.error("To date must be after from date");
        return;
      }
      const noOfDays =
        Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const leaveRequest: ILeaveRequest = {
        userId: localStorage.getItem("teacherId") as string,
        reason: `${leaveType}: ${reason}`,
        fromDate,
        toDate,
        status: "pending",
      };
      await createLeaveRequest(leaveRequest);
      setLeaves((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          leaveType,
          leaveDate: `${from.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          })} - ${to.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          })}`,
          noOfDays,
          appliedOn: currentDateStr,
          status: "Pending",
        },
      ]);
      setLeaveBalances((prev) => ({
        ...prev,
        [leaveType]: {
          ...prev[leaveType as LeaveType],
          used: prev[leaveType as LeaveType].used + noOfDays,
        },
      }));
      setLeaveForm({ leaveType: "", fromDate: "", toDate: "", reason: "" });
      setShowModal(false);
      toast.success("Leave applied successfully");
    } catch (error) {
      console.error("Error applying leave:", error);
      toast.error("Failed to apply leave");
    }
  };

  const handleBulkMarkPresent = () => {
    setStudents((prev) =>
      prev.map((student) => {
        if (selectedRowKeys.length === 0 || selectedRowKeys.includes(student.key)) {
          return { ...student, attendance: "Present", present: true, absent: false };
        }
        return student;
      })
    );
    toast.success(
      selectedRowKeys.length > 0
        ? "Selected students marked as Present"
        : "All students marked as Present"
    );
    setSelectedRowKeys([]);
  };

  const handleAttendanceChange = (index: number, value: string) => {
    setStudents((prev) => {
      const newStudents = [...prev];
      newStudents[index] = {
        ...newStudents[index],
        attendance: value,
        present: value === "Present",
        absent: value === "Absent",
      };
      return newStudents;
    });
  };

  const handleNotesChange = (index: number, value: string) => {
    setStudents((prev) => {
      const newStudents = [...prev];
      newStudents[index] = { ...newStudents[index], notes: value };
      return newStudents;
    });
  };

  const handleSaveAttendance = async () => {
    if (
      !addFormData.classId ||
      !addFormData.sectionId ||
      !addFormData.subjectId ||
      !addFormData.status
    ) {
      toast.error("Please select class, section, subject, and lesson");
      return;
    }
    setSavingAttendance(true);
    try {
      const targetStudents =
        selectedRowKeys.length > 0
          ? students.filter((s) => selectedRowKeys.includes(s.key))
          : students;
      const attendancePayload: AttendancePayload = {
        lessonId: addFormData.status,
        records: targetStudents.map((student) => ({
          studentId: student.id || student.key.toString(),
          present: student.attendance === "Present",
        })),
      };
      await markMultipleAttendance(attendancePayload as any);
      toast.success("Student attendance saved successfully");
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error("Failed to save attendance");
    } finally {
      setSavingAttendance(false);
    }
  };

  const handleApplyClick = useCallback(() => {
    const errors: { classId?: string; sectionId?: string } = {};
    if (!filterFormData.classId) {
      errors.classId = "Please select a class";
    }
    if (
      filterFormData.classId &&
      !filterFormData.sectionId &&
      getAvailableSections(filterFormData.classId).length > 0
    ) {
      errors.sectionId = "Please select a section";
    }
    setFilterErrors(errors);
    if (Object.keys(errors).length === 0 && dropdownMenuRef.current) {
      dropdownMenuRef.current.classList.remove("show");
    }
  }, [filterFormData, getAvailableSections]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  const leaveColumns = [
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      sorter: (a: any, b: any) => a.leaveType.length - b.leaveType.length,
    },
    {
      title: "Leave Date",
      dataIndex: "leaveDate",
      sorter: (a: any, b: any) => a.leaveDate.length - b.leaveDate.length,
    },
    {
      title: "No of Days",
      dataIndex: "noOfDays",
      sorter: (a: any, b: any) => parseFloat(a.noOfDays) - parseFloat(b.noOfDays),
    },
    {
      title: "Applied On",
      dataIndex: "appliedOn",
      sorter: (a: any, b: any) => a.appliedOn.length - b.appliedOn.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <span
          className={`badge badge-soft-${
            text === "Approved" ? "success" : text === "Pending" ? "warning" : "danger"
          } d-inline-flex align-items-center`}
        >
          <i className="ti ti-circle-filled fs-5 me-1"></i>
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => a.status.length - b.status.length,
    },
  ];

  const attendanceColumns = [
    {
      title: "Date | Month",
      dataIndex: "date",
      sorter: (a: any, b: any) => a.date.length - b.date.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <span
          className={`attendance-range bg-${text === "Present" ? "success" : "danger"}`}
        ></span>
      ),
      sorter: (a: any, b: any) => a.status.length - b.status.length,
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      sorter: (a: any, b: any) => a.timestamp.length - b.timestamp.length,
    },
  ];

  const studentColumns = [
    {
      title: "AdmissionNo",
      dataIndex: "admissionNo",
      render: (text: string) => <Link to="#" className="link-primary">{text}</Link>,
      sorter: (a: any, b: any) => a.admissionNo.length - b.admissionNo.length,
    },
    {
      title: "Roll No",
      dataIndex: "rollNo",
      sorter: (a: any, b: any) => a.rollNo.length - b.rollNo.length,
    },
    {
      title: "Name",
      dataIndex: ["name"],
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <Link to="#" className="avatar avatar-md">
            <img
              src={record.img}
              className="img-fluid rounded-circle"
              alt="img"
            />
          </Link>
          <div className="ms-2">
            <p className="text-dark mb-0">
              <Link to="#">{text}</Link>
            </p>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.name.length - b.name.length,
    },
    {
      title: "Class",
      dataIndex: "classId",
      sorter: (a: any, b: any) => a.classId.length - b.classId.length,
    },
    {
      title: "Section",
      dataIndex: "sectionId",
      sorter: (a: any, b: any) => a.sectionId.length - b.sectionId.length,
    },
    {
      title: "Attendance",
      dataIndex: "attendance",
      render: (text: string, record: any, index: number) => (
        <div className="d-flex align-items-center check-radio-group flex-nowrap">
          <label className="custom-radio me-3">
            <input
              type="radio"
              name={`student${record.key}`}
              checked={record.present}
              onChange={() => handleAttendanceChange(index, "Present")}
            />
            <span className="checkmark bg-success"></span> Present
          </label>
          <label className="custom-radio">
            <input
              type="radio"
              name={`student${record.key}`}
              checked={record.absent}
              onChange={() => handleAttendanceChange(index, "Absent")}
            />
            <span className="checkmark bg-danger"></span> Absent
          </label>
        </div>
      ),
      sorter: (a: any, b: any) => a.attendance.length - b.attendance.length,
    },
    {
      title: "Notes",
      dataIndex: "notes",
      render: (text: string, record: any, index: number) => (
        <input
          type="text"
          className="form-control w-100"
          placeholder="Enter Notes"
          value={record.notes}
          onChange={(e) => handleNotesChange(index, e.target.value)}
        />
      ),
      sorter: (a: any, b: any) => a.notes.length - b.notes.length,
    },
  ];

  const studentLeaveRequestColumns = [
    {
      title: "Student Name",
      dataIndex: "studentName",
      render: (text: string) => <Link to="#" className="link-primary">{text}</Link>,
      sorter: (a: any, b: any) => a.studentName.localeCompare(b.studentName),
    },
    {
      title: "Admission No",
      dataIndex: "admissionNo",
      sorter: (a: any, b: any) => a.admissionNo.localeCompare(b.admissionNo),
    },
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      render: (text: string) => (
        <span className="badge badge-soft-info">{text}</span>
      ),
      sorter: (a: any, b: any) => a.leaveType.localeCompare(b.leaveType),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      render: (text: string) => (
        <span className="text-muted" style={{ maxWidth: "200px", display: "block" }}>
          {text}
        </span>
      ),
      sorter: (a: any, b: any) => a.reason.localeCompare(b.reason),
    },
    {
      title: "From Date",
      dataIndex: "fromDate",
      sorter: (a: any, b: any) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime(),
    },
    {
      title: "To Date",
      dataIndex: "toDate",
      sorter: (a: any, b: any) => new Date(a.toDate).getTime() - new Date(b.toDate).getTime(),
    },
    {
      title: "No. of Days",
      dataIndex: "noOfDays",
      render: (text: number) => (
        <span className="badge badge-soft-warning">{text} days</span>
      ),
      sorter: (a: any, b: any) => a.noOfDays - b.noOfDays,
    },
    {
      title: "Applied On",
      dataIndex: "appliedOn",
      sorter: (a: any, b: any) => new Date(a.appliedOn).getTime() - new Date(b.appliedOn).getTime(),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => (
        <span
          className={`badge badge-soft-${
            text === "approved" ? "success" : 
            text === "rejected" ? "danger" : "warning"
          } d-inline-flex align-items-center`}
        >
          <i className="ti ti-circle-filled fs-5 me-1"></i>
          {text.charAt(0).toUpperCase() + text.slice(1)}
        </span>
      ),
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={() => handleApproveLeave(record.id)}
            disabled={record.status !== "pending"}
          >
            <i className="ti ti-check me-1"></i>
            Approve
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => handleRejectLeave(record.id)}
            disabled={record.status !== "pending"}
          >
            <i className="ti ti-x me-1"></i>
            Reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <ErrorBoundary>
      <div
        className={
          isMobile
            ? "page-wrapper bg-dark-theme min-vh-100 d-flex flex-column"
            : "p-3 bg-dark-theme min-vh-100 d-flex flex-column"
        }
      >
        <ToastContainer position="top-center" autoClose={3000} />
        <div className="content flex-grow-1 bg-dark-theme overflow-auto">
          <div className="row flex-grow-1">
            <div className="col-12 d-flex flex-column">
              <div className="row h-100 g-3">
                <div className="card flex-fill mb-3">
                  <div className="card-body p-2 pb-1">
                    <ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded-fill">
                      <li className="mb-3 me-3">
                        <Link
                          to="#"
                          className="nav-link rounded fs-12 fw-semibold"
                          data-bs-toggle="tab"
                          data-bs-target="#student_attendance"
                        >
                          Student Attendance
                        </Link>
                      </li>
                      <li className="me-3 mb-3">
                        <Link
                          to="#"
                          className="nav-link active rounded fs-12 fw-semibold"
                          data-bs-toggle="tab"
                          data-bs-target="#teacher_leaves"
                        >
                          Teacher Leaves
                        </Link>
                      </li>
                      <li className="me-3 mb-3">
                        <Link
                          to="#"
                          className="nav-link rounded fs-12 fw-semibold"
                          data-bs-toggle="tab"
                          data-bs-target="#teacher_attendance"
                        >
                          Teacher Attendance
                        </Link>
                      </li>
                      {user.role === "teacher" && (
                        <li className="me-3 mb-3">
                          <Link
                            to="#"
                            className="nav-link rounded fs-12 fw-semibold"
                            data-bs-toggle="tab"
                            data-bs-target="#student_leave_requests"
                          >
                            Student Leave Requests
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="tab-content flex-grow-1">
                  <div className="tab-pane fade show active" id="teacher_leaves">
                    <div className="row gx-3">
                      {isDataLoading || !localTeacherData ? ( // Updated condition
                        Array(4)
                          .fill(0)
                          .map((_, index) => (
                            <div key={index} className="col-lg-6 col-xxl-3 d-flex">
                              <div className="card flex-fill">
                                <div className="card-body p-2 placeholder-glow">
                                  <SkeletonPlaceholder
                                    className="col-6 mb-2"
                                    style={{ height: "1.5rem" }}
                                  />
                                  <div className="d-flex align-items-center flex-wrap">
                                    <SkeletonPlaceholder
                                      className="col-4 me-2 mb-0"
                                      style={{ height: "1rem" }}
                                    />
                                    <SkeletonPlaceholder
                                      className="col-4 mb-0"
                                      style={{ height: "1rem" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                      ) : (
                        Object.keys(leaveBalances).map((leaveType, index) => (
                          <div key={index} className="col-lg-6 col-xxl-3 d-flex">
                            <div className="card flex-fill">
                              <div className="card-body p-2">
                                <h5 className="mb-2">{leaveType}</h5>
                                <div className="d-flex align-items-center flex-wrap">
                                  <p className="border-end pe-2 me-2 mb-0">
                                    Used: {leaveBalances[leaveType as LeaveType].used}
                                  </p>
                                  <p className="mb-0">
                                    Available:{" "}
                                    {leaveBalances[leaveType as LeaveType].total -
                                      leaveBalances[leaveType as LeaveType].used}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="card flex-fill mb-3">
                      <div className="card-header d-flex align-items-center justify-content-between flex-wrap p-2 pb-0">
                        <h4 className="mb-2">Leaves</h4>
                        <button
                          onClick={() => setShowModal(true)}
                          className="btn btn-primary d-inline-flex align-items-center mb-2"
                          disabled={isDataLoading || !localTeacherData} // Updated condition
                        >
                          <i className="ti ti-calendar-event me-2" /> Apply Leave
                        </button>
                      </div>
                      <div className="card-body p-0 py-2">
                        {isDataLoading || !localTeacherData ? ( // Updated condition
                          <div className="placeholder-glow">
                            {Array(5)
                              .fill(0)
                              .map((_, index) => (
                                <div key={index} className="p-3 border-bottom">
                                  <SkeletonPlaceholder
                                    className="col-4 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                  <SkeletonPlaceholder
                                    className="col-6 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                  <SkeletonPlaceholder
                                    className="col-2 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                  <SkeletonPlaceholder
                                    className="col-3 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                  <SkeletonPlaceholder
                                    className="col-2 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                </div>
                              ))}
                          </div>
                        ) : leaves.length === 0 ? (
                          <div className="text-center p-3">
                            <p>No leave requests found.</p>
                          </div>
                        ) : (
                          <Table
                            key={leaves.length}
                            rowKey="id"
                            dataSource={leaves}
                            columns={leaveColumns}
                            className={isDark ? "table table-dark" : "table table-light"}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="teacher_attendance">
                    <div className="card flex-fill mb-3">
                      <div className="card-header d-flex align-items-center justify-content-between flex-wrap p-2 pb-1">
                        <h4 className="mb-2">Attendance</h4>
                        <div className="d-flex align-items-center flex-wrap">
                          <div className="d-flex align-items-center flex-wrap me-3">
                            <p className="text-dark mb-2 me-2">
                              Last Updated on: {currentDateStr}
                            </p>
                            <Link
                              to="#"
                              className="btn btn-primary btn-icon btn-sm rounded-circle d-inline-flex align-items-center justify-content-center p-0 mb-2"
                            >
                              <i className="ti ti-refresh-dot" />
                            </Link>
                          </div>
                          <div className="dropdown mb-2">
                            <Link
                              to="#"
                              className="btn btn-outline-light bg-white dropdown-toggle"
                              data-bs-toggle="dropdown"
                            >
                              <i className="ti ti-calendar-due me-2" /> Year: 2024 / 2025
                            </Link>
                            <ul className="dropdown-menu p-3">
                              <li>
                                <Link to="#" className="dropdown-item rounded-1">
                                  Year: 2024 / 2025
                                </Link>
                              </li>
                              <li>
                                <Link to="#" className="dropdown-item rounded-1">
                                  Year: 2023 / 2024
                                </Link>
                              </li>
                              <li>
                                <Link to="#" className="dropdown-item rounded-1">
                                  Year: 2022 / 2023
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="card-body p-2 pb-1">
                        <div className="row">
                          {isDataLoading || !localTeacherData ? ( // Updated condition
                            Array(2)
                              .fill(0)
                              .map((_, index) => (
                                <div
                                  key={index}
                                  className="col-md-6 col-xl-3 d-flex"
                                >
                                  <div className="d-flex align-items-center rounded border p-3 mb-3 flex-fill placeholder-glow">
                                    <SkeletonPlaceholder
                                      className="avatar avatar-lg bg-secondary bg-opacity-10 rounded me-3 flex-shrink-0"
                                      style={{ width: "48px", height: "48px" }}
                                    />
                                    <div className="ms-2">
                                      <SkeletonPlaceholder
                                        className="col-6 mb-1"
                                        style={{ height: "1rem" }}
                                      />
                                      <SkeletonPlaceholder
                                        className="col-4"
                                        style={{ height: "1.5rem" }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <>
                              <div className="col-md-6 col-xl-3 d-flex">
                                <div className="d-flex align-items-center rounded border p-3 mb-3 flex-fill">
                                  <span className="avatar avatar-lg bg-primary bg-opacity-10 rounded me-3 flex-shrink-0 text-primary">
                                    <i className="ti ti-user-check fs-24"></i>
                                  </span>
                                  <div className="ms-2">
                                    <p className="mb-1">Present</p>
                                    <h5>
                                      {
                                        attendance.filter(
                                          (a) => a.status === "Present"
                                        ).length
                                      }
                                    </h5>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6 col-xl-3 d-flex">
                                <div className="d-flex align-items-center rounded border p-3 mb-3 flex-fill">
                                  <span className="avatar avatar-lg bg-danger bg-opacity-10 rounded me-3 flex-shrink-0 text-danger">
                                    <i className="ti ti-user-x fs-24"></i>
                                  </span>
                                  <div className="ms-2">
                                    <p className="mb-1">Absent</p>
                                    <h5>
                                      {
                                        attendance.filter(
                                          (a) => a.status === "Absent"
                                        ).length
                                      }
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="card flex-fill mb-3">
                      <div className="card-header d-flex align-items-center justify-content-between flex-wrap p-2 pb-1">
                        <h4 className="mb-2">Attendance History</h4>
                        <div className="d-flex align-items-center flex-wrap">
                          <div className="dropdown mb-2 me-3">
                            <Link
                              to="#"
                              className="btn btn-outline-light border-light bg-white dropdown-toggle shadow-md"
                              data-bs-toggle="dropdown"
                            >
                              <i className="ti ti-calendar-check me-2"></i> This Year
                            </Link>
                            <ul className="dropdown-menu p-3">
                              <li>
                                <Link to="#" className="dropdown-item rounded-1">
                                  This Year
                                </Link>
                              </li>
                              <li>
                                <Link to="#" className="dropdown-item rounded-1">
                                  This Month
                                </Link>
                              </li>
                              <li>
                                <Link to="#" className="dropdown-item rounded-1">
                                  This Week
                                </Link>
                              </li>
                            </ul>
                          </div>
                          <div className="dropdown mb-2">
                            <Link
                              to="#"
                              className="dropdown-toggle btn btn-light fw-medium rounded"
                              data-bs-toggle="dropdown"
                            >
                              <i className="ti ti-file-export me-2"></i> Export
                            </Link>
                            <ul className="dropdown-menu dropdown-menu-end p-3">
                              <li>
                                <Link
                                  to="#"
                                  className="dropdown-item rounded-1"
                                  onClick={() => console.log("Export PDF")}
                                >
                                  Export as PDF
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="#"
                                  className="dropdown-item rounded-1"
                                  onClick={() => console.log("Export files")}
                                >
                                  Export as Excel
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="card-body p-0 py-2">
                        {isDataLoading || !localTeacherData ? ( // Updated condition
                          <div className="placeholder-glow">
                            {Array(5)
                              .fill(0)
                              .map((_, index) => (
                                <div key={index} className="p-3 border-bottom">
                                  <SkeletonPlaceholder
                                    className="col-4 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                  <SkeletonPlaceholder
                                    className="col-2 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                  <SkeletonPlaceholder
                                    className="col-3 mb-2"
                                    style={{ height: "1rem" }}
                                  />
                                </div>
                              ))}
                          </div>
                        ) : attendance.length === 0 ? (
                          <div className="text-center p-3">
                            <p>No attendance records found.</p>
                          </div>
                        ) : (
                          <Table
                            dataSource={attendance}
                            columns={attendanceColumns}
                            className={isDark ? "table table-dark" : "table table-light"}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="student_attendance">
                    <div className="row">
                      <div className="col-12">
                        <div className="card flex-fill">
                          <div className="card-header d-flex flex-wrap align-items-center justify-content-between p-3 pb-2">
                            <h4 className="mb-3">Student Attendance List</h4>
                            <div className="d-flex flex-wrap gap-2">
                              <div className="mb-3" style={{ minWidth: 150 }}>
                                <select
                                  className="form-control"
                                  value={addFormData.classId}
                                  onChange={(e) =>
                                    handleAddClassClick(
                                      classList.find((cls) => cls.id === e.target.value)
                                    )
                                  }
                                >
                                  <option value="">Select Class</option>
                                  {classList.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                      {cls.name || cls.id}
                                    </option>
                                  ))}
                                </select>
                                {addErrors.classId && (
                                  <span className="text-danger">{addErrors.classId}</span>
                                )}
                              </div>
                              <div className="mb-3" style={{ minWidth: 150 }}>
                                <select
                                  className="form-control"
                                  value={addFormData.sectionId}
                                  onChange={(e) => handleAddSectionClick(e.target.value)}
                                  disabled={!addFormData.classId}
                                >
                                  <option value="">Select Section</option>
                                  {getAvailableSections(addFormData.classId).map(
                                    (section) => (
                                      <option key={section.value} value={section.value}>
                                        {section.label}
                                      </option>
                                    )
                                  )}
                                </select>
                                {addErrors.sectionId && (
                                  <span className="text-danger">{addErrors.sectionId}</span>
                                )}
                              </div>
                              <div className="mb-3" style={{ minWidth: 150 }}>
                                <select
                                  className="form-control"
                                  value={addFormData.subjectId}
                                  onChange={(e) => handleAddSubjectClick(e.target.value)}
                                  disabled={!addFormData.classId}
                                >
                                  <option value="">Select Subject</option>
                                  {getAvailableSubjects(addFormData.classId).map(
                                    (subject) => (
                                      <option key={subject.value} value={subject.value}>
                                        {subject.label}
                                      </option>
                                    )
                                  )}
                                </select>
                                {addErrors.subjectId && (
                                  <span className="text-danger">{addErrors.subjectId}</span>
                                )}
                              </div>
                              <div className="mb-3" style={{ minWidth: 150 }}>
                                {filteredLessons.length > 1 ? (
                                  <select
                                    className="form-control"
                                    value={addFormData.status}
                                    onChange={(e) => handleSelectLesson(e.target.value)}
                                    disabled={!addFormData.subjectId}
                                  >
                                    <option value="">Select Lesson</option>
                                    {filteredLessons.map((lesson) => (
                                      <option key={lesson.id} value={lesson.id}>
                                        {`${lesson.day} ${lesson.subject?.name} (${new Date(
                                          lesson.startTime
                                        ).toLocaleTimeString("en-IN", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })} - ${new Date(
                                          lesson.endTime
                                        ).toLocaleTimeString("en-IN", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })})`}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={
                                      filteredLessons.length === 1
                                        ? filteredLessons[0].day
                                        : "No lesson selected"
                                    }
                                    readOnly
                                  />
                                )}
                              </div>
                              <div className="mb-3">
                                <button
                                  className="btn btn-secondary"
                                  onClick={handleBulkMarkPresent}
                                >
                                  Bulk Mark
                                </button>
                              </div>
                              <div className="mb-3">
                                <button
                                  className={`btn btn-success ${
                                    savingAttendance
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    !savingAttendance && handleSaveAttendance()
                                  }
                                  disabled={savingAttendance}
                                >
                                  {savingAttendance ? "Saving..." : "Save Attendance"}
                                </button>
                              </div>
                              <div className="input-icon-start mb-3 mb-0 position-relative">
                                <PredefinedDateRanges
                                  onChange={(date) => console.log("Date selected:", date)}
                                  // Add any required props here, ensuring no boolean attributes
                                />
                              </div>
                              <div className="dropdown mb-3 mb-0">
                                <Link
                                  to="#"
                                  className="btn btn-outline-secondary dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  data-bs-auto-close="outside"
                                >
                                  <i className="bi bi-filter"></i> Filter
                                </Link>
                                <div
                                  className="dropdown-menu drop-width"
                                  ref={dropdownMenuRef}
                                >
                                  <div>
                                    <div className="d-flex align-items-center border-bottom p-3">
                                      <h4>Filter</h4>
                                    </div>
                                    <div className="p-3 border-bottom">
                                      <div className="row">
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <label className="form-label">Class</label>
                                            <select
                                              className="form-control"
                                              value={filterFormData.classId}
                                              onChange={(e) =>
                                                handleFilterClassClick(
                                                  classList.find(
                                                    (cls) => cls.id === e.target.value
                                                  )
                                                )
                                              }
                                            >
                                              <option value="">Select Class</option>
                                              {classList.map((cls) => (
                                                <option key={cls.id} value={cls.id}>
                                                  {cls.name || cls.id}
                                                </option>
                                              ))}
                                            </select>
                                            {filterErrors.classId && (
                                              <span className="text-danger">
                                                {filterErrors.classId}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="mb-3">
                                            <label className="form-label">Section</label>
                                            <select
                                              className="form-control"
                                              value={filterFormData.sectionId}
                                              onChange={(e) =>
                                                handleFilterSectionClick(e.target.value)
                                              }
                                              disabled={!filterFormData.classId}
                                            >
                                              <option value="">Select Section</option>
                                              {getAvailableSections(
                                                filterFormData.classId
                                              ).map((section) => (
                                                <option
                                                  key={section.value}
                                                  value={section.value}
                                                >
                                                  {section.label}
                                                </option>
                                              ))}
                                            </select>
                                            {filterErrors.sectionId && (
                                              <span className="text-danger">
                                                {filterErrors.sectionId}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="p-3 d-flex align-items-center justify-content-end">
                                      <Link to="#" className="btn btn-outline-primary me-2">
                                        Reset
                                      </Link>
                                      <Link
                                        to="#"
                                        className="btn btn-primary"
                                        onClick={handleApplyClick}
                                      >
                                        Apply
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="card-body p-0 py-2">
                            {loadingStudents || isDataLoading || !localTeacherData ? ( // Updated condition
                              <div className="placeholder-glow">
                                {Array(5)
                                  .fill(0)
                                  .map((_, index) => (
                                    <div key={index} className="p-3 border-bottom">
                                      <SkeletonPlaceholder
                                        className="col-2 mb-2"
                                        style={{ height: "1rem" }}
                                      />
                                      <SkeletonPlaceholder
                                        className="col-3 mb-2"
                                        style={{ height: "1rem" }}
                                      />
                                      <SkeletonPlaceholder
                                        className="col-2 mb-2"
                                        style={{ height: "1rem" }}
                                      />
                                      <SkeletonPlaceholder
                                        className="col-2 mb-2"
                                        style={{ height: "1rem" }}
                                      />
                                      <SkeletonPlaceholder
                                        className="col-2 mb-2"
                                        style={{ height: "1rem" }}
                                      />
                                      <SkeletonPlaceholder
                                        className="col-3 mb-2"
                                        style={{ height: "1rem" }}
                                      />
                                    </div>
                                  ))}
                              </div>
                            ) : filteredStudents.length === 0 ? (
                              <div className="text-center p-3">
                                <p>No students found for the selected class and section.</p>
                              </div>
                            ) : (
                              <Table
                                rowKey="key"
                                dataSource={filteredStudents}
                                columns={studentColumns}
                                rowSelection={rowSelection}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="student_leave_requests">
                    <div className="card flex-fill mb-3">
                      <div className="card-header d-flex align-items-center justify-content-between flex-wrap p-2 pb-1">
                        <h4 className="mb-2">Student Leave Requests</h4>
                        <div className="d-flex align-items-center flex-wrap">
                          <button
                            onClick={fetchStudentLeaveRequests}
                            className="btn btn-outline-primary btn-sm me-2"
                            disabled={loadingLeaveRequests}
                          >
                            <i className="ti ti-refresh me-1"></i>
                            {loadingLeaveRequests ? "Refreshing..." : "Refresh"}
                          </button>
                          <div className="dropdown mb-2">
                            <Link
                              to="#"
                              className="btn btn-outline-light bg-white dropdown-toggle"
                              data-bs-toggle="dropdown"
                            >
                              <i className="ti ti-filter me-2" /> Filter
                            </Link>
                            <ul className="dropdown-menu p-3">
                              <li>
                                <Link to="#" className="dropdown-item rounded-1">
                                  All Requests
                                </Link>
                              </li>
                              <li>
                                <Link to="#" className="dropdown-item rounded-1">
                                  Pending Only
                                </Link>
                              </li>
                              <li>
                                <Link to="#" className="dropdown-item rounded-1">
                                  Approved Only
                                </Link>
                              </li>
                              <li>
                                <Link to="#" className="dropdown-item rounded-1">
                                  Rejected Only
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="card-body p-0 py-2">
                        {loadingLeaveRequests ? (
                          <div className="placeholder-glow">
                            {Array(5)
                              .fill(0)
                              .map((_, index) => (
                                <div key={index} className="p-3 border-bottom">
                                  <SkeletonPlaceholder
                                    className="col-3 mb-2"
                                  />
                                  <SkeletonPlaceholder
                                    className="col-2 mb-2"
                                  />
                                  <SkeletonPlaceholder
                                    className="col-2 mb-2"
                                  />
                                  <SkeletonPlaceholder
                                    className="col-3 mb-2"
                                  />
                                  <SkeletonPlaceholder
                                    className="col-2 mb-2"
                                  />
                                </div>
                              ))}
                          </div>
                        ) : studentLeaveRequests.length === 0 ? (
                          <div className="text-center p-5">
                            <div className="mb-3">
                              <i className="ti ti-calendar-off fs-1 text-muted"></i>
                            </div>
                            <h5 className="text-muted">No Leave Requests</h5>
                            <p className="text-muted mb-3">
                              There are no pending student leave requests at the moment.
                            </p>
                            <button
                              onClick={fetchStudentLeaveRequests}
                              className="btn btn-primary btn-sm"
                            >
                              <i className="ti ti-refresh me-1"></i>
                              Refresh
                            </button>
                          </div>
                        ) : (
                          <Table
                            dataSource={studentLeaveRequests}
                            columns={studentLeaveRequestColumns}
                            rowKey="id"
                            className={isDark ? "table table-dark" : "table table-light"}
                            pagination={{
                              pageSize: 10,
                              showSizeChanger: true,
                              showQuickJumper: true,
                              showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} items`,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Apply Leave</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="mb-3">
                <label className="form-label">Leave Type</label>
                <select
                  className="form-control w-100"
                  value={leaveForm.leaveType}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, leaveType: e.target.value })
                  }
                >
                  <option value="">Select Leave Type</option>
                  <option value="Medical Leave">Medical Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Maternity Leave">Maternity Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">From Date</label>
                <input
                  type="date"
                  className="form-control w-100"
                  value={leaveForm.fromDate}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, fromDate: e.target.value })
                  }
                  min={currentDateStr
                    .split(" ")
                    [0].split("-")
                    .reverse()
                    .join("-")}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">To Date</label>
                <input
                  type="date"
                  className="form-control w-100"
                  value={leaveForm.toDate}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, toDate: e.target.value })
                  }
                  min={leaveForm.fromDate}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Reason</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={leaveForm.reason}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, reason: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="text-end">
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  className="me-2"
                >
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleApplyLeave}>
                  Apply
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <TeacherModal />
      </div>
    </ErrorBoundary>
  );
};

export default TeacherLeave;