import express from 'express';
import { updateAttendance, deleteAttendance } from '../../../teacher/controllers/dashboard/attendanceController';
import { recordAttendance, getAttendance, getAttendanceByStudent } from '../../controllers/dashboard/busAttendanceController';


const router = express.Router();


router.post("/transport/school/bus-attendance", recordAttendance); // Record new attendance
router.get("/transport/school/bus-attendances", getAttendance); // Get all attendance records
router.get("/transport/school/bus-attendance/:studentId", getAttendanceByStudent); // Get attendance by student
router.patch("/transport/school/bus-attendance/:attendanceId", updateAttendance); // Update attendance status
router.delete("/transport/school/bus-attendance/:attendanceId", deleteAttendance); // Delete attendance record

export default router;
