import axios from "axios";

const api = axios.create({
  baseURL: "https://api.learnxchain.io",
});

// Interface for forgot password request
export interface ForgotPasswordRequest {
  email: string;
}

// Interface for reset password request
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Forgot Password: POST /auth/forgot-password
export const forgotPassword = async (data: ForgotPasswordRequest) => {
  return await api.post("/auth/forgot-password", data);
};

// Reset Password: POST /auth/password/reset-password
export const resetPassword = async (data: ResetPasswordRequest) => {
  return await api.post("/auth/password/reset-password", data);
}; 