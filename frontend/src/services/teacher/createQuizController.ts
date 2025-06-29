import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IquizCreate } from "../types/teacher/quizCreateService";


/**
 * ✅ Create Quiz
 * Sends a POST request to create a new quiz
 * @param data - Quiz data (question, options, answer)
 * @returns AxiosResponse<IquizCreate>
 */
export const createQuiz = async (
  data: IquizCreate
): Promise<AxiosResponse<IquizCreate>> => {
  return await BaseApi.postRequest(`/quizzes`, {
    question: data.question,
    options: data.options,
    answer: data.answer,
  });
};

/**
 * ✅ Get All Quizzes
 * Sends a GET request to fetch all quizzes
 * @returns AxiosResponse<IquizCreate[]>
 */
export const getAllQuizzes = async (): Promise<AxiosResponse<IquizCreate[]>> => {
  return await BaseApi.getRequest(`/quizzes`);
};

/**
 * ✅ Get Quiz By ID
 * Sends a GET request to fetch a single quiz by its ID
 * @param quizId - Unique identifier of the quiz
 * @returns AxiosResponse<IquizCreate>
 */
export const getQuizById = async (
  quizId: string
): Promise<AxiosResponse<IquizCreate>> => {
  return await BaseApi.getRequest(`/quizzes/${quizId}`);
};

/**
 * ✅ Update Quiz
 * Sends a PUT request to update an existing quiz
 * @param quizId - Unique identifier of the quiz
 * @param data - Partial quiz data to update
 * @returns AxiosResponse<IquizCreate>
 */
export const updateQuiz = async (
  quizId: string,
  data: Partial<IquizCreate>
): Promise<AxiosResponse<IquizCreate>> => {
  return await BaseApi.putRequest(`/quizzes/${quizId}`, {
    ...(data.question && { question: data.question }),
    ...(data.options && { options: JSON.stringify(data.options) }),
    ...(data.answer && { answer: data.answer }),
  });
};

/**
 * ✅ Delete Quiz
 * Sends a DELETE request to remove a quiz by ID
 * @param quizId - Unique identifier of the quiz
 * @returns AxiosResponse<IquizCreate>
 */
export const deleteQuiz = async (
  quizId: string
): Promise<AxiosResponse<IquizCreate>> => {
  return await BaseApi.deleteRequest(`/quizzes/${quizId}`);
};
