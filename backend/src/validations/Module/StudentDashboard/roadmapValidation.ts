import { z } from "zod";

export const createRoadmapSchema = z.object({
  userId: z.string().cuid("Invalid user id"),
  subjectId: z.string().cuid("Invalid subject id"),
  durationDays: z.number().int().positive(),
  title: z.string().min(1).optional(),
});

export const roadmapIdParamSchema = z.object({
  id: z.string().cuid("Invalid roadmap id"),
});

export const updateRoadmapSchema = z.object({
  title: z.string().min(1).optional(),
  progress: z.number().int().min(0).max(100).optional(),
  coinsEarned: z.number().int().optional(),
});
