import express from "express";
import { getAllUsers, getUserById } from "../../controllers/userController";

const router = express.Router();

router.get("/user/get-all", getAllUsers );
router.get("/user/get/:id", getUserById );

export default router;
