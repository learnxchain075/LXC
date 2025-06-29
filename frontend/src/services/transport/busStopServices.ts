import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IBusStop, ICreateBusStop } from "../types/transport/busStopService";

/**
 * ✅ Create Bus Stop
 * Sends a POST request to create a new bus stop
 * @param data - bus stop details (creation)
 * @returns AxiosResponse<IBusStop>
 */
export const createBusStop = async (
  data: ICreateBusStop
): Promise<AxiosResponse<IBusStop>> => {
  return await BaseApi.postRequest(`/school/transport/school/bus-stop`, {
    ...data,
  });
};

/**
 * ✅ Get All Bus Stops
 * Fetches all bus stops
 * @returns AxiosResponse<IBusStop[]>
 */
export const getBusStops = async (): Promise<AxiosResponse<IBusStop[]>> => {
  return await BaseApi.getRequest(`/school/transport/school/bus-stops`);
};

/**
 * ✅ Get All Bus Stops by School ID
 * Fetches all bus stops for a specific school
 * @param schoolId - School ID
 * @returns AxiosResponse<IBusStop[]>
 */
export const getBusStopsBySchoolId = async (
  schoolId: string
): Promise<AxiosResponse<IBusStop[]>> => {
  return await BaseApi.getRequest(`/school/transport/school/bus-pickup/school/${schoolId}`);
};

/**
 * ✅ Get Bus Stop By ID
 * Fetches a specific bus stop by ID
 * @param id - Bus stop ID
 * @returns AxiosResponse<IBusStop>
 */
export const getBusStop = async (
  id: string
): Promise<AxiosResponse<IBusStop>> => {
  return await BaseApi.getRequest(`/school/transport/school/bus-stop/${id}`);
};

/**
 * ✅ Update Bus Stop
 * Updates details of a specific bus stop
 * @param id - Bus stop ID
 * @param data - Partial<IBusStop>
 * @returns AxiosResponse<IBusStop>
 */
export const updateBusStop = async (
  id: string,
  data: Partial<IBusStop>
): Promise<AxiosResponse<IBusStop>> => {
  // Omit students, createdAt, and updatedAt from the payload
  const { students, createdAt, updatedAt, ...rest } = data;
  return await BaseApi.patchRequest(`/transport/school/bus-stop/${id}`, {
    ...rest,
  });
};

/**
 * ✅ Delete Bus Stop
 * Deletes a bus stop by ID
 * @param id - Bus stop ID
 * @returns AxiosResponse<IBusStop>
 */
export const deleteBusStop = async (
  id: string
): Promise<AxiosResponse<IBusStop>> => {
  return await BaseApi.deleteRequest(`/transport/school/bus-stop/${id}`);
};
