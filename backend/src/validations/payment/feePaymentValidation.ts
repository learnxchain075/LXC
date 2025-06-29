import { z } from "zod";
import { cuidSchema } from "../common/commonValidation";

export const createFeeOrderSchema = z.object({
  feeId: cuidSchema,
  amount: z.number().positive(),
});

export const verifyFeePaymentSchema = z.object({
  orderId: z.string().min(1),
  paymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
  feeId: cuidSchema,
});
