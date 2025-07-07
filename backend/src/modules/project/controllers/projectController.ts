import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";
import { uploadFile } from "../../../config/upload";
import {
  projectSchema,
  taskSchema,
  taskStatusSchema,
  commentSchema,
  commentIdParamSchema,
  updateCommentSchema,
  updateProjectSchema,
  updateTaskSchema,
  projectIdParamSchema,
  taskIdParamSchema,
  githubRepoSchema,
  githubBranchSchema,
  workflowSchema,
} from "../../../validations/Module/ProjectManagement/projectValidation";

export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const parsed = projectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation error", errors: parsed.error.errors });
    }
    const { workflow, ...projData } = parsed.data;
    const project = await prisma.project.create({ data: projData });
    if (workflow && workflow.length > 0) {
      const wf = await prisma.workflow.create({
        data: {
          projectId: project.id,
          stages: {
            create: workflow.map((s) => ({ name: s.name, order: s.order })),
          },
        },
        include: { stages: true },
      });
      return res.status(201).json({ ...project, workflow: wf });
    }
    res.status(201).json(project);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getProjects = async (_req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        tasks: { include: { stage: true } },
        githubRepos: true,
        workflow: { include: { stages: true } },
      },
    });
    res.json(projects);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const parsed = taskSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Validation error", errors: parsed.error.errors });
    }

    // Ensure no undefined values are sent to Prisma
    const taskData = {
      ...parsed.data,
      description: parsed.data.description ?? "", // ✅ Ensure string
    };

    const task = await prisma.task.create({
      data: taskData,
      include: { stage: true, parent: true, epic: true },
    });
    res.status(201).json(task);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const projectId = req.query.projectId as string | undefined;
    const sprintParam = req.query.sprintId as string | undefined;

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (typeof sprintParam !== "undefined") {
      where.sprintId = sprintParam === "null" ? null : sprintParam;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: { comments: true, sprint: true, stage: true, subtasks: true, parent: true, epic: true },
    });
    res.json(tasks);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getTask = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = taskIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const task = await prisma.task.findUnique({
      where: { id: params.data.id },
      include: { stage: true, subtasks: true, parent: true, epic: true, timelineLogs: true, comments: true, attachments: true },
    });
    res.json(task);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getTimelineLogs = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = taskIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const logs = await prisma.timelineLog.findMany({ where: { taskId: params.data.id }, orderBy: { timestamp: 'asc' } });
    res.json(logs);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const parsed = taskStatusSchema.safeParse({ ...req.params, ...req.body });
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation error", errors: parsed.error.errors });
    }
  const { id, stageId } = parsed.data;
    const task = await prisma.task.update({ where: { id }, data: { stageId }, include: { stage: true } });
    await prisma.timelineLog.create({
      data: {
        taskId: id,
        action: 'STATUS_CHANGE',
        details: `Moved to ${task.stage?.name ?? ''}`,
      },
    });
    res.json(task);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const addComment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const parsed = commentSchema.safeParse({ ...req.params, ...req.body });
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation error", errors: parsed.error.errors });
    }
    const { id, authorId, content } = parsed.data;
    const comment = await prisma.comment.create({ data: { taskId: id, authorId, content } });
    res.status(201).json(comment);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const params = commentIdParamSchema.safeParse(req.params);
    const body = updateCommentSchema.safeParse(req.body);
    if (!params.success || !body.success) {
      return res.status(400).json({
        errors: [
          ...(params.success ? [] : params.error.errors),
          ...(body.success ? [] : body.error.errors),
        ],
      });
    }
    const comment = await prisma.comment.update({
      where: { id: params.data.id },
      data: { content: body.data.content },
    });
    res.json(comment);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const params = commentIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    await prisma.comment.delete({ where: { id: params.data.id } });
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const addAttachment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const params = taskIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }
    const uploaded = await uploadFile(
      file.buffer,
      "Task_Attachments",
      "raw",
      file.originalname
    );
    const attachment = await prisma.attachment.create({
      data: {
        taskId: params.data.id,
        fileName: file.originalname,
        url: uploaded.url,
      },
    });
    res.status(201).json(attachment);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const paramsResult = projectIdParamSchema.safeParse(req.params);
    const bodyResult = updateProjectSchema.safeParse(req.body);

    if (!paramsResult.success || !bodyResult.success) {
      return res.status(400).json({
        error: [
          ...(paramsResult.success ? [] : paramsResult.error.errors),
          ...(bodyResult.success ? [] : bodyResult.error.errors),
        ],
      });
    }

    const { id } = paramsResult.data;
    const project = await prisma.project.update({ where: { id }, data: bodyResult.data });
    res.json(project);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const paramsResult = projectIdParamSchema.safeParse(req.params);

    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    await prisma.project.delete({ where: { id } });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const paramsResult = taskIdParamSchema.safeParse(req.params);
    const bodyResult = updateTaskSchema.safeParse(req.body);

    if (!paramsResult.success || !bodyResult.success) {
      return res.status(400).json({
        error: [
          ...(paramsResult.success ? [] : paramsResult.error.errors),
          ...(bodyResult.success ? [] : bodyResult.error.errors),
        ],
      });
    }

    const { id } = paramsResult.data;
    const existing = await prisma.task.findUnique({ where: { id } });
    const task = await prisma.task.update({ where: { id }, data: bodyResult.data });
    if (bodyResult.data.assignedToId && bodyResult.data.assignedToId !== existing?.assignedToId) {
      await prisma.timelineLog.create({
        data: {
          taskId: id,
          action: 'ASSIGNEE_CHANGE',
          details: `Assigned to ${bodyResult.data.assignedToId}`,
        },
      });
    } else {
      await prisma.timelineLog.create({
        data: { taskId: id, action: 'EDIT', details: 'Task updated' },
      });
    }
    res.json(task);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const paramsResult = taskIdParamSchema.safeParse(req.params);

    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    await prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const addGitHubRepo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = projectIdParamSchema.safeParse(req.params);
    const body = githubRepoSchema.safeParse(req.body);
    if (!params.success || !body.success) {
      return res.status(400).json({
        errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
      });
    }
    const repo = await prisma.gitHubRepo.create({
      data: { projectId: params.data.id, repoUrl: body.data.repoUrl },
    });
    res.status(201).json(repo);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const createGitHubBranch = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = taskIdParamSchema.safeParse(req.params);
    const body = githubBranchSchema.safeParse(req.body);
    if (!params.success || !body.success) {
      return res.status(400).json({
        errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
      });
    }
    const branch = await prisma.gitHubBranch.create({
      data: { taskId: params.data.id, ...body.data },
    });
    res.status(201).json(branch);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getWorkflow = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = projectIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const workflow = await prisma.workflow.findUnique({
      where: { projectId: params.data.id },
      include: { stages: true },
    });
    res.json(workflow);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateWorkflow = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const params = projectIdParamSchema.safeParse(req.params);
    const body = workflowSchema.safeParse(req.body);
    if (!params.success || !body.success) {
      return res.status(400).json({ errors: [ ...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors) ] });
    }
    await prisma.workflow.deleteMany({ where: { projectId: params.data.id } });
    const wf = await prisma.workflow.create({
      data: {
        projectId: params.data.id,
        stages: { create: body.data.map((s) => ({ name: s.name, order: s.order })) },
      },
      include: { stages: true },
    });
    res.json(wf);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const addProjectMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const params = projectIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const { userId, role } = req.body as { userId: string; role: string };
    const member = await prisma.projectMember.create({ data: { projectId: params.data.id, userId, role } });
    res.status(201).json(member);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const removeProjectMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const params = projectIdParamSchema.safeParse({ id: req.params.id });
    const userId = req.params.userId;
    if (!params.success || !userId) {
      return res.status(400).json({ errors: params.success ? [{ message: 'userId required' }] : params.error.errors });
    }
    await prisma.projectMember.delete({ where: { projectId_userId: { projectId: params.data.id, userId } } });
    res.json({ message: 'Removed' });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getCurrentProjectRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const params = projectIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const userId = req.user?.id;
    if (!userId) return res.status(403).json({ message: 'Forbidden' });
    const member = await prisma.projectMember.findUnique({ where: { projectId_userId: { projectId: params.data.id, userId } } });
    res.json({ role: member?.role || null });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
