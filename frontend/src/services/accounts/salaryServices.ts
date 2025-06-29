import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { Isalary } from "../types/accounts/salaryService";

export interface SalaryReport {
  totalPaid: number;
  pendingPayments: number;
  recentPayments: Isalary[];
}

/**
 * ✅ Record Salary Payment
 * Sends a POST request to record a salary payment for a teacher
 * @param data - Salary payment info
 * @returns AxiosResponse<Isalary>
 */
export const recordSalaryPayment = async (
  data: Isalary
): Promise<AxiosResponse<Isalary>> => {
  return await BaseApi.postRequest(`/pay`, {
    ...data,
  });
};

/**
 * ✅ Get Salary Payments for a Teacher
 * Fetches all salary payments for a specific teacher
 * @param teacherId - ID of the teacher
 * @returns AxiosResponse<Isalary[]>
 */
export const getSalaryPayments = async (
  teacherId: string
): Promise<AxiosResponse<Isalary[]>> => {
  return await BaseApi.getRequest(`/payments/${teacherId}`);
};

/**
 * 🔄 Get Salary Payments by Date Range
 * (Uncomment and implement on backend when ready)
 * @param startDate - Start date
 * @param endDate - End date
 * @returns AxiosResponse<Isalary[]>
 */
// export const getSalaryPaymentsByDate = async (
//   startDate: string,
//   endDate: string
// ): Promise<AxiosResponse<Isalary[]>> => {
//   return await BaseApi.getRequest(`/payments?startDate=${startDate}&endDate=${endDate}`);
// };

/**
 * ✅ Get All Salary Payments
 * Fetches all salary payments across the school
 */
export const getAllSalaryPayments = async (): Promise<AxiosResponse<Isalary[]>> => {
  return await BaseApi.getRequest(`/payments`);
};

/**
 * ✅ Get Salary Payments Report
 * Fetches salary payments report with summary statistics
 */
export const getSalaryPaymentsReport = async (): Promise<AxiosResponse<SalaryReport>> => {
  return await BaseApi.getRequest(`/salary-payments`);
};
