import express from 'express';
import { requestOtp, loginWithOtp } from '../../controller/auth/otpAuthController';

const router = express.Router();

router.post('/request-otp', requestOtp);
router.post('/login-otp', loginWithOtp);

export default router;
