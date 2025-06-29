import { z } from "zod";

export const createDesignationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  schoolId: z.string().cuid("Invalid school id"),
});

export const updateDesignationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});
