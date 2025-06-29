import { z } from "zod";

export const promoteStudentSchema = z.object({
  studentId: z.string().cuid("Invalid student id"),
  fromClassId: z.string().cuid("Invalid from class id"),
  toClassId: z.string().cuid("Invalid to class id"),
  fromSection: z.string().min(1),
  toSection: z.string().min(1),
  academicYear: z.string().min(1),
  toSession: z.string().min(1),
});

export const bulkPromoteSchema = z.object({
  fromClassId: z.string().cuid("Invalid from class id"),
  toClassId: z.string().cuid("Invalid to class id"),
  fromSection: z.string().min(1),
  toSection: z.string().min(1),
  academicYear: z.string().min(1),
  toSession: z.string().min(1),
  excludeIds: z.array(z.string().cuid()).optional(),
});
