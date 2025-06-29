import { z } from "zod";

export const fineIdParamSchema = z.object({
  fineId: z.string().cuid("Invalid fine id"),
});

export const createFineSchema = z.object({
  bookIssueId: z.string().cuid("Invalid book issue id"),
  amount: z.number().positive(),
  reason: z.string().min(1, "Reason is required"),
});

export const updateFineSchema = z.object({
  amount: z.number().positive().optional(),
  reason: z.string().min(1).optional(),
  paid: z.boolean().optional(),
});
