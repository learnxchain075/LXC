import BaseApi from "../BaseApi";

import { AxiosResponse } from "axios";
import { IPyqForm } from "../types/admin/pyqService";

// Create a new PYQ
export const createPYQ = async (data: IPyqForm): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/school/pyqs", data);
};

// Get all PYQs
export const getAllPYQs = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest("/school/pyqs");
};

// Get PYQ by ID
export const getPYQById = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/pyqs/${id}`);
};

// Update PYQ
export const updatePYQ = async (id: string, data: IPyqForm): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/school/pyqs/${id}`, data as any);
};

// Delete PYQ
export const deletePYQ = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/school/pyqs/${id}`);
};
