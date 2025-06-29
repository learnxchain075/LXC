import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { Isubject } from "../types/teacher/subjectService";


/**
 * ✅ Create Subject
 * Sends a POST request to create a new subject
 * @param data - Subject data (name)
 * @returns AxiosResponse<Isubject>
 */
export const createSubject = async (
  data: Isubject
): Promise<AxiosResponse<Isubject>> => {
  return await BaseApi.postRequest(`/teacher/subject`, {
    name: data.name,
    code: data.code,
    type: data.type,
    classId: data.classId,
  });
};

/**
 * ✅ Get All Subjects
 * Fetches all subjects
 * @returns AxiosResponse<Isubject[]>
 */
export const getSubjects = async (): Promise<AxiosResponse<Isubject[]>> => {
  return await BaseApi.getRequest(`/teacher/subject`);
};

/**
 * ✅ Get Subject By ID
 * Fetches a subject using its unique ID
 * @param subjectId - Unique subject identifier
 * @returns AxiosResponse<Isubject>
 */
export const getSubjectById = async (
  subjectId: string
): Promise<AxiosResponse<Isubject>> => {
  return await BaseApi.getRequest(`/teacher/subject/${subjectId}`);
};

export const getSubjectByClassBySchoold = async (
  schoolId: string,
  classId: string
): Promise<AxiosResponse<Isubject>> => {
  return await BaseApi.getRequest(`/schools/${schoolId}/classes/${classId}/subjects`);
};


export const getSubjectByClassId= async (

  classId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/class/${classId}/subjects`);
};

export const getSubjectBySchoold = async (
  schoolId: string,
  
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/${schoolId}/subjects`);
};



/**
 * ✅ Update Subject
 * Updates an existing subject
 * @param subjectId - Unique subject identifier
 * @param data - Partial subject data to update
 * @returns AxiosResponse<Isubject>
 */
export const updateSubject = async (
  subjectId: string,
  data: Partial<Isubject>
): Promise<AxiosResponse<Isubject>> => {
  return await BaseApi.putRequest(`/teacher/subject/${subjectId}`, {
    ...(data.name && { name: data.name }),
  });
};

/**
 * ✅ Delete Subject
 * Deletes a subject by its ID
 * @param subjectId - Unique subject identifier
 * @returns AxiosResponse<Isubject>
 */
export const deleteSubject = async (
  subjectId: string
): Promise<AxiosResponse<Isubject>> => {
  return await BaseApi.deleteRequest(`/teacher/subject/${subjectId}`);
};
