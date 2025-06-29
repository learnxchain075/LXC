import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IlibraryForm } from "../types/auth";

// ✅ Register Library Staff
export const registerLibrary = async (
  data: IlibraryForm
): Promise<AxiosResponse<any>> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "profilePicFile" && value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, value);
    }
  });

  const response = await BaseApi.postRequest(`/library`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

// ✅ Get All Library Staff
export const getAllLibrary = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/library`);
};

// ✅ Get Library Staff by ID
export const getLibraryById = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/library/${id}`);
};

// ✅ Update Library Staff
export const updateLibrary = async (
  id: string,
  data: IlibraryForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/library/${id}`, data as any);
};

// ✅ Delete Library Staff
export const deleteLibrary = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/library/${id}`);
};
