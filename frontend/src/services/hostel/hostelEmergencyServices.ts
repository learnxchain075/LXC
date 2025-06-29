import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IhostelEmergency } from "../types/hostel/hostelEmergencyService";


/**
 * ✅ Create Medical Emergency
 * @param data - Emergency details
 * @returns AxiosResponse<IhostelEmergency>
 */
export const createMedicalEmergency = async (
  data: IhostelEmergency
): Promise<AxiosResponse<IhostelEmergency>> => {
  return await BaseApi.postRequest(`/`, { ...data });
};

/**
 * ✅ Get All Medical Emergencies
 * @returns AxiosResponse<IhostelEmergency[]>
 */
export const getMedicalEmergencies = async (): Promise<AxiosResponse<IhostelEmergency[]>> => {
  return await BaseApi.getRequest(`/`);
};

/**
 * ✅ Get Medical Emergency by ID
 * @param id - Emergency ID
 * @returns AxiosResponse<IhostelEmergency>
 */
export const getMedicalEmergencyById = async (
  id: string
): Promise<AxiosResponse<IhostelEmergency>> => {
  return await BaseApi.getRequest(`/${id}`);
};

/**
 * ✅ Update Medical Emergency
 * @param id - Emergency ID
 * @param data - Partial<IhostelEmergency>
 * @returns AxiosResponse<IhostelEmergency>
 */
export const updateMedicalEmergency = async (
  id: string,
  data: Partial<IhostelEmergency>
): Promise<AxiosResponse<IhostelEmergency>> => {
  return await BaseApi.putRequest(`/${id}`, { ...data as any });
};

/**
 * ✅ Delete Medical Emergency
 * @param id - Emergency ID
 * @returns AxiosResponse<IhostelEmergency>
 */
export const deleteMedicalEmergency = async (
  id: string
): Promise<AxiosResponse<IhostelEmergency>> => {
  return await BaseApi.deleteRequest(`/${id}`);
};
