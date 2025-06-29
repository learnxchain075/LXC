import { z } from "zod";

export const createTransactionSchema = z.object({
  userId: z.string().cuid("Invalid user id"),
  coinsUsed: z.number().int(),
  amountPaid: z.number(),
  status: z.string().optional(),
});

export const updateTransactionSchema = z.object({
  status: z.string().optional(),
});
