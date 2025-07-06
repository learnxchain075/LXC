import { z } from "zod";

export const companyTransactionSchema = z.object({
  transactionType: z.enum(["INCOME", "EXPENSE"]),
  title: z.string().min(1),
  description: z.string().min(1),
  amount: z.coerce.number(),
  date: z.coerce.date(),
  paymentMode: z.enum(["CASH", "BANK_TRANSFER", "UPI", "OTHER"]),
  sourceOrRecipient: z.string().min(1),
  createdBy: z.string().min(1),
});

export const companyTransactionUpdateSchema = companyTransactionSchema.partial();

export const companyTransactionIdSchema = z.object({
  id: z.string().uuid(),
});

export const companyTransactionFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  transactionType: z.enum(["INCOME", "EXPENSE"]).optional(),
  paymentMode: z.enum(["CASH", "BANK_TRANSFER", "UPI", "OTHER"]).optional(),
});
