// routes/student.ts
import express from 'express';
import { getLessonsForStudentController } from '../../controllers/dashboard/getLessonsForStudentController';
import { getStudentFeesController } from '../../controllers/dashboard/getStudentFeesController';
import { getStudentAcademicResources } from '../../controllers/dashboard/getStudentAcademicResources';
import { submitHomework } from '../../../teacher/controllers/dashboard/homeWorkController';
import { submitAssignment } from '../../controllers/dashboard/submitAssignment';
import { getStudentAttendanceAndLeave } from '../../controllers/dashboard/getStudentAttendanceAndLeave';
import { getStudentNoticesEventsHolidays } from '../../controllers/dashboard/getStudentNoticesEventsHolidays';
import { getStudentExamsAndResults, getStudentSubjectWiseResults } from '../../controllers/dashboard/getStudentExamsAndResults';
import { getStudentQuizzesAndNewspapers } from '../../controllers/dashboard/getStudentQuizzesAndNewspapers';
import { getMonthlyLeaderboard } from '../../controllers/dashboard/getMonthlyLeaderboard';
import { getClassInternalLeaderboard } from '../../controllers/dashboard/getClassInternalLeaderboard';
import { getRoadmapLeaderboard } from '../../controllers/dashboard/getRoadmapLeaderboard';
import { viewHomework } from '../../controllers/dashboard/viewHomework';
import { viewAssignment } from '../../controllers/dashboard/viewAssignment';
import multer from 'multer';


const router = express.Router();
const upload = multer();

router.get('/student/:studentId/lessons', getLessonsForStudentController);
router.get('/student/:studentId/fees', getStudentFeesController);
router.get('/student/:studentId/resources', getStudentAcademicResources);
router.post('/student/:studentId/submit-homework', upload.single('file'), submitHomework);
router.post('/student/:studentId/submit-assignment', upload.single('file'), submitAssignment);
router.post('/student/:studentId/view-homework', viewHomework);
router.post('/student/:studentId/view-assignment', viewAssignment);
router.get('/student/:studentId/dashboard-resources', getStudentNoticesEventsHolidays);
router.get('/student/:studentId/attendance-leaves', getStudentAttendanceAndLeave);
router.get('/student/:studentId/exams-results', getStudentExamsAndResults);

router.get('/student/:studentId/results-summary', getStudentSubjectWiseResults);

router.get('/student/:studentId/quiz-newspaper', getStudentQuizzesAndNewspapers);



// Not Tested Yet
router.get('/leader-board/monthly', getMonthlyLeaderboard);
// routes/leaderboard.ts
router.get('/class/:classId/internal', getClassInternalLeaderboard);
router.get('/class/:classId/roadmap', getRoadmapLeaderboard);

export default router;
