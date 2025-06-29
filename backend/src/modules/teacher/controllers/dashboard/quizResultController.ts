import { Request,Response,NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createQuizResultSchema,
  updateQuizResultSchema,
} from "../../../../validations/Module/TeacherDashboard/quizResultValidation";


// Create a new quiz result
export const createQuizResult = async (req: Request, res: Response, next:NextFunction) => {
    const result = createQuizResultSchema.safeParse(req.body);
    if (!result.success) {
      return next(handlePrismaError({ message: 'Validation failed', details: result.error.errors }));
    }
    const { userId, quizId, score } = result.data;
    try {
      const quizResult = await prisma.quizResult.create({
        data: { userId, quizId, score },
      });
      res.status(201).json(quizResult);
    } catch (error) {
      next(handlePrismaError(error));
    }
  };

// Get all quiz results for a user
export const getQuizResultsByUserId = async (req: Request, res: Response, next:NextFunction) => {
    const { userId } = req.params;
    try {
      const quizResults = await prisma.quizResult.findMany({
        where: { userId },
      });
      res.status(200).json(quizResults);
    } catch (error) {
      next(handlePrismaError(error));
    }
  };
  
  // Get a single quiz result by ID
  export const getQuizResultById = async (req: Request, res: Response, next:NextFunction): Promise<any> => {
    const { id } = req.params;
    try {
      const quizResult = await prisma.quizResult.findUnique({
        where: { id },
      });
      if (!quizResult) {
        return res.status(404).json({ error: 'Quiz result not found' });
      }
      res.status(200).json(quizResult);
    } catch (error) {
      next(handlePrismaError(error));
    }
  };
  
  
  
  // Update a quiz result
export const updateQuizResult = async (req: Request, res: Response, next:NextFunction) => {
    const { id } = req.params;
    const result = updateQuizResultSchema.safeParse(req.body);
    if (!result.success) {
      return next(handlePrismaError({ message: 'Validation failed', details: result.error.errors }));
    }
    const { score } = result.data;
    try {
      const quizResult = await prisma.quizResult.update({
        where: { id },
        data: { score },
      });
      res.status(200).json(quizResult);
    } catch (error) {
      next(handlePrismaError(error));
    }
  };
  
  // Delete a quiz result
  export const deleteQuizResult = async (req: Request, res: Response, next:NextFunction) => {
    const { id } = req.params;
    try {
      await prisma.quizResult.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
        next(handlePrismaError(error));
    }
  };