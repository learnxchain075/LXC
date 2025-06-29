import { z } from "zod";

export const viewHomeworkSchema = z.object({
  studentId: z.string().cuid("Invalid student id"),
  homeworkId: z.string().cuid("Invalid homework id"),
});
