import { z } from 'zod';
import { TaskPriority, TaskStatus } from '@prisma/client';

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  createdBy: z.string().cuid('Invalid user id'),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(), // Keep optional
  projectId: z.string().cuid('Invalid project id'),
  assignedToId: z.string().cuid('Invalid user id').optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  deadline: z.coerce.date().optional(),
  createdById: z.string().cuid('Invalid user id'),
  sprintId: z.string().cuid('Invalid sprint id').optional(),
});

export const taskStatusSchema = z.object({
  id: z.string().cuid('Invalid task id'),
  status: z.nativeEnum(TaskStatus),
});

export const commentSchema = z.object({
  id: z.string().cuid('Invalid task id'),
  authorId: z.string().cuid('Invalid user id'),
  content: z.string().min(1, 'Comment cannot be empty'),
});

export const projectIdParamSchema = z.object({
  id: z.string().cuid('Invalid project id'),
});

export const taskIdParamSchema = z.object({
  id: z.string().cuid('Invalid task id'),
});

export const updateProjectSchema = projectSchema.partial();

export const updateTaskSchema = taskSchema.partial();

export const githubRepoSchema = z.object({
  repoUrl: z.string().url('Invalid repository url'),
});

export const githubBranchSchema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  prUrl: z.string().url('Invalid PR url').optional(),
  status: z.string().optional(),
});

export const sprintSchema = z.object({
  name: z.string().min(1, 'Sprint name is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  projectId: z.string().cuid('Invalid project id'),
});

export const updateSprintSchema = sprintSchema.partial();

export const sprintIdParamSchema = z.object({
  id: z.string().cuid('Invalid sprint id'),
});

export const assignSprintSchema = z.object({
  sprintId: z.string().cuid('Invalid sprint id').nullable(),
});
