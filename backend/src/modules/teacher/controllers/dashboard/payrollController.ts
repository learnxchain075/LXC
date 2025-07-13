import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { cuidSchema } from "../../../../validations/common/commonValidation";
import { z } from "zod";

export const getTeacherPayrolls = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const params = z.object({ teacherId: cuidSchema }).safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ error: params.error.issues });
    }
    const { teacherId } = params.data;

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { userId: true },
    });

    if (!teacher) return res.status(404).json({ error: "Teacher not found" });

    const payrolls = await prisma.payroll.findMany({
      where: { userId: teacher.userId },
      orderBy: { periodStart: "desc" },
    });

    res.json(payrolls);
  } catch (error) {
    console.error("Error fetching payrolls:", error);
    next(error);
  }
};
