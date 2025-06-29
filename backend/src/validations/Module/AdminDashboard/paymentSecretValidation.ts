import { z } from "zod";

export const createPaymentSecretSchema = z.object({
  keyId: z.string().min(1, "Key id is required"),
  keySecret: z.string().min(1, "Key secret is required"),
  schoolId: z.string().cuid("Invalid school id"),
});

export const updatePaymentSecretSchema = z.object({
  keyId: z.string().min(1).optional(),
  keySecret: z.string().min(1).optional(),
});
