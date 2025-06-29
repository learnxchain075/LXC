import { z } from "zod";

export const createQuizResultSchema = z.object({
  userId: z.string().cuid("Invalid user id"),
  quizId: z.string().cuid("Invalid quiz id"),
  score: z.number(),
});

export const updateQuizResultSchema = z.object({
  score: z.number(),
});
