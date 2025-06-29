import { z } from "zod";

export const createMedicalEmergencySchema = z.object({
  description: z.string().min(1, "Description is required"),
  date: z.coerce.date(),
  studentId: z.string().cuid("Invalid student id"),
  hostelId: z.string().cuid("Invalid hostel id"),
});

export const updateMedicalEmergencySchema = z.object({
  description: z.string().min(1).optional(),
  date: z.coerce.date().optional(),
  studentId: z.string().cuid("Invalid student id").optional(),
  hostelId: z.string().cuid("Invalid hostel id").optional(),
});

export const medicalEmergencyIdParamSchema = z.object({
  id: z.string().cuid("Invalid emergency id"),
});
