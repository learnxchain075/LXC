import express from "express";
import { downloadFeeInvoice, downloadPlanInvoice, downloadFeeReceipt } from "../../controller/paymenthandler/invoiceController";

const router = express.Router();

router.get("/school/fee/invoice/:paymentId", downloadFeeInvoice);
router.get("/school/fee/receipt/:paymentId", downloadFeeReceipt);
router.get("/school/plan/invoice/:subscriptionId", downloadPlanInvoice);

export default router;
