import express from "express";
import { getPYQsByClassId } from "../../controllers/dashboard/pyqController";

const router = express.Router();

router.get("/school/pyqs/class/:classId", getPYQsByClassId);

export default router;
