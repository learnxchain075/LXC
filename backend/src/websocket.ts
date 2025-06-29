import { WebSocketServer } from 'ws';
import { prisma } from './db/prisma';
import { handleMessage, onlineUsers } from './utils/message.handler';


export function setupWebSocket(server: any) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    const userId = authenticateUser(req);
    if (!userId) return ws.close();

    onlineUsers.set(userId, ws);
    updateUserOnlineStatus(userId, true);
    processOfflineMessages(userId);

    ws.on('message', async (data) => {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case 'message':
          await handleMessage(message, userId);
          break;
        case 'read_receipt':
          await handleReadReceipt(message.messageId, userId);
          break;
        case 'edit':
          await editMessage(message.messageId, message.newContent);
          break;
      }
    });

    ws.on('close', () => {
      onlineUsers.delete(userId);
      updateUserOnlineStatus(userId, false);
    });
  });
}

function authenticateUser(req: any): string | null {
  return req.headers['x-user-id'] || null;
}

async function updateUserOnlineStatus(userId: string, isOnline: boolean) {
  await prisma.user.update({
    where: { id: userId },
    data: { lastOnline: isOnline ? null : new Date() }
  });
}

async function processOfflineMessages(userId: string) {
  const messages = await prisma.offlineMessage.findMany({ where: { userId } });
  const ws = onlineUsers.get(userId);
  for (const msg of messages) {
    ws?.send(JSON.stringify(msg));
    await prisma.offlineMessage.delete({ where: { id: msg.id } });
  }
}

async function handleReadReceipt(messageId: string, userId: string) {
  await prisma.message.update({
    where: { id: messageId },
    data: { isRead: true, readAt: new Date() }
  });
}

async function editMessage(messageId: string, newContent: string) {
  const message = await prisma.message.findUnique({ where: { id: messageId } });
  if (!message) throw new Error('Message not found');

  const TEN_MINUTES = 10 * 60 * 1000;
  if (Date.now() - new Date(message.createdAt).getTime() > TEN_MINUTES) {
    throw new Error('Edit window expired');
  }

  return prisma.message.update({
    where: { id: messageId },
    data: { content: newContent }
  });
}
