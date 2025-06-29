import express from "express";
import { createDemoBooking, getAllDemoBookings } from "../../controllers/demoBookingController";

const router = express.Router();

// POST /api/demo-booking
router.post("/demo-booking", createDemoBooking);
// GET /api/demo-booking
router.get("/demo-bookings", getAllDemoBookings);

export default router;
