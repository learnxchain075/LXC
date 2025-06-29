import { z } from "zod";

export const createCompetitionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  userId: z.string().cuid("Invalid user id"),
  score: z.number().int(),
});

export const updateCompetitionSchema = z.object({
  name: z.string().min(1).optional(),
  score: z.number().int().optional(),
});
