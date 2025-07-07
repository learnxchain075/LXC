import BaseApi from "./BaseApi";

export const getProjects = () => BaseApi.getRequest("/projects");
export const createProject = (data: any) =>
  BaseApi.postRequest("/project", data);
export const updateProject = (id: string, data: any) =>
  BaseApi.putRequest(`/project/${id}`, data);
export const deleteProject = (id: string) =>
  BaseApi.deleteRequest(`/project/${id}`);

export const getTasks = (projectId?: string, sprintId?: string | null) => {
  const params = new URLSearchParams();
  if (projectId) params.append("projectId", projectId);
  if (typeof sprintId !== "undefined") {
    params.append("sprintId", sprintId === null ? "null" : sprintId);
  }
  const query = params.toString();
  return BaseApi.getRequest(`/tasks${query ? `?${query}` : ""}`);
};
export const getTask = (id: string) => BaseApi.getRequest(`/task/${id}`);
export const getTaskTimeline = (id: string) => BaseApi.getRequest(`/task/${id}/timeline`);
export const createTask = (data: any) => BaseApi.postRequest("/task", data);
export const updateTask = (id: string, data: any) =>
  BaseApi.putRequest(`/task/${id}`, data);
export const deleteTask = (id: string) => BaseApi.deleteRequest(`/task/${id}`);
export const updateTaskStatus = (id: string, data: any) =>
  BaseApi.patchRequest(`/task/${id}/status`, data);
export const addComment = (id: string, data: any) =>
  BaseApi.postRequest(`/task/${id}/comment`, data);
export const updateComment = (id: string, data: any) =>
  BaseApi.putRequest(`/comment/${id}`, data);
export const deleteComment = (id: string) =>
  BaseApi.deleteRequest(`/comment/${id}`);
export const addAttachment = (id: string, data: FormData) =>
  BaseApi.postRequest(`/task/${id}/attachment`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const addGitHubRepo = (projectId: string, data: any) =>
  BaseApi.postRequest(`/project/${projectId}/github-repo`, data);

export const createGitHubBranch = (taskId: string, data: any) =>
  BaseApi.postRequest(`/task/${taskId}/github-branch`, data);

export const getSprints = (projectId: string) =>
  BaseApi.getRequest(`/project/${projectId}/sprints`);

export const createSprint = (projectId: string, data: any) =>
  BaseApi.postRequest(`/project/${projectId}/sprints`, data);

export const updateSprint = (id: string, data: any) =>
  BaseApi.putRequest(`/sprint/${id}`, data);

export const deleteSprint = (id: string) =>
  BaseApi.deleteRequest(`/sprint/${id}`);

export const assignTaskSprint = (taskId: string, data: any) =>
  BaseApi.patchRequest(`/task/${taskId}/sprint`, data);

export const getWorkflow = (projectId: string) =>
  BaseApi.getRequest(`/project/${projectId}/workflow`);

export const getEpics = (projectId?: string) =>
  BaseApi.getRequest(`/epics${projectId ? `?projectId=${projectId}` : ""}`);
export const createEpic = (data: any) => BaseApi.postRequest("/epic", data);
export const updateEpic = (id: string, data: any) =>
  BaseApi.putRequest(`/epic/${id}`, data);
export const deleteEpic = (id: string) => BaseApi.deleteRequest(`/epic/${id}`);
