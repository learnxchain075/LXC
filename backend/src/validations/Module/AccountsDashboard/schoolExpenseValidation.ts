import { paymentMethod } from "@prisma/client";
import { z } from "zod";

export const schoolExpenseSchema = z.object({
  categoryId: z.string().cuid("Invalid category id"),
  date: z.coerce.date(),
  amount: z.number().positive(),
  description: z.string().min(1),
  invoiceNumber: z.string().min(1),
  paymentMethod: z.nativeEnum(paymentMethod),
  schoolId: z.string().cuid("Invalid school id"),
});

export const schoolExpenseUpdateSchema = z.object({
  categoryId: z.string().cuid("Invalid category id"),
  date: z.coerce.date(),
  amount: z.number().positive(),
  description: z.string().min(1),
  invoiceNumber: z.string().min(1),
  paymentMethod: z.nativeEnum(paymentMethod),
});
