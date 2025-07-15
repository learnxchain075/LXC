import { Router } from "express";
import { updateDriverLocation } from "../controller/gps.controller";

import { getBusRoute, getRouteStatus, startDriverRoute, stopDriverRoute } from "../controller/bus.controller";
import {
  getDriverNotifications,
  markNotificationAsRead,
  sendDriverNotification,
} from "../controller/driverNotification.controller";

const router = Router();

// POST /api/gps/driver-location/update
router.post("/driver-location/update", updateDriverLocation);

router.get("/driver-location/route/:busId", getBusRoute);
router.patch("/driver-location/start", startDriverRoute);
router.patch("/driver-location/stop", stopDriverRoute);
router.get("/driver-location/status/:busId", getRouteStatus);

// DRIVER NOTFICATION 'ROUTES

router.post("/driver-location/send", sendDriverNotification);
router.get("/driver-location", getDriverNotifications);
router.patch("/driver-location/read/:id", markNotificationAsRead);

export default router;
