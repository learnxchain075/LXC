import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IhostelForm } from "../types/auth";

// ✅ Register Hostel
export const registerHostel = async (data: IhostelForm): Promise<AxiosResponse<any>> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "profilePic" && value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, value.toString());
    }
  });

  const response = await BaseApi.postRequest(`/hostel`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

// ✅ Get All Hostels
export const getAllHostels = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/hostel`);
};

// ✅ Get Hostel by ID
export const getHostelById = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/hostel/${id}`);
};

// ✅ Update Hostel
export const updateHostel = async (
  id: string,
  data: IhostelForm
): Promise<AxiosResponse<any>> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "profilePic" && value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, value.toString());
    }
  });

  const response = await BaseApi.putRequest(`/hostel/${id}`, formData as any, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

// ✅ Delete Hostel
export const deleteHostel = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/hostel/${id}`);
};
