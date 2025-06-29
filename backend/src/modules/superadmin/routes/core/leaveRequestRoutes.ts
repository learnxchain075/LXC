import express from "express";
import { createLeaveRequest, getAllLeaveRequests, getMyLeaves, approveLeaveRequest, rejectLeaveRequest, getLeaveRequestsBySchool } from "../../controllers/leaveRequestController";

const router = express.Router();



// POST /leaves - Create a new leave request
router.post("/user/leave", createLeaveRequest);

// GET /leaves - Get all leave requests (admin/superadmin only)
router.get("/user/leaves", getAllLeaveRequests);

// GET /leaves/me - Get logged-in user's leave requests
router.get("/user/leave/me", getMyLeaves);

// PATCH /leaves/:id/approve - Approve leave request
router.patch("/user/leave/:id/approve", approveLeaveRequest);

// PATCH /leaves/:id/reject - Reject leave request
router.patch("/user/leave/:id/reject", rejectLeaveRequest);


// Get leave request of a school 
router.get("/user/school/:schoolId", getLeaveRequestsBySchool);

export default router;
