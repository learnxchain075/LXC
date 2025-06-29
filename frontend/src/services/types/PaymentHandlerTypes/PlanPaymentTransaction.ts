export interface CreatePlanTransactionRequest {
  planId: string;
  schoolId: string;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface PlanTransactionResponse {
  success: boolean;
  message?: string;
  data?: any;
}
