import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IBookForm } from "../types/library/bookService";


/**
 * ✅ Create Book
 * Sends a POST request to add a new book to a specific library
 * @param libraryId - ID of the library
 * @param data - Book details (title, isbn, publicationDate, etc.)
 * @returns AxiosResponse<IBookForm>
 */


export const createBook = async (
  libraryId: string,
  data: IBookForm
): Promise<AxiosResponse<IBookForm>> => {
  return await BaseApi.postRequest(`/${libraryId}/books`, {
    ...data,
  });
};

/**
 * ✅ Get All Books
 * Fetches all books from a specific library
 * @param libraryId - ID of the library
 * @returns AxiosResponse<IBookForm[]>
 */
export const getBooks = async (
  libraryId: string
): Promise<AxiosResponse<IBookForm[]>> => {
  return await BaseApi.getRequest(`/${libraryId}/books`);
};

/**
 * ✅ Get Book By ID
 * Fetches details of a single book using its ID and library ID
 * @param libraryId - ID of the library
 * @param bookId - ID of the book
 * @returns AxiosResponse<IBookForm>
 */
export const getBookById = async (
  libraryId: string,
  bookId: string
): Promise<AxiosResponse<IBookForm>> => {
  return await BaseApi.getRequest(`/${libraryId}/books/${bookId}`);
};

/**
 * ✅ Update Book
 * Sends a PUT request to update book details
 * @param libraryId - ID of the library
 * @param bookId - ID of the book
 * @param data - Partial book data to update
 * @returns AxiosResponse<IBookForm>
 */
export const updateBook = async (
  libraryId: string,
  bookId: string,
  data: Partial<IBookForm>
): Promise<AxiosResponse<IBookForm>> => {
  return await BaseApi.putRequest(`/${libraryId}/books/${bookId}`, {
    ...data as any,
  });
};

/**
 * ✅ Delete Book
 * Sends a DELETE request to remove a book from the library
 * @param libraryId - ID of the library
 * @param bookId - ID of the book
 * @returns AxiosResponse<IBookForm>
 */
export const deleteBook = async (
  libraryId: string,
  bookId: string
): Promise<AxiosResponse<IBookForm>> => {
  return await BaseApi.deleteRequest(`/${libraryId}/books/${bookId}`);
};
