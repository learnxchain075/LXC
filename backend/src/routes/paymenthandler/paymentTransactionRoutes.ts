import express from "express";
import {
  getAllTransactionsForPlans,
  getAllTransactionsForSchool,
  getAllTransactionsForStudent,
  getSubscriptionOfSchool,
} from "../../controller/paymenthandler/paymentsController";

const router = express.Router();

// Route to get all transactions for a specific student
router.get("/transactions/student/:studentId", getAllTransactionsForStudent);

router.get("/school/:schoolId/transactions", getAllTransactionsForSchool);

// Get Subscription of a school

router.get("/school/:schoolId", getSubscriptionOfSchool);





// Get all transaction for a School who subscribed to plan 

router.get("/membership-transactions/plans", getAllTransactionsForPlans);



export default router;
