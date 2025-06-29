import { Router } from 'express';
import { downloadStudentIdCard } from '../../controllers/dashboard/idCardController';

const router = Router();

router.get('/student/id-card/:studentId', downloadStudentIdCard);

export default router;
