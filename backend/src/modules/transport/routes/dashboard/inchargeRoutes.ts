import express from 'express';
import { createIncharge, getIncharges, getIncharge, updateIncharge, deleteIncharge } from '../../controllers/dashboard/inchargeController';

const router = express.Router();

router.post("/transport/school/incharge", createIncharge); // Create an Incharge
router.get("/transport/school/incharges`", getIncharges); // Get all Incharges
router.get("/transport/school/incharge/:id", getIncharge); // Get Incharge by ID
router.patch("/transport/school/incharge/:id", updateIncharge); // Update Incharge details
router.delete("/transport/school/incharge/:id", deleteIncharge); // Delete an Incharge

export default router;