import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";

export interface TeacherOption {
  id: string;
  name: string;
}

export interface FaceRecord {
  id: string;
  teacherId: string;
  faceImageUrl: string;
  teacher: { user: { name: string } };
}

export const getTeachersBySchool = async (
  schoolId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/${schoolId}/teacher`);
};

export const getTeacherFaceRecords = async (
  schoolId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/admin/teacher-face/school/${schoolId}`);
};

export const registerTeacherFace = async (
  teacherId: string,
  image: Blob
): Promise<AxiosResponse<any>> => {
  const form = new FormData();
  form.append("image", image, "selfie.png");
  form.append("teacherId", teacherId);
  return await BaseApi.postRequest(`/admin/teacher-face/register`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteTeacherFace = async (
  teacherId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/admin/teacher-face/${teacherId}`);
};
