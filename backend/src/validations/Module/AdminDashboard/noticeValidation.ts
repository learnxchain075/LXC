import { z } from "zod";

export const createNoticeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  noticeDate: z.coerce.date(),
  publishDate: z.coerce.date(),
  attachment: z.string().optional(),
  recipients: z.array(z.string()).min(1),
  createdById: z.string().cuid("Invalid creator id"),
  schoolId: z.string().cuid("Invalid school id"),
});

export const updateNoticeSchema = z.object({
  title: z.string().min(1).optional(),
  message: z.string().min(1).optional(),
  noticeDate: z.coerce.date().optional(),
  publishDate: z.coerce.date().optional(),
  attachment: z.string().optional(),
  recipients: z.array(z.string()).optional(),
});
