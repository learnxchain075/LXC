import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IcompetitionForm } from "../types/admin/competitionService";


// Create a new competition
export const createCompetition = async (
  data: IcompetitionForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/competitions", data);
};

// Get all competitions
export const getAllCompetitions = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest("/competitions");
};

// Get a competition by ID
export const getCompetitionById = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/competitions/${id}`);
};

// Update competition
export const updateCompetition = async (
  id: string,
  data: IcompetitionForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/competitions/${id}`, data as any);
};

// Delete competition
export const deleteCompetition = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/competitions/${id}`);
};
