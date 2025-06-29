import { Request ,Response,NextFunction} from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createTopicSchema,
  roadmapIdParamSchema,
  topicIdParamSchema,
  updateTopicSchema,
} from "../../../../validations/Module/StudentDashboard/topicValidation";



  // Create a new topic
export const createTopic = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const bodyResult = createTopicSchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({ error: bodyResult.error.errors });
    }
    const { name, roadmapId } = bodyResult.data;
    try {
      const topic = await prisma.topic.create({ 
        data: { name, roadmapId },
      });
      res.status(201).json(topic);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };

// Get all topics for a roadmap
export const getTopicsByRoadmapId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const paramsResult = roadmapIdParamSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }
    const { roadmapId } = paramsResult.data;
    try {
      const topics = await prisma.topic.findMany({
        where: { roadmapId },
      });
      res.status(200).json(topics);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  
  // Get a single topic by ID
export const getTopicById = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
    const paramsResult = topicIdParamSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }
    const { id } = paramsResult.data;
    try {
      const topic = await prisma.topic.findUnique({
        where: { id },
      });
      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
      }
      res.status(200).json(topic);
    } catch (error) {
        next(handlePrismaError(error));
    }
  };
  

  
  // Update a topic
export const updateTopic = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = topicIdParamSchema.safeParse(req.params);
  const bodyResult = updateTopicSchema.safeParse(req.body);
  if (!paramsResult.success || !bodyResult.success) {
    return res.status(400).json({
      error: [
        ...(paramsResult.success ? [] : paramsResult.error.errors),
        ...(bodyResult.success ? [] : bodyResult.error.errors),
      ],
    });
  }
  const { id } = paramsResult.data;
  const { name } = bodyResult.data;
  try {
    const topic = await prisma.topic.update({
      where: { id },
      data: { name },
    });
    res.status(200).json(topic);
  } catch (error) {
      next(handlePrismaError(error));
  }
};

// Mark topic as completed and reward coins
export const completeTopic = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const paramsResult = topicIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { id } = paramsResult.data;
  try {
    const topic = await prisma.topic.update({
      where: { id },
      data: { isCompleted: true, completedAt: new Date() },
      include: { roadmap: true }
    });

    const roadmapId = topic.roadmapId;
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId },
      include: { topics: true }
    });

    if (roadmap) {
      const completed = roadmap.topics.filter(t => t.isCompleted).length;
      const progress = Math.round((completed / roadmap.topics.length) * 100);

      await prisma.roadmap.update({
        where: { id: roadmapId },
        data: { progress, coinsEarned: { increment: 5 } }
      });

      await prisma.user.update({
        where: { id: roadmap.userId },
        data: { coins: { increment: 5 } }
      });

      await prisma.leaderboard.upsert({
        where: { userId: roadmap.userId },
        update: { coinsEarned: { increment: 5 } },
        create: { userId: roadmap.userId, points: progress, coinsEarned: 5, rank: 0 }
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(handlePrismaError(error));
  }
};
  
  // Delete a topic
  export const deleteTopic = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const paramsResult = topicIdParamSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }
    const { id } = paramsResult.data;
    try {
      await prisma.topic.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
        next(handlePrismaError(error));
    }
  };