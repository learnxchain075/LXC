import { Router } from "express";
import multer from "multer";
import {
  registerTeacherFace,
  getTeacherFaceData,
  markFaceAttendance,
  getAllTeacherFaceDataBySchool,
  deleteTeacherFaceData,
} from "../../controllers/attendence/teacherFaceDataController";

const upload = multer();
const router = Router();

router.post("/admin/teacher-face/register", upload.single("image"), registerTeacherFace);
router.get("/admin/teacher-face/:teacherId", getTeacherFaceData);
router.get("/admin/teacher-face/school/:schoolId", getAllTeacherFaceDataBySchool);
router.delete("/admin/teacher-face/:teacherId", deleteTeacherFaceData);
router.post("/teacher/face-attendance", upload.single("image"), markFaceAttendance);

export default router;
