import { AxiosResponse } from "axios";
import { IContactMessage } from "./types/common/contactMessage";
import BaseApi from "./BaseApi";

// ✅ Register Accountant
export const registerMessage = async (
  data: IContactMessage
): Promise<AxiosResponse<any>> => {


  const response = await BaseApi.postRequest(`/contact-message`, data);

  return response;
};

// ✅ Get All Accountants
export const getAllmessage = async (): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/contact-messages`);
};

// ✅ Get Accountant by ID
export const getmessageById = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/contact-message/${id}`);
};

// // ✅ Update Accountant
// export const updateAccountant = async (
//   id: string,
//   data: I
// ): Promise<AxiosResponse<any>> => {
//   const formData = new FormData();

//   Object.entries(data).forEach(([key, value]) => {
//     if (key === "profilePic" && value instanceof File) {
//       formData.append(key, value);
//     } else {
//       formData.append(key, value.toString());
//     }
//   });

//   const response = await BaseApi.putRequest(`/account/${id}`, formData as any, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });

//   return response;
// };

// ✅ Delete Accountant
export const deletemessaget = async (
  id: string
): Promise<AxiosResponse<any>> => {
  return await BaseApi.deleteRequest(`/contact-message/${id}`);
};
