import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { Inewspaper } from "../types/teacher/newspaperService";


/**
 * ✅ Create Newspaper
 * Sends a POST request to create a new newspaper article
 * @param data - Newspaper data (title, content, userId)
 * @returns AxiosResponse<Inewspaper>
 */
export const createNewspaper = async (
  data: Inewspaper
): Promise<AxiosResponse<Inewspaper>> => {
  return await BaseApi.postRequest(`/newspapers`, {
    title: data.title,
    content: data.content,
    userId: data.userId,
  });
};

/**
 * ✅ Get All Newspapers
 * Sends a GET request to retrieve all newspaper articles
 * @returns AxiosResponse<Inewspaper[]>
 */
export const getAllNewspapers = async (): Promise<AxiosResponse<Inewspaper[]>> => {
  return await BaseApi.getRequest(`/newspapers`);
};

/**
 * ✅ Get Newspaper By ID
 * Sends a GET request to retrieve a single newspaper article by its ID
 * @param newspaperId - Unique newspaper identifier
 * @returns AxiosResponse<Inewspaper>
 */
export const getNewspaperById = async (
  newspaperId: string
): Promise<AxiosResponse<Inewspaper>> => {
  return await BaseApi.getRequest(`/newspapers/${newspaperId}`);
};

/**
 * ✅ Update Newspaper
 * Sends a PUT request to update an existing newspaper article
 * @param newspaperId - Unique newspaper identifier
 * @param data - Partial newspaper data to update
 * @returns AxiosResponse<Inewspaper>
 */
export const updateNewspaper = async (
  newspaperId: string,
  data: Partial<Inewspaper>
): Promise<AxiosResponse<Inewspaper>> => {
  return await BaseApi.putRequest(`/newspapers/${newspaperId}`, {
    ...(data.title && { title: data.title }),
    ...(data.content && { content: data.content }),
    ...(data.userId && { userId: data.userId }),
  });
};

/**
 * ✅ Delete Newspaper
 * Sends a DELETE request to delete a specific newspaper article by ID
 * @param newspaperId - Unique newspaper identifier
 * @returns AxiosResponse<Inewspaper>
 */
export const deleteNewspaper = async (
  newspaperId: string
): Promise<AxiosResponse<Inewspaper>> => {
  return await BaseApi.deleteRequest(`/newspapers/${newspaperId}`);
};
