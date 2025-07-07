import express from 'express';
import { getDemoTasks } from '../controllers/demoController';

const router = express.Router();

router.get('/demo/tasks', getDemoTasks);

export default router;
