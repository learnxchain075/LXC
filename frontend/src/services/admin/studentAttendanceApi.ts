import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";

export interface IAttendanceReport {
  date: string;
  class: string;
  section: string;
  present: number;
  absent: number;
  late: number;
  halfday: number;
  holiday: number;
  students: Array<{
    id: string;
    name: string;
    admissionNo: string;
    rollNo: string;
    status: string;
  }>;
}

export interface IAttendanceDownloadResponse {
  url: string; // download link for PDF/Excel
  type: 'pdf' | 'excel';
}

export const getStudentAttendanceById = async (
  studentId: string
): Promise<any> => {
  try {
    const response = await BaseApi.getRequest(`/student/${studentId}/attendance-leaves`);
    return response;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return { success: false, message: 'Student attendance data not available', data: [] };
    }
    throw error;
  }
};

export const getAttendanceReport = async (schoolId: string): Promise<AxiosResponse<IAttendanceReport[]>> => {
  return await BaseApi.getRequest(`/school/attendance/report?schoolId=${schoolId}`);
};

export const downloadAttendanceReport = async (schoolId: string, type: 'pdf' | 'excel'): Promise<AxiosResponse<IAttendanceDownloadResponse>> => {
  return await BaseApi.getRequest(`/school/attendance/download?schoolId=${schoolId}&type=${type}`);
}; 