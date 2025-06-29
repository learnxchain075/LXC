import { z } from "zod";

export const createFeeSchema = z.object({
  studentId: z.string().cuid("Invalid student id"),
  amount: z.number(),
  dueDate: z.coerce.date(),
  finePerDay: z.number(),
  category: z.string().min(1),
  schoolId: z.string().cuid("Invalid school id"),
});

export const updateFeeSchema = z.object({
  amount: z.number().optional(),
  dueDate: z.coerce.date().optional(),
  finePerDay: z.number().optional(),
  status: z.string().optional(),
});
