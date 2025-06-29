import { EventCategory, TargetAudience } from "@prisma/client";
import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  start: z.coerce.date(),
  end: z.coerce.date(),
  category: z.nativeEnum(EventCategory),
  attachment: z.string().optional(),
  targetAudience: z.nativeEnum(TargetAudience).optional(),
  roleIds: z.array(z.string().cuid()).optional(),
  sectionIds: z.array(z.string().cuid()).optional(),
  classIds: z.array(z.string().cuid()).optional(),
  schoolId: z.string().cuid("Invalid school id"),
});

export const updateEventSchema = createEventSchema.partial();
