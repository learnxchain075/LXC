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
  transactionId: string;
  subscriptionId: string;
  providerName: string;
  planType: string;
  transactionDate: string;
  amount: number;
  paymentMethod: string;
  startDate: string | null;
  endDate: string | null;
  status: string;
}
