import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IExam, ICreateExam, IUpdateExam } from "../types/teacher/examService";


/**
 * ✅ Create Exam
 * Sends a POST request to create a new exam
 * @param data - Exam data (title, startTime, endTime, classId, passMark, totalMarks, duration, roomNumber)
 * @returns AxiosResponse<IExam>
 */
export const createExam = async (
  data: ICreateExam & { subjectId?: string }
): Promise<AxiosResponse<IExam>> => {
  // Only send fields that exist in backend schema
  const payload: any = {
    title: data.title,
    startTime: data.startTime,
    endTime: data.endTime,
    classId: data.classId,
    passMark: data.passMark,
    totalMarks: data.totalMarks,
    duration: data.duration,
    roomNumber: data.roomNumber,
  };
  if (data.subjectId) payload.subjectId = data.subjectId;
  return await BaseApi.postRequest(`/school/teacher/exam`, payload);
};

/**
 * ✅ Get All Exams for Class
 * Sends a GET request to fetch all exams for a specific class
 * @param classId - Class ID
 * @returns AxiosResponse<IExam[]>
 */
export const getExams = async (
  classId: string
): Promise<AxiosResponse<IExam[]>> => {
  return await BaseApi.getRequest(`/school/teacher/exam/${classId}`);
};

/**
 * ✅ Get Exam By ID
 * Sends a GET request to fetch a specific exam by its ID
 * @param examId - Unique exam identifier
 * @returns AxiosResponse<IExam>
 */
export const getExamById = async (
  examId: string
): Promise<AxiosResponse<IExam>> => {
  return await BaseApi.getRequest(`/school/teacher/exam/${examId}`);
};

/**
 * ✅ Update Exam
 * Sends a PUT request to update an existing exam
 * @param examId - Unique exam identifier
 * @param data - Partial data for updating the exam
 * @returns AxiosResponse<IExam>
 */
export const updateExam = async (
  examId: string,
  data: IUpdateExam & { subjectId?: string }
): Promise<AxiosResponse<IExam>> => {
  const payload: any = {};
  if (data.title) payload.title = data.title;
  if (data.startTime) payload.startTime = (data.startTime instanceof Date ? data.startTime.toISOString() : data.startTime);
  if (data.endTime) payload.endTime = (data.endTime instanceof Date ? data.endTime.toISOString() : data.endTime);
  if (data.classId) payload.classId = data.classId;
  if (data.passMark !== undefined) payload.passMark = data.passMark;
  if (data.totalMarks !== undefined) payload.totalMarks = data.totalMarks;
  if (data.duration !== undefined) payload.duration = data.duration;
  if (data.roomNumber !== undefined) payload.roomNumber = data.roomNumber;
  if (data.subjectId) payload.subjectId = data.subjectId;
  return await BaseApi.putRequest(`/school/teacher/exam/${examId}`, payload);
};

/**
 * ✅ Delete Exam
 * Sends a DELETE request to delete a specific exam
 * @param examId - Unique exam identifier
 * @returns AxiosResponse<IExam>
 */
export const deleteExam = async (
  examId: string
): Promise<AxiosResponse<IExam>> => {
  return await BaseApi.deleteRequest(`/school/teacher/exam/${examId}`);
};
