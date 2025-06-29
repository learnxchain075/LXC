import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IBusAttendanceForm } from "../types/transport/busAttendanceService";

/**
 * ✅ Record Bus Attendance
 * Sends a POST request to record attendance for a student on a bus
 * @param data - Bus attendance form
 * @returns AxiosResponse<IBusAttendanceForm>
 */
export const recordBusAttendance = async (
  data: IBusAttendanceForm
): Promise<AxiosResponse<IBusAttendanceForm>> => {
  return await BaseApi.postRequest(`/transport/school/bus-attendence`, {
    ...data,
  });
};

/**
 * ✅ Get All Attendance Records
 * Fetches all bus attendance records
 * @returns AxiosResponse<IBusAttendanceForm[]>
 */
export const getBusAttendance = async (): Promise<AxiosResponse<IBusAttendanceForm[]>> => {
  return await BaseApi.getRequest(`/transport/school/bus-attendences`);
};

/**
 * ✅ Get Attendance By Student
 * Fetches all bus attendance records for a specific student
 * @param studentId - ID of the student
 * @returns AxiosResponse<IBusAttendanceForm[]>
 */
export const getBusAttendanceByStudent = async (
  studentId: string
): Promise<AxiosResponse<IBusAttendanceForm[]>> => {
  return await BaseApi.getRequest(`/transport/school/bus-attendence/${studentId}`);
};

/**
 * ✅ Update Attendance Record
 * Updates the attendance status of a record
 * @param attendanceId - ID of the attendance record
 * @param data - Partial<IBusAttendanceForm>
 * @returns AxiosResponse<IBusAttendanceForm>
 */
export const updateBusAttendance = async (
  attendanceId: string,
  data: Partial<IBusAttendanceForm>
): Promise<AxiosResponse<IBusAttendanceForm>> => {
  return await BaseApi.patchRequest(`/transport/school/bus-attendence/${attendanceId}`, {
    ...data as any,
  });
};

/**
 * ✅ Delete Attendance Record
 * Deletes a specific bus attendance record
 * @param attendanceId - ID of the attendance record
 * @returns AxiosResponse<IBusAttendanceForm>
 */
export const deleteBusAttendance = async (
  attendanceId: string
): Promise<AxiosResponse<IBusAttendanceForm>> => {
  return await BaseApi.deleteRequest(`/transport/school/bus-attendence/${attendanceId}`);
};
