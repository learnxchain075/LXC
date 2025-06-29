import BaseApi from "../BaseApi";
import { AxiosResponse } from "axios";

export const promoteStudent = async (data: any): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/admin/promotions/promote", data);
};

export const bulkPromoteClass = async (data: any): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/admin/promotions/bulk", data);
};

export const selectivePromotion = async (
  data: any
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/admin/promotions/selective", data);
};

export const withdrawStudent = async (data: any): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/admin/promotions/withdraw", data);
};
