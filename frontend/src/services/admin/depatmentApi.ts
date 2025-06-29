import BaseApi from "../BaseApi";
import { IDepartmentForm } from "../types/admin/hrm/departmentService";
import { AxiosResponse } from "axios";

// 🔸 Get all departments for a school
export const getDepartments = async (schoolId: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/schools/${schoolId}/departments`);
};

// 🔸 Get department by ID
export const getDepartmentById = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/departments/${id}`);
};

// 🔸 Create a new department
export const createDepartment = async (
  schoolId: string,
  data: IDepartmentForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest(`/schools/departments`, data);
};

// 🔸 Update department
export const updateDepartment = async (
  id: string,
  data: IDepartmentForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/departments/${id}`, data as any);
};

// 🔸 Delete department
export const deleteDepartment = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/departments/${id}`);
};

// 🔸 Assign a user to a department
export const assignUserToDepartment = async (
  departmentId: string,
  userId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest(`/departments/${departmentId}/users/${userId}`);
};

// 🔸 Remove a user from a department
export const removeUserFromDepartment = async (
  departmentId: string,
  userId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/departments/${departmentId}/users/${userId}`);
};

// 🔸 Get all users of a department
export const getDepartmentUsers = async (departmentId: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/departments/${departmentId}/users`);
};




// // Department Routes
// router.get('/schools/:schoolId/departments', getDepartments);
// router.get('/departments/:id', getDepartmentById);
// router.post('/schools/:schoolId/departments', createDepartment);
// router.put('/departments/:id', updateDepartment);
// router.delete('/departments/:id', deleteDepartment);

// // User Assignment Routes
// router.post('/departments/:departmentId/users/:userId', assignUserToDepartment);
// router.delete('/departments/:departmentId/users/:userId', removeUserFromDepartment);
// router.get('/departments/:departmentId/users', getDepartmentUsers);