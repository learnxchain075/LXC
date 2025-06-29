import express from 'express';
import { createRoute, getRoutes, getRoute, updateRoute, deleteRoute, getRoutesBySchoolId } from '../../controllers/dashboard/routeController';

const router = express.Router();

router.post("/school/transport/school/bus-route", createRoute); // Create a Route
router.get("/school/transport/school/bus-routes", getRoutes); // Get all Routes
router.get("/school/transport/school/bus-route/:id", getRoute); // Get Route by ID
router.patch("/school/transport/school/bus-route/:id", updateRoute); // Update Route details
router.delete("/school/transport/school/bus-route/:id", deleteRoute); // Delete a Route

// Route to get all routes by school ID
router.get('/school/transport/school/routes/:schoolId', getRoutesBySchoolId);


export default router;