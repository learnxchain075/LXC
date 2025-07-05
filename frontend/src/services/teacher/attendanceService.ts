import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IAttendance, IAttendancePayload } from "../types/teacher/attendanceService";

/**
 * Create Attendance
 * @param data - Attendance data (studentId, lessonId, present)
 * @returns AxiosResponse<IAttendance>
 */
export const createAttendance = async (
  data: IAttendance
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest(`/teacher/attendance`, data);
};

/**
 * Get All Attendances (Teacher)
 * @returns AxiosResponse<IAttendance[]>
 */
export const getAttendances = async (): Promise<AxiosResponse<IAttendance[]>> => {
  const response = await BaseApi.getRequest(`/teacher/attendance`);
      // API /teacher/attendance response
  return response;
};

/**
 * Get Attendance By ID
 * @param attendanceId - Unique attendance record ID
 * @returns AxiosResponse<IAttendance>
 */
export const getAttendanceById = async (
  attendanceId: string
): Promise<AxiosResponse<IAttendance>> => {
  return await BaseApi.getRequest(`/teacher/attendance/${attendanceId}`);
};

/**
 * Update Attendance
 * @param attendanceId - ID of attendance record
 * @param data - Partial data (studentId, lessonId, present)
 * @returns AxiosResponse<IAttendance>
 */
export const updateAttendance = async (
  attendanceId: string,
  data: Partial<IAttendance>
): Promise<AxiosResponse<IAttendance>> => {
  // Convert Date fields to ISO strings if present
  const payload: Record<string, any> = { ...data };
  if (payload.date instanceof Date) {
    payload.date = payload.date.toISOString();
  }
  return await BaseApi.putRequest(`/teacher/attendance/${attendanceId}`, payload);
};

/**
 * Delete Attendance
 * @param attendanceId - Unique attendance ID
 * @returns AxiosResponse<IAttendance>
 */
export const deleteAttendance = async (
  attendanceId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/teacher/attendance/${attendanceId}`);
};

/**
 * Mark Multiple Attendance Records
 * @param data - Array of attendance entries
 * @returns AxiosResponse<any>
 */
export const markMultipleAttendance = async (
  data: IAttendancePayload[]
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest(`/teacher/mark-multiple`, data);
};

/**
 * Get Student Attendance and Leave
 * @param studentId - Unique student ID
 * @returns AxiosResponse<any>
 */
export const getStudentAttendanceAndLeave = async (
  studentId: string
): Promise<AxiosResponse<any>> => {
  const response = await BaseApi.getRequest(`/student/${studentId}/attendance-leaves`);
      // API /student/attendance-leaves response
  return response;
};
