import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../../db/prisma';
import { getJwtToken } from '../../utils/jwt_utils';
import { CONFIG } from '../../config';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleSignIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body as { idToken: string };
    if (!idToken) {
      res.status(400).json({ error: 'idToken is required' });
      return;
    }
    const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ error: 'Invalid Google token' });
      return;
    }
    const user = await prisma.user.findUnique({ where: { email: payload.email }, include: { school: true } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const accessToken = await getJwtToken(
      { userId: user.id, email: user.email, role: user.role, schoolId: user.school?.id || null },
      CONFIG.JWT_LOGIN_TOKEN_EXPIRY_TIME,
      false
    );
    const refreshToken = await getJwtToken(
      { userId: user.id, email: user.email, role: user.role, schoolId: user.school?.id || null },
      CONFIG.JWT_REFRESH_TOKEN_EXPIRY_TIME,
      true
    );
    res.status(200).json({ success: 'ok', accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: 'Google login failed' });
  }
};
