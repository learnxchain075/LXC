import express from 'express';
import { getTopicsByRoadmapId, getTopicById, createTopic, updateTopic, deleteTopic, completeTopic } from '../../controllers/dashboard/topicController';

const router = express.Router();


router.get('/roadmaps/:roadmapId/topics', getTopicsByRoadmapId);
router.get('/topics/:id', getTopicById);
router.post('/topics', createTopic);
router.put('/topics/:id', updateTopic);
router.post('/topics/:id/complete', completeTopic);
router.delete('/topics/:id', deleteTopic);

export default router;