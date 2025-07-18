import { Router } from "express";

import {
  createTemplate,
  getTemplates,
  createChannel,
  getLogs,
  sendNotification,
  trigger,
} from "../controllers/notificationController";
import { isSchoolAdmin, isSuperAdmin } from "../../../middlewares/roleCheck";

const router = Router();

router.post("/notification/template", isSuperAdmin, createTemplate);
router.get("/notification/template",  getTemplates);
router.post("/notification/channel",  isSchoolAdmin, createChannel);
router.get("/notification/logs",  isSuperAdmin, getLogs);
router.post("/notification/send",  sendNotification);
router.post("/notification/trigger", trigger);

export default router;
