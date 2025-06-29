import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createAuthorSchema,
  updateAuthorSchema,
  authorIdParamSchema,
} from "../../../../validations/Module/LibraryDashboard/createAuthorValidation";


// Create an Author
export const createAuthor = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const bodyResult = createAuthorSchema.safeParse(req.body);

        if (!bodyResult.success) {
            return res.status(400).json({ error: bodyResult.error.errors });
        }

        const { name } = bodyResult.data;
        const author = await prisma.author.create({ data: { name } });
        res.status(201).json(author);
    } catch (error) {
        next(handlePrismaError(error));
    }
};

// Get All Authors
export const getAuthors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authors = await prisma.author.findMany();
        res.json(authors);
    } catch (error) {
        next(handlePrismaError(error));
    }
};

// Get Single Author
export const getAuthorById = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
    try {
        const paramsResult = authorIdParamSchema.safeParse(req.params);

        if (!paramsResult.success) {
            return res.status(400).json({ error: paramsResult.error.errors });
        }

        const { authorId } = paramsResult.data;
        const author = await prisma.author.findUnique({ where: { id: authorId } });
        if (!author) return res.status(404).json({ error: 'Author not found' });
        res.json(author);
    } catch (error) {
        next(handlePrismaError(error));
    }
};

// Update Author
export const updateAuthor = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const paramsResult = authorIdParamSchema.safeParse(req.params);
        const bodyResult = updateAuthorSchema.safeParse(req.body);

        if (!paramsResult.success || !bodyResult.success) {
            return res.status(400).json({
                error: [
                    ...(paramsResult.success ? [] : paramsResult.error.errors),
                    ...(bodyResult.success ? [] : bodyResult.error.errors),
                ],
            });
        }

        const { authorId } = paramsResult.data;
        const updatedAuthor = await prisma.author.update({ where: { id: authorId }, data: bodyResult.data });
        res.json(updatedAuthor);
    } catch (error) {
        next(handlePrismaError(error));
    }
};

// Delete Author
export const deleteAuthor = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const paramsResult = authorIdParamSchema.safeParse(req.params);

        if (!paramsResult.success) {
            return res.status(400).json({ error: paramsResult.error.errors });
        }

        const { authorId } = paramsResult.data;
        await prisma.author.delete({ where: { id: authorId } });
        res.json({ message: 'Author deleted successfully' });
    } catch (error) {
        next(handlePrismaError(error));
    }
};