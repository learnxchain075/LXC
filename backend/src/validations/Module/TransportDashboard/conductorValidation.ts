import { z } from "zod";

export const createConductorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  busId: z.string().cuid("Invalid bus id"),
  schoolId: z.string().cuid("Invalid school id"),
});

export const updateConductorSchema = createConductorSchema.partial();

export const assignConductorSchema = z.object({
  busId: z.string().cuid("Invalid bus id"),
  conductorId: z.string().cuid("Invalid conductor id"),
});

export const conductorIdParamSchema = z.object({
  id: z.string().cuid("Invalid conductor id"),
});
