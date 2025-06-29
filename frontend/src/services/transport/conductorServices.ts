import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { ICondactorForm } from "../types/transport/conductorService";

/**
 * ✅ Create Conductor
 * Sends a POST request to add a new conductor
 * @param data - Conductor data
 * @returns AxiosResponse<ICondactorForm>
 */
export const createConductor = async (
  data: ICondactorForm
): Promise<AxiosResponse<ICondactorForm>> => {
  return await BaseApi.postRequest(`/transport/school/conductor`, {
    ...data,
  });
};

/**
 * ✅ Get All Conductors
 * Fetches all conductors
 * @returns AxiosResponse<ICondactorForm[]>
 */
export const getConductors = async (): Promise<AxiosResponse<ICondactorForm[]>> => {
  return await BaseApi.getRequest(`/transport/school/conductor`);
};

/**
 * ✅ Get Conductor By ID
 * Fetches a conductor by ID
 * @param id - Conductor ID
 * @returns AxiosResponse<ICondactorForm>
 */
export const getConductor = async (
  id: string
): Promise<AxiosResponse<ICondactorForm>> => {
  return await BaseApi.getRequest(`/transport/school/conductor/${id}`);
};

/**
 * ✅ Assign Conductor to Bus
 * Sends a PATCH request to assign a conductor to a specific bus
 * @param data - Conductor assignment info
 * @returns AxiosResponse<ICondactorForm>
 */
export const assignConductorToBus = async (
  data: { conductorId: string; busId: string }
): Promise<AxiosResponse<ICondactorForm>> => {
  return await BaseApi.patchRequest(`/transport/school/conductor/assign`, {
    ...data,
  });
};

/**
 * ✅ Update Conductor
 * Updates conductor details
 * @param id - Conductor ID
 * @param data - Partial<ICondactorForm>
 * @returns AxiosResponse<ICondactorForm>
 */
export const updateConductor = async (
  id: string,
  data: Partial<ICondactorForm>
): Promise<AxiosResponse<ICondactorForm>> => {
  return await BaseApi.patchRequest(`/transport/school/conductor/${id}`, {
    ...data,
  });
};

/**
 * ✅ Delete Conductor
 * Deletes a conductor by ID
 * @param id - Conductor ID
 * @returns AxiosResponse<ICondactorForm>
 */
export const deleteConductor = async (
  id: string
): Promise<AxiosResponse<ICondactorForm>> => {
  return await BaseApi.deleteRequest(`/transport/school/conductor/${id}`);
};
