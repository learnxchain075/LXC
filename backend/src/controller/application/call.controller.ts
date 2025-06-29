// streamController.ts
import { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const { STREAM_API_KEY, STREAM_API_SECRET } = process.env;

if (!STREAM_API_KEY || !STREAM_API_SECRET) {
  throw new Error('Stream API credentials not set');
}

const BASE_URL = 'https://video.stream-io-api.com';

const createRoomSchema = z.object({
  callId: z.string(),
});

const generateTokenSchema = z.object({
  userId: z.string(),
  callId: z.string(),
});

export const createRoom = async (req: Request, res: Response):Promise<any> => {
  try {
    const parseResult = createRoomSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const { callId } = parseResult.data;

    const token = jwt.sign({}, STREAM_API_SECRET, {
      issuer: STREAM_API_KEY,
      expiresIn: '1h',
    });

    const result = await axios.post(
      `${BASE_URL}/video/call/default/${callId}`,
      { ring: false },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.status(200).json({ id: result.data.call.id });
  } catch (err: any) {
    console.error('createRoom error:', err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
};

export const generateToken = async (req: Request, res: Response):Promise<any> => {
  try {
    const parseResult = generateTokenSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const { userId, callId } = parseResult.data;

    const token = jwt.sign(
      {
        user_id: userId,
        call_id: callId,
      },
      STREAM_API_SECRET,
      {
        issuer: STREAM_API_KEY,
        expiresIn: '2h',
      }
    );

    res.status(200).json({ token });
  } catch (err: any) {
    console.error('generateToken error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
