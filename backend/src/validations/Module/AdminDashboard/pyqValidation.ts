import { z } from "zod";

export const createPYQSchema = z.object({
  question: z.string().min(1, "Question is required"),
  solution: z.string().min(1, "Solution is required"),
  subjectId: z.string().cuid("Invalid subject id"),
  classId: z.string().cuid("Invalid class id"),
  uploaderId: z.string().cuid("Invalid uploader id"),
});

export const updatePYQSchema = z.object({
  question: z.string().optional(),
  solution: z.string().optional(),
  subjectId: z.string().cuid("Invalid subject id").optional(),
  classId: z.string().cuid("Invalid class id").optional(),
});
