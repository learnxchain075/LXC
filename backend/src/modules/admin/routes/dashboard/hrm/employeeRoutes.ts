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


router.post('/lxc/employee', upload.fields([{ name: 'profilePic', maxCount: 1 }]), registerEmployee);
router.get('/lxc/employees', getAllEmployees);
router.get('/lxc/employee/:id', getEmployee);
router.put('/lxc/employee/:id', updateEmployee);
router.delete('/lxc/employee/:id', deleteEmployee);
// router.get('/school/:schoolId/employees', getEmployeesBySchool);

export default router;
