import express from 'express';
import { createAuthor, getAuthors, getAuthorById, updateAuthor, deleteAuthor } from '../../controllers/dashboard/createAuthorController';

const router = express.Router();

// Author management routes
router.post("/author",  createAuthor); // Create a new author
router.get("/authors", getAuthors); // Get all authors
router.get("/:authorId", getAuthorById); // Get a single author by ID
router.put("/:authorId",  updateAuthor); // Update an author
router.delete("/:authorId",  deleteAuthor); // Delete an author


export default router;