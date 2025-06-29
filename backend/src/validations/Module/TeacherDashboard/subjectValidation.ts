import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  type: z.string().min(1),
  classId: z.string().cuid("Invalid class id"),
});

export const updateSubjectSchema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  code: z.string().optional(),
});
