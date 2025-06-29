import { z } from "zod";

export const createPickUpPointSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  routeId: z.string().cuid("Invalid route id"),
  schoolId: z.string().cuid("Invalid school id"),
});

export const updatePickUpPointSchema = z.object({
  name: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  routeId: z.string().cuid("Invalid route id").optional(),
});

export const pickUpPointIdParamSchema = z.object({
  id: z.string().cuid("Invalid pickup point id"),
});

export const pickUpPointSchoolIdParamSchema = z.object({
  schoolId: z.string().cuid("Invalid school id"),
});
