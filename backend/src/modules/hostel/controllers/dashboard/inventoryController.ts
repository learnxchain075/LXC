import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createInventorySchema,
  updateInventorySchema,
  inventoryIdParamSchema,
  roomIdParamSchema,
} from "../../../../validations/Module/HostelDashboard/inventoryValidation";

// Get all inventories for a specific room
export const getInventories = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = roomIdParamSchema.safeParse(req.params);
  try {
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { roomId } = paramsResult.data;
    const inventories = await prisma.inventory.findMany({ where: { roomId } });
    res.json(inventories);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a single inventory item by ID
export const getInventoryById = async (req: Request, res: Response, next: NextFunction) :Promise<any>=> {
  const paramsResult = inventoryIdParamSchema.safeParse(req.params);
  try {
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    const inventory = await prisma.inventory.findUnique({ where: { id } });
    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.json(inventory);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Create a new inventory item
export const createInventory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = roomIdParamSchema.safeParse(req.params);
  const bodyResult = createInventorySchema.safeParse(req.body);
  try {
    if (!paramsResult.success || !bodyResult.success) {
      return res.status(400).json({
        error: [
          ...(paramsResult.success ? [] : paramsResult.error.errors),
          ...(bodyResult.success ? [] : bodyResult.error.errors),
        ],
      });
    }

    const { roomId } = paramsResult.data;
    const { name, quantity } = bodyResult.data;
    const inventory = await prisma.inventory.create({
      data: { name, quantity, roomId },
    });
    res.status(201).json(inventory);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update an inventory item
export const updateInventory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = inventoryIdParamSchema.safeParse(req.params);
  const bodyResult = updateInventorySchema.safeParse(req.body);
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
    const { name, quantity } = bodyResult.data;
    const updatedInventory = await prisma.inventory.update({
      where: { id },
      data: { name, quantity },
    });
    res.json(updatedInventory);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete an inventory item
export const deleteInventory = async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
  const paramsResult = inventoryIdParamSchema.safeParse(req.params);
  try {
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    await prisma.inventory.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
