import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IDriverForm } from "../types/transport/driverService";

/**
 * ✅ Create Driver
 * Sends a POST request to add a new driver
 * @param data - Driver data
 * @returns AxiosResponse<IDriverForm>
 */
export const createDriver = async (
  data: IDriverForm
): Promise<AxiosResponse<IDriverForm>> => {
  return await BaseApi.postRequest(`/school/transport/school/driver`, {
    ...data,
  });
};

/**
 * ✅ Get All Drivers
 * Fetches all drivers
 * @returns AxiosResponse<IDriverForm[]>
 */
export const getDrivers = async (): Promise<AxiosResponse<IDriverForm[]>> => {
  return await BaseApi.getRequest(`/school/transport/school/drivers`);
};

/**
 * ✅ Get Driver By ID
 * Fetches a driver by their ID
 * @param id - Driver ID
 * @returns AxiosResponse<IDriverForm>
 */
export const getDriver = async (
  id: string
): Promise<AxiosResponse<IDriverForm>> => {
  return await BaseApi.getRequest(`/school/transport/school/driver/${id}`);
};

/**
 * ✅ Get Drivers By School ID
 * Fetches all drivers for a specific school
 * @param id - School ID
 * @returns AxiosResponse<any>
 */
export const getDriverbyid = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/transport/school/drivers/school/${id}`);
};

/**
 * ✅ Assign Driver to Bus
 * Sends a PATCH request to assign a driver to a bus
 * @param data - Driver assignment data
 * @returns AxiosResponse<IDriverForm>
 */
export const assignDriverToBus = async (
  data: { driverId: string; busId: string }
): Promise<AxiosResponse<IDriverForm>> => {
  return await BaseApi.patchRequest(`/school/transport/school/driver/assign`, {
    ...data,
  });
};

/**
 * ✅ Update Driver
 * Updates driver details
 * @param id - Driver ID
 * @param data - Partial<IDriverForm>
 * @returns AxiosResponse<IDriverForm>
 */
export const updateDriver = async (
  id: string,
  data: Partial<IDriverForm>
): Promise<AxiosResponse<IDriverForm>> => {
  return await BaseApi.patchRequest(`/school/transport/school/driver/${id}`, {
    ...data,
  });
};

/**
 * ✅ Delete Driver
 * Deletes a driver by ID
 * @param id - Driver ID
 * @returns AxiosResponse<IDriverForm>
 */
export const deleteDriver = async (
  id: string
): Promise<AxiosResponse<IDriverForm>> => {
  return await BaseApi.deleteRequest(`/school/transport/school/driver/${id}`);
};
