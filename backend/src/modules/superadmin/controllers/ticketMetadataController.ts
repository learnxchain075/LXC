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
  "Login / Access Issue",
  "Payment / Subscription",
  "Student Registration",
  "Teacher Onboarding",
  "Attendance Issues",
  "Face Recognition / Webcam",
  "Exam / Result Module",
  "Fee / Invoice Error",
  "Performance / Speed",
  "Report / Export Problem",
  "SMS / Email Delivery",
  "Mobile App Issue",
  "Plan Upgrade / Downgrade",
  "Data Sync / Integration",
  "Incorrect Data / Record",
  "UI / UX Suggestion",
  "Bug / Error Report",
  "Feature Request",
  "General Complaint",
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
