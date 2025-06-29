import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createPickUpPointSchema,
  updatePickUpPointSchema,
  pickUpPointIdParamSchema,
  pickUpPointSchoolIdParamSchema,
} from "../../../../validations/Module/TransportDashboard/busPickupValidation";

// Create Pickup point

export const createPickupPoint = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const result = createPickUpPointSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const { name, location, routeId, schoolId } = result.data;
  try {
    const pickupPoint = await prisma.pickUpPoint.create({
      data: { name, location, routeId, schoolId },
    });
    res.status(201).json(pickupPoint);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get Pickup pint by id

export const getPickupPoint = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const paramsResult = pickUpPointIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { id } = paramsResult.data;
  try {
    const pickupPoint = await prisma.pickUpPoint.findUnique({
      where: { id },
      include: { route: true, school: true },
    });
    if (!pickupPoint) return res.status(404).json({ error: "Pickup Point not found" });
    res.json(pickupPoint);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get ALl Pickup points of a School

export const getPickupPointsBySchool = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const paramsResult = pickUpPointSchoolIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { schoolId } = paramsResult.data;
  try {
    const pickupPoints = await prisma.pickUpPoint.findMany({
      where: { schoolId },
      include: { route: true, school: true },
    });
    res.json(pickupPoints);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update Pickup point

export const updatePickupPoint = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const paramsResult = pickUpPointIdParamSchema.safeParse(req.params);
  const bodyResult = updatePickUpPointSchema.safeParse(req.body);

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
    const pickupPoint = await prisma.pickUpPoint.update({
      where: { id },
      data: { name, location, routeId },
    });
    res.json(pickupPoint);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete Pickup point

export const deletePickupPoint = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const paramsResult = pickUpPointIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { id } = paramsResult.data;
  try {
    await prisma.pickUpPoint.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
