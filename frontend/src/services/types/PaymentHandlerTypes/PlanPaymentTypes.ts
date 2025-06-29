export interface CreatePlanOrderRequest {
  planId: string;
  schoolId: string;
  couponCode?: string;
  isTrial?: boolean;
}

export interface VerifyPlanPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  planId: string;
  schoolId: string;
  couponCode?: string;
  isTrial?: boolean;
}
