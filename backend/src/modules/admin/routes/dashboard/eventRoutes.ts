import { Router } from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsBySchoolId,
  getAllEventOfSchool,
} from "../../controllers/dashboard/eventController";
import multer from "multer";
const router = Router();
const upload = multer();
// Create a new event
router.post("/admin/school/event-create", upload.single("attachment"), createEvent);

// Get all events
router.get("/admin/events", getEvents);

// Get a single event by its id
router.get("/admin/event/:id", getEventById);

// Update an event by its id
router.put("/admin/event/:id", updateEvent);

// Delete an event by its id
router.delete("/admin/event/:id", deleteEvent);

// Get events by schoolId
// Example: GET /school/:schoolId
router.get("/school/:schoolId", getEventsBySchoolId);


// you can define another endpoint. Adjust the path if needed.
router.get("/all/:schoolId", getAllEventOfSchool);

export default router;
