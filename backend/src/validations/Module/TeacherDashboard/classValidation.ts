import { z } from "zod";

export const createClassSchema = z.object({
  name: z.string().min(1, "Name is required"),
  capacity: z.number().int().positive(),
  schoolId: z.string().cuid("Invalid school id"),
  section: z.string().optional(),
  roomNumber: z.string().optional(),
});

export const updateClassSchema = createClassSchema.partial();

export const assignTeacherSchema = z.object({
  classId: z.string().cuid("Invalid class id"),
  teacherId: z.string().cuid("Invalid teacher id"),
});

export const assignStudentSchema = z.object({
  classId: z.string().cuid("Invalid class id"),
  studentId: z.string().cuid("Invalid student id"),
});
