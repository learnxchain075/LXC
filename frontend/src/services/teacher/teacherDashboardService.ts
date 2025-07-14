
import BaseApi from "../BaseApi";

// Types
export interface ITeacherDashboardData {
  leaveBalances: { [key: string]: { total: number; used: number } };
  attendanceStats: any[];
  recentLeaves: any[];
  pendingStudentLeaves: IStudentLeaveRequest[];
}

export interface IStudentLeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
  createdAt: string;
}

export interface IClassData {
  id: string;
  name: string;
  section: string;
  capacity: number;
  roomNumber: string | null;
  students?: IStudent[];
}

export interface ILesson {
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

export interface IStudent {
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
  attendances?: any[]; // <-- Added for type safety
}

// Teacher Dashboard Data
export const getTeacherDashboardData = async (teacherId: string) => {
  try {
    const response = await BaseApi.getRequest(`/teacher/dashboard/${teacherId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Teacher Leave Balances
export const getTeacherLeaveBalances = async (teacherId: string) => {
  try {
    const response = await BaseApi.getRequest(`/teacher/leave-balances/${teacherId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Teacher Attendance Stats
export const getTeacherAttendanceStats = async (teacherId: string) => {
  try {
    const response = await BaseApi.getRequest(`/teacher/attendance-stats/${teacherId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Student Leave Requests for Teacher
export const getStudentLeaveRequestsForTeacher = async (teacherId: string) => {
  try {
    const response = await BaseApi.getRequest(`/teacher/${teacherId}/student-leave-requests`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Approve Student Leave Request
export const approveStudentLeaveRequest = async (leaveId: string) => {
  try {
    return await BaseApi.patchRequest(`/user/leave/${leaveId}/approve`);
  } catch (error) {
    throw error;
  }
};

// Reject Student Leave Request
export const rejectStudentLeaveRequest = async (leaveId: string) => {
  try {
    return await BaseApi.patchRequest(`/user/leave/${leaveId}/reject`);
  } catch (error) {
    throw error;
  }
};

// Get Students for Attendance
export const getStudentsForAttendance = async (classId: string, lessonId: string) => {
  try {
    const response = await BaseApi.getRequest(`/teacher/students-attendance/${classId}/${lessonId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Mark Student Attendance
export const markStudentAttendance = async (attendanceData: any) => {
  try {
    const response = await BaseApi.postRequest(`/teacher/mark-attendance`, attendanceData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get Teacher Classes
export const getTeacherClasses = async (teacherId: string) => {
  try {
    const response = await BaseApi.getRequest(`/teacher/classes/${teacherId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get Teacher Lessons
export const getTeacherLessons = async (teacherId: string) => {
  try {
    const response = await BaseApi.getRequest(`/teacher/lessons/${teacherId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get Attendance Report
export const getAttendanceReport = async (teacherId: string, filters?: any) => {
  try {
    const response = await BaseApi.getRequest(`/teacher/attendance-report/${teacherId}`, { params: filters });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get Teacher Profile
export const getTeacherProfile = async (teacherId: string) => {
  try {
    const response = await BaseApi.getRequest(`/teacher/profile/${teacherId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update Teacher Profile
export const updateTeacherProfile = async (teacherId: string, profileData: any) => {
  try {
    const response = await BaseApi.putRequest(`/teacher/profile/${teacherId}`, profileData);
    return response;
  } catch (error) {
    throw error;
  }
}; 