import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IEmployeeBase } from "../types/admin/employeeService";

export const registerEmployee = async (
  data: IEmployeeBase
): Promise<AxiosResponse<any>> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "profilePic" && value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, value?.toString() || "");
    }
  });
  return await BaseApi.postRequest("/employee", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllEmployees = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest("/employees");
};

export const getEmployeeById = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/employee/${id}`);
};

export const updateEmployee = async (
  id: string,
  data: IEmployeeBase
): Promise<AxiosResponse<any>> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "profilePic" && value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, value?.toString() || "");
    }
  });
  return await BaseApi.putRequest(`/employee/${id}`, formData as any, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteEmployee = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/employee/${id}`);
};

export const getEmployeesBySchool = async (
  schoolId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/${schoolId}/employees`);
};
