import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { ICreateFeedback } from "../types/feeback";

export const createFeedback = async (
  id: string,
  title: string,
  description: string,
  status: string,
  schoolId: string
): Promise<AxiosResponse<ICreateFeedback>> => {
  return await BaseApi.postRequest(`/create-feedback`, {
    id,
    title,
    description,
    status,
    schoolId,
  });
};

export const getFeedbackBySchool = async (
  schoolId: string
): Promise<AxiosResponse<ICreateFeedback[]>> => {
  return await BaseApi.getRequest(`schoolfeedback/${schoolId}`);
};

export const updateFeedback = async (
  id: string,
  title: string,
  description: string,
  status: string,
  schoolId: string
): Promise<AxiosResponse<ICreateFeedback>> => {
  return await BaseApi.putRequest(`/update-feedback/${id}`, {
    id,
    title,
    description,
    status,
    schoolId,
  });
};

export const deleteFeedback = async (
  feedbackId: string
): Promise<AxiosResponse<ICreateFeedback>> => {
  return await BaseApi.deleteRequest(`delete-feedback/${feedbackId}`);
};
