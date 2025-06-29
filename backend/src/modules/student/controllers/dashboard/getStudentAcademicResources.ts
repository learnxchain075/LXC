import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';
import { studentIdParamSchema } from '../../../../validations/Module/StudentDashboard/getStudentAcademicResourcesValidation';


export const getStudentAcademicResources = async (req: Request, res: Response):Promise<any> => {
  const paramsResult = studentIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { studentId } = paramsResult.data;

  try {

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { classId: true }
    });

    if (!student) return res.status(404).json({ error: "Student not found" });

    // Fetch assignments
    const assignments = await prisma.assignment.findMany({
      where: { classId: student.classId },
      include: {
        subject: true,
        lesson: true
      },
      orderBy: { dueDate: 'asc' }
    });

    // Fetch homeworks
    const homeworks = await prisma.homeWork.findMany({
      where: { classId: student.classId },
      include: {
        subject: true,
        HomeworkSubmission: {
          where: { studentId }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    // Fetch PYQs
    const pyqs = await prisma.pYQ.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      assignments,
      homeworks,
      pyqs
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
