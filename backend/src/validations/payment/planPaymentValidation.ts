import { z } from "zod";
import { cuidSchema } from "../common/commonValidation";

export const createPlanOrderSchema = z.object({
  planId: cuidSchema,
  schoolId: cuidSchema,
  couponCode: z.string().optional(),
  isTrial: z.boolean().optional(),
});

export const verifyPlanPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  planId: cuidSchema,
  schoolId: cuidSchema,
  couponCode: z.string().optional(),
  isTrial: z.boolean().optional(),
});

export const razorpayWebhookSchema = z.object({
  event: z.string().min(1),
  payload: z.any(),
});
