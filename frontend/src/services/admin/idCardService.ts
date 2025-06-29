import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";

export const downloadStudentIdCard = async (
  studentId: string
): Promise<AxiosResponse<Blob>> => {
  return await BaseApi.getRequest(`/student/id-card/${studentId}`, {
    responseType: 'blob'
  });
};
