import { Router } from "express";
import { getInventories, getInventoryById, createInventory, updateInventory, deleteInventory } from "../../controllers/dashboard/inventoryController";

const router = Router();

router.get("/hostel/room/:roomId/inventory", getInventories);
router.get("/hostel/inventory/:id", getInventoryById);
router.post("/hostel/room/:roomId/inventory", createInventory);
router.put("/hostel/inventory/:id", updateInventory);
router.delete("/hostel/inventory/:id", deleteInventory);

export default router;
