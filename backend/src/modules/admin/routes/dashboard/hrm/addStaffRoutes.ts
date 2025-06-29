import express from 'express';
import { registerStaff, getAllStaff, getStaff, updateStaff, deleteStaff, getStaffBySchool } from '../../../controllers/dashboard/hrm/addStaffController';
import multer from 'multer';


const upload = multer();
const router = express.Router();


router.post("/school/staff-register", upload.fields([{ name: "profilePic", maxCount: 1 }]), registerStaff);
router.get("/allschool/staff", getAllStaff);
router.get("/school/staff/:id", getStaff);
router.put("/school/staff/:id", updateStaff);
router.delete("/school/staff/:id", deleteStaff);
router.get("/staff/school/:schoolId", getStaffBySchool);

export default router;
