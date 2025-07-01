import { Router } from "express";
import { createFeeGroup, getFeeGroups, updateFeeGroup, deleteFeeGroup } from "../../controllers/dashboard/feeGroupController";

const router = Router();

router.post("/school/fee-group", createFeeGroup);
router.get("/school/fee-group", getFeeGroups);
router.put("/school/fee-group/:id", updateFeeGroup);
router.delete("/school/fee-group/:id", deleteFeeGroup);

export default router;
