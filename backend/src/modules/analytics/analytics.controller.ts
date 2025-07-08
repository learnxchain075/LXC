import { Request, Response, NextFunction } from "express";
import { getUsageAnalytics } from "./analytics.service";

export async function usageAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getUsageAnalytics({
      role: req.query.role as string | undefined,
      classId: req.query.classId as string | undefined,
      branchId: req.query.branchId as string | undefined,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
}
