import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";


// ✅ Create Homework
export const createHomework = async (data: IHomeworkForm): Promise<AxiosResponse<any>> => {
  const formDataToSend = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (value instanceof File) {
      formDataToSend.append(key, value);
    } else if (value instanceof Date) {
      formDataToSend.append(key, value.toISOString());
    } else if (Array.isArray(value)) {
      formDataToSend.append(key, JSON.stringify(value));
    } else {
      formDataToSend.append(key, value.toString());
    }
  });

  const response = await BaseApi.postRequest(`/school/home-work`, formDataToSend, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

// ✅ Get All Homework
export const getAllHomework = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/home-work`);
};

// ✅ Get Homework by ID
export const getHomeworkById = async (homeworkId: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/home-work/${homeworkId}`);
};

// ✅ Update Homework
export const updateHomework = async (
  homeworkId: string,
  data: IHomeworkForm
): Promise<AxiosResponse<any>> => {
  const formDataToSend = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (value instanceof File) {
      formDataToSend.append(key, value);
    } else if (value instanceof Date) {
      formDataToSend.append(key, value.toISOString());
    } else if (Array.isArray(value)) {
      formDataToSend.append(key, JSON.stringify(value));
    } else {
      formDataToSend.append(key, value.toString());
    }
  });

  const response = await BaseApi.putRequest(`/school/home-work/${homeworkId}`, formDataToSend as any, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

// ✅ Delete Homework
export const deleteHomework = async (homeworkId: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/home-work/${homeworkId}`);
};

// ✅ Get Homework by Class ID
export const getHomeworkByClassId = async (classId: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/home-work/class/${classId}`);
};

// ✅ Submit Homework (Student Submission)
export const submitHomework = async (data: IHomeworkForm): Promise<AxiosResponse<any>> => {
  const formDataToSend = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (value instanceof File) {
      formDataToSend.append(key, value);
    } else if (value instanceof Date) {
      formDataToSend.append(key, value.toISOString());
    } else if (Array.isArray(value)) {
      formDataToSend.append(key, JSON.stringify(value));
    } else {
      formDataToSend.append(key, value.toString());
    }
  });

  const response = await BaseApi.postRequest(`/school/home-work/submit`, formDataToSend, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

// ✅ Get All Submissions by Student ID
export const getSubmittedHomeworkByStudent = async (
  studentId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/home-work/submissions/${studentId}`);
};
