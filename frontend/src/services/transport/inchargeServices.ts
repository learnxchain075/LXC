import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IInchargeForm } from "../types/transport/inchargeService";

/**
 * ✅ Create Incharge
 * Sends a POST request to add a new incharge
 * @param data - Incharge data
 * @returns AxiosResponse<IInchargeForm>
 */
export const createIncharge = async (
  data: IInchargeForm
): Promise<AxiosResponse<IInchargeForm>> => {
  return await BaseApi.postRequest(`/transport/school/incharge`, {
    ...data,
  });
};

/**
 * ✅ Get All Incharges
 * Fetches all incharges
 * @returns AxiosResponse<IInchargeForm[]>
 */
export const getIncharges = async (): Promise<AxiosResponse<IInchargeForm[]>> => {
  return await BaseApi.getRequest(`/transport/school/incharges`);
};

/**
 * ✅ Get Incharge By ID
 * Fetches a specific incharge by ID
 * @param id - Incharge ID
 * @returns AxiosResponse<IInchargeForm>
 */
export const getIncharge = async (
  id: string
): Promise<AxiosResponse<IInchargeForm>> => {
  return await BaseApi.getRequest(`/transport/school/incharge/${id}`);
};

/**
 * ✅ Update Incharge
 * Updates incharge details
 * @param id - Incharge ID
 * @param data - Partial<IInchargeForm>
 * @returns AxiosResponse<IInchargeForm>
 */
export const updateIncharge = async (
  id: string,
  data: Partial<IInchargeForm>
): Promise<AxiosResponse<IInchargeForm>> => {
  return await BaseApi.patchRequest(`/transport/school/incharge/${id}`, {
    ...data,
  });
};

/**
 * ✅ Delete Incharge
 * Deletes an incharge by ID
 * @param id - Incharge ID
 * @returns AxiosResponse<IInchargeForm>
 */
export const deleteIncharge = async (
  id: string
): Promise<AxiosResponse<IInchargeForm>> => {
  return await BaseApi.deleteRequest(`/transport/school/incharge/${id}`);
};
