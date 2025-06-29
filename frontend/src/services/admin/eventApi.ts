import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IEventForm } from "../types/admin/eventService";

/**
 * ✅ Create Event
 * Creates a new event with file upload support
 * @param eventData Event data including attachments
 */
export const createEvent = async (
  eventData: IEventForm
): Promise<AxiosResponse<{ success: boolean; data: IEventForm }>> => {
  const formData = new FormData();
  formData.append("title", eventData.title);
  if (eventData.description) formData.append("description", eventData.description);
  formData.append("start", eventData.start);
  formData.append("end", eventData.end);
  formData.append("category", eventData.category);
  if (eventData.attachment) formData.append("attachment", eventData.attachment);
  formData.append("targetAudience", eventData.targetAudience || "ALL");
  formData.append("schoolId", eventData.schoolId);
  (eventData.roles || []).forEach((r: any) => formData.append("roleIds[]", r.id));
  (eventData.sections || []).forEach((s: any) => formData.append("sectionIds[]", s.id));
  (eventData.Class || []).forEach((c: any) => formData.append("classIds[]", c.id));
  try {
    return await BaseApi.postRequest("/admin/school/event-create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error: any) {
    return { data: { success: false, message: error?.response?.data?.message || "Failed to create event" } } as any;
  }
};

/**
 * ✅ Get All Events
 * Fetches all events
 */
export const getAllEvents = async (): Promise<
  AxiosResponse<{ success: boolean; data: IEventForm[] }>
> => {
  try {
    return await BaseApi.getRequest("/admin/events");
  } catch (error: any) {
    return { data: { success: false, message: error?.response?.data?.message || "Failed to fetch events" } } as any;
  }
};

/**
 * ✅ Get Event by ID
 * Fetches a specific event by its ID
 * @param id Event ID
 */
export const getEventById = async (
  id: string
): Promise<AxiosResponse<{ success: boolean; data: IEventForm }>> => {
  try {
    return await BaseApi.getRequest(`/admin/event/${id}`);
  } catch (error: any) {
    return { data: { success: false, message: error?.response?.data?.message || "Failed to fetch event" } } as any;
  }
};

/**
 * ✅ Update Event
 * Updates an existing event
 * @param id Event ID
 * @param updatedData Updated event data
 */
export const updateEvent = async (
  id: string,
  updatedData: Partial<IEventForm>
): Promise<AxiosResponse<{ success: boolean; data: IEventForm }>> => {
  // If file upload is present, use FormData
  if (updatedData.attachment) {
    const formData = new FormData();
    if (updatedData.title) formData.append("title", updatedData.title);
    if (updatedData.description) formData.append("description", updatedData.description);
    if (updatedData.start) formData.append("start", updatedData.start);
    if (updatedData.end) formData.append("end", updatedData.end);
    if (updatedData.category) formData.append("category", updatedData.category);
    formData.append("attachment", updatedData.attachment);
    if (updatedData.targetAudience) formData.append("targetAudience", updatedData.targetAudience);
    if (updatedData.schoolId) formData.append("schoolId", updatedData.schoolId);
    (updatedData.roles || []).forEach((r: any) => formData.append("roleIds[]", r.id));
    (updatedData.sections || []).forEach((s: any) => formData.append("sectionIds[]", s.id));
    (updatedData.Class || []).forEach((c: any) => formData.append("classIds[]", c.id));
    try {
      return await BaseApi.putRequest(`/admin/event/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error: any) {
      return { data: { success: false, message: error?.response?.data?.message || "Failed to update event" } } as any;
    }
  } else {
    // Otherwise, send as JSON with only primitive values and arrays of IDs
    const payload: Record<string, any> = { ...updatedData };
    if (updatedData.roles) payload.roleIds = updatedData.roles.map((r: any) => r.id);
    if (updatedData.sections) payload.sectionIds = updatedData.sections.map((s: any) => s.id);
    if (updatedData.Class) payload.classIds = updatedData.Class.map((c: any) => c.id);
    delete payload.roles;
    delete payload.sections;
    delete payload.Class;
    try {
      return await BaseApi.putRequest(`/admin/event/${id}`, payload);
    } catch (error: any) {
      return { data: { success: false, message: error?.response?.data?.message || "Failed to update event" } } as any;
    }
  }
};

/**
 * ✅ Delete Event
 * Deletes an event by its ID
 * @param id Event ID
 */
export const deleteEvent = async (
  id: string
): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
  try {
    return await BaseApi.deleteRequest(`/admin/event/${id}`);
  } catch (error: any) {
    return { data: { success: false, message: error?.response?.data?.message || "Failed to delete event" } } as any;
  }
};

/**
 * ✅ Get Events by School ID
 * Fetches all events for a specific school
 * @param schoolId School ID
 */
export const getEventsBySchoolId = async (
  schoolId: string
): Promise<AxiosResponse<any>> => {
  try {
    return await BaseApi.getRequest(`/school/${schoolId}`);
  } catch (error: any) {
    return { data: { success: false, message: error?.response?.data?.message || "Failed to fetch events" } } as any;
  }
};

/**
 * ✅ Get All Events of School
 * Alternative route to fetch all events for a school
 * @param schoolId School ID
 */
export const getAllEventsOfSchool = async (
  schoolId: string
): Promise<AxiosResponse<{ success: boolean; data: IEventForm[] }>> => {
  try {
    return await BaseApi.getRequest(`/all/${schoolId}`);
  } catch (error: any) {
    return { data: { success: false, message: error?.response?.data?.message || "Failed to fetch events" } } as any;
  }
};