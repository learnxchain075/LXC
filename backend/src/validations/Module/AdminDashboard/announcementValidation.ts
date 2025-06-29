import { z } from "zod";

export const createAnnouncementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.coerce.date(),
  classId: z.string().cuid().optional(),
});

export const updateAnnouncementSchema = createAnnouncementSchema.partial();
