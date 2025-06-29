import { z } from "zod";

export const createResultSchema = z
  .object({
    studentId: z.string().cuid("Invalid student id"),
    examId: z.string().cuid().optional(),
    assignmentId: z.string().cuid().optional(),
    score: z.number(),
  })
  .refine(
    (data) => (data.examId && !data.assignmentId) || (!data.examId && data.assignmentId),
    {
      message: "Provide either examId or assignmentId",
      path: ["examId"],
    }
  );

export const updateResultSchema = z.object({
  score: z.number(),
});
