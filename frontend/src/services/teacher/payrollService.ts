import BaseApi from "../BaseApi";
import { AxiosResponse } from "axios";
import { IPayroll } from "../types/teacher/IPayroll";

export const getPayrollsByTeacherId = async (
  teacherId: string
): Promise<AxiosResponse<IPayroll[]>> => {
  return await BaseApi.getRequest(`/teacher/payroll/${teacherId}`);
};
