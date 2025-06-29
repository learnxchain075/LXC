import { z } from "zod";

export const createRoomSchema = z.object({
  number: z.string().min(1, "Room number is required"),
  type: z.enum(["SINGLE", "DOUBLE", "TRIPLE"]),
  status: z.enum(["OCCUPIED", "VACANT", "MAINTENANCE"]).optional(),
  hostelId: z.string().cuid("Invalid hostel id"),
});

export const updateRoomSchema = z.object({
  number: z.string().min(1).optional(),
  type: z.enum(["SINGLE", "DOUBLE", "TRIPLE"]).optional(),
  status: z.enum(["OCCUPIED", "VACANT", "MAINTENANCE"]).optional(),
  hostelId: z.string().cuid("Invalid hostel id").optional(),
});

export const roomIdParamSchema = z.object({
  id: z.string().cuid("Invalid room id"),
});
