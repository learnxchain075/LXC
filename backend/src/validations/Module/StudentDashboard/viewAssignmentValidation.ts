import { z } from "zod";

export const viewAssignmentSchema = z.object({
  studentId: z.string().cuid("Invalid student id"),
  assignmentId: z.string().cuid("Invalid assignment id"),
});
