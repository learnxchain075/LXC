import express from "express";
import {
  createAssignment,
  deleteAssignment,
  getAssignmentById,
  getAssignments,
  updateAssignment,
} from "../../controllers/dashboard/assignmentController";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/school/teacher/assignment", upload.single("attachment"), createAssignment);
router.get("/school/teacher/assignment", getAssignments);
router.get("/school/teacher/assignment/:id", getAssignmentById);
router.put("/school/teacher/assignment/:id", updateAssignment);
router.delete("/school/teacher/assignment/:id", deleteAssignment);

export default router;
