import { z } from "zod";

export const createAnswerSchema = z.object({
  content: z.string().min(1, "Content is required"),
  userId: z.string().cuid("Invalid user id"),
  doubtId: z.string().cuid("Invalid doubt id"),
});

export const updateAnswerSchema = z.object({
  content: z.string().min(1).optional(),
});
