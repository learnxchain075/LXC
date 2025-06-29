import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IquizResult } from "../types/teacher/quizeResultService";

/**
 * ✅ Create Quiz Result
 * Sends a POST request to record a user's quiz result
 * @param data - Quiz result data (userId, quizId, score)
 * @returns AxiosResponse<IquizResult>
 */
export const createQuizResult = async (
  data: IquizResult
): Promise<AxiosResponse<IquizResult>> => {
  return await BaseApi.postRequest(`/quiz-results`, {
    userId: data.userId,
    quizId: data.quizId,
    score: data.score,
  });
};

/**
 * ✅ Get Quiz Result By ID
 * Fetches a specific quiz result by its unique ID
 * @param resultId - Unique ID of the quiz result
 * @returns AxiosResponse<IquizResult>
 */
export const getQuizResultById = async (
  resultId: string
): Promise<AxiosResponse<IquizResult>> => {
  return await BaseApi.getRequest(`/quiz-results/${resultId}`);
};

/**
 * ✅ Get Quiz Results by User ID
 * Fetches all quiz results for a specific user
 * @param userId - Unique user ID
 * @returns AxiosResponse<IquizResult[]>
 */
export const getQuizResultsByUserId = async (
  userId: string
): Promise<AxiosResponse<IquizResult[]>> => {
  return await BaseApi.getRequest(`/users/${userId}/quiz-results`);
};

/**
 * ✅ Update Quiz Result
 * Updates an existing quiz result
 * @param resultId - Unique ID of the quiz result
 * @param data - Partial quiz result data to update
 * @returns AxiosResponse<IquizResult>
 */
export const updateQuizResult = async (
  resultId: string,
  data: Partial<IquizResult>
): Promise<AxiosResponse<IquizResult>> => {
  return await BaseApi.putRequest(`/quiz-results/${resultId}`, {
    ...(data.userId && { userId: data.userId }),
    ...(data.quizId && { quizId: data.quizId }),
    ...(typeof data.score === "number" && { score: data.score }),
  });
};

/**
 * ✅ Delete Quiz Result
 * Deletes a specific quiz result by its ID
 * @param resultId - Unique ID of the quiz result
 * @returns AxiosResponse<IquizResult>
 */
export const deleteQuizResult = async (
  resultId: string
): Promise<AxiosResponse<IquizResult>> => {
  return await BaseApi.deleteRequest(`/quiz-results/${resultId}`);
};
