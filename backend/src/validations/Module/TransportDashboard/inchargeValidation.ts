import { z } from "zod";

export const createInchargeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  schoolId: z.string().cuid("Invalid school id"),
});

export const updateInchargeSchema = createInchargeSchema.partial();

export const inchargeIdParamSchema = z.object({
  id: z.string().cuid("Invalid incharge id"),
});
