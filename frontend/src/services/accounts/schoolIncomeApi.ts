// import { AxiosResponse } from "axios";
// import BaseApi from "../BaseApi";
// import { ICreateSchoolIncome, ISchoolIncome, IUpdateSchoolIncome } from "../types/accounts/schoolIncomeServices";


// /**
//  * ✅ Create School Income
//  * Sends a POST request to create a new income record
//  * @param data - Income creation data
//  * @returns AxiosResponse<ISchoolIncome>
//  */
// export const createSchoolIncome = async (
//   data: ICreateSchoolIncome
// ): Promise<AxiosResponse<ISchoolIncome>> => {
//   return await BaseApi.postRequest(`/school/income`, {
//     ...data,
//   });
// };

// /**
//  * ✅ Get All Incomes for a School
//  * @param schoolId - School ID
//  * @returns AxiosResponse<ISchoolIncome[]>
//  */
// export const getSchoolIncomes = async (
//   schoolId: string
// ): Promise<AxiosResponse<ISchoolIncome[]>> => {
//   return await BaseApi.getRequest(`/school/income/${schoolId}`);
// };

// /**
//  * ✅ Update a School Income Record
//  * @param id - Income record ID
//  * @param data - Updated income info
//  * @returns AxiosResponse<ISchoolIncome>
//  */
// export const updateSchoolIncome = async (
//   id: string,
//   data: IUpdateSchoolIncome
// ): Promise<AxiosResponse<ISchoolIncome>> => {
//   return await BaseApi.putRequest(`/school/income/${id}`, {
//     ...data as any,
//   });
// };

// /**
//  * ❌ Delete a School Income Record
//  * @param id - Income record ID
//  * @returns AxiosResponse<void>
//  */
// export const deleteSchoolIncome = async (
//   id: string
// ): Promise<AxiosResponse<void>> => {
//   return await BaseApi.deleteRequest(`/school/income/${id}`);
// };

// // router.post('/school/income', createSchoolIncome);
// // router.get('/school/incomes', getAllSchoolIncome);
// // router.get('/school/income/:id', getSchoolIncomeById);
// // router.put('/school/income/:id', updateSchoolIncome);
// // router.delete('/school/income/:id', deleteSchoolIncome);
import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import {
  ICreateSchoolIncome,
  ISchoolIncome,
  IUpdateSchoolIncome,
} from "../types/accounts/schoolIncomeServices";

/**
 * ✅ Create School Income
 * Sends a POST request to create a new income record
 * @param data - Income creation data
 * @returns AxiosResponse<ISchoolIncome>
 */
export const createSchoolIncome = async (
  data: ICreateSchoolIncome
): Promise<AxiosResponse<ISchoolIncome>> => {
  return await BaseApi.postRequest(`/school/income`, {
    ...data,
  });
};

/**
 * ✅ Get All School Incomes
 * @returns AxiosResponse<ISchoolIncome[]>
 */
export const getAllSchoolIncomes = async (): Promise<
  AxiosResponse<ISchoolIncome[]>
> => {
  return await BaseApi.getRequest(`/school/incomes`);
};

/**
 * ✅ Get All Incomes for a Specific School (by ID)
 * @param schoolId - School ID
 * @returns AxiosResponse<ISchoolIncome[]>
 */
export const getSchoolIncomes = async (
  schoolId: string
): Promise<AxiosResponse<ISchoolIncome[]>> => {
  return await BaseApi.getRequest(`/admin/school/income/${schoolId}`);
};

/**
 * ✅ Get School Income by ID
 * @param id - Income record ID
 * @returns AxiosResponse<ISchoolIncome>
 */
export const getSchoolIncomeById = async (
  id: string
): Promise<AxiosResponse<ISchoolIncome>> => {
  return await BaseApi.getRequest(`/school/income/${id}`);
};

/**
 * ✅ Update a School Income Record
 * @param id - Income record ID
 * @param data - Updated income info
 * @returns AxiosResponse<ISchoolIncome>
 */
export const updateSchoolIncome = async (
  id: string,
  data: IUpdateSchoolIncome
): Promise<AxiosResponse<ISchoolIncome>> => {
  return await BaseApi.putRequest(`/school/income/${id}`, {
    ...data as any,
  });
};

/**
 * ✅ Delete a School Income Record
 * @param id - Income record ID
 * @returns AxiosResponse<void>
 */
export const deleteSchoolIncome = async (
  id: string
): Promise<AxiosResponse<void>> => {
  return await BaseApi.deleteRequest(`/school/income/${id}`);
};
