import { z } from "zod";

export const paymentDataSchema = z.object({
  feeId: z.string().cuid("Invalid fee id"),
  amount: z.number().positive(),
});
