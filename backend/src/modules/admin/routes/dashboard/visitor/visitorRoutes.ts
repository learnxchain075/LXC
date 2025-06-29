// routes/visitorRoutes.ts
import { Router } from "express";
import { createVisitor, getVisitor, updateVisitor, deleteVisitor, verifyEntry, verifyExit, getVisitorOfSchool } from "../../../controllers/dashboard/visitor/visitorController";


const router = Router();

router.post("/school/visitor/create", createVisitor);
router.get("/school/visitor/:id", getVisitor);
router.put("/school/visitor/:id", updateVisitor);
router.delete("/school/visitor/:id", deleteVisitor);
router.post("/school/visitor/verify-entry", verifyEntry);
router.post("/school/visitor/verify-exit", verifyExit);

// get visitor of a school

router.get("/school/:schoolId/visitors", getVisitorOfSchool);

export default router;
