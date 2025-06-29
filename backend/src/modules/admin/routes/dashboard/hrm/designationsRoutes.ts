import { Router } from "express";
import {
  getDesignations,
  getDesignationById,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  assignUserToDesignation,
  removeUserFromDesignation,
} from "../../../controllers/dashboard/hrm/designationController";

const router = Router();

// Get all designations for a school
router.get("/school/:schoolId/designations", getDesignations);

// Get a specific designation by ID
router.get("/school/designation/:id", getDesignationById);

// Create a new designation
router.post("/school/:schoolId/designation", createDesignation);

// Update a designation
router.put("/school/designation/:id", updateDesignation);

// Delete a designation
router.delete("/school/designation/:id", deleteDesignation);

// Assign a user to a designation
router.post("/school/user/:userId/assign-designation", assignUserToDesignation);

// Remove a user from a designation
router.delete("/school/user/:userId/remove-designation", removeUserFromDesignation);

export default router;
