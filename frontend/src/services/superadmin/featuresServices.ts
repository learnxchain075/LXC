import { AxiosResponse } from "axios";

import {
  IGetAllFeaturesRequestListResponse,
  IFeaturesRequestApproveResponse,
  IFeaturesPermissionToggleResponse,
  IGetAllFeaturePermissionsListResponse,
} from "../types/features";
import BaseApi from "../BaseApi";

// Get All Features Request List
export const getAllFeaturesRequestList = async (): Promise<
  AxiosResponse<IGetAllFeaturesRequestListResponse>
> => {
  const response = await BaseApi.getRequest(
    `/administrator/features/get-all-requests`
  );

  return response;
};

// Request Feature Approve
export const featureRequestApprove = async (
  id: string
): Promise<AxiosResponse<IFeaturesRequestApproveResponse>> => {
  const response = await BaseApi.putRequest(
    `/administrator/features/request/complete/${id}`
  );

  return response;
};

// Request Feature Reject
export const featureRequestReject = async (
  id: string
): Promise<AxiosResponse<IFeaturesRequestApproveResponse>> => {
  const response = await BaseApi.putRequest(
    `/administrator/features/request/cancel/${id}`
  );

  return response;
};

// Get All Feature Permissions List
export const getAllFeaturePermissionsList = async (
  id: string
): Promise<AxiosResponse<IGetAllFeaturePermissionsListResponse>> => {
  const response = await BaseApi.getRequest(
    `/administrator/features/get-all-feature-permissions/${id}`
  );

  return response;
};

// Feature Toggle Permission
export const featurePermissionToggle = async (
  id: string
): Promise<AxiosResponse<IFeaturesPermissionToggleResponse>> => {
  const response = await BaseApi.putRequest(
    `/administrator/features/toggle-permission/${id}`
  );

  return response;
};
