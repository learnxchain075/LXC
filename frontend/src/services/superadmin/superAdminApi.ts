import BaseApi from "../BaseApi";

import { AxiosResponse } from "axios";

// Helper function to convert data to FormData for file upload
const convertToFormData = (data: superAdminForm): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
};

// Create (Register) Super Admin with profilePic upload
export const registerSuperAdmin = async (data: superAdminForm): Promise<AxiosResponse<any>> => {
  const formData = convertToFormData(data);
  return await BaseApi.postRequest('/add', formData, ); // `true` to set multipart headers
};

// Get all super admins
export const getAllSuperAdmins = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest('/get-all');
};

// Get super admin by ID
export const getSuperAdminById = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/get/${id}`);
};

// Update super admin (without file upload for simplicity, update with FormData if needed)
export const updateSuperAdmin = async (id: string, data: Partial<superAdminForm>): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/update/${id}`, data);
};

// Delete super admin
export const deleteSuperAdmin = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/delete/${id}`);
};
