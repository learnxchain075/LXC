import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';
import { ProjectRole } from '@prisma/client';

export const requireProjectRole = (paramName: string, roles: ProjectRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = req.params[paramName];
      const userId = req.user?.id;
      if (!projectId || !userId) return res.status(403).json({ message: 'Forbidden' });
      const member = await prisma.projectMember.findUnique({ where: { projectId_userId: { projectId, userId } } });
      if (!member || !roles.includes(member.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export const requireTaskAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.id;
    const userId = req.user?.id;
    if (!taskId || !userId) return res.status(403).json({ message: 'Forbidden' });
    const task = await prisma.task.findUnique({ where: { id: taskId }, select: { projectId: true } });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const member = await prisma.projectMember.findUnique({ where: { projectId_userId: { projectId: task.projectId, userId } } });
    if (!member || member.role !== ProjectRole.ADMIN) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const requireSprintAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sprintId = req.params.id;
    const userId = req.user?.id;
    if (!sprintId || !userId) return res.status(403).json({ message: 'Forbidden' });
    const sprint = await prisma.sprint.findUnique({ where: { id: sprintId }, select: { projectId: true } });
    if (!sprint) return res.status(404).json({ message: 'Sprint not found' });
    const member = await prisma.projectMember.findUnique({ where: { projectId_userId: { projectId: sprint.projectId, userId } } });
    if (!member || member.role !== ProjectRole.ADMIN) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  } catch (err) {
    next(err);
  }
};
