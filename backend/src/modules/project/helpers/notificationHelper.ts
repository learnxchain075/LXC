import { prisma } from '../../../db/prisma';
import { TaskNotificationType } from '@prisma/client';

export const notifyWatchers = async (
  taskId: string,
  type: TaskNotificationType,
  message: string,
): Promise<void> => {
  const watchers = await prisma.taskWatcher.findMany({ where: { taskId } });
  if (!watchers.length) return;
  await prisma.taskNotification.createMany({
    data: watchers.map((w) => ({
      userId: w.userId,
      taskId,
      type,
      message,
    })),
  });
};
