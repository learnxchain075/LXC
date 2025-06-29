import express from 'express';
import { createPaymentSecret, deletePaymentSecret, getAllPaymentSecrets, getPaymentSecretById, getPaymentSecretBySchoolId, updatePaymentSecret } from '../../controllers/dashboard/paymentSecretController';

const router = express.Router();

router.post('/school/admin/payment-secret', createPaymentSecret );
router.get('/school/admin/payment-secret/:id', getPaymentSecretById );
router.get('/school/admin/payment-secrets', getAllPaymentSecrets );
router.put('/school/admin/payment-secret/:id',updatePaymentSecret);
router.delete('/school/admin/payment-secret/:id',deletePaymentSecret);


// Get Secret of a school

router.get('/school/admin/payment-secret/school/:schoolId', getPaymentSecretBySchoolId);


export default router;

