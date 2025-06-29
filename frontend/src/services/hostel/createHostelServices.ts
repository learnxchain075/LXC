import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IcreateHostel } from "../types/hostel/createHostelServices";


/**
 * ✅ Create Hostel
 * @param data - Hostel data
 * @returns AxiosResponse<IcreateHostel>
 */
export const createHostel = async (
  data: IcreateHostel
): Promise<AxiosResponse<IcreateHostel>> => {
  return await BaseApi.postRequest("/", data);
};

/**
 * ✅ Get All Hostels (with optional pagination & filters)
 * @param queryParams - Optional query string for filtering and pagination
 * @returns AxiosResponse<IcreateHostel[]>
 */
export const getHostels = async (
  queryParams = ""
): Promise<AxiosResponse<IcreateHostel[]>> => {
  return await BaseApi.getRequest(`/${queryParams}`);
};

/**
 * ✅ Get Hostel by ID
 * @param id - Hostel ID
 * @returns AxiosResponse<IcreateHostel>
 */
export const getHostelById = async (
  id: string
): Promise<AxiosResponse<IcreateHostel>> => {
  return await BaseApi.getRequest(`/${id}`);
};

/**
 * ✅ Update Hostel
 * @param id - Hostel ID
 * @param data - Partial hostel data
 * @returns AxiosResponse<IcreateHostel>
 */
export const updateHostel = async (
  id: string,
  data: Partial<IcreateHostel>
): Promise<AxiosResponse<IcreateHostel>> => {
  return await BaseApi.putRequest(`/${id}`, data);
};

/**
 * ✅ Delete Hostel
 * @param id - Hostel ID
 * @returns AxiosResponse<IcreateHostel>
 */
export const deleteHostel = async (
  id: string
): Promise<AxiosResponse<IcreateHostel>> => {
  return await BaseApi.deleteRequest(`/${id}`);
};

/**
 * ✅ Get Hostels by School ID
 * @param schoolId - School ID
 * @returns AxiosResponse<IcreateHostel[]>
 */
export const getHostelsBySchoolId = async (
  schoolId: string
): Promise<AxiosResponse<IcreateHostel[]>> => {
  return await BaseApi.getRequest(`/school/${schoolId}`);
};

/**
 * ✅ Search Hostels by name
 * @param name - Hostel name query
 * @returns AxiosResponse<IcreateHostel[]>
 */
export const searchHostels = async (
  name: string
): Promise<AxiosResponse<IcreateHostel[]>> => {
  return await BaseApi.getRequest(`/search?name=${name}`);
};
