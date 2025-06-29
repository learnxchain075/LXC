import { z } from "zod";

export const createExamSchema = z.object({
  passMark: z.number(),
  totalMarks: z.number(),
  duration: z.number().min(1),
  roomNumber: z.number().min(1),
  title: z.string().min(1),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  subjectId: z.string().cuid("Invalid subject id"),
  classId: z.string().cuid("Invalid class id"),
});

export const updateExamSchema = createExamSchema.partial();

export const scheduleExamSchema = z.object({
  title: z.string().min(1),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  subjectId: z.string().cuid("Invalid subject id"),
  classId: z.string().cuid("Invalid class id"),
  scheduleDate: z.coerce.date().optional(),
});

export const createExamAttendanceSchema = z.object({
  studentId: z.string().cuid("Invalid student id"),
  examId: z.string().cuid("Invalid exam id"),
  date: z.coerce.date().optional(),
  present: z.boolean(),
});
