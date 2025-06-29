import express from 'express';
import multer from 'multer';
import {
  deleteteacher,
  getAllteacher,
  getAllteacherBySchool,
  getteacherById,
  registerteacher,
  updateteacher,
} from '../../../controllers/core/schoolauth/registerTeacherController';

const router = express.Router();
const upload = multer();

router.post(
  '/teacher',
  upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'Resume', maxCount: 1 },
    { name: 'joiningLetter', maxCount: 1 },
  ]),
  registerteacher
);
router.get('/teacher', getAllteacher);
router.get('/teacher/:id', getteacherById);
router.put(
  '/teacher/:id',
  upload.fields([{ name: 'profilePic', maxCount: 1 }]),
  updateteacher
);
router.delete('/teacher/:id', deleteteacher);

// Get Teacher of a school
router.get('/school/:schoolId/teacher', getAllteacherBySchool);

export default router;
