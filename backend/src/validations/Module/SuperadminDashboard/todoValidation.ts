import {  TodoStatus } from "@prisma/client";
import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
    status: z.nativeEnum(TodoStatus),
  userId: z.string().cuid("Invalid User ID"),
  schoolId: z.string().cuid("Invalid School ID"),
});

export const updateTodoSchema = todoSchema.partial({
  title: true,
  description: true,
  status: true,
});

export const todoIdParamSchema = z.object({
  id: z.string().cuid("Invalid Todo ID"),
});
