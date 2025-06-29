import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";

/**
 * ✅ Create Quiz Result
 * Sends a POST request to record a user's quiz result
 * @param data - Quiz result data (userId, quizId, score)
 * @returns AxiosResponse<IquizResult>
 */
export const createclass = async (
  data: any
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest('/teacher/class', data);
};
