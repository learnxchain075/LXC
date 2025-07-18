import { Request, Response } from "express";
import { prisma } from "../../../db/prisma";


// Get bus route by busId
export const getBusRoute = async (req: Request, res: Response) :Promise<any> => {
  try {
    const { busId } = req.params;

    const route = await prisma.route.findFirst({
      where: { busId },
      include: {
        busStops: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!route) {
      return res.status(404).json({ error: "Route not found for this bus" });
    }

    return res.status(200).json({ route });
  } catch (error) {
    console.error("Error fetching bus route:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// Start Bus Route Controller

export const startDriverRoute = async (req: Request, res: Response):Promise<any> => {
  try {
    const driverId = req.user?.id;

    if (!driverId) return res.status(403).json({ error: "Unauthorized" });

    const updated = await prisma.driver.update({
      where: { id: driverId },
      data: {
        routeActive: true,
      },
    });

    return res.status(200).json({ status: "started", updated });
  } catch (error) {
    console.error("Start Route Error:", error);
    return res.status(500).json({ error: "Failed to start route" });
  }
};


// Bus Stop Controller


export const stopDriverRoute = async (req: Request, res: Response) :Promise<any> => {
  try {
    const driverId = req.user?.id;

    if (!driverId) return res.status(403).json({ error: "Unauthorized" });

    const updated = await prisma.driver.update({
      where: { id: driverId },
      data: {
        routeActive: false,
      },
    });

    return res.status(200).json({ status: "stopped", updated });
  } catch (error) {
    console.error("Stop Route Error:", error);
    return res.status(500).json({ error: "Failed to stop route" });
  }
};


// Get Route Status Controller


export const getRouteStatus = async (req: Request, res: Response) :Promise<any> => {
  try {
    const { busId } = req.params;

    const driver = await prisma.driver.findFirst({
      where: { busId },
      select: { routeActive: true },
    });

    if (!driver) return res.status(404).json({ error: "Driver not found" });

    return res.status(200).json({ active: driver.routeActive });
  } catch (error) {
    console.error("Status Error:", error);
    return res.status(500).json({ error: "Failed to fetch route status" });
  }
};
