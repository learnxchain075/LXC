import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { Ifee } from "../types/accounts/feeService";
// import { ifee } from "../types/accounts/feeService";

/**
 * ✅ Create Fee
 * Sends a POST request to create a new fee record
 * @param data - Fee information for a student
 * @returns AxiosResponse<ifee>
 */
export const createFee = async (
  data: Ifee
): Promise<AxiosResponse<Ifee>> => {
  return await BaseApi.postRequest(`/student/create-fee`, {
    ...data,
  });
};

/**
 * ✅ Update Fee
 * Updates an existing fee record
 * @param id - Fee record ID
 * @param data - Partial fee data to be updated
 * @returns AxiosResponse<ifee>
 */
export const updateFee = async (
  id: string,
  data: Partial<Ifee>
): Promise<AxiosResponse<Ifee>> => {
  return await BaseApi.putRequest(`/student/create/${id}`, {
    ...data as any,
  });
};

/**
 * ✅ Get All Fees
 * Fetches all fee records
 * @returns AxiosResponse<ifee[]>
 */
export const getAllFees = async (): Promise<AxiosResponse<Ifee[]>> => {
  return await BaseApi.getRequest(`/student/fee`);
};

/**
 * ✅ Get Fee By ID
 * Fetches a single fee record by ID
 * @param id - Fee record ID
 * @returns AxiosResponse<ifee>
 */
export const getFeebyid = async (
  id: string
): Promise<AxiosResponse<Ifee>> => {
  return await BaseApi.getRequest(`/student/create/${id}`);
};

/**
 * ✅ Get Fees By Student
 * Fetches all fee records for a specific student
 * @param studentId - Student ID
 * @returns AxiosResponse<ifee[]>
 */
export const getFeesByStudent = async (
  studentId: string
): Promise<AxiosResponse<Ifee[]>> => {
  return await BaseApi.getRequest(`/school/student/${studentId}`);
};

/**
 * ✅ Get Fees By School
 * Fetches all fee records related to the school
 * @returns AxiosResponse<ifee[]>
 */
export const getFeesBySchool = async (): Promise<AxiosResponse<Ifee[]>> => {
  return await BaseApi.getRequest(`/schools/fees/get-all`);
};

/**
 * ✅ Delete Fee
 * Deletes a fee record by its ID
 * @param id - Fee record ID
 * @returns AxiosResponse<ifee>
 */
export const deleteFee = async (
  id: string
): Promise<AxiosResponse<Ifee>> => {
  return await BaseApi.deleteRequest(`/student/create/${id}`);
};
