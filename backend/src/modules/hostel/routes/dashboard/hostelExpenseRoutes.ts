import { Router } from "express";
import { getHostelExpenses, getHostelExpenseById, createHostelExpense, updateHostelExpense, deleteHostelExpense } from "../../controllers/dashboard/hostelExpenseController";


const router = Router();

router.get("/hostel/expense", getHostelExpenses);
router.get("/hostel/expense/:id", getHostelExpenseById);
router.post("/hostel/expense", createHostelExpense);
router.put("/hostel/expense/:id", updateHostelExpense);
router.delete("/hostel/expense/:id", deleteHostelExpense);

export default router;
