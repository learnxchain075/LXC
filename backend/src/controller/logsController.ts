import { NextFunction, Request, Response } from "express";
import { prisma } from "../db/prisma";
import { z } from "zod";

const getLogsQuerySchema = z.object({
  method: z.string().optional(),
  status: z.string().optional(),
  userId: z.string().optional(),
  path: z.string().optional(),
  page: z.string().optional(),
});

export const getLogs = async (req: Request, res: Response): Promise<any> => {
  const parseResult = getLogsQuerySchema.safeParse(req.query);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.errors });
  }
  const { method, status, userId, path, page = "1" } = parseResult.data;

  const filters: any = {};
  if (method) filters.method = method;
  if (status) filters.status = Number(status);
  if (userId) filters.userId = userId;
  if (path) filters.path = { contains: path as string };

  const logs = await prisma.log.findMany({
    where: filters,
    orderBy: { createdAt: "desc" },
    skip: (Number(page) - 1) * 20,
    take: 20,
  });

  const count = await prisma.log.count({ where: filters });

  res.json({ logs, total: count });
};

// Deletes all logs from the database
export const deleteAllLogs = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const deleted = await prisma.log.deleteMany({});
    return res.status(200).json({
      message: "All logs deleted successfully.",
      deletedCount: deleted.count,
    });
  } catch (error) {
    console.error("Error deleting logs:", error);
    return res.status(500).json({
      message: "Failed to delete logs.",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
