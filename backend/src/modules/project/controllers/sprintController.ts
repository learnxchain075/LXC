import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../db/prisma';
import {
  sprintSchema,
  updateSprintSchema,
  sprintIdParamSchema,
  projectIdParamSchema,
  assignSprintSchema,
  taskIdParamSchema,
} from '../../../validations/Module/ProjectManagement/projectValidation';
import { handlePrismaError } from '../../../utils/prismaErrorHandler';

export const getSprints = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = projectIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const sprints = await prisma.sprint.findMany({ where: { projectId: params.data.id } });
    res.json(sprints);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const createSprint = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = projectIdParamSchema.safeParse(req.params);
    const body = sprintSchema.safeParse({ ...req.body, projectId: params.success ? params.data.id : undefined });
    if (!params.success || !body.success) {
      return res.status(400).json({
        errors: [ ...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors) ],
      });
    }
    const sprint = await prisma.sprint.create({ data: body.data });
    res.status(201).json(sprint);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateSprint = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = sprintIdParamSchema.safeParse(req.params);
    const body = updateSprintSchema.safeParse(req.body);
    if (!params.success || !body.success) {
      return res.status(400).json({
        errors: [ ...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors) ],
      });
    }
    const sprint = await prisma.sprint.update({ where: { id: params.data.id }, data: body.data });
    res.json(sprint);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteSprint = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = sprintIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    await prisma.sprint.delete({ where: { id: params.data.id } });
    res.json({ message: 'Sprint deleted successfully' });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const assignTaskSprint = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = taskIdParamSchema.safeParse(req.params);
    const body = assignSprintSchema.safeParse(req.body);
    if (!params.success || !body.success) {
      return res.status(400).json({
        errors: [ ...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors) ],
      });
    }
    const task = await prisma.task.update({ where: { id: params.data.id }, data: { sprintId: body.data.sprintId } });
    res.json(task);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
