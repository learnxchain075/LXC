import express from "express";
import multer from "multer";
import {
  createTransaction,
  listTransactions,
  getSummary,
  updateTransaction,
  deleteTransaction,
  getTransactions,
  exportTransactionsCsv,
  exportTransactionsPdf,
} from "../../controllers/companyAccountsController";

const router = express.Router();
const upload = multer();

router.post("/company-accounts/create", upload.single("bill"), createTransaction);
router.get("/company-accounts/list", listTransactions);
router.get("/company-accounts/transactions", getTransactions);
router.get("/company-accounts/summary", getSummary);
router.put("/company-accounts/:id/update", upload.single("bill"), updateTransaction);
router.delete("/company-accounts/:id", deleteTransaction);
router.get("/company-accounts/transactions/export/csv", exportTransactionsCsv);
router.get("/company-accounts/transactions/export/pdf", exportTransactionsPdf);

export default router;
