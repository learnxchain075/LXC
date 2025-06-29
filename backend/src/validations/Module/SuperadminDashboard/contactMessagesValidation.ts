import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  message: z.string().min(1, "Message is required"),
  date: z.coerce.date().optional(),
  userId: z.string().cuid("Invalid User ID").optional(),
});

export const updateContactMessageSchema = contactMessageSchema.partial({
  name: true,
  email: true,
  phone: true,
  message: true,
});

export const contactMessageIdParamSchema = z.object({
  id: z.string().cuid("Invalid contact message ID"),
});
