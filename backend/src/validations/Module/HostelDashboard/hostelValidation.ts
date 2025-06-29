import { z } from "zod";

export const createHostelSchema = z.object({
  hostelName: z.string().min(1, "Hostel name is required"),
  location: z.string().min(1).optional(),
  capacity: z.number().int().positive(),
  schoolId: z.string().cuid("Invalid school id"),
});

export const updateHostelSchema = z.object({
  hostelName: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  capacity: z.number().int().positive().optional(),
});

export const hostelIdParamSchema = z.object({
  id: z.string().cuid("Invalid hostel id"),
});
