import express from "express";
import {
  createTicket,
  deleteTicket,
  getAllTickets,
  getTicketById,
  getTicketsBySchool,
  getTicketsByUser,
  getTicketsByAssignee,
  updateTicket,
} from "../../controllers/createTicketController";
import { getTicketMetadata } from "../../controllers/ticketMetadataController";

const router = express.Router();

router.post("/user/create-ticket", createTicket);
router.get("/get-tickets", getAllTickets);
router.get("/user/get-ticket/:ticketId", getTicketById);
router.get("/user/schooltickets/:schoolId", getTicketsBySchool);
router.put("/user/update-ticket/:ticketId", updateTicket);
router.delete("/user/delete-ticket/:ticketId", deleteTicket);

// Ticket metadata for dropdowns
router.get("/ticket-metadata", getTicketMetadata);

// Get Ticket by User ID

router.get("/user-tickets/:userId",getTicketsByUser );
router.get("/assignee-tickets/:userId", getTicketsByAssignee);

export default router;
