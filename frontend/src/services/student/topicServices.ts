import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { Itopic } from "../types/student/topicService";


/**
 * ✅ Create Topic
 * Sends a POST request to create a new topic
 * @param data - Topic data (name, roadmapId)
 * @returns AxiosResponse<Itopic>
 */
export const createTopic = async (
  data: Itopic
): Promise<AxiosResponse<Itopic>> => {
  return await BaseApi.postRequest(`/topics`, {
    name: data.name,
    roadmapId: data.roadmapId,
  });
};

/**
 * ✅ Get Topics by Roadmap ID
 * Fetches all topics linked to a specific roadmap
 * @param roadmapId - ID of the roadmap
 * @returns AxiosResponse<Itopic[]>
 */
export const getTopicsByRoadmapId = async (
  roadmapId: string
): Promise<AxiosResponse<Itopic[]>> => {
  return await BaseApi.getRequest(`/roadmaps/${roadmapId}/topics`);
};

/**
 * ✅ Get Topic by ID
 * Fetches a topic by its unique ID
 * @param topicId - Unique topic ID
 * @returns AxiosResponse<Itopic>
 */
export const getTopicById = async (
  topicId: string
): Promise<AxiosResponse<Itopic>> => {
  return await BaseApi.getRequest(`/topics/${topicId}`);
};

/**
 * ✅ Update Topic
 * Updates a specific topic by ID
 * @param topicId - Unique topic ID
 * @param data - Partial topic data to update
 * @returns AxiosResponse<Itopic>
 */
export const updateTopic = async (
  topicId: string,
  data: Partial<Itopic>
): Promise<AxiosResponse<Itopic>> => {
  return await BaseApi.putRequest(`/topics/${topicId}`, {
    ...(data.name && { name: data.name }),
    ...(data.roadmapId && { roadmapId: data.roadmapId }),
  });
};

/**
 * ✅ Delete Topic
 * Deletes a topic by its ID
 * @param topicId - Unique topic ID
 * @returns AxiosResponse<Itopic>
 */
export const deleteTopic = async (
  topicId: string
): Promise<AxiosResponse<Itopic>> => {
  return await BaseApi.deleteRequest(`/topics/${topicId}`);
};
