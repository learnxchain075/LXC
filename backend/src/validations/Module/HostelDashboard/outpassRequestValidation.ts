import { z } from "zod";

export const createOutpassRequestSchema = z.object({
  studentId: z.string().cuid("Invalid student id"),
  reason: z.string().min(1, "Reason is required"),
  fromDate: z.coerce.date(),
  toDate: z.coerce.date(),
});

export const updateOutpassRequestSchema = z.object({
  studentId: z.string().cuid("Invalid student id").optional(),
  reason: z.string().min(1).optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

export const outpassRequestIdParamSchema = z.object({
  id: z.string().cuid("Invalid request id"),
});
