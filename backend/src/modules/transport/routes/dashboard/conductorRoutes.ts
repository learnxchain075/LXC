import express from 'express';
import { createConductor, getConductors, getConductor, assignConductorToBus, updateConductor, deleteConductor } from '../../controllers/dashboard/conductorController';

const router = express.Router();

router.post("/transport/school/conductor", createConductor); // Create a conductor
router.get("/transport/school/conductor", getConductors); // Get all conductors
router.get("/transport/school/conductor/:id", getConductor); // Get conductor by ID
router.patch("/transport/school/conductor/assign", assignConductorToBus); // Assign conductor to a bus
router.patch("/transport/school/conductor/:id", updateConductor); // Update conductor details
router.delete("/transport/school/conductor/:id", deleteConductor); // Delete a conductor

export default router;