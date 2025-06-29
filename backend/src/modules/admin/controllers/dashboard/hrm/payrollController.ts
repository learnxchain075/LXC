import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../../db/prisma";
import { handlePrismaError } from "../../../../../utils/prismaErrorHandler";
import {
  createPayrollSchema,
  updatePayrollSchema,
} from "../../../../../validations/Module/AdminDashboard/payrollValidation";
import { schoolIdParamSchema, cuidSchema } from "../../../../../validations/common/commonValidation";
import { z } from "zod";

// Get all payrolls for a specific school
export const getPayrolls = async (req: Request, res: Response, next: NextFunction) => {
  const params = schoolIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return next(handlePrismaError(params.error));
  }
  const { schoolId } = params.data;
  try {
    const payrolls = await prisma.payroll.findMany({
      where: { schoolId },
      include: { user: { select: { id: true, name: true } } },
    });
    res.json(payrolls);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a specific payroll by ID
export const getPayrollById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return next(handlePrismaError(params.error));
  }
  const { id } = params.data;
  try {
    const payroll = await prisma.payroll.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true } } },
    });
    if (!payroll) return res.status(404).json({ error: "Payroll not found" });
    res.json(payroll);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Create a new payroll record
export const createPayroll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = schoolIdParamSchema.safeParse(req.params);
  const body = createPayrollSchema.safeParse(req.body);
  if (!params.success || !body.success) {
    return res.status(400).json({
      errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
    });
  }
  const { schoolId } = params.data;
  const { userId, periodStart, periodEnd, grossSalary, deductions } = body.data;
  try {
    const netSalary = grossSalary - (deductions || 0);
    const payroll = await prisma.payroll.create({
      data: {
        userId,
        schoolId,
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        grossSalary,
        deductions: deductions || 0,
        netSalary,
      },
    });
    res.status(201).json(payroll);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update an existing payroll record
export const updatePayroll = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  const body = updatePayrollSchema.safeParse(req.body);
  if (!params.success || !body.success) {
    return res.status(400).json({
      errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
    });
  }
  const { id } = params.data;
  const { grossSalary, deductions, paymentDate, status } = body.data;
  try {
    const existingPayroll = await prisma.payroll.findUnique({ where: { id } });
    if (!existingPayroll) return res.status(404).json({ error: "Payroll not found" });

    const netSalary = grossSalary - (deductions || existingPayroll.deductions);
    const payroll = await prisma.payroll.update({
      where: { id },
      data: {
        grossSalary,
        deductions,
        netSalary,
        paymentDate: paymentDate ? new Date(paymentDate) : undefined,
        status,
      },
    });
    res.json(payroll);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete a payroll record
export const deletePayroll = async (req: Request, res: Response, next: NextFunction) => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return next(handlePrismaError(params.error));
  }
  const { id } = params.data;
  try {
    await prisma.payroll.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
