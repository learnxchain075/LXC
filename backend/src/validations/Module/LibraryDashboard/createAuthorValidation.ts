import { z } from "zod";

export const createAuthorSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const updateAuthorSchema = createAuthorSchema.partial();

export const authorIdParamSchema = z.object({
  authorId: z.string().cuid("Invalid author id"),
});
