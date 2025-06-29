import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";


// ==============================
// ❓ Doubts Interfaces and Services
// ==============================

export interface IDoubt {
  id?: string;
  title: string;
  content: string;
  userId: string;
  classId: string;
  subjectId: string;
  createdAt?: string;
}

// ✅ Create Doubt
export const createDoubt = async (
  data: IDoubt
): Promise<AxiosResponse<IDoubt>> => {
  return await BaseApi.postRequest("/school/doubt", data);
};

// ✅ Get All Doubts by School ID
export const getDoubtsBySchoolId = async (
  schoolId: string
): Promise<AxiosResponse<IDoubt[]>> => {
  return await BaseApi.getRequest(`/school/doubt/school/${schoolId}`);
};

// ✅ Get Doubts by User ID
export const getDoubtsByUserId = async (
  userId: string
): Promise<AxiosResponse<IDoubt[]>> => {
  return await BaseApi.getRequest(`/school/doubt/user/${userId}`);
};

// ==============================
// 💬 Answers Interfaces and Services
// ==============================

export interface IAnswer {
  id?: string;
  content: string;
  userId: string;
  doubtId: string;
  createdAt?: string;
  upvotes?: number;
}

// ✅ Create Answer to a Doubt
export const createAnswer = async (
  data: IAnswer
): Promise<AxiosResponse<IAnswer>> => {
  return await BaseApi.postRequest("/school/answers", data);
};

// ✅ Get All Answers for a Doubt
export const getAnswersByDoubtId = async (
  doubtId: string
): Promise<AxiosResponse<IAnswer[]>> => {
  return await BaseApi.getRequest(`/school/doubts/${doubtId}/answers`);
};
