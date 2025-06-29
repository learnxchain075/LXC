import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import {
  schoolExpenseSchema,
  schoolExpenseUpdateSchema,
} from "../../../../validations/Module/AccountsDashboard/schoolExpenseValidation";

// Create a new school expense
export const createSchoolExpense = async (req: Request, res: Response): Promise<any> => {
  try {
    const parseResult = schoolExpenseSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const { categoryId, date, amount, description, invoiceNumber, paymentMethod, schoolId } = parseResult.data;

    const expense = await prisma.schoolExpense.create({
      data: {
        categoryId,
        date: new Date(date),
        amount,
        description,
        invoiceNumber,
        paymentMethod,
        schoolId,
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: "Failed to create school expense", details: error });
  }
};

// Get all expenses for a school
export const getSchoolExpenses = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.params;
    const expenses = await prisma.schoolExpense.findMany({
      where: { schoolId },
      include: {
        category: true,
      },
      orderBy: { date: "desc" },
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch school expenses", details: error });
  }
};

// Update an expense
export const updateSchoolExpense = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const parseResult = schoolExpenseUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const { categoryId, date, amount, description, invoiceNumber, paymentMethod } = parseResult.data;

    const updated = await prisma.schoolExpense.update({
      where: { id },
      data: {
        categoryId,
        date: new Date(date),
        amount,
        description,
        invoiceNumber,
        paymentMethod,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update expense", details: error });
  }
};

// Delete an expense
export const deleteSchoolExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.schoolExpense.delete({ where: { id } });
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete expense", details: error });
  }
};
