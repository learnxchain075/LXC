import express from 'express';
import {
  registerEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  // getEmployeesBySchool,
} from '../../../controllers/dashboard/hrm/employeeController';
import multer from 'multer';


const upload = multer();
const router = express.Router();


router.post('/employee', upload.fields([{ name: 'profilePic', maxCount: 1 }]), registerEmployee);
router.get('/employees', getAllEmployees);
router.get('/employee/:id', getEmployee);
router.put('/employee/:id', updateEmployee);
router.delete('/employee/:id', deleteEmployee);
// router.get('/school/:schoolId/employees', getEmployeesBySchool);

export default router;
