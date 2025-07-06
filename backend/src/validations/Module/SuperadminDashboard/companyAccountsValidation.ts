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

export const companyTransactionAdvancedFilterSchema = z.object({
  search: z.string().optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  mode: z.enum(["CASH", "BANK_TRANSFER", "UPI", "OTHER"]).optional(),
  billAttached: z.enum(["true", "false"]).optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  sortBy: z.enum(["date", "amount", "title"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().optional(),
  perPage: z.coerce.number().optional(),
});
