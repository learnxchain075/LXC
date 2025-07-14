import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

import {
  getTeacherDashboardData,
  getTeacherLeaveBalances,
  getTeacherAttendanceStats,
  getStudentLeaveRequestsForTeacher,
  approveStudentLeaveRequest,
  rejectStudentLeaveRequest,
  getStudentsForAttendance,
  markStudentAttendance,
  getTeacherClasses,
  getTeacherLessons,
  getAttendanceReport,
  getTeacherProfile,
  updateTeacherProfile,
  ITeacherDashboardData,
  IStudentLeaveRequest,
  IClassData,
  ILesson,
  IStudent,
} from "../../../../../services/teacher/teacherDashboardService";

import { ILeaveRequest } from "../../../../../services/types/teacher/ILeaveRequest";
import {
  IAttendance,
  IAttendancePayload,
  AttendanceStatus,
} from "../../../../../services/types/teacher/attendanceService";
import { markMultipleAttendance, createAttendance } from "../../../../../services/teacher/attendanceService";
import api from "../../../../../services/api";
import PredefinedDateRanges from "../../../../../core/common/datePicker";
import TeacherModal from "../teacherModal";
import { getTeacherById } from "../../../../../services/admin/teacherRegistartion";
import LoadingSkeleton from "../../../../../components/LoadingSkeleton";
import { getAttendanceByLessonAndDate } from "../../../../../services/teacher/attendenceServices";


interface ExtendedIClassData extends IClassData {
  Section?: { id: string; name: string; classId: string }[];
  Subject?: { id: string; name: string; code: string; type: string; classId: string; status?: string }[];
}


interface ProcessedLeave {
  id: string;
  leaveType: string;
  leaveDate: string;
  noOfDays: number;
  appliedOn: string;
  status: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}
class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
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

const TeacherLeave = () => {
  const routes = all_routes;
  const isMobile = useMobileDetection();
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const user = useSelector((state: any) => state.auth.userObj);
  const isDark = dataTheme === "dark_data_theme";
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
  const [showModal, setShowModal] = useState(false);


  const [classList, setClassList] = useState<ExtendedIClassData[]>([]);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [timetable, setTimetable] = useState<ILesson[]>([]);
  const [leaves, setLeaves] = useState<ProcessedLeave[]>([]);
  const [studentLeaveRequests, setStudentLeaveRequests] = useState<IStudentLeaveRequest[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [localTeacherData, setLocalTeacherData] = useState<any>(null);
  const [loadingLeaveRequests, setLoadingLeaveRequests] = useState(false);
 
  const [existingAttendance, setExistingAttendance] = useState<{ [studentId: string]: any }>({});

  
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });
  
  const [attendanceDate, setAttendanceDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; 
  });
  // const [filterFormData, setFilterFormData] = useState({
  //   classId: "",
  //   sectionId: "",
  //   name: "",
  //   admissionNo: "",
  //   rollNo: "",
  // });
  const [addFormData, setAddFormData] = useState({
    classId: "",
    sectionId: "",
    subjectId: "",
    status: "",
  });

  // Error states
  // const [filterErrors, setFilterErrors] = useState<{
  //   classId?: string;
  //   sectionId?: string;
  // }>({});
  const [addErrors, setAddErrors] = useState<{
    classId?: string;
    sectionId?: string;
    subjectId?: string;
  }>({});

  
  type LeaveType = "Medical Leave" | "Casual Leave" | "Maternity Leave" | "Sick Leave";
  const [leaveBalances, setLeaveBalances] = useState<{ [key in LeaveType]?: { total: number; used: number } }>({});
  const currentDateTime = new Date();
  const currentDateStr = currentDateTime.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

 
  const [showBulkModal, setShowBulkModal] = useState<null | 'present' | 'absent'>(null);

  const [showStudentModal, setShowStudentModal] = useState<{ student: any, records: any[] } | null>(null);
  const [loadingStudentOverview, setLoadingStudentOverview] = useState(false);


  const fetchTeacherDetails = async () => {
    try {
      setIsDataLoading(true); 
      const teacherId = localStorage.getItem("teacherId");
      if (!teacherId) {
        toast.error("Teacher ID not found");
        return;
      }

      const response = await getTeacherProfile(teacherId);
      if (response.status === 200) {
        setLocalTeacherData(response.data);
      } else {
        toast.error("Failed to fetch teacher details");
      }
    } catch (error) {
      toast.error("Error fetching teacher details");
    } finally {
      setIsDataLoading(false);
    }
  };

  
  const fetchTeacherDashboardData = async () => {
    try {
      const teacherId = localStorage.getItem("teacherId");
      if (!teacherId) {
        toast.error("Teacher ID not found");
        return;
      }

      const response = await getTeacherDashboardData(teacherId);
      if (response.status === 200) {
        const data = response.data;
        setLeaveBalances(data.leaveBalances);
        setAttendance(data.attendanceStats);
        setLeaves(data.recentLeaves);
        setStudentLeaveRequests(data.pendingStudentLeaves);
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
        }
  };


  const fetchTeacherClassesAndLessons = async () => {
    try {
      const teacherId = localStorage.getItem("teacherId");
      if (!teacherId) {
        toast.error("Teacher ID not found");
        return;
      }

      const [classesResponse, lessonsResponse] = await Promise.all([
        getTeacherClasses(teacherId),
        getTeacherLessons(teacherId),
      ]);

      if (classesResponse.status === 200) {
        setClassList(classesResponse.data);
          }
          
      if (lessonsResponse.status === 200) {
        setTimetable(lessonsResponse.data as ILesson[]);
            }
            } catch (error) {
        toast.error("Failed to load classes and lessons");
      }
    };

  // Fetch student leave requests
  const fetchStudentLeaveRequests = useCallback(async () => {
    if (user.role !== "teacher") return;
    
    setLoadingLeaveRequests(true);
    try {
      const teacherId = localStorage.getItem("teacherId");
      if (!teacherId) {
        toast.error("Teacher ID not found");
        return;
      }

      const response = await getStudentLeaveRequestsForTeacher(teacherId);
      if (response.status === 200) {
       
        const leaveRequests = Array.isArray(response.data) ? response.data : [];
        setStudentLeaveRequests(leaveRequests);
      }
    } catch (error) {
      toast.error("Failed to load student leave requests");
    } finally {
      setLoadingLeaveRequests(false);
    }
  }, [user.role]);


  const handleApproveLeave = async (leaveId: string) => {
    try {
      
      const approveButton = document.querySelector(`[data-leave-id="${leaveId}"].btn-approve`);
      if (approveButton) {
        approveButton.innerHTML = '<i class="ti ti-loader ti-spin me-1"></i>Approving...';
        approveButton.setAttribute('disabled', 'true');
      }

      await approveStudentLeaveRequest(leaveId);
      toast.success("Leave request approved successfully");
      fetchStudentLeaveRequests();
    } catch (error) {
      toast.error("Failed to approve leave request");
    }
  };

  const handleRejectLeave = async (leaveId: string) => {
    try {
     
      const rejectButton = document.querySelector(`[data-leave-id="${leaveId}"].btn-reject`);
      if (rejectButton) {
        rejectButton.innerHTML = '<i class="ti ti-loader ti-spin me-1"></i>Rejecting...';
        rejectButton.setAttribute('disabled', 'true');
      }

      await rejectStudentLeaveRequest(leaveId);
      toast.success("Leave request rejected successfully");
      fetchStudentLeaveRequests(); 
    } catch (error) {
      toast.error("Failed to reject leave request");
    }
  };

  
  const fetchStudentsForAttendance = async () => {
    if (!addFormData.classId) {
      setStudents([]);
      return;
    }

    setLoadingStudents(true);
    try {
    
      const response = await getAllStudentsInAclass(addFormData.classId);
      
      if (response?.data) {
        let studentsData: any[] = [];
        const responseData = response.data as any;
        
       
        if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
          if ('data' in responseData && Array.isArray(responseData.data)) {
            studentsData = responseData.data;
          } else if ('students' in responseData && Array.isArray(responseData.students)) {
            studentsData = responseData.students;
          }
        } else if (Array.isArray(responseData)) {
          studentsData = responseData;
        } else if (Array.isArray(response)) {
          studentsData = response;
        }
        
    
        if (!Array.isArray(studentsData)) {
          studentsData = [];
        }
        
       
        const filteredStudents = studentsData
          .map((student: any) => {
           
            let attendanceRecord;
            if (Array.isArray(student.attendances)) {
              const normalizeDate = (d: string | Date) => new Date(d).toISOString().split("T")[0];
              attendanceRecord = student.attendances.find(
                (att: any) =>
                  att.lessonId === addFormData.status &&
                  normalizeDate(att.date) === normalizeDate(attendanceDate)
              );
            }
            return {
              id: student.id,
              key: student.id,
              admissionNo: student.admissionNo || `A${student.id}`,
              rollNo: student.rollNo || `R${student.id}`,
              name: student?.user?.name || student.name || "Unknown Student",
              classId: getClassNameById(addFormData.classId) || "",
              sectionId: getSectionNameById(addFormData.classId, addFormData.sectionId) || "",
              attendance: attendanceRecord ? (attendanceRecord.present ? "Present" : "Absent") : "",
              present: attendanceRecord ? !!attendanceRecord.present : undefined,
              absent: attendanceRecord ? !attendanceRecord.present : undefined,
              notes: student.notes || "",
              img: student?.user?.profilePic || student.profilePic || "",
              attendances: student.attendances || [],
            };
          });
          
        setStudents(filteredStudents);
      } else {
        setStudents([]);
      }
    } catch (error) {
      toast.error("Failed to load students for attendance");
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };


  useEffect(() => {
    const initializeData = async () => {
      setIsDataLoading(true);
      try {
       
        if (!user?.role) {
          setIsDataLoading(false);
          return;
        }
        
        
        if (user.role === "teacher") {
          const teacherId = localStorage.getItem("teacherId");
          if (!teacherId) {
            toast.error("Teacher ID not found");
            setIsDataLoading(false);
            return;
          }

        
          const [classesResponse, lessonsResponse, leavesResponse] = await Promise.all([
            getClassesByTeacherId(teacherId),
            getLessonByteacherId(teacherId),
            getMyLeaves(),
          ]);

       
          if (classesResponse?.data) {
            let classesData: any[] = [];
            const responseData = classesResponse.data as any;
            
         
            if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
              if (responseData.data && Array.isArray(responseData.data)) {
                classesData = responseData.data;
              } else if (responseData.classes && Array.isArray(responseData.classes)) {
                classesData = responseData.classes;
              }
            } else if (Array.isArray(responseData)) {
              classesData = responseData;
            }
            
           
            if (!Array.isArray(classesData)) {
              classesData = [];
            }
            
            setClassList(classesData as ExtendedIClassData[]);
          }

          
          if (lessonsResponse?.data) {
            const lessonsData = Array.isArray(lessonsResponse.data) 
              ? lessonsResponse.data 
              : [lessonsResponse.data];
            setTimetable(lessonsData as ILesson[]);
          }

         
          if (leavesResponse?.data) {
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
          
            setLeaves(leaveData as ProcessedLeave[]);
          }

       
          setLocalTeacherData({ id: teacherId, role: "teacher" });
        } else if (user.role === "admin") {
          const schoolId = localStorage.getItem("schoolId");
          if (schoolId) {
            const classesResponse = await getClassByschoolId(schoolId);
            if (classesResponse?.data) {
              const adminClasses = Array.isArray(classesResponse.data) 
                ? classesResponse.data 
                : [];
              setClassList(adminClasses);
            }
          }
        }

      
        setAttendance([
          {
            date: currentDateStr,
            status: "Present",
            timestamp: currentDateTime.toLocaleTimeString("en-IN", {
              hour12: true,
            }),
          },
        ]);

      
        setLeaveBalances({
          "Medical Leave": { total: 10, used: 2 },
          "Casual Leave": { total: 15, used: 5 },
          "Maternity Leave": { total: 90, used: 0 },
          "Sick Leave": { total: 7, used: 1 },
        });

      } catch (error) {
        toast.error("Failed to initialize data");
      } finally {
        setIsDataLoading(false);
      }
    };

    initializeData();
  }, [user?.role]);

 
  useEffect(() => {
    if (localTeacherData && user.role === "teacher") {
      fetchStudentLeaveRequests();
    }
  }, [localTeacherData, user.role, fetchStudentLeaveRequests]);

  useEffect(() => {
    if (addFormData.classId) {
      fetchStudentsForAttendance();
      } else {
        setStudents([]);
      }
  }, [addFormData.classId]);

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

  useEffect(() => {
    if (!addFormData.status || !attendanceDate) {
      setExistingAttendance({});
      return;
    }
    console.log('Current students array:', students);
    const normalizeDate = (d: string | Date) => new Date(d).toISOString().split("T")[0];
    const map: { [studentId: string]: any } = {};
    students.forEach((student) => {
      if (!Array.isArray(student.attendances)) {
        console.warn('Student missing attendances array:', student);
        return;
      }
      const found = student.attendances.find(
        (att: any) =>
          att.lessonId === addFormData.status &&
          normalizeDate(att.date) === normalizeDate(attendanceDate)
      );
      if (found) {
        map[student.id] = found;
      }
    });
    console.log('existingAttendance map:', map);
    setExistingAttendance(map);
    setStudents((prev) => prev.map((student) => {
      const marked = map[student.id];
      if (marked) {
        return {
          ...student,
          attendance: marked.present ? 'Present' : 'Absent',
          present: !!marked.present,
          absent: !marked.present,
        };
      } else {
        return {
          ...student,
          attendance: 'Present',
          present: true,
          absent: false,
        };
      }
    }));
  }, [students, addFormData.status, attendanceDate]);

  const getAvailableSections = useCallback(
    (classId: string) => {
      const selectedClass = classList.find((cls) => cls.id === classId);
      if (selectedClass?.Section && Array.isArray(selectedClass.Section)) {
        return selectedClass.Section.map((section: { id: string; name: string }) => ({
          value: section.id,
          label: section.name,
        }));
      }
      // Fallback: if section is a string, create a single option
      if (selectedClass?.section && typeof selectedClass.section === 'string') {
        return [{
          value: selectedClass.section,
          label: selectedClass.section,
        }];
      }
      return [];
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
      if (selectedClass?.Section && Array.isArray(selectedClass.Section)) {
        const selectedSection = selectedClass.Section.find(
          (section: { id: string; name: string }) => section.id === sectionId
        );
        return selectedSection?.name || "";
      }
      return "";
    },
    [classList]
  );

  const getAvailableSubjects = useCallback(
    (classId: string) => {
      const selectedClass = classList.find((cls) => cls.id === classId);
  
      if (selectedClass?.Subject && Array.isArray(selectedClass.Subject)) {
        return selectedClass.Subject.map((subject: { id: string; name: string; code: string }) => ({
          value: subject.id,
          label: subject.name,
        }));
      }
      return [];
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
      if (!classData || !classData.id) {
        return;
      }
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

  const filteredStudents = useMemo(() => {
    
    return students;
  }, [students, addFormData.classId]);

 
  // const [filterFormData, setFilterFormData] = useState({
  //   classId: "",
  //   sectionId: "",
  //   name: "",
  //   admissionNo: "",
  //   rollNo: "",
  // });
  // const [filterErrors, setFilterErrors] = useState<{
  //   classId?: string;
  //   sectionId?: string;
  // }>({});

  
  // const handleFilterClassClick = useCallback((classData: any) => {
  //   if (!classData || !classData.id) {
  //     console.error("Invalid class data for filter:", classData);
  //     return;
  //   }
  //   console.log("Filter class selected:", classData);
  //   setFilterFormData((prev) => ({ ...prev, classId: classData.id, sectionId: "" }));
  //   setFilterErrors({});
  // }, []);

  // const handleFilterSectionClick = useCallback((sectionId: string) => {
  //   console.log("Filter section selected:", sectionId);
  //   setFilterFormData((prev) => ({ ...prev, sectionId }));
  //   setFilterErrors((prevErrors) => ({ ...prevErrors, sectionId: undefined }));
  // }, []);

 
  // const handleApplyClick = useCallback(() => {
  //   const errors: { classId?: string; sectionId?: string } = {};
  //   if (!filterFormData.classId) {
  //     errors.classId = "Please select a class";
  //   }
  //   if (
  //     filterFormData.classId &&
  //     !filterFormData.sectionId &&
  //     getAvailableSections(filterFormData.classId).length > 0
  //   ) {
  //     errors.sectionId = "Please select a section";
  //   }
  //   setFilterErrors(errors);
  //   if (Object.keys(errors).length === 0 && dropdownMenuRef.current) {
  //     dropdownMenuRef.current.classList.remove("show");
  //   }
  // }, [filterFormData, getAvailableSections]);

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
      
      const newLeave: ProcessedLeave = {
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
      };
      
      setLeaves((prev) => [...prev, newLeave]);
      
      setLeaveBalances((prev) => ({
        ...prev,
        [leaveType as LeaveType]: {
          ...prev[leaveType as LeaveType],
          used: (prev[leaveType as LeaveType]?.used || 0) + noOfDays,
        },
      }));
      setLeaveForm({ leaveType: "", fromDate: "", toDate: "", reason: "" });
      setShowModal(false);
      toast.success("Leave applied successfully");
    } catch (error) {
      toast.error("Failed to apply leave");
    }
  };

  const handleBulkMark = (type: 'Present' | 'Absent') => {
    setShowBulkModal(type.toLowerCase() as 'present' | 'absent');
  };
  const confirmBulkMark = (type: 'Present' | 'Absent') => {
    setStudents((prev) =>
      prev.map((student) => {
        if (existingAttendance[student.id]) return student; // skip already marked
        if (selectedRowKeys.length === 0 || selectedRowKeys.includes(student.key)) {
          return { ...student, attendance: type, present: type === 'Present', absent: type === 'Absent' };
        }
        return student;
      })
    );
    toast.success(
      selectedRowKeys.length > 0
        ? `Selected students marked as ${type}`
        : `All students marked as ${type}`
    );
    setSelectedRowKeys([]);
    setShowBulkModal(null);
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
      !addFormData.subjectId ||
      !addFormData.status
    ) {
      toast.error("Please select class, subject, and lesson");
      return;
    }
    setSavingAttendance(true);
    try {
      const targetStudents =
        selectedRowKeys.length > 0
          ? students.filter((s) => selectedRowKeys.includes(s.key))
          : students;
      if (targetStudents.length >= 2) {
        const attendancePayload: IAttendancePayload = {
          lessonId: addFormData.status,
          date: new Date(attendanceDate),
          records: targetStudents.map((student) => ({
            studentId: student.id || student.key.toString(),
            present: student.attendance === "Present",
            status: AttendanceStatus.PRESENT,
          })),
        };
        await markMultipleAttendance([attendancePayload]);
        toast.success("Student attendance saved successfully");
      } else if (targetStudents.length === 1) {
        const student = targetStudents[0];
        const attendanceData: IAttendance = {
          id: student.id || student.key.toString(),
          studentId: student.id || student.key.toString(),
          lessonId: addFormData.status,
          present: student.attendance === "Present",
          status: AttendanceStatus.PRESENT,
          date: new Date(attendanceDate),
        };
        await createAttendance(attendanceData);
        toast.success("Student attendance saved successfully");
      } else {
        toast.error("No students selected for attendance");
        return;
      }
      setSelectedRowKeys([]);
    } catch (error) {
      toast.error("Failed to save attendance");
    } finally {
      setSavingAttendance(false);
    }
  };

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
      render: (text: string, record: any, index: number) => {
        const alreadyMarked = existingAttendance[record.id];
        if (alreadyMarked) {
          return (
            <span className={`badge badge-soft-${alreadyMarked.present ? "success" : "danger"}`}>{alreadyMarked.present ? "Present" : "Absent"}</span>
          );
        }
        return (
          <div className="d-flex align-items-center check-radio-group flex-nowrap">
            <label className="custom-radio me-3">
              <input
                type="radio"
                name={`student${record.key}`}
                checked={record.present}
                onChange={() => handleAttendanceChange(index, "Present")}
                className="me-1"
                disabled={!!alreadyMarked}
              />
              <span className="checkmark bg-success"></span> Present
            </label>
            <label className="custom-radio">
              <input
                type="radio"
                name={`student${record.key}`}
                checked={record.absent}
                onChange={() => handleAttendanceChange(index, "Absent")}
                className="me-1"
                disabled={!!alreadyMarked}
              />
              <span className="checkmark bg-danger"></span> Absent
            </label>
          </div>
        );
      },
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
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
        <button
          className="btn btn-outline-info btn-sm"
          onClick={() => handleViewStudentAttendance(record)}
        >
          View Attendance
        </button>
      ),
    },
  ];

  const studentLeaveRequestColumns = [
    {
      title: "Student Name",
      dataIndex: ["user", "name"],
      render: (text: string, record: any) => (
        <Link to="#" className="link-primary fw-semibold">{record.user?.name || "Unknown Student"}</Link>
      ),
      sorter: (a: any, b: any) => (a.user?.name || "").localeCompare(b.user?.name || ""),
    },
    {
      title: "Leave Type",
      dataIndex: "reason",
      render: (text: string) => (
        <span className="badge badge-soft-primary fs-12">{text}</span>
      ),
      sorter: (a: any, b: any) => a.reason.localeCompare(b.reason),
    },
    {
      title: "From Date",
      dataIndex: "fromDate",
      render: (text: string) => (
        <span className="text-dark fw-medium">
          {new Date(text).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })}
        </span>
      ),
      sorter: (a: any, b: any) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime(),
    },
    {
      title: "To Date",
      dataIndex: "toDate",
      render: (text: string) => (
        <span className="text-dark fw-medium">
          {new Date(text).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })}
        </span>
      ),
      sorter: (a: any, b: any) => new Date(a.toDate).getTime() - new Date(b.toDate).getTime(),
    },
    {
      title: "No. of Days",
      dataIndex: "noOfDays",
      render: (text: number, record: any) => {
        const fromDate = new Date(record.fromDate);
        const toDate = new Date(record.toDate);
        const days = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return (
          <span className="badge badge-soft-warning fs-12 fw-semibold">{days} days</span>
        );
      },
      sorter: (a: any, b: any) => {
        const aDays = Math.ceil((new Date(a.toDate).getTime() - new Date(a.fromDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const bDays = Math.ceil((new Date(b.toDate).getTime() - new Date(b.fromDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return aDays - bDays;
      },
    },
    {
      title: "Applied On",
      dataIndex: "createdAt",
      render: (text: string) => (
        <span className="text-muted fs-12">
          {new Date(text).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          })}
        </span>
      ),
      sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: string) => {
        const statusConfig = {
          "APPROVED": { color: "success", bgColor: "bg-success", textColor: "text-white" },
          "REJECTED": { color: "danger", bgColor: "bg-danger", textColor: "text-white" },
          "PENDING": { color: "warning", bgColor: "bg-warning", textColor: "text-dark" }
        };
        const config = statusConfig[text as keyof typeof statusConfig] || statusConfig.PENDING;
        
        return (
          <span className={`badge ${config.bgColor} ${config.textColor} fs-12 fw-semibold px-3 py-2`}>
            <i className="ti ti-circle-filled fs-6 me-1"></i>
            {text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()}
          </span>
        );
      },
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-success btn-sm btn-approve fw-semibold"
            data-leave-id={record.id}
            onClick={() => handleApproveLeave(record.id)}
            disabled={record.status !== "PENDING"}
            style={{ 
              backgroundColor: record.status === "PENDING" ? "#28a745" : "#6c757d",
              borderColor: record.status === "PENDING" ? "#28a745" : "#6c757d",
              color: "white"
            }}
          >
            <i className="ti ti-check me-1"></i>
            Approve
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm btn-reject fw-semibold"
            data-leave-id={record.id}
            onClick={() => handleRejectLeave(record.id)}
            disabled={record.status !== "PENDING"}
            style={{ 
              backgroundColor: record.status === "PENDING" ? "#dc3545" : "#6c757d",
              borderColor: record.status === "PENDING" ? "#dc3545" : "#6c757d",
              color: "white"
            }}
          >
            <i className="ti ti-x me-1"></i>
            Reject
          </button>
        </div>
      ),
    },
  ];

  // Compute if all students are already marked
  const allMarked = students.length > 0 && students.every((s) => existingAttendance[s.id]);

  // Handler to open student overview modal
  const handleViewStudentAttendance = async (student: any) => {
    setLoadingStudentOverview(true);
    try {
      // Fetch attendance history for this student
      const res = await api.get(`/student/dashboard/attendance-leave/${student.id}`);
      setShowStudentModal({ student, records: res.data?.attendance || [] });
    } catch (e) {
      setShowStudentModal({ student, records: [] });
    } finally {
      setLoadingStudentOverview(false);
    }
  };

  return (
    <ErrorBoundary>
      <div
        className={
          isMobile
            ? "page-wrapper bg-dark-theme min-vh-100 d-flex flex-column"
            : "p-3 bg-dark-theme min-vh-100 d-flex flex-column"
        }
      >
        <ToastContainer 
          position="top-center" 
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDark ? "dark" : "light"}
        />
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
                                  <LoadingSkeleton lines={1} height={24} className="col-6 mb-2" />
                                  <div className="d-flex align-items-center flex-wrap">
                                    <LoadingSkeleton lines={1} height={16} className="col-4 me-2 mb-0" />
                                    <LoadingSkeleton lines={1} height={16} className="col-4 mb-0" />
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
                                    Used: {leaveBalances[leaveType as LeaveType]?.used || 0}
                                  </p>
                                  <p className="mb-0">
                                    Available:{" "}
                                    {(leaveBalances[leaveType as LeaveType]?.total || 0) -
                                      (leaveBalances[leaveType as LeaveType]?.used || 0)}
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
                                  <LoadingSkeleton lines={1} height={16} className="col-4 mb-2" />
                                  <LoadingSkeleton lines={1} height={16} className="col-6 mb-2" />
                                  <LoadingSkeleton lines={1} height={16} className="col-2 mb-2" />
                                  <LoadingSkeleton lines={1} height={16} className="col-3 mb-2" />
                                  <LoadingSkeleton lines={1} height={16} className="col-2 mb-2" />
                                </div>
                              ))}
                          </div>
                        ) : leaves.length === 0 ? (
                          <div className="text-center p-3">
                            <p>No leave requests found.</p>
                          </div>
                        ) : (
                          <Table
                            key={`leaves-${leaves.length}`}
                            rowKey="id"
                            dataSource={leaves || []}
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
                                    <LoadingSkeleton lines={1} height={48} className="avatar avatar-lg bg-secondary bg-opacity-10 rounded me-3 flex-shrink-0" />
                                    <div className="ms-2">
                                      <LoadingSkeleton lines={1} height={16} className="col-6 mb-1" />
                                      <LoadingSkeleton lines={1} height={24} className="col-4" />
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
                                >
                                  Export as PDF
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="#"
                                  className="dropdown-item rounded-1"
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
                                  <LoadingSkeleton lines={1} height={16} className="col-4 mb-2" />
                                  <LoadingSkeleton lines={1} height={16} className="col-2 mb-2" />
                                  <LoadingSkeleton lines={1} height={16} className="col-3 mb-2" />
                                </div>
                              ))}
                          </div>
                        ) : attendance.length === 0 ? (
                          <div className="text-center p-3">
                            <p>No attendance records found.</p>
                          </div>
                        ) : (
                          <Table
                            key={`attendance-${attendance.length}`}
                            rowKey="date"
                            dataSource={attendance || []}
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
                                    (subject: { value: string; label: string }) => (
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
                                  className="btn btn-secondary me-2"
                                  onClick={() => handleBulkMark('Present')}
                                  disabled={allMarked || students.length === 0}
                                >
                                  Bulk Mark Present
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleBulkMark('Absent')}
                                  disabled={allMarked || students.length === 0}
                                >
                                  Bulk Mark Absent
                                </button>
                              </div>
                              <div className="mb-3">
                                <button
                                  className={`btn btn-success ${savingAttendance || allMarked || students.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                  onClick={() =>
                                    !savingAttendance && !allMarked && students.length > 0 && handleSaveAttendance()
                                  }
                                  disabled={savingAttendance || allMarked || students.length === 0}
                                  title={allMarked ? "All students already marked for this lesson and date" : students.length === 0 ? "No students to mark" : ""}
                                >
                                  {allMarked ? "All Marked" : savingAttendance ? "Saving..." : "Save Attendance"}
                                </button>
                              </div>
                              <div className="input-icon-start mb-3 mb-0 position-relative">
                                {/* Removed PredefinedDateRanges */}
                              </div>
                              <div className="mb-3" style={{ minWidth: 180 }}>
                                <label className="form-label mb-1">Attendance Date</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  value={attendanceDate}
                                  max={new Date().toISOString().split("T")[0]}
                                  onChange={(e) => setAttendanceDate(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="card-body p-0 py-2">
                            {loadingStudents || isDataLoading || !localTeacherData ? (
                              <div className="placeholder-glow">
                                {Array(5)
                                  .fill(0)
                                  .map((_, index) => (
                                    <div key={index} className="p-3 border-bottom">
                                      <LoadingSkeleton lines={1} height={16} className="col-2 mb-2" />
                                      <LoadingSkeleton lines={1} height={16} className="col-3 mb-2" />
                                      <LoadingSkeleton lines={1} height={16} className="col-2 mb-2" />
                                      <LoadingSkeleton lines={1} height={16} className="col-2 mb-2" />
                                      <LoadingSkeleton lines={1} height={16} className="col-2 mb-2" />
                                      <LoadingSkeleton lines={1} height={16} className="col-3 mb-2" />
                                    </div>
                                  ))}
                              </div>
                            ) : students.length === 0 ? (
                              <div className="text-center p-3">
                                <p>No students found for the selected class and section.</p>
                              </div>
                            ) : (
                              <Table
                                key={`students-${students.length}`}
                                rowKey="key"
                                dataSource={students || []}
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
                      
                      {/* Dynamic Statistics */}
                      {studentLeaveRequests.length > 0 && (
                        <div className="card-body p-3 border-bottom">
                          <div className="row g-3">
                            <div className="col-md-3">
                              <div className="d-flex align-items-center p-3 rounded bg-warning bg-opacity-10">
                                <i className="ti ti-clock fs-24 text-warning me-3"></i>
                                <div>
                                  <h6 className="mb-0 text-warning fw-semibold">
                                    {studentLeaveRequests.filter(req => req.status === "PENDING").length}
                                  </h6>
                                  <small className="text-muted">Pending</small>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="d-flex align-items-center p-3 rounded bg-success bg-opacity-10">
                                <i className="ti ti-check fs-24 text-success me-3"></i>
                                <div>
                                  <h6 className="mb-0 text-success fw-semibold">
                                    {studentLeaveRequests.filter(req => req.status === "APPROVED").length}
                                  </h6>
                                  <small className="text-muted">Approved</small>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="d-flex align-items-center p-3 rounded bg-danger bg-opacity-10">
                                <i className="ti ti-x fs-24 text-danger me-3"></i>
                                <div>
                                  <h6 className="mb-0 text-danger fw-semibold">
                                    {studentLeaveRequests.filter(req => req.status === "REJECTED").length}
                                  </h6>
                                  <small className="text-muted">Rejected</small>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="d-flex align-items-center p-3 rounded bg-primary bg-opacity-10">
                                <i className="ti ti-calendar fs-24 text-primary me-3"></i>
                                <div>
                                  <h6 className="mb-0 text-primary fw-semibold">
                                    {studentLeaveRequests.length}
                                  </h6>
                                  <small className="text-muted">Total</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="card-body p-0 py-2">
                        {loadingLeaveRequests ? (
                          <div className="placeholder-glow">
                            {Array(5)
                              .fill(0)
                              .map((_, index) => (
                                <div key={index} className="p-3 border-bottom">
                                  <LoadingSkeleton lines={1} height={16} className="col-3 mb-2" />
                                  <LoadingSkeleton lines={1} height={16} className="col-2 mb-2" />
                                  <LoadingSkeleton lines={1} height={16} className="col-2 mb-2" />
                                  <LoadingSkeleton lines={1} height={16} className="col-3 mb-2" />
                                  <LoadingSkeleton lines={1} height={16} className="col-2 mb-2" />
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
                            key={`student-leaves-${studentLeaveRequests.length}`}
                            dataSource={studentLeaveRequests || []}
                            columns={studentLeaveRequestColumns}
                            rowKey="id"
                            className={isDark ? "table table-dark" : "table table-light"}
                            rowClassName={(record) => {
                              if (record.status === "APPROVED") return "table-success";
                              if (record.status === "REJECTED") return "table-danger";
                              return "table-warning";
                            }}
                            pagination={{
                              pageSize: 10,
                              showSizeChanger: false,
                              showQuickJumper: false
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
        {/* Bulk Mark Confirmation Modal */}
        <Modal show={!!showBulkModal} onHide={() => setShowBulkModal(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Bulk Mark</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to mark {selectedRowKeys.length > 0 ? 'selected' : 'all'} students as <b>{showBulkModal === 'present' ? 'Present' : 'Absent'}</b>? This will not affect students already marked for this lesson and date.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowBulkModal(null)}>
              Cancel
            </Button>
            <Button variant={showBulkModal === 'present' ? 'success' : 'danger'} onClick={() => confirmBulkMark(showBulkModal === 'present' ? 'Present' : 'Absent')}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
        <TeacherModal />
        {/* Student Attendance Overview Modal */}
        <Modal show={!!showStudentModal} onHide={() => setShowStudentModal(null)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Attendance Overview - {showStudentModal?.student?.name || ''}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loadingStudentOverview ? (
              <div className="text-center p-4">Loading...</div>
            ) : showStudentModal && showStudentModal.records?.length === 0 ? (
              <div className="text-center p-4">No attendance records found.</div>
            ) : showStudentModal ? (
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Lesson</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showStudentModal.records.map((rec, idx) => (
                      <tr key={idx}>
                        <td>{new Date(rec.date).toLocaleDateString('en-IN')}</td>
                        <td>{rec.lesson?.name || '-'}</td>
                        <td>
                          <span className={`badge badge-soft-${rec.present ? 'success' : 'danger'}`}>{rec.present ? 'Present' : 'Absent'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </Modal.Body>
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

export default TeacherLeave;