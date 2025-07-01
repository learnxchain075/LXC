import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";

export const getTicketMetadata = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await prisma.ticket.findMany({
      where: { category: { not: null } },
      distinct: ["category"],
      select: { category: true },
    });
    const statuses = await prisma.ticket.findMany({
      distinct: ["status"],
      select: { status: true },
    });
    const priorities = await prisma.ticket.findMany({
      distinct: ["priority"],
      select: { priority: true },
    });

    res.json({
      categories: categories.map((c) => c.category),
      statuses: statuses.map((s) => s.status),
      priorities: priorities.map((p) => p.priority),
    });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
