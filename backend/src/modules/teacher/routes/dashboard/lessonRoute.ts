import express from 'express';
import { createLesson, deleteLesson, getLessonById, getLessonByTeacherId, getLessons, updateLesson } from '../../controllers/dashboard/lessonController';


const router = express.Router();


router.post('/teacher/lesson', createLesson);
// router.get('/teacher/lesson',getLessons);
router.get('/teacher/lesson/:id',getLessonById);
router.put('/teacher/lesson/:id',updateLesson);
router.delete('/teacher/lesson/:id',deleteLesson);

router.get('/school/teacher/lesson/:id', getLessonByTeacherId);


export default router;