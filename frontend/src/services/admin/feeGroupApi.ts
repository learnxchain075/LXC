import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";

export const createFeeGroup = async (data: { name: string; description?: string; schoolId: string }): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/fee-group", data);
};

export const getFeeGroups = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest("/fee-group");
};

export const updateFeeGroup = async (id: string, data: { name?: string; description?: string }): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/fee-group/${id}`, data as any);
};

export const deleteFeeGroup = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/fee-group/${id}`);
};
