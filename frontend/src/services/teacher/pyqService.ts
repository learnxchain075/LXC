import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IPyqResponse } from "../types/admin/pyqService";

export const getPyqsByClassId = async (
  classId: string
): Promise<AxiosResponse<IPyqResponse[]>> => {
  return await BaseApi.getRequest(`/school/pyqs/class/${classId}`);
};
