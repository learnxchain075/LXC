import express from 'express';
import { getAnswersByDoubtId, getAnswerById, createAnswer, updateAnswer, deleteAnswer } from '../../controllers/dashboard/answerController';

const router = express.Router();


router.get('/school/doubts/:doubtId/answers', getAnswersByDoubtId);
router.get('/school/answers/:id', getAnswerById);
router.post('/school/answers', createAnswer);
router.put('/school/answers/:id', updateAnswer);
router.delete('/school/answers/:id', deleteAnswer);

export default router;