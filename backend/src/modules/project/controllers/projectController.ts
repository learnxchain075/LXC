import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../db/prisma';
import { handlePrismaError } from '../../../utils/prismaErrorHandler';
import { projectSchema, taskSchema, taskStatusSchema, commentSchema, updateProjectSchema, updateTaskSchema, projectIdParamSchema, taskIdParamSchema } from '../../../validations/Module/ProjectManagement/projectValidation';

export const createProject = async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
  try {
    const parsed = projectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Validation error', errors: parsed.error.errors });
    }
    const project = await prisma.project.create({ data: parsed.data });
    res.status(201).json(project);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getProjects = async (_req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const projects = await prisma.project.findMany({ include: { tasks: true } });
    res.json(projects);
  } catch (error) {
    next(handlePrismaError(error));
  }
};


export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const parsed = taskSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: 'Validation error', errors: parsed.error.errors });
    }

    // Ensure no undefined values are sent to Prisma
    const taskData = {
      ...parsed.data,
      description: parsed.data.description ?? "", // ✅ Ensure string
    };

    const task = await prisma.task.create({ data: taskData });
    res.status(201).json(task);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const projectId = req.query.projectId as string | undefined;
    const tasks = await prisma.task.findMany({
      where: projectId ? { projectId } : undefined,
      include: { comments: true },
    });
    res.json(tasks);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const parsed = taskStatusSchema.safeParse({ ...req.params, ...req.body });
    if (!parsed.success) {
      return res.status(400).json({ message: 'Validation error', errors: parsed.error.errors });
    }
    const { id, status } = parsed.data;
    const task = await prisma.task.update({ where: { id }, data: { status } });
    res.json(task);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const addComment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const parsed = commentSchema.safeParse({ ...req.params, ...req.body });
    if (!parsed.success) {
      return res.status(400).json({ message: 'Validation error', errors: parsed.error.errors });
    }
    const { id, authorId, content } = parsed.data;
    const comment = await prisma.comment.create({ data: { taskId: id, authorId, content } });
    res.status(201).json(comment);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
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
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
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
    const task = await prisma.task.update({ where: { id }, data: bodyResult.data });
    res.json(task);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const paramsResult = taskIdParamSchema.safeParse(req.params);

    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    await prisma.task.delete({ where: { id } });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
