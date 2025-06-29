import express from "express";
import { getHostels, createHostel, getHostelById, updateHostel, deleteHostel, getHostelsBySchoolId, searchHostels } from "../../controllers/dashboard/hostelController";

const router = express.Router();

router.get("/hostel", getHostels); // Get all hostels (with pagination & filters)
router.post("/hostel", createHostel); // Create a new hostel
router.get("/hostel/:id", getHostelById); // Get hostel by ID
router.put("/hostel/:id", updateHostel); // Update hostel
router.delete("/hostel/:id", deleteHostel); // Delete hostel
router.get("/hostel/school/:schoolId", getHostelsBySchoolId); // Get hostels by school ID
router.get("/hostel/search", searchHostels); // Search hostels by name

export default router;
