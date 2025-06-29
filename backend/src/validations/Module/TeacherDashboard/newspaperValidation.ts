import { z } from "zod";

export const createNewspaperSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  userId: z.string().cuid("Invalid user id"),
  classId: z.string().cuid("Invalid class id"),
});

export const updateNewspaperSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});
