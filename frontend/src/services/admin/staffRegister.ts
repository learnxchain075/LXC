import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IStaffBase } from "../types/admin/staffServices";

// Register Staff
export const registerStaff = async (
  data: IStaffBase
): Promise<AxiosResponse<any>> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "profilePic" && value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, value?.toString() || "");
    }
  });
  return await BaseApi.postRequest("/school/staff-register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get All Staff (all schools)
export const getAllStaff = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest("/allschool/staff");
};

// Get Staff by ID
export const getStaffById = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/staff/${id}`);
};

// Update Staff
export const updateStaff = async (
  id: string,
  data: IStaffBase
): Promise<AxiosResponse<any>> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "profilePic" && value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, value?.toString() || "");
    }
  });
  return await BaseApi.putRequest(`/school/staff/${id}`, formData as any, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete Staff
export const deleteStaff = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/school/staff/${id}`);
};

// Get Staff by School ID
export const getStaffBySchool = async (
  schoolId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/staff/school/${schoolId}`);
};
