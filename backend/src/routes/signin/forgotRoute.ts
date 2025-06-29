import express from "express";
import { changePassword } from "../../controller/forgot-password/forgotPasswordController";
import { authenticate } from "../../middlewares/authMiddleware";

const router = express.Router();

// // Route to handle forgot password
// router.post("/forgot-password", forgotPassword);

// // Route to handle reset password
// router.post("/password/reset-password", resetPassword);
// Route to change user password
router.post("/change-password", authenticate, changePassword);

export default router;
