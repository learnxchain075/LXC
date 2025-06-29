import { z } from "zod";

export const createDoubtSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  userId: z.string().cuid("Invalid user id"),
  classId: z.string().cuid("Invalid class id"),
  subjectId: z.string().cuid("Invalid subject id"),
});

export const updateDoubtSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
});
