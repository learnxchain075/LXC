import express from "express";
import { getSalaryPayments } from "../../controllers/dashboard/reportController";
import { recordSalaryPayment } from "../../controllers/dashboard/salaryController";


const router = express.Router();

router.post("/pay",  recordSalaryPayment);
router.get("/payments/:teacherId",  getSalaryPayments);
// router.get("/payments",  getSalaryPaymentsByDate);

export default router;
