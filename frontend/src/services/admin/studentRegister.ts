import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IStudentForm } from "../types/auth";

// ✅ Register Student
export const registerStudent = async (data: FormData): Promise<AxiosResponse<any>> => {
  try {
    const response = await BaseApi.postRequest(`/student`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// ✅ Get All Students
export const getAllStudents = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/student`);
};

// ✅ Get Student By ID
export const getStudentById = async (studentId: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/student/${studentId}`);
};

// ✅ Update Student
export const updateStudent = async (
  studentId: string,
  data: IStudentForm
): Promise<AxiosResponse<any>> => {
  const formDataToSend = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (value instanceof File) {
      formDataToSend.append(key, value);
    } else if (value instanceof Date) {
      formDataToSend.append(key, value.toISOString().split('T')[0]);
    } else if (Array.isArray(value)) {
      if (value.length > 0) {
        formDataToSend.append(key, value.join(','));
      }
    } else {
      const stringValue = value.toString().trim();
      if (stringValue !== '') {
        formDataToSend.append(key, stringValue);
      }
    }
  });

  const response = await BaseApi.putRequest(`/student/${studentId}`, formDataToSend as unknown as Record<string, string | number | boolean | undefined>, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

// ✅ Delete Student
export const deleteStudent = async (studentId: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/student/${studentId}`);
};

// ✅ Get Students by School ID
export const getSchoolStudents = async (schoolId: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/${schoolId}/student`);
};
