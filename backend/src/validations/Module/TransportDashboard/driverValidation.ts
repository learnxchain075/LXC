import { z } from "zod";

export const createDriverSchema = z.object({
  name: z.string().min(1, "Name is required"),
  license: z.string().min(1, "License is required"),
  busId: z.string().cuid("Invalid bus id"),
  schoolId: z.string().cuid("Invalid school id"),
});

export const updateDriverSchema = createDriverSchema.partial();

export const assignDriverSchema = z.object({
  busId: z.string().cuid("Invalid bus id"),
  driverId: z.string().cuid("Invalid driver id"),
});

export const driverIdParamSchema = z.object({
  id: z.string().cuid("Invalid driver id"),
});

export const driverSchoolIdParamSchema = z.object({
  schoolId: z.string().cuid("Invalid school id"),
});
