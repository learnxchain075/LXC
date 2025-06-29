import express from 'express';
import { deleteSuperAdmin, getAllSuperAdmin, getSuperAdminById, registerSuperAdmin, updateSuperAdmin } from '../../controllers/registerSuperAdminController';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post('/add',upload.single("profilePic"), registerSuperAdmin);
router.get('/get-all',getAllSuperAdmin);
router.get('/get/:id',getSuperAdminById);
router.put('/update/:id',updateSuperAdmin);
router.delete('/delete/:id',deleteSuperAdmin);


export default router;