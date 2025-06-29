import { z } from "zod";

export const marksheetParamSchema = z.object({
  classId: z.string().cuid("Invalid class id"),
  studentId: z.string().cuid("Invalid student id"),
});

export const topperListParamSchema = z.object({
  classId: z.string().cuid("Invalid class id"),
});
