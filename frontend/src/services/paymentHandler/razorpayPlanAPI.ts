// import BaseApi from "../BaseApi";
// import { CreatePlanOrderRequest, VerifyPlanPaymentRequest } from "../types/PaymentHandlerTypes/PlanPaymentTypes";

import BaseApi from "../BaseApi";
import { CreatePlanOrderRequest, VerifyPlanPaymentRequest } from "../types/PaymentHandlerTypes/PlanPaymentTypes";





const RazorpayService = {
  createOrder: async (data: CreatePlanOrderRequest) => {
    return await BaseApi.postRequest("/school/create-order", data);
  },

  verifyPayment: async (data: VerifyPlanPaymentRequest) => {
    return await BaseApi.postRequest("/school/verify-payment", data);
  },
};

export default RazorpayService;
