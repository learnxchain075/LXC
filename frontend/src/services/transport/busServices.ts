import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { ICreateBus, IBus, IUpdateBus } from "../types/transport/busService";
import { IBaseResponse } from "../types/features";

/**
 * ✅ Create Bus
 * Sends a POST request to create a new bus
 * @param data - Bus details
 * @returns AxiosResponse<IBus>
 */
export const createBus = async (
  data: ICreateBus
): Promise<AxiosResponse<IBus>> => {
  return await BaseApi.postRequest(`/school/transport/school/bus`, {
    ...data,
  });
};

/**
 * ✅ Get All Buses
 * Fetches all bus records
 * @returns AxiosResponse<IBus[]>
 */
export const getBuses = async (): Promise<AxiosResponse<IBus[]>> => {
  return await BaseApi.getRequest(`/school/transport/school/buses`);
};

/**
 * ✅ Get Bus By ID
 * Fetches a specific bus by its ID
 * @param id - Bus ID
 * @returns AxiosResponse<IBus>
 */
export const getBus = async (
  id: string
): Promise<AxiosResponse<IBus>> => {
  return await BaseApi.getRequest(`/school/transport/school/bus/${id}`);
};

/**
 * ✅ Get Buses By School ID
 * Fetches all buses for a specific school
 * @param schoolId - School ID
 * @returns AxiosResponse<IBus[]>
 */
export const getBusbyID = async (
  schoolId: string
): Promise<AxiosResponse<IBus[]>> => {
  return await BaseApi.getRequest(`/school/transport/school/buses/school/${schoolId}`);
};

/**
 * ✅ Update Bus
 * Updates the details of a specific bus
 * @param id - Bus ID
 * @param data - IUpdateBus
 * @returns AxiosResponse<IBus>
 */
export const updateBus = async (
  id: string,
  data: Pick<IUpdateBus, 'busNumber' | 'capacity' | 'schoolId'>
): Promise<AxiosResponse<IBus>> => {
  return await BaseApi.patchRequest(`/school/transport/school/bus/${id}`, {
    ...data,
  });
};

/**
 * ✅ Delete Bus
 * Deletes a bus by its ID
 * @param id - Bus ID
 * @returns AxiosResponse<IBus>
 */
export const deleteBus = async (
  id: string
): Promise<AxiosResponse<IBus>> => {
  return await BaseApi.deleteRequest(`/school/transport/school/bus/${id}`);
};
