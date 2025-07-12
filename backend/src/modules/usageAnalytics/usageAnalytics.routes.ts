import { Router } from "express";
import { postUsageLog, getUsage } from "./usageAnalytics.controller";
import { permit } from "../../utils/jwt_utils";
import { Role } from "@prisma/client";

const router = Router();

router.post(
  "/usage-analytics/log",
  permit(Role.admin, Role.superadmin, Role.teacher, Role.student, Role.parent),
  postUsageLog
);

router.get("/usage-analytics/admin", permit(Role.admin), getUsage);
router.get("/usage-analytics/superadmin", permit(Role.superadmin), getUsage);

export default router;
