import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IDisputedForm } from "../types/library/disputeService";


/**
 * ✅ Create Dispute
 * Sends a POST request to create a new dispute for a book issue
 * @param issueId - ID of the related book issue
 * @param data - Dispute form data (bookIssueId, reason, userId)
 * @returns AxiosResponse<IDisputedForm>
 */
export const createDispute = async (
  issueId: string,
  data: IDisputedForm
): Promise<AxiosResponse<IDisputedForm>> => {
  return await BaseApi.postRequest(`/${issueId}`, {
    bookIssueId: data.bookIssueId,
    reason: data.reason,
    userId: data.userId,
  });
};

/**
 * ✅ Add Message to Dispute
 * Sends a POST request to add a message to an ongoing dispute
 * @param disputeId - ID of the dispute
 * @param message - Message content
 * @returns AxiosResponse<any> - You can define a specific message type if needed
 */
export const addDisputeMessage = async (
  disputeId: string,
  message: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest(`/${disputeId}/messages`, {
    message,
  });
};

/**
 * ✅ Resolve Dispute
 * Sends a PUT request to mark a dispute as resolved
 * @param disputeId - ID of the dispute to resolve
 * @returns AxiosResponse<any> - Can be enhanced with resolution status or summary
 */
export const resolveDispute = async (
  disputeId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.putRequest(`/${disputeId}`, {
    resolved: true,
  });
};
