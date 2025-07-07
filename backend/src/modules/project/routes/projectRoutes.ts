import express from 'express';
import multer from 'multer';
import {
  addComment,
  updateComment,
  deleteComment,
  createProject,
  createTask,
  getProjects,
  getTasks,
  addAttachment,
  addGitHubRepo,
  createGitHubBranch,
  updateTaskStatus,
  updateProject,
  deleteProject,
  updateTask,
  deleteTask,
  getTask,
  getTimelineLogs,
} from '../controllers/projectController';
import { getWorkflow } from '../controllers/projectController';
import {
  createSprint,
  getSprints,
  updateSprint,
  deleteSprint,
  assignTaskSprint,
} from '../controllers/sprintController';
import {
  createEpic,
  getEpics,
  updateEpic,
  deleteEpic,
} from '../controllers/epicController';

const router = express.Router();
const upload = multer();

router.get('/projects', getProjects);
router.post('/project', createProject);
router.put('/project/:id', updateProject);
router.delete('/project/:id', deleteProject);
router.post('/project/:id/github-repo', addGitHubRepo);

router.get('/tasks', getTasks);
router.get('/task/:id', getTask);
router.get('/task/:id/timeline', getTimelineLogs);
router.post('/task', createTask);
router.put('/task/:id', updateTask);
router.delete('/task/:id', deleteTask);
router.patch('/task/:id/status', updateTaskStatus);
router.post('/task/:id/comment', addComment);
router.put('/comment/:id', updateComment);
router.delete('/comment/:id', deleteComment);
router.post('/task/:id/attachment', upload.single('file'), addAttachment);
router.post('/task/:id/github-branch', createGitHubBranch);
router.patch('/task/:id/sprint', assignTaskSprint);

router.get('/epics', getEpics);
router.post('/epic', createEpic);
router.put('/epic/:id', updateEpic);
router.delete('/epic/:id', deleteEpic);

router.get('/project/:id/sprints', getSprints);
router.post('/project/:id/sprints', createSprint);
router.put('/sprint/:id', updateSprint);
router.delete('/sprint/:id', deleteSprint);
router.get('/project/:id/workflow', getWorkflow);

export default router;
