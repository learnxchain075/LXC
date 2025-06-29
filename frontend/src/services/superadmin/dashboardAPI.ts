// services/superadmin/dashboardService.ts

import { AxiosResponse } from 'axios';
import BaseApi from '../BaseApi';
import { SuperAdminDashboardData } from '../types/superAdmin/superAdminHomeSerive';


// Get Super Admin Dashboard Data
export const getSuperAdminDashboard = async (): Promise<
  AxiosResponse<SuperAdminDashboardData>
> => {
  const response = await BaseApi.getRequest(
    `/super-admin/dashboard`
  );

  return response;
};
