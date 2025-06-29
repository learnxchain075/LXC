import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { IAddBookcopyForm } from "../types/library/AddBookCopyService";


/**
 * ✅ Add Book Copy
 * Sends a POST request to add a copy of a book to a library
 * @param libraryId - ID of the library
 * @param bookId - ID of the book
 * @param data - Book copy data (status, accessionNumber)
 * @returns AxiosResponse<IAddBookcopyForm>
 */
export const addBookCopy = async (
  libraryId: string,
  bookId: string,
  data: Omit<IAddBookcopyForm, "libraryId" | "bookId">
): Promise<AxiosResponse<IAddBookcopyForm>> => {
  return await BaseApi.postRequest(`/${libraryId}/books/${bookId}/copies`, {
    status: data.status,
    accessionNumber: data.accessionNumber,
  });
};

/**
 * ✅ Get Book Copies
 * Fetches all copies of a specific book from a library
 * @param libraryId - ID of the library
 * @param bookId - ID of the book
 * @returns AxiosResponse<IAddBookcopyForm[]>
 */
export const getBookCopies = async (
  libraryId: string,
  bookId: string
): Promise<AxiosResponse<IAddBookcopyForm[]>> => {
  return await BaseApi.getRequest(`/${libraryId}/books/${bookId}/copies`);
};

/**
 * ✅ Update Book Copy
 * Updates a specific book copy
 * @param libraryId - ID of the library
 * @param bookId - ID of the book
 * @param copyId - ID of the book copy
 * @param data - Partial book copy data to update
 * @returns AxiosResponse<IAddBookcopyForm>
 */
export const updateBookCopy = async (
  libraryId: string,
  bookId: string,
  copyId: string,
  data: Partial<Omit<IAddBookcopyForm, "libraryId" | "bookId">>
): Promise<AxiosResponse<IAddBookcopyForm>> => {
  return await BaseApi.putRequest(`/${libraryId}/books/${bookId}/copies/${copyId}`, {
    ...(data.status && { status: data.status }),
    ...(data.accessionNumber && { accessionNumber: data.accessionNumber }),
  });
};

/**
 * ✅ Delete Book Copy
 * Deletes a specific book copy from a library
 * @param libraryId - ID of the library
 * @param bookId - ID of the book
 * @param copyId - ID of the book copy
 * @returns AxiosResponse<IAddBookcopyForm>
 */
export const deleteBookCopy = async (
  libraryId: string,
  bookId: string,
  copyId: string
): Promise<AxiosResponse<IAddBookcopyForm>> => {
  return await BaseApi.deleteRequest(`/${libraryId}/books/${bookId}/copies/${copyId}`);
};
