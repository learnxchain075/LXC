import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { ILeaveRequest } from "../types/teacher/ILeaveRequest";


/**
 * ✅ Create Leave Request
 * @param data - reason, fromDate, toDate
 * @returns AxiosResponse<ILeaveRequest>
 */
export const createLeaveRequest = async (
  data: ILeaveRequest
): Promise<AxiosResponse<ILeaveRequest>> => {
  return await BaseApi.postRequest(`/user/leave`, data);
};

/**
 * ✅ Get All Leave Requests (admin only)
 * @returns AxiosResponse<ILeaveRequest[]>
 */
export const getAllLeaveRequests = async (): Promise<AxiosResponse<ILeaveRequest[]>> => {
  return await BaseApi.getRequest(`/user/leaves`);
};

/**
 * ✅ Get My Leave Requests
 * @returns AxiosResponse<ILeaveRequest[]>
 */
export const getMyLeaves = async (): Promise<AxiosResponse<ILeaveRequest[]>> => {
  return await BaseApi.getRequest(`/user/leave/me`);
};

/**
 * Approve Leave Request (admin only)
 * @param leaveId - Leave request ID
 * @returns AxiosResponse<ILeaveRequest>
 */
export const approveLeaveRequest = async (
  leaveId: string
): Promise<AxiosResponse<ILeaveRequest>> => {
  return await BaseApi.patchRequest(`/user/leave/${leaveId}/approve`);
};


// // PATCH /leaves/:id/approve - Approve leave request
// router.patch("/user/leave/:id/approve", approveLeaveRequest);

// // PATCH /leaves/:id/reject - Reject leave request
// router.patch("/user/leave/:id/reject", rejectLeaveRequest);

/**
 * Reject Leave Request (admin only)
 * @param leaveId - Leave request ID
 * @returns AxiosResponse<ILeaveRequest>
 */
export const rejectLeaveRequest = async (
  leaveId: string
): Promise<AxiosResponse<ILeaveRequest>> => {
  return await BaseApi.patchRequest(`/user/leave/${leaveId}/reject`);
};

/**
 * ✅ Get Leave Requests by School
 * @param schoolId - School ID
 * @returns AxiosResponse<ILeaveRequest[]>
 */
export const getLeaveRequestsBySchool = async (
  schoolId: string
): Promise<AxiosResponse<ILeaveRequest[]>> => {
  return await BaseApi.getRequest(`/user/school/${schoolId}`);
};
