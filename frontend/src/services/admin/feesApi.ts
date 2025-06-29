import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IFeesForm } from "../types/admin/feesService";

// Create a fee
export const createFee = async (
  data: IFeesForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/fees", data);
};

// Get all fees
export const getAllFees = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest("/fees");
};

// Get fee by ID
export const getFeeById = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/fees/${id}`);
};

// Update a fee
export const updateFee = async (
  id: string,
  data: IFeesForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/fees/${id}`, data as any);
};

// Delete a fee
export const deleteFee = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/fees/${id}`);
};

// Get overdue fees
export const getOverdueFees = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest("/fees/overdue");
};
