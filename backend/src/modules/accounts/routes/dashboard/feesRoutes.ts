// Routes File (routes/feeRoutes.ts)
import { Router } from "express";
import {
  createFee,
  deleteFee,
  getAllFees,
  getFee,
  getFeesBySchool,
  getFeesByStudent,
  updateFee,
} from "../../controllers/dashboard/feeController";

const router = Router();

router.post("/student/create-fee", createFee);
router.put("/student/create/:id", updateFee);



// Get All Fees
router.get("/students/fee", getAllFees);


router.get("/student/create/:id", getFee);

// Student Fess Of a School 
router.get("/school/student/:studentId", getFeesByStudent);

// School Fees
router.get("/schools/fees/get-all", getFeesBySchool);



router.delete("/student/create/:id", deleteFee);



export default router;
