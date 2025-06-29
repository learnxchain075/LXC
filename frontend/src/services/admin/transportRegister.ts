import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi"; // Axios wrapper
import { ITransportForm } from "../types/auth"; // Transport staff interface

// ✅ REGISTER TRANSPORT STAFF
export const registerTransport = async (
  data: ITransportForm
): Promise<AxiosResponse<any>> => {
  // Create a new FormData object to send text + file data
  const formDataToSend = new FormData();

  // Loop through each field in the form data
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    // If it's a profilePic and is a File, append as a file
    if (key === "profilePic" && value instanceof File) {
      formDataToSend.append(key, value);
    } else {
      // Otherwise, append it as a string
      formDataToSend.append(key, value.toString());
    }
  });

  // Send a POST request with multipart/form-data header
  return await BaseApi.postRequest(`/transport`, formDataToSend, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ GET ALL TRANSPORT STAFF
export const getAllTransport = async (): Promise<AxiosResponse<any>> => {
  // Sends GET request to fetch all transport records
  return await BaseApi.getRequest(`/transport`);
};

// ✅ GET TRANSPORT STAFF BY ID
export const getTransportById = async (
  id: string
): Promise<AxiosResponse<any>> => {
  // Sends GET request to fetch single transport data by ID
  return await BaseApi.getRequest(`/transport/${id}`);
};

// ✅ UPDATE TRANSPORT STAFF BY ID
export const updateTransport = async (
  id: string,
  data: ITransportForm
): Promise<AxiosResponse<any>> => {
  // Create FormData again to handle both text + file
  const formDataToSend = new FormData();

  // Append each field to FormData
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (key === "profilePic" && value instanceof File) {
      formDataToSend.append(key, value);
    } else {
      formDataToSend.append(key, value.toString());
    }
  });

  // Send a PUT request with updated FormData
  return await BaseApi.putRequest(`/transport/${id}`, formDataToSend as any, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ DELETE TRANSPORT STAFF BY ID
export const deleteTransport = async (
  id: string
): Promise<AxiosResponse<any>> => {
  // Sends DELETE request to remove transport record
  return await BaseApi.deleteRequest(`/transport/${id}`);
};
