import express from 'express';
import { getTeacherStudentsLeaveRequests } from '../../controllers/dashboard/leaveRequestController';

const router = express.Router();

router.get('/teacher/:teacherId/student-leave-requests', getTeacherStudentsLeaveRequests);

export default router;
