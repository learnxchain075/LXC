import { z } from "zod";

export const studentIdParamSchema = z.object({
  studentId: z.string().cuid("Invalid student id"),
});

export const assignTransportSchema = z.object({
  busId: z.string().cuid("Invalid bus id"),
  routeId: z.string().cuid("Invalid route id"),
  busStopId: z.string().cuid("Invalid bus stop id"),
});

export const updateTransportSchema = assignTransportSchema.partial();
