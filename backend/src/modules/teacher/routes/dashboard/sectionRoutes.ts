import express from "express";
import { createSection, getSections, getSectionById, updateSection, deleteSection } from "../../controllers/dashboard/sectionController";
import multer from "multer";


const router = express.Router();

// Create a new section
router.post("/school/class/create-section", createSection);

// Get all sections of a class
router.get("/school/class/:classId", getSections);

// Get a section by ID
router.get("/school/class/section/:id", getSectionById);

// Update a section
router.put("/school/class/section/:id", updateSection);

// Delete a section
router.delete("/school/class/section/:id", deleteSection);

// Get all students in a section
// router.get("/:sectionId/students", getStudentsBySection); // Uncomment when ready

export default router;
