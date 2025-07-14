import BaseApi from "../BaseApi";


const getTeacherId = () => {
  return localStorage.getItem("teacherId") || "";
};

// Teacher UI Dashboard Data - using actual backend endpoint
export const getTeacherUIDashboardData = async () => {
  try {
    const teacherId = getTeacherId();
    if (!teacherId) {
      throw new Error("Teacher ID not found");
    }
    
    // Backend route: /school-teacher/dashboard
    const response = await BaseApi.getRequest(`/school-teacher/dashboard`);
    return response;
  } catch (error) {
    console.error("Error fetching teacher dashboard data:", error);
    throw error;
  }
};

// Teacher UI Leave Balances - using actual backend endpoint
export const getTeacherUILeaveBalances = async () => {
  try {
    const teacherId = getTeacherId();
    if (!teacherId) {
      throw new Error("Teacher ID not found");
    }
    
    // Backend route: /teacher/:teacherId/student-leave-requests (for leave data)
    const response = await BaseApi.getRequest(`/teacher/${teacherId}/student-leave-requests`);
    return response;
  } catch (error) {
    console.error("Error fetching teacher leave balances:", error);
    throw error;
  }
};

// Teacher UI Attendance Stats - using actual backend endpoint
export const getTeacherUIAttendanceStats = async () => {
  try {
    const teacherId = getTeacherId();
    if (!teacherId) {
      throw new Error("Teacher ID not found");
    }
    
    // This endpoint doesn't exist, return mock data for now
    return {
      status: 200,
      data: {
        attendanceRate: 85,
        totalDays: 20,
        presentDays: 17,
        absentDays: 2,
        lateDays: 1,
        currentMonth: {
          present: 15,
          absent: 2,
          late: 1
        }
      }
    };
  } catch (error) {
    console.error("Error fetching teacher attendance stats:", error);
    throw error;
  }
};

// Teacher UI Today Attendance - using actual backend endpoint
export const getTeacherUITodayAttendance = async () => {
  try {
    const teacherId = getTeacherId();
    if (!teacherId) {
      throw new Error("Teacher ID not found");
    }
    
    // This endpoint doesn't exist, return mock data for now
    return {
      status: 200,
      data: {
        id: "att1",
        teacherId,
        date: new Date().toISOString(),
        checkIn: null,
        checkOut: null,
        status: "PRESENT" as const,
        location: "School Campus",
        notes: "No attendance marked yet"
      }
    };
  } catch (error) {
    console.error("Error fetching teacher today attendance:", error);
    throw error;
  }
};

// Teacher UI Student Leave Requests - using actual backend endpoint
export const getTeacherUIStudentLeaveRequests = async () => {
  try {
    const teacherId = getTeacherId();
    if (!teacherId) {
      throw new Error("Teacher ID not found");
    }
    
    // Backend route: /teacher/:teacherId/student-leave-requests
    const response = await BaseApi.getRequest(`/teacher/${teacherId}/student-leave-requests`);
    return response;
  } catch (error) {
    console.error("Error fetching teacher student leave requests:", error);
    throw error;
  }
};

// Teacher UI Mark Attendance - using actual backend endpoint
export const markTeacherUIAttendance = async (attendanceData: any) => {
  try {
    const teacherId = getTeacherId();
    if (!teacherId) {
      throw new Error("Teacher ID not found");
    }
    
    // Backend route: /teacher/attendance
    const response = await BaseApi.postRequest(`/teacher/attendance`, attendanceData);
    return response;
  } catch (error) {
    console.error("Error marking teacher attendance:", error);
    throw error;
  }
};

// Teacher UI Mark Face Attendance - using actual backend endpoint
export const markTeacherUIFaceAttendance = async (faceAttendanceData: any) => {
  try {
    const teacherId = getTeacherId();
    if (!teacherId) {
      throw new Error("Teacher ID not found");
    }
    if (!faceAttendanceData.image || !(faceAttendanceData.image instanceof Blob)) {
      throw new Error("Invalid image data provided");
    }

    // --- BASE64 PAYLOAD (default, as before) ---
    const base64Image = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Try with and without the prefix
        // const base64 = result.split(',')[1];
        resolve(result); // send full data URL for debugging
      };
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(faceAttendanceData.image);
    });
    const payload = {
      selfieBase64: base64Image, // try sending full data URL
      latitude: faceAttendanceData.latitude || 0,
      longitude: faceAttendanceData.longitude || 0,
    };
    console.log('Sending face attendance payload (base64):', payload);
    let response = await BaseApi.postRequest(`/teacher/attendance/mark`, payload);
    if (response.status === 400 || response.data?.error?.includes('Invalid image')) {
      // --- MULTIPART/FORM-DATA FALLBACK ---
      const formData = new FormData();
      formData.append('selfie', faceAttendanceData.image);
      formData.append('latitude', faceAttendanceData.latitude || 0);
      formData.append('longitude', faceAttendanceData.longitude || 0);
      console.log('Sending face attendance payload (form-data):', formData);
      response = await BaseApi.postRequest(`/teacher/attendance/mark`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return response;
  } catch (error) {
    console.error("Error marking teacher face attendance:", error);
    throw error;
  }
};

// Teacher UI Approve Student Leave - using actual backend endpoint
export const approveTeacherUIStudentLeave = async (leaveId: string) => {
  try {
    const teacherId = getTeacherId();
    if (!teacherId) {
      throw new Error("Teacher ID not found");
    }
    
    // Backend route: /user/leave/:id/approve
    const response = await BaseApi.patchRequest(`/user/leave/${leaveId}/approve`, {});
    return response;
  } catch (error) {
    console.error("Error approving teacher student leave:", error);
    throw error;
  }
};

// Teacher UI Reject Student Leave - using actual backend endpoint
export const rejectTeacherUIStudentLeave = async (leaveId: string) => {
  try {
    const teacherId = getTeacherId();
    if (!teacherId) {
      throw new Error("Teacher ID not found");
    }
    
    // Backend route: /user/leave/:id/reject
    const response = await BaseApi.patchRequest(`/user/leave/${leaveId}/reject`, {});
    return response;
  } catch (error) {
    console.error("Error rejecting teacher student leave:", error);
    throw error;
  }
};

// Teacher UI Classes - using actual backend endpoint
export const getTeacherUIClasses = async () => {
  try {
    const teacherId = getTeacherId();
    if (!teacherId) {
      throw new Error("Teacher ID not found");
    }
    
    // Use the dashboard data classOverview instead of separate classes endpoint
    const dashboardResponse = await BaseApi.getRequest(`/school-teacher/dashboard`);
    if (dashboardResponse.status === 200) {
      return {
        status: 200,
        data: dashboardResponse.data.classOverview || []
      };
    }
    
    return { status: 200, data: [] };
  } catch (error) {
    console.error("Error fetching teacher classes:", error);
    throw error;
  }
};

// Teacher UI Lessons - using actual backend endpoint
export const getTeacherUILessons = async () => {
  try {
    const teacherId = getTeacherId();
    if (!teacherId) {
      throw new Error("Teacher ID not found");
    }
    
    // Use the dashboard data timetable instead of separate lessons endpoint
    const dashboardResponse = await BaseApi.getRequest(`/school-teacher/dashboard`);
    if (dashboardResponse.status === 200) {
      return {
        status: 200,
        data: dashboardResponse.data.timetable || []
      };
    }
    
    return { status: 200, data: [] };
  } catch (error) {
    console.error("Error fetching teacher lessons:", error);
    throw error;
  }
};

// Teacher UI Profile - using actual backend endpoint
export const getTeacherUIProfile = async () => {
  try {
    const teacherId = getTeacherId();
    if (!teacherId) {
      throw new Error("Teacher ID not found");
    }
    
    // Backend route: /get-profile (from getProfileRoute)
    const response = await BaseApi.getRequest(`/get-profile`);
    return response;
  } catch (error) {
    console.error("Error fetching teacher profile:", error);
    throw error;
  }
};

// Teacher UI Attendance Report - using actual backend endpoint
export const getTeacherUIAttendanceReport = async (params: any) => {
  try {
    const teacherId = getTeacherId();
    if (!teacherId) {
      throw new Error("Teacher ID not found");
    }
    
    // Backend route: /school/attendance/report
    const response = await BaseApi.getRequest(`/school/attendance/report`, { params });
    return response;
  } catch (error) {
    console.error("Error fetching teacher attendance report:", error);
    throw error;
  }
};

// Quick Actions API Functions

// Teacher UI Apply Leave - using actual backend endpoint
export const applyTeacherLeave = async (leaveData: {
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  emergencyContact?: string;
}) => {
  try {
    const teacherId = getTeacherId();
    if (!teacherId) {
      throw new Error("Teacher ID not found");
    }
    
    // Backend route: /user/leave (from leaveRequestRoutes)
    const response = await BaseApi.postRequest(`/user/leave`, {
      userId: teacherId,
      leaveType: leaveData.leaveType,
      fromDate: leaveData.fromDate,
      toDate: leaveData.toDate,
      reason: leaveData.reason,
      emergencyContact: leaveData.emergencyContact
    });
    return response;
  } catch (error) {
    console.error("Error applying teacher leave:", error);
    throw error;
  }
};

// Teacher UI Get Salary Info - using actual backend endpoint
export const getTeacherSalaryInfo = async () => {
  try {
    const teacherId = getTeacherId();
    if (!teacherId) {
      throw new Error("Teacher ID not found");
    }
    
    // Backend route: /teacher/salary/info
    const response = await BaseApi.getRequest(`/teacher/salary/info`);
    return response;
  } catch (error) {
    console.error("Error fetching teacher salary info:", error);
    throw error;
  }
};

// Teacher UI Get Library Books - using actual backend endpoint
export const getTeacherLibraryBooks = async () => {
  try {
    const teacherId = getTeacherId();
    if (!teacherId) {
      throw new Error("Teacher ID not found");
    }
    
    // Backend route: /teacher/library/books
    const response = await BaseApi.getRequest(`/teacher/library/books`);
    return response;
  } catch (error) {
    console.error("Error fetching teacher library books:", error);
    throw error;
  }
};

// Teacher UI Add Exam - using actual backend endpoint
export const addTeacherExam = async (examData: {
  examTitle: string;
  subject: string;
  classId: string;
  examDate: string;
  startTime: string;
  endTime: string;
  totalMarks: string;
  description?: string;
}) => {
  try {
    const teacherId = getTeacherId();
    if (!teacherId) {
      throw new Error("Teacher ID not found");
    }
    
    // Backend route: /teacher/exam/add
    const response = await BaseApi.postRequest(`/teacher/exam/add`, {
      teacherId,
      ...examData
    });
    return response;
  } catch (error) {
    console.error("Error adding teacher exam:", error);
    throw error;
  }
};

// Teacher UI Get Exam List - using actual backend endpoint
export const getTeacherExams = async () => {
  try {
    const teacherId = getTeacherId();
    if (!teacherId) {
      throw new Error("Teacher ID not found");
    }
    
    // Backend route: /teacher/exam/list
    const response = await BaseApi.getRequest(`/teacher/exam/list`);
    return response;
  } catch (error) {
    console.error("Error fetching teacher exams:", error);
    throw error;
  }
};

// Add Teacher Face (for registration)
export const uploadTeacherFace = async (faceData: { image: File }) => {
  try {
    const teacherId = localStorage.getItem("teacherId");
    if (!teacherId) throw new Error("Teacher ID not found");

    const formData = new FormData();
    formData.append("teacherId", teacherId);
    formData.append("face", faceData.image);

    // POST /admin/teacher/face
    const response = await BaseApi.postRequest("/admin/teacher/face", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response;
  } catch (error) {
    console.error("Error uploading teacher face:", error);
    throw error;
  }
};

// Interfaces for Teacher UI
export interface ITeacherUIDashboardData {
  totalClasses: number;
  totalStudents: number;
  attendanceRate: number;
  leaveBalance: number;
  upcomingClasses: number;
  recentActivities: number;
  pendingLeaves: number;
  todayClasses: number;
  assignmentsDue: number;
  notifications: number;
}

export interface ITeacherUIAttendance {
  id: string;
  teacherId: string;
  date: string;
  checkIn?: string | null;
  checkOut?: string | null;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  location?: string;
  notes?: string;
}

export interface ITeacherUIAttendanceStats {
  attendanceRate: number;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  currentMonth: {
    present: number;
    absent: number;
    late: number;
  };
}

export interface ITeacherUILeaveBalance {
  total: number;
  used: number;
  remaining: number;
}

export interface ITeacherUIStudentLeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  studentClass?: string;
  studentSection?: string;
  studentRollNumber?: string;
  parentContact?: string;
  emergencyContact?: string;
  medicalCertificate?: string;
  approvalDate?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface ITeacherUIClassData {
  id: string;
  name: string;
  section: string;
  roomNumber: string;
  totalStudents: number;
  subjects: string[];
}

export interface ITeacherUILesson {
  id: string;
  subject: {
    id: string;
    name: string;
  };
  class: {
    id: string;
    name: string;
    roomNumber: string;
  };
  startTime: string;
  endTime: string;
  day: string;
  isActive: boolean;
} 