import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";

export const markFaceAttendance = async (
  data: FormData
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest(`/teacher/face-attendance`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
