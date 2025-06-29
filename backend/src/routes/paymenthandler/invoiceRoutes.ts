import express from "express";
import { downloadFeeInvoice, downloadPlanInvoice } from "../../controller/paymenthandler/invoiceController";

const router = express.Router();

router.get("/school/fee/invoice/:paymentId", downloadFeeInvoice);
router.get("/school/plan/invoice/:subscriptionId", downloadPlanInvoice);

export default router;
