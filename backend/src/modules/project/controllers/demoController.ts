import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../db/prisma';
import { handlePrismaError } from '../../../utils/prismaErrorHandler';

export const getDemoTasks = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await prisma.task.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: { stage: true, project: true },
    });
    res.json(tasks);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
