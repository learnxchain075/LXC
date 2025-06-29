

import BaseApi from "../BaseApi";
import { AxiosResponse } from "axios";
import { IDemoBooking } from "../types/superAdmin/demoRequest";

export const getAllDemoRequest = async (): Promise<AxiosResponse<IDemoBooking[]>> => {
  return await BaseApi.getRequest("/demo-bookings");
};
