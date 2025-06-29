import express from 'express';
import { createBusStop, getBusStops, getBusStop, updateBusStop, deleteBusStop, getBusStopsBySchoolId } from '../../controllers/dashboard/busStopController';

const router = express.Router();

router.post("/school/transport/school/bus-stop", createBusStop); // Create a bus stop
router.get("/school/transport/school/bus-stops", getBusStops); // Get all bus stops
router.get("/school/transport/school/bus-stop/:id", getBusStop); // Get bus stop by ID
router.patch("/school/transport/school/bus-stop/:id", updateBusStop); // Update bus stop details
router.delete("/school/transport/school/bus-stop/:id", deleteBusStop); // Delete a bus stop


// Route: GET all bus pickup points of a school by schoolId
router.get("/school/transport/school/bus-pickup/school/:schoolId", getBusStopsBySchoolId);

export default router;