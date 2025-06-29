import { Request, Response } from 'express';
import { prisma } from '../../db/prisma';
import { StreamChat } from 'stream-chat';
import { z } from 'zod';

const { STREAM_API_KEY, STREAM_API_SECRET } = process.env;
const chatClient = StreamChat.getInstance(STREAM_API_KEY!, STREAM_API_SECRET!);

const createGroupSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

const groupIdParamsSchema = z.object({
  groupId: z.string(),
});

const addGroupMemberBodySchema = z.object({
  userId: z.string(),
});

const removeGroupMemberParamsSchema = z.object({
  groupId: z.string(),
  userId: z.string(),
});

export const createGroup = async (req: Request, res: Response): Promise<any> => {
  try {
    const parseResult = createGroupSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const ownerId = req.user?.id;
    if (!ownerId) return res.status(400).json({ error: 'Invalid user' });
    const { name, description } = parseResult.data;

    const group = await prisma.group.create({
      data: {
        name,
        description,
        ownerId,
        members: { create: { userId: ownerId } }
      }
    });

    const channel = chatClient.channel('messaging', `group-${group.id}`, {
      members: [ownerId]
    });
    await channel.create();

    res.json(group);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const addGroupMember = async (req: Request, res: Response) :Promise<any> => {
  try {
    const paramsResult = groupIdParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }
    const bodyResult = addGroupMemberBodySchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({ error: bodyResult.error.errors });
    }
    const { groupId } = paramsResult.data;
    const { userId } = bodyResult.data;
    const member = await prisma.groupMember.create({ data: { groupId, userId } });

    const channel = chatClient.channel('messaging', `group-${groupId}`);
    await channel.addMembers([userId]);

    res.json(member);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const removeGroupMember = async (req: Request, res: Response):Promise<any> => {
  try {
    const paramsResult = removeGroupMemberParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }
    const { groupId, userId } = paramsResult.data;
    await prisma.groupMember.delete({ where: { groupId_userId: { groupId, userId } } });

    const channel = chatClient.channel('messaging', `group-${groupId}`);
    await channel.removeMembers([userId]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getGroupMessages = async (req: Request, res: Response):Promise<any> => {
  try {
    const paramsResult = groupIdParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }
    const { groupId } = paramsResult.data;
    const channel = chatClient.channel('messaging', `group-${groupId}`);
    const result = await channel.query({ messages: { limit: 50 } });
    res.json(result.messages);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
