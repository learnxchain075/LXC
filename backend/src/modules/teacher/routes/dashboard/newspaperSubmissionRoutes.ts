import express from 'express';
import multer from 'multer';
import {
  submitNewspaperTranslation,
  getSubmissionsByNewspaper,
  getSubmissionsByStudent,
  deleteSubmission,
} from '../../controllers/dashboard/newspaperSubmissionController';

const router = express.Router();
const upload = multer();

router.post('/school/newspaper/submission', upload.single('voice'), submitNewspaperTranslation);
router.get('/school/newspaper/submission/newspaper/:newspaperId', getSubmissionsByNewspaper);
router.get('/school/newspaper/submission/student/:studentId', getSubmissionsByStudent);
router.delete('/school/newspaper/submission/:submissionId', deleteSubmission);

export default router;
