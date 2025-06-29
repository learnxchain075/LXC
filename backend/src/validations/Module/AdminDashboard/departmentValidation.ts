import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  schoolId: z.string().cuid("Invalid school id"),
});

export const updateDepartmentSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});
