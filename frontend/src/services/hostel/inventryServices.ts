import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { Iinventory } from "../types/hostel/inventoryService";

/**
 * ✅ Create Inventory Item
 * @param roomId - Room ID
 * @param data - Inventory details
 * @returns AxiosResponse<Iinventory>
 */
export const createInventory = async (
  roomId: string,
  data: Iinventory
): Promise<AxiosResponse<Iinventory>> => {
  return await BaseApi.postRequest(`/room/${roomId}`, { ...data });
};

/**
 * ✅ Get Inventories by Room
 * @param roomId - Room ID
 * @returns AxiosResponse<Iinventory[]>
 */
export const getInventories = async (
  roomId: string
): Promise<AxiosResponse<Iinventory[]>> => {
  return await BaseApi.getRequest(`/room/${roomId}`);
};

/**
 * ✅ Get Inventory by ID
 * @param id - Inventory item ID
 * @returns AxiosResponse<Iinventory>
 */
export const getInventoryById = async (
  id: string
): Promise<AxiosResponse<Iinventory>> => {
  return await BaseApi.getRequest(`/${id}`);
};

/**
 * ✅ Update Inventory
 * @param id - Inventory item ID
 * @param data - Partial inventory details
 * @returns AxiosResponse<Iinventory>
 */
export const updateInventory = async (
  id: string,
  data: Partial<Iinventory>
): Promise<AxiosResponse<Iinventory>> => {
  return await BaseApi.putRequest(`/${id}`, { ...data });
};

/**
 * ✅ Delete Inventory
 * @param id - Inventory item ID
 * @returns AxiosResponse<Iinventory>
 */
export const deleteInventory = async (
  id: string
): Promise<AxiosResponse<Iinventory>> => {
  return await BaseApi.deleteRequest(`/${id}`);
};
