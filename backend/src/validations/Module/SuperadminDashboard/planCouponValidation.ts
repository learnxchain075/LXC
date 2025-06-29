import { discountType } from "@prisma/client";
import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().min(1, "Code is required"),
  discountType: z.nativeEnum(discountType),
  discountValue: z.number(),
  expiryDate: z.coerce.date(),
  maxUsage: z.number().int(),
  planId: z.string().cuid("Invalid plan ID"),
});

export const couponUpdateSchema = couponSchema.partial({
  code: true,
  discountType: true,
  discountValue: true,
  expiryDate: true,
  maxUsage: true,
  planId: true,
});

export const couponIdParamSchema = z.object({
  id: z.string().cuid("Invalid coupon ID"),
});

export const couponCodeSchema = z.object({
  code: z.string().min(1, "Code is required"),
  planId: z.string().cuid("Invalid plan ID"),
});
