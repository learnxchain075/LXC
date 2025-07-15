import { Request, Response } from "express";
import { prisma } from "../../../db/prisma";

export const updateDriverLocation = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, speed, timestamp } = req.body;
    const driverId = req.user?.driverId;

    if (!driverId) {
      return res.status(403).json({ error: "Driver not authenticated" });
    }

    // Save new location to history
    await prisma.driverLocation.create({
      data: {
        driverId,
        latitude,
        longitude,
        speed,
        timestamp: new Date(timestamp),
      },
    });

    // Optionally update latest driver coordinates (for live map pin)
    await prisma.driver.update({
      where: { id: driverId },
      data: {
        currentLat: latitude,
        currentLng: longitude,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating driver location:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
