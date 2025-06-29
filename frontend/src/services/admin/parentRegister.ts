// import { AxiosResponse } from "axios";
// import BaseApi from "../BaseApi";

// export const registerparents = async (data: IparentsForm): Promise<AxiosResponse<any>> => {
//     const formDataToSend = new FormData();
  
//     Object.entries(data).forEach(([key, value]) => {
//       if (value === null || value === undefined) return;
  
//       if (key === "profilePic" && value instanceof File) {
//         formDataToSend.append(key, value);
//       } else if (key === "admissionDate" || key === "dateOfBirth") {
//         formDataToSend.append(key, new Date(value).toISOString());
//       } else if (Array.isArray(value)) {
       
//         formDataToSend.append(key, value.join(", "));
//       } else {
//         formDataToSend.append(key, value.toString());
//       }
//     });
  
//     const response = await BaseApi.postRequest(`/parents`, formDataToSend, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
  
//     return response;
//   };

// // Get All parents


// export const getAllparentss = async (): Promise<AxiosResponse<any>> => {
//     const response = await BaseApi.getRequest(`/parents`);

//     return response;
// }

// // Get parents By Id

// export const getparentsById = async (parentsId: string): Promise<AxiosResponse<any>> => {
//     const response = await BaseApi.getRequest(`/parents/${parentsId}`);

//     return response;
// }

// // Update parents


// // export const updateparents = async (
// //     data: IparentsForm,
// // ): Promise<AxiosResponse<IparentsForm>> => {
// //     const formDataToSend = new FormData();
  
// //     Object.entries(data).forEach(([key, value]) => {
// //       if (value === null || value === undefined) return;
  
// //       if (key === "profilePic" && value instanceof File) {
// //         formDataToSend.append(key, value);
// //       } else if (key === "admissionDate" || key === "dateOfBirth") {
// //         formDataToSend.append(key, new Date(value).toISOString());
// //       } else if (Array.isArray(value)) {
       
// //         formDataToSend.append(key, value.join(", "));
// //       } else {
// //         formDataToSend.append(key, value.toString());
// //       }
// //     });
// //     const response = await BaseApi.putRequest(`/administrator/schools/update/${schoolId}`, {
// //       formDataToSend
// //     });

// //     return response;
// // }


//  // Delete parents


// export const deleteparents = async (parentsId: string): Promise<AxiosResponse<any>> => {
//     const response = await BaseApi.deleteRequest(`/parents/${parentsId}`,
//     );

//     return response;
// }

// // School Permission Update
// // 
