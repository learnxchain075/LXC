import { z } from "zod";

export const createDutySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  hostelId: z.string().cuid(),
  assignedTo: z.string().cuid().optional(),
});

export const updateDutySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});
