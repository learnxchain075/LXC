import { Router } from 'express';
import { getComplaints, getComplaintById, createComplaint, updateComplaint, deleteComplaint, deleteAllComplaints } from '../../controllers/dashboard/complaintController';


const router = Router();

router.get('/hostel/complaint', getComplaints);
router.get('/hostel/complaint/:id', getComplaintById);
router.post('/hostel/complaint', createComplaint);
router.put('/hostel/complaint/:id', updateComplaint);
router.delete('/hostel/complaint/:id', deleteComplaint);
router.delete('/hostel/complaint', deleteAllComplaints);

export default router;
