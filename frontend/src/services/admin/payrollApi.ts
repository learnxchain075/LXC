import BaseApi from "../BaseApi";
import { IPayrollForm } from "../types/admin/hrm/payrollService";
import { AxiosResponse } from "axios";

// 🔸 Get all payrolls for a school
export const getPayrollsBySchool = async (
  schoolId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/payroll/${schoolId}`);
};

// 🔸 Get payroll by ID
export const getPayrollById = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/payroll/single/${id}`);
};

// 🔸 Create a new payroll entry
export const createPayroll = async (
  schoolId: string,
  data: IPayrollForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest(`/payroll/${schoolId}`, data);
};

// 🔸 Update a payroll entry
export const updatePayroll = async (
  id: string,
  data: IPayrollForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/payroll/${id}`, data as any);
};

// 🔸 Delete a payroll entry
export const deletePayroll = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/payroll/${id}`);
};

// // 🔸 Get all payrolls for a user (not used in backend)
// export const getPayrollsByUserId = async (
//   userId: string
// ): Promise<AxiosResponse<any>> => {
//   return await BaseApi.getRequest(`/payrolls/user/${userId}`);
// };
