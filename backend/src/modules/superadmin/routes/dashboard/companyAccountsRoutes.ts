import express from "express";
import multer from "multer";
import {
  createTransaction,
  listTransactions,
  getSummary,
  updateTransaction,
  deleteTransaction,
} from "../../controllers/companyAccountsController";

const router = express.Router();
const upload = multer();

router.post("/company-accounts/create", upload.single("bill"), createTransaction);
router.get("/company-accounts/list", listTransactions);
router.get("/company-accounts/summary", getSummary);
router.put("/company-accounts/:id/update", upload.single("bill"), updateTransaction);
router.delete("/company-accounts/:id", deleteTransaction);

export default router;
