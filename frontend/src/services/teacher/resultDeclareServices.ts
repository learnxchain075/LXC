import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { Iresult } from "../types/teacher/resultService";

export interface Result {
  id: string;
  studentId: string;
  examId: string;
  marks: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResultInput {
  studentId: string;
  examId: string;
  marks: number;
}

/**
 * ✅ Create Result
 * Sends a POST request to create a new result record
 * @param data - Result data (studentId, examId, assignmentId, score)
 * @returns AxiosResponse<Iresult>
 */
export const createResult = async (
  data: CreateResultInput
): Promise<AxiosResponse<Result>> => {
  return await BaseApi.postRequest("/school/teacher/result", data);
};

/**
 * ✅ Get All Results
 * Fetches all result records
 * @returns AxiosResponse<Iresult[]>
 */
export const getAllResults = async (): Promise<AxiosResponse<Result[]>> => {
  return await BaseApi.getRequest("/school/teacher/result");
};

/**
 * ✅ Get Result by ID
 * Fetches a single result using its unique ID
 * @param resultId - Unique result identifier
 * @returns AxiosResponse<Iresult>
 */
export const getResultById = async (
  id: string
): Promise<AxiosResponse<Result>> => {
  return await BaseApi.getRequest(`/school/teacher/result/${id}`);
};

/**
 * ✅ Update Result
 * Updates an existing result
 * @param resultId - Unique result identifier
 * @param data - Partial result data to update
 * @returns AxiosResponse<Iresult>
 */
export const updateResult = async (
  id: string,
  data: Partial<CreateResultInput>
): Promise<AxiosResponse<Result>> => {
  return await BaseApi.putRequest(`/school/teacher/result/${id}`, data);
};

/**
 * ✅ Delete Result
 * Deletes a result by its ID
 * @param resultId - Unique result identifier
 * @returns AxiosResponse<Iresult>
 */
export const deleteResult = async (
  id: string
): Promise<AxiosResponse<void>> => {
  return await BaseApi.deleteRequest(`/school/teacher/result/${id}`);
};

// Get student results by class and student ID
export const getStudentResults = async (
  classId: string,
  studentId: string
): Promise<AxiosResponse<Result[]>> => {
  return await BaseApi.getRequest(`/result/${classId}/${studentId}`);
};

// Get student marksheet
export const getStudentMarksheet = async (
  classId: string,
  studentId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/teacher/marksheet/${classId}/${studentId}`);
};

// Get class toppers
export const getClassToppers = async (
  classId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/teacher/marksheet/topper/${classId}`);
};
