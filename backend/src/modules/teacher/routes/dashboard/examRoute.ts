import express from "express";
import {
  createExam,
  createExamAttendance,
  deleteExam,
  getExamAttendanceOfSchool,
  getExamAttendance,
  getExamById,
  getExamByIdForAttendance,
  getExamsByClassId,
  scheduleExam,
  updateExam,
} from "../../controllers/dashboard/examController";

const router = express.Router();

router.post("/school/teacher/exam", createExam);
router.get("/school/teacher/exam/:classId", getExamsByClassId);
router.get("/school/teacher/exam/:id", getExamById);
router.put("/school/teacher/exam/:id", updateExam);
router.delete("/school/teacher/exam/:id", deleteExam);

// Schedule Exam

router.post("/school/teacher/exam/schedule", scheduleExam);

// Exam attendcence
router.post("/school/teacher/exam/attendance", createExamAttendance);

// Get Exam Attendence
router.get("/school/teacher/exam/attendance/:id", getExamAttendance);

// Get Exam Attendence by IDc
router.get("/teacher/exam/attendance/:id", getExamByIdForAttendance);

// GET: Get exam attendance for a specific student in a class
router.get("/exam-attendance/:classId/:studentId", getExamAttendanceOfSchool);

export default router;
