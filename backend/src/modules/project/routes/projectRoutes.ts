import express from 'express';
import {
  addComment,
  createProject,
  createTask,
  getProjects,
  getTasks,
  updateTaskStatus,
  updateProject,
  deleteProject,
  updateTask,
  deleteTask,
} from '../controllers/projectController';

const router = express.Router();

router.get('/projects', getProjects);
router.post('/project', createProject);
router.put('/project/:id', updateProject);
router.delete('/project/:id', deleteProject);

router.get('/tasks', getTasks);
router.post('/task', createTask);
router.put('/task/:id', updateTask);
router.delete('/task/:id', deleteTask);
router.patch('/task/:id/status', updateTaskStatus);
router.post('/task/:id/comment', addComment);

export default router;
