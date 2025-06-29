import { z } from "zod";

export const createRouteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  busId: z.string().cuid("Invalid bus id"),
  schoolId: z.string().cuid("Invalid school id"),
});

export const updateRouteSchema = z.object({
  name: z.string().min(1).optional(),
  busId: z.string().cuid("Invalid bus id").optional(),
  schoolId: z.string().cuid("Invalid school id").optional(),
});

export const routeIdParamSchema = z.object({
  id: z.string().cuid("Invalid route id"),
});

export const routeSchoolIdParamSchema = z.object({
  schoolId: z.string().cuid("Invalid school id"),
});
