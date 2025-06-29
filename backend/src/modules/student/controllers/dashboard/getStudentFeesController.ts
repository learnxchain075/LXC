import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';
import { studentIdParamSchema } from '../../../../validations/Module/StudentDashboard/getStudentFeesValidation';


export const getStudentFeesController = async (req: Request, res: Response) :Promise<any> => {
  const paramsResult = studentIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { studentId } = paramsResult.data;

  try {

    // 2. Fetch fees for student
    const fees = await prisma.fee.findMany({
      where: { studentId },
      include: {
        Payment: {
          select: {
            id: true,
            amount: true,
            status: true,
            paymentMethod: true,
            razorpayOrderId: true,
            razorpayPaymentId: true,
            paymentDate: true,
            createdAt: true,
          }
        },
        school: {
          select: {
            id: true,
            schoolName: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });

    return res.status(200).json({ success: true, fees });
  } catch (error) {
    console.error('Error fetching student fees:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
