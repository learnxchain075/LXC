import { AxiosResponse } from "axios";
import BaseApi from "./BaseApi";

export const fetchUsageAnalytics = async (
  params: { role?: string; classId?: string; branchId?: string } = {}
): Promise<AxiosResponse<any>> => {
  const search = new URLSearchParams();
  if (params.role) search.append("role", params.role);
  if (params.classId) search.append("classId", params.classId);
  if (params.branchId) search.append("branchId", params.branchId);
  const query = search.toString();
  return BaseApi.getRequest(`/analytics/usage${query ? `?${query}` : ""}`);
};
