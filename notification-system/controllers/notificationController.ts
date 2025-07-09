import { Request, Response } from 'express';
import { prisma } from '../prismaClient';
import { sendManualNotification, triggerNotification } from '../services/notificationService';

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const data = await prisma.notificationTemplate.create({ data: { ...req.body, createdBy: (req as any).user.id } });
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getTemplates = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const where: any = {};
  if (user.role === 'SCHOOL_ADMIN') where.schoolId = user.schoolId;
  res.json(await prisma.notificationTemplate.findMany({ where }));
};

export const createChannel = async (req: Request, res: Response) => {
  try {
    const data = await prisma.notificationChannel.create({ data: req.body });
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getLogs = async (_req: Request, res: Response) => {
  res.json(await prisma.notificationLog.findMany());
};

export const sendNotification = async (req: Request, res: Response) => {
  try {
    await sendManualNotification({
      templateId: req.body.templateId,
      recipients: req.body.recipients,
      data: req.body.data,
      userId: (req as any).user.id,
      schoolId: (req as any).user.schoolId
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const trigger = async (req: Request, res: Response) => {
  try {
    await triggerNotification({
      triggerEvent: req.body.triggerEvent,
      schoolId: req.body.schoolId,
      data: req.body.data
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
