import { z } from "zod";

export const createLeaderboardSchema = z.object({
  userId: z.string().cuid("Invalid user id"),
  points: z.number().int(),
  coinsEarned: z.number().int(),
  rank: z.number().int(),
});

export const updateLeaderboardSchema = z.object({
  points: z.number().int().optional(),
  coinsEarned: z.number().int().optional(),
  rank: z.number().int().optional(),
});
