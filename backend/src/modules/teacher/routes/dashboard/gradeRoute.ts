import express from 'express';
import { createGrade, deleteGrade, getGradeById, getGrades, updateGrade } from '../../controllers/dashboard/gradeController';


const router = express.Router();


router.post('/school/teacher/grade', createGrade);
router.get('/school/teacher/grade',getGrades);
router.get('/school/teacher/grade/:id',getGradeById);
router.put('/school/teacher/grade/:id',updateGrade);
router.delete('/school/teacher/grade/:id',deleteGrade);


export default router;