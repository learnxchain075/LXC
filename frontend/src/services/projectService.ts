import BaseApi from './BaseApi';

export const getProjects = () => BaseApi.getRequest('/projects');
export const createProject = (data: any) => BaseApi.postRequest('/project', data);
export const updateProject = (id: string, data: any) => BaseApi.putRequest(`/project/${id}`, data);
export const deleteProject = (id: string) => BaseApi.deleteRequest(`/project/${id}`);

export const getTasks = (projectId?: string) =>
  BaseApi.getRequest(`/tasks${projectId ? `?projectId=${projectId}` : ''}`);
export const createTask = (data: any) => BaseApi.postRequest('/task', data);
export const updateTask = (id: string, data: any) => BaseApi.putRequest(`/task/${id}`, data);
export const deleteTask = (id: string) => BaseApi.deleteRequest(`/task/${id}`);
export const updateTaskStatus = (id: string, data: any) =>
  BaseApi.patchRequest(`/task/${id}/status`, data);
export const addComment = (id: string, data: any) =>
  BaseApi.postRequest(`/task/${id}/comment`, data);
