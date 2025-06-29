import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IaccomdanceRequest } from "../types/hostel/accomdanceRequestService";


/**
 * ✅ Create Accommodation Request
 * Sends a POST request to create a new accommodation request
 * @param data - Accommodation request data
 * @returns AxiosResponse<IaccomdanceRequest>
 */
export const createAccommodationRequest = async (
  data: IaccomdanceRequest
): Promise<AxiosResponse<IaccomdanceRequest>> => {
  return await BaseApi.postRequest(`/`, {
    ...data,
  });
};

/**
 * ✅ Get All Accommodation Requests
 * @returns AxiosResponse<IaccomdanceRequest[]>
 */
export const getAccommodationRequests = async (): Promise<AxiosResponse<IaccomdanceRequest[]>> => {
  return await BaseApi.getRequest(`/`);
};

/**
 * ✅ Get Accommodation Request By ID
 * @param id - Request ID
 * @returns AxiosResponse<IaccomdanceRequest>
 */
export const getAccommodationRequestById = async (
  id: string
): Promise<AxiosResponse<IaccomdanceRequest>> => {
  return await BaseApi.getRequest(`/${id}`);
};

/**
 * ✅ Update Accommodation Request
 * @param id - Request ID
 * @param data - Partial<IaccomdanceRequest>
 * @returns AxiosResponse<IaccomdanceRequest>
 */
export const updateAccommodationRequest = async (
  id: string,
  data: Partial<IaccomdanceRequest>
): Promise<AxiosResponse<IaccomdanceRequest>> => {
  return await BaseApi.putRequest(`/${id}`, {
    ...data,
  });
};

/**
 * ✅ Delete Accommodation Request
 * @param id - Request ID
 * @returns AxiosResponse<IaccomdanceRequest>
 */
export const deleteAccommodationRequest = async (
  id: string
): Promise<AxiosResponse<IaccomdanceRequest>> => {
  return await BaseApi.deleteRequest(`/${id}`);
};
