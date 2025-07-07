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
  getTaskCalendar,
  updateWorkflow,
  addProjectMember,
  removeProjectMember,
  getCurrentProjectRole,
  createLabel,
  getLabels,
  updateLabel,
  deleteLabel,
  watchTask,
  unwatchTask,
  getNotifications,
  handleGitHubWebhook,
  setGitHubToken,
  getGitHubToken,
  fetchTaskCIStatus,
} from '../controllers/projectController';
import { getWorkflow } from '../controllers/projectController';
import { requireProjectRole, requireTaskAdmin, requireSprintAdmin } from '../../../middlewares/projectRole';
import { ProjectRole } from '@prisma/client';
import {
  createSprint,
  getSprints,
  updateSprint,
  deleteSprint,
  assignTaskSprint,
  getSprintBurndown,
} from '../controllers/sprintController';
import {
  createEpic,
  getEpics,
  updateEpic,
  deleteEpic,
} from '../controllers/epicController';
import { authenticateToken } from '../../../utils/jwt_utils';
// import { authenticateToken } from '../../utils/jwt_utils';



const router = express.Router();
const upload = multer();

router.get('/projects', getProjects);
router.post('/project', createProject);
router.put('/project/:id', requireProjectRole('id', [ProjectRole.ADMIN]), updateProject);
router.delete('/project/:id', requireProjectRole('id', [ProjectRole.ADMIN]), deleteProject);
router.post('/project/:id/github-repo', addGitHubRepo);
router.put('/project/:id/workflow', requireProjectRole('id', [ProjectRole.ADMIN]), updateWorkflow);
router.post('/project/:id/users', requireProjectRole('id', [ProjectRole.ADMIN]), addProjectMember);
router.delete('/project/:id/users/:userId', requireProjectRole('id', [ProjectRole.ADMIN]), removeProjectMember);
router.get('/project/:id/role', getCurrentProjectRole);
router.get('/project/:id/labels', getLabels);
router.post('/project/:id/labels', requireProjectRole('id', [ProjectRole.ADMIN]), createLabel);
router.put('/label/:id', updateLabel);
router.delete('/label/:id', deleteLabel);

router.get('/tasks', getTasks);
router.get('/tasks/calendar', getTaskCalendar);
router.get('/task/:id', getTask);
router.get('/task/:id/timeline', getTimelineLogs);
router.post('/task', createTask);
router.put('/task/:id', updateTask);
router.delete('/task/:id', requireTaskAdmin, deleteTask);
router.patch('/task/:id/status', updateTaskStatus);
router.post('/task/:id/comment', addComment);
router.put('/comment/:id', updateComment);
router.delete('/comment/:id', deleteComment);
router.post('/task/:id/attachment', upload.single('file'), addAttachment);
router.post('/task/:id/github-branch', createGitHubBranch);
router.patch('/task/:id/sprint', assignTaskSprint);
router.post('/task/:id/watch', watchTask);
router.delete('/task/:id/watch', unwatchTask);
router.get('/users/:userId/notifications', getNotifications);
router.post('/webhook/github', handleGitHubWebhook);
router.post('/github/token', authenticateToken, setGitHubToken);
router.get('/github/token', authenticateToken, getGitHubToken);
router.get('/task/:id/ci-status', authenticateToken, fetchTaskCIStatus);

router.get('/epics', getEpics);
router.post('/epic', createEpic);
router.put('/epic/:id', updateEpic);
router.delete('/epic/:id', deleteEpic);

router.get('/project/:id/sprints', getSprints);
router.post('/project/:id/sprints', requireProjectRole('id', [ProjectRole.ADMIN]), createSprint);
router.put('/sprint/:id', requireSprintAdmin, updateSprint);
router.delete('/sprint/:id', requireSprintAdmin, deleteSprint);
router.get('/sprint/:id/burndown', getSprintBurndown);
router.get('/project/:id/workflow', getWorkflow);

export default router;
