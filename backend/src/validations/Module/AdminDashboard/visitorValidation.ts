import { z } from "zod";

export const createVisitorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email().optional(),
  purpose: z.string().min(1, "Purpose is required"),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date(),
  schoolId: z.string().cuid("Invalid school id"),
});

export const verifySchema = z.object({
  token: z.string().min(1, "Token is required"),
});
