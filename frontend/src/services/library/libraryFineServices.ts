import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IFineManagmentForm } from "../types/library/finemanagmentService";


/**
 * ✅ Create Fine
 * Sends a POST request to create a new fine for a book issue
 * @param data - Fine data (bookIssueId, amount, reason, paid, status)
 * @returns AxiosResponse<IFineManagmentForm>
 */
export const createFine = async (
  data: IFineManagmentForm
): Promise<AxiosResponse<IFineManagmentForm>> => {
  return await BaseApi.postRequest(`/fine`, {
    ...data,
  });
};

/**
 * ✅ Get All Fines
 * Fetches all fines from the system
 * @returns AxiosResponse<IFineManagmentForm[]>
 */
export const getAllFines = async (): Promise<
  AxiosResponse<IFineManagmentForm[]>
> => {
  return await BaseApi.getRequest(`/fine`);
};

/**
 * ✅ Get Fine By ID
 * Fetches a single fine using its ID
 * @param fineId - ID of the fine
 * @returns AxiosResponse<IFineManagmentForm>
 */
export const getFineById = async (
  fineId: string
): Promise<AxiosResponse<IFineManagmentForm>> => {
  return await BaseApi.getRequest(`/${fineId}`);
};

/**
 * ✅ Update Fine
 * Updates details of a fine (amount, reason, paid status, etc.)
 * @param fineId - ID of the fine
 * @param data - Partial data to update the fine
 * @returns AxiosResponse<IFineManagmentForm>
 */
export const updateFine = async (
  fineId: string,
  data: Partial<IFineManagmentForm>
): Promise<AxiosResponse<IFineManagmentForm>> => {
  return await BaseApi.putRequest(`/${fineId}`, {
    ...data,
  });
};

/**
 * ✅ Delete Fine
 * Removes a fine from the system
 * @param fineId - ID of the fine
 * @returns AxiosResponse<IFineManagmentForm>
 */
export const deleteFine = async (
  fineId: string
): Promise<AxiosResponse<IFineManagmentForm>> => {
  return await BaseApi.deleteRequest(`/${fineId}`);
};

/**
 * ✅ Pay Fine
 * Marks a fine as paid
 * @param fineId - ID of the fine to mark as paid
 * @returns AxiosResponse<any> - You can define a custom payment response structure if needed
 */
export const payFine = async (
  fineId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest(`/${fineId}/pay`, {
    paid: "yes",
    status: true,
  });
};
