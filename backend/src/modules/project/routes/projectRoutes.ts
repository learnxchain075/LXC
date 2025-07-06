import express from 'express';
import { addComment, createProject, createTask, getProjects, getTasks, updateTaskStatus } from '../controllers/projectController';

const router = express.Router();

router.post('/project', createProject);
router.get('/projects', getProjects);
router.post('/task', createTask);
router.get('/tasks', getTasks);
router.patch('/task/:id/status', updateTaskStatus);
router.post('/task/:id/comment', addComment);

export default router;
