import { z } from "zod";

export const userIdParamSchema = z.object({
  id: z.string().cuid("Invalid user ID"),
});
