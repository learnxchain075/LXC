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

    const categoriesSet = new Set<string>(defaultCategories);
    categoriesData.forEach((c) => c.category && categoriesSet.add(c.category));

    const statusesSet = new Set<string>(defaultStatuses);
    statusesData.forEach((s) => statusesSet.add(s.status));

    const prioritiesSet = new Set<string>(defaultPriorities);
    prioritiesData.forEach((p) => prioritiesSet.add(p.priority));

    const categories = Array.from(categoriesSet);
    const statuses = Array.from(statusesSet);
    const priorities = Array.from(prioritiesSet);

    res.json({ categories, statuses, priorities });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
