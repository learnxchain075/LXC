import { z } from "zod";

export const bookCopyParamsSchema = z.object({
  libraryId: z.string().cuid("Invalid library id"),
  bookId: z.string().cuid("Invalid book id"),
});

export const copyIdParamSchema = z.object({
  copyId: z.string().cuid("Invalid copy id"),
});

export const addBookCopySchema = z.object({
  accessionNumber: z.string().min(1, "Accession number is required"),
});

export const updateBookCopySchema = addBookCopySchema.partial();
