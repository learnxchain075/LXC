import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IPickupPointForm } from "../types/transport/busPickupTypes";


/**
 * ✅ Create Pickup Point
 * Sends a POST request to create a new pickup point
 * @param data - Pickup point details
 * @returns AxiosResponse<IPickupPointForm>
 */
export const createPickupPoint = async (
  data: IPickupPointForm
): Promise<AxiosResponse<IPickupPointForm>> => {
  return await BaseApi.postRequest(`/school/transport/school/bus-pickup`, {
    ...data,
  });
};

/**
 * ✅ Get All Pickup Points of a School
 * Fetches all pickup points for a specific school
 * @param schoolId - School ID
 * @returns AxiosResponse<IPickupPointForm[]>
 */
export const getPickupPointsBySchool = async (
  schoolId: string
): Promise<AxiosResponse<IPickupPointForm[]>> => {
  return await BaseApi.getRequest(`/school/transport/school/bus-pickup/school/${schoolId}`);
};

/**
 * ✅ Get Pickup Point By ID
 * Fetches a specific pickup point by ID
 * @param id - Pickup point ID
 * @returns AxiosResponse<IPickupPointForm>
 */
export const getPickupPoint = async (
  id: string
): Promise<AxiosResponse<IPickupPointForm>> => {
  return await BaseApi.getRequest(`/school/transport/school/bus-pickup/${id}`);
};

/**
 * ✅ Update Pickup Point
 * Updates details of a specific pickup point
 * @param id - Pickup point ID
 * @param data - Partial<IPickupPointForm>
 * @returns AxiosResponse<IPickupPointForm>
 */
export const updatePickupPoint = async (
  id: string,
  data: Partial<IPickupPointForm>
): Promise<AxiosResponse<IPickupPointForm>> => {
  return await BaseApi.putRequest(`/school/transport/school/bus-pickup/${id}`, {
    ...data as any,
  });
};

/**
 * ✅ Delete Pickup Point
 * Deletes a pickup point by ID
 * @param id - Pickup point ID
 * @returns AxiosResponse<IPickupPointForm>
 */
export const deletePickupPoint = async (
  id: string
): Promise<AxiosResponse<IPickupPointForm>> => {
  return await BaseApi.deleteRequest(`/school/transport/school/bus-pickup/${id}`);
};
