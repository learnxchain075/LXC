import { z } from "zod";

export const libraryIdParamSchema = z.object({
  libraryId: z.string().cuid("Invalid library id"),
});

export const bookIdParamSchema = z.object({
  bookId: z.string().cuid("Invalid book id"),
});

export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  isbn: z.string().min(1, "ISBN is required"),
  publicationDate: z.coerce.date(),
  genre: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  department: z.string().min(1).optional(),
  class: z.string().min(1).optional(),
  subject: z.string().min(1).optional(),
  edition: z.string().min(1).optional(),
  authors: z.array(z.string().cuid()).optional(),
});

export const updateBookSchema = createBookSchema.partial();
