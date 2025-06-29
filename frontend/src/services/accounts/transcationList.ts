import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";

/**
 * ✅ Get All Transactions for a Specific School
 * @param schoolId - School ID
 * @returns AxiosResponse<Ipayment[]>
 */
export const getAllTransactionsForSchool = async (
    schoolId: string
  ): Promise<AxiosResponse<any[]>> => {
    return await BaseApi.getRequest(`/school/${schoolId}/transactions`);
   
  };
  
  /**
   * ✅ Get All Transactions for Subscription Plans (Superadmin)
   * @returns AxiosResponse<Ipayment[]>
   */
  export const getAllTransactionsForPlans = async (): Promise<AxiosResponse<any[]>> => {
    return await BaseApi.getRequest(`/superadmin/subscriptions`);
  };
  
  /**
   * ✅ Get All Transactions for a Specific Student
   * @param studentId - Student ID
   * @returns AxiosResponse<Ipayment[]>
   */
  export const getAllTransactionsForStudent = async (
    studentId: string
  ): Promise<AxiosResponse<any[]>> => {
    return await BaseApi.getRequest(`/school/student/${studentId}`);
  };
  
