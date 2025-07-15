import { Router } from "express";
import { updateDriverLocation } from "../controller/gps.controller";

import { getBusRoute, getRouteStatus, startDriverRoute, stopDriverRoute } from "../controller/bus.controller";
import {
  getDriverNotifications,
  markNotificationAsRead,
  sendDriverNotification,
} from "../controller/driverNotification.controller";

const router = Router();

// POST /api/gps/update
router.post("/update", updateDriverLocation);

router.get("/route/:busId", getBusRoute);
router.patch("/start", startDriverRoute);
router.patch("/stop", stopDriverRoute);
router.get("/status/:busId", getRouteStatus);

// DRIVER NOTFICATION 'ROUTES

router.post("/send", sendDriverNotification);
router.get("/", getDriverNotifications);
router.patch("/read/:id", markNotificationAsRead);

export default router;
