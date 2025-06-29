import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createConductorSchema,
  updateConductorSchema,
  assignConductorSchema,
  conductorIdParamSchema,
} from "../../../../validations/Module/TransportDashboard/conductorValidation";

// Create a Conductor
export const createConductor = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const result = createConductorSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const { name, busId, schoolId } = result.data;
  try {
    const conductor = await prisma.conductor.create({
      data: { name, busId, schoolId },
    });
    res.status(201).json(conductor);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get All Conductors
export const getConductors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conductors = await prisma.conductor.findMany({
      include: { bus: true, school: true },
    });
    res.json(conductors);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Conductor by ID
export const getConductor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const paramsResult = conductorIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { id } = paramsResult.data;
  try {
    const conductor = await prisma.conductor.findUnique({
      where: { id },
      include: { bus: true, school: true },
    });
    if (!conductor) return res.status(404).json({ error: "Conductor not found" });
    res.json(conductor);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Assign a Conductor to a Bus
export const assignConductorToBus = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const result = assignConductorSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const { busId, conductorId } = result.data;
  try {
    const conductor = await prisma.conductor.update({
      where: { id: conductorId },
      data: { busId },
    });
    res.json(conductor);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update Conductor Details
export const updateConductor = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const paramsResult = conductorIdParamSchema.safeParse(req.params);
  const bodyResult = updateConductorSchema.safeParse(req.body);

  if (!paramsResult.success || !bodyResult.success) {
    return res.status(400).json({
      error: [
        ...(paramsResult.success ? [] : paramsResult.error.errors),
        ...(bodyResult.success ? [] : bodyResult.error.errors),
      ],
    });
  }

  const { id } = paramsResult.data;
  const { name, busId, schoolId } = bodyResult.data;
  try {
    const conductor = await prisma.conductor.update({
      where: { id },
      data: { name, busId, schoolId },
    });
    res.json(conductor);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete a Conductor
export const deleteConductor = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const paramsResult = conductorIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { id } = paramsResult.data;
  try {
    await prisma.conductor.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
