import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IBookIssueForm } from "../types/library/bookissuse";


/**
 * ✅ Issue Book
 * Sends a POST request to issue a book copy to a user
 * @param libraryId - ID of the library
 * @param data - Issue form data (bookCopyId, userId, issueDate, dueDate)
 * @returns AxiosResponse<IBookIssueForm>
 */
export const issueBook = async (
  libraryId: string,
  data: IBookIssueForm
): Promise<AxiosResponse<IBookIssueForm>> => {
  return await BaseApi.postRequest(`/${libraryId}/books/issue`, {
    bookCopyId: data.bookCopyId,
    userId: data.userId,
    issueDate: data.issueDate,
    dueDate: data.dueDate,
  });
};

/**
 * ✅ Return Book
 * Sends a POST request to return an issued book copy
 * @param libraryId - ID of the library
 * @param issueId - ID of the issued book record
 * @returns AxiosResponse<any> - You can change this to a specific return type if needed
 */
export const returnBook = async (
  libraryId: string,
  issueId: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest(`/${libraryId}/books/return/${issueId}`);
};
