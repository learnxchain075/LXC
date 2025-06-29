import express from "express";
import { createRoom, getAllRooms, getRoomById, updateRoom, deleteRoom } from "../../controllers/dashboard/roomController";

const router = express.Router();

router.post("/hostel/room", createRoom);
router.get("/hostel/room", getAllRooms);
router.get("/hostel/room/:id", getRoomById);
router.put("/hostel/room/:id", updateRoom);
router.delete("/hostel/room/:id", deleteRoom);

export default router;
