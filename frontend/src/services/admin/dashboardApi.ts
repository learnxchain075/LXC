import BaseApi from "../BaseApi";
import { AxiosResponse, AxiosError } from "axios";
import { IAdminDashboardData } from "../types/admin/dashboardService";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface DashboardFilters {
  attendanceDate?: string;
  classFilter?: string;
  activityFilter?: string;
  todoFilter?: string;
  feesFilter?: string;
  leaveFilter?: string;
  performanceMonth?: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handleApiError = (error: any, endpoint: string) => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    switch (status) {
      case 401:
        throw new Error('Unauthorized access. Please login again.');
      case 403:
        throw new Error('You do not have permission to access this resource.');
      case 404:
        throw new Error(`Resource not found: ${endpoint}`);
      case 429:
        throw new Error('Too many requests. Please try again later.');
      case 500:
        throw new Error('Internal server error. Please try again later.');
      default:
        throw new Error(`Failed to fetch data: ${message}`);
    }
  }
  throw error;
};

const retryOperation = async <T>(
  operation: () => Promise<T>,
  endpoint: string,
  retries = MAX_RETRIES
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0 && (error instanceof AxiosError && error.response?.status !== 401)) {
      await delay(RETRY_DELAY);
      return retryOperation(operation, endpoint, retries - 1);
    }
    throw handleApiError(error, endpoint);
  }
};

export const getAdminDashboardData = async (filters: DashboardFilters = {}): Promise<AxiosResponse<IAdminDashboardData>> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  
  const query = params.toString() ? `?${params.toString()}` : '';
  const endpoint = `/school-admin/dashboard${query}`;
  
  return retryOperation(
    () => BaseApi.getRequest(endpoint),
    endpoint
  );
};

export const getAttendanceData = async (attendanceDate?: string) => {
  const endpoint = `/school-admin/dashboard/attendance${attendanceDate ? `?date=${attendanceDate}` : ''}`;
  const response = await retryOperation(
    () => BaseApi.getRequest(endpoint),
    endpoint
  );
  return response.data.attendance;
};

export const getActivityData = async (activityFilter?: string) => {
  const endpoint = `/school-admin/dashboard/activities${activityFilter ? `?filter=${activityFilter}` : ''}`;
  const response = await retryOperation(
    () => BaseApi.getRequest(endpoint),
    endpoint
  );
  return response.data.studentActivities;
};

export const getTodoData = async (todoFilter?: string) => {
  const endpoint = `/school-admin/dashboard/todos${todoFilter ? `?filter=${todoFilter}` : ''}`;
  const response = await retryOperation(
    () => BaseApi.getRequest(endpoint),
    endpoint
  );
  return response.data.todos;
};

export const getPerformanceData = async (performanceMonth?: string, classFilter?: string) => {
  const params = new URLSearchParams();
  if (performanceMonth) params.append('month', performanceMonth);
  if (classFilter) params.append('class', classFilter);
  
  const endpoint = `/school-admin/dashboard/performance${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await retryOperation(
    () => BaseApi.getRequest(endpoint),
    endpoint
  );
  return response.data.performanceMetrics;
};

export const getClassRoutineData = async () => {
  const endpoint = '/school-admin/dashboard/routines';
  const response = await retryOperation(
    () => BaseApi.getRequest(endpoint),
    endpoint
  );
  return response.data.classRoutines;
};

export const getdahbaordadminData = async () => {
  const endpoint = '/school-admin/dashboard';
  const response = await retryOperation(
    () => BaseApi.getRequest(endpoint),
    endpoint
  );
  return response.data;
};
export const getUpcomingEventsData = async () => {
  const endpoint = '/school-admin/dashboard/events';
  const response = await retryOperation(
    () => BaseApi.getRequest(endpoint),
    endpoint
  );
  return response.data.upcomingEvents;
};

export const getLeaveRequestsData = async (leaveFilter?: string) => {
  const endpoint = `/school-admin/dashboard/leaves${leaveFilter ? `?filter=${leaveFilter}` : ''}`;
  const response = await retryOperation(
    () => BaseApi.getRequest(endpoint),
    endpoint
  );
  return response.data.leaveRequests;
};

export const getNoticesData = async () => {
  const endpoint = '/school-admin/dashboard/notices';
  const response = await retryOperation(
    () => BaseApi.getRequest(endpoint),
    endpoint
  );
  return response.data.notices;
};

export const getTopSubjectsData = async (classFilter?: string) => {
  const endpoint = `/school-admin/dashboard/subjects${classFilter ? `?class=${classFilter}` : ''}`;
  const response = await retryOperation(
    () => BaseApi.getRequest(endpoint),
    endpoint
  );
  return response.data.topSubjects;
};

export const getEarningsData = async () => {
  const endpoint = '/school-admin/dashboard/earnings';
  const response = await retryOperation(
    () => BaseApi.getRequest(endpoint),
    endpoint
  );
  return response.data.earnings;
};

export const getExpensesData = async () => {
  const endpoint = '/school-admin/dashboard/expenses';
  const response = await retryOperation(
    () => BaseApi.getRequest(endpoint),
    endpoint
  );
  return response.data.expenses;
};

export const getFeesCollectionChartData = async (feesFilter?: string) => {
  const endpoint = `/school-admin/dashboard/fees${feesFilter ? `?filter=${feesFilter}` : ''}`;
  const response = await retryOperation(
    () => BaseApi.getRequest(endpoint),
    endpoint
  );
  return response.data.feesCollectionChart;
};

export const getBestPerformerData = async () => {
  const endpoint = '/school-admin/dashboard/best-performers';
  const response = await retryOperation(
    () => BaseApi.getRequest(endpoint),
    endpoint
  );
  return response.data.bestPerformer;
};

export const getStarStudentsData = async () => {
  const endpoint = '/school-admin/dashboard/star-students';
  const response = await retryOperation(
    () => BaseApi.getRequest(endpoint),
    endpoint
  );
  return response.data.starStudents;
};

export const getKeyMetricsData = async () => {
  const endpoint = '/school-admin/dashboard/metrics';
  const response = await retryOperation(
    () => BaseApi.getRequest(endpoint),
    endpoint
  );
  return response.data.keyMetrics;
}; 