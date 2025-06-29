import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";

import { ICreateFeedback } from "../types/feeback";

// Create Feedback

export const createFeedback = async (
  id: string,
  title: string,
  description: string,
  status: string,
  schoolId: string
): Promise<AxiosResponse<ICreateFeedback>> => {
  const response = await BaseApi.postRequest(`/create-feedback`, {
    id,
    title,
    description,
    status,
    schoolId,
  });

  return response;
};

// Get All Feedbacks

export const getAllFeedback = async (): Promise<
  AxiosResponse<ICreateFeedback[]>
> => {
  const response = await BaseApi.getRequest(`/get-feedbacks`);
  return response;
};

// Get Feedback By Id

export const getFeedbackById = async (
  feedbackId: string
): Promise<AxiosResponse<ICreateFeedback>> => {
  const response = await BaseApi.getRequest(`get-feedback/${feedbackId}`);

  return response;
};

// Get Feedback By School

export const getFeedbackBySchool = async (
  schoolId: string
): Promise<AxiosResponse<ICreateFeedback>> => {
  const response = await BaseApi.getRequest(`schoolfeedback/${schoolId}`);

  return response;
};

// Update Feedback

export const updateFeedback = async (
  id: string,
  title: string,
  description: string,
  status: string,
  schoolId: string
): Promise<AxiosResponse<ICreateFeedback>> => {
  const response = await BaseApi.putRequest(`/update-feedback/${id}`, {
    id,
    title,
    description,
    status,
    schoolId,
  });

  return response;
};

// Delete Feedback

export const deleteFeedback = async (
  feedbackId: string
): Promise<AxiosResponse<ICreateFeedback>> => {
  const response = await BaseApi.deleteRequest(`delete-feedback/${feedbackId}`);

  return response;
};

// Approve Feedback

export const approveFeedback = async (
  feedbackId: string
): Promise<AxiosResponse<ICreateFeedback>> => {
  const response = await BaseApi.patchRequest(`approve-feedback/${feedbackId}`);

  return response;
};

// Reject Feedback

export const rejectFeedback = async (
  feedbackId: string
): Promise<AxiosResponse<ICreateFeedback>> => {
  const response = await BaseApi.patchRequest(`reject-feedback/${feedbackId}`);

  return response;
};
