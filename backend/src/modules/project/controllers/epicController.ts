import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../db/prisma';
import { handlePrismaError } from '../../../utils/prismaErrorHandler';
import {
  epicSchema,
  updateEpicSchema,
  epicIdParamSchema,
} from '../../../validations/Module/ProjectManagement/projectValidation';

export const createEpic = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const body = epicSchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ message: 'Validation error', errors: body.error.errors });
    }
    const epic = await prisma.epic.create({ data: body.data });
    res.status(201).json(epic);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getEpics = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const projectId = req.query.projectId as string | undefined;
    const epics = await prisma.epic.findMany({
      where: projectId ? { projectId } : undefined,
      include: {
        tasks: {
          include: { subtasks: true },
        },
      },
    });
    const result = epics.map(e => {
      const total = e.tasks.reduce((acc, t) => acc + t.subtasks.length, 0);
      const completed = e.tasks.reduce((acc, t) =>
        acc + t.subtasks.filter(st => st.status === 'DONE').length,
      0);
      const progress = total ? Math.round((completed / total) * 100) : 0;
      return { ...e, progress };
    });
    res.json(result);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateEpic = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = epicIdParamSchema.safeParse(req.params);
    const body = updateEpicSchema.safeParse(req.body);
    if (!params.success || !body.success) {
      return res.status(400).json({
        errors: [
          ...(params.success ? [] : params.error.errors),
          ...(body.success ? [] : body.error.errors),
        ],
      });
    }
    const { id } = params.data;
    const epic = await prisma.epic.update({ where: { id }, data: body.data });
    res.json(epic);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteEpic = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = epicIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    await prisma.epic.delete({ where: { id: params.data.id } });
    res.json({ message: 'Epic deleted successfully' });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
