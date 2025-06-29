import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import { dateRangeQuerySchema } from "../../../../validations/Module/AccountsDashboard/reportValidation";




export async function getFeesCollected(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const parseResult = dateRangeQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({ message: "startDate and endDate are required" });
    }
    const { startDate, endDate } = parseResult.data;
    const payments = await prisma.payment.findMany({
      where: {
        status: "Success",
        paymentDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: { fee: true },
    });
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    res.json({ total, payments });
  } catch (error) {
    next(handlePrismaError(error));
  }
}

export async function getOutstandingFees(req: Request, res: Response, next: NextFunction) {
  try {
    const fees = await prisma.fee.findMany({
      where: { status: { not: "Paid" } },
      include: { Payment: true },
    });
    const outstanding = fees.map((fee) => {
      const paid = fee.Payment.filter((p) => p.status === "Success").reduce((sum, p) => sum + p.amount, 0);
      return { ...fee, outstandingAmount: fee.amount - paid };
    });
    const totalOutstanding = outstanding.reduce((sum, f) => sum + f.outstandingAmount, 0);
    res.json({ totalOutstanding, fees: outstanding });
  } catch (error) {
    next(handlePrismaError(error));
  }
}

export async function getSalaryPayments(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const parseResult = dateRangeQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({ message: "startDate and endDate are required" });
    }
    const { startDate, endDate } = parseResult.data;
    const payments = await prisma.salaryPayment.findMany({
      where: {
        status: "Success",
        paymentDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: { teacher: true },
    });
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    res.json({ total, payments });
  } catch (error) {
    next(handlePrismaError(error));
  }
}
