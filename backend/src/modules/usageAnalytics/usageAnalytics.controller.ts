import { Request, Response, NextFunction } from "express";
import { getUsageAnalytics, logUsage } from "./usageAnalytics.service";

export async function postUsageLog(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id as string;
    const role = req.user?.role as string;
    const schoolId = (req.user?.schoolId as string | undefined) || req.body.schoolId;
    const { module, deviceType } = req.body;
    await logUsage({ userId, role, schoolId, module, deviceType });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function getUsage(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getUsageAnalytics({
      role: req.query.role as string | undefined,
      module: req.query.module as string | undefined,
      device: req.query.device as string | undefined,
      range: req.query.range as string | undefined,
      schoolId: req.query.schoolId as string | undefined,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
}
