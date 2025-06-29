import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IaccountantForm } from "../types/auth";

// ✅ Register Accountant
export const registerAccountant = async (
  data: IaccountantForm
): Promise<AxiosResponse<any>> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "profilePic" && value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, value.toString());
    }
  });

  const response = await BaseApi.postRequest(`/account`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

// ✅ Get All Accountants
export const getAllAccountants = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/account`);
};

// ✅ Get Accountant by ID
export const getAccountantById = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/account/${id}`);
};

// ✅ Update Accountant
export const updateAccountant = async (
  id: string,
  data: IaccountantForm
): Promise<AxiosResponse<any>> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "profilePic" && value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, value.toString());
    }
  });

  const response = await BaseApi.putRequest(`/account/${id}`, formData as any, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

// ✅ Delete Accountant
export const deleteAccountant = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/account/${id}`);
};
