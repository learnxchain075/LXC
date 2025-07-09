
import { AxiosResponse } from "axios";

import { ILoginResponse, IGetUserProfileResponse } from "./types/auth";
import BaseApi from "./BaseApi";

export const login = async (
  email: string,
  password: string
): Promise<AxiosResponse<ILoginResponse>> => {
  const response = await BaseApi.postRequest(`/auth/sign-in`, {
    email,
    password,
  });

  return response;
};

export const requestOtp = async (identifier: string) => {
  const data = identifier.includes('@') ? { email: identifier } : { phone: identifier };
  // BaseApi is configured with /api/v1 prefix, so use /auth endpoints directly
  return await BaseApi.postRequest(`/auth/request-otp`, data);
};

export const loginWithOtp = async (identifier: string, otp: string) => {
  const data = identifier.includes('@') ? { email: identifier, otp } : { phone: identifier, otp };
  return await BaseApi.postRequest(`/auth/login-otp`, data);
};

export const googleLogin = async (idToken: string) => {
  return await BaseApi.postRequest(`/auth/google-login`, { idToken });
};

export const getUserProfile = async (): Promise<
  AxiosResponse<IGetUserProfileResponse>
> => {
  const response = await BaseApi.getRequest(`/get-profile`);

  return response;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
};

export const getCurrentUserRole = () => {
  return localStorage.getItem("role");
};

export const getCurrentUser = () => {
  return localStorage.getItem("token");
};

export const getCurrentUserId = () => {
  return localStorage.getItem("userId");
};
