import BaseApi from "./BaseApi";

// Create Razorpay order (initiate payment)
export const createFeeOrder = async (feeId: string, amount: number) => {
  return await BaseApi.postRequest("/school/fee/create-order", { feeId, amount });
};

// Verify Razorpay payment after success
export const verifyFeePayment = async (orderId: string, paymentId: string, razorpaySignature: string, feeId: string) => {
  return await BaseApi.postRequest("/school/fee/verify-payment", { orderId, paymentId, razorpaySignature, feeId });
};
 