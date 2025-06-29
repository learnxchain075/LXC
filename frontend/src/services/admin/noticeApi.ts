import AppConfig from "../../config/config";
import BaseApi from "../BaseApi";
import {
  CreateNoticeResponse,
  GetNoticesResponse,
  GetNoticeResponse,
  DeleteNoticeResponse,
  DeleteMultipleNoticesResponse,
} from "../types/admin/noticeService";

// Create a new notice (with file upload)
export const createNotice = async (noticeData: {
  title: string;
  message: string;
  noticeDate: string;
  publishDate: string;
  attachment: File | null;
  recipients: string[];
  createdById: string;
  schoolId: string;
}): Promise<CreateNoticeResponse> => {
  const formData = new FormData();
  formData.append("title", noticeData.title);
  formData.append("message", noticeData.message);
  formData.append("noticeDate", noticeData.noticeDate);
  formData.append("publishDate", noticeData.publishDate);
  if (noticeData.attachment) formData.append("attachment", noticeData.attachment);
  noticeData.recipients.forEach((r) => formData.append("recipients[]", r));
  formData.append("createdById", noticeData.createdById);
  formData.append("schoolId", noticeData.schoolId);
  try {
    const response = await BaseApi.postRequest("/school/notice", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to create notice" } as any;
  }
};

// Get all notices, optionally filtered by schoolId
export const getAllNotices = async (
  schoolId?: string
): Promise<GetNoticesResponse> => {
  let url;
  if (schoolId) {
    url = `/all/school/notice?schoolId=${schoolId}`;
  } else {
    url = `/all/school/notice`;
  }
  try {
    const response = await BaseApi.getRequest(url);
    return response.data;
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to fetch notices" } as any;
  }
};

// Get a single notice by ID
export const getNoticeById = async (id: string): Promise<GetNoticeResponse> => {
  try {
    const response = await BaseApi.getRequest(`/school/notice/${id}`);
    return response.data;
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to fetch notice" } as any;
  }
};

export const updateNoticeById = async (id: string, updateNotice: any): Promise<any> => {
  try {
    const response = await BaseApi.putRequest(`/school/notice/${id}`, updateNotice);
    return response.data;
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to update notice" } as any;
  }
};

// Delete a single notice
export const deleteNotice = async (
  id: string
): Promise<DeleteNoticeResponse> => {
  try {
    const response = await BaseApi.deleteRequest(`/school/notice/${id}`);
    return response.data;
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to delete notice" } as any;
  }
};

// Delete multiple notices (fix payload to { ids: [...] })
export const deleteMultipleNotices = async (
  ids: string[]
): Promise<DeleteMultipleNoticesResponse> => {
  try {
    const response = await BaseApi.deleteRequest('/school/notice/multiple', {
      data: { ids },
    });
    return response.data;
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to delete notices" } as any;
  }
};
