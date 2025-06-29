import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import {
  expenseCategorySchema,
  expenseCategoryUpdateSchema,
} from "../../../../validations/Module/AccountsDashboard/schoolExpenseCategoryValidation";

// Create a new expense category
export const createSchoolExpenseCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const parseResult = expenseCategorySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const { name, schoolId } = parseResult.data;
    const category = await prisma.schoolExpenseCategory.create({
      data: {
        name,
        schoolId,
      },
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to create expense category", details: error });
  }
};

// Get all categories for a school
export const getSchoolExpenseCategories = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.params;
    const categories = await prisma.schoolExpenseCategory.findMany({
      where: { schoolId },
      orderBy: { createdAt: "desc" },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories", details: error });
  }
};

// Update a category
export const updateSchoolExpenseCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const parseResult = expenseCategoryUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const { name } = parseResult.data;
    const updated = await prisma.schoolExpenseCategory.update({
      where: { id },
      data: { name },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update category", details: error });
  }
};

// Delete a category
export const deleteSchoolExpenseCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.schoolExpenseCategory.delete({ where: { id } });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category", details: error });
  }
};
