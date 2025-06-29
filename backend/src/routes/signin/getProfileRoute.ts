import express from "express";
import { Role } from "@prisma/client";

import { getUserPermissions, getUserProfile } from "../../controller/signin/signinController";
import { authenticateToken } from "../../utils/jwt_utils";

const router = express.Router();

router.get("/get-profile", async (req, res) => {
  try {
    console.log(req.user);
    const user = await getUserProfile(req.user!.id);
    const userPermissions = req.user!.role !== Role.superadmin ? await getUserPermissions(req.user!.id) : {};

    res.status(200).json({ success: "ok", user, ...userPermissions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
