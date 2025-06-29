import express from "express";
import {
  getInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  recordInventoryTransaction,
  getInventoryTransactions,
} from "../../../../controllers/dashboard/hrm/inventory/inventoryController";

const router = express.Router();

router.get("/:schoolId/items", getInventoryItems); // Get all inventory items for a school
router.get("/item/:id", getInventoryItemById); // Get a single inventory item by ID
router.post("/:schoolId/item", createInventoryItem); // Create a new inventory item
router.put("/item/:id", updateInventoryItem); // Update an inventory item
router.delete("/item/:id", deleteInventoryItem); // Delete an inventory item

router.post("/transaction", recordInventoryTransaction); // Record an inventory transaction
router.get("/transactions/:inventoryItemId", getInventoryTransactions); // Get all transactions for an item

export default router;
