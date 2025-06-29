
import express from 'express';
import { createFine, getAllFines, getFineById, updateFine, deleteFine, payFine } from '../../controllers/dashboard/fineManagementController';

const router= express.Router();


router.post("/fine",  createFine); // Create fine
router.get("/fine",  getAllFines); // Get all fines
router.get("/:fineId",  getFineById); // Get single fine
router.put("/:fineId",  updateFine); // Update fine
router.delete("/:fineId",  deleteFine); // Delete fine
router.post("/:fineId/pay",  payFine); // Pay fine

export default router;