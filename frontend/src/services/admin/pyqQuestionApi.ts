import BaseApi from "../BaseApi";
import { AxiosResponse } from "axios";
import { IPyqForm, IPyqResponse } from "../types/admin/pyqService";

// Create a new PYQ
export const createPYQ = async (formData: FormData): Promise<AxiosResponse<IPyqResponse>> => {
  return await BaseApi.postRequest("/school/pyqs", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Get all PYQs
export const getAllPYQs = async (): Promise<AxiosResponse<IPyqResponse[]>> => {
  return await BaseApi.getRequest("/school/pyqs");
};

// Get PYQ by ID
export const getPYQById = async (id: string): Promise<AxiosResponse<IPyqResponse>> => {
  return await BaseApi.getRequest(`/school/pyqs/${id}`);
};

// Update PYQ
export const updatePYQ = async (id: string, data: Partial<IPyqForm>): Promise<AxiosResponse<IPyqResponse>> => {
  return await BaseApi.putRequest(`/school/pyqs/${id}`, data);
};

// Delete PYQ
export const deletePYQ = async (id: string): Promise<AxiosResponse<void>> => {
  return await BaseApi.deleteRequest(`/school/pyqs/${id}`);
};
