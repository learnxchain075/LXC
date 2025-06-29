import { Request,Response,NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  addBookCopySchema,
  updateBookCopySchema,
  bookCopyParamsSchema,
  copyIdParamSchema,
} from "../../../../validations/Module/LibraryDashboard/bookCopyValidation";




// Create a Book Copy
export const addBookCopy = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const paramsResult = bookCopyParamsSchema.safeParse(req.params);
        const bodyResult = addBookCopySchema.safeParse(req.body);

        if (!paramsResult.success || !bodyResult.success) {
            return res.status(400).json({
                error: [
                    ...(paramsResult.success ? [] : paramsResult.error.errors),
                    ...(bodyResult.success ? [] : bodyResult.error.errors),
                ],
            });
        }

        const { libraryId, bookId } = paramsResult.data;
        const { accessionNumber } = bodyResult.data;

        // Ensure user is authorized to add book copies
        const library = await prisma.library.findUnique({ where: { id: libraryId } });
        if (!library || !req.user || (library.userId && library.userId !== req.user.id) && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const copy = await prisma.bookCopy.create({
            data: { bookId, accessionNumber, status: 'AVAILABLE' },
        });
        res.status(201).json(copy);
    } catch (error) {
        next(handlePrismaError(error));
    }
};

// Get All Copies of a Book
export const getBookCopies = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const paramsResult = bookCopyParamsSchema.safeParse(req.params);

        if (!paramsResult.success) {
            return res.status(400).json({ error: paramsResult.error.errors });
        }

        const { bookId } = paramsResult.data;
        const copies = await prisma.bookCopy.findMany({ where: { bookId } });
        res.json(copies);
    } catch (error) {
        next(handlePrismaError(error));
    }
};

// Update Book Copy
export const updateBookCopy = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const paramsResult = copyIdParamSchema.safeParse(req.params);
        const bodyResult = updateBookCopySchema.safeParse(req.body);

        if (!paramsResult.success || !bodyResult.success) {
            return res.status(400).json({
                error: [
                    ...(paramsResult.success ? [] : paramsResult.error.errors),
                    ...(bodyResult.success ? [] : bodyResult.error.errors),
                ],
            });
        }

        const { copyId } = paramsResult.data;
        const updatedCopy = await prisma.bookCopy.update({ where: { id: copyId }, data: bodyResult.data });
        res.json(updatedCopy);
    } catch (error) {
        next(handlePrismaError(error));
    }
};

// Delete Book Copy
export const deleteBookCopy = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const paramsResult = copyIdParamSchema.safeParse(req.params);

        if (!paramsResult.success) {
            return res.status(400).json({ error: paramsResult.error.errors });
        }

        const { copyId } = paramsResult.data;
        await prisma.bookCopy.delete({ where: { id: copyId } });
        res.json({ message: 'Book copy deleted successfully' });
    } catch (error) {
        next(handlePrismaError(error));
    }
};