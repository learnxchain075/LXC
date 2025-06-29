import { z } from "zod";

export const leaveRequestSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
  fromDate: z.coerce.date({ invalid_type_error: "Invalid from date" }),
  toDate: z.coerce.date({ invalid_type_error: "Invalid to date" }),
});

export const leaveIdParamSchema = z.object({
  id: z.string().cuid("Invalid leave request ID"),
});

export const schoolIdParamSchema = z.object({
  schoolId: z.string().cuid("Invalid School ID"),
});
