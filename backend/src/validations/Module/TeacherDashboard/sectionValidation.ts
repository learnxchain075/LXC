import { z } from "zod";

export const createSectionSchema = z.object({
  name: z.string().min(1),
  classId: z.string().cuid("Invalid class id"),
});

export const updateSectionSchema = createSectionSchema.partial();
