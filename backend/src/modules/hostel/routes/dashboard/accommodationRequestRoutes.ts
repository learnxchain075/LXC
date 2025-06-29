import express from "express";
import { getAccommodationRequests, getAccommodationRequestById, createAccommodationRequest, updateAccommodationRequest, deleteAccommodationRequest } from "../../controllers/dashboard/accommodationRequestController";


const router = express.Router();

router.get("/hostel/accommodation", getAccommodationRequests);
router.get("/hostel/accommodation/:id", getAccommodationRequestById);
router.post("/hostel/accommodation", createAccommodationRequest);
router.put("/hostel/accommodation/:id", updateAccommodationRequest);
router.delete("/hostel/accommodation/:id", deleteAccommodationRequest);

export default router;
