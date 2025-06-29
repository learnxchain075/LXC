import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IAuthorForm } from "../types/library/authorService";


/**
 * ✅ Create Author
 * Sends a POST request to create a new author
 * @param data - Author information (name)
 * @returns AxiosResponse<IAuthorForm>
 */
export const createAuthor = async (
  data: IAuthorForm
): Promise<AxiosResponse<IAuthorForm>> => {
  return await BaseApi.postRequest(`/author`, {
    name: data.name,
  });
};

/**
 * ✅ Get All Authors
 * Fetches all authors from the database
 * @returns AxiosResponse<IAuthorForm[]>
 */
export const getAuthors = async (): Promise<AxiosResponse<IAuthorForm[]>> => {
  return await BaseApi.getRequest(`/authors`);
};

/**
 * ✅ Get Author By ID
 * Fetches a single author by their ID
 * @param authorId - ID of the author
 * @returns AxiosResponse<IAuthorForm>
 */
export const getAuthorById = async (
  authorId: string
): Promise<AxiosResponse<IAuthorForm>> => {
  return await BaseApi.getRequest(`/${authorId}`);
};

/**
 * ✅ Update Author
 * Sends a PUT request to update an author's details
 * @param authorId - ID of the author
 * @param data - Updated author data (e.g. name)
 * @returns AxiosResponse<IAuthorForm>
 */
export const updateAuthor = async (
  authorId: string,
  data: Partial<IAuthorForm>
): Promise<AxiosResponse<IAuthorForm>> => {
  return await BaseApi.putRequest(`/${authorId}`, {
    ...data,
  });
};

/**
 * ✅ Delete Author
 * Sends a DELETE request to remove an author by ID
 * @param authorId - ID of the author
 * @returns AxiosResponse<IAuthorForm>
 */
export const deleteAuthor = async (
  authorId: string
): Promise<AxiosResponse<IAuthorForm>> => {
  return await BaseApi.deleteRequest(`/${authorId}`);
};
