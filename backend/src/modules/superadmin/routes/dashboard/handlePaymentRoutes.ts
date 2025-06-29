import express from 'express';
import { createPaymentOrder, handleWebhook } from '../../../accounts/controllers/dashboard/paymentController';


const router = express.Router();

// Route to create a new payment order
router.post('/payment/create', createPaymentOrder);

// Route to handle Razorpay webhook for payment status updates
router.post('/payment/webhook', handleWebhook);


export default router;