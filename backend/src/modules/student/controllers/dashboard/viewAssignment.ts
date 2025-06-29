import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';
import { viewAssignmentSchema } from '../../../../validations/Module/StudentDashboard/viewAssignmentValidation';

export const viewAssignment = async (req: Request, res: Response): Promise<any> => {
  const bodyResult = viewAssignmentSchema.safeParse(req.body);
  if (!bodyResult.success) {
    return res.status(400).json({ error: bodyResult.error.errors });
  }
  const { studentId, assignmentId } = bodyResult.data;
  try {
    await prisma.assignmentView.upsert({
      where: { studentId_assignmentId: { studentId, assignmentId } },
      create: { studentId, assignmentId },
      update: { viewedAt: new Date() }
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error marking assignment viewed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
