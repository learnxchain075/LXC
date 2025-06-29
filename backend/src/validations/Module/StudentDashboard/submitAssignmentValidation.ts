import { z } from "zod";

export const submitAssignmentSchema = z.object({
  studentId: z.string().cuid("Invalid student id"),
  assignmentId: z.string().cuid("Invalid assignment id"),
  file: z.string().optional()
});
