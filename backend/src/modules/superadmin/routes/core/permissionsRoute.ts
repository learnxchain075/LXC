import express from "express";

import {
  getUserPermissionsById,
  updateUserPermissions,
  sharePermissions,
} from "../../controllers/userPermissionController";

const router = express.Router();

router.get("/get/:userId", getUserPermissionsById);
router.get("/update/:userId", updateUserPermissions);
router.post("/share/permission", sharePermissions);

export default router;
