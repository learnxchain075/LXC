import express from "express";
import {
  createFee,
  deleteFee,
  getAllFees,
  getFeeById,
  getFeesByCategory,
  getFeesBySchoolId,
  getFeesByStudentId,
  getOverdueFees,
  updateFee,
} from "../../controllers/dashboard/feeController";

const router = express.Router();

// Route to create a fee
router.post("/school/fees", createFee);

// Route to get all fees
router.get("/get-school/fees", getAllFees);

// Route to get fee by id
router.get("/school/fees/:id", getFeeById);

// Route to update a fee
router.put("/school/fees/:id", updateFee);

// Route to delete a fee
router.delete("/school/fees/:id", deleteFee);

// Route to get overdue fees
router.get("/school-fees/overdue", getOverdueFees);

// Route to get fees by student ID

router.get("/school/fees/student/:studentId", getFeesByStudentId);

// get fees by school id
router.get("/school/fees/school/:schoolId", getFeesBySchoolId);

// Get Fees by Category
// router.get("/school-fee-category/:category", getFeesByCategory);

export default router;
