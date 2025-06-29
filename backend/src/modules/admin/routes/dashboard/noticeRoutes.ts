import express from "express";
import {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
  deleteMultipleNotices,
} from "../../controllers/dashboard/noticeController";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/school/notice", upload.single("attachment"), createNotice);
router.get("/all/school/notice", getAllNotices);
router.get("/school/notice/:id", getNoticeById);
router.put("/school/notice/:id", updateNotice);
router.delete("/school/notice/:id", deleteNotice);
router.delete("/school/notice/multiple", deleteMultipleNotices);

export default router;
