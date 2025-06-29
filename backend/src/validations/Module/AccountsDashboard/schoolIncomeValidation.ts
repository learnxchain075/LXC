import { paymentMethod } from "@prisma/client";
import { z } from "zod";

export const schoolIncomeSchema = z.object({
  source: z.string().min(1),
  date: z.coerce.date(),
  amount: z.number().positive(),
  description: z.string().min(1),
  invoiceNumber: z.string().min(1),
  paymentMethod: z.nativeEnum(paymentMethod),
  schoolId: z.string().cuid("Invalid school id"),
});

export const schoolIncomeUpdateSchema = z.object({
  source: z.string().min(1),
  date: z.coerce.date(),
  amount: z.number().positive(),
  description: z.string().min(1),
  invoiceNumber: z.string().min(1),
  paymentMethod: z.nativeEnum(paymentMethod),
});
