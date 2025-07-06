import BaseApi from "../BaseApi";
import { AxiosRequestConfig } from "axios";

export const createCompanyTransaction = async (data: FormData) => {
  const config: AxiosRequestConfig = { headers: { "Content-Type": "multipart/form-data" } };
  return await BaseApi.postRequest("/company-accounts/create", data, config);
};

export const getCompanyTransactions = async (params?: any) => {
  return await BaseApi.getRequest("/company-accounts/list", { params });
};

export const getCompanySummary = async (params?: any) => {
  return await BaseApi.getRequest("/company-accounts/summary", { params });
};

export const updateCompanyTransaction = async (id: string, data: FormData) => {
  const config: AxiosRequestConfig = { headers: { "Content-Type": "multipart/form-data" } };
  return await BaseApi.putRequest(`/company-accounts/${id}/update`, data, config);
};

export const deleteCompanyTransaction = async (id: string) => {
  return await BaseApi.deleteRequest(`/company-accounts/${id}`);
};

export const filterCompanyTransactions = async (params?: any) => {
  return await BaseApi.getRequest("/company-accounts/transactions", { params });
};

export const exportCompanyTransactions = async (format: "csv" | "pdf", params?: any) => {
  return await BaseApi.getRequest(`/company-accounts/transactions/export/${format}`, { params, responseType: 'blob' });
};

export const exportCompanySummary = async (format: "csv" | "pdf", params?: any) => {
  return await BaseApi.getRequest(`/company-accounts/summary/export/${format}`, { params, responseType: 'blob' });
};
