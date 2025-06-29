import express from "express";
import { createRazorpayOrder, verifyRazorpayPayment } from "../../controller/paymenthandler/feePaymentController";

const router = express.Router();

// Create Razorpay order (initiate payment)
router.post("/school/fee/create-order", createRazorpayOrder);

// Verify Razorpay payment after success
router.post("/school/fee/verify-payment", verifyRazorpayPayment);

// Razorpay webhook endpoint
// router.post("/fee/razorpay-webhook", razorpayWebhook); 

export default router;
