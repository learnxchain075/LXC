import express from 'express';
import { requestOtp, loginWithOtp } from '../controller/auth/otpAuthController';
import { googleSignIn } from '../controller/auth/googleAuthController';

const router = express.Router();

router.post('/request-otp', requestOtp);
router.post('/verify-otp', loginWithOtp);
router.post('/google-login', googleSignIn);

export default router;
