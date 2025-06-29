import { Request, Response } from 'express';
import { prisma } from '../../db/prisma';
import { z } from 'zod';

const blockSchema = z.object({
  userId: z.string(),
});

export const blockUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const parseResult = blockSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const blockerId = req.user?.id;
    if (!blockerId) return res.status(400).json({ error: 'Invalid user' });
    const { userId } = parseResult.data;
    const block = await prisma.block.create({ data: { blockerId, blockedUserId: userId } });
    res.json(block);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const unblockUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const parseResult = blockSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const blockerId = req.user?.id;
    if (!blockerId) return res.status(400).json({ error: 'Invalid user' });
    const { userId } = parseResult.data;
    await prisma.block.delete({ where: { blockerId_blockedUserId: { blockerId, blockedUserId: userId } } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
