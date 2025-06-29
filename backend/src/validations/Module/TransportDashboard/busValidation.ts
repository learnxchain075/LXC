import { z } from "zod";

export const createBusSchema = z.object({
  busNumber: z.string().min(1, "Bus number is required"),
  capacity: z.number().int().positive(),
  schoolId: z.string().cuid("Invalid school id"),
});

export const updateBusSchema = z.object({
  busNumber: z.string().min(1).optional(),
  capacity: z.number().int().positive().optional(),
});

export const busIdParamSchema = z.object({
  id: z.string().cuid("Invalid bus id"),
});

export const busSchoolIdParamSchema = z.object({
  schoolId: z.string().cuid("Invalid school id"),
});
