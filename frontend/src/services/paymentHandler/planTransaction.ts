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
};

export default PlanTransactionService;
