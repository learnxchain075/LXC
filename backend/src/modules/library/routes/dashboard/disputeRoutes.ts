import express from 'express';
import { createDispute, addDisputeMessage, resolveDispute } from '../../controllers/dashboard/disputeController';

const router = express.Router();

// Dispute management routes
router.post("/:issueId",  createDispute); // Create a dispute
router.post("/:disputeId/messages",  addDisputeMessage); // Add message to a dispute
router.put("/:disputeId",  resolveDispute); // Resolve a dispute



export default router;