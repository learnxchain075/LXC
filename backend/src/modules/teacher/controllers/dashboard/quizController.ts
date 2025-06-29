import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import { createQuizSchema, updateQuizSchema } from "../../../../validations/Module/TeacherDashboard/quizValidation";


  // Create a new quiz
export const createQuiz = async (req: Request, res: Response, next: NextFunction) => {
  const result = createQuizSchema.safeParse(req.body);

  if (!result.success) {
    return next(
      handlePrismaError({
        message: "Validation failed",
        details: result.error.errors,
      })
    );
  }

  const { question, options, answer, classId, maxScore, startDate, endDate } = result.data;

  try {
    const quiz = await prisma.quiz.create({
      data: {
        question,
        options,
        answer,
        classId,
        maxScore,
        startDate,
        endDate,
      },
    });

    res.status(201).json(quiz);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all quizzes
export const getAllQuizzes = async (req: Request, res: Response, next:NextFunction) => {
    try {
      const quizzes = await prisma.quiz.findMany();
      res.status(200).json(quizzes);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  
  // Get a single quiz by ID
  export const getQuizById = async (req: Request, res: Response, next:NextFunction) :Promise<any>=> {
    const { id } = req.params;
    try {
      const quiz = await prisma.quiz.findUnique({
        where: { id },
      });
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
      res.status(200).json(quiz);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  

  // Update a quiz
export const updateQuiz = async (req: Request, res: Response, next:NextFunction) => {
    const { id } = req.params;
    const result = updateQuizSchema.safeParse(req.body);
    if (!result.success) {
      return next(handlePrismaError({ message: 'Validation failed', details: result.error.errors }));
    }
    const { question, options, answer } = result.data;
    try {
      const quiz = await prisma.quiz.update({
        where: { id },
        data: { question, options, answer },
      });
      res.status(200).json(quiz);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  
  // Delete a quiz
  export const deleteQuiz = async (req: Request, res: Response, next:NextFunction) => {
    const { id } = req.params;
    try {
      await prisma.quiz.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
        next(handlePrismaError(error));
    }
  };

  // Get all Quiz of a School By classId
export const getQuizzesByClassId = async (req: Request, res: Response, next: NextFunction) => {
  const { classId } = req.params;
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { classId },
    });

    res.status(200).json(quizzes);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
