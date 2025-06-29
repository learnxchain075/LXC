import express from "express";
import {
  createPYQ,
  deletePYQ,
  getAllPYQs,
  getPYQById,
  updatePYQ,
} from "../../controllers/dashboard/pyqController";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.get("/school/pyqs", getAllPYQs);
router.get("/school/pyqs/:id", getPYQById);
router.post(
  "/school/pyqs",
  upload.fields([
    { name: "question", maxCount: 1 },
    { name: "solution", maxCount: 1 },
  ]),
  createPYQ
);
router.put("/school/pyqs/:id", updatePYQ);
router.delete("/school/pyqs/:id", deletePYQ);

export default router;
