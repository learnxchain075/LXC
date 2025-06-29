import express from 'express';
import { deleteLibrary, getAllLibrary, getLibraryById, registerLibrary, updateLibrary } from '../../../controllers/core/schoolauth/registerLibraryController';
import multer from 'multer';


const router = express.Router();
const upload = multer();
router.post('/library',upload.single("profilePic"), registerLibrary);
router.get('/library', getAllLibrary);
router.get('/library/:id', getLibraryById);
router.put('/library/:id', updateLibrary);
router.delete('/library/:id', deleteLibrary);

export default router;
