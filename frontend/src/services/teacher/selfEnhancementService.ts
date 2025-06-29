import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";

// ==============================
// 🧠 Quiz Interfaces and Services
// ==============================
export interface IQuiz {
  _id?: string;
  question: string;
  options: string[];
  answer: string;
  classId: string;
}

// ✅ Create Quiz
export const createQuiz = async (
  data: IQuiz
): Promise<AxiosResponse<IQuiz>> => {
  return await BaseApi.postRequest("/school/quizzes", data);
};

// ✅ Get Quizzes by Class ID
export const getQuizzesByClassId = async (
  classId: string
): Promise<AxiosResponse<IQuiz[]>> => {
  return await BaseApi.getRequest(`/school/quizzes/class/${classId}`);
};

// ==============================
// 📰 Newspaper Interfaces and Services
// ==============================
export interface INewspaper {
  _id?: string;
  title: string;
  content: string;
  attachments?: string | File; 
  userId: string;
  classId: string;
}

// ✅ Create Newspaper (with attachments)
export const createNewspaper = async (
  data: INewspaper
): Promise<AxiosResponse<INewspaper>> => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("userId", data.userId);
  formData.append("classId", data.classId);

  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((file) => formData.append("attachments", file));
  }

  return await BaseApi.postRequest("/school/newspapers",data
    
    // formData,
//      {
//     // headers: {
//     //   "Content-Type": "multipart/form-data",
//     // },
//   }

);
};

// ✅ Get Newspapers by Class ID
export const getNewspapersByClassId = async (
  classId: string
): Promise<AxiosResponse<INewspaper[]>> => {
  return await BaseApi.getRequest(`/school/newspapers/class/${classId}`);
};
