import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { ICreatePlans } from "../types/plans";

// ✅ Create Plan
export const createPlan = async (
  data: Omit<ICreatePlans, "id" | "createdAt" | "updatedAt">
): Promise<AxiosResponse<ICreatePlans>> => {
  return await BaseApi.postRequest(`/plan/create`, {
    name: data.name,
price: data.price,
durationDays: data.durationDays,
  });
};

// ✅ Get All Plans
export const getAllPlans = async (): Promise<AxiosResponse<ICreatePlans[]>> => {
  return await BaseApi.getRequest(`/super/plans`);
};

// ✅ Get Plan By Id
export const getPlanById = async (
  planId: string
): Promise<AxiosResponse<ICreatePlans>> => {
  return await BaseApi.getRequest(`/plan/${planId}`);
};

// ✅ Update Plan
export const updatePlan = async (
  planId: string,
  data: Partial<Omit<ICreatePlans, "id" | "createdAt" | "updatedAt">>
): Promise<AxiosResponse<ICreatePlans>> => {
  return await BaseApi.putRequest(`/plan/${planId}`, {
name: data.name,
price: data.price,
durationDays: data.durationDays,
  });
};

// ✅ Delete Plan
export const deletePlan = async (
  planId: string
): Promise<AxiosResponse<ICreatePlans>> => {
  return await BaseApi.deleteRequest(`/plan/${planId}`);
};
