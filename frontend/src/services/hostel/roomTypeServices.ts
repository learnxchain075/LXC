import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IroomType } from "../types/hostel/roomTypeService";


/**
 * ✅ Create Room
 * @param data - Room data
 * @returns AxiosResponse<IroomType>
 */
export const createRoom = async (
  data: IroomType
): Promise<AxiosResponse<IroomType>> => {
  return await BaseApi.postRequest("/", { ...data });
};

/**
 * ✅ Get All Rooms
 * @returns AxiosResponse<IroomType[]>
 */
export const getAllRooms = async (): Promise<AxiosResponse<IroomType[]>> => {
  return await BaseApi.getRequest("/");
};

/**
 * ✅ Get Room by ID
 * @param id - Room ID
 * @returns AxiosResponse<IroomType>
 */
export const getRoomById = async (
  id: string
): Promise<AxiosResponse<IroomType>> => {
  return await BaseApi.getRequest(`/${id}`);
};

/**
 * ✅ Update Room
 * @param id - Room ID
 * @param data - Partial room data
 * @returns AxiosResponse<IroomType>
 */
export const updateRoom = async (
  id: string,
  data: Partial<IroomType>
): Promise<AxiosResponse<IroomType>> => {
  return await BaseApi.putRequest(`/${id}`, { ...data });
};

/**
 * ✅ Delete Room
 * @param id - Room ID
 * @returns AxiosResponse<IroomType>
 */
export const deleteRoom = async (
  id: string
): Promise<AxiosResponse<IroomType>> => {
  return await BaseApi.deleteRequest(`/${id}`);
};
