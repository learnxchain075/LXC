import express from 'express';
import { createBus, getBuses, getBus, updateBus, deleteBus, getBusesBySchoolId } from '../../controllers/dashboard/busController';

const router = express.Router();


router.post("/school/transport/school/bus", createBus); // Create a bus
router.get("/school/transport/school/buses", getBuses); // Get all buses
router.get("/school/transport/school/bus/:id", getBus); // Get bus by ID
router.patch("/school/transport/school/bus/:id", updateBus); // Update bus details
router.delete("/school/transport/school/bus/:id", deleteBus); // Delete a bus

router.get('/school/transport/school/buses/school/:schoolId', getBusesBySchoolId);

export default router;