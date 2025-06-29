import BaseApi from "../BaseApi";
import { IDesignationForm } from "../types/admin/hrm/designationService";
import { AxiosResponse } from "axios";

// 🔸 Get all designations for a school
export const getDesignations = async (schoolId: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/${schoolId}/designations`);
};

// 🔸 Get a specific designation by ID
export const getDesignationById = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/designation/${id}`);
};

// 🔸 Create a new designation
export const createDesignation = async (
  schoolId: string,
  data: IDesignationForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest(`/${schoolId}/designation`, data);
};

// 🔸 Update an existing designation
export const updateDesignation = async (
  id: string,
  data: IDesignationForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/designation/${id}`, data as any);
};

// 🔸 Delete a designation
export const deleteDesignation = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/designation/${id}`);
};

// 🔸 Assign a user to a designation
export const assignUserToDesignation = async (
  userId: string,
  designationId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest(`/user/${userId}/assign-designation`, { designationId });
};

// 🔸 Remove a user from a designation
export const removeUserFromDesignation = async (
  userId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/user/${userId}/remove-designation`);
};
