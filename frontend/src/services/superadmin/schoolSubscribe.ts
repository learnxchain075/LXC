import BaseApi from "../BaseApi";
import { SubscribeRequest } from "../types/superAdmin/schoolSubscribeService";


const SubscribeService = {
  // 🔽 CREATE subscription
  createSubscription: async (data: SubscribeRequest) => {
    return await BaseApi.postRequest("/subscribe", data);
  },

  // 🔍 READ all subscriptions (or you can pass schoolId/planId as query)
  getAllSubscriptions: async () => {
    return await BaseApi.getRequest("/subscribe");
  },

  // 🔍 READ a single subscription by ID
  getSubscriptionById: async (id: string) => {
    return await BaseApi.getRequest(`/subscribe/${id}`);
  },

  // ✏️ UPDATE subscription by ID
  updateSubscription: async (id: string, data: Partial<SubscribeRequest>) => {
    return await BaseApi.putRequest(`/subscribe/${id}`, data);
  },

  // 🗑️ DELETE subscription by ID
  deleteSubscription: async (id: string) => {
    return await BaseApi.deleteRequest(`/subscribe/${id}`);
  },

  // 🔧 PATCH subscription (e.g., update coupon only)
  patchSubscription: async (id: string, patchData: Partial<SubscribeRequest>) => {
    return await BaseApi.patchRequest(`/subscribe/${id}`, patchData);
  },
};

export default SubscribeService;
