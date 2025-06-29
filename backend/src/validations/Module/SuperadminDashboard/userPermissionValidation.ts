import { z } from "zod";

export const sharePermissionSchema = z.object({
  fromUserId: z.string().cuid("Invalid user ID"),
  toUserId: z.string().cuid("Invalid user ID"),
});

export const updatePermissionsSchema = z.object({
  permissions: z.array(
    z.object({
      id: z.string().optional(),
      module: z.string(),
      permission: z.object({
        create: z.number().int().min(0).max(1),
        read: z.number().int().min(0).max(1),
        update: z.number().int().min(0).max(1),
        delete: z.number().int().min(0).max(1),
        managePermissions: z.number().int().min(0).max(1).optional(),
      }),
    })
  ),
});

export const userIdParamSchema = z.object({
  userId: z.string().cuid("Invalid user ID"),
});
