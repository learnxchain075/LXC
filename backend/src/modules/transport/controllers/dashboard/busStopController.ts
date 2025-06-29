import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createBusStopSchema,
  updateBusStopSchema,
  busStopIdParamSchema,
  busStopSchoolIdParamSchema,
} from "../../../../validations/Module/TransportDashboard/busStopValidation";

// Create a Bus Stop
export const createBusStop = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const result = createBusStopSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const { name, location, routeId, schoolId } = result.data;
  try {
    const busStop = await prisma.busStop.create({
      data: { name, location, routeId, schoolId },
    });
    res.status(201).json(busStop);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all Bus Stops
export const getBusStops = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const busStops = await prisma.busStop.findMany({
      include: { route: true, school: true },
    });
    res.json(busStops);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Bus Stop by ID
export const getBusStop = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const paramsResult = busStopIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { id } = paramsResult.data;
  try {
    const busStop = await prisma.busStop.findUnique({
      where: { id },
      include: { route: true, school: true },
    });
    if (!busStop) return res.status(404).json({ error: "Bus Stop not found" });
    res.json(busStop);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update Bus Stop
export const updateBusStop = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const paramsResult = busStopIdParamSchema.safeParse(req.params);
  const bodyResult = updateBusStopSchema.safeParse(req.body);

  if (!paramsResult.success || !bodyResult.success) {
    return res.status(400).json({
      error: [
        ...(paramsResult.success ? [] : paramsResult.error.errors),
        ...(bodyResult.success ? [] : bodyResult.error.errors),
      ],
    });
  }

  const { id } = paramsResult.data;
  const { name, location, routeId } = bodyResult.data;
  try {
    const busStop = await prisma.busStop.update({
      where: { id },
      data: { name, location, routeId },
    });
    res.json(busStop);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete Bus Stop
export const deleteBusStop = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const paramsResult = busStopIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { id } = paramsResult.data;
  try {
    await prisma.busStop.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};


// Get all Bus Stops by School ID

export const getBusStopsBySchoolId = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const paramsResult = busStopSchoolIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { schoolId } = paramsResult.data;
  try {
    const busStops = await prisma.busStop.findMany({
      where: { schoolId },
      include: { route: true, school: true },
    });
    res.json(busStops);
  } catch (error) {
    next(handlePrismaError(error));
  }
};