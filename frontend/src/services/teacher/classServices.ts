import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { Iclassform } from "../types/teacher/classService";
import { IExamScheduleTime } from "../types/teacher/examScheduleTime";
import { IExamAttendance } from "../types/teacher/examattendance";
// import { Iclassform } from "../types/class";

/**
 * ✅ Create Class
 * Sends a POST request to create a new class
 * @param data - Class data (name, capacity, schoolId)
 * @returns AxiosResponse<Iclassform>
 */
export const createClass = async (
  data: Iclassform
): Promise<AxiosResponse<Iclassform>> => {
  return await BaseApi.postRequest(`/teacher/class`, {
    name: data.name,
    capacity: data.capacity,
    schoolId: data.schoolId,
    section: data.section,
  });
};

/**
 * ✅ Get All Classes
 * Sends a GET request to fetch all classes
 * @returns AxiosResponse<Iclassform[]>
 */
export const getClasses = async (): Promise<AxiosResponse<Iclassform[]>> => {
  return await BaseApi.getRequest(`/school/classes`);
};

/**
 * ✅ Get Class By ID
 * Sends a GET request to fetch a single class using its ID
 * @param classId - Unique class identifier
 * @returns AxiosResponse<Iclassform>
 */
export const getClassById = async (
  classId: string
): Promise<AxiosResponse<Iclassform>> => {
  return await BaseApi.getRequest(`/teacher/class/${classId}`);
};

/**
 * ✅ Get Classes by School ID
 * Sends a GET request to fetch all classes for a specific school
 * @param schoolId - School ID
 * @returns AxiosResponse<any>
 */
export const getClassByschoolId = async (
  schoolId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/classes/${schoolId}`);
};

/**
 * ✅ Update Class
 * Sends a PUT request to update a class by its ID
 * @param classId - Unique class identifier
 * @param data - Partial class data to update
 * @returns AxiosResponse<Iclassform>
 */
export const updateClass = async (
  classId: string,
  data: Partial<Iclassform>
): Promise<AxiosResponse<Iclassform>> => {
  return await BaseApi.putRequest(`/teacher/class/${classId}`, {
    ...(data.name && { name: data.name }),
    ...(data.capacity && { capacity: data.capacity }),
    ...(data.schoolId && { schoolId: data.schoolId }),
  });
};

/**
 * ✅ Delete Class
 * Sends a DELETE request to delete a class by ID
 * @param classId - Unique class identifier
 * @returns AxiosResponse<Iclassform>
 */
export const deleteClass = async (
  classId: string
): Promise<AxiosResponse<Iclassform>> => {
  return await BaseApi.deleteRequest(`/teacher/class/${classId}`);
};

/**
 * ✅ Get Classes by Teacher ID
 * Sends a GET request to fetch all classes assigned to a specific teacher
 * @param teacherId - Unique teacher identifier
 * @returns AxiosResponse<Iclassform[]>
 */
export const getClassesByTeacherId = async (
  teacherId: string
): Promise<AxiosResponse<Iclassform[]>> => {
  return await BaseApi.getRequest(`/teachers/${teacherId}/classes`);
};

/**
 * ✅ Assign Teacher to Class
 * Sends a POST request to assign a teacher to a class
 * @param data - Assignment data
 */
export const postassignTeacherToaClass = async (
  data: any
): Promise<AxiosResponse<Iclassform[]>> => {
  return await BaseApi.postRequest(`/teacher/assign-teacher`, data);
};

/**
 * ✅ Assign Student to Class
 * Sends a POST request to assign a student to a class
 */
export const postassignStudentToaClass = async (
  data: any
): Promise<AxiosResponse<Iclassform[]>> => {
  return await BaseApi.postRequest(`/student/assign-student`, data);
};

/**
 * ✅ Get All Teachers in a Class
 * Sends a GET request to fetch all teachers assigned to a class
 * @param classId - Class ID
 */
export const getAllTeacherInAclass = async (
  classId: string
): Promise<AxiosResponse<Iclassform[]>> => {
  return await BaseApi.getRequest(`/teacher/${classId}/teachers`);
};

/**
 * ✅ Get Teacher Assignments by School
 * Sends a GET request to fetch all teacher assignments for a school
 * @param schoolId - School ID
 */
export const getTeacherAssignmentsBySchoolId = async (
  schoolId: string
): Promise<AxiosResponse<Iclassform[]>> => {
  return await BaseApi.getRequest(`/assigned-teachers/${schoolId}`);
};

/**
 * ✅ Get All Students in a Class
 * Sends a GET request to fetch all students in a class
 * @param classId - Class ID
 */
export const getAllStudentsInAclass = async (
  classId: string
): Promise<AxiosResponse<any[]>> => {
  return await BaseApi.getRequest(`/teacher/class/${classId}/students`);
};

/**
 * ✅ Schedule Exam
 * Sends a POST request to schedule an exam
 */
export const scheduleExam = async (
  data: any
): Promise<AxiosResponse<IExamScheduleTime[]>> => {
  return await BaseApi.postRequest(`/school/teacher/exam/schedule`, data);
};

/**
 * ✅ Mark Exam Attendance
 * Sends a POST request to mark exam attendance
 */
export const examAttendance = async (
  data: any
): Promise<AxiosResponse<IExamAttendance[]>> => {
  return await BaseApi.postRequest(`/school/teacher/exam/attendance`, data);
};

/**
 * ✅ Get Exam Attendance
 * Sends a GET request to fetch exam attendance
 * @param id - Exam ID
 */
export const getExamAttendance = async (
  id: string
): Promise<AxiosResponse<IExamAttendance[]>> => {
  return await BaseApi.getRequest(`/school/teacher/exam/attendance/${id}`);
};

/**
 * ✅ Get Exam Attendance by ID
 * Sends a GET request to fetch exam attendance by ID
 * @param id - Attendance ID
 */
export const getExamAttendanceById = async (
  id: string
): Promise<AxiosResponse<IExamAttendance[]>> => {
  return await BaseApi.getRequest(`/teacher/exam/attendance/${id}`);
};

export const updateTeacherAssignment = async (assignmentId: string, data: any): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/teacher/assign-teacher/${assignmentId}`, data);
};

export const deleteTeacherAssignment = async (assignmentId: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/teacher/assign-teacher/${assignmentId}`);
};