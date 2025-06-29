import express from 'express';
import { createResult,  deleteResult,  getResultById, getResultOfSchool, getResults, updateResult } from '../../controllers/dashboard/resultContoller';


const router = express.Router();


router.post('/school/teacher/result', createResult );
router.get('/school/teacher/result', getResults);
router.get('/school/teacher/result/:id',getResultById);
router.put('/school/teacher/result/:id', updateResult);
router.delete('/school/teacher/result/:id',deleteResult);

// GET: Get result of a student in a class
router.get("/result/:classId/:studentId", getResultOfSchool);

export default router;