import { z } from "zod";

export const createHomeworkSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  dueDate: z.coerce.date(),
  classId: z.string().cuid("Invalid class id"),
  subjectId: z.string().cuid("Invalid subject id"),
});

export const updateHomeworkSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  attachment: z.string().optional(),
  status: z.string().optional(),
});

export const submitHomeworkSchema = z.object({
  studentId: z.string().cuid("Invalid student id"),
  homeworkId: z.string().cuid("Invalid homework id"),
  file: z.string().optional(),
});
