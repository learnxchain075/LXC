import { Router } from "express";
import { createPickupPoint, getPickupPoint, getPickupPointsBySchool, updatePickupPoint, deletePickupPoint } from "../../controllers/dashboard/busPickupController";


const router = Router();

// Create a new Pickup Point
router.post("/school/transport/school/bus-pickup", createPickupPoint);
// Get Pickup Point by ID
router.get("/school/transport/school/bus-pickup/:id", getPickupPoint);

// Get all Pickup Points for a School
router.get("/school/transport/school/bus-pickup/:schoolId", getPickupPointsBySchool);

// Update a Pickup Point
router.put("/school/transport/school/bus-pickup/:id", updatePickupPoint);

// Delete a Pickup Point
router.delete("/school/transport/school/bus-pickup/:id", deletePickupPoint);


router.get('/school/transport/school/bus-pickup/school/:schoolId', getPickupPointsBySchool);

export default router;
