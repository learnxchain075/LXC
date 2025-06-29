import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { Iexpense } from "../types/hostel/hostelExpenseService";

/**
 * ✅ Create Hostel Expense
 * @param data - Expense details
 * @returns AxiosResponse<Iexpense>
 */
export const createHostelExpense = async (
  data: Iexpense
): Promise<AxiosResponse<Iexpense>> => {
  return await BaseApi.postRequest("/", { ...data });
};

/**
 * ✅ Get All Hostel Expenses
 * @returns AxiosResponse<Iexpense[]>
 */
export const getHostelExpenses = async (): Promise<AxiosResponse<Iexpense[]>> => {
  return await BaseApi.getRequest("/");
};

/**
 * ✅ Get Hostel Expense by ID
 * @param id - Expense ID
 * @returns AxiosResponse<Iexpense>
 */
export const getHostelExpenseById = async (
  id: string
): Promise<AxiosResponse<Iexpense>> => {
  return await BaseApi.getRequest(`/${id}`);
};

/**
 * ✅ Update Hostel Expense
 * @param id - Expense ID
 * @param data - Partial expense data
 * @returns AxiosResponse<Iexpense>
 */
export const updateHostelExpense = async (
  id: string,
  data: Partial<Iexpense>
): Promise<AxiosResponse<Iexpense>> => {
  return await BaseApi.putRequest(`/${id}`, { ...data as any });
};

/**
 * ✅ Delete Hostel Expense
 * @param id - Expense ID
 * @returns AxiosResponse<Iexpense>
 */
export const deleteHostelExpense = async (
  id: string
): Promise<AxiosResponse<Iexpense>> => {
  return await BaseApi.deleteRequest(`/${id}`);
};
