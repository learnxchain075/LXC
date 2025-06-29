import BaseApi from "../BaseApi";

import { AxiosResponse } from "axios";
import { IleaderBoardForm } from "../types/admin/leaderBoardService";

// Create a leaderboard entry
export const createLeaderboard = async (
  data: IleaderBoardForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/leaderboard", data);
};

// Get all leaderboard entries
export const getLeaderboard = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest("/leaderboard");
};

// Get leaderboard entry by ID
export const getLeaderboardById = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/leaderboard/${id}`);
};

// Update leaderboard entry
export const updateLeaderboard = async (
  id: string,
  data: IleaderBoardForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/leaderboard/${id}`, data as any);
};

// Delete leaderboard entry
export const deleteLeaderboard = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/leaderboard/${id}`);
};
