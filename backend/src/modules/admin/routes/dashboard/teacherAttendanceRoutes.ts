import { Router } from "express";
import { uploadTeacherFace } from "../../controllers/attendence/teacherAttendanceController";

const router = Router();

// Upload face image for teacher
router.post("/admin/teacher/face", uploadTeacherFace);

export default router;
