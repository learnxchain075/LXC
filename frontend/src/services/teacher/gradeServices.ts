import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { Igrade } from "../types/teacher/gradeService";

/**
 * Create Grade
 * Sends a POST request to create a new grade record
 * @param data - Grade data (level, grade, marksFrom, marksUpto, gradePoint, status, description, studentId)
 * @returns AxiosResponse<Igrade>
 */
export const createGrade = async (
  data: Igrade
): Promise<AxiosResponse<Igrade>> => {
  return await BaseApi.postRequest(`/school/teacher/grade`, data);
};

/**
 * Get All Grades
 * Sends a GET request to fetch all grade records
 * @returns AxiosResponse<Igrade[]>
 */
export const getGrades = async (): Promise<AxiosResponse<Igrade[]>> => {
  return await BaseApi.getRequest(`/school/teacher/grade`);
};

/**
 * Get Grade By ID
 * Sends a GET request to fetch a specific grade record using its ID
 * @param gradeId - Unique identifier for the grade record
 * @returns AxiosResponse<Igrade>
 */
export const getGradeById = async (
  gradeId: string
): Promise<AxiosResponse<Igrade>> => {
  return await BaseApi.getRequest(`/school/teacher/grade/${gradeId}`);
};

/**
 * Update Grade
 * Sends a PUT request to update a specific grade record
 * @param gradeId - Unique identifier for the grade record
 * @param data - Partial data for updating the grade
 * @returns AxiosResponse<Igrade>
 */
export const updateGrade = async (
  gradeId: string,
  data: Partial<Igrade>
): Promise<AxiosResponse<Igrade>> => {
  return await BaseApi.putRequest(`/school/teacher/grade/${gradeId}`, data);
};

/**
 * Delete Grade
 * Sends a DELETE request to remove a grade record
 * @param gradeId - Unique identifier for the grade record
 * @returns AxiosResponse<Igrade>
 */
export const deleteGrade = async (
  gradeId: string
): Promise<AxiosResponse<Igrade>> => {
  return await BaseApi.deleteRequest(`/school/teacher/grade/${gradeId}`);
};
