// import { AxiosResponse } from "axios";
// import BaseApi from "../BaseApi";
// import { Iassignment } from "../types/teacher/assignmentService";

// /**
//  * ✅ Create Assignment
//  * Sends a POST request to create a new assignment
//  * @param data - Assignment data (title, description, subjectId, classId, dueDate, lessonId)
//  * @returns AxiosResponse<Iassignment>
//  */
// export const createAssignment = async (
//   data: Iassignment
// ): Promise<AxiosResponse<Iassignment>> => {
//   return await BaseApi.postRequest(`/school/teacher/assignment`, {
//     title: data.title,
//     description: data.description,
//     subjectId: data.subjectId,
//     classId: data.classId,
//     dueDate: data.dueDate,
//     lessonId: data.lessonId,
//     attachment: data.attachment ? data.attachment : undefined,
//   });
// };

// /**
//  * ✅ Get All Assignments
//  * Sends a GET request to retrieve all assignments
//  * @returns AxiosResponse<Iassignment[]>
//  */
// export const getAssignments = async (): Promise<AxiosResponse<Iassignment[]>> => {
//   return await BaseApi.getRequest(`/school/teacher/assignment`);
// };

// /**
//  * ✅ Get Assignment By ID
//  * Sends a GET request to fetch a single assignment by its ID
//  * @param assignmentId - Unique identifier of the assignment
//  * @returns AxiosResponse<Iassignment>
//  */
// export const getAssignmentById = async (
//   assignmentId: string
// ): Promise<AxiosResponse<Iassignment>> => {
//   return await BaseApi.getRequest(`/school/teacher/assignment/${assignmentId}`);
// };

// /**
//  * ✅ Update Assignment
//  * Sends a PUT request to update specific fields of an assignment
//  * @param assignmentId - Unique identifier of the assignment
//  * @param data - Partial assignment data to update
//  * @returns AxiosResponse<Iassignment>
//  */
// export const updateAssignment = async (
//   assignmentId: string,
//   data: Partial<Iassignment>
// ): Promise<AxiosResponse<Iassignment>> => {
//   return await BaseApi.putRequest(`/school/teacher/assignment/${assignmentId}`, {
//     ...(data.title && { title: data.title }),
//     ...(data.description && { description: data.description }),
//     ...(data.subjectId && { subjectId: data.subjectId }),
//     ...(data.classId && { classId: data.classId }),
//     ...(data.dueDate && { dueDate: data.dueDate.toISOString() }),
//     ...(data.lessonId && { lessonId: data.lessonId }),
//   });
// };

// /**
//  * ✅ Delete Assignment
//  * Sends a DELETE request to remove an assignment by its ID
//  * @param assignmentId - Unique identifier of the assignment
//  * @returns AxiosResponse<Iassignment>
//  */
// export const deleteAssignment = async (
//   assignmentId: string
// ): Promise<AxiosResponse<Iassignment>> => {
//   return await BaseApi.deleteRequest(`/school/teacher/assignment/${assignmentId}`);
// };


import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { Iassignment } from "../types/teacher/assignmentService";

// ✅ Create Assignment (with file upload)
export const createAssignment = async (
  data: Iassignment
): Promise<AxiosResponse<Iassignment>> => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("subjectId", data.subjectId);
  formData.append("classId", data.classId);
  formData.append("dueDate", data.dueDate.toISOString());
  formData.append("lessonId", data.lessonId);
  formData.append("sectionId", data.sectionId);
  if (data.attachment) {
    formData.append("attachment", data.attachment); 
  }

  return await BaseApi.postRequest(`/school/teacher/assignment`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ Get All Assignments
export const getAssignments = async (): Promise<AxiosResponse<Iassignment[]>> => {
  return await BaseApi.getRequest(`/school/teacher/assignment`);
};

// ✅ Get Assignment By ID
export const getAssignmentById = async (
  assignmentId: string
): Promise<AxiosResponse<Iassignment>> => {
  return await BaseApi.getRequest(`/school/teacher/assignment/${assignmentId}`);
};

// ✅ Update Assignment (with file upload support)
export const updateAssignment = async (
  assignmentId: string,
  data: Partial<Iassignment>
): Promise<AxiosResponse<Iassignment>> => {
  const formData = new FormData();

  if (data.title) formData.append("title", data.title);
  if (data.description) formData.append("description", data.description);
  if (data.subjectId) formData.append("subjectId", data.subjectId);
  if (data.classId) formData.append("classId", data.classId);
  if (data.dueDate) formData.append("dueDate", data.dueDate.toISOString());
  if (data.lessonId) formData.append("lessonId", data.lessonId);
  if (data.attachment) formData.append("attachment", data.attachment);

  return await BaseApi.putRequest(`/school/teacher/assignment/${assignmentId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ Delete Assignment
export const deleteAssignment = async (
  assignmentId: string
): Promise<AxiosResponse<Iassignment>> => {
  return await BaseApi.deleteRequest(`/school/teacher/assignment/${assignmentId}`);
};
