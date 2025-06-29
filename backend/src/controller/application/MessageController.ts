import { Request, Response } from 'express';
import { StreamChat } from 'stream-chat';
import { z } from 'zod';

const { STREAM_API_KEY, STREAM_API_SECRET } = process.env;

const chatClient = StreamChat.getInstance(STREAM_API_KEY!, STREAM_API_SECRET!);

const sendMessageSchema = z.object({
  channelId: z.string(),
  text: z.string(),
});

const forwardMessageSchema = z.object({
  originalId: z.string(),
  targetChannelId: z.string(),
});

const getMessagesParamsSchema = z.object({
  channelId: z.string(),
});

const editMessageParamsSchema = z.object({
  messageId: z.string(),
});

const editMessageBodySchema = z.object({
  newText: z.string(),
});

export const sendMessage = async (req: Request, res: Response): Promise<any> => {
  try {
    const parseResult = sendMessageSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: 'Invalid user' });
    }
    const { channelId, text } = parseResult.data;
    const channel = chatClient.channel('messaging', channelId);
    await channel.create();
    const message = await channel.sendMessage({ text, user_id: userId });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getMessages = async (req: Request, res: Response): Promise<any> => {
  try {
    const parseResult = getMessagesParamsSchema.safeParse(req.params);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const { channelId } = parseResult.data;
    const channel = chatClient.channel('messaging', channelId);
    const result = await channel.query({ messages: { limit: 50 } });
    res.json(result.messages);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const forwardMessage = async (req: Request, res: Response): Promise<any> => {
  try {
    const parseResult = forwardMessageSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: 'Invalid user' });
    }
    const { originalId, targetChannelId } = parseResult.data;
    const messageResponse = await chatClient.getMessage(originalId);
    const channel = chatClient.channel('messaging', targetChannelId);
    await channel.create();
    const result = await channel.sendMessage({ text: messageResponse.message.text, user_id: userId });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const editMessage = async (req: Request, res: Response) :Promise<any> => {
  try {
    const paramsResult = editMessageParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }
    const bodyResult = editMessageBodySchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({ error: bodyResult.error.errors });
    }
    const { messageId } = paramsResult.data;
    const { newText } = bodyResult.data;
    const updated = await chatClient.updateMessage({ id: messageId, text: newText });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
