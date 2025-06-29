import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createLeaderboardSchema,
  updateLeaderboardSchema,
} from "../../../../validations/Module/AdminDashboard/leaderboardValidation";
import { cuidSchema } from "../../../../validations/common/commonValidation";
import { z } from "zod";

// Create a leaderboard entry (might be automatic in practice)
export const createLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const parsed = createLeaderboardSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
  }
  const { userId, points, coinsEarned, rank } = parsed.data;
  try {
    const leaderboard = await prisma.leaderboard.create({
      data: { userId, points, coinsEarned, rank },
    });
    res.status(201).json(leaderboard);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get the leaderboard
export const getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leaderboard = await prisma.leaderboard.findMany({
      orderBy: { points: "desc" },
      include: { user: true },
    });
    res.status(200).json(leaderboard);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a single leaderboard entry by ID
export const getLeaderboardById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { id } = params.data;
  try {
    const leaderboard = await prisma.leaderboard.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!leaderboard) {
      return res.status(404).json({ error: "Leaderboard entry not found" });
    }
    res.status(200).json(leaderboard);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update a leaderboard entry
export const updateLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  const body = updateLeaderboardSchema.safeParse(req.body);
  if (!params.success || !body.success) {
    return res
      .status(400)
      .json({ errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)] });
  }
  const { id } = params.data;
  const { points, coinsEarned, rank } = body.data;
  try {
    const leaderboard = await prisma.leaderboard.update({
      where: { id },
      data: { points, coinsEarned, rank },
    });
    res.status(200).json(leaderboard);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete a leaderboard entry
export const deleteLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { id } = params.data;
  try {
    await prisma.leaderboard.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
