import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { Parent, Student } from "../types/parents/parentTypes";

/**
 * Fetches a parent by its ID, including associated students.
 *
 * @param id - The unique identifier of the parent.
 * @returns AxiosResponse with a payload containing the parent object.
 */
export const getParentById = async (
  id: string
): Promise<AxiosResponse<{ success: boolean; data: Parent }>> => {
  return BaseApi.getRequest(`/school/parents/${id}`);
};

/**
 * Fetches the children (students) associated with a specific parent.
 *
 * @param parentId - The unique identifier of the parent.
 * @returns AxiosResponse with a payload containing an array of student objects.
 */
export const getChildrenByParent = async (
  parentId: string
): Promise<AxiosResponse<{ success: boolean; data: Student[] }>> => {
  return BaseApi.getRequest(`/school/parents/${parentId}/children`);
};

/**
 * Fetches all parents whose children are enrolled in the specified school.
 *
 * @param schoolId - The unique identifier of the school.
 * @returns AxiosResponse with a payload containing an array of parent objects.
 */
export const getParentsBySchool = async (
  schoolId: string
): Promise<AxiosResponse<{ success: boolean; data: Parent[] }>> => {
  return BaseApi.getRequest(`/schools/${schoolId}/parents`);
};
