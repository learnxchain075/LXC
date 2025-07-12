import { AxiosResponse } from "axios";
import BaseApi from "./BaseApi";

export interface UsageParams {
  role?: string;
  module?: string;
  device?: string;
  range?: string;
  schoolId?: string;
}
export const fetchAdminUsageAnalytics = async (
  params: UsageParams = {}
): Promise<AxiosResponse<any>> => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) search.append(k, v);
  });
  const query = search.toString();
  return BaseApi.getRequest(`/usage-analytics/admin${query ? `?${query}` : ""}`);
};

export const fetchSuperAdminUsageAnalytics = async (
  params: UsageParams = {}
): Promise<AxiosResponse<any>> => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) search.append(k, v);
  });
  const query = search.toString();
  return BaseApi.getRequest(`/usage-analytics/superadmin${query ? `?${query}` : ""}`);
};

export const logUsage = async (data: {
  module: string;
  deviceType: string;
  schoolId?: string;
}): Promise<AxiosResponse<any>> => {
  return BaseApi.postRequest(`/usage-analytics/log`, data);
};
