import express from "express";
import {
  createAttendance,
  deleteAttendance,
  downloadAttendanceReport,
  getAttendanceById,
  getAttendanceReportData,
  getAttendances,
  markMultipleAttendance,
  updateAttendance,
} from "../../controllers/dashboard/attendanceController";

const router = express.Router();

router.post("/teacher/attendance", createAttendance);
router.get("/teacher/attendance", getAttendances);
router.get("/teacher/attendance/:id", getAttendanceById);
router.put("/teacher/attendance/:id", updateAttendance);
router.delete("/teacher/attendance/:id", deleteAttendance);
router.post("/teacher/mark-multiple", markMultipleAttendance);

// GET: Attendance report as JSON summary
router.get("/school/attendance/report", getAttendanceReportData);

// GET: Attendance report download (Excel or PDF)
router.get("/school/attendance/download", downloadAttendanceReport);

export default router;
