import express from 'express'
import { createDoubt, deleteDoubt, getAllDoubts, getDoubtById, getDoubtsBySchoolId, getDoubtsByUserId, updateDoubt } from '../../controllers/dashboard/doubtController';

const router = express.Router();

router.post('/school/doubt', createDoubt);
router.get('/schools/doubts', getAllDoubts);
router.get('/school/doubt/:id', getDoubtById);
router.put('/school/doubt/:id', updateDoubt);
router.delete('/school/doubt/:id', deleteDoubt);

// ✅ Get doubts by schoolId through class.user.schoolId
router.get("/school/doubt/school/:schoolId", getDoubtsBySchoolId);

// ✅ Get doubts by user id 
router.get("/school/doubt/user/:userId", getDoubtsByUserId);

export default router;