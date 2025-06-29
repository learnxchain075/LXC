import BaseApi from "../BaseApi";

import { AxiosResponse } from "axios";
import { ItransactionForm } from "../types/admin/transcationService";

// Create a transaction
export const createTransaction = async (data: ItransactionForm): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/transactions", data);
};

// Get all transactions of a specific user
export const getTransactionsByUserId = async (userId: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/users/${userId}/transactions`);
};

// Get transaction by ID
export const getTransactionById = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/transactions/${id}`);
};

// Update a transaction
export const updateTransaction = async (id: string, data: ItransactionForm): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/transactions/${id}`, data as any);
};

// Delete a transaction
export const deleteTransaction = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/transactions/${id}`);
};
