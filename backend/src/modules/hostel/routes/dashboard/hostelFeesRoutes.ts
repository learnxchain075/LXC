import { Router } from 'express';
import { getHostelFees, getHostelFeeById, createHostelFee, updateHostelFee, deleteHostelFee } from '../../controllers/dashboard/hostelFeeController';


const router = Router();

router.get('/hostel/fees', getHostelFees); // Get all hostel fees
router.get('/hostel/fees/:id', getHostelFeeById); // Get a specific hostel fee
router.post('/hostel/fees', createHostelFee); // Create a new hostel fee
router.put('/hostel/fees/:id', updateHostelFee); // Update a hostel fee
router.delete('/hostel/fees/:id', deleteHostelFee); // Delete a hostel fee

export default router;
