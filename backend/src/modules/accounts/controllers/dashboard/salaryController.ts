import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import { salaryPaymentSchema } from "../../../../validations/Module/AccountsDashboard/salaryValidation";

export async function recordSalaryPayment(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const parseResult = salaryPaymentSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: parseResult.error.errors });
    }
    const { teacherId, amount, period, method } = parseResult.data;

    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ message: "Unauthorized or missing school ID" });
    }

    const payment = await prisma.salaryPayment.create({
      data: {
        teacherId,
        schoolId: req.user.schoolId,
        amount,
        period,
        paymentDate: new Date(),
        method, // 'Cash' or 'Bank Transfer'
        status: "Success",
      },
    });

    res.status(201).json(payment);
  } catch (error) {
    next(handlePrismaError(error));
  }
}

export async function getSalaryPayments(req: Request, res: Response) {
  try {
    const { teacherId } = req.params;
    const payments = await prisma.salaryPayment.findMany({
      where: { teacherId },
    });
    res.json(payments);
  } catch (error) {
    console.error("Error fetching salary payments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
