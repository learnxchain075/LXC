// routes/schoolIncome.routes.ts

import express from 'express';
import { createSchoolIncome, getAllSchoolIncome, getSchoolIncomeById, updateSchoolIncome, deleteSchoolIncome, getSchoolIncomeBySchoolId } from '../../controllers/dashboard/schoolIncomeController';


const router = express.Router();

router.post('/school/income', createSchoolIncome);
router.get('/school/incomes', getAllSchoolIncome);
router.get('/school/income/:id', getSchoolIncomeById);
router.put('/school/income/:id', updateSchoolIncome);
router.delete('/school/income/:id', deleteSchoolIncome);

// Get School income by ID
router.get('/admin/school/income/:id', getSchoolIncomeBySchoolId);

export default router;
