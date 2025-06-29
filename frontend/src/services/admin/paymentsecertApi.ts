import BaseApi from "../BaseApi";

import { AxiosResponse } from "axios";
import { IPaymentSecertForm } from "../types/admin/paymentsecertService";

// Create payment secret
export const createPaymentSecret = async (
  data: IPaymentSecertForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/school/admin/payment-secret", data);
};

// Get all payment secrets
export const getAllPaymentSecrets = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest("/school/admin/payment-secrets");
};

// Get payment secret by ID
export const getPaymentSecretById = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/admin/payment-secret/${id}`);
};

// Get payment secret by School ID
export const getPaymentSecretBySchoolId = async (
  schoolId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/admin/payment-secret/school/${schoolId}`);
};

// Update payment secret
export const updatePaymentSecret = async (
  id: string,
  data: IPaymentSecertForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/school/admin/payment-secret/${id}`, data as any);
};

// Delete payment secret
export const deletePaymentSecret = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/school/admin/payment-secret/${id}`);
};
