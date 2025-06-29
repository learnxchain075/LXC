import { z } from "zod";

export const schoolIdParamSchema = z.object({
  schoolId: z.string().cuid("Invalid school id"),
});

export const parentIdParamSchema = z.object({
  id: z.string().cuid("Invalid parent id"),
});

export const parentIdOnlySchema = z.object({
  parentId: z.string().cuid("Invalid parent id"),
});
