import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IcomplaintPost } from "../types/hostel/complaintService";

/**
 * ✅ Create Complaint
 * @param data - Complaint details
 * @returns AxiosResponse<IcomplaintPost>
 */
export const createComplaint = async (
  data: IcomplaintPost
): Promise<AxiosResponse<IcomplaintPost>> => {
  return await BaseApi.postRequest(`/`, { ...data });
};

/**
 * ✅ Get All Complaints
 * @returns AxiosResponse<IcomplaintPost[]>
 */
export const getComplaints = async (): Promise<AxiosResponse<IcomplaintPost[]>> => {
  return await BaseApi.getRequest(`/`);
};

/**
 * ✅ Get Complaint by ID
 * @param id - Complaint ID
 * @returns AxiosResponse<IcomplaintPost>
 */
export const getComplaintById = async (
  id: string
): Promise<AxiosResponse<IcomplaintPost>> => {
  return await BaseApi.getRequest(`/${id}`);
};

/**
 * ✅ Update Complaint
 * @param id - Complaint ID
 * @param data - Partial complaint data
 * @returns AxiosResponse<IcomplaintPost>
 */
export const updateComplaint = async (
  id: string,
  data: Partial<IcomplaintPost>
): Promise<AxiosResponse<IcomplaintPost>> => {
  return await BaseApi.putRequest(`/${id}`, { ...data });
};

/**
 * ✅ Delete Complaint by ID
 * @param id - Complaint ID
 * @returns AxiosResponse<IcomplaintPost>
 */
export const deleteComplaint = async (
  id: string
): Promise<AxiosResponse<IcomplaintPost>> => {
  return await BaseApi.deleteRequest(`/${id}`);
};

/**
 * ✅ Delete All Complaints
 * @returns AxiosResponse<any>
 */
export const deleteAllComplaints = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/`);
};
