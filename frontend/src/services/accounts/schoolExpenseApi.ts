// import { AxiosResponse } from "axios";
// import BaseApi from "../BaseApi";
// import { ICreateSchoolExpense, ISchoolExpense, IUpdateSchoolExpense } from "../types/accounts/schoolExpenseService";


// /**
//  * ✅ Create School Expense
//  * Sends a POST request to create a new school expense
//  * @param data - Expense creation info
//  * @returns AxiosResponse<ISchoolExpense>
//  */
// export const createSchoolExpense = async (
//   data: ICreateSchoolExpense
// ): Promise<AxiosResponse<ISchoolExpense>> => {
//   return await BaseApi.postRequest(`/school/expense`, {
//     ...data,
//   });
// };

// /**
//  * ✅ Get All Expenses for a School
//  * @param schoolId - School ID
//  * @returns AxiosResponse<ISchoolExpense[]>
//  */
// export const getSchoolExpenses = async (
//   schoolId: string
// ): Promise<AxiosResponse<ISchoolExpense[]>> => {
//   return await BaseApi.getRequest(`/school/expense/${schoolId}`);
// };

// /**
//  * ✅ Update a School Expense
//  * @param id - Expense ID
//  * @param data - Updated expense info
//  * @returns AxiosResponse<ISchoolExpense>
//  */
// export const updateSchoolExpense = async (
//   id: string,
//   data: IUpdateSchoolExpense
// ): Promise<AxiosResponse<ISchoolExpense>> => {
//   return await BaseApi.putRequest(`/school/expense/${id}`, {
//     ...data as any,
//   });
// };

// /**
//  * ❌ Delete a School Expense
//  * @param id - Expense ID
//  * @returns AxiosResponse<void>
//  */
// export const deleteSchoolExpense = async (
//   id: string
// ): Promise<AxiosResponse<void>> => {
//   return await BaseApi.deleteRequest(`/school/expense/${id}`);
// };


import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import {
  ICreateSchoolExpense,
  ISchoolExpense,
  IUpdateSchoolExpense,
} from "../types/accounts/schoolExpenseService";

/**
 * ✅ Create School Expense
 * Sends a POST request to create a new school expense
 * @param data - Expense creation info
 * @returns AxiosResponse<ISchoolExpense>
 */
export const createSchoolExpense = async (
  data: ICreateSchoolExpense
): Promise<AxiosResponse<ISchoolExpense>> => {
  return await BaseApi.postRequest(`/school/expense`, {
    ...data,
  });
};

/**
 * ✅ Get All Expenses for a School
 * @param schoolId - School ID
 * @returns AxiosResponse<ISchoolExpense[]>
 */
export const getSchoolExpenses = async (
  schoolId: string
): Promise<AxiosResponse<ISchoolExpense[]>> => {
  return await BaseApi.getRequest(`/school/expense/${schoolId}`);
};

/**
 * ✅ Update a School Expense
 * @param id - Expense ID
 * @param data - Updated expense info
 * @returns AxiosResponse<ISchoolExpense>
 */
export const updateSchoolExpense = async (
  id: string,
  data: IUpdateSchoolExpense
): Promise<AxiosResponse<ISchoolExpense>> => {
  return await BaseApi.putRequest(`/school/expense/${id}`, {
    ...data  as any,
  });
};

/**
 * ✅ Delete a School Expense
 * @param id - Expense ID
 * @returns AxiosResponse<void>
 */
export const deleteSchoolExpense = async (
  id: string
): Promise<AxiosResponse<void>> => {
  return await BaseApi.deleteRequest(`/school/expense/${id}`);
};
