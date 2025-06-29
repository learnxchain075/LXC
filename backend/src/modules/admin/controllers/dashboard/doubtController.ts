import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import { createDoubtSchema, updateDoubtSchema } from "../../../../validations/Module/AdminDashboard/doubtValidation";
import { schoolIdParamSchema, cuidSchema } from "../../../../validations/common/commonValidation";
import { z } from "zod";

// Create a new doubt
export const createDoubt = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const parsed = createDoubtSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
  }

  const { title, content, userId, classId, subjectId } = parsed.data;
  try {
    const doubt = await prisma.doubt.create({
      data: { title, content, userId, classId, subjectId },
    });
    res.status(201).json(doubt);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all doubts
export const getAllDoubts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doubts = await prisma.doubt.findMany({
      include: { answers: true }, 
    });
    res.status(200).json(doubts);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a single doubt by ID
export const getDoubtById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }

  const { id } = params.data;
  try {
    const doubt = await prisma.doubt.findUnique({
      where: { id },
      include: { answers: true },
    });
    if (!doubt) {
      return res.status(404).json({ error: "Doubt not found" });
    }
    res.status(200).json(doubt);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update a doubt
export const updateDoubt = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  const body = updateDoubtSchema.safeParse(req.body);
  if (!params.success || !body.success) {
    return res.status(400).json({
      errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
    });
  }

  const { id } = params.data;
  const { title, content } = body.data;
  try {
    const doubt = await prisma.doubt.update({
      where: { id },
      data: { title, content },
    });
    res.status(200).json(doubt);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete a doubt
export const deleteDoubt = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }

  const { id } = params.data;
  try {
    await prisma.doubt.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all doubts by by schoolid

export const getDoubtsBySchoolId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = schoolIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { schoolId } = params.data;

  try {
    const doubts = await prisma.doubt.findMany({
      where: {
        OR: [
          {
            class: {
              schoolId,
            },
          },
          {
            user: {
              schoolId,
            },
          },
        ],
      },
      include: {
        answers: true,
        class: {
          include: { school: true },
        },
        subject: true,
        user: true,
      },
    });

    res.status(200).json(doubts);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Doubt of a User by userId
export const getDoubtsByUserId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ userId: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { userId } = params.data;

  try {
    const doubts = await prisma.doubt.findMany({
      where: { userId },
      include: {
        answers: true,
        class: {
          include: { school: true },
        },
        subject: true,
        user: true,
      },
    });

    res.status(200).json(doubts);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
