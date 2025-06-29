
// import { AxiosResponse } from "axios";
// import BaseApi from "../BaseApi";
// import { ITeacherForm } from "../types/auth";
// export const registerTeacher = async (data: ITeacherForm): Promise<AxiosResponse<any>> => {
//   const formDataToSend = new FormData();

//   Object.entries(data).forEach(([key, value]) => {
//     if (value !== null && value !== undefined) {
//       if (value instanceof File) {
//         formDataToSend.append(key, value); 
//       } else if (Array.isArray(value)) {
//         formDataToSend.append(key, JSON.stringify(value)); 
//       } else if (value instanceof Date) {
//         formDataToSend.append(key, value.toISOString()); 
//       } else {
//         formDataToSend.append(key, value.toString()); 
//       }
//     }
//   });
// // console.log("object",formDataToSend);
//   const response = await BaseApi.postRequest(`/teacher`,formDataToSend, {
//     headers: {
//       'Content-Type': 'multipart/form-data', 
//     },
//   });

//   return response;
// };


// // Get All 


// export const getAllTeacher = async (): Promise<AxiosResponse<any>> => {
//   const response = await BaseApi.getRequest(`/teacher`);

//   return response;
// }

// // Get Teacher By Id

// export const getTeacherById = async (TeacherId: string): Promise<AxiosResponse<any>> => {
//   const response = await BaseApi.getRequest(`/teacher/${TeacherId}`);

//   return response;
// }

// // Update Teacher


// // export const updateTeacher = async (
// //     data: ITeacherForm,
// // ): Promise<AxiosResponse<ITeacherForm>> => {
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


// // Delete Teacher


// export const deleteTeacher = async (TeacherId: string): Promise<AxiosResponse<any>> => {
//   const response = await BaseApi.deleteRequest(`/teacher/${TeacherId}`,
//   );

//   return response;
// }


import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";
import { ITeacherForm } from "../types/auth";

// ✅ Register Teacher
export const registerTeacher = async (data: ITeacherForm): Promise<AxiosResponse<any>> => {
  const formDataToSend = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formDataToSend.append(key, value); 
      } else if (Array.isArray(value)) {
        formDataToSend.append(key, JSON.stringify(value)); 
      } else if (value instanceof Date) {
        formDataToSend.append(key, value.toISOString()); 
      } else {
        formDataToSend.append(key, value.toString()); 
      }
    }
  });

  const response = await BaseApi.postRequest(`/teacher`, formDataToSend, {
    headers: {
      'Content-Type': 'multipart/form-data', 
    },
  });

  return response;
};

// ✅ Get All Teachers
export const getAllTeacher = async (): Promise<AxiosResponse<any>> => {
  const response = await BaseApi.getRequest(`/teacher`);
  return response;
};

// ✅ Get Teacher By ID
export const getTeacherById = async (teacherId: string): Promise<AxiosResponse<any>> => {
  const response = await BaseApi.getRequest(`/teacher/${teacherId}`);
  return response;
};

export const getTeacherByschoolId = async (schoolId: string): Promise<AxiosResponse<any>> => {
  const response = await BaseApi.getRequest(`/school/${schoolId}/teacher`);
  return response;
};

// ✅ Update Teacher
export const updateTeacher = async (
  teacherId: string,
  data: ITeacherForm
): Promise<AxiosResponse<any>> => {
  const formDataToSend = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formDataToSend.append(key, value); 
      } else if (Array.isArray(value)) {
        formDataToSend.append(key, JSON.stringify(value)); 
      } else if (value instanceof Date) {
        formDataToSend.append(key, value.toISOString()); 
      } else {
        formDataToSend.append(key, value.toString()); 
      }
    }
  });

  const response = await BaseApi.putRequest(`/teacher/${teacherId}`, formDataToSend as any, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response;
};

// ✅ Delete Teacher
export const deleteTeacher = async (teacherId: string): Promise<AxiosResponse<any>> => {
  const response = await BaseApi.deleteRequest(`/teacher/${teacherId}`);
  return response;
};
