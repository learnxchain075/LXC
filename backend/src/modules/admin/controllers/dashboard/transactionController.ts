import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../../../../validations/Module/AdminDashboard/transactionValidation";
import { cuidSchema } from "../../../../validations/common/commonValidation";
import { z } from "zod";

// Create a new transaction
export const createTransaction = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const parsed = createTransactionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.errors });
  }
  const { userId, coinsUsed, amountPaid, status } = parsed.data;
  try {
    const transaction = await prisma.transaction.create({
      data: { userId, coinsUsed, amountPaid, status: status || "PENDING" },
    });
    res.status(201).json(transaction);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all transactions for a user
export const getTransactionsByUserId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ userId: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { userId } = params.data;
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
    });
    res.status(200).json(transactions);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a single transaction by ID
export const getTransactionById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { id } = params.data;
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update a transaction
export const updateTransaction = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  const body = updateTransactionSchema.safeParse(req.body);
  if (!params.success || !body.success) {
    return res.status(400).json({
      errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
    });
  }
  const { id } = params.data;
  const { status } = body.data;
  try {
    const transaction = await prisma.transaction.update({
      where: { id },
      data: { status },
    });
    res.status(200).json(transaction);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete a transaction
export const deleteTransaction = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { id } = params.data;
  try {
    await prisma.transaction.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
