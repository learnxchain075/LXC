import express from 'express';
import { getParentsBySchool, getChildrenByParent, getParentById } from '../../controllers/core/parentsController';

const router = express.Router();

router.get('/school/parents/:id', getParentById);

// Define the route to get parents for a specific school.
router.get('/schools/:schoolId/parents', getParentsBySchool);

// Define the route to get children of a specific parent.
router.get('/school/parents/:parentId/children', getChildrenByParent);

export default router;