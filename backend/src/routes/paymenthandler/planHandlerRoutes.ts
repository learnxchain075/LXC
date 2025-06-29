import express from "express";
import { createRazorpayOrder, razorpayWebhook, verifyRazorpayPayment,  } from "../../controller/paymenthandler/planPaymentHandler";


const router = express.Router();

// Create Razorpay order (initiate payment)
router.post("/school/create-order", createRazorpayOrder);

// Verify Razorpay payment after success
router.post("/school/verify-payment", verifyRazorpayPayment);

// Razorpay webhook endpoint
router.post("/Payment/razorpay-webhook", razorpayWebhook); 

export default router;
