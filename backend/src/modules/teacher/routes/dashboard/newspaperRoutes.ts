import express from 'express';
import { getAllNewspapers, getNewspaperById, createNewspaper, updateNewspaper, deleteNewspaper, getNewspapersByClassId } from '../../controllers/dashboard/newspaperController';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.get('/school/newspapers', getAllNewspapers);
router.get('/school/newspapers/:id', getNewspaperById);
router.post('/school/newspapers',  upload.single("attachment"), createNewspaper);
router.put('/school/newspapers/:id', updateNewspaper);
router.delete('/school/newspapers/:id', deleteNewspaper);

// Get all newspapers of a class by classId
router.get("/school/newspapers/class/:classId", getNewspapersByClassId);

export default router;