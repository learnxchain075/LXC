import { z } from "zod";

export const createGradeSchema = z.object({
  level: z.number().min(1),
  grade: z.string().min(1),
  marksFrom: z.number(),
  marksUpto: z.number(),
  gradePoint: z.number(),
  status: z.string().min(1),
  description: z.string().optional(),
  studentId: z.string().cuid().optional(),
});

export const updateGradeSchema = createGradeSchema.partial();
