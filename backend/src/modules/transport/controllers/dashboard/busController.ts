import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createBusSchema,
  updateBusSchema,
  busIdParamSchema,
  busSchoolIdParamSchema,
} from "../../../../validations/Module/TransportDashboard/busValidation";


// Create a Bus 


export const createBus = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const result = createBusSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const { busNumber, capacity, schoolId } = result.data;
  try {
    const bus = await prisma.bus.create({
      data: { busNumber, capacity, schoolId },
    });
    res.status(201).json(bus);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all Buses

export const getBuses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const buses = await prisma.bus.findMany({ include: { school: true } });
    res.json(buses);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Buseby id 
export const getBus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const paramsResult = busIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { id } = paramsResult.data;
  try {
    const bus = await prisma.bus.findUnique({ where: { id }, include: { school: true } });
    if (!bus) return res.status(404).json({ error: "Bus not found" });
    res.json(bus);
  } catch (error) {
    next(handlePrismaError(error));
  }
};


//  Updata Bus

export const updateBus = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const paramsResult = busIdParamSchema.safeParse(req.params);
  const bodyResult = updateBusSchema.safeParse(req.body);

  if (!paramsResult.success || !bodyResult.success) {
    return res.status(400).json({
      error: [
        ...(paramsResult.success ? [] : paramsResult.error.errors),
        ...(bodyResult.success ? [] : bodyResult.error.errors),
      ],
    });
  }

  const { id } = paramsResult.data;
  const { busNumber, capacity } = bodyResult.data;
  try {
    const bus = await prisma.bus.update({
      where: { id },
      data: { busNumber, capacity },
    });
    res.json(bus);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
// delete bus 
export const deleteBus = async (
  req: Request,
  res: Response,
  next: NextFunction
) :Promise<any>=> {
  const paramsResult = busIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { id } = paramsResult.data;
  try {
    await prisma.bus.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};


// Get all buses by school ID

export const getBusesBySchoolId = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const paramsResult = busSchoolIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { schoolId } = paramsResult.data;
  try {
    const buses = await prisma.bus.findMany({ where: { schoolId } });
    res.json(buses);
  } catch (error) {
    next(handlePrismaError(error));
  }
};