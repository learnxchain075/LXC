import BaseApi from "../BaseApi";
import { IInventoryForm } from "../types/admin/hrm/inventory/inventaroyService";
import { AxiosResponse } from "axios";

// 🔸 Get all inventory items for a school
export const getInventoryItemsBySchool = async (
  schoolId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/inventory/${schoolId}/items`);
};

// 🔸 Get inventory item by ID
export const getInventoryItemById = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/inventory/item/${id}`);
};

// 🔸 Create a new inventory item
export const createInventoryItem = async (
  schoolId: string,
  data: IInventoryForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest(`/inventory/${schoolId}/item`, data);
};

// 🔸 Update an inventory item
export const updateInventoryItem = async (
  id: string,
  data: IInventoryForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/inventory/item/${id}`, data as any);
};

// 🔸 Delete an inventory item
export const deleteInventoryItem = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/inventory/item/${id}`);
};

// 🔸 Record an inventory transaction
export const recordInventoryTransaction = async (data: {
  inventoryItemId: string;
  quantity: number;
  type: "add" | "remove";
  note?: string;
}): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest(`/inventory/transaction`, data);
};

// 🔸 Get all transactions for a specific inventory item
export const getInventoryTransactions = async (
  inventoryItemId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/inventory/transactions/${inventoryItemId}`);
};
