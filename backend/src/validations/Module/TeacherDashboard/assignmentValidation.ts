import { z } from "zod";

export const createAssignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.string().optional(),
  startDate: z.coerce.date().optional(),
  dueDate: z.coerce.date(),
  attachment: z.string().optional(),
  lessonId: z.string().cuid("Invalid lesson id"),
  classId: z.string().cuid("Invalid class id"),
  sectionId: z.string().cuid("Invalid section id"),
  subjectId: z.string().cuid("Invalid subject id"),
});

export const updateAssignmentSchema = createAssignmentSchema.partial();
