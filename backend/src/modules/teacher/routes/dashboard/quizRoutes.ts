import express from 'express';
import { getAllQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz, getQuizzesByClassId } from '../../controllers/dashboard/quizController';


const router = express.Router();


router.get('/school/quizzes', getAllQuizzes);
router.get('/school/quizzes/:id', getQuizById);
router.post('/school/quizzes', createQuiz);
router.put('/school/quizzes/:id', updateQuiz);
router.delete('/school/quizzes/:id', deleteQuiz);

// Get all quizzes of a class by classId
router.get("/school/quizzes/class/:classId", getQuizzesByClassId);

export default router;