import { Request, Response, NextFunction } from "express";
import {
  getUsageAnalytics,
  logUsage,
  listRoles,
  getSchoolsWithModules,
} from "./usageAnalytics.service";

export async function postUsageLog(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id as string;
    const role = req.user?.role as string;
    const schoolId = (req.user?.schoolId as string | undefined) || req.body.schoolId;
    const { module, deviceType, duration, lat, lng } = req.body;
    await logUsage({ userId, role, schoolId, module, deviceType, duration, lat, lng });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function getUsage(req: Request, res: Response, next: NextFunction) {
  try {
    let schoolId = req.query.schoolId as string | undefined;
    if (req.user?.role !== "superadmin") {
      schoolId = req.user?.schoolId as string | undefined;
    }
    const data = await getUsageAnalytics({
      role: req.query.role as string | undefined,
      module: req.query.module as string | undefined,
      device: req.query.device as string | undefined,
      range: req.query.range as string | undefined,
      schoolId,
      latlng: req.query.latlng as string | undefined,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export function getRoles(req: Request, res: Response) {
  res.json(listRoles());
}

export async function getSchoolsModules(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getSchoolsWithModules();
    res.json(data);
  } catch (err) {
    next(err);
  }
}
