import { z } from "zod";

export const createAccommodationRequestSchema = z.object({
  studentId: z.string().cuid("Invalid student id"),
  hostelId: z.string().cuid("Invalid hostel id"),
});

export const updateAccommodationRequestSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export const accommodationRequestIdParamSchema = z.object({
  id: z.string().cuid("Invalid request id"),
});
