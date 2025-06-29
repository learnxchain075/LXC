import { z } from "zod";

export const issueBookParamsSchema = z.object({
  libraryId: z.string().cuid("Invalid library id"),
});

export const issueBookSchema = z.object({
  bookCopyId: z.string().cuid("Invalid book copy id"),
  userId: z.string().cuid("Invalid user id"),
  dueDate: z.coerce.date(),
});

export const returnBookParamsSchema = z.object({
  libraryId: z.string().cuid("Invalid library id"),
  issueId: z.string().cuid("Invalid issue id"),
});
