import express from "express";
import { deleteAllLogs, getLogs } from "../controller/logsController";



const router = express.Router();

router.get("/server/logs", getLogs);

router.delete("/server/logs", deleteAllLogs);

export default router;
