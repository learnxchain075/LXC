import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IDoubtForm } from "../types/admin/doubtService";

// Create a new doubt
export const createDoubt = async (
  data: IDoubtForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/doubt", data);
};

// Get all doubts
export const getAllDoubts = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest("/doubts");
};

// Get a doubt by ID
export const getDoubtById = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/doubt/${id}`);
};

// Update a doubt
export const updateDoubt = async (
  id: string,
  data: IDoubtForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/doubt/${id}`, data  as any);
};

// Delete a doubt
export const deleteDoubt = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/doubt/${id}`);
};
