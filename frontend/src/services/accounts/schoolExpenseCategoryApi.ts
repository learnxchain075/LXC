// import { AxiosResponse } from "axios";
// import BaseApi from "../BaseApi";
// import { ICreateSchoolExpenseCategory, ISchoolExpenseCategory, IUpdateSchoolExpenseCategory } from "../types/accounts/schoolExpenseCategoryService";

import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { ICreateSchoolExpenseCategory, ISchoolExpenseCategory, IUpdateSchoolExpenseCategory } from "../types/accounts/schoolExpenseCategoryService";


// /**
//  * ✅ Create School Expense Category
//  * Sends a POST request to create a new expense category
//  * @param data - Expense category creation info
//  * @returns AxiosResponse<ISchoolExpenseCategory>
//  */
// export const createExpenseCategory = async (
//   data: ICreateSchoolExpenseCategory
// ): Promise<AxiosResponse<ISchoolExpenseCategory>> => {
//   return await BaseApi.postRequest(`/school/expense-category`, {
//     ...data,
//   });
// };

// /**
//  * ✅ Get All Expense Categories for a School
//  * @param schoolId - School ID
//  * @returns AxiosResponse<ISchoolExpenseCategory[]>
//  */
// export const getExpenseCategories = async (
//   schoolId: string
// ): Promise<AxiosResponse<ISchoolExpenseCategory[]>> => {
//   return await BaseApi.getRequest(`/school/expense-category/${schoolId}`);
// };

// /**
//  * ✅ Update an Expense Category
//  * @param id - Expense category ID
//  * @param data - Updated category info
//  * @returns AxiosResponse<ISchoolExpenseCategory>
//  */
// export const updateExpenseCategory = async (
//   id: string,
//   data: IUpdateSchoolExpenseCategory
// ): Promise<AxiosResponse<ISchoolExpenseCategory>> => {
//   return await BaseApi.putRequest(`/school/expense-category/${id}`, {
//     ...data,
//   });
// };

// /**
//  * ❌ Delete an Expense Category
//  * @param id - Expense category ID
//  * @returns AxiosResponse<void>
//  */
// export const deleteExpenseCategory = async (
//   id: string
// ): Promise<AxiosResponse<void>> => {
//   return await BaseApi.deleteRequest(`/school/expense-category/${id}`);
// };

export const createSchoolExpenseCategory = async (
  data: ICreateSchoolExpenseCategory
): Promise<AxiosResponse<ISchoolExpenseCategory>> => {
  return await BaseApi.postRequest(`/school/expense-category`, {
    ...data,
  });
};

/**
 * ✅ Get All Expense Categories for a School
 * @param schoolId - School ID
 * @returns AxiosResponse<ISchoolExpenseCategory[]>
 */
export const getSchoolExpenseCategories = async (
  schoolId: string
): Promise<AxiosResponse<ISchoolExpenseCategory[]>> => {
  return await BaseApi.getRequest(`/school/expense-category/${schoolId}`);
};

/**
 * ✅ Update a School Expense Category
 * @param id - Expense category ID
 * @param data - Updated category data
 * @returns AxiosResponse<ISchoolExpenseCategory>
 */
export const updateSchoolExpenseCategory = async (
  id: string,
  data: IUpdateSchoolExpenseCategory
): Promise<AxiosResponse<ISchoolExpenseCategory>> => {
  return await BaseApi.putRequest(`/school/expense-category/${id}`, {
    ...data,
  });
};

/**
 * ✅ Delete a School Expense Category
 * @param id - Expense category ID
 * @returns AxiosResponse<void>
 */
export const deleteSchoolExpenseCategory = async (
  id: string
): Promise<AxiosResponse<void>> => {
  return await BaseApi.deleteRequest(`/school/expense-category/${id}`);
};