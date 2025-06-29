import { z } from "zod";

export const createTopicSchema = z.object({
  name: z.string().min(1),
  roadmapId: z.string().cuid("Invalid roadmap id"),
});

export const roadmapIdParamSchema = z.object({
  roadmapId: z.string().cuid("Invalid roadmap id"),
});

export const topicIdParamSchema = z.object({
  id: z.string().cuid("Invalid topic id"),
});

export const updateTopicSchema = z.object({
  name: z.string().min(1).optional(),
});
