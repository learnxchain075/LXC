import { z } from "zod";

export const createComplaintSchema = z.object({
  description: z.string().min(1, "Description is required"),
  studentId: z.string().cuid("Invalid student id"),
  hostelId: z.string().cuid("Invalid hostel id"),
});

export const updateComplaintSchema = z.object({
  status: z.enum(["OPEN", "CLOSED"]).optional(),
  description: z.string().min(1).optional(),
});

export const complaintIdParamSchema = z.object({
  id: z.string().cuid("Invalid complaint id"),
});
