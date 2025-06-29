import express from 'express';
import { getOutpassRequests, getOutpassRequestById, getOutpassRequestsByStudentId, createOutpassRequest, updateOutpassRequest, deleteOutpassRequest } from '../../controllers/dashboard/outpassRequestController';


const router = express.Router();

router.get('/hostel/outpass-requests', getOutpassRequests);
router.get('/hostel/outpass-requests/:id', getOutpassRequestById);
router.get('/hostel/outpass-requests/student/:studentId', getOutpassRequestsByStudentId);
router.post('/hostel/outpass-requests', createOutpassRequest);
router.put('/hostel/outpass-requests/:id', updateOutpassRequest);
router.delete('/hostel/outpass-requests/:id', deleteOutpassRequest);

export default router;
