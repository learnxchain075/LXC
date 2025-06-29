import { z } from "zod";

// Generic cuid schema
export const cuidSchema = z.string().cuid("Invalid cuid");

export const schoolIdParamSchema = z.object({
  schoolId: cuidSchema,
});

export const studentIdParamSchema = z.object({
  studentId: cuidSchema,
});
