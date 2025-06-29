import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import {
  schoolIncomeSchema,
  schoolIncomeUpdateSchema,
} from "../../../../validations/Module/AccountsDashboard/schoolIncomeValidation";

// Create a new income record
export const createSchoolIncome = async (req: Request, res: Response): Promise<any> => {
  try {
    const parseResult = schoolIncomeSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const { source, date, amount, description, invoiceNumber, paymentMethod, schoolId } = parseResult.data;

    const income = await prisma.schoolIncome.create({
      data: {
        source,
        date: new Date(date),
        amount,
        description,
        invoiceNumber,
        paymentMethod,
        schoolId,
      },
    });

    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ error: "Failed to create school income", details: error });
  }
};

// Get all income records
export const getAllSchoolIncome = async (req: Request, res: Response) => {
  try {
    const incomeList = await prisma.schoolIncome.findMany({
      orderBy: { date: "desc" },
    });

    res.json(incomeList);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch school income records", details: error });
  }
};

// Get income record by ID
export const getSchoolIncomeById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const income = await prisma.schoolIncome.findUnique({ where: { id } });

    if (!income) {
      return res.status(404).json({ error: "Income record not found" });
    }

    res.json(income);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch income record", details: error });
  }
};

// Update income record
export const updateSchoolIncome = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const parseResult = schoolIncomeUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const { source, date, amount, description, invoiceNumber, paymentMethod } = parseResult.data;

    const updatedIncome = await prisma.schoolIncome.update({
      where: { id },
      data: {
        source,
        date: new Date(date),
        amount,
        description,
        invoiceNumber,
        paymentMethod,
      },
    });

    res.json(updatedIncome);
  } catch (error) {
    res.status(500).json({ error: "Failed to update income record", details: error });
  }
};

// Delete income record
export const deleteSchoolIncome = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.schoolIncome.delete({ where: { id } });
    res.json({ message: "Income record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete income record", details: error });
  }
};

// Get income records by school ID

export const getSchoolIncomeBySchoolId = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.params;
    const incomeList = await prisma.schoolIncome.findMany({
      where: { schoolId },
      orderBy: { date: "desc" },
    });

    res.json(incomeList);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch income records for the school", details: error });
  }
};
