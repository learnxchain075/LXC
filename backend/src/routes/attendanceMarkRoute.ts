import express from "express";
import { markAttendance } from "../controllers/attendance/markAttendanceController";

const router = express.Router();

router.post("/attendance/mark", markAttendance);

export default router;
