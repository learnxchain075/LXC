import { AxiosResponse } from "axios";

import { IRegisterSchool } from "../types/auth";
import BaseApi from "../BaseApi";


// Register School

export const registerSchool = async (
    schoolName: string,
    name: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    state: string,
    country: string,
    pincode: string,
    profilePic: File,
    
    bloodType: string,
    sex: string,
    schoolLogo: File,
    latitude?: number,
    longitude?: number,
): Promise<AxiosResponse<IRegisterSchool>> => {
    const response = await BaseApi.postRequest(`/administrator/schools/register`, {
        schoolName,
        name,
        email,
        phone,
        address,
        city,
        state,
        country,
        pincode,
        profilePic,
        schoolLogo,
        bloodType,
        sex,
        latitude,
        longitude,
    },
    {
        headers: {
          'Content-Type': 'multipart/form-data' //to send file
        }
      }
);

    return response;
}

// Get All Schools


export const getAllSchools = async (): Promise<AxiosResponse<IRegisterSchool>> => {
    const response = await BaseApi.getRequest(`/administrator/schools/get-all`);

    return response;
}

// Get School By Id

export const getSchoolById = async (schoolId: string): Promise<AxiosResponse<IRegisterSchool>> => {
    const response = await BaseApi.getRequest(`administrator/schools/get/${schoolId}`);

    return response;
}

export const getSchoolLocation = async (schoolId: string): Promise<AxiosResponse<any>> => {
    return BaseApi.getRequest(`/administrator/schools/location/${schoolId}`);
}

// Update School


export const updateSchool = async (
    schoolId: string,
    schoolName: string,
    name: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    state: string,
    country: string,
    pincode: string,
    profilePic: string,
    latitude?: number,
    longitude?: number,
): Promise<AxiosResponse<IRegisterSchool>> => {
    const response = await BaseApi.putRequest(`/administrator/schools/update/${schoolId}`, {
        schoolName,
        name,
        email,
        phone,
        address,
        city,
        state,
        country,
        pincode,
        
        profilePic,
        latitude,
        longitude,
      });

    return response;
}


// Delete School


export const deleteSchool = async (schoolId: string): Promise<AxiosResponse<IRegisterSchool>> => {
    const response = await BaseApi.deleteRequest(`/administrator/schools/delete/${schoolId}`,
    );

    return response;
}

// School Permission Update

