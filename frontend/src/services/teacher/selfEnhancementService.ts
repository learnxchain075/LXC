import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";

// ==============================
// 🧠 Quiz Interfaces and Services
// ==============================
export interface IQuiz {
  _id?: string;
  id?: string;
  question: string;
  options: string[];
  answer: string;
  classId: string;
  maxScore: number;
  startDate: Date;
  endDate: Date;
}

// ✅ Get All Quizzes
export const getAllQuizzes = async (): Promise<AxiosResponse<IQuiz[]>> => {
  return await BaseApi.getRequest("/school/quizzes");
};

// ✅ Get Quiz By ID
export const getQuizById = async (id: string): Promise<AxiosResponse<IQuiz>> => {
  return await BaseApi.getRequest(`/school/quizzes/${id}`);
};

// ✅ Create Quiz
export const createQuiz = async (
  data: IQuiz
): Promise<AxiosResponse<IQuiz>> => {
  return await BaseApi.postRequest("/school/quizzes", data);
};

// ✅ Update Quiz
export const updateQuiz = async (
  id: string,
  data: Partial<IQuiz>
): Promise<AxiosResponse<IQuiz>> => {
  const updateData: any = { ...data };
  if (data.options) {
    updateData.options = JSON.stringify(data.options);
  }
  
  return await BaseApi.putRequest(`/school/quizzes/${id}`, updateData);
};

// ✅ Delete Quiz
export const deleteQuiz = async (id: string): Promise<AxiosResponse<IQuiz>> => {
  return await BaseApi.deleteRequest(`/school/quizzes/${id}`);
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
  id?: string;
  title: string;
  content: string;
  attachments?: File | File[]; 
  userId: string;
  classId: string;
}

// ✅ Create Newspaper (with attachments)
export const createNewspaper = async (
  data: INewspaper
): Promise<AxiosResponse<INewspaper>> => {
  const formData = new FormData();
  
  // Add required fields according to backend validation schema
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("userId", data.userId);
  formData.append("classId", data.classId);

  console.log("Service - Creating newspaper with data:", {
    title: data.title,
    content: data.content,
    userId: data.userId,
    classId: data.classId,
    hasAttachments: !!data.attachments
  });

  // Handle file attachment - backend expects "attachment" field
  if (data.attachments) {
    if (Array.isArray(data.attachments) && data.attachments.length > 0) {
      formData.append("attachment", data.attachments[0]);
      console.log("Service - Adding attachment:", data.attachments[0].name);
    } else if (data.attachments instanceof File) {
      formData.append("attachment", data.attachments);
      console.log("Service - Adding single attachment:", data.attachments.name);
    }
  }

  console.log("Service - FormData entries:");
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  return await BaseApi.postRequest("/school/newspapers", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ Get All Newspapers
export const getAllNewspapers = async (): Promise<AxiosResponse<INewspaper[]>> => {
  return await BaseApi.getRequest("/school/newspapers");
};

// ✅ Get Newspapers by Class ID
export const getNewspapersByClassId = async (
  classId: string
): Promise<AxiosResponse<INewspaper[]>> => {
  return await BaseApi.getRequest(`/school/newspapers/class/${classId}`);
};

// ✅ Update Newspaper
export const updateNewspaper = async (
  id: string,
  data: Partial<INewspaper>
): Promise<AxiosResponse<INewspaper>> => {
  const updateData: any = { ...data };
  // Remove attachments from update data as it should be handled separately
  delete updateData.attachments;
  
  return await BaseApi.putRequest(`/school/newspapers/${id}`, updateData);
};

// ✅ Delete Newspaper
export const deleteNewspaper = async (id: string): Promise<AxiosResponse<INewspaper>> => {
  return await BaseApi.deleteRequest(`/school/newspapers/${id}`);
};

// ==============================
// 📊 Quiz Result Interfaces and Services
// ==============================
export interface IQuizResult {
  _id?: string;
  id?: string;
  userId: string;
  quizId: string;
  score: number;
}

// ✅ Get Quiz Results by User ID
export const getQuizResultsByUserId = async (
  userId: string
): Promise<AxiosResponse<IQuizResult[]>> => {
  return await BaseApi.getRequest(`/users/${userId}/quiz-results`);
};

// ✅ Get Quiz Result By ID
export const getQuizResultById = async (
  id: string
): Promise<AxiosResponse<IQuizResult>> => {
  return await BaseApi.getRequest(`/quiz-results/${id}`);
};

// ✅ Create Quiz Result
export const createQuizResult = async (
  data: IQuizResult
): Promise<AxiosResponse<IQuizResult>> => {
  return await BaseApi.postRequest("/quiz-results", data);
};

// ✅ Update Quiz Result
export const updateQuizResult = async (
  id: string,
  data: Partial<IQuizResult>
): Promise<AxiosResponse<IQuizResult>> => {
  return await BaseApi.putRequest(`/quiz-results/${id}`, data);
};

// ✅ Delete Quiz Result
export const deleteQuizResult = async (
  id: string
): Promise<AxiosResponse<IQuizResult>> => {
  return await BaseApi.deleteRequest(`/quiz-results/${id}`);
};

// ==============================
// 📰 Newspaper Submission Interfaces and Services
// ==============================
export interface INewspaperSubmission {
  _id?: string;
  id?: string;
  newspaperId: string;
  studentId: string;
  voice?: File;
  translation?: string;
}

// ✅ Submit Newspaper Translation
export const submitNewspaperTranslation = async (
  data: INewspaperSubmission
): Promise<AxiosResponse<INewspaperSubmission>> => {
  const formData = new FormData();
  formData.append("newspaperId", data.newspaperId);
  formData.append("studentId", data.studentId);
  
  if (data.translation) {
    formData.append("translation", data.translation);
  }
  
  if (data.voice) {
    formData.append("voice", data.voice);
  }

  return await BaseApi.postRequest("/school/newspaper/submission", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ Get Submissions by Newspaper
export const getSubmissionsByNewspaper = async (
  newspaperId: string
): Promise<AxiosResponse<INewspaperSubmission[]>> => {
  return await BaseApi.getRequest(`/school/newspaper/submission/newspaper/${newspaperId}`);
};

// ✅ Get Submissions by Student
export const getSubmissionsByStudent = async (
  studentId: string
): Promise<AxiosResponse<INewspaperSubmission[]>> => {
  return await BaseApi.getRequest(`/school/newspaper/submission/student/${studentId}`);
};

// ✅ Delete Submission
export const deleteSubmission = async (
  submissionId: string
): Promise<AxiosResponse<INewspaperSubmission>> => {
  return await BaseApi.deleteRequest(`/school/newspaper/submission/${submissionId}`);
};
