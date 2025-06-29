import { z } from "zod";

export const expenseCategorySchema = z.object({
  name: z.string().min(1),
  schoolId: z.string().cuid("Invalid school id"),
});

export const expenseCategoryUpdateSchema = z.object({
  name: z.string().min(1),
});
