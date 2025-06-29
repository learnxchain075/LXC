import { Router } from "express";

import { getFeesCollected, getOutstandingFees, getSalaryPayments } from "../../controllers/dashboard/reportController";



const router = Router();

router.get("/fees-collected", getFeesCollected); // Get total fees collected
router.get("/outstanding-fees", getOutstandingFees); // Get outstanding fees
router.get("/salary-payments", getSalaryPayments); // Get salary payments

export default router;
