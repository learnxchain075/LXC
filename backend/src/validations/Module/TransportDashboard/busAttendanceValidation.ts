import { z } from "zod";

export const createBusAttendanceSchema = z.object({
  studentId: z.string().cuid("Invalid student id"),
  busId: z.string().cuid("Invalid bus id"),
  status: z.string().min(1, "Status is required"),
});

export const updateBusAttendanceSchema = z.object({
  status: z.string().min(1, "Status is required"),
});

export const attendanceIdParamSchema = z.object({
  attendanceId: z.string().cuid("Invalid attendance id"),
});

export const busAttendanceStudentParamSchema = z.object({
  studentId: z.string().cuid("Invalid student id"),
});
