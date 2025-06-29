import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IhostelFee } from "../types/hostel/hostelFeeService";

/**
 * ✅ Create Hostel Fee
 * @param data - Hostel fee details
 * @returns AxiosResponse<IhostelFee>
 */
export const createHostelFee = async (
  data: IhostelFee
): Promise<AxiosResponse<IhostelFee>> => {
  return await BaseApi.postRequest("/", { ...data });
};

/**
 * ✅ Get All Hostel Fees
 * @returns AxiosResponse<IhostelFee[]>
 */
export const getHostelFees = async (): Promise<AxiosResponse<IhostelFee[]>> => {
  return await BaseApi.getRequest("/");
};

/**
 * ✅ Get Hostel Fee by ID
 * @param id - Hostel fee ID
 * @returns AxiosResponse<IhostelFee>
 */
export const getHostelFeeById = async (
  id: string
): Promise<AxiosResponse<IhostelFee>> => {
  return await BaseApi.getRequest(`/${id}`);
};

/**
 * ✅ Update Hostel Fee
 * @param id - Hostel fee ID
 * @param data - Partial hostel fee data
 * @returns AxiosResponse<IhostelFee>
 */
export const updateHostelFee = async (
  id: string,
  data: Partial<IhostelFee>
): Promise<AxiosResponse<IhostelFee>> => {
  return await BaseApi.putRequest(`/${id}`, { ...data as any });
};

/**
 * ✅ Delete Hostel Fee
 * @param id - Hostel fee ID
 * @returns AxiosResponse<IhostelFee>
 */
export const deleteHostelFee = async (
  id: string
): Promise<AxiosResponse<IhostelFee>> => {
  return await BaseApi.deleteRequest(`/${id}`);
};
