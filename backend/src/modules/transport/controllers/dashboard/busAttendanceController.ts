import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
// import { io } from "../../../index";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createBusAttendanceSchema,
  updateBusAttendanceSchema,
  attendanceIdParamSchema,
  busAttendanceStudentParamSchema,
} from "../../../../validations/Module/TransportDashboard/busAttendanceValidation";

export const recordAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const result = createBusAttendanceSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const { studentId, busId, status } = result.data;
  
  try {
    const attendance = await prisma.busAttendance.create({
      data: { studentId, busId, status, date: new Date() },
    });

    // io.emit("attendanceUpdate", attendance); // Emit real-time update
    res.status(201).json(attendance);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attendance = await prisma.busAttendance.findMany({
      include: { student: true, bus: true },
    });

    res.json(attendance);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const getAttendanceByStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const paramsResult = busAttendanceStudentParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { studentId } = paramsResult.data;
  
  try {
    const attendance = await prisma.busAttendance.findMany({
      where: { studentId },
      include: { bus: true },
    });

    res.json(attendance);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const updateAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const paramsResult = attendanceIdParamSchema.safeParse(req.params);
  const bodyResult = updateBusAttendanceSchema.safeParse(req.body);

  if (!paramsResult.success || !bodyResult.success) {
    return res.status(400).json({
      error: [
        ...(paramsResult.success ? [] : paramsResult.error.errors),
        ...(bodyResult.success ? [] : bodyResult.error.errors),
      ],
    });
  }

  const { attendanceId } = paramsResult.data;
  const { status } = bodyResult.data;

  try {
    const attendance = await prisma.busAttendance.update({
      where: { id: attendanceId },
      data: { status },
    });

    // io.emit("attendanceUpdate", attendance); // Emit real-time update
    res.json(attendance);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

export const deleteAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const paramsResult = attendanceIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { attendanceId } = paramsResult.data;

  try {
    await prisma.busAttendance.delete({ where: { id: attendanceId } });

    // io.emit("attendanceUpdate", { attendanceId, deleted: true });
    res.json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    next(handlePrismaError(error));
  }
};


