import express from 'express';
import { addBookCopy, getBookCopies, updateBookCopy, deleteBookCopy } from '../../controllers/dashboard/bookCopyController';

const router = express.Router();


// Routes for managing book copies
router.post("/:libraryId/books/:bookId/copies",  addBookCopy); // Add a book copy
router.get("/:libraryId/books/:bookId/copies",  getBookCopies); // Get all copies of a book
router.put("/:libraryId/books/:bookId/copies/:copyId",  updateBookCopy); // Update a book copy
router.delete("/:libraryId/books/:bookId/copies/:copyId",  deleteBookCopy); // Delete a book copy


export default router;