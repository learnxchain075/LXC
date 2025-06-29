import BaseApi from "../BaseApi";
import { IDutyForm } from "../types/admin/hrm/dutyService";
import { AxiosResponse } from "axios";

// 🔸 Get all duties for a school
export const getDuties = async (schoolId: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/${schoolId}/duties`);
};

// 🔸 Get a specific duty by ID
export const getDutyById = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/duties/${id}`);
};

// 🔸 Create a new duty
export const createDuty = async (
  schoolId: string,
  data: IDutyForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest(`/school/${schoolId}/duties`, data);
};

// 🔸 Update an existing duty
export const updateDuty = async (
  id: string,
  data: IDutyForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/duties/${id}`, data as any);
};

// 🔸 Delete a duty
export const deleteDuty = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/duties/${id}`);
};

// 🔸 Assign user to a duty
export const assignDutyToUser = async (
  dutyId: string,
  userId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest(`/duties/${dutyId}/assign/${userId}`);
};

// 🔸 Remove user from a duty
export const removeDutyFromUser = async (
  dutyId: string,
  userId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/duties/${dutyId}/remove/${userId}`);
};
