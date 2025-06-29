import { PayrollStatus } from "@prisma/client";
import { z } from "zod";

export const createPayrollSchema = z.object({
  userId: z.string().cuid("Invalid user id"),
  periodStart: z.coerce.date(),
  periodEnd: z.coerce.date(),
  grossSalary: z.number(),
  deductions: z.number().optional(),
});

export const updatePayrollSchema = z.object({
  grossSalary: z.number(),
  deductions: z.number().optional(),
  paymentDate: z.coerce.date().optional(),
  status: z.nativeEnum(PayrollStatus),
});
