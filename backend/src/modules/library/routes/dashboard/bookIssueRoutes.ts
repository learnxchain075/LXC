import express from 'express';
import { issueBook, returnBook } from '../../controllers/dashboard/bookIssueController';

const router = express.Router();

// Routes for issuing and returning books
router.post("/:libraryId/books/issue",  issueBook); // Issue a book
router.post("/:libraryId/books/return/:issueId",  returnBook); // Return a book



export default router;