import { z } from "zod";

export const classIdParamSchema = z.object({
  classId: z.string().cuid("Invalid class id"),
});
