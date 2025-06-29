import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { Iroadmap } from "../types/student/roadMapService";

/**
 * ✅ Create Roadmap
 * Sends a POST request to create a new roadmap
 * @param data - Roadmap data (title, userId)
 * @returns AxiosResponse<Iroadmap>
 */
export const createRoadmap = async (
  data: Iroadmap
): Promise<AxiosResponse<Iroadmap>> => {
  return await BaseApi.postRequest(`/roadmaps`, {
    title: data.title,
    userId: data.userId,
  });
};

/**
 * ✅ Get All Roadmaps
 * Fetches all roadmap entries
 * @returns AxiosResponse<Iroadmap[]>
 */
export const getAllRoadmaps = async (): Promise<AxiosResponse<Iroadmap[]>> => {
  return await BaseApi.getRequest(`/roadmaps`);
};

/**
 * ✅ Get Roadmap By ID
 * Fetches a specific roadmap by its unique ID
 * @param roadmapId - Unique roadmap identifier
 * @returns AxiosResponse<Iroadmap>
 */
export const getRoadmapById = async (
  roadmapId: string
): Promise<AxiosResponse<Iroadmap>> => {
  return await BaseApi.getRequest(`/roadmaps/${roadmapId}`);
};

/**
 * ✅ Update Roadmap
 * Updates an existing roadmap
 * @param roadmapId - Unique roadmap identifier
 * @param data - Partial roadmap data to update
 * @returns AxiosResponse<Iroadmap>
 */
export const updateRoadmap = async (
  roadmapId: string,
  data: Partial<Iroadmap>
): Promise<AxiosResponse<Iroadmap>> => {
  return await BaseApi.putRequest(`/roadmaps/${roadmapId}`, {
    ...(data.title && { title: data.title }),
    ...(data.userId && { userId: data.userId }),
  });
};

/**
 * ✅ Delete Roadmap
 * Deletes a roadmap by its ID
 * @param roadmapId - Unique roadmap identifier
 * @returns AxiosResponse<Iroadmap>
 */
export const deleteRoadmap = async (
  roadmapId: string
): Promise<AxiosResponse<Iroadmap>> => {
  return await BaseApi.deleteRequest(`/roadmaps/${roadmapId}`);
};
