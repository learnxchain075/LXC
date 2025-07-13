import express from "express";
import { getTeacherPayrolls } from "../../controllers/dashboard/payrollController";

const router = express.Router();

router.get("/teacher/payroll/:teacherId", getTeacherPayrolls);

export default router;
