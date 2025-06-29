import { Router } from "express";
import { getStudentDetails } from "../../controllers/dashboard/studentDetailsController";

const router = Router();

// GET /api/student/student-details — fetch student details based on token
router.get("/student/user/:id",  getStudentDetails);

export default router;
