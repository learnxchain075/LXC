import { z } from "zod";

export const submitHomeworkSchema = z.object({
  studentId: z.string().cuid("Invalid student id"),
  homeworkId: z.string().cuid("Invalid homework id"),
  file: z.string().min(1),
});
