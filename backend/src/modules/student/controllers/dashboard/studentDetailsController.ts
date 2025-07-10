import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { userIdParamSchema } from "../../../../validations/Module/StudentDashboard/studentDetailsValidation";

// Get student details by ID
export const getStudentDetails = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const paramsResult = userIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ message: "Validation failed", errors: paramsResult.error.errors });
  }
  const { id: userId } = paramsResult.data;

  try {
    const student = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: {
          include: {
            class: {
              include: {
                Subject: true,
              },
            },
            // Todo: Send Subject and subject id also
            route: true,
            busStop: true,
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};
