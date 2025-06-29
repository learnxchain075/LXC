import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";

// ------------------- Interfaces -------------------

export interface CreateExamInput {
  passMark: number;
  totalMarks: number;
  duration: number;
  roomNumber: number;
  title: string;
  startTime: Date;
  endTime: Date;
  subjectId: string;
  classId: string;
}

export type UpdateExamInput = Partial<CreateExamInput>;

export interface ScheduleExamInput {
  title: string;
  startTime: Date;
  endTime: Date;
  subjectId: string;
  classId: string;
  scheduleDate?: Date;
}

export interface CreateExamAttendanceInput {
  studentId: string;
  examId: string;
  date?: Date;
  present: boolean;
}

export interface CreateResultInput {
  studentId: string;
  examId: string;
  score: number;
  assignmentId?: string; 
}

export interface ExamResult {
  id: string;
  studentId: string;
  examId: string;
  marksObtained: number;
  createdAt: string;
  updatedAt: string;
  studentName?: string;
}

// ------------------- API Functions -------------------

// ✅ Create Exam
export const createExam = async (
  data: CreateExamInput
): Promise<AxiosResponse<CreateExamInput>> => {
  return await BaseApi.postRequest("/school/teacher/exam", data);
};

// ✅ Get Exams by Class ID
export const getExamsByClass = async (
  classId: string
): Promise<AxiosResponse<CreateExamInput[]>> => {
  return await BaseApi.getRequest(`/school/teacher/exam/${classId}`);
};

// ✅ Submit Result for an Exam
export const createExamResults = async (
  data: CreateResultInput
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/school/teacher/result", data);
};

// ✅ Get Results for a Class or Exam
export const getExamResults = async (): Promise<AxiosResponse<any>> => {
  const response = await BaseApi.getRequest(`/school/teacher/result`);
 // console.log('API /school/teacher/result response:', response);
  return response;
};