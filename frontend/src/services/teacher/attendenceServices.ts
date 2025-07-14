import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IattendanceTeacher } from "../types/teacher/attendanceService";
// import { IattendanceTecaher } from "../types/attendance";

/**
 * ✅ Create Attendance
 * Sends a POST request to create a new attendance record
 * @param data - Attendance data (studentId, lessonId, present)
 * @returns AxiosResponse<IattendanceTecaher>
 */
export const createAttendance = async (
  data: IattendanceTeacher
): Promise<AxiosResponse<IattendanceTeacher>> => {
  return await BaseApi.postRequest(`/teacher/attendence`, {
    studentId: data.studentId,
    lessonId: data.lessonId,
    present: data.present,
  });
};

/**
 * ✅ Get All Attendance Records
 * Sends a GET request to fetch all attendance records
 * @returns AxiosResponse<IattendanceTecaher[]>
 */
export const getAttendances = async (): Promise<AxiosResponse<IattendanceTeacher[]>> => {
  return await BaseApi.getRequest(`/teacher/attendence`);
};

/**
 * ✅ Get Attendance By ID
 * Sends a GET request to fetch a specific attendance record by its ID
 * @param attendanceId - Unique identifier for the attendance record
 * @returns AxiosResponse<IattendanceTecaher>
 */
export const getAttendanceById = async (
  attendanceId: string
): Promise<AxiosResponse<IattendanceTeacher>> => {
  return await BaseApi.getRequest(`/teacher/attendence/${attendanceId}`);
};

/**
 * ✅ Update Attendance
 * Sends a PUT request to update a specific attendance record by ID
 * @param attendanceId - Unique identifier for the attendance record
 * @param data - Partial data to update (studentId, lessonId, present)
 * @returns AxiosResponse<IattendanceTecaher>
 */
export const updateAttendance = async (
  attendanceId: string,
  data: Partial<IattendanceTeacher>
): Promise<AxiosResponse<IattendanceTeacher>> => {
  return await BaseApi.putRequest(`/teacher/attendence/${attendanceId}`, {
    ...(data.studentId && { studentId: data.studentId }),
    ...(data.lessonId && { lessonId: data.lessonId }),
    ...(data.present && { present: data.present }),
  });
};

/**
 * ✅ Delete Attendance
 * Sends a DELETE request to remove a specific attendance record by ID
 * @param attendanceId - Unique identifier for the attendance record
 * @returns AxiosResponse<IattendanceTecaher>
 */
export const deleteAttendance = async (
  attendanceId: string
): Promise<AxiosResponse<IattendanceTeacher>> => {
  return await BaseApi.deleteRequest(`/teacher/attendence/${attendanceId}`);
};

/**
 * ✅ Get Attendance Records by Lesson and Date
 * Sends a GET request to fetch attendance records for a specific lesson and date
 * @param lessonId - Lesson identifier
 * @param date - Date string (yyyy-mm-dd)
 * @returns AxiosResponse<IattendanceTeacher[]>
 */
export const getAttendanceByLessonAndDate = async (
  
): Promise<AxiosResponse<any[]>> => {
  return await BaseApi.getRequest(`/teacher/attendence`);
};
