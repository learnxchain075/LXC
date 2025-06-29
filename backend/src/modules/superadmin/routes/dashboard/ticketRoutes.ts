import express from "express";
import {
  createTicket,
  deleteTicket,
  getAllTickets,
  getTicketById,
  getTicketsBySchool,
  getTicketsByUser,
  updateTicket,
} from "../../controllers/createTicketController";

const router = express.Router();

router.post("/user/create-ticket", createTicket);
router.get("/get-tickets", getAllTickets);
router.get("/user/get-ticket/:ticketId", getTicketById);
router.get("/user/schooltickets/:schoolId", getTicketsBySchool);
router.put("/user/update-ticket/:ticketId", updateTicket);
router.delete("/user/delete-ticket/:ticketId", deleteTicket);

// Get Ticket by User ID

router.get("/user-tickets/:userId",getTicketsByUser );

export default router;
