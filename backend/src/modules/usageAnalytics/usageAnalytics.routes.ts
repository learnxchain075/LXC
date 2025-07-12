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

// Existing backward compatible endpoint
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

// New endpoint aligning with frontend service path
router.post(
  "/usage-analytics/log",
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

// Shared analytics endpoint for both admin and superadmin
router.get("/usage-analytics", permit(Role.admin, Role.superadmin), getUsage);

// Explicit endpoints used by the frontend
router.get("/usage-analytics/admin", permit(Role.admin), getUsage);
router.get("/usage-analytics/superadmin", permit(Role.superadmin), getUsage);
router.get("/roles", getRoles);
router.get("/schools-with-modules", permit(Role.superadmin), getSchoolsModules);

export default router;
