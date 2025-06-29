import express from 'express';
import { getAllGuardians, getGuardianOfStudent, getGuardiansOfSchool, updateGuardian, deleteGuardian, getStudentsByAuthenticatedGuardian } from '../../controllers/core/guardianController';

const router = express.Router();

router.get('/admin/school/guardians', getAllGuardians);
router.get('/student/:studentId/guardian', getGuardianOfStudent);
router.get('/school/:schoolId/guardians', getGuardiansOfSchool);
router.put('/student/:studentId/guardian', updateGuardian);
router.delete('/student/:studentId/guardian', deleteGuardian);


router.get("/guardian-all/students", getStudentsByAuthenticatedGuardian);

export default router;
