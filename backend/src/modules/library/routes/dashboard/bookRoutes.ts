import express from 'express';
import { createBook, deleteBook, getBookById, getBooks, updateBook } from '../../controllers/dashboard/bookController';

const router = express.Router();


// Routes for managing books

router.post("/:libraryId/books",  createBook); // Create a book
router.get("/:libraryId/books", getBooks); // Get all books in a library
router.get("/:libraryId/books/:bookId", getBookById); // Get a single book
router.put("/:libraryId/books/:bookId",  updateBook); // Update a book
router.delete("/:libraryId/books/:bookId",  deleteBook); // Delete a book

export default router;