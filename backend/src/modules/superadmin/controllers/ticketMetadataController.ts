import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";

export const getTicketMetadata = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoriesData = await prisma.ticket.findMany({
      where: { category: { not: null } },
      distinct: ["category"],
      select: { category: true },
    });
    const statusesData = await prisma.ticket.findMany({
      distinct: ["status"],
      select: { status: true },
    });
    const prioritiesData = await prisma.ticket.findMany({
      distinct: ["priority"],
      select: { priority: true },
    });

    const defaultCategories = [
      "Internet Issue",
      "Redistribute",
      "Computer",
      "Complaint",
    ];

    const defaultPriorities = ["Low", "Medium", "High"];

    const defaultStatuses = [
      "Closed",
      "Open",
      "Pending",
      "Resolved",
      "Reopened",
      "Inprogress",
    ];

    const categories =
      categoriesData.length > 0
        ? categoriesData.map((c) => c.category)
        : defaultCategories;
    const statuses =
      statusesData.length > 0
        ? statusesData.map((s) => s.status)
        : defaultStatuses;
    const priorities =
      prioritiesData.length > 0
        ? prioritiesData.map((p) => p.priority)
        : defaultPriorities;

    res.json({ categories, statuses, priorities });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
