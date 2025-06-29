import { z } from "zod";

export const subscribeSchema = z.object({
  schoolId: z.string().cuid("Invalid School ID"),
  planId: z.string().cuid("Invalid Plan ID"),
  paymentId: z.string().min(1, "Payment ID is required"),
  couponCode: z.string().optional(),
});

export const upgradeSchema = z.object({
  planId: z.string().cuid("Invalid Plan ID"),
});

export const subscriptionIdParamSchema = z.object({
  id: z.string().cuid("Invalid subscription ID"),
});

export const schoolIdParamSchema = z.object({
  schoolId: z.string().cuid("Invalid School ID"),
});

export const planIdParamSchema = z.object({
  planId: z.string().cuid("Invalid Plan ID"),
});
