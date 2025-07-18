import { prisma } from "../../../notification-system/prismaClient";
import { replacePlaceholders } from "../utils/templateEngine";
import { sendEmail } from "./emailService";
import { sendSMS } from "./smsService";
import { sendWhatsApp } from "./whatsappService";
import { NotificationType, NotificationStatus } from "@prisma/client";

interface SendManualInput {
  templateId: string;
  recipients: string[];
  data: Record<string, any>;
  userId: string;
  schoolId: string;
}

export async function sendManualNotification(input: SendManualInput) {
  const template = await prisma.notificationTemplate.findFirst({
    where: {
      id: input.templateId,
      OR: [{ schoolId: input.schoolId }, { schoolId: null }],
    },
  });
  if (!template) throw new Error("Template not found");

  const channel = await prisma.notificationChannel.findFirst({
    where: {
      schoolId: input.schoolId,
      type: template.type,
      isActive: true,
    },
  });
  if (!channel) throw new Error("No active channel");

  const message = replacePlaceholders(template.content, input.data);

  await Promise.allSettled(
    input.recipients.map(async (recipient) => {
      try {
        if (template.type === NotificationType.EMAIL) {
          await sendEmail(recipient, template.name, message, channel.config as any);
        } else if (template.type === NotificationType.SMS) {
          await sendSMS(recipient, message, channel.config as any);
        } else if (template.type === NotificationType.WHATSAPP) {
          await sendWhatsApp(recipient, message, channel.config as any);
        }
        await prisma.notificationLog.create({
          data: {
            recipient,
            type: template.type,
            message,
            status: NotificationStatus.SENT,
            channelUsed: channel.provider,
            schoolId: input.schoolId,
            sentBy: input.userId,
          },
        });
      } catch (err) {
        await prisma.notificationLog.create({
          data: {
            recipient,
            type: template.type,
            message,
            status: NotificationStatus.FAILED,
            channelUsed: channel.provider,
            schoolId: input.schoolId,
            sentBy: input.userId,
          },
        });
      }
    })
  );
}

interface TriggerInput {
  triggerEvent: string;
  schoolId: string;
  data: Record<string, any>;
}

export async function triggerNotification(input: TriggerInput) {
  const template = await prisma.notificationTemplate.findFirst({
    where: {
      triggerEvent: input.triggerEvent,
      isAutomated: true,
      OR: [{ schoolId: input.schoolId }, { schoolId: null }],
    },
  });
  if (!template) return;
  await sendManualNotification({
    templateId: template.id,
    recipients: [input.data.recipient],
    data: input.data,
    userId: "system",
    schoolId: input.schoolId,
  });
}
