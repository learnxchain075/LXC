import express from "express";
import { deleteSchool, getAllSchools, getSchoolById, registerSchool, updateSchool, getSchoolLocation } from "../../controllers/schoolRegisterController";
import multer from 'multer';


const router = express.Router();
const upload = multer();

router.post("/register",upload.fields([
    {name: "profilePic", maxCount: 1},
    {name:"schoolLogo", maxCount: 1},

]), registerSchool);
router.get("/get-all", getAllSchools);
router.get("/get/:id", getSchoolById);
router.get("/location/:id", getSchoolLocation);
router.put("/update/:id", updateSchool);
router.delete("/delete/:id", deleteSchool);

export default router;