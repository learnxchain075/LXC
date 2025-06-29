import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { Ioutpass } from "../types/hostel/outpassService";

/**
 * ✅ Create Outpass Request
 * @param data - Outpass request data
 * @returns AxiosResponse<Ioutpass>
 */
export const createOutpassRequest = async (
  data: Ioutpass
): Promise<AxiosResponse<Ioutpass>> => {
  return await BaseApi.postRequest("/", { ...data });
};

/**
 * ✅ Get All Outpass Requests
 * @returns AxiosResponse<Ioutpass[]>
 */
export const getOutpassRequests = async (): Promise<AxiosResponse<Ioutpass[]>> => {
  return await BaseApi.getRequest("/");
};

/**
 * ✅ Get Outpass Request by ID
 * @param id - Outpass ID
 * @returns AxiosResponse<Ioutpass>
 */
export const getOutpassRequestById = async (
  id: string
): Promise<AxiosResponse<Ioutpass>> => {
  return await BaseApi.getRequest(`/${id}`);
};

/**
 * ✅ Get Outpass Requests by Student ID
 * @param studentId - Student ID
 * @returns AxiosResponse<Ioutpass[]>
 */
export const getOutpassRequestsByStudentId = async (
  studentId: string
): Promise<AxiosResponse<Ioutpass[]>> => {
  return await BaseApi.getRequest(`/student/${studentId}`);
};

/**
 * ✅ Update Outpass Request
 * @param id - Outpass ID
 * @param data - Partial outpass data
 * @returns AxiosResponse<Ioutpass>
 */
export const updateOutpassRequest = async (
  id: string,
  data: Partial<Ioutpass>
): Promise<AxiosResponse<Ioutpass>> => {
  return await BaseApi.putRequest(`/${id}`, { ...data as any });
};

/**
 * ✅ Delete Outpass Request
 * @param id - Outpass ID
 * @returns AxiosResponse<Ioutpass>
 */
export const deleteOutpassRequest = async (
  id: string
): Promise<AxiosResponse<Ioutpass>> => {
  return await BaseApi.deleteRequest(`/${id}`);
};
