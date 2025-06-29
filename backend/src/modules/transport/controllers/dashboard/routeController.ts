import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import { handlePrismaError } from "../../../../utils/prismaErrorHandler";
import {
  createRouteSchema,
  updateRouteSchema,
  routeIdParamSchema,
  routeSchoolIdParamSchema,
} from "../../../../validations/Module/TransportDashboard/routeValidation";

// Create Route
export const createRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const result = createRouteSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const { name, busId, schoolId } = result.data;
  try {
    const route = await prisma.route.create({
      data: { name, busId, schoolId },
    });
    res.status(201).json(route);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get All Routes
export const getRoutes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const routes = await prisma.route.findMany({
      include: { bus: true, school: true, busStops: true },
    });
    res.json(routes);
  } catch (error) {
    next(handlePrismaError(error));
  }
};


// Get Routes by School ID

export const getRoutesBySchoolId = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const paramsResult = routeSchoolIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { schoolId } = paramsResult.data;
  try {
    const routes = await prisma.route.findMany({
      where: { schoolId },
      include: { bus: true, school: true, busStops: true },
    });
    res.json(routes);
  } catch (error) {
    next(handlePrismaError(error));
  }
};
// Get Route by ID
export const getRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const paramsResult = routeIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { id } = paramsResult.data;
  try {
    const route = await prisma.route.findUnique({
      where: { id },
      include: { bus: true, school: true, busStops: true },
    });
    if (!route) return res.status(404).json({ error: "Route not found" });
    res.json(route);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update Route
export const updateRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) :Promise<any>=> {
  const paramsResult = routeIdParamSchema.safeParse(req.params);
  const bodyResult = updateRouteSchema.safeParse(req.body);

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
    const route = await prisma.route.update({
      where: { id },
      data: { name, busId, schoolId },
    });
    res.json(route);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete Route
export const deleteRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) :Promise<any>=> {
  const paramsResult = routeIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { id } = paramsResult.data;
  try {
    await prisma.route.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};
