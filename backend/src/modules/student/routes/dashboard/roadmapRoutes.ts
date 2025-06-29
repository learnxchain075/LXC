import express from "express";
import {
  getAllRoadmaps,
  getRoadmapById,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
} from "../../controllers/dashboard/roadmapController";

const router = express.Router();

router.get("/roadmaps", getAllRoadmaps);
router.get("/roadmaps/:id", getRoadmapById);
router.post("/roadmaps", createRoadmap);
router.put("/roadmaps/:id", updateRoadmap);
router.delete("/roadmaps/:id", deleteRoadmap);

export default router;
