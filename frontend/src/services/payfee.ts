// Create Razorpay order (initiate payment)
router.post("/school/fee/create-order", createRazorpayOrder);
 
// Verify Razorpay payment after success
router.post("/school/fee/verify-payment", verifyRazorpayPayment);
 