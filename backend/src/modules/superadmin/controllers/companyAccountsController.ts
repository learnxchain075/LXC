import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { uploadFile } from "../../../services/cloudinaryService";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";
import {
  companyTransactionSchema,
  companyTransactionUpdateSchema,
  companyTransactionIdSchema,
  companyTransactionFilterSchema,
  companySummaryFilterSchema,
  companyTransactionAdvancedFilterSchema
} from "../../../validations/Module/SuperadminDashboard/companyAccountsValidation";

export const createTransaction = async (req: Request, res: Response, next: NextFunction) : Promise<any>=> {
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

export const listTransactions = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

export const getSummary = async (req: Request, res: Response, next: NextFunction) : Promise<any>=> {
  try {
    const parse = companySummaryFilterSchema.safeParse(req.query);
    if (!parse.success) {
      return res.status(400).json({ message: "Invalid query", errors: parse.error.errors });
    }
    const data = await computeSummaryData(parse.data);
    res.json(data);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateTransaction = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

export const deleteTransaction = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

import puppeteer from "puppeteer";
import { generateCompanyTransactionsHtml } from "../../../template/companyTransactionsTemplate";

const computeSummaryData = async (q: any) => {
  const where: any = {};
  if (q.type && q.type !== "ALL") where.transactionType = q.type;
  if (q.mode && q.mode !== "ALL") where.paymentMode = q.mode;
  if (q.recipient) where.sourceOrRecipient = { contains: q.recipient, mode: "insensitive" };
  if (q.category) where.category = { contains: q.category, mode: "insensitive" };
  if (q.fromDate || q.toDate) {
    where.date = {} as any;
    if (q.fromDate) where.date.gte = new Date(q.fromDate);
    if (q.toDate) where.date.lte = new Date(q.toDate);
  }

  const [incomeAgg, expenseAgg, totalCount, billCount, modeBreakdown, topRecipients, topCategories] = await Promise.all([
    prisma.companyTransaction.aggregate({ _sum: { amount: true }, where: { ...where, transactionType: "INCOME" } }),
    prisma.companyTransaction.aggregate({ _sum: { amount: true }, where: { ...where, transactionType: "EXPENSE" } }),
    prisma.companyTransaction.count({ where }),
    prisma.companyTransaction.count({ where: { ...where, billUrl: { not: null } } }),
    prisma.companyTransaction.groupBy({ by: ["paymentMode"], where, _sum: { amount: true } }),
    prisma.companyTransaction.groupBy({ by: ["sourceOrRecipient"], where, _sum: { amount: true }, orderBy: { _sum: { amount: "desc" } }, take: 5 }),
    prisma.companyTransaction.groupBy({ by: ["category"], where: { ...where, category: { not: null } }, _sum: { amount: true }, orderBy: { _sum: { amount: "desc" } }, take: 5 }),
  ]);

  const totalIncome = incomeAgg._sum.amount || 0;
  const totalExpense = expenseAgg._sum.amount || 0;

  const monthly: any[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
    const [mInc, mExp] = await Promise.all([
      prisma.companyTransaction.aggregate({ _sum: { amount: true }, where: { ...where, transactionType: "INCOME", date: { gte: start, lte: end } } }),
      prisma.companyTransaction.aggregate({ _sum: { amount: true }, where: { ...where, transactionType: "EXPENSE", date: { gte: start, lte: end } } }),
    ]);
    monthly.push({ month: start.toISOString().slice(0,7), income: mInc._sum.amount || 0, expense: mExp._sum.amount || 0 });
  }

  const weekly: any[] = [];
  for (let i = 7; i >= 0; i--) {
    const start = new Date();
    start.setDate(start.getDate() - start.getDay() - i*7);
    start.setHours(0,0,0,0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23,59,59,999);
    const [wInc, wExp] = await Promise.all([
      prisma.companyTransaction.aggregate({ _sum: { amount: true }, where: { ...where, transactionType: "INCOME", date: { gte: start, lte: end } } }),
      prisma.companyTransaction.aggregate({ _sum: { amount: true }, where: { ...where, transactionType: "EXPENSE", date: { gte: start, lte: end } } }),
    ]);
    weekly.push({ week: start.toISOString().slice(0,10), income: wInc._sum.amount || 0, expense: wExp._sum.amount || 0 });
  }

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    totalTransactions: totalCount,
    billsUploaded: billCount,
    paymentMode: modeBreakdown,
    topRecipients,
    topCategories,
    monthly,
    weekly,
  };
};

const buildFilter = (q: any) => {
  const where: any = {};
  if (q.type) where.transactionType = q.type;
  if (q.mode) where.paymentMode = q.mode;
  if (q.recipient) where.sourceOrRecipient = { contains: q.recipient, mode: "insensitive" };
  if (q.category) where.category = { contains: q.category, mode: "insensitive" };
  if (q.billAttached === "true") where.billUrl = { not: null };
  if (q.billAttached === "false") where.billUrl = null;
  if (q.minAmount !== undefined || q.maxAmount !== undefined) {
    where.amount = {};
    if (q.minAmount !== undefined) where.amount.gte = q.minAmount;
    if (q.maxAmount !== undefined) where.amount.lte = q.maxAmount;
  }
  if (q.fromDate || q.toDate) {
    where.date = {} as any;
    if (q.fromDate) where.date.gte = new Date(q.fromDate);
    if (q.toDate) where.date.lte = new Date(q.toDate);
  }
  if (q.search) {
    where.OR = [
      { title: { contains: q.search, mode: "insensitive" } },
      { description: { contains: q.search, mode: "insensitive" } },
      { sourceOrRecipient: { contains: q.search, mode: "insensitive" } },
    ];
  }
  return where;
};

export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = companyTransactionAdvancedFilterSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid query", errors: parsed.error.errors });
    }
    const q = parsed.data;
    const page = q.page || 1;
    const perPage = q.perPage || 10;
    const where = buildFilter(q);
    const orderBy: any = { [q.sortBy || "date"]: q.sortOrder || "desc" };

    const [data, totalCount, incomeAgg, expenseAgg] = await Promise.all([
      prisma.companyTransaction.findMany({ where, orderBy, skip: (page - 1) * perPage, take: perPage }),
      prisma.companyTransaction.count({ where }),
      prisma.companyTransaction.aggregate({ _sum: { amount: true }, where: { ...where, transactionType: "INCOME" } }),
      prisma.companyTransaction.aggregate({ _sum: { amount: true }, where: { ...where, transactionType: "EXPENSE" } }),
    ]);

    const pageCount = Math.ceil(totalCount / perPage);
    const totalIncome = incomeAgg._sum.amount || 0;
    const totalExpense = expenseAgg._sum.amount || 0;

    res.json({ data, totalCount, pageCount, totalIncome, totalExpense });
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const exportTransactionsCsv = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = companyTransactionAdvancedFilterSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid query", errors: parsed.error.errors });
    }
    const q = parsed.data;
    const where = buildFilter(q);
    const orderBy: any = { [q.sortBy || "date"]: q.sortOrder || "desc" };
    const data = await prisma.companyTransaction.findMany({ where, orderBy });
    const rows = data.map(d => [
      new Date(d.date).toISOString().split("T")[0],
      d.title,
      d.description,
      d.sourceOrRecipient,
      d.transactionType,
      d.amount,
      d.paymentMode,
      d.billUrl ? "Yes" : "No",
    ]);
    const header = ["Date","Title","Description","Recipient","Type","Amount","Mode","Bill Attached"];
    const csv = [header.join(","), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(","))].join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=transactions.csv");
    return res.send(csv);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const exportTransactionsPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = companyTransactionAdvancedFilterSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid query", errors: parsed.error.errors });
    }
    const q = parsed.data;
    const where = buildFilter(q);
    const orderBy: any = { [q.sortBy || "date"]: q.sortOrder || "desc" };
    const [data, incomeAgg, expenseAgg] = await Promise.all([
      prisma.companyTransaction.findMany({ where, orderBy }),
      prisma.companyTransaction.aggregate({ _sum: { amount: true }, where: { ...where, transactionType: "INCOME" } }),
      prisma.companyTransaction.aggregate({ _sum: { amount: true }, where: { ...where, transactionType: "EXPENSE" } }),
    ]);
    const html = generateCompanyTransactionsHtml(data, {
      income: incomeAgg._sum.amount || 0,
      expense: expenseAgg._sum.amount || 0,
    });
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition','attachment; filename=transactions.pdf');
    return res.send(pdfBuffer);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const exportSummaryCsv = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parse = companySummaryFilterSchema.safeParse(req.query);
    if (!parse.success) {
      return res.status(400).json({ message: "Invalid query", errors: parse.error.errors });
    }
    const data = await computeSummaryData(parse.data);
    const rows = [
      ["Total Income", data.totalIncome],
      ["Total Expense", data.totalExpense],
      ["Net Balance", data.netBalance],
      ["Transactions", data.totalTransactions],
      ["Bills Uploaded", data.billsUploaded],
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=summary.csv");
    return res.send(csv);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const exportSummaryPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parse = companySummaryFilterSchema.safeParse(req.query);
    if (!parse.success) {
      return res.status(400).json({ message: "Invalid query", errors: parse.error.errors });
    }
    const data = await computeSummaryData(parse.data);
    const html = `<html><body><h2>Accounts Summary</h2><p>Total Income: ${data.totalIncome}</p><p>Total Expense: ${data.totalExpense}</p><p>Net Balance: ${data.netBalance}</p></body></html>`;
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition','attachment; filename=summary.pdf');
    return res.send(pdfBuffer);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
