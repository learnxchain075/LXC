import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../../../db/prisma";
import { handlePrismaError } from "../../../../../../utils/prismaErrorHandler";
import {
  createInventorySchema,
  updateInventorySchema,
} from "../../../../../../validations/Module/HostelDashboard/inventoryValidation";
import { schoolIdParamSchema, cuidSchema } from "../../../../../../validations/common/commonValidation";
import { z } from "zod";

/**
 * Get all inventory items for a school.
 */
export const getInventoryItems = async (req: Request, res: Response, next: NextFunction) => {
  const params = schoolIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return next(params.error);
  }
  const { schoolId } = params.data;
  try {
    const items = await prisma.inventoryItem.findMany({
      where: { schoolId },
      include: { transactions: true },
    });
    res.json(items);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

/**
 * Get a single inventory item by ID.
 */
export const getInventoryItemById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return next(params.error);
  }
  const { id } = params.data;
  try {
    const item = await prisma.inventoryItem.findUnique({
      where: { id },
      include: { transactions: true },
    });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

/**
 * Create a new inventory item.
 */
export const createInventoryItem = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const params = schoolIdParamSchema.safeParse(req.params);
  const body = createInventorySchema.extend({ description: z.string().optional() }).safeParse(req.body);
  if (!params.success || !body.success) {
    return res.status(400).json({
      errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
    });
  }
  const { schoolId } = params.data;
  const { name, description, quantity } = body.data;
  try {
    const item = await prisma.inventoryItem.create({
      data: { name, description, quantity, schoolId },
    });
    res.status(201).json(item);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

/**
 * Update an inventory item.
 */
export const updateInventoryItem = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  const body = updateInventorySchema.extend({ description: z.string().optional() }).safeParse(req.body);
  if (!params.success || !body.success) {
    return res.status(400).json({
      errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
    });
  }
  const { id } = params.data;
  const { name, description, quantity } = body.data;
  try {
    const item = await prisma.inventoryItem.update({
      where: { id },
      data: { name, description, quantity },
    });
    res.json(item);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

/**
 * Delete an inventory item.
 */
export const deleteInventoryItem = async (req: Request, res: Response, next: NextFunction) => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return next(params.error);
  }
  const { id } = params.data;
  try {
    await prisma.inventoryItem.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};

/**
 * Record an inventory transaction.
 */
export const recordInventoryTransaction = async (req: Request, res: Response, next: NextFunction) :Promise<any> => {
  const body = z
    .object({
      inventoryItemId: cuidSchema,
      type: z.enum(["ADD", "REMOVE"]),
      quantity: z.number().int(),
      userId: cuidSchema,
    })
    .safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }
  const { inventoryItemId, type, quantity, userId } = body.data;
  try {
    const transaction = await prisma.$transaction(async (prisma) => {
      const newTransaction = await prisma.inventoryTransaction.create({
        data: { inventoryItemId, type, quantity, userId },
      });

      if (type === "ADD") {
        await prisma.inventoryItem.update({
          where: { id: inventoryItemId },
          data: { quantity: { increment: quantity } },
        });
      } else if (type === "REMOVE") {
        await prisma.inventoryItem.update({
          where: { id: inventoryItemId },
          data: { quantity: { decrement: quantity } },
        });
      }
      return newTransaction;
    });

    res.status(201).json(transaction);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

/**
 * Get all transactions for a given inventory item.
 */
export const getInventoryTransactions = async (req: Request, res: Response, next: NextFunction) => {
  const params = z.object({ inventoryItemId: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return next(params.error);
  }
  const { inventoryItemId } = params.data;
  try {
    const transactions = await prisma.inventoryTransaction.findMany({
      where: { inventoryItemId },
      orderBy: { createdAt: "desc" },
    });
    res.json(transactions);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
