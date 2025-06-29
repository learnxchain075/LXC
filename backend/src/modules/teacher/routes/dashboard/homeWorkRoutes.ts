import { Router } from "express";
import {
  createHomework,
  getAllHomework,
  getHomeworkById,
  updateHomework,
  deleteHomework,
  getHomeworkByClassId,
  submitHomework,
  getSubmittedHomeworkByStudent,
} from "../../controllers/dashboard/homeWorkController";
import multer from "multer";

const router = Router();
const upload = multer();
// Homework routes
router.post("/school/home-work", upload.single("attachment"), createHomework); // Create homework
router.get("/school/home-work/:id", getHomeworkById); // Get homework by ID
router.put("/school/home-work/:id", updateHomework); // Update homework
router.delete("/school/home-work/:id", deleteHomework); // Delete homework
router.get("/school/home-work/class/:classId", getHomeworkByClassId); // Get homework by class ID

// Student submission routes
router.post("/school/home-work/submit", upload.single('file'), submitHomework); // Student submits homework
router.get("/school/home-work/submissions/:studentId", getSubmittedHomeworkByStudent); // Get all submissions by student

export default router;
