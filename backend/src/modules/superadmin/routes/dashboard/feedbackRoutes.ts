import express from 'express';
import { approveFeedback, createFeedback, deleteFeedback, getAllApprovedFeedback, getAllFeedback, getFeedbackById, getFeedbackBySchool, rejectFeedback, updateFeedback } from '../../controllers/feedbackController';

const router = express.Router();    

// Create feedback
router.post("/create-feedback", createFeedback);
// Get ALL feedback
router.get("/get-feedbacks", getAllFeedback);

// Get Feedback by id 
router.get("/get-feedback/:feedbackId", getFeedbackById);

// Get a School Feedback
router.get("/schoolfeedback/:schoolId", getFeedbackBySchool);

// update feedback
router.put("/update-feedback/:feedbackId", updateFeedback);

// Delete feed back
router.delete("/delete-feedback/:feedbackId", deleteFeedback);

// Approve Feed Back 
router.patch("/approve-feedback/:feedbackId", approveFeedback);

// Reject Feedback 
router.patch("/reject-feedback/:feedbackId", rejectFeedback);



// Public route: Get all approved feedback
router.get('/feedbacks/approved', getAllApprovedFeedback);


export default router;
