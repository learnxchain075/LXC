// routes/schoolExpenseCategory.routes.ts

import express from 'express';
import { createSchoolExpenseCategory, getSchoolExpenseCategories, updateSchoolExpenseCategory, deleteSchoolExpenseCategory } from '../../controllers/dashboard/schoolExpenseCategoryController';

const router = express.Router();

router.post('/school/expense-category', createSchoolExpenseCategory);
router.get('/school/expense-category/:schoolId', getSchoolExpenseCategories);
router.put('/school/expense-category/:id', updateSchoolExpenseCategory);
router.delete('/school/expense-category/:id', deleteSchoolExpenseCategory);

export default router;
