import { Request, Response } from "express";
import { prisma } from "../../../db/prisma";

// POST /api/notifications/send
export const sendDriverNotification = async (req: Request, res: Response) => {
  try {
    const { driverId, type, content } = req.body;

    const notification = await prisma.driverNotification.create({
      data: {
        driverId,
        type,
        content,
      },
    });

    // Emit via socket (if real-time connected)
    req.io?.to(`bus:${driverId}`).emit("notification", notification);

    return res.status(201).json({ notification });
  } catch (error) {
    console.error("Notification send error:", error);
    return res.status(500).json({ error: "Failed to send notification" });
  }
};

// GET /api/notifications
export const getDriverNotifications = async (req: Request, res: Response) => {
  try {
    const driverId = req.user?.driverId;

    if (!driverId) return res.status(403).json({ error: "Unauthorized" });

    const notifications = await prisma.driverNotification.findMany({
      where: { driverId },
      orderBy: { sentAt: "desc" },
    });

    return res.status(200).json({ notifications });
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// PATCH /api/notifications/read/:id
export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updated = await prisma.driverNotification.update({
      where: { id },
      data: { isRead: true },
    });

    return res.status(200).json({ updated });
  } catch (error) {
    console.error("Mark read error:", error);
    return res.status(500).json({ error: "Failed to update notification" });
  }
};
