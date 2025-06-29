import express from "express";
import {
  assignTransport,
  getTransportDetails,
  updateTransport,
  removeTransport,
} from "../../controllers/dashboard/assignTransportStudentController";

const router = express.Router();

router.put("/transport/school/assign-transport/:studentId", assignTransport); // Assign or update transport details
router.get("/transport/school/assign-transport/:studentId", getTransportDetails); // Get transport details
router.patch("/transport/school/assign-transport/:studentId", updateTransport); // Update transport details
router.delete("/transport/school/assign-transport/:studentId", removeTransport); // Remove transport details

export default router;
