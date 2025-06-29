import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createCompetitionSchema,
  updateCompetitionSchema,
} from "../../../../validations/Module/AdminDashboard/competitionValidation";
import { cuidSchema } from "../../../../validations/common/commonValidation";
import { z } from "zod";

// Create a new competition
export const createCompetition = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const parsed = createCompetitionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
  }

  const { name, userId, score } = parsed.data;
  try {
    const competition = await prisma.competition.create({
      data: { name, userId, score },
    });
    res.status(201).json(competition);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all competitions
export const getAllCompetitions = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const competitions = await prisma.competition.findMany();
    res.status(200).json(competitions);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a single competition by ID
export const getCompetitionById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }

  const { id } = params.data;
  try {
    const competition = await prisma.competition.findUnique({
      where: { id },
    });
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }
    res.status(200).json(competition);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update a competition
export const updateCompetition = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  const body = updateCompetitionSchema.safeParse(req.body);
  if (!params.success || !body.success) {
    return res.status(400).json({
      errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
    });
  }

  const { id } = params.data;
  const { name, score } = body.data;
  try {
    const competition = await prisma.competition.update({
      where: { id },
      data: { name, score },
    });
    res.status(200).json(competition);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete a competition
export const deleteCompetition = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }

  const { id } = params.data;
  try {
    await prisma.competition.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
