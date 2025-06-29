import express from "express";
import { body } from "express-validator";
import { refreshTokenHandler } from "../../controller/signin/refreshTokenController";


const router = express.Router();

router.post(
  "/refresh-token",
  [body("token", "Refresh Token is required").trim().notEmpty()],
  refreshTokenHandler
);

export default router;
