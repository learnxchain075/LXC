import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createDriverSchema,
  updateDriverSchema,
  assignDriverSchema,
  driverIdParamSchema,
  driverSchoolIdParamSchema,
} from "../../../../validations/Module/TransportDashboard/driverValidation";

// Create a Driver
export const createDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const result = createDriverSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const { name, license, busId, schoolId } = result.data;
  try {
    const driver = await prisma.driver.create({
      data: { name, license, busId, schoolId },
    });
    res.status(201).json(driver);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all Drivers
export const getDrivers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const drivers = await prisma.driver.findMany({
      include: { bus: true, school: true },
    });
    res.json(drivers);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Drivers by School ID

export const getDriversBySchoolId = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const paramsResult = driverSchoolIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { schoolId } = paramsResult.data;
  try {
    const drivers = await prisma.driver.findMany({
      where: { schoolId },
      include: { bus: true, school: true },
    });
    res.json(drivers);
  } catch (error) {
    next(handlePrismaError(error));
  }
};


// Get Driver by ID
export const getDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const paramsResult = driverIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { id } = paramsResult.data;
  try {
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: { bus: true, school: true },
    });
    if (!driver) return res.status(404).json({ error: "Driver not found" });
    res.json(driver);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Assign Driver to a Bus
export const assignDriverToBus = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const result = assignDriverSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const { busId, driverId } = result.data;
  try {
    const driver = await prisma.driver.update({
      where: { id: driverId },
      data: { busId },
    });
    res.json(driver);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update Driver Details
export const updateDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const paramsResult = driverIdParamSchema.safeParse(req.params);
  const bodyResult = updateDriverSchema.safeParse(req.body);

  if (!paramsResult.success || !bodyResult.success) {
    return res.status(400).json({
      error: [
        ...(paramsResult.success ? [] : paramsResult.error.errors),
        ...(bodyResult.success ? [] : bodyResult.error.errors),
      ],
    });
  }

  const { id } = paramsResult.data;
  const { name, license, busId, schoolId } = bodyResult.data;
  try {
    const driver = await prisma.driver.update({
      where: { id },
      data: { name, license, busId, schoolId },
    });
    res.json(driver);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete a Driver
export const deleteDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const paramsResult = driverIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { id } = paramsResult.data;
  try {
    await prisma.driver.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
