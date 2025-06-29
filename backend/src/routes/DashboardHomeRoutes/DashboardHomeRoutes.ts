import express from 'express';
import { getSuperAdminDashboard } from '../../controller/Dashboard/superAdminDashboardController';
import { getStudentDashboard } from '../../controller/Dashboard/getStudentDashboardController';
import { getSchoolAdminDashboard } from '../../controller/Dashboard/getSchoolAdminDashboardController';
import { getParentDashboard } from '../../controller/Dashboard/getParentDashboardController';
import { getTeacherDashboard } from '../../controller/Dashboard/getTeacherDashboardController';

const router = express.Router();

router.get('/super-admin/dashboard', getSuperAdminDashboard);

// Get Student Dashboard home 

router.get('/school-student/dashboard',getStudentDashboard)

// School admin Dahbo0ard

router.get('/school-admin/dashboard',getSchoolAdminDashboard)

// Paretns Admin Dsahboard 
router.get('/school-parent/dashboard',getParentDashboard)

router.get('/school-teacher/dashboard', getTeacherDashboard)


export default router;
