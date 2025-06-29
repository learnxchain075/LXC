import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';
import { studentIdParamSchema } from '../../../../validations/Module/StudentDashboard/getStudentFeesValidation';
import { generateStudentIdCard } from '../../../../utils/idCardGenerator';

export const downloadStudentIdCard = async (req: Request, res: Response): Promise<any> => {
  const paramsResult = studentIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { studentId } = paramsResult.data;

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        class: true,
        school: { include: { user: true } }
      }
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const pdfBuffer = await generateStudentIdCard(student);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${student.admissionNo}_id_card.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('ID card generation error', error);
    res.status(500).json({ message: 'Failed to generate ID card' });
  }
};
