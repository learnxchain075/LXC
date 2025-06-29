import { z } from "zod";

export const createHostelFeeSchema = z.object({
  amount: z.number().positive(),
  dueDate: z.coerce.date(),
  studentId: z.string().cuid("Invalid student id"),
  hostelId: z.string().cuid("Invalid hostel id"),
  type: z.enum(["REGULAR", "FINE"]),
});

export const updateHostelFeeSchema = z.object({
  amount: z.number().positive().optional(),
  dueDate: z.coerce.date().optional(),
  status: z.enum(["PAID", "UNPAID", "OVERDUE"]).optional(),
});

export const hostelFeeIdParamSchema = z.object({
  id: z.string().cuid("Invalid fee id"),
});
