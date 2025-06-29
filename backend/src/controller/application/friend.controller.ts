import { Request, Response } from 'express';
import { prisma } from '../../db/prisma';
import { z } from 'zod';

const sendFriendRequestSchema = z.object({
  receiverId: z.string(),
});

const acceptFriendRequestParamsSchema = z.object({
  id: z.string(),
});

const removeFriendParamsSchema = z.object({
  friendId: z.string(),
});

export const sendFriendRequest = async (req: Request, res: Response): Promise<any> => {
  try {
    const parseResult = sendFriendRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const senderId = req.user?.id;
    if (!senderId) {
      return res.status(400).json({ error: 'Invalid user' });
    }
    const { receiverId } = parseResult.data;

    const [sender, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { id: senderId }, include: { school: true } }),
      prisma.user.findUnique({ where: { id: receiverId }, include: { school: true } })
    ]);
    if (!sender || !receiver) return res.status(404).json({ error: 'User not found' });

    if (sender.schoolId === receiver.schoolId) {
      const friend = await prisma.friend.create({
        data: {
          user1Id: senderId < receiverId ? senderId : receiverId,
          user2Id: senderId < receiverId ? receiverId : senderId
        }
      });
      return res.json(friend);
    }

    const request = await prisma.friendRequest.create({
      data: { senderId, receiverId, status: 'PENDING' }
    });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const acceptFriendRequest = async (req: Request, res: Response): Promise<any> => {
  try {
    const paramsResult = acceptFriendRequestParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }
    const { id } = paramsResult.data;
    const request = await prisma.friendRequest.update({
      where: { id },
      data: { status: 'ACCEPTED' }
    });

    await prisma.friend.create({
      data: {
        user1Id: request.senderId < request.receiverId ? request.senderId : request.receiverId,
        user2Id: request.senderId < request.receiverId ? request.receiverId : request.senderId
      }
    });

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getFriends = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: 'Invalid user' });

    const friends = await prisma.friend.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }]
      },
      include: { user1: true, user2: true }
    });
    res.json(friends);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getFriendRequests = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: 'Invalid user' });

    const requests = await prisma.friendRequest.findMany({
      where: { receiverId: userId, status: 'PENDING' },
      include: { sender: true }
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const removeFriend = async (req: Request, res: Response): Promise<any> => {
  try {
    const paramsResult = removeFriendParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: 'Invalid user' });
    const { friendId } = paramsResult.data;

    const [id1, id2] = userId < friendId ? [userId, friendId] : [friendId, userId];
    await prisma.friend.delete({
      where: { user1Id_user2Id: { user1Id: id1, user2Id: id2 } }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
