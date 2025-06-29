import { PrismaClient } from '@prisma/client';
import twilio from 'twilio';
import nodemailer from 'nodemailer';
import { CONFIG } from '../config';
import Logger from '../utils/logger';

const prisma = new PrismaClient();

// Load env
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
} = process.env as {
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_PHONE_NUMBER: string;
  EMAIL_HOST: string;
  EMAIL_PORT: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
};

// Twilio setup
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Email setup
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: parseInt(EMAIL_PORT),
  secure: parseInt(EMAIL_PORT) === 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Send SMS
async function sendSMS(phone: string, message: string): Promise<void> {
  if (CONFIG.IS_DEVELOPMENT) {
    Logger.info(`SMS skipped (dev): ${phone} -> ${message}`);
    return;
  }

  try {
    const msg = await twilioClient.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: phone,
    });
    Logger.info(`SMS sent: ${msg.sid}`);
  } catch (error) {
    Logger.error('Failed to send SMS:', error);
  }
}

// Send Email
async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  if (CONFIG.IS_DEVELOPMENT) {
    Logger.info(`Email skipped (dev): ${to} - ${subject}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Reminder Service" <${EMAIL_USER}>`,
      to,
      subject,
      text: body,
    });
    Logger.info(`Email sent: ${to}`);
  } catch (error) {
    Logger.error('Failed to send email:', error);
  }
}

// Main Notification Logic
export async function sendNotifications(): Promise<void> {
  try {
    const now = new Date();
    const todayStr = now.toDateString();

    const upcomingFees = await prisma.fee.findMany({
      where: {
        status: 'PENDING',
        dueDate: {
          gte: now,
        },
      },
      include: {
        student: {
          include: { user: true },
        },
      },
    });

    const overdueFees = await prisma.fee.findMany({
      where: {
        status: 'OVERDUE',
        dueDate: {
          lt: now,
        },
      },
      include: {
        student: {
          include: { user: true },
        },
      },
    });

    // Handle upcoming due fees
    for (const fee of upcomingFees) {
      if (!fee.student?.user) continue;

      const dueDate = new Date(fee.dueDate);
      const twoDaysBefore = new Date(dueDate);
      twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);
      const isDueToday = dueDate.toDateString() === todayStr;

      if ((now >= twoDaysBefore && now < dueDate) || isDueToday) {
        const message = `Reminder: Your fee is due on ${dueDate.toDateString()}. Please pay before the deadline.`;
        await sendSMS(fee.student.user.phone, message);
        await sendEmail(fee.student.user.email, 'Fee Payment Reminder', message);

        await prisma.fee.update({
          where: { id: fee.id },
          data: { lastReminderSentAt: now },
        });
      }
    }

    // Handle overdue fees
    for (const fee of overdueFees) {
      if (!fee.student?.user) continue;

      const lastSent = fee.lastReminderSentAt ? new Date(fee.lastReminderSentAt) : null;
      const timeGap = 1000 * 60 * 60 * 8; // 8 hours
      const shouldSend = !lastSent || now.getTime() - lastSent.getTime() > timeGap;

      if (shouldSend) {
        const dueDate = new Date(fee.dueDate);
        const message = `Overdue Alert: Your school fee was due on ${dueDate.toDateString()}. Please pay immediately.`;

        await sendSMS(fee.student.user.phone, message);
        await sendEmail(fee.student.user.email, 'Overdue Fee Reminder', message);

        await prisma.fee.update({
          where: { id: fee.id },
          data: { lastReminderSentAt: now },
        });
      }
    }
  } catch (err) {
    Logger.error('Notification job failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}
