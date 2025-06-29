import { z } from "zod";

export const salaryPaymentSchema = z.object({
  teacherId: z.string().cuid("Invalid teacher id"),
  amount: z.number().positive(),
  period: z.string().min(1),
  method: z.string().min(1),
});
