import { Router } from "express";
import { authenticate } from "../../../../../notification-system/middleware/auth";
import { isSuperAdmin, isSchoolAdmin } from "../../../../../notification-system/middleware/roleCheck";
import {
  createTemplate,
  getTemplates,
  createChannel,
  getLogs,
  sendNotification,
  trigger,
} from "../controllers/notificationController";

const router = Router();

router.post("/api/notification/template", authenticate, isSuperAdmin, createTemplate);
router.get("/api/notification/template", authenticate, getTemplates);
router.post("/api/notification/channel", authenticate, isSchoolAdmin, createChannel);
router.get("/api/notification/logs", authenticate, isSuperAdmin, getLogs);
router.post("/api/notification/send", authenticate, sendNotification);
router.post("/api/notification/trigger", trigger);

export default router;
