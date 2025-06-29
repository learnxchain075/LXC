import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";

/**
 * Get all sections of a class by classId
 * @param classId - The class ID
 * @returns AxiosResponse<any>
 */
export const getSections = async (classId: string): Promise<AxiosResponse<any>> => {
  try {
    return await BaseApi.getRequest(`/school/class/${classId}`);
  } catch (error) {
    throw error;
  }
};

/**
 * Get a section by its ID
 * @param id - Section ID
 * @returns AxiosResponse<any>
 */
export const getSectionById = async (id: string): Promise<AxiosResponse<any>> => {
  try {
    return await BaseApi.getRequest(`/school/class/section/${id}`);
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new section
 * @param data - Section data
 * @returns AxiosResponse<any>
 */
export const createSection = async (data: any): Promise<AxiosResponse<any>> => {
  try {
    return await BaseApi.postRequest(`/school/class/create-section`, data);
  } catch (error) {
    throw error;
  }
};

/**
 * Update a section by ID
 * @param id - Section ID
 * @param data - Section data to update
 * @returns AxiosResponse<any>
 */
export const updateSection = async (id: string, data: any): Promise<AxiosResponse<any>> => {
  try {
    return await BaseApi.putRequest(`/school/class/section/${id}`, data);
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a section by ID
 * @param id - Section ID
 * @returns AxiosResponse<any>
 */
export const deleteSection = async (id: string): Promise<AxiosResponse<any>> => {
  try {
    return await BaseApi.deleteRequest(`/school/class/section/${id}`);
  } catch (error) {
    throw error;
  }
}; 