import { z } from "zod";

export const feedbackSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  schoolId: z.string().cuid("Invalid School ID"),
});

export const feedbackUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
});

export const feedbackIdParamSchema = z.object({
  feedbackId: z.string().cuid("Invalid feedback ID"),
});

export const schoolIdParamSchema = z.object({
  schoolId: z.string().cuid("Invalid School ID"),
});
