import express from "express";
import {
  createSubject,
  deleteSubject,
  getSubjectByClassId,
  getSubjectById,
  getSubjects,
  getSubjectsOfClass,
  updateSubject,
} from "../../controllers/dashboard/subjectController";

const router = express.Router();

router.post("/teacher/subject", createSubject);
router.get("/teacher/subject", getSubjects);
router.get("/teacher/subject/:id", getSubjectById);
router.put("/teacher/subject/:id", updateSubject);
router.delete("/teacher/subject/:id", deleteSubject);

// Get Subject of a School Class

router.get("/schools/:schoolId/classes/:classId/subjects", getSubjectsOfClass);


// Get All Subject of a School 
router.get("/school/:schoolId/subjects", getSubjectsOfClass);

// Get Subject By Class ID
router.get("/class/:classId/subjects", getSubjectByClassId);

export default router;
