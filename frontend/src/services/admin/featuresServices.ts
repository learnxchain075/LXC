import { AxiosResponse } from "axios";

import { IGetAllFeaturesResponse, IRequestFeaturesResponse } from "../types/features";
import BaseApi from "../BaseApi";

// Get All Features
export const getAllFeatures = async (): Promise<AxiosResponse<IGetAllFeaturesResponse>> => {
    const response = await BaseApi.getRequest(`/admin/features/get-all`);

    return response;
}

// Request Feature
export const requestFeature = async (postData: { moduleName: string }): Promise<AxiosResponse<IRequestFeaturesResponse>> => {
    const response = await BaseApi.postRequest(`/admin/features/request`, postData);

    return response;
}