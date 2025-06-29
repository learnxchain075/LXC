import { z } from "zod";

export const createHostelExpenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive(),
  date: z.coerce.date(),
  hostelId: z.string().cuid("Invalid hostel id"),
});

export const updateHostelExpenseSchema = z.object({
  description: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  date: z.coerce.date().optional(),
  hostelId: z.string().cuid("Invalid hostel id").optional(),
});

export const hostelExpenseIdParamSchema = z.object({
  id: z.string().cuid("Invalid expense id"),
});
