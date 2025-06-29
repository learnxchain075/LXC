import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { ITransportForm1 } from "../types/transport/transportService";


/**
 * ✅ Assign or Update Transport Details (PUT)
 * Assigns or replaces transport details for a student
 * @param studentId - ID of the student
 * @param data - Transport details
 * @returns AxiosResponse<ITransportForm>
 */
export const assignTransport = async (
  studentId: string,
  data: ITransportForm1
): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/transport/school/assign-transport/${studentId}`, {
    ...data,
  });
};

/**
 * ✅ Get Transport Details
 * Fetches transport info for a student
 * @param studentId - ID of the student
 * @returns AxiosResponse<ITransportForm>
 */
export const getTransportDetails = async (
  studentId: string
): Promise<AxiosResponse<ITransportForm1>> => {
  return await BaseApi.getRequest(`/transport/school/assign-transport/${studentId}`);
};

/**
 * ✅ Update Transport (PATCH)
 * Partially updates transport info for a student
 * @param studentId - ID of the student
 * @param data - Partial transport details
 * @returns AxiosResponse<ITransportForm>
 */
export const updateTransport = async (
  studentId: string,
  data: Partial<ITransportForm1>
): Promise<AxiosResponse<ITransportForm1>> => {
  return await BaseApi.patchRequest(`/transport/school/assign-transport/${studentId}`, {
    ...data,
  });
};

/**
 * ✅ Remove Transport Details
 * Deletes the transport assignment for a student
 * @param studentId - ID of the student
 * @returns AxiosResponse<ITransportForm>
 */
export const removeTransport = async (
  studentId: string
): Promise<AxiosResponse<ITransportForm1>> => {
  return await BaseApi.deleteRequest(`/transport/school/assign-transport/${studentId}`);
};
