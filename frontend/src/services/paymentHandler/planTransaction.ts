import BaseApi from "../BaseApi";
import {
  CreatePlanTransactionRequest,
  PlanTransactionResponse,
} from "../types/PaymentHandlerTypes/PlanPaymentTransaction";

const PlanTransactionService = {
  getAllTransactions: async (
    filters: any = {}
  ): Promise<PlanTransactionResponse[]> => {
    const response = await BaseApi.getRequest("/membership-transactions/plans", filters);
    return response.data.data;
  },
  downloadInvoice: async (subscriptionId: string) => {
    return await BaseApi.getRequest(`/school/plan/invoice/${subscriptionId}`, { responseType: 'blob' });
  },
};

export default PlanTransactionService;
