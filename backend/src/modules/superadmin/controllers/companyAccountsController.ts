import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { uploadFile } from "../../../services/cloudinaryService";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";
import {
  companyTransactionSchema,
  companyTransactionUpdateSchema,
  companyTransactionIdSchema,
  companyTransactionFilterSchema,
} from "../../../validations/Module/SuperadminDashboard/companyAccountsValidation";

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = companyTransactionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
    }
    const data = parsed.data;
    let billUrl: string | undefined;
    if (req.file && req.file.buffer) {
      const upload = await uploadFile(req.file.buffer, "company_bills", "raw", req.file.originalname);
      billUrl = upload.url;
    }
    const transaction = await prisma.companyTransaction.create({ data: { ...data, billUrl } });
    res.status(201).json(transaction);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const listTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = companyTransactionFilterSchema.safeParse(req.query);
    if (!q.success) {
      return res.status(400).json({ message: "Invalid query", errors: q.error.errors });
    }
    const { startDate, endDate, transactionType, paymentMode } = q.data;
    const where: any = {};
    if (transactionType) where.transactionType = transactionType;
    if (paymentMode) where.paymentMode = paymentMode;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) (where.date.gte = new Date(startDate));
      if (endDate) (where.date.lte = new Date(endDate));
    }
    const transactions = await prisma.companyTransaction.findMany({ where, orderBy: { date: "desc" } });
    res.json(transactions);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const income = await prisma.companyTransaction.aggregate({
      _sum: { amount: true },
      where: { transactionType: "INCOME" },
    });
    const expense = await prisma.companyTransaction.aggregate({
      _sum: { amount: true },
      where: { transactionType: "EXPENSE" },
    });
    const totalIncome = income._sum.amount || 0;
    const totalExpense = expense._sum.amount || 0;
    res.json({ totalIncome, totalExpense, netBalance: totalIncome - totalExpense });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = companyTransactionIdSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
    }
    const body = companyTransactionUpdateSchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ message: "Validation failed", errors: body.error.errors });
    }
    let billUrl: string | undefined;
    if (req.file && req.file.buffer) {
      const upload = await uploadFile(req.file.buffer, "company_bills", "raw", req.file.originalname);
      billUrl = upload.url;
    }
    const updated = await prisma.companyTransaction.update({
      where: { id: params.data.id },
      data: { ...body.data, ...(billUrl ? { billUrl } : {}) },
    });
    res.json(updated);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = companyTransactionIdSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
    }
    await prisma.companyTransaction.delete({ where: { id: params.data.id } });
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
