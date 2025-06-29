import express from 'express';

import multer from 'multer';
import { deletestudent, getAllstudent, getSchoolStudents, getstudentById, registerstudent, updatestudent } from '../../../controllers/core/schoolauth/registerStudentController';

const router = express.Router();
const upload = multer();

router.post('/student',upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'medicalCertificate', maxCount: 1 },
    { name: 'transferCertificate', maxCount: 1 }
 
]), registerstudent);
router.get('/student',getAllstudent);
router.get('/student/:id',getstudentById);
router.put('/student/:id',updatestudent);
router.delete('/student/:id',deletestudent);

// Get Student Of a School

router.get('/school/:schoolId/student',getSchoolStudents);


export default router;



// router.post("/register",upload.fields([
//     {name: "profilePic", maxCount: 1},
//     {name:"schoolLogo", maxCount: 1},

// ]), registerSchool);

