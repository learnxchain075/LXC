import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { Ilesson } from "../types/teacher/lessonService";


/**
 * ✅ Create Lesson
 * Sends a POST request to create a new lesson
 * @param data - Lesson data (name, day, startTime, endTime, subjectId, classId, tecaherId)
 * @returns AxiosResponse<Ilesson>
 */
export const createLesson = async (
  data: Ilesson
): Promise<AxiosResponse<Ilesson>> => {
  return await BaseApi.postRequest(`/teacher/lesson`, {
    name: data.name,
    day: data.day,
    startTime: data.startTime,
    endTime: data.endTime,
    subjectId: data.subjectId,
    classId: data.classId,
    teacherId: data.teacherId,
  });
};

/**
 * ✅ Get All Lessons
 * Sends a GET request to fetch all lessons
 * @returns AxiosResponse<Ilesson[]>
 */
export const getLessons = async (): Promise<AxiosResponse<Ilesson[]>> => {
  return await BaseApi.getRequest(`/teacher/lesson`);
};

/**
 * ✅ Get All Lessons for School
 * Sends a GET request to fetch all lessons for a school
 * @param schoolId - School ID
 * @returns AxiosResponse<Ilesson[]>
 */
export const getLessonsBySchool = async (
  schoolId: string
): Promise<AxiosResponse<Ilesson[]>> => {
  return await BaseApi.getRequest(`/school/teacher/lesson/${schoolId}`);
};

/**
 * ✅ Get Lesson By ID
 * Sends a GET request to fetch a specific lesson using its ID
 * @param lessonId - Unique lesson identifier
 * @returns AxiosResponse<Ilesson>
 */
export const getLessonById = async (
  lessonId: string
): Promise<AxiosResponse<Ilesson>> => {
  return await BaseApi.getRequest(`/teacher/lesson/${lessonId}`);
};
export const getLessonByteacherId = async (
  lessonId: string
): Promise<AxiosResponse<Ilesson>> => {
  return await BaseApi.getRequest(`/school/teacher/lesson/${lessonId}`);
};

/**
 * ✅ Update Lesson
 * Sends a PUT request to update an existing lesson
 * @param lessonId - Unique lesson identifier
 * @param data - Partial data to update the lesson
 * @returns AxiosResponse<Ilesson>
 */
export const updateLesson = async (
  lessonId: string,
  data: Partial<Ilesson>
): Promise<AxiosResponse<Ilesson>> => {
  return await BaseApi.putRequest(`/teacher/lesson/${lessonId}`, {
    ...(data.name && { name: data.name }),
    ...(data.day && { day: data.day }),
    ...(data.startTime && { startTime: data.startTime.toISOString() }),
    ...(data.endTime && { endTime: data.endTime.toISOString() }),
    ...(data.subjectId && { subjectId: data.subjectId }),
    ...(data.classId && { classId: data.classId }),
    ...(data.teacherId && { tecaherId: data.teacherId }),
  });
};

/**
 * ✅ Delete Lesson
 * Sends a DELETE request to remove a lesson by ID
 * @param lessonId - Unique lesson identifier
 * @returns AxiosResponse<Ilesson>
 */
export const deleteLesson = async (
  lessonId: string
): Promise<AxiosResponse<Ilesson>> => {
  return await BaseApi.deleteRequest(`/teacher/lesson/${lessonId}`);
};
