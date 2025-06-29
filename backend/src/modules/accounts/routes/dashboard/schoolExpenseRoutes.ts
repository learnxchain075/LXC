// routes/schoolExpense.routes.ts

import express from 'express';
import { createSchoolExpense, getSchoolExpenses, updateSchoolExpense, deleteSchoolExpense } from '../../controllers/dashboard/schoolExpenseController';

const router = express.Router();

router.post('/school/expense', createSchoolExpense);
router.get('/school/expense/:schoolId', getSchoolExpenses);
router.put('/school/expense/:id', updateSchoolExpense);
router.delete('/school/expense/:id', deleteSchoolExpense);

export default router;
