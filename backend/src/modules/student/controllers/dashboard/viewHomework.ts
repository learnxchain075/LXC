import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';
import { viewHomeworkSchema } from '../../../../validations/Module/StudentDashboard/viewHomeworkValidation';

export const viewHomework = async (req: Request, res: Response): Promise<any> => {
  const bodyResult = viewHomeworkSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return res.status(400).json({ error: bodyResult.error.errors });
  }
  const { studentId, homeworkId } = bodyResult.data;

  try {
    await prisma.homeworkView.upsert({
      where: { studentId_homeworkId: { studentId, homeworkId } },
      create: { studentId, homeworkId },
      update: { viewedAt: new Date() }
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error marking homework viewed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
