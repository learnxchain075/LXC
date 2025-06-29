import express from 'express';
import { createDriver, getDrivers, getDriver, assignDriverToBus, updateDriver, deleteDriver, getDriversBySchoolId,  } from '../../controllers/dashboard/driverController';

const router = express.Router();

router.post("/school/transport/school/driver", createDriver); // Create a driver
router.get("/school/transport/school/drivers", getDrivers); // Get all drivers
router.get("/school/transport/school/driver/:id", getDriver); // Get driver by ID
router.patch("/school/transport/school/driver/assign", assignDriverToBus); // Assign driver to a bus
router.patch("/school/transport/school/driver/:id", updateDriver); // Update driver details
router.delete("/school/transport/school/driver/:id", deleteDriver); // Delete a driver


router.get('/school/transport/school/drivers/school/:schoolId', getDriversBySchoolId); // Get drivers by school ID

export default router;