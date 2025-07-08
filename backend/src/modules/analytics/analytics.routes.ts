import { Router } from "express";
import { usageAnalytics } from "./analytics.controller";

const router = Router();

router.get("/analytics/usage", usageAnalytics);

export default router;
