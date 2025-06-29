import BaseApi from "../BaseApi";

import { AxiosResponse } from "axios";
import { IVisitorForm } from "../types/admin/vistior/vistiorService";

// Create a new visitor
export const createVisitor = async (data: IVisitorForm): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/school/visitor/create", data);
};

// Get visitor details by ID
export const getVisitor = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/visitor/${id}`);
};

// Update visitor data
export const updateVisitor = async (id: string, data: IVisitorForm): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/school/visitor/${id}`, data as any);
};

// Delete visitor record
export const deleteVisitor = async (id: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/school/visitor/${id}`);
};

// Verify entry of visitor (e.g., when scanning entry token)
export const verifyEntry = async (token: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/school/visitor/verify-entry", { token });
};

// Verify exit of visitor (e.g., when scanning exit token)
export const verifyExit = async (token: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest("/school/visitor/verify-exit", { token });
};

// Get Visitor of a school
export const getVisitorOfSchool = async (schoolId: string): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/${schoolId}/visitors`);
}