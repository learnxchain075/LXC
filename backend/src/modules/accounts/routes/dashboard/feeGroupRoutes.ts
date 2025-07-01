import { Router } from "express";
import { createFeeGroup, getFeeGroups, updateFeeGroup, deleteFeeGroup } from "../../controllers/dashboard/feeGroupController";

const router = Router();

router.post("/fee-group", createFeeGroup);
router.get("/fee-group", getFeeGroups);
router.put("/fee-group/:id", updateFeeGroup);
router.delete("/fee-group/:id", deleteFeeGroup);

export default router;
