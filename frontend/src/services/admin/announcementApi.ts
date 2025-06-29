import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IAnnouncementForm } from "../types/admin/announcmentService";


// Create announcement
export const createAnnouncement = async (
  data: IAnnouncementForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/admin/announcement", data);
};

// Get all announcements
export const getAllAnnouncements = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest("/admin/announcement");
};

// Get announcement by ID
export const getAnnouncementById = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/admin/announcement/${id}`);
};

// Update announcement
export const updateAnnouncement = async (
  id: string,
  data: IAnnouncementForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/admin/announcement/${id}`, data as any);
};

// Delete announcement
export const deleteAnnouncement = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/admin/announcement/${id}`);
};
