import { Day } from "@prisma/client";
import { z } from "zod";

export const createLessonSchema = z.object({
  name: z.string().min(1),
  day: z.nativeEnum(Day),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  subjectId: z.string().cuid("Invalid subject id"),
  classId: z.string().cuid("Invalid class id"),
  teacherId: z.string().cuid("Invalid teacher id"),
});

export const updateLessonSchema = createLessonSchema.partial();
