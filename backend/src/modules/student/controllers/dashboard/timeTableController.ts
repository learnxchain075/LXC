import { Response, Request } from "express";
import { prisma } from "../../../../db/prisma";
import { classIdParamSchema } from "../../../../validations/Module/StudentDashboard/timeTableValidation";

// Get Lesson of class for Student
export const getLessonByClassId = async (req: Request, res: Response) :Promise<any> => {
  try {
    const paramsResult = classIdParamSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return res.status(400).json({ error: paramsResult.error.errors });
    }
    const { classId } = paramsResult.data;
    const lessons = await prisma.lesson.findMany({
      where: { classId },
    });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};
