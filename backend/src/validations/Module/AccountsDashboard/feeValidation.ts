import { z } from "zod";

export const feeDataSchema = z.object({
  studentId: z.string().cuid("Invalid student id"),
  amount: z.number().positive(),
  category: z.string().min(1),
  paymentDate: z.coerce.date(),
  discount:z.number(),
  scholarship:z.number(),
  schoolId: z.string().cuid("Invalid school id"),
});

export const feeUpdateSchema = z.object({
  amount: z.number().positive(),
  category: z.string().min(1),
  paymentDate: z.coerce.date(),
  discount: z.number().optional(),
  scholarship: z.number().optional(),
});
