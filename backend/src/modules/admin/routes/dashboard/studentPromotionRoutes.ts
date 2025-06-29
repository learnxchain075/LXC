import express from 'express';
import { bulkPromoteClass, promoteStudent, selectivePromotion, withdrawStudent } from '../../controllers/dashboard/studentPromotion';

const router = express.Router();

router.post('/admin/promotions/promote', promoteStudent);
router.post('/admin/promotions/bulk', bulkPromoteClass);
router.post('/admin/promotions/selective', selectivePromotion);
router.post('/admin/promotions/withdraw', withdrawStudent);

export default router;
