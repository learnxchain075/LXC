import { z } from 'zod';
import { TaskPriority, TaskStatus, IssueType } from '@prisma/client';

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  createdBy: z.string().cuid('Invalid user id'),
  workflow: z
    .array(
      z.object({
        name: z.string().min(1, 'Stage name is required'),
        order: z.number().int(),
      })
    )
    .optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(), // Keep optional
  projectId: z.string().cuid('Invalid project id'),
  assignedToId: z.string().cuid('Invalid user id').optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  stageId: z.string().cuid('Invalid stage id').optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  deadline: z.coerce.date().optional(),
  issueType: z.nativeEnum(IssueType).optional(),
  severity: z.number().int().min(1).max(5).optional(),
  storyPoints: z.number().int().min(1).optional(),
  createdById: z.string().cuid('Invalid user id'),
  sprintId: z.string().cuid('Invalid sprint id').optional(),
  parentId: z.string().cuid('Invalid task id').optional(),
  epicId: z.string().cuid('Invalid epic id').optional(),
});

export const taskStatusSchema = z.object({
  id: z.string().cuid('Invalid task id'),
  stageId: z.string().cuid('Invalid stage id'),
});

export const commentSchema = z.object({
  id: z.string().cuid('Invalid task id'),
  authorId: z.string().cuid('Invalid user id'),
  content: z.string().min(1, 'Comment cannot be empty'),
});

export const commentIdParamSchema = z.object({
  id: z.string().cuid('Invalid comment id'),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
});

export const projectIdParamSchema = z.object({
  id: z.string().cuid('Invalid project id'),
});

export const taskIdParamSchema = z.object({
  id: z.string().cuid('Invalid task id'),
});

export const updateProjectSchema = projectSchema.partial();

export const workflowSchema = z.array(
  z.object({
    name: z.string().min(1, 'Stage name is required'),
    order: z.number().int(),
  })
);

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

export const stageIdParamSchema = z.object({
  id: z.string().cuid('Invalid stage id'),
});

export const epicSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  projectId: z.string().cuid('Invalid project id'),
  createdById: z.string().cuid('Invalid user id'),
});

export const updateEpicSchema = epicSchema.partial();

export const epicIdParamSchema = z.object({
  id: z.string().cuid('Invalid epic id'),
});
