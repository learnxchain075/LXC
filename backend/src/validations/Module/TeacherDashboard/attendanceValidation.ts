import { z } from "zod";

export const attendanceSchema = z.object({
  studentId: z.string().cuid("Invalid student id"),
  lessonId: z.string().cuid("Invalid lesson id"),
  present: z.boolean(),
});

export const markMultipleAttendanceSchema = z.object({
  lessonId: z.string().cuid("Invalid lesson id"),
  records: z
    .array(
      z.object({
        studentId: z.string().cuid("Invalid student id"),
        present: z.boolean(),
      })
    )
    .min(1, "At least one record is required"),
});
