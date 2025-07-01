import BaseApi from "../BaseApi";

import { AxiosResponse } from "axios";


// 🔸 Create a new ticket
export const createTicket = async (
  data: TicketForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/user/create-ticket", data);
};

// 🔸 Get all tickets
export const getAllTickets = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest("/get-tickets");
};

// 🔸 Get a ticket by ID
export const getTicketById = async (
  ticketId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/get-ticket/${ticketId}`);
};

// 🔸 Get tickets by school ID
export const getTicketsBySchool = async (
  schoolId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/user/schooltickets/${schoolId}`);
};
export const getTicketsByuserid = async (
  userId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/user-tickets/${userId}`);
};

export const getTicketsByAssignee = async (
  userId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/assignee-tickets/${userId}`);
};

// 🔸 Update a ticket by ID
export const updateTicket = async (
  ticketId: string,
  data: TicketForm
): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/update-ticket/${ticketId}`, data as any );
};

// 🔸 Delete a ticket by ID
export const deleteTicket = async (
  ticketId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/delete-ticket/${ticketId}`);
};

// 🔸 Fetch ticket metadata (categories, statuses, priorities)
export const getTicketMetadata = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest("/ticket-metadata");
};