import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createHostelExpenseSchema,
  updateHostelExpenseSchema,
  hostelExpenseIdParamSchema,
} from "../../../../validations/Module/HostelDashboard/hostelExpenseValidation";

export const getHostelExpenses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expenses = await prisma.hostelExpense.findMany();
    res.json(expenses);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getHostelExpenseById = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const paramsResult = hostelExpenseIdParamSchema.safeParse(req.params);
  try {
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    const expense = await prisma.hostelExpense.findUnique({
      where: { id },
    });

    if (!expense) {
      return res.status(404).json({ message: "Hostel Expense not found" });
    }

    res.json(expense);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const createHostelExpense = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const bodyResult = createHostelExpenseSchema.safeParse(req.body);
  try {
    if (!bodyResult.success) {
      return res.status(400).json({ error: bodyResult.error.errors });
    }

    const { description, amount, date, hostelId } = bodyResult.data;
    const expense = await prisma.hostelExpense.create({
      data: { description, amount, date, hostelId },
    });
    res.status(201).json(expense);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateHostelExpense = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = hostelExpenseIdParamSchema.safeParse(req.params);
  const bodyResult = updateHostelExpenseSchema.safeParse(req.body);
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
    const { description, amount, date, hostelId } = bodyResult.data;
    const expense = await prisma.hostelExpense.update({
      where: { id },
      data: { description, amount, date, hostelId },
    });

    res.json(expense);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteHostelExpense = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = hostelExpenseIdParamSchema.safeParse(req.params);
  try {
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }

    const { id } = paramsResult.data;
    await prisma.hostelExpense.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
