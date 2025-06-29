import { Request, Response } from 'express';
import { prisma } from '../../db/prisma';
import { z } from 'zod';

const reportUserSchema = z.object({
  userId: z.string(),
  reason: z.string(),
});

export const reportUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const parseResult = reportUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const reporterId = req.user?.id;
    if (!reporterId) return res.status(400).json({ error: 'Invalid user' });
    const { userId, reason } = parseResult.data;
    const report = await prisma.report.create({ data: { reporterId, reportedUserId: userId, reason } });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
