import { Request, Response, NextFunction } from "express";
import { differenceInCalendarDays, addDays } from "date-fns";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createRoadmapSchema,
  roadmapIdParamSchema,
  updateRoadmapSchema,
} from "../../../../validations/Module/StudentDashboard/roadmapValidation";

interface CreateRoadmapBody {
  userId: string;
  subjectId: string;
  durationDays: number;
  title?: string;
}





// Create a new roadmap with auto-generated topics
export const createRoadmap = async (
  req: Request<{}, any, CreateRoadmapBody>,
  res: Response,
  next: NextFunction
) :Promise<any> => {
  const bodyResult = createRoadmapSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return res.status(400).json({ error: bodyResult.error.errors });
  }
  const { userId, subjectId, durationDays, title } = bodyResult.data;

  try {
    const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    const startDate = new Date();
    const endDate = addDays(startDate, durationDays);

    const roadmap = await prisma.roadmap.create({
      data: {
        title: title || `${subject.name} Roadmap`,
        userId,
        subjectId,
        startDate,
        endDate
      }
    });

    const topicsData = Array.from({ length: durationDays }, (_, i) => ({
      name: `Topic ${i + 1}`,
      roadmapId: roadmap.id
    }));

    await prisma.topic.createMany({ data: topicsData });

    const fullRoadmap = await prisma.roadmap.findUnique({
      where: { id: roadmap.id },
      include: { topics: true }
    });

    res.status(201).json(fullRoadmap);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all roadmaps
export const getAllRoadmaps = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roadmaps = await prisma.roadmap.findMany({
        include: { topics: true },
      });
      res.status(200).json(roadmaps);
    } catch (error) {
      next(handlePrismaError(error));
    }
  };
  
  // Get a single roadmap by ID
  export const getRoadmapById = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
    const paramsResult = roadmapIdParamSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }
    const { id } = paramsResult.data;
    try {
      const roadmap = await prisma.roadmap.findUnique({
        where: { id },
        include: { topics: true },
      });
      if (!roadmap) {
        return res.status(404).json({ error: 'Roadmap not found' });
      }
      res.status(200).json(roadmap);
    } catch (error) {
      next(handlePrismaError(error));
    }
  };
  

  
  // Update a roadmap
export const updateRoadmap = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = roadmapIdParamSchema.safeParse(req.params);
  const bodyResult = updateRoadmapSchema.safeParse(req.body);
  if (!paramsResult.success || !bodyResult.success) {
    return res.status(400).json({
      error: [
        ...(paramsResult.success ? [] : paramsResult.error.errors),
        ...(bodyResult.success ? [] : bodyResult.error.errors),
      ],
    });
  }
  const { id } = paramsResult.data;
  const { title, progress, coinsEarned } = bodyResult.data;
  try {
    const roadmap = await prisma.roadmap.update({
      where: { id },
      data: {
        title,
        progress,
        coinsEarned
      },
    });
    res.status(200).json(roadmap);
  } catch (error) {
    next(handlePrismaError(error));
  }
  };
  
  // Delete a roadmap
  export const deleteRoadmap = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const paramsResult = roadmapIdParamSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }
    const { id } = paramsResult.data;
    try {
      await prisma.roadmap.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
      next(handlePrismaError(error));
    }
  };