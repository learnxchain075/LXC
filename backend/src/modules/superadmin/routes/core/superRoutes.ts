import express from "express";

import schoolRoutes from "./schoolRoute";
import userRoutes from "./userRoutes";
import superAdminRoute from "./superAdminRoute";
import permissionsRoute from "./permissionsRoute";
import featuresRoute from "./featuresRoutes";
import { validateModuleAccess } from "../../../../utils/jwt_utils";


const router = express.Router();

router.use("/schools", validateModuleAccess("school"), schoolRoutes);
router.use("/super-admin", validateModuleAccess("super-admin"), superAdminRoute);
router.use("/users", validateModuleAccess("users"), userRoutes);
router.use("/permissions", validateModuleAccess("permission"), permissionsRoute);
router.use("/features", validateModuleAccess("features"), featuresRoute);

export default router;
