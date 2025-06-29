import { z } from "zod";

export const createInventorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.number().int().positive(),
});

export const updateInventorySchema = z.object({
  name: z.string().min(1).optional(),
  quantity: z.number().int().positive().optional(),
});

export const inventoryIdParamSchema = z.object({
  id: z.string().cuid("Invalid inventory id"),
});

export const roomIdParamSchema = z.object({
  roomId: z.string().cuid("Invalid room id"),
});
