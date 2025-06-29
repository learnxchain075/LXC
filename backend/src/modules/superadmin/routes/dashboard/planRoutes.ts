import express from 'express';
import { createPlan, deletePlan, getAllPlans, getPlanById, updatePlan } from '../../controllers/createPlanController';

const router = express.Router();

router.post('/plan/create', createPlan);
router.get('/super/plans', getAllPlans);
router.get('/plan/:id', getPlanById);
router.put('/plan/:id', updatePlan);
router.delete('/plan/:id', deletePlan);

export default router;
