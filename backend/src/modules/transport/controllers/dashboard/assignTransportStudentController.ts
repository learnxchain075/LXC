import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  studentIdParamSchema,
  assignTransportSchema,
  updateTransportSchema,
} from "../../../../validations/Module/TransportDashboard/assignTransportStudentValidation";

export const assignTransport = async (
  req: Request,
  res: Response,
  next: NextFunction
) :Promise<any> => {
  const paramResult = studentIdParamSchema.safeParse(req.params);
  const bodyResult = assignTransportSchema.safeParse(req.body);

  if (!paramResult.success || !bodyResult.success) {
    return res.status(400).json({
      error: [
        ...(paramResult.success ? [] : paramResult.error.errors),
        ...(bodyResult.success ? [] : bodyResult.error.errors),
      ],
    });
  }

  const { studentId } = paramResult.data;
  const { busId, routeId, busStopId } = bodyResult.data;

  try {
    const student = await prisma.student.update({
      where: { id: studentId },
      data: { busId, routeId, busStopId },
    });
    res.json(student);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getTransportDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const paramResult = studentIdParamSchema.safeParse(req.params);
  if (!paramResult.success) {
    return res.status(400).json({ error: paramResult.error.errors });
  }
  const { studentId } = paramResult.data;

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { id: true, busId: true, routeId: true, busStopId: true },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateTransport = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const paramResult = studentIdParamSchema.safeParse(req.params);
  const bodyResult = updateTransportSchema.safeParse(req.body);

  if (!paramResult.success || !bodyResult.success) {
    return res.status(400).json({
      error: [
        ...(paramResult.success ? [] : paramResult.error.errors),
        ...(bodyResult.success ? [] : bodyResult.error.errors),
      ],
    });
  }

  const { studentId } = paramResult.data;
  const { busId, routeId, busStopId } = bodyResult.data;

  try {
    const student = await prisma.student.update({
      where: { id: studentId },
      data: { busId, routeId, busStopId },
    });

    res.json(student);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const removeTransport = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const paramResult = studentIdParamSchema.safeParse(req.params);
  if (!paramResult.success) {
    return res.status(400).json({ error: paramResult.error.errors });
  }
  const { studentId } = paramResult.data;

  try {
    const student = await prisma.student.update({
      where: { id: studentId },
      data: { busId: null, routeId: null, busStopId: null },
    });

    res.json({ message: "Transport details removed successfully" , student});
  } catch (error) {
    next(handlePrismaError(error));
  }
};
