import express from 'express';
import { getMarksheet, getClassTopperList } from '../../controllers/dashboard/marksheetController';

const router = express.Router();

router.get('/school/teacher/marksheet/:classId/:studentId', getMarksheet);
router.get('/school/teacher/marksheet/topper/:classId', getClassTopperList);

export default router;
