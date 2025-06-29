import { Router } from "express";
import {
  recordCashPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} from "../../controllers/dashboard/paymentController";

const router = Router();

// Create a new cash payment
router.post("/cash", recordCashPayment);

// Create an online payment order
// router.post("/order", createPaymentOrder);

// // Handle Razorpay webhook
// router.post("/webhook", handleWebhook);

// Get all payments
router.get("/", getAllPayments);

// Get a single payment by ID
router.get("/:id", getPaymentById);

// Update payment status
router.patch("/:id", updatePayment);

// Delete a payment record
router.delete("/:id", deletePayment);

export default router;
