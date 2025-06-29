import express from "express";
import {
  getPayrolls,
  getPayrollById,
  createPayroll,
  updatePayroll,
  deletePayroll,
} from "../../../controllers/dashboard/hrm/payrollController";

const router = express.Router();

router.post("/payroll/:schoolId", createPayroll); // Create a payroll entry
router.get("/payroll/:schoolId", getPayrolls); // Get all payrolls for a school
router.get("/payroll/single/:id", getPayrollById); // Get a single payroll by ID
router.put("/payroll/:id", updatePayroll); // Update a payroll entry
router.delete("/payroll/:id", deletePayroll); // Delete a payroll entry

export default router;
