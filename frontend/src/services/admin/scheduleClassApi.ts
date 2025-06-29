import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";

// ------------------- Interfaces -------------------

export interface IScheduleClass {
  id: string;
  name?: string;
  type?: string;
  startTime: string;
  endTime: string;
  status: "Active" | "Inactive";
  schoolId: string;
  classId?: string;
  sectionId?: string;
  subjectId?: string;
  teacherId?: string;
  dayOfWeek?: string;
  day?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateScheduleClass {
  name?: string;
  type?: string;
  startTime: string;
  endTime: string;
  status: "Active" | "Inactive";
  schoolId: string;
  classId?: string;
  sectionId?: string;
  subjectId?: string;
  teacherId?: string;
  dayOfWeek?: string;
  day?: string;
}

export interface IUpdateScheduleClass extends Partial<ICreateScheduleClass> {
  id: string;
}

// ------------------- API Functions -------------------

/**
 * ✅ Get All Schedule Classes (using school/teacher/lesson/:schoolId endpoint)
 * Fetches all lessons for a school
 * @returns Promise<AxiosResponse<IScheduleClass[]>>
 */
export const getAllScheduleClasses = async (
  schoolId: string
): Promise<AxiosResponse<IScheduleClass[]>> => {
  return await BaseApi.getRequest(`/school/teacher/lesson/${schoolId}`);
};

/**
 * ✅ Get Schedule Class by ID (using lesson endpoints)
 * Fetches a specific lesson by ID
 * @param id - Schedule Class ID
 * @returns Promise<AxiosResponse<IScheduleClass>>
 */
export const getScheduleClassById = async (
  id: string
): Promise<AxiosResponse<IScheduleClass>> => {
  return await BaseApi.getRequest(`/teacher/lesson/${id}`);
};

/**
 * ✅ Create Schedule Class (using lesson endpoints)
 * Creates a new lesson
 * @param data - Schedule class data
 * @returns Promise<AxiosResponse<IScheduleClass>>
 */
export const createScheduleClass = async (
  data: ICreateScheduleClass
): Promise<AxiosResponse<IScheduleClass>> => {
  return await BaseApi.postRequest("/teacher/lesson", data);
};

/**
 * ✅ Update Schedule Class (using lesson endpoints)
 * Updates an existing lesson
 * @param id - Schedule Class ID
 * @param data - Updated schedule class data
 * @returns Promise<AxiosResponse<IScheduleClass>>
 */
export const updateScheduleClass = async (
  id: string,
  data: IUpdateScheduleClass
): Promise<AxiosResponse<IScheduleClass>> => {
  return await BaseApi.putRequest(`/teacher/lesson/${id}`, data);
};

/**
 * ✅ Delete Schedule Class (using lesson endpoints)
 * Deletes a lesson
 * @param id - Schedule Class ID
 * @returns Promise<AxiosResponse<any>>
 */
export const deleteScheduleClass = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/teacher/lesson/${id}`);
};

/**
 * ✅ Get Schedule Classes by Type (client-side filtering)
 * Filters schedule classes by type on the client side
 * @param schoolId - School ID
 * @param type - Schedule type
 * @returns Promise<AxiosResponse<IScheduleClass[]>>
 */
export const getScheduleClassesByType = async (
  schoolId: string,
  type: string
): Promise<AxiosResponse<IScheduleClass[]>> => {
  const response = await BaseApi.getRequest(`/teacher/lesson`);
  const filteredData = response.data.filter((item: any) => item.type === type);
  return { ...response, data: filteredData };
};

/**
 * ✅ Get Schedule Classes by Status (client-side filtering)
 * Filters schedule classes by status on the client side
 * @param schoolId - School ID
 * @param status - Schedule status
 * @returns Promise<AxiosResponse<IScheduleClass[]>>
 */
export const getScheduleClassesByStatus = async (
  schoolId: string,
  status: "Active" | "Inactive"
): Promise<AxiosResponse<IScheduleClass[]>> => {
  const response = await BaseApi.getRequest(`/teacher/lesson`);
  const filteredData = response.data.filter((item: any) => item.status === status);
  return { ...response, data: filteredData };
};

/**
 * ✅ Filter Schedule Classes by Date Range (client-side filtering)
 * Filters schedule classes within a date range on the client side
 * @param schoolId - School ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Promise<AxiosResponse<IScheduleClass[]>>
 */
export const filterScheduleClassesByDate = async (
  schoolId: string,
  startDate: string,
  endDate: string
): Promise<AxiosResponse<IScheduleClass[]>> => {
  const response = await BaseApi.getRequest(`/teacher/lesson`);
  const filteredData = response.data.filter((item: any) => {
    const itemDate = new Date(item.createdAt);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return itemDate >= start && itemDate <= end;
  });
  return { ...response, data: filteredData };
}; 