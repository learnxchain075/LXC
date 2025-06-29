import { Router } from 'express';
import { getDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment, assignUserToDepartment, removeUserFromDepartment, getDepartmentUsers } from '../../../controllers/dashboard/hrm/departmentController';


const router = Router();

// Department Routes
router.post('/schools/departments', createDepartment);
router.get('/schools/:schoolId/departments', getDepartments);
router.get('/departments/:id', getDepartmentById);
router.put('/departments/:id', updateDepartment);
router.delete('/departments/:id', deleteDepartment);

// User Assignment Routes
router.post('/departments/:departmentId/users/:userId', assignUserToDepartment);
router.delete('/departments/:departmentId/users/:userId', removeUserFromDepartment);
router.get('/departments/:departmentId/users', getDepartmentUsers);

export default router;
