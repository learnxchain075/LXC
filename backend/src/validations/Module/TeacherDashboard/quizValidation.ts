import { z } from "zod";

export const createQuizSchema = z.object({
  question: z.string().min(1, "Question is required"),
  options: z.array(z.string()).min(2, "At least two options are required"),
  answer: z.string().min(1, "Answer is required"),
  classId: z.string().cuid("Invalid class id"),
  maxScore: z.number().min(1, "Max score must be at least 1"),
  startDate: z.coerce.date({ invalid_type_error: "Invalid start date" }),
  endDate: z.coerce.date({ invalid_type_error: "Invalid end date" }),
});


export const updateQuizSchema = createQuizSchema.partial();
