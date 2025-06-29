import express from 'express';
import { assignStudentToClass, assignTeacherToClass, createClass, deleteClass, getAssignedTeachersBySchool, getClassById, getClasses, getClassesBySchoolId, getClassesOfTeacher, getClassOfStudent, getStudentsOfClass, getTeacherClasses, updateClass } from '../../controllers/dashboard/classController';


const router = express.Router();


router.post('/teacher/class', createClass);
router.get('/school/classes', getClasses);
router.get('/teacher/class/:id',getClassById);
router.put('/teacher/class/:id',updateClass);
router.delete('/teacher/class/:id',deleteClass);


//  Get Classes of a school by schoolId 
router.get('/school/classes/:schoolId', getClassesBySchoolId)

// ✅ Assign a teacher to a class
router.post("/teacher/assign-teacher", assignTeacherToClass);

// ✅ Assign a student to a class
router.post("/student/assign-student", assignStudentToClass);

// // ✅ Get all teachers in a class
// router.get("/teacher/:classId/teachers", getClassesOfTeacher);

// GET classes of a specific teacher by ID
router.get("/teachers/:teacherId/classes", getClassesOfTeacher);

// ✅ Get all students in a class
router.get("/student/:classId/students", getClassOfStudent);


// Route: Get Students of a Class
router.get("/teacher/class/:classId/students", getStudentsOfClass);

router.get("/teacher/:teacherId/classes", getTeacherClasses);


// Get all class-teacher assignments for a school
router.get("/assigned-teachers/:schoolId", getAssignedTeachersBySchool);


export default router;
