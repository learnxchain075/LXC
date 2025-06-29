import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createRoomSchema,
  updateRoomSchema,
  roomIdParamSchema,
} from "../../../../validations/Module/HostelDashboard/roomValidation";

// Create a new room
export const createRoom = async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
  const bodyResult = createRoomSchema.safeParse(req.body);
  try {
    if (!bodyResult.success) {
      return res.status(400).json({ error: bodyResult.error.errors });
    }

    const { number, type, status, hostelId } = bodyResult.data;
    const room = await prisma.room.create({
      data: { number, type, status, hostelId },
    });
    res.status(201).json(room);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all rooms
export const getAllRooms = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rooms = await prisma.room.findMany({
      include: { hostel: true, students: true, inventories: true },
    });
    res.json(rooms);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a single room by ID
export const getRoomById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = roomIdParamSchema.safeParse(req.params);
  try {
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    const room = await prisma.room.findUnique({
      where: { id },
      include: { hostel: true, students: true, inventories: true },
    });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    next(handlePrismaError(error));
  }
};



// Update a room
export const updateRoom = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = roomIdParamSchema.safeParse(req.params);
  const bodyResult = updateRoomSchema.safeParse(req.body);
  try {
    if (!paramsResult.success || !bodyResult.success) {
      return res.status(400).json({
        error: [
          ...(paramsResult.success ? [] : paramsResult.error.errors),
          ...(bodyResult.success ? [] : bodyResult.error.errors),
        ],
      });
    }

    const { id } = paramsResult.data;
    const { number, type, status, hostelId } = bodyResult.data;
    const room = await prisma.room.update({
      where: { id },
      data: { number, type, status, hostelId },
    });
    res.json(room);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete a room
export const deleteRoom = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = roomIdParamSchema.safeParse(req.params);
  try {
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    await prisma.room.delete({ where: { id } });
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
