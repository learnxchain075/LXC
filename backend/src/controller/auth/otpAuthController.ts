import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../db/prisma';
import { generateOTP } from '../../utils/common_utils';
import { renderAndSendEmail } from '../../utils/mailer';
import { sendSMS, sendEmail } from '../../services/notification';
import { getJwtToken } from '../../utils/jwt_utils';
import { CONFIG } from '../../config';

export const requestOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, phone } = req.body as { email?: string; phone?: string };
    if (!email && !phone) {
      res.status(400).json({ error: 'Email or phone is required' });
      return;
    }
    const user = await prisma.user.findFirst({ where: { OR: [ { email }, { phone } ] } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    await prisma.otpToken.deleteMany({ where: { userId: user.id, used: false } });
    const otp = await generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await prisma.otpToken.create({
      data: {
        userId: user.id,
        otpHash,
        expiresAt,
      },
    });
    const message = `Your login OTP is ${otp}`;
    if (user.phone) {
      await sendSMS(user.phone, message);
    }
    if (user.email) {
      await sendEmail(user.email, 'Your OTP Code', message);
      await renderAndSendEmail('send-otp', { otp }, 'Your OTP Code', user.email);
    }
    res.status(200).json({ success: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

export const loginWithOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, phone, otp } = req.body as { email?: string; phone?: string; otp: string };
    if (!otp || (!email && !phone)) {
      res.status(400).json({ error: 'Email/phone and OTP are required' });
      return;
    }
    const user = await prisma.user.findFirst({ where: { OR: [ { email }, { phone } ] }, include: { school: true } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const record = await prisma.otpToken.findFirst({
      where: { userId: user.id, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!record) {
      res.status(400).json({ error: 'OTP expired or invalid' });
      return;
    }
    const match = await bcrypt.compare(otp, record.otpHash);
    if (!match) {
      res.status(400).json({ error: 'Invalid OTP' });
      return;
    }
    await prisma.otpToken.update({ where: { id: record.id }, data: { used: true } });
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
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
};

// alias for newer route name
export const verifyOtp = loginWithOtp;
