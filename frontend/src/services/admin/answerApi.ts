import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IanswerForm } from "../types/admin/answerServices";


// Create a new answer
export const createAnswer = async (
  data: IanswerForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/answers", data);
};

// Get all answers by doubt ID
export const getAnswersByDoubtId = async (
  doubtId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/doubts/${doubtId}/answers`);
};

// Get single answer by ID
export const getAnswerById = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/answers/${id}`);
};

// Update answer
export const updateAnswer = async (
  id: string,
  data: IanswerForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/answers/${id}`, data as any);
};

// Delete answer
export const deleteAnswer = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/answers/${id}`);
};
