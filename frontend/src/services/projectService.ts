import BaseApi from "./BaseApi";

export const getProjects = () => BaseApi.getRequest("/projects");
export const createProject = (data: any) =>
  BaseApi.postRequest("/project", data);
export const updateProject = (id: string, data: any) =>
  BaseApi.putRequest(`/project/${id}`, data);
export const deleteProject = (id: string) =>
  BaseApi.deleteRequest(`/project/${id}`);

export interface TaskFilters {
  projectId?: string;
  sprintId?: string | null;
  assigneeId?: string;
  status?: string;
  issueType?: string;
  priority?: string;
  label?: string;
  search?: string;
}

export const getTasks = (filters: TaskFilters = {}) => {
  const params = new URLSearchParams();
  if (filters.projectId) params.append("projectId", filters.projectId);
  if (typeof filters.sprintId !== "undefined") {
    params.append(
      "sprintId",
      filters.sprintId === null ? "null" : filters.sprintId,
    );
  }
  if (filters.assigneeId) params.append("assigneeId", filters.assigneeId);
  if (filters.status) params.append("status", filters.status);
  if (filters.issueType) params.append("issueType", filters.issueType);
  if (filters.priority) params.append("priority", filters.priority);
  if (filters.label) params.append("label", filters.label);
  if (filters.search) params.append("search", filters.search);
  const query = params.toString();
  return BaseApi.getRequest(`/tasks${query ? `?${query}` : ""}`);
};
export const getCalendarTasks = (projectId?: string, userId?: string) => {
  const params = new URLSearchParams();
  if (projectId) params.append("projectId", projectId);
  if (userId) params.append("userId", userId);
  const query = params.toString();
  return BaseApi.getRequest(`/tasks/calendar${query ? `?${query}` : ""}`);
};
export const getTask = (id: string) => BaseApi.getRequest(`/task/${id}`);
export const getTaskTimeline = (id: string) =>
  BaseApi.getRequest(`/task/${id}/timeline`);
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
    headers: { "Content-Type": "multipart/form-data" },
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

export const getSprintBurndown = (id: string) =>
  BaseApi.getRequest(`/sprint/${id}/burndown`);

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

export const updateWorkflowApi = (projectId: string, data: any) =>
  BaseApi.putRequest(`/project/${projectId}/workflow`, data);

export const addProjectMemberApi = (projectId: string, data: any) =>
  BaseApi.postRequest(`/project/${projectId}/users`, data);

export const removeProjectMemberApi = (projectId: string, userId: string) =>
  BaseApi.deleteRequest(`/project/${projectId}/users/${userId}`);

export const getProjectRole = (projectId: string) =>
  BaseApi.getRequest(`/project/${projectId}/role`);

export const getLabels = (projectId: string) =>
  BaseApi.getRequest(`/project/${projectId}/labels`);
export const createLabel = (projectId: string, data: any) =>
  BaseApi.postRequest(`/project/${projectId}/labels`, data);
export const updateLabel = (id: string, data: any) =>
  BaseApi.putRequest(`/label/${id}`, data);
export const deleteLabel = (id: string) => BaseApi.deleteRequest(`/label/${id}`);

export const watchTask = (taskId: string, userId: string) =>
  BaseApi.postRequest(`/task/${taskId}/watch`, { userId });
export const unwatchTask = (taskId: string, userId: string) =>
  BaseApi.deleteRequest(`/task/${taskId}/watch`, { data: { userId } });
export const getNotifications = (userId: string) =>
  BaseApi.getRequest(`/users/${userId}/notifications`);
