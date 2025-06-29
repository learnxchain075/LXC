
import BaseApi from "../BaseApi";
import { AxiosResponse } from "axios";
import { IholidayForm } from "../types/admin/holidayServices";

// Create a new holiday

export const createHoliday = async (
  data: IholidayForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/school/holiday", data);
};

// Get all holidays for a school (optionally filtered by schoolId)

export const getHolidays = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest("/admin/school/holidays");
};

// Get holiday by ID

export const getHolidayById = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/holiday/${id}`);
};

// Update a holiday

export const updateHoliday = async (
  id: string,
  data: IholidayForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/school/holiday/${id}`, data as any);
};




// Delete a holiday
export const deleteHoliday = async (id: string): Promise<AxiosResponse<any>> => {
    return await BaseApi.deleteRequest(`/school/holiday/${id}`);
  };
  

// Filter holidays by date range

export const filterHolidaysByDate = async (
  startDate: string,
  endDate: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(
    `/school/holiday/filter?startDate=${startDate}&endDate=${endDate}`
  );
};