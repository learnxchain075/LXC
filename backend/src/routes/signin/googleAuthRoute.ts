import express from 'express';
import { googleSignIn } from '../../controller/auth/googleAuthController';

const router = express.Router();

router.post('/google-signin', googleSignIn);

export default router;
