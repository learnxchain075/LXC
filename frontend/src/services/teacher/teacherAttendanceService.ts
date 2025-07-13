import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
//trying not confirm this wil work  so keep  waiting 
// Types for Teacher Attendance
export interface ITeacherAttendance {
  id: string;
  teacherId: string;
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMarkAttendanceRequest {
  teacherId: string;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
  location?: string;
  notes?: string;
}

export interface IFaceAttendanceRequest {
  teacherId: string;
  image: File | Blob;
  location?: string;
  notes?: string;
}

export interface IAttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  attendanceRate: number;
  currentMonthStats: {
    present: number;
    absent: number;
    late: number;
    halfDay: number;
  };
}

export interface IAttendanceReport {
  teacherId: string;
  month: number;
  year: number;
  attendanceRecords: ITeacherAttendance[];
  stats: IAttendanceStats;
}

// Mark Teacher Attendance
export const markTeacherAttendance = async (
  data: IMarkAttendanceRequest
): Promise<AxiosResponse<ITeacherAttendance>> => {
  try {
    const payload = {
      ...data,
      date: data.date instanceof Date ? data.date.toISOString() : data.date,
      checkIn: data.checkIn instanceof Date ? data.checkIn.toISOString() : data.checkIn,
      checkOut: data.checkOut instanceof Date ? data.checkOut.toISOString() : data.checkOut,
    };
    
    return await BaseApi.postRequest(`/teacher/attendance/mark`, payload);
  } catch (error) {
    throw error;
  }
};

// Mark Teacher Face Attendance
export const markTeacherFaceAttendance = async (
  data: IFaceAttendanceRequest
): Promise<AxiosResponse<ITeacherAttendance>> => {
  try {
    const formData = new FormData();
    formData.append('teacherId', data.teacherId);
    formData.append('image', data.image, 'attendance.jpg');
    if (data.location) formData.append('location', data.location);
    if (data.notes) formData.append('notes', data.notes);
    
    return await BaseApi.postRequest(`/teacher/attendance/face-mark`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    throw error;
  }
};

// Get Teacher Attendance for Today
export const getTeacherTodayAttendance = async (
  teacherId: string
): Promise<AxiosResponse<ITeacherAttendance | null>> => {
  try {
    return await BaseApi.getRequest(`/teacher/attendance/today/${teacherId}`);
  } catch (error) {
    throw error;
  }
};

// Get Teacher Attendance History
export const getTeacherAttendanceHistory = async (
  teacherId: string,
  filters?: {
    startDate?: Date;
    endDate?: Date;
    status?: string;
    page?: number;
    limit?: number;
  }
): Promise<AxiosResponse<ITeacherAttendance[]>> => {
  try {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return await BaseApi.getRequest(`/teacher/attendance/history/${teacherId}${query}`);
  } catch (error) {
    throw error;
  }
};

// Get Teacher Attendance Stats
export const getTeacherAttendanceStats = async (
  teacherId: string,
  month?: number,
  year?: number
): Promise<AxiosResponse<IAttendanceStats>> => {
  try {
    const params = new URLSearchParams();
    if (month !== undefined) params.append('month', month.toString());
    if (year !== undefined) params.append('year', year.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return await BaseApi.getRequest(`/teacher/attendance/stats/${teacherId}${query}`);
  } catch (error) {
    throw error;
  }
};

// Get Teacher Attendance Report
export const getTeacherAttendanceReport = async (
  teacherId: string,
  month: number,
  year: number
): Promise<AxiosResponse<IAttendanceReport>> => {
  try {
    return await BaseApi.getRequest(`/teacher/attendance/report/${teacherId}/${month}/${year}`);
  } catch (error) {
    throw error;
  }
};

// Update Teacher Attendance
export const updateTeacherAttendance = async (
  attendanceId: string,
  data: Partial<IMarkAttendanceRequest>
): Promise<AxiosResponse<ITeacherAttendance>> => {
  try {
    const payload = {
      ...data,
      date: data.date instanceof Date ? data.date.toISOString() : data.date,
      checkIn: data.checkIn instanceof Date ? data.checkIn.toISOString() : data.checkIn,
      checkOut: data.checkOut instanceof Date ? data.checkOut.toISOString() : data.checkOut,
    };
    
    return await BaseApi.putRequest(`/teacher/attendance/${attendanceId}`, payload);
  } catch (error) {
    throw error;
  }
};

// Delete Teacher Attendance
export const deleteTeacherAttendance = async (
  attendanceId: string
): Promise<AxiosResponse<void>> => {
  try {
    return await BaseApi.deleteRequest(`/teacher/attendance/${attendanceId}`);
  } catch (error) {
    throw error;
  }
};

// Bulk Mark Teacher Attendance
export const bulkMarkTeacherAttendance = async (
  data: {
    teacherId: string;
    attendances: Array<{
      date: Date;
      status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
      checkIn?: Date;
      checkOut?: Date;
      notes?: string;
    }>;
  }
): Promise<AxiosResponse<ITeacherAttendance[]>> => {
  try {
    const payload = {
      ...data,
      attendances: data.attendances.map(att => ({
        ...att,
        date: att.date instanceof Date ? att.date.toISOString() : att.date,
        checkIn: att.checkIn instanceof Date ? att.checkIn.toISOString() : att.checkIn,
        checkOut: att.checkOut instanceof Date ? att.checkOut.toISOString() : att.checkOut,
      })),
    };
    
    return await BaseApi.postRequest(`/teacher/attendance/bulk-mark`, payload);
  } catch (error) {
    throw error;
  }
};

// Get Teacher Attendance Calendar
export const getTeacherAttendanceCalendar = async (
  teacherId: string,
  month: number,
  year: number
): Promise<AxiosResponse<{ [date: string]: ITeacherAttendance }>> => {
  try {
    return await BaseApi.getRequest(`/teacher/attendance/calendar/${teacherId}/${month}/${year}`);
  } catch (error) {
    throw error;
  }
};

// Export Teacher Attendance Report
export const exportTeacherAttendanceReport = async (
  teacherId: string,
  format: 'pdf' | 'excel' | 'csv',
  filters?: {
    startDate?: Date;
    endDate?: Date;
    status?: string;
  }
): Promise<AxiosResponse<Blob>> => {
  try {
    const params = new URLSearchParams();
    params.append('format', format);
    if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());
    if (filters?.status) params.append('status', filters.status);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return await BaseApi.getRequest(`/teacher/attendance/export/${teacherId}${query}`, {
      responseType: 'blob',
    });
  } catch (error) {
    throw error;
  }
};

// Get Teacher Attendance Settings
export const getTeacherAttendanceSettings = async (
  teacherId: string
): Promise<AxiosResponse<{
  workingHours: { start: string; end: string };
  lateThreshold: number; // minutes
  halfDayThreshold: number; // hours
  autoCheckout: boolean;
  locationRequired: boolean;
}>> => {
  try {
    return await BaseApi.getRequest(`/teacher/attendance/settings/${teacherId}`);
  } catch (error) {
    throw error;
  }
};

// Update Teacher Attendance Settings
export const updateTeacherAttendanceSettings = async (
  teacherId: string,
  settings: {
    workingHours?: { start: string; end: string };
    lateThreshold?: number;
    halfDayThreshold?: number;
    autoCheckout?: boolean;
    locationRequired?: boolean;
  }
): Promise<AxiosResponse<void>> => {
  try {
    const payload: Record<string, any> = { ...settings };
    return await BaseApi.putRequest(`/teacher/attendance/settings/${teacherId}`, payload);
  } catch (error) {
    throw error;
  }
};

// Get Teacher Attendance Notifications
export const getTeacherAttendanceNotifications = async (
  teacherId: string
): Promise<AxiosResponse<{
  id: string;
  type: 'LATE_ARRIVAL' | 'MISSED_CHECKIN' | 'MISSED_CHECKOUT' | 'OVERTIME';
  message: string;
  date: Date;
  isRead: boolean;
}[]>> => {
  try {
    return await BaseApi.getRequest(`/teacher/attendance/notifications/${teacherId}`);
  } catch (error) {
    throw error;
  }
};

// Mark Attendance Notification as Read
export const markAttendanceNotificationAsRead = async (
  notificationId: string
): Promise<AxiosResponse<void>> => {
  try {
    return await BaseApi.patchRequest(`/teacher/attendance/notifications/${notificationId}/read`);
  } catch (error) {
    throw error;
  }
}; 