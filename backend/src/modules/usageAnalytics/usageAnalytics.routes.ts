import { Router } from "express";
import {
  postUsageLog,
  getUsage,
  getRoles,
  getSchoolsModules,
} from "./usageAnalytics.controller";
import { permit } from "../../utils/jwt_utils";
import { Role } from "@prisma/client";

const router = Router();

router.post(
  "/usage-log",
  permit(
    Role.admin,
    Role.superadmin,
    Role.teacher,
    Role.student,
    Role.parent,
    Role.transport,
    Role.account,
    Role.employee
  ),
  postUsageLog
);

router.get("/usage-analytics", permit(Role.admin, Role.superadmin), getUsage);
router.get("/roles", getRoles);
router.get("/schools-with-modules", permit(Role.superadmin), getSchoolsModules);

export default router;
