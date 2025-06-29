import { z } from "zod";

export const submitNewspaperTranslationSchema = z.object({
  newspaperId: z.string().cuid("Invalid newspaper id"),
  studentId: z.string().cuid("Invalid student id"),
  translatedText: z.string().min(1),
  voiceUrl: z.string().optional(),
});
