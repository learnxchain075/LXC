import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IRouteForm } from "../types/transport/busRouteService";


/**
 * ✅ Create Route
 * Sends a POST request to create a new route
 * @param data - Route data
 * @returns AxiosResponse<IRouteForm>
 */
export const createRoute = async (
  data: IRouteForm
): Promise<AxiosResponse<IRouteForm>> => {
  return await BaseApi.postRequest(`/school/transport/school/bus-route`, {
    ...data,
  });
};

/**
 * ✅ Get All Routes
 * Fetches all route records
 * @returns AxiosResponse<IRouteForm[]>
 */
export const getRoutes = async (): Promise<AxiosResponse<IRouteForm[]>> => {
  return await BaseApi.getRequest(`/school/transport/school/bus-routes`);
};


/**
 * ✅ Get Route by ID
 * Fetches a single route record by ID
 * @param id - Route ID
 * @returns AxiosResponse<IRouteForm>
 */
export const getRoute = async (
  id: string
): Promise<AxiosResponse<IRouteForm>> => {
  return await BaseApi.getRequest(`/school/transport/school/bus-route/${id}`);
};

/**
 * ✅ Get Routes by School ID
 * Fetches all routes for a specific school
 * @param schoolId - School ID
 * @returns AxiosResponse<IRouteForm[]>
 */
export const getRoutesBySchoolId = async (
  schoolId: string
): Promise<AxiosResponse<IRouteForm[]>> => {
  return await BaseApi.getRequest(`/school/transport/school/routes/${schoolId}`);
};

/**
 * ✅ Update Route
 * Updates a route's details
 * @param id - Route ID
 * @param data - Partial<IRouteForm>
 * @returns AxiosResponse<IRouteForm>
 */
export const updateRoute = async (
  id: string,
  data: Partial<IRouteForm>
): Promise<AxiosResponse<IRouteForm>> => {
  return await BaseApi.patchRequest(`/school/transport/school/bus-route/${id}`, {
    ...data,
  });
};

/**
 * ✅ Delete Route
 * Deletes a route record by ID
 * @param id - Route ID
 * @returns AxiosResponse<IRouteForm>
 */
export const deleteRoute = async (
  id: string
): Promise<AxiosResponse<IRouteForm>> => {
  return await BaseApi.deleteRequest(`/school/transport/school/bus-route/${id}`);
};
